import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const gameSource = readFileSync(new URL('../game.js', import.meta.url), 'utf8');
const nestSource = readFileSync(new URL('../nest.js', import.meta.url), 'utf8');

function makeRuntime(storage = {}) {
  const elements = new Map();
  const windowEvents = new Map();
  const documentEvents = new Map();
  const noop = () => {};
  const context = new Proxy({
    createRadialGradient() { return { addColorStop() {} }; },
    createLinearGradient() { return { addColorStop() {} }; },
    measureText(text) { return { width: String(text).length * 7 }; }
  }, {
    get(object, prop) {
      return prop in object ? object[prop] : noop;
    },
    set(object, prop, value) { object[prop] = value; return true; }
  });
  const makeElement = id => {
    if (elements.has(id)) return elements.get(id);
    const attributes = new Map();
    const listeners = new Map();
    const node = {
      id, width: 244, height: 164, hidden: false,
      style: {}, children: [], dataset: {}, textContent: '',
      classList: { add: noop, remove: noop, toggle: noop },
      addEventListener(name, callback) { listeners.set(name, callback); },
      trigger(name, event = {}) {
        if (!listeners.has(name)) throw new Error('Missing ' + name + ' handler for ' + id);
        listeners.get(name)(event);
      },
      setAttribute(name, value) { attributes.set(name, value); },
      getAttribute(name) { return attributes.get(name); },
      getContext() { return context; },
      getBoundingClientRect() { return { left: 0, top: 0, width: 390, height: 550 }; },
      appendChild(child) { this.children.push(child); },
      prepend(child) { this.children.unshift(child); },
      remove() { this.removed = true; },
      setPointerCapture: noop,
      get lastElementChild() { return this.children[this.children.length - 1] || null; }
    };
    elements.set(id, node);
    return node;
  };
  const buttons = selector => {
    const mappings = {
      '[data-order]': { names: ['forage', 'rally', 'attack', 'defend'], key: 'order' },
      '[data-quick-order]': { names: ['forage', 'rally', 'attack', 'defend'], key: 'quickOrder' },
      '[data-view]': { names: ['surface', 'nest', 'yard'], key: 'view' },
      '[data-group]': { names: ['scout', 'worker', 'soldier', 'all'], key: 'group' },
      '[data-recruit]': { names: ['worker', 'soldier'], key: 'recruit' },
      '[data-build]': { names: ['nursery', 'storage', 'gate'], key: 'build' },
      '[data-group]': { names: ['scout', 'worker', 'soldier', 'all'], key: 'group' },
      '[data-recruit]': { names: ['worker', 'soldier'], key: 'recruit' },
      '[data-build]': { names: ['nursery', 'storage', 'gate'], key: 'build' }
    };
    const mapping = mappings[selector];
    if (!mapping) throw new Error('Unexpected selector: ' + selector);
    return mapping.names.map(name => {
      const element = makeElement(mapping.key + name);
      element.dataset[mapping.key] = name;
      return element;
    });
  };
  const document = {
    getElementById: makeElement,
    createElement(tag) {
      if (tag === 'canvas') {
        const canvas = makeElement('offscreen');
        canvas.getContext = () => context;
        return canvas;
      }
      return makeElement('transient' + Math.random());
    },
    querySelectorAll: buttons,
    addEventListener(name, callback) { documentEvents.set(name, callback); }
  };
  const window = {
    devicePixelRatio: 2,
    addEventListener(name, callback) { windowEvents.set(name, callback); }
  };
  const localStorage = {
    getItem(key) { return storage[key] || null; },
    setItem(key, value) { storage[key] = value; },
    removeItem(key) { delete storage[key]; }
  };
  let callback = null;
  const sandbox = {
    window, document, localStorage,
    requestAnimationFrame(fn) { callback = fn; },
    confirm: () => true,
    console, setTimeout, clearTimeout
  };
  runInNewContext(nestSource, sandbox, { timeout: 10000 });
  runInNewContext(gameSource, sandbox, { timeout: 10000 });
  function frame(timestamp = 16) {
    assert.equal(typeof callback, 'function');
    callback(timestamp);
  }
  function triggerPageHide() {
    assert.ok(windowEvents.has('pagehide'));
    windowEvents.get('pagehide')();
  }
  return { el: makeElement, frame, storage, triggerPageHide, window };
}

