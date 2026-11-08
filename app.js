'use strict';

/*
 * Hambone Arcade project catalog.
 * Only playable browser games belong in this curated catalog.
 * Project URL overrides are used for game-specific pages or build branches.
 * Keep the exact repository casing when adding a new game.
 */
const PROJECTS = [
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
  status.className = 'status';
  status.textContent = '● Playable';
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
  primaryLink.target = '_blank';
  primaryLink.rel = 'noopener noreferrer';
  primaryLink.textContent = 'Play now';
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
  const link = document.createElement('a');
  link.href = projectUrl(project);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
  announce('Your mystery destination: ' + project.title + '!');
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
document.getElementById('year').textContent = new Date().getFullYear();
render();
