/* End-to-end offline download, update, and offline launch regression test.
   Runs on the built Arcade site using Chromium's mobile viewport. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep, join } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('_site');
const rawCatalog = JSON.parse(await readFile(join(root, 'game-packages.json'), 'utf8'));
// Several launch entries share one pack (RC racing, REDLINE), so the two counts differ.
const GAMES = Object.keys(rawCatalog.games).length;
const PACKS = Object.keys(rawCatalog.packages).length;
let forcedCatalog = null;
const types = {
  '.html':'text/html', '.js':'application/javascript', '.mjs':'application/javascript',
  '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json',
  '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg',
  '.glb':'model/gltf-binary', '.wasm':'application/wasm',
  '.unityweb':'application/octet-stream',
};

const server = createServer(async (req, res) => {
  try {
    let pathname = new URL(req.url, 'http://localhost/').pathname;
    if (!pathname.startsWith('/arcade/')) {
      res.writeHead(404); res.end('not found'); return;
    }
    pathname = decodeURIComponent(pathname.slice('/arcade/'.length));
    if (pathname === '') pathname = 'index.html';
    let path = resolve(root, pathname);
    if (relative(root,path).startsWith('..' + sep) || relative(root,path) === '..') {
      res.writeHead(403); res.end('forbidden'); return;
    }
    const info = await stat(path).catch(() => null);
    if (info && info.isDirectory()) path = join(path, 'index.html');
    if (pathname === 'game-packages.json' && forcedCatalog) {
      res.writeHead(200, {'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify(forcedCatalog)); return;
    }
    const data = await readFile(path);
    const extension = path.match(/\.[^.]+$/)?.[0] || '';
    res.writeHead(200, {'Content-Type':types[extension] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(data);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});
await new Promise(resolveServer => server.listen(0, '127.0.0.1', resolveServer));
const address = server.address();
const origin = 'http://127.0.0.1:' + address.port;
const base = origin + '/arcade/';
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2,hasTouch:true});
const page = await context.newPage();
try {
  await page.goto(base, {waitUntil:'domcontentloaded'});
  await page.waitForFunction(text => document.getElementById('offlineSummary')?.textContent.includes(text), PACKS + ' game packs', {timeout:30000});
  const count = await page.locator('.project-card').count();
  assert.equal(count, GAMES, `Expected all ${GAMES} playable entries`);

  await page.locator('[data-package="colony"] [data-install]').click();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-package="colony"] .status')]
    .some(item => item.textContent.includes('Offline ready')), {timeout:30000});

  const installed = await page.evaluate(async () =>
    (await caches.keys()).filter(name => name.startsWith('hambone-game-v1-colony-')));
  assert.equal(installed.length, 1, 'Colony should have one completed cache');

  // Local storage represents persistent progress: only game assets are replaced.
  await page.evaluate(() => localStorage.setItem('hb-test-progress', 'keep-saves'));
  await context.setOffline(true);
  await page.goto(base + 'simant/', {waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => Boolean(window.ColonyEngine), {timeout:12000});
  assert.match(await page.title(), /Colony|First Light|SimAnt/i);
  await page.goto(base, {waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.project-card').count(), GAMES);
  assert.equal(await page.evaluate(() => localStorage.getItem('hb-test-progress')), 'keep-saves');

  // Simulate a newly published game revision. The UI must show Update, not
  // erase old working files or user data, before installing the new version.
  await context.setOffline(false);
  forcedCatalog = structuredClone(rawCatalog);
  forcedCatalog.packages.colony.version = 'f'.repeat(16);
  await page.locator('#checkUpdates').click();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-package="colony"] .status')]
    .some(item => item.textContent.includes('Update available')), {timeout:12000});
  await page.locator('[data-package="colony"] [data-install]').click();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-package="colony"] .status')]
    .some(item => item.textContent.includes('Offline ready')), {timeout:30000});
  assert.equal(await page.evaluate(() => localStorage.getItem('hb-test-progress')), 'keep-saves');
  const after = await page.evaluate(async () =>
    (await caches.keys()).filter(name => name.startsWith('hambone-game-v1-colony-')));
  assert.equal(after.length, 1, 'Old package cache should be cleaned only after update');
  assert.match(after[0], /ffffffffffffffff$/);

  await page.locator('[data-package="colony"] [data-remove]').click();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-package="colony"] .status')]
    .some(item => item.textContent.includes('Online only')), {timeout:12000});
  const removed = await page.evaluate(async () =>
    (await caches.keys()).filter(name => name.startsWith('hambone-game-v1-colony-')));
  assert.equal(removed.length, 0, 'Removing a package only deletes its offline assets');
  assert.equal(await page.evaluate(() => localStorage.getItem('hb-test-progress')), 'keep-saves');
  // Validate the complete collection, not only the smallest sample game.
  forcedCatalog = null;
  await page.locator('#checkUpdates').click();
  await page.locator('#downloadAll').click();
  await page.waitForFunction(text => document.getElementById('offlineSummary')?.textContent.includes(text), `${PACKS} of ${PACKS} game packs downloaded`, {timeout:240000});
  const offlineCaches = await page.evaluate(async () =>
    (await caches.keys()).filter(name => name.startsWith('hambone-game-v1-')));
  assert.equal(offlineCaches.length, PACKS, `All ${PACKS} game packages should be installed`);

  await context.setOffline(true);
  for (const game of Object.values(rawCatalog.games)) {
    const response = await page.goto(base + game.entry, {waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response.status(), 200, 'Installed game should navigate offline: ' + game.entry);
    await page.waitForSelector('#hamboneReturn', {timeout:10000});
    const failurePage = await page.locator('h1').filter({hasText:'Download this game first'}).count();
    assert.equal(failurePage, 0, 'Game was not served from cache: ' + game.entry);
    console.log('Offline open:', game.entry);
  }
  await page.goto(base, {waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.project-card').count(), GAMES);
  assert.equal(await page.evaluate(() => localStorage.getItem('hb-test-progress')), 'keep-saves');
  console.log(`PASS: all ${GAMES} game routes open offline from ${PACKS} downloaded packs; updates/removal preserve local data`);
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
