import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { normalizeIdea, validatePollSetup, isPollOpen } from '../src/worker.js';

test('accepts a complete, bounded anonymous suggestion', () => {
  const input = normalizeIdea({
    title: 'Tiny Tank Rally',
    description: 'Drive toy tanks through a miniature town with ridiculous obstacles.',
    genre: 'Racing',
    nickname: ''
  });
  assert.equal(input.title, 'Tiny Tank Rally');
  assert.equal(input.nickname, 'Anonymous');
});

test('rejects malformed and oversized suggestions', () => {
  const idea = { title: 'Good name', description: 'A long enough, excellent idea.', genre: 'Arcade' };
  assert.throws(() => normalizeIdea({ ...idea, title: 'no' }), /3–80/);
  assert.throws(() => normalizeIdea({ ...idea, genre: 'SQL injection' }), /genre/);
  assert.throws(() => normalizeIdea({ ...idea, description: 'bad' }), /15–800/);
  assert.throws(() => normalizeIdea({ ...idea, title: 'A'.repeat(81) }), /3–80/);
});

test('active and scheduled polls only count inside the official voting window', () => {
  const poll = { status: 'scheduled', starts_at: '2026-11-15T00:00:00.000Z', ends_at: '2026-11-22T00:00:00.000Z' };
  assert.equal(isPollOpen(poll, '2026-11-14T23:00:00.000Z'), false);
  assert.equal(isPollOpen(poll, '2026-11-16T00:00:00.000Z'), true);
  assert.equal(isPollOpen(poll, '2026-11-22T00:00:00.000Z'), false);
  assert.equal(isPollOpen({ ...poll, status: 'closed' }, '2026-11-16T00:00:00.000Z'), false);
});

test('poll setup validates approved-candidate cardinality, timeframe and uniqueness', () => {
  const id1 = '00000000-0000-0000-0000-000000000001';
  const id2 = '00000000-0000-0000-0000-000000000002';
  const at = '2026-11-12T12:00:00.000Z';
  const valid = { title: 'Which game next?', ideaIds: [id1, id2], startsAt: '2026-11-13T12:00:00Z', endsAt: '2026-11-20T12:00:00Z' };
  const output = validatePollSetup(valid, at);
  assert.equal(output.ideaIds.length, 2);
  assert.throws(() => validatePollSetup({ ...valid, ideaIds: [id1, id1] }, at), /unique/);
  assert.throws(() => validatePollSetup({ ...valid, endsAt: '2026-11-11T12:00:00Z' }, at), /end/);
});

test('no configured backend means no participation claimed', async () => {
  const request = new Request('https://community.example.workers.dev/api/config', {
    headers: { Origin: 'https://hambonesoftware.github.io' }
  });
  const response = await worker.fetch(request, { ALLOWED_ORIGIN: 'https://hambonesoftware.github.io' }, {});
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.enabled, false);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://hambonesoftware.github.io');
});

test('private moderation always denies unauthenticated requests', async () => {
  const request = new Request('https://community.example.workers.dev/api/admin/overview');
  const response = await worker.fetch(request, { DB: {}, ALLOWED_ORIGIN: 'https://hambonesoftware.github.io', ADMIN_EMAIL: 'owner@example.com' }, {});
  assert.equal(response.status, 403);
  assert.match((await response.json()).error, /access required/i);
});

test('wrong-origin preflights are rejected', async () => {
  const request = new Request('https://community.example.workers.dev/api/ideas', {
    method: 'OPTIONS', headers: { Origin: 'https://untrusted.example' }
  });
  const response = await worker.fetch(request, { ALLOWED_ORIGIN: 'https://hambonesoftware.github.io' }, {});
  assert.equal(response.status, 403);
});
