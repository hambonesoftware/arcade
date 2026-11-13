import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
test('the community is linked in the real homepage and has real forms', () => {
  assert.match(read('index.html'), /href="\.\/community\/"/);
  const page = read('community/index.html');
  for (const id of ['suggestForm', 'suggestDialog', 'ideaList', 'pollOptions', 'roadmapList', 'formTurnstileBox']) {
    assert.ok(page.includes('id="' + id + '"'), 'Missing ' + id);
  }
});
test('community does not pretend to store votes when the backend is missing', () => {
  assert.match(read('community/config.js'), /HAMBONE_COMMUNITY_API = ""/);
  assert.match(read('community/app.js'), /Community voting is being connected/);
  assert.match(read('community/app.js'), /turnstile\.getResponse/);
});
test('the offline packaging includes the community shell but excludes API responses', () => {
  const script = read('scripts/package_offline_games.py');
  const serviceWorker = read('sw.js');
  assert.match(script, /"community"/);
  assert.match(serviceWorker, /\.\/community\/index\.html/);
  assert.doesNotMatch(serviceWorker, /https:\/\/[^'"]+workers\.dev/);
});
