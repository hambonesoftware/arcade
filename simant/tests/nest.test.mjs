import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../nest.js', import.meta.url), 'utf8');
const noop = () => {};
const ctx = new Proxy({
  createLinearGradient: () => ({ addColorStop: noop }),
  createRadialGradient: () => ({ addColorStop: noop }),
  measureText: text => ({ width: String(text).length * 7 })
}, {
  get(target, property) {
    return property in target ? target[property] : noop;
  },
  set(target, property, value) {
    target[property] = value;
    return true;
  }
});
const window = {};
const document = {
  createElement: name => {
    assert.equal(name, 'canvas');
    return { width: 0, height: 0, getContext: () => ctx };
  }
};
runInNewContext(source, {window,document,console}, {timeout: 10000});
const nest = window.ColonyNest;

test('nest renderer exports draw and pick methods', () => {
  assert.equal(typeof nest.draw, 'function');
  assert.equal(typeof nest.pick, 'function');
});

test('landscape nest has an interactive queen room and food store', () => {
  assert.equal(nest.pick(478,266,980,680), 'queen');
  assert.equal(nest.pick(193,310,980,680), 'storage');
  assert.equal(nest.pick(763,310,980,680), 'nursery');
});

test('portrait chambers remain easy to identify at mobile dimensions', () => {
  assert.equal(nest.pick(195,195,390,620), 'queen');
});

test('renders a living nest without network assets in both orientations', () => {
  const state = {
    phase: 15,
    food: 125,
    queen: 83,
    upgrades: { nursery: 2, storage: 1, gate: 3 },
    eggs: [{side:'black',time:5}],
    ants: Array.from({length:30}, (_,id) => ({
      id,
      side:'black',
      caste:id%5===0?'soldier':'worker',
      health:45,
      carry:id%3===0
    })),
    highlight:'nursery'
  };
  assert.doesNotThrow(() => nest.draw(ctx,980,680,state));
  assert.doesNotThrow(() => nest.draw(ctx,390,620,state));
  assert.doesNotThrow(() => nest.draw(ctx,390,620,{...state,phase:27,highlight:'queen'}));
});