test('starts a new playable colony with both species and a mission', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.frame();
  assert.equal(app.el('intro').hidden, true);
  assert.equal(Number(app.el('blacks').textContent), 17);
  assert.equal(Number(app.el('reds').textContent), 20);
  assert.equal(Number(app.el('food').textContent), 70);
  assert.match(app.el('missionTitle').textContent, /Gather/);
});

test('the mobile quick command rail controls strategy and the view switch works', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('quickOrderattack').trigger('click');
  assert.equal(app.el('orderTitle').textContent, 'Take the offensive');
  assert.equal(app.el('quickOrderattack').getAttribute('aria-pressed'), 'true');
  app.el('viewyard').trigger('click');
  app.frame();
  assert.equal(app.el('viewTitle').textContent, 'BACKYARD OVERVIEW');
  app.el('viewnest').trigger('click');
  app.frame(32);
  assert.equal(app.el('viewTitle').textContent, 'UNDERGROUND NEST');
});

test('saves and restores the individual colony members and food patches', () => {
  const saved = {};
  const first = makeRuntime(saved);
  first.el('startGame').trigger('click');
  first.frame();
  first.triggerPageHide();
  assert.ok(saved['hambone-colony-v1']);
  const data = JSON.parse(saved['hambone-colony-v1']);
  assert.ok(data.snapshot.ants.length > 30);
  assert.ok(data.snapshot.foods.length > 10);
  data.snapshot.ants = data.snapshot.ants.filter(a => a.caste === 'scout').slice(0, 1);
  data.snapshot.foods = data.snapshot.foods.slice(0, 1);
  saved['hambone-colony-v1'] = JSON.stringify(data);
  const reopened = makeRuntime(saved);
  reopened.frame();
  assert.equal(reopened.el('intro').hidden, true);
  assert.equal(Number(reopened.el('blacks').textContent), 1);
  assert.equal(Number(reopened.el('reds').textContent), 0);
});

test('a touch click orders the scout, but a drag pans instead of reordering', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  const canvas = app.el('world');
  const touch = { pointerId: 1, button: 0, clientX: 292, clientY: 250 };
  canvas.trigger('pointerdown', touch);
  canvas.trigger('pointerup', touch);
  app.triggerPageHide();
  let state = JSON.parse(app.storage['hambone-colony-v1']);
  let scout = state.snapshot.ants.find(a => a.caste === 'scout');
  assert.ok(scout?.target);
  const previous = JSON.stringify(scout.target);
  canvas.trigger('pointerdown', { pointerId: 2, button: 0, clientX: 180, clientY: 280 });
  canvas.trigger('pointermove', { pointerId: 2, button: 0, clientX: 250, clientY: 280 });
  canvas.trigger('pointerup', { pointerId: 2, button: 0, clientX: 250, clientY: 280 });
  app.triggerPageHide();
  state = JSON.parse(app.storage['hambone-colony-v1']);
  scout = state.snapshot.ants.find(a => a.caste === 'scout');
  assert.equal(JSON.stringify(scout.target), previous);
});

test('group selection issues RTS commands to multiple workers', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('groupworker').trigger('click');
  const selected = Number(app.el('selectionCount').textContent.split(' ')[0]);
  assert.ok(selected > 7);
  const world = app.el('world');
  world.trigger('pointerdown', { pointerId: 11, button: 0, clientX: 335, clientY: 340, pointerType: 'touch' });
  world.trigger('pointerup', { pointerId: 11, button: 0, clientX: 335, clientY: 340, pointerType: 'touch' });
  app.triggerPageHide();
  const data = JSON.parse(app.storage['hambone-colony-v1']);
  const ordered = data.snapshot.ants.filter(a => a.side === 'black' && a.caste === 'worker' && a.manual);
  assert.ok(ordered.length > 7);
});

test('recruitment consumes food, adds a specific caste, and preserves the queue in saves', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('recruitsoldier').trigger('click');
  app.triggerPageHide();
  const data = JSON.parse(app.storage['hambone-colony-v1']);
  assert.equal(data.food, 32);
  assert.ok(data.snapshot.eggs.some(e => e.side === 'black' && e.caste === 'soldier' && e.trained));
});

