'use strict';

/*
 * Hambone Arcade project catalog.
 * Set playable: true only for projects with a browser version.
 * A project's URL is derived from its exact, case-sensitive GitHub repo name.
 * To add a project, copy an object below and change its values.
 */
const PROJECTS = [
  {
    id: 'sprayworks',
    repo: 'sprayworks',
    title: 'SprayWorks',
    category: 'Worlds',
    type: 'Clockwork adventure',
    description: 'A tiny crew repairs a giant clock. Scrub the gears, carry them across the workshop, and bring the machine to life.',
    emoji: '⚙️',
    sideEmoji: '🧑‍🔧',
    colors: ['#9a55a8', '#342665', '#ffcb66'],
    playable: true,
    featured: true
  },
  {
    id: 'marblemerge',
    repo: 'marbleMerge',
    title: 'Marble Merge',
    category: 'Physics',
    type: '3D marble racing',
    description: 'Glossy marbles careen down a wooden racecourse packed with funnels, wild drops, and mechanical obstacles.',
    emoji: '🔮',
    sideEmoji: '🏁',
    colors: ['#3b92b4', '#292d72', '#8fddff'],
    playable: true,
    featured: true
  },
  {
    id: 'facesandheels',
    repo: 'faces-and-heels',
    title: 'Faces & Heels',
    category: 'Arcade',
    type: 'Wrestling showdown',
    description: 'Blocky wrestlers, big entrances, dramatic finishers, and turn-based tactical action inside the squared circle.',
    emoji: '🤼',
    sideEmoji: '🏆',
    colors: ['#d45170', '#612c72', '#ffa982'],
    playable: true,
    featured: true
  },
  {
    id: 'football',
    repo: 'old-school-football',
    title: 'Old School Football',
    category: 'Arcade',
    type: 'Football arcade',
    description: 'Retro handheld football energy with chibi players, smooth runs, charging defenders, and one more shot at the end zone.',
    emoji: '🏈',
    sideEmoji: '⚡',
    colors: ['#30956b', '#1e4d69', '#c6fb78'],
    playable: true,
    featured: true
  },
  {
    id: 'apeironx',
    repo: 'apeironX',
    title: 'Apeiron X',
    category: 'Arcade',
    type: 'Retro action',
    description: 'An original browser tribute to classic centipede-style arcade chaos, with animated critters and neon-fast action.',
    emoji: '🐛',
    sideEmoji: '💥',
    colors: ['#3aaf81', '#142e61', '#92f5cb'],
    playable: true
  },
  {
    id: 'stony',
    repo: 'sunward',
    title: 'Stony Creek Explorer',
    category: 'Worlds',
    type: '3D exploration',
    description: 'Take a quiet digital stroll through a park-inspired Michigan landscape with trails, trees, and places to wander.',
    emoji: '🌲',
    sideEmoji: '🧭',
    colors: ['#4fa676', '#204e77', '#9af0ad'],
    playable: true
  },
  {
    id: 'depthroom',
    repo: 'depthroom',
    title: 'DepthRoom',
    category: 'Creative',
    type: 'AI photo playground',
    description: 'Turn a flat photograph into a moving 2.5D scene with depth, camera motion, and interactive parallax.',
    emoji: '🖼️',
    sideEmoji: '✨',
    colors: ['#b965b7', '#343c94', '#ffb7eb'],
    playable: true
  },
  {
    id: 'mind2',
    repo: 'MIND2',
    title: 'MIND2',
    category: 'Creative',
    type: 'Music maker',
    description: 'A browser music laboratory that composes melodies, harmony, bass, and drums and can export MIDI.',
    emoji: '🎹',
    sideEmoji: '🎵',
    colors: ['#9d68df', '#3545a4', '#e4c1ff'],
    playable: true
  },
  {
    id: 'barrack',
    repo: 'Barrack',
    title: 'Barrack+',
    category: 'Workbench',
    type: 'Area-capture game',
    description: 'A colorful JezzBall-style area-capture project designed for Swift Playgrounds and its arena challenges.',
    emoji: '🟦',
    sideEmoji: '⚡',
    colors: ['#4a80e6', '#342a79', '#b3dcff'],
    playable: false
  },
  {
    id: 'growavillage',
    repo: 'GrowAVillage',
    title: 'Grow a Village',
    category: 'Workbench',
    type: 'Game prototype',
    description: 'A village-themed experiment from the Hambone workshop. Explore its development in GitHub.',
    emoji: '🏘️',
    sideEmoji: '🌱',
    colors: ['#6eb78a', '#4b5477', '#f8e7aa'],
    playable: false
  },
  {
    id: 'creaturestudio',
    repo: 'creaturestudio',
    title: 'Creature Studio',
    category: 'Workbench',
    type: 'Creative prototype',
    description: 'An experimental project from the creature-making side of the workshop, currently available as source.',
    emoji: '🦎',
    sideEmoji: '🧪',
    colors: ['#a572df', '#475293', '#ddbbff'],
    playable: false
  },
  {
    id: 'animesh',
    repo: 'AniMesh',
    title: 'AniMesh',
    category: 'Creative',
    type: 'Image-to-mesh tool',
    description: 'An image-processing experiment focused on automatically meshing two-dimensional images.',
    emoji: '🧩',
    sideEmoji: '📐',
    colors: ['#e58b84', '#7a4a83', '#ffdfb6'],
    playable: false
  },
  {
    id: 'plantit',
    repo: 'plantit',
    title: 'PlantIt',
    category: 'Creative',
    type: 'Plant journal',
    description: 'A leafy plant-tracking companion with rooms, watering history, and a nature-inspired feel.',
    emoji: '🪴',
    sideEmoji: '💧',
    colors: ['#62ad79', '#3b557c', '#c7faa9'],
    playable: false
  },
  {
    id: 'potion',
    repo: 'Potion',
    title: 'Potion',
    category: 'Workbench',
    type: 'Workshop project',
    description: 'A curious project still on the workbench. Look inside the source repository.',
    emoji: '🧪',
    sideEmoji: '✨',
    colors: ['#ac70c7', '#525398', '#f0b7ff'],
    playable: false
  }
];

