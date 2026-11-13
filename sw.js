/* Hambone Arcade: explicit, versioned offline game installation. */
'use strict';

const SCOPE = self.registration.scope;
const SHELL_CACHE = 'hambone-shell-v4';
const GAME_PREFIX = 'hambone-game-v1-';
const INDEX_URL = new URL('game-packages.json', SCOPE).href;
const CORE_FILES = [
  './', './index.html', './app.js', './styles.css',
  './manifest.webmanifest', './favicon.png', './apple-touch-icon.png',
  './icons/icon-192.png', './icons/icon-512.png',
  './offline-return.js',
  './community/', './community/index.html', './community/app.js',
  './community/styles.css', './community/config.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    await shell.addAll(CORE_FILES.map(path => new URL(path, SCOPE)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key =>
      key.startsWith('hambone-shell-') && key !== SHELL_CACHE
    ).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function getCatalog() {
  const storage = await caches.open(SHELL_CACHE);
  try {
    const result = await fetch(INDEX_URL, {cache: 'no-store'});
    if (!result.ok) throw new Error('Game catalog HTTP ' + result.status);
    const data = await result.clone().json();
    if (data.schema !== 1 || !data.packages || !data.games) {
      throw new Error('Unsupported game catalog');
    }
    await storage.put(INDEX_URL, result.clone());
    return data;
  } catch (error) {
    const fallback = await storage.match(INDEX_URL);
    if (!fallback) throw new Error('Package catalog unavailable while offline');
    return fallback.json();
  }
}

function packageCacheName(id, version) {
  if (!/^[a-z0-9-]+$/.test(id) || !/^[a-z0-9]+$/.test(version)) {
    throw new Error('Invalid package identifier');
  }
  return GAME_PREFIX + id + '-' + version;
}

function markerUrl(id) {
  return new URL('offline-installed/' + id, SCOPE).href;
}

async function installedVersions() {
  const keys = (await caches.keys()).filter(key => key.startsWith(GAME_PREFIX));
  const versions = {};
  for (const key of keys) {
    const cache = await caches.open(key);
    // The marker is written only after every asset is saved successfully.
    const match = key.slice(GAME_PREFIX.length).match(/^([a-z0-9-]+)-([a-f0-9]{16})$/);
    if (!match) continue;
    const marker = await cache.match(markerUrl(match[1]));
    if (marker) versions[match[1]] = match[2];
  }
  return versions;
}

async function removePackage(id) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Invalid package identifier');
  const prefix = GAME_PREFIX + id + '-';
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith(prefix)).map(key => caches.delete(key)));
}

async function downloadPackage(id, inform) {
  const catalog = await getCatalog();
  const pkg = catalog.packages[id];
  if (!pkg || !Array.isArray(pkg.files) || !pkg.files.length) {
    throw new Error('No playable package exists for ' + id);
  }
  const cacheName = packageCacheName(id, pkg.version);
  const previous = (await installedVersions())[id];
  if (previous === pkg.version) {
    inform({type:'DONE', id, version:pkg.version, alreadyInstalled:true});
    return;
  }

  // Do not delete the previous working release unless the new release is complete.
  const storage = await caches.open(cacheName);
  const expectedRoot = id === 'colony' ? 'simant/' : 'games/';
  let completed = 0;
  try {
    for (const asset of pkg.files) {
      if (typeof asset !== 'string' || !asset.startsWith(expectedRoot) || asset.includes('..') || asset.startsWith('/')) {
        throw new Error('Unexpected asset path: ' + asset);
      }
      const url = new URL(asset, SCOPE);
      if (!url.href.startsWith(SCOPE)) throw new Error('Asset is outside Arcade');
      // Use cache:no-store to avoid retaining an old build behind a new version.
      const response = await fetch(url, {cache:'no-store'});
      if (!response.ok || response.type === 'opaque') {
        throw new Error('Missing asset (' + response.status + '): ' + asset);
      }
      await storage.put(url, response);
      completed++;
      inform({type:'PROGRESS', id, completed, total:pkg.files.length, bytes:pkg.bytes || 0});
    }
    await storage.put(markerUrl(id), new Response(
      JSON.stringify({id, version:pkg.version, savedAt:Date.now()}),
      {headers:{'Content-Type':'application/json'}}
    ));
    const prefix = GAME_PREFIX + id + '-';
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    inform({type:'DONE', id, version:pkg.version, completed, total:pkg.files.length});
  } catch (error) {
    await caches.delete(cacheName);
    throw error;
  }
}

self.addEventListener('message', event => {
  const message = event.data || {};
  const port = event.ports && event.ports[0];
  if (!port) return;
  const send = payload => port.postMessage(payload);
  event.waitUntil((async () => {
    try {
      if (message.type === 'STATUS') {
        const [catalog, installed] = await Promise.all([getCatalog(), installedVersions()]);
        send({type:'STATUS', catalog, installed});
      } else if (message.type === 'DOWNLOAD') {
        await downloadPackage(message.id, send);
      } else if (message.type === 'REMOVE') {
        await removePackage(message.id);
        send({type:'REMOVED', id:message.id});
      } else if (message.type === 'REFRESH') {
        const catalog = await getCatalog();
        const installed = await installedVersions();
        send({type:'STATUS', catalog, installed});
      } else {
        throw new Error('Unknown offline action');
      }
    } catch (error) {
      send({type:'ERROR', id:message.id || null, message:error && error.message ? error.message : String(error)});
    } finally {
      port.close();
    }
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;
  event.respondWith((async () => {
    const cachedGame = await caches.match(request, {ignoreSearch:true});
    // Explicitly installed games are pinned until the user selects Update.
    if (cachedGame && (url.pathname.includes('/games/') || url.pathname.includes('/simant/'))) {
      return cachedGame;
    }

    const isShell = !url.pathname.includes('/games/') && !url.pathname.includes('/simant/');
    if (isShell) {
      try {
        const response = await fetch(request);
        if (response.ok && url.pathname !== new URL('game-packages.json', SCOPE).pathname) {
          const storage = await caches.open(SHELL_CACHE);
          storage.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (error) {
        return cachedGame || (await caches.match(request, {ignoreSearch:true})) ||
          (request.mode === 'navigate'
            ? (await caches.match(new URL('index.html', SCOPE))) :
              Response.error());
      }
    }

    try {
      return await fetch(request);
    } catch (error) {
      if (cachedGame) return cachedGame;
      if (request.mode === 'navigate') {
        return new Response(
          '<!doctype html><html><meta name="viewport" content="width=device-width"><title>Game not installed</title><body style="font:18px system-ui;background:#0b1020;color:#fff8ed;padding:3rem"><h1>Download this game first</h1><p>This game is not installed for offline play.</p><a style="color:#a1f0d2" href="../">Return to Hambone Arcade</a></body></html>',
          {status:503, headers:{'Content-Type':'text/html; charset=utf-8'}}
        );
      }
      return Response.error();
    }
  })());
});
