import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const start = source.indexOf('const PROJECTS = [');
const end = source.indexOf('const grid =', start);
assert.ok(start >= 0 && end > start, 'Project catalog must be present');
const context = {};
runInNewContext(source.slice(start, end) + '\nthis.projects = PROJECTS; this.filters = FILTERS;', context);
const projects = Array.from(context.projects);
const filters = Array.from(context.filters);

const toUrl = project => project.url || `https://hambonesoftware.github.io/${project.repo}/`;

test('arcade only lists actual browser-playable games', () => {
  assert.ok(projects.length >= 12, 'Expected at least a dozen playable games');
  assert.ok(projects.every(project => project.playable === true), 'Source-only projects must not appear');
  assert.ok(projects.every(project => project.repo && project.title && project.description), 'Each game requires complete metadata');
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length, 'Game IDs must be unique');
});

test('all cards target project-specific hosted games, not GitHub source listings', () => {
  for (const project of projects) {
    const url = new URL(toUrl(project));
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'hambonesoftware.github.io');
    assert.ok(url.pathname.startsWith('/' + project.repo + '/'), `Incorrect repo path for ${project.title}`);
    assert.ok(!url.pathname.endsWith('.md'), `Markdown cannot be a game destination: ${project.title}`);
  }
});

test('garage gauntlet, all three RC courses, colony, and HopShift are available in the catalog', () => {
  for (const id of ['garagegauntlet', 'maplejunction', 'microbackyard', 'microcanyon', 'hopshift', 'colony']) {
    assert.ok(projects.some(project => project.id === id), `Missing ${id}`);
  }
  assert.equal(toUrl(projects.find(p => p.id === 'hopshift')), 'https://hambonesoftware.github.io/hopshift/course-concept.html');
  assert.equal(toUrl(projects.find(p => p.id === 'marblemerge')), 'https://hambonesoftware.github.io/marbleMerge/v2/');
  assert.equal(toUrl(projects.find(p => p.id === 'colony')), 'https://hambonesoftware.github.io/arcade/simant/');
});

test('game categories are navigable and local colony source exists', () => {
  assert.equal(filters[0], 'All');
  for (const project of projects) assert.ok(filters.includes(project.category), `Unfilterable game ${project.title}`);
  assert.ok(existsSync(new URL('../simant/index.html', import.meta.url)));
});

test('homepage only advertises playable games and the surprise button is wired', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="discoverySurprise"/);
  assert.doesNotMatch(html, /Browse experiments|id="seeExperiments"|>HUD Lab</);
  assert.match(source, /getElementById\('discoverySurprise'\)\.addEventListener\('click', surpriseMe\)/);
});