const FILTERS = ['All', 'Arcade', 'Physics', 'Worlds', 'Creative', 'Workbench'];
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
  return project.playable ? PAGES_BASE + project.repo + '/' : GITHUB_BASE + project.repo;
}

function repoUrl(project) {
  return GITHUB_BASE + project.repo;
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
  status.className = 'status' + (project.playable ? '' : ' source');
  status.textContent = project.playable ? '● Browser' : '◇ Source';
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
  primaryLink.textContent = project.playable ? 'Play / Explore' : 'View project';
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  arrow.setAttribute('aria-hidden', 'true');
  primaryLink.appendChild(arrow);
  actions.appendChild(primaryLink);

  if (project.playable) {
    const previewButton = document.createElement('button');
    previewButton.className = 'preview-btn';
    previewButton.type = 'button';
    previewButton.dataset.preview = project.id;
    previewButton.textContent = 'Preview';
    previewButton.setAttribute('aria-label', 'Preview ' + project.title);
    actions.appendChild(previewButton);
  } else {
    const sourceLink = document.createElement('a');
    sourceLink.href = repoUrl(project);
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.className = 'preview-btn';
    sourceLink.textContent = 'GitHub ↗';
    actions.appendChild(sourceLink);
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
  const games = PROJECTS.filter(function (project) { return project.playable; });
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
  if (!project || !project.playable) return;
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
document.getElementById('seeExperiments').addEventListener('click', function () {
  activeFilter = 'Creative';
  favoriteMode = false;
  search.value = '';
  render();
  document.getElementById('games').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
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
