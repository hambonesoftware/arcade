'use strict';

/*
 * Hambone Arcade project catalog.
 * Only playable browser games belong in this curated catalog.
 * Project URL overrides are used for game-specific pages or build branches.
 * Keep the exact repository casing when adding a new game.
 */
const PROJECTS = [
  {
    "id": "willowbend",
    "repo": "willowbend",
    "title": "Willowbend",
    "category": "Worlds",
    "type": "Cozy village adventure",
    "description": "Wander a cel-shaded chibi village, chat with the neighbors, then follow the paths past the farm and creek to the woods, an old watchtower, and Echo Cave.",
    "emoji": "🏡",
    "sideEmoji": "🐸",
    "colors": [
      "#8ed35f",
      "#3fa7a0",
      "#ffe59a"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "trashpanda",
    "repo": "trash-panda-heist",
    "title": "Trash Panda Heist",
    "category": "Arcade",
    "type": "Slingshot maze heist",
    "description": "Play a raccoon raiding the alley's trash cans Lode Runner-style, then slingshot your haul at the boxes stacked on the dumpster before the night crew spots you. Every meal moves the clock six hours.",
    "emoji": "🦝",
    "sideEmoji": "🗑️",
    "colors": [
      "#7a4386",
      "#2a2266",
      "#ff4f7a"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "trashrac",
    "repo": "trash-rac-unity",
    "title": "Trash Rac: Back Alley Rumble",
    "category": "Arcade",
    "type": "Unity slingshot arcade",
    "description": "A cel-shaded raccoon, a dumpster, and far too many boxes. Fling trash, topple the stacks, and duck when the store crew comes out back.",
    "emoji": "🦝",
    "sideEmoji": "📦",
    "colors": [
      "#c27a45",
      "#2f2a4a",
      "#ffd27a"
    ],
    "playable": true
  },
  {
    "id": "stonyunity",
    "repo": "stony-creek-unity",
    "title": "Stony Creek Explorer: Unity",
    "category": "Worlds",
    "type": "Unity park exploration",
    "description": "Walk Stony Creek Metropark on real USGS terrain and OpenStreetMap trails, through 240,000 trees, with a GTA-style radar and map.",
    "emoji": "🌳",
    "sideEmoji": "🗺️",
    "colors": [
      "#5f9a52",
      "#26445f",
      "#cfe8a0"
    ],
    "playable": true
  },
  {
    "id": "garagegauntlet",
    "repo": "garage-gauntlet",
    "title": "Garage Gauntlet: Railway Rush",
    "category": "Racing",
    "type": "Unity slot-car racing",
    "description": "Race die-cast slot cars through a miniature railway town. Manage the trigger, master the curves, and dodge the train crossing.",
    "emoji": "🏎️",
    "sideEmoji": "🚂",
    "colors": [
      "#d18c51",
      "#463c70",
      "#ffdd91"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "colony",
    "repo": "arcade",
    "url": "https://hambonesoftware.github.io/arcade/simant/",
    "sourcePath": "/tree/main/simant",
    "title": "Colony: First Light",
    "category": "Strategy",
    "type": "Ant colony RTS",
    "description": "Dig tunnels, gather food, train defenders, survive an enemy raid, and claim territory above and below the ground.",
    "emoji": "🐜",
    "sideEmoji": "🌿",
    "colors": [
      "#88ad63",
      "#2c4c37",
      "#f4d478"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "maplejunction",
    "repo": "rcCars",
    "url": "https://hambonesoftware.github.io/rcCars/maple-junction.html",
    "title": "Maple Junction Loop",
    "category": "Racing",
    "type": "Miniature town racing",
    "description": "Race three laps through a tiny HO railway town filled with shops, scenic hills, winding streets, and moving trains.",
    "emoji": "🏘️",
    "sideEmoji": "🚙",
    "colors": [
      "#a3a878",
      "#345d59",
      "#e8dda9"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "microbackyard",
    "repo": "rcCars",
    "title": "Micro Mayhem: Backyard Blitz",
    "category": "Racing",
    "type": "3D RC buggy racing",
    "description": "Boost a miniature RC buggy around a giant backyard, hit the jumps, and challenge three AI rivals.",
    "emoji": "🚙",
    "sideEmoji": "🌳",
    "colors": [
      "#c88758",
      "#37626e",
      "#fae18b"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "microcanyon",
    "repo": "rcCars",
    "url": "https://hambonesoftware.github.io/rcCars/canyon-circuit.html",
    "title": "Micro Mayhem: Canyon Thunder",
    "category": "Racing",
    "type": "3D stunt racing",
    "description": "Race 3D RC trucks through a banked canyon circuit with big jumps, four sectors, and a two-lap finish.",
    "emoji": "🏜️",
    "sideEmoji": "🏁",
    "colors": [
      "#dd8e54",
      "#344e65",
      "#ffd48d"
    ],
    "playable": true
  },
  {
    "id": "hopshift",
    "repo": "hopshift",
    "url": "https://hambonesoftware.github.io/hopshift/course-concept.html",
    "title": "HopShift",
    "category": "Platformer",
    "type": "Flip-and-slide platformer",
    "description": "Run and jump as Kip the little cube, flip onto your head, slide beneath machinery, and ride moving platforms.",
    "emoji": "🟨",
    "sideEmoji": "🤸",
    "colors": [
      "#b268dc",
      "#3f4da8",
      "#ffd66c"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "marblemerge",
    "repo": "marbleMerge",
    "url": "https://hambonesoftware.github.io/marbleMerge/v2/",
    "title": "Marble Merge Grand Prix",
    "category": "Racing",
    "type": "3D physics marble racing",
    "description": "Follow colorful marbles through a huge wooden downhill course with funnels, drops, and moving obstacles.",
    "emoji": "🔮",
    "sideEmoji": "🏁",
    "colors": [
      "#3b92b4",
      "#292d72",
      "#8fddff"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "facesandheels",
    "repo": "faces-and-heels",
    "title": "Faces & Heels",
    "category": "Arcade",
    "type": "Turn-based wrestling",
    "description": "Choose Stone or Viper, call the moves, roll the dice, escape submissions, and land your signature finisher.",
    "emoji": "🤼",
    "sideEmoji": "🏆",
    "colors": [
      "#d45170",
      "#612c72",
      "#ffa982"
    ],
    "playable": true,
    "featured": true
  },
  {
    "id": "football",
    "repo": "old-school-football",
    "title": "Old School Football",
    "category": "Arcade",
    "type": "Retro football challenge",
    "description": "Snap the ball, juke the defense, break tackles, and drive toward the end zone with tiny blocky players.",
    "emoji": "🏈",
    "sideEmoji": "⚡",
    "colors": [
      "#30956b",
      "#1e4d69",
      "#c6fb78"
    ],
    "playable": true
  },
  {
    "id": "apeironx",
    "repo": "apeironX",
    "title": "Apeiron X",
    "category": "Arcade",
    "type": "Retro creature shooter",
    "description": "Battle swarms of animated arcade critters in a fast-moving, colorful tribute to classic centipede-style action.",
    "emoji": "🐛",
    "sideEmoji": "💥",
    "colors": [
      "#3aaf81",
      "#142e61",
      "#92f5cb"
    ],
    "playable": true
  },
  {
    "id": "barrack",
    "repo": "Barrack",
    "title": "Barrack+",
    "category": "Arcade",
    "type": "Area-capture arcade",
    "description": "Draw walls, claim territory, dodge bouncing enemies, and collect bonuses in this browser-playable JezzBall-style game.",
    "emoji": "🟦",
    "sideEmoji": "⚡",
    "colors": [
      "#4a80e6",
      "#342a79",
      "#b3dcff"
    ],
    "playable": true
  },
  {
    "id": "sprayworks",
    "repo": "sprayworks",
    "title": "SprayWorks: Clockwork Crew",
    "category": "Worlds",
    "type": "Clockwork puzzle adventure",
    "description": "Lead a tiny crew, clean scattered gears, carry them across the workbench, and repair a giant mechanical clock.",
    "emoji": "⚙️",
    "sideEmoji": "🧑‍🔧",
    "colors": [
      "#9a55a8",
      "#342665",
      "#ffcb66"
    ],
    "playable": true
  },
  {
    "id": "mechanicalworld",
    "repo": "mechanicalWorld",
    "title": "Mechanical World: REDLINE",
    "category": "Physics",
    "type": "3D engineering challenge",
    "description": "Design and load-test beams in a virtual hydraulic laboratory. Find the limit and watch the structure fail.",
    "emoji": "🔩",
    "sideEmoji": "⚡",
    "colors": [
      "#c58b51",
      "#3b5e68",
      "#f8d29b"
    ],
    "playable": true
  },
  {
    "id": "engineeringcareer",
    "repo": "mechanicalWorld",
    "url": "https://hambonesoftware.github.io/mechanicalWorld/career.html",
    "title": "REDLINE: Engineering Career",
    "category": "Physics",
    "type": "Engineering career game",
    "description": "Take work orders and use virtual precision tools to measure 3D parts in an immersive engineering workstation.",
    "emoji": "📏",
    "sideEmoji": "🛠️",
    "colors": [
      "#4f879d",
      "#364259",
      "#b6eadf"
    ],
    "playable": true
  },
  {
    "id": "stony",
    "repo": "sunward",
    "title": "Stony Creek Explorer",
    "category": "Worlds",
    "type": "Open-world park exploration",
    "description": "Wander a Michigan park-inspired 3D world with trails, lakes, trees, and a first-person walking view.",
    "emoji": "🌲",
    "sideEmoji": "🧭",
    "colors": [
      "#4fa676",
      "#204e77",
      "#9af0ad"
    ],
    "playable": true
  }
];

const FILTERS = ['All', 'Racing', 'Arcade', 'Platformer', 'Strategy', 'Physics', 'Worlds'];

const STORAGE_KEY = 'hambone-arcade-favorites-v1';
const GITHUB_BASE = 'https://github.com/hambonesoftware/';
const PAGES_BASE = 'https://hambonesoftware.github.io/';

const grid = document.getElementById('projectGrid');
const filtersRoot = document.getElementById('filters');
const search = document.getElementById('search');
const favoritesOnlyButton = document.getElementById('favoritesOnly');
const countNode = document.getElementById('projectCount');
const emptyState = document.getElementById('emptyState');
const previewDialog = document.getElementById('previewDialog');
const previewFrame = document.getElementById('previewFrame');
const previewTitle = document.getElementById('previewTitle');
const previewOpen = document.getElementById('previewOpen');
const toast = document.getElementById('toast');

let activeFilter = 'All';
let favoriteMode = false;
let toastTimeout;
let favorites = loadFavorites();
let offlineCatalog = null;
let installedVersions = {};
let offlineRegistration = null;
let offlineBusy = new Set();
let progressByPackage = {};
let bulkBusy = false;

function packageInfo(project) {
  if (!offlineCatalog) return null;
  const game = offlineCatalog.games[project.id];
  const pkg = game && offlineCatalog.packages[game.package];
  return game && pkg ? {id:game.package, entry:game.entry, pkg:pkg} : null;
}

function packageState(info) {
  if (!info) return 'unknown';
  const installed = installedVersions[info.id];
  if (!installed) return 'not-installed';
  return installed === info.pkg.version ? 'installed' : 'update';
}

function arcadeUrl(path) {
  return new URL(path, new URL('./', location.href)).href;
}

function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(parsed) ? parsed.filter(function (id) {
      return PROJECTS.some(function (project) { return project.id === id; });
    }) : []);
  } catch (error) {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch (error) {
    announce('Favorites are available for this visit, but storage is unavailable.');
  }
}

function announce(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(function () { toast.classList.remove('visible'); }, 3000);
}

function projectUrl(project) {
  const info = packageInfo(project);
  if (info) return arcadeUrl(info.entry);
  if (project.url) return project.url;
  return PAGES_BASE + project.repo + '/';
}

function repoUrl(project) {
  return GITHUB_BASE + project.repo + (project.sourcePath || '');
}

function createFilters() {
  filtersRoot.replaceChildren();
  FILTERS.forEach(function (filter) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.textContent = filter;
    button.setAttribute('aria-pressed', String(filter === activeFilter));
    button.addEventListener('click', function () {
      activeFilter = filter;
      render();
    });
    filtersRoot.appendChild(button);
  });
}

function filteredProjects() {
  const query = search.value.toLocaleLowerCase().trim();
  return PROJECTS.filter(function (project) {
    const filterMatch = activeFilter === 'All' || project.category === activeFilter;
    const favoriteMatch = !favoriteMode || favorites.has(project.id);
    const words = [project.title, project.description, project.category, project.type, project.repo].join(' ').toLocaleLowerCase();
    return filterMatch && favoriteMatch && (!query || words.includes(query));
  });
}

function cardElement(project) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.id = project.id;
  card.style.setProperty('--tone-a', project.colors[0]);
  card.style.setProperty('--tone-b', project.colors[1]);
  card.style.setProperty('--tone-light', project.colors[2]);

  const art = document.createElement('div');
  art.className = 'project-art';
  art.setAttribute('aria-hidden', 'true');
  art.innerHTML = '<div class="art-grid"></div><div class="art-orbit"></div><div class="art-orbit two"></div><span class="art-emoji"></span><span class="art-emoji small"></span><span class="art-chip"></span>';
  art.querySelector('.art-emoji').textContent = project.emoji;
  art.querySelector('.art-emoji.small').textContent = project.sideEmoji;
  art.querySelector('.art-chip').textContent = project.featured ? '✦ Featured' : project.category;

  const heart = document.createElement('button');
  heart.type = 'button';
  heart.className = 'favorite-btn';
  heart.dataset.favorite = project.id;
  heart.setAttribute('aria-label', (favorites.has(project.id) ? 'Remove ' : 'Add ') + project.title + (favorites.has(project.id) ? ' from favorites' : ' to favorites'));
  heart.setAttribute('aria-pressed', String(favorites.has(project.id)));
  heart.textContent = favorites.has(project.id) ? '♥' : '♡';

  const info = document.createElement('div');
  info.className = 'project-info';
  const meta = document.createElement('div');
  meta.className = 'project-meta';
  const type = document.createElement('span');
  type.textContent = project.type;
  const status = document.createElement('span');
  const offline = packageInfo(project);
  const offlineState = packageState(offline);
  status.className = 'status' + (offlineState === 'installed' ? ' offline-installed' : offlineState === 'update' ? ' offline-outdated' : '');
  const progress = offline && progressByPackage[offline.id];
  status.textContent = progress !== undefined ? '↓ ' + progress + '% downloaded'
    : offlineState === 'installed' ? '✓ Offline ready'
    : offlineState === 'update' ? '↻ Update available'
    : offlineState === 'not-installed' ? '● Online only'
    : '● Browser';
  meta.append(type, status);
  const title = document.createElement('h3');
  title.textContent = project.title;
  const desc = document.createElement('p');
  desc.textContent = project.description;
  const actions = document.createElement('div');
  actions.className = 'project-actions';

  const primaryLink = document.createElement('a');
  primaryLink.className = 'card-link';
  primaryLink.href = projectUrl(project);
  primaryLink.target = offline ? '_self' : '_blank';
  primaryLink.rel = offline ? '' : 'noopener noreferrer';
  primaryLink.textContent = offline ? 'Open' : 'Play now';
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  arrow.setAttribute('aria-hidden', 'true');
  primaryLink.appendChild(arrow);
  actions.appendChild(primaryLink);

  const previewButton = document.createElement('button');
  previewButton.className = 'preview-btn';
  previewButton.type = 'button';
  previewButton.dataset.preview = project.id;
  previewButton.textContent = 'Preview';
  previewButton.setAttribute('aria-label', 'Preview ' + project.title);
  actions.appendChild(previewButton);

  if (offline) {
    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.className = 'offline-install';
    installButton.dataset.install = offline.id;
    installButton.disabled = offlineBusy.has(offline.id) || bulkBusy;
    installButton.textContent = offlineBusy.has(offline.id) ? 'Downloading…'
      : offlineState === 'update' ? 'Update'
      : offlineState === 'installed' ? 'Installed ✓' : '↓ Download';
    if (offlineState === 'installed') installButton.disabled = true;
    actions.appendChild(installButton);

    if (offlineState === 'installed' || offlineState === 'update') {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'offline-remove';
      removeButton.dataset.remove = offline.id;
      removeButton.textContent = 'Remove';
      removeButton.disabled = offlineBusy.has(offline.id) || bulkBusy;
      removeButton.setAttribute('aria-label', 'Remove offline files for ' + project.title);
      actions.appendChild(removeButton);
    }
    card.dataset.package = offline.id;
  }

  info.append(meta, title, desc, actions);
  card.append(art, heart, info);
  return card;
}

function render() {
  createFilters();
  favoritesOnlyButton.setAttribute('aria-pressed', String(favoriteMode));
  favoritesOnlyButton.querySelector('span:first-child').textContent = favoriteMode ? '♥' : '♡';
  const visible = filteredProjects();
  const fragment = document.createDocumentFragment();
  visible.forEach(function (project) { fragment.appendChild(cardElement(project)); });
  grid.replaceChildren(fragment);
  countNode.textContent = String(visible.length).padStart(2, '0');
  emptyState.hidden = visible.length !== 0;
}

function findProject(id) {
  return PROJECTS.find(function (project) { return project.id === id; });
}

function toggleFavorite(id) {
  const project = findProject(id);
  if (!project) return;
  if (favorites.has(id)) {
    favorites.delete(id);
    announce(project.title + ' removed from favorites.');
  } else {
    favorites.add(id);
    announce(project.title + ' saved to favorites.');
  }
  saveFavorites();
  render();
}

function surpriseMe() {
  const games = PROJECTS;
  if (!games.length) {
    announce('No browser games are available right now.');
    return;
  }
  const project = games[Math.floor(Math.random() * games.length)];
  location.assign(projectUrl(project));
}

function openPreview(id) {
  const project = findProject(id);
  if (!project) return;
  const url = projectUrl(project);
  previewTitle.textContent = project.title;
  previewOpen.href = url;
  previewFrame.title = project.title + ' browser preview';
  previewFrame.src = url;
  if (typeof previewDialog.showModal === 'function') {
    previewDialog.showModal();
    document.body.style.overflow = 'hidden';
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function closePreview() {
  if (previewDialog.open) previewDialog.close();
}

grid.addEventListener('click', function (event) {
  const install = event.target.closest('[data-install]');
  if (install) {
    installPackage(install.dataset.install);
    return;
  }
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    removeInstalledPackage(remove.dataset.remove);
    return;
  }
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    toggleFavorite(favorite.dataset.favorite);
    return;
  }
  const preview = event.target.closest('[data-preview]');
  if (preview) openPreview(preview.dataset.preview);
});

search.addEventListener('input', render);
favoritesOnlyButton.addEventListener('click', function () {
  favoriteMode = !favoriteMode;
  render();
});
document.getElementById('headerSurprise').addEventListener('click', surpriseMe);
document.getElementById('heroSurprise').addEventListener('click', surpriseMe);
document.getElementById('resetFilters').addEventListener('click', function () {
  activeFilter = 'All';
  favoriteMode = false;
  search.value = '';
  render();
});
document.getElementById('discoverySurprise').addEventListener('click', surpriseMe);
document.getElementById('closePreview').addEventListener('click', closePreview);
previewDialog.addEventListener('close', function () {
  previewFrame.src = 'about:blank';
  document.body.style.overflow = '';
});
previewDialog.addEventListener('click', function (event) {
  if (event.target === previewDialog) closePreview();
});
document.addEventListener('keydown', function (event) {
  if (event.key === '/' && !previewDialog.open && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
});

function workerMessage(request, onProgress) {
  const worker = navigator.serviceWorker.controller ||
    (offlineRegistration && offlineRegistration.active);
  if (!worker) return Promise.reject(new Error('Offline manager is still starting'));
  return new Promise(function (resolve, reject) {
    const channel = new MessageChannel();
    channel.port1.onmessage = function (event) {
      const msg = event.data || {};
      if (msg.type === 'PROGRESS') {
        if (onProgress) onProgress(msg);
        return;
      }
      channel.port1.close();
      if (msg.type === 'ERROR') reject(new Error(msg.message || 'Download failed'));
      else resolve(msg);
    };
    worker.postMessage(request, [channel.port2]);
  });
}

function formatBytes(bytes) {
  if (!bytes) return 'Size unavailable';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}

function summarizeOffline() {
  const summary = document.getElementById('offlineSummary');
  const allButton = document.getElementById('downloadAll');
  const updateButton = document.getElementById('updateAll');
  if (!summary || !allButton || !updateButton) return;
  if (!offlineCatalog) {
    summary.textContent = 'Preparing offline downloads…';
    allButton.disabled = true;
    updateButton.disabled = true;
    return;
  }
  const packages = Object.entries(offlineCatalog.packages);
  const installed = packages.filter(function (entry) {
    return Boolean(installedVersions[entry[0]]);
  });
  const outdated = packages.filter(function (entry) {
    return installedVersions[entry[0]] &&
      installedVersions[entry[0]] !== entry[1].version;
  });
  summary.textContent = installed.length + ' of ' + packages.length +
    ' game packs downloaded · ' + formatBytes(packages.reduce(function (sum, entry) {
      return sum + (entry[1].bytes || 0);
    }, 0)) + ' total' +
    (outdated.length ? ' · ' + outdated.length + ' updates available' : '');
  allButton.disabled = bulkBusy || installed.length === packages.length;
  updateButton.disabled = bulkBusy || outdated.length === 0;
  allButton.textContent = bulkBusy ? 'Downloading…' : '↓ Download all';
  updateButton.textContent = '↻ Update all' + (outdated.length ? ' (' + outdated.length + ')' : '');
}

function refreshOfflineProgress(id, percent) {
  progressByPackage[id] = percent;
  const cards = grid.querySelectorAll('[data-package]');
  cards.forEach(function (card) {
    if (card.dataset.package !== id) return;
    const state = card.querySelector('.status');
    if (state) state.textContent = '↓ ' + percent + '% downloaded';
  });
}

async function installPackage(id, silent) {
  if (!offlineCatalog || !offlineCatalog.packages[id] || offlineBusy.has(id)) return false;
  offlineBusy.add(id);
  delete progressByPackage[id];
  render();
  try {
    const result = await workerMessage({type:'DOWNLOAD', id:id}, function (event) {
      const percent = Math.round(event.completed / Math.max(1, event.total) * 100);
      if (percent !== progressByPackage[id]) refreshOfflineProgress(id, percent);
    });
    installedVersions[id] = result.version;
    if (!silent) announce('Game installed for offline play.');
    return true;
  } catch (error) {
    if (!silent) announce('Download failed: ' + error.message);
    return false;
  } finally {
    offlineBusy.delete(id);
    delete progressByPackage[id];
    render();
    summarizeOffline();
  }
}

async function removeInstalledPackage(id) {
  if (!offlineCatalog || offlineBusy.has(id) || bulkBusy) return;
  offlineBusy.add(id);
  render();
  try {
    await workerMessage({type:'REMOVE', id:id});
    delete installedVersions[id];
    announce('Offline game files removed. Online play remains available.');
  } catch (error) {
    announce('Could not remove the package: ' + error.message);
  } finally {
    offlineBusy.delete(id);
    render();
    summarizeOffline();
  }
}

async function bulkDownload(mode) {
  if (!offlineCatalog || bulkBusy) return;
  bulkBusy = true;
  summarizeOffline();
  const targets = Object.entries(offlineCatalog.packages).filter(function (entry) {
    const version = installedVersions[entry[0]];
    return mode === 'updates' ? (version && version !== entry[1].version) : !version;
  });
  let completed = 0;
  for (const entry of targets) {
    const successful = await installPackage(entry[0], true);
    if (successful) completed++;
  }
  bulkBusy = false;
  summarizeOffline();
  render();
  announce(completed + ' of ' + targets.length +
    ' game packages ' + (mode === 'updates' ? 'updated.' : 'downloaded.'));
}

async function refreshCatalog() {
  if (!offlineRegistration) return;
  try {
    const result = await workerMessage({type:'STATUS'});
    offlineCatalog = result.catalog;
    installedVersions = result.installed;
    render();
    summarizeOffline();
  } catch (error) {
    announce('Offline library unavailable: ' + error.message);
  }
}

async function initializeOffline() {
  summarizeOffline();
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    const summary = document.getElementById('offlineSummary');
    if (summary) summary.textContent = 'Offline downloads require a secure browser and service workers.';
    return;
  }
  try {
    offlineRegistration = await navigator.serviceWorker.register('./sw.js', {
      scope:'./', updateViaCache:'none'
    });
    await navigator.serviceWorker.ready;
    await refreshCatalog();
  } catch (error) {
    const summary = document.getElementById('offlineSummary');
    if (summary) summary.textContent = 'Offline library unavailable: ' + error.message;
  }
}

document.getElementById('downloadAll').addEventListener('click', function () {
  bulkDownload('missing');
});
document.getElementById('updateAll').addEventListener('click', function () {
  bulkDownload('updates');
});
document.getElementById('checkUpdates').addEventListener('click', function () {
  refreshCatalog().then(function () { announce('Game versions checked.'); });
});
window.addEventListener('online', refreshCatalog);

document.getElementById('year').textContent = new Date().getFullYear();
render();
initializeOffline();
