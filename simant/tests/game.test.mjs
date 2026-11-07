import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const gameSource = readFileSync(new URL('../game.js', import.meta.url), 'utf8');

function makeRuntime(storage = {}) {
  const elements = new Map();
  const windowEvents = new Map();
  const documentEvents = new Map();
  const noop = () => {};
  const context = new Proxy({
    createRadialGradient() { return { addColorStop() {} }; }
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
      '[data-view]': { names: ['surface', 'nest', 'yard'], key: 'view' }
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
  runInNewContext(gameSource, {
    window, document, localStorage,
    requestAnimationFrame(fn) { callback = fn; },
    confirm: () => true,
    console, setTimeout, clearTimeout
  }, { timeout: 10000 });
  function frame(timestamp = 16) {
    assert.equal(typeof callback, 'function');
    callback(timestamp);
  }
  function triggerPageHide() {
    assert.ok(windowEvents.has('pagehide'));
    windowEvents.get('pagehide')();
  }
  return { el: makeElement, frame, storage, triggerPageHide };
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