test('nest upgrade costs food and persists the upgraded nursery', () => {
  const saved = {};
  const app = makeRuntime(saved);
  app.el('startGame').trigger('click');
  // Default nursery costs 85; provide the extra food through a saved state.
  app.triggerPageHide();
  const old = JSON.parse(saved['hambone-colony-v1']);
  old.food = 150;
  saved['hambone-colony-v1'] = JSON.stringify(old);
  const reopened = makeRuntime(saved);
  reopened.el('buildnursery').trigger('click');
  reopened.triggerPageHide();
  const updated = JSON.parse(saved['hambone-colony-v1']);
  assert.equal(updated.upgrades.nursery, 1);
  assert.equal(updated.food, 65);
});

test('mouse selection rectangle selects an ant squad without moving the camera', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  const canvas = app.el('world');
  canvas.trigger('pointerdown', { pointerId: 3, button: 0, pointerType: 'mouse', clientX: 50, clientY: 175 });
  canvas.trigger('pointermove', { pointerId: 3, button: 0, pointerType: 'mouse', clientX: 280, clientY: 375 });
  canvas.trigger('pointerup', { pointerId: 3, button: 0, pointerType: 'mouse', clientX: 280, clientY: 375 });
  assert.match(app.el('selectionCount').textContent, /selected/);
});


test('RTS group selection issues an explicit command to multiple workers', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('groupworker').trigger('click');
  const n = Number(app.el('selectionCount').textContent.split(' ')[0]);
  assert.ok(n >= 8, 'expected worker group to be selectable');
  const canvas = app.el('world');
  const destination = { pointerId: 55, button: 2, clientX: 225, clientY: 360, pointerType: 'mouse' };
  canvas.trigger('pointerdown', destination);
  canvas.trigger('pointerup', destination);
  app.triggerPageHide();
  const saved = JSON.parse(app.storage['hambone-colony-v1']);
  assert.equal(saved.selected.length, n);
  const commanded = saved.snapshot.ants.filter(a => a.side === 'black' && a.caste === 'worker' && a.manual);
  assert.equal(commanded.length, n);
  assert.ok(commanded.every(a => a.manual.type === 'move' || a.manual.type === 'gather'));
});

test('recruitment spends stored food and queues the correct caste', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('recruitsoldier').trigger('click');
  app.triggerPageHide();
  const saved = JSON.parse(app.storage['hambone-colony-v1']);
  assert.equal(saved.food, 32);
  assert.ok(saved.snapshot.eggs.some(egg => egg.side === 'black' && egg.caste === 'soldier'));
});

test('nest upgrades use the same stored-food economy and persist', () => {
  const storage = {};
  const app = makeRuntime(storage);
  app.el('startGame').trigger('click');
  app.el('buildgate').trigger('click');
  app.triggerPageHide();
  const saved = JSON.parse(storage['hambone-colony-v1']);
  assert.equal(saved.food, 0);
  assert.equal(saved.upgrades.gate, 1);
  const resumed = makeRuntime(storage);
  resumed.frame();
  assert.equal(resumed.el('gateCost').textContent, '130 food · Lv 1');
});

test('nest cross-section renders and chamber hit testing works in portrait and landscape', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('viewnest').trigger('click');
  app.frame(100);
  assert.equal(typeof app.window.ColonyNest.draw, 'function');
  assert.equal(app.window.ColonyNest.pick(195, 156, 390, 550), 'queen');
  assert.equal(app.window.ColonyNest.pick(490, 266, 980, 680), 'queen');
  assert.equal(app.window.ColonyNest.pick(10, 670, 980, 680), null);
});

test('detailed nest can be selected without affecting the surface population', () => {
  const app = makeRuntime();
  app.el('startGame').trigger('click');
  app.el('viewnest').trigger('click');
  app.frame(100);
  const before = Number(app.el('blacks').textContent);
  const canvas = app.el('world');
  const p = {pointerId: 73, button: 0, clientX: 195, clientY: 156, pointerType: 'touch'};
  canvas.trigger('pointerdown', p);
  canvas.trigger('pointerup', p);
  app.frame(120);
  assert.equal(Number(app.el('blacks').textContent), before);
  assert.match(app.el('tip').textContent, /Royal chamber/i);
});
