import { adminPage } from './admin-page.js';

const GENRES = new Set(['Arcade', 'Racing', 'Strategy', 'Platformer', 'Simulation', 'Physics', 'Worlds', 'Other']);
const ROADMAP_STATES = new Set(['planned', 'building', 'playtesting', 'released']);
const IDEA_STATES = new Set(['approved', 'rejected', 'archived']);

function clean(value, max) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max + 1)
    : '';
}

export function normalizeIdea(input) {
  const title = clean(input?.title, 80);
  const description = clean(input?.description, 800);
  const genre = clean(input?.genre, 24);
  const nickname = clean(input?.nickname || 'Anonymous', 32);
  if (title.length < 3 || title.length > 80) throw new HttpError(400, 'Game title must be 3–80 characters.');
  if (description.length < 15 || description.length > 800) throw new HttpError(400, 'Description must be 15–800 characters.');
  if (!GENRES.has(genre)) throw new HttpError(400, 'Choose a valid genre.');
  if (!nickname || nickname.length > 32) throw new HttpError(400, 'Nickname must be at most 32 characters.');
  return { title, description, genre, nickname };
}

export function isPollOpen(poll, at = new Date().toISOString()) {
  return Boolean(poll && (poll.status === 'active' || poll.status === 'scheduled')
    && poll.starts_at <= at && poll.ends_at > at);
}

export function validatePollSetup(input, at = new Date().toISOString()) {
  const title = clean(input?.title, 100);
  const ids = Array.isArray(input?.ideaIds) ? input.ideaIds : [];
  const startsAt = input?.startsAt || at;
  const endsAt = input?.endsAt;
  if (title.length < 5 || title.length > 100) throw new HttpError(400, 'Poll title must be 5–100 characters.');
  if (ids.length < 2 || ids.length > 5 || new Set(ids).size !== ids.length
      || !ids.every(id => typeof id === 'string' && /^[a-f0-9-]{36}$/.test(id))) {
    throw new HttpError(400, 'Choose 2–5 unique approved ideas.');
  }
  if (typeof startsAt !== 'string' || typeof endsAt !== 'string'
      || !/^\d{4}-\d{2}-\d{2}T/.test(startsAt)
      || !/^\d{4}-\d{2}-\d{2}T/.test(endsAt)
      || !Number.isFinite(Date.parse(startsAt)) || !Number.isFinite(Date.parse(endsAt))) {
    throw new HttpError(400, 'Valid ISO start and end dates are required.');
  }
  const start = new Date(startsAt).toISOString();
  const end = new Date(endsAt).toISOString();
  if (end <= start || end <= at || Date.parse(end) - Date.parse(start) > 31 * 86400000) {
    throw new HttpError(400, 'Poll must end after it starts and last no more than 31 days.');
  }
  return { title, ideaIds: ids, startsAt: start, endsAt: end };
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function allowedOrigin(request, env) {
  return request.headers.get('Origin') === env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : '';
}
function publicHeaders(request, env) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const origin = allowedOrigin(request, env);
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Guest-Token';
    headers.Vary = 'Origin';
  }
  return headers;
}
function json(request, env, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...publicHeaders(request, env), 'Content-Type': 'application/json; charset=utf-8' }
  });
}
function fail(status, message) { throw new HttpError(status, message); }

async function readBody(request) {
  const size = Number(request.headers.get('content-length') || 0);
  if (size > 8192) fail(413, 'Request too large.');
  let text;
  try { text = await request.text(); } catch { fail(400, 'Could not read request.'); }
  if (text.length > 8192) fail(413, 'Request too large.');
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
    return body;
  } catch { fail(400, 'Expected JSON object.'); }
}

async function sha(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
}
function guestValue(request) {
  const value = request.headers.get('X-Guest-Token') || '';
  if (!value) return '';
  if (!/^[0-9a-f]{64}$/.test(value)) fail(401, 'Invalid visitor identity. Reset this browser identity and retry.');
  return value;
}
async function currentVisitor(request, env) {
  const token = guestValue(request);
  if (!token) return null;
  const id = await sha(token);
  const row = await env.DB.prepare('SELECT id FROM visitors WHERE id = ?').bind(id).first();
  if (!row) fail(401, 'Visitor identity expired or invalid. Reset your local identity and retry.');
  return { id, token, created: false };
}
async function ensureVisitor(request, env) {
  const previous = await currentVisitor(request, env);
  if (previous) return previous;
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes, n => n.toString(16).padStart(2, '0')).join('');
  const id = await sha(token);
  await env.DB.prepare('INSERT INTO visitors (id) VALUES (?)').bind(id).run();
  return { id, token, created: true };
}
function guestResult(guest) {
  return guest.created ? { guestToken: guest.token } : {};
}

async function verifyChallenge(body, env) {
  const token = body.turnstileToken;
  if (!env.TURNSTILE_SECRET || !env.TURNSTILE_HOSTNAME || !env.TURNSTILE_SITE_KEY
      || typeof token !== 'string' || token.length < 2 || token.length > 2048) {
    fail(403, 'Verification unavailable. Please try again later.');
  }
  let result;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token })
    });
    if (!response.ok) fail(503, 'Verification service unavailable.');
    result = await response.json();
  } catch (error) {
    if (error instanceof HttpError) throw error;
    fail(503, 'Verification service unavailable.');
  }
  if (!result.success || result.hostname !== env.TURNSTILE_HOSTNAME
      || result.action !== 'community') fail(403, 'Verification failed. Please try again.');
}

// HMACs avoid recording raw IPs; short-lived hashes are rotated daily.
async function abuseKey(request, env, action) {
  if (!env.RATE_SALT || env.RATE_SALT.length < 24) fail(503, 'Abuse protection not configured.');
  const ip = request.headers.get('CF-Connecting-IP') || 'unavailable';
  const day = new Date().toISOString().slice(0, 10);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.RATE_SALT),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(action + ':' + day + ':' + ip));
  return action + ':' + Array.from(new Uint8Array(sig), n => n.toString(16).padStart(2, '0')).join('');
}
async function rateLimit(request, env, action, max) {
  const key = await abuseKey(request, env, action);
  const expiry = new Date(Date.now() + 2 * 86400000).toISOString();
  const row = await env.DB.prepare(
    'INSERT INTO abuse_limits (key, hits, expires_at) VALUES (?, 1, ?) ' +
    'ON CONFLICT(key) DO UPDATE SET hits = hits + 1 RETURNING hits'
  ).bind(key, expiry).first();
  if (!row || row.hits > max) fail(429, 'Too many actions from this network today. Try again tomorrow.');
}

async function requireAdmin(env, ctx) {
  // A public workers.dev route must never authorize an admin based on client headers.
  if (!env.ADMIN_EMAIL || !ctx?.access) fail(403, 'Administrator access required.');
  const identity = await ctx.access.getIdentity();
  if (!identity?.email || identity.email.toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()) {
    fail(403, 'Administrator access required.');
  }
  return identity.email;
}
async function audit(env, actor, action, targetId, details = '') {
  await env.DB.prepare(
    'INSERT INTO moderation_events (id, actor, action, target_id, details) VALUES (?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), actor, action, targetId, details).run();
}

async function listIdeas(request, env) {
  const visitor = await currentVisitor(request, env);
  const sort = new URL(request.url).searchParams.get('sort') === 'new' ? 'new' : 'popular';
  const query = 'SELECT i.id, i.title, i.description, i.genre, i.nickname, i.created_at, ' +
    '(SELECT COUNT(*) FROM idea_votes v WHERE v.idea_id = i.id) AS supporters, ' +
    '(SELECT COUNT(*) FROM idea_votes v WHERE v.idea_id = i.id AND v.visitor_id = ?) AS supported ' +
    'FROM ideas i WHERE i.status = ? ORDER BY ' +
    (sort === 'new' ? 'i.created_at DESC' : 'supporters DESC, i.created_at DESC') + ' LIMIT 100';
  const result = await env.DB.prepare(query).bind(visitor?.id || '', 'approved').all();
  return json(request, env, { ideas: result.results || [] });
}
async function currentPoll(request, env) {
  const now = new Date().toISOString();
  const poll = await env.DB.prepare(
    'SELECT id, title, status, starts_at, ends_at FROM polls ' +
    "WHERE status IN ('active','scheduled') AND starts_at <= ? AND ends_at > ? " +
    'ORDER BY starts_at DESC LIMIT 1'
  ).bind(now, now).first();
  if (!poll) return json(request, env, { poll: null });
  const visitor = await currentVisitor(request, env);
  const result = await env.DB.prepare(
    'SELECT o.id, o.title, (SELECT COUNT(*) FROM poll_votes v WHERE v.option_id = o.id) AS votes ' +
    'FROM poll_options o WHERE o.poll_id = ? ORDER BY o.rowid ASC'
  ).bind(poll.id).all();
  const voted = visitor ? await env.DB.prepare(
    'SELECT option_id FROM poll_votes WHERE poll_id = ? AND visitor_id = ?'
  ).bind(poll.id, visitor.id).first() : null;
  return json(request, env, { poll: { ...poll, options: result.results || [], votedOptionId: voted?.option_id || null } });
}
async function listRoadmap(request, env) {
  const result = await env.DB.prepare(
    "SELECT id, title, status, summary, release_url, updated_at FROM roadmap " +
    "ORDER BY CASE status WHEN 'building' THEN 0 WHEN 'playtesting' THEN 1 " +
    "WHEN 'planned' THEN 2 ELSE 3 END, updated_at DESC LIMIT 40"
  ).all();
  return json(request, env, { roadmap: result.results || [] });
}
async function submitIdea(request, env) {
  const body = await readBody(request);
  const item = normalizeIdea(body);
  await verifyChallenge(body, env);
  await rateLimit(request, env, 'idea', 5);
  const visitor = await ensureVisitor(request, env);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO ideas (id, title, description, genre, nickname) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, item.title, item.description, item.genre, item.nickname).run();
  return json(request, env, { ok: true, id, status: 'pending', ...guestResult(visitor) }, 201);
}
async function supportIdea(request, env, id) {
  const body = await readBody(request);
  if (typeof body.support !== 'boolean') fail(400, 'support must be true or false.');
  await verifyChallenge(body, env);
  await rateLimit(request, env, 'support', 100);
  const idea = await env.DB.prepare("SELECT id FROM ideas WHERE id = ? AND status = 'approved'").bind(id).first();
  if (!idea) fail(404, 'Idea not found.');
  const visitor = await ensureVisitor(request, env);
  if (body.support) {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO idea_votes (idea_id, visitor_id) VALUES (?, ?)'
    ).bind(id, visitor.id).run();
  } else {
    await env.DB.prepare(
      'DELETE FROM idea_votes WHERE idea_id = ? AND visitor_id = ?'
    ).bind(id, visitor.id).run();
  }
  return json(request, env, { ok: true, supported: body.support, ...guestResult(visitor) });
}
async function castVote(request, env, pollId) {
  const body = await readBody(request);
  if (typeof body.optionId !== 'string' || !/^[a-f0-9-]{36}$/.test(body.optionId)) {
    fail(400, 'Invalid option.');
  }
  await verifyChallenge(body, env);
  await rateLimit(request, env, 'poll', 50);
  const poll = await env.DB.prepare('SELECT * FROM polls WHERE id = ?').bind(pollId).first();
  if (!isPollOpen(poll)) fail(409, 'This poll is closed.');
  const option = await env.DB.prepare('SELECT id FROM poll_options WHERE id = ? AND poll_id = ?')
    .bind(body.optionId, pollId).first();
  if (!option) fail(400, 'Invalid option for this poll.');
  const visitor = await ensureVisitor(request, env);
  await env.DB.prepare(
    'INSERT INTO poll_votes (poll_id, visitor_id, option_id) VALUES (?, ?, ?) ' +
    'ON CONFLICT(poll_id, visitor_id) DO UPDATE SET option_id = excluded.option_id, updated_at = datetime(\'now\')'
  ).bind(pollId, visitor.id, body.optionId).run();
  return json(request, env, { ok: true, votedOptionId: body.optionId, ...guestResult(visitor) });
}

async function adminOverview(request, env) {
  const [ideas, approved, polls, roadmap] = await Promise.all([
    env.DB.prepare("SELECT id, title, description, genre, nickname, created_at FROM ideas WHERE status = 'pending' ORDER BY created_at LIMIT 100").all(),
    env.DB.prepare("SELECT id, title, genre FROM ideas WHERE status = 'approved' ORDER BY created_at DESC LIMIT 200").all(),
    env.DB.prepare('SELECT id, title, status, starts_at, ends_at FROM polls ORDER BY created_at DESC LIMIT 30').all(),
    env.DB.prepare('SELECT id, title, summary, status, release_url FROM roadmap ORDER BY updated_at DESC LIMIT 40').all()
  ]);
  return json(request, env, {
    pending: ideas.results || [], approved: approved.results || [],
    polls: polls.results || [], roadmap: roadmap.results || []
  });
}
async function moderateIdea(request, env, actor, id) {
  const body = await readBody(request);
  if (!IDEA_STATES.has(body.status)) fail(400, 'Invalid idea status.');
  const result = await env.DB.prepare('UPDATE ideas SET status = ? WHERE id = ?')
    .bind(body.status, id).run();
  if (!result.meta?.changes) fail(404, 'Idea not found.');
  await audit(env, actor, 'idea.' + body.status, id);
  return json(request, env, { ok: true });
}
async function createPoll(request, env, actor) {
  const body = await readBody(request);
  const poll = validatePollSetup(body);
  const overlap = await env.DB.prepare(
    "SELECT id FROM polls WHERE status != 'closed' AND ends_at > ? AND starts_at < ? LIMIT 1"
  ).bind(poll.startsAt, poll.endsAt).first();
  if (overlap) fail(409, 'Another scheduled or active poll overlaps these dates.');
  const placeholders = poll.ideaIds.map(() => '?').join(',');
  const ideas = await env.DB.prepare(
    "SELECT id, title FROM ideas WHERE status = 'approved' AND id IN (" + placeholders + ')'
  ).bind(...poll.ideaIds).all();
  if ((ideas.results || []).length !== poll.ideaIds.length) fail(400, 'All candidates must be approved ideas.');
  const byId = new Map(ideas.results.map(item => [item.id, item]));
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const writes = [
    env.DB.prepare('INSERT INTO polls (id, title, status, starts_at, ends_at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, poll.title, poll.startsAt <= now ? 'active' : 'scheduled', poll.startsAt, poll.endsAt),
    ...poll.ideaIds.map(ideaId => env.DB.prepare(
      'INSERT INTO poll_options (id, poll_id, idea_id, title) VALUES (?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), id, ideaId, byId.get(ideaId).title))
  ];
  await env.DB.batch(writes);
  await audit(env, actor, 'poll.created', id, poll.title);
  return json(request, env, { ok: true, id }, 201);
}
async function closePoll(request, env, actor, id) {
  const result = await env.DB.prepare("UPDATE polls SET status = 'closed' WHERE id = ? AND status != 'closed'")
    .bind(id).run();
  if (!result.meta?.changes) fail(404, 'Open poll not found.');
  await audit(env, actor, 'poll.closed', id);
  return json(request, env, { ok: true });
}
async function saveRoadmap(request, env, actor) {
  const body = await readBody(request);
  const id = typeof body.id === 'string' && /^[a-f0-9-]{36}$/.test(body.id) ? body.id : crypto.randomUUID();
  const title = clean(body.title, 100);
  const summary = clean(body.summary || '', 500);
  const status = body.status;
  const releaseUrl = clean(body.releaseUrl || '', 250);
  if (title.length < 3 || title.length > 100 || summary.length > 500 || !ROADMAP_STATES.has(status)) {
    fail(400, 'Invalid roadmap item.');
  }
  if (releaseUrl && (!releaseUrl.startsWith('https://') || !/^https:\/\/[^\s]+$/.test(releaseUrl))) {
    fail(400, 'Release URL must be HTTPS.');
  }
  await env.DB.prepare(
    'INSERT INTO roadmap (id, title, summary, status, release_url) VALUES (?, ?, ?, ?, ?) ' +
    'ON CONFLICT(id) DO UPDATE SET title = excluded.title, summary = excluded.summary, ' +
    'status = excluded.status, release_url = excluded.release_url, updated_at = datetime(\'now\')'
  ).bind(id, title, summary, status, releaseUrl).run();
  await audit(env, actor, 'roadmap.saved', id, title);
  return json(request, env, { ok: true, id });
}

async function handle(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (request.method === 'OPTIONS' && path.startsWith('/api/')) {
    if (!allowedOrigin(request, env)) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: publicHeaders(request, env) });
  }
  if (path === '/api/config' && request.method === 'GET') {
    return json(request, env, {
      enabled: Boolean(env.DB && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET && env.RATE_SALT),
      siteKey: env.TURNSTILE_SITE_KEY || ''
    });
  }
  if (!env.DB) fail(503, 'Community database has not been configured.');
  if (path === '/admin' || path.startsWith('/api/admin/')) {
    const actor = await requireAdmin(env, ctx);
    if (path === '/admin' && request.method === 'GET') {
      return new Response(adminPage, { headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'",
        'X-Frame-Options': 'DENY'
      } });
    }
    if (path === '/api/admin/overview' && request.method === 'GET') return adminOverview(request, env);
    if (path === '/api/admin/polls' && request.method === 'POST') return createPoll(request, env, actor);
    if (path === '/api/admin/roadmap' && request.method === 'POST') return saveRoadmap(request, env, actor);
    const mod = path.match(/^\/api\/admin\/ideas\/([a-f0-9-]{36})\/status$/);
    if (mod && request.method === 'POST') return moderateIdea(request, env, actor, mod[1]);
    const close = path.match(/^\/api\/admin\/polls\/([a-f0-9-]{36})\/close$/);
    if (close && request.method === 'POST') return closePoll(request, env, actor, close[1]);
    fail(404, 'Not found.');
  }
  if (path === '/api/ideas' && request.method === 'GET') return listIdeas(request, env);
  if (path === '/api/ideas' && request.method === 'POST') return submitIdea(request, env);
  if (path === '/api/polls/current' && request.method === 'GET') return currentPoll(request, env);
  if (path === '/api/roadmap' && request.method === 'GET') return listRoadmap(request, env);
  const support = path.match(/^\/api\/ideas\/([a-f0-9-]{36})\/support$/);
  if (support && request.method === 'POST') return supportIdea(request, env, support[1]);
  const vote = path.match(/^\/api\/polls\/([a-f0-9-]{36})\/vote$/);
  if (vote && request.method === 'POST') return castVote(request, env, vote[1]);
  fail(404, 'Not found.');
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle(request, env, ctx);
    } catch (error) {
      if (!(error instanceof HttpError)) console.error('Community API failure:', error);
      return json(request, env, { error: error instanceof HttpError ? error.message : 'Internal server error.' },
        error instanceof HttpError ? error.status : 500);
    }
  },
  async scheduled(event, env) {
    if (env.DB) {
      await env.DB.prepare('DELETE FROM abuse_limits WHERE expires_at < ?')
        .bind(new Date().toISOString()).run();
    }
  }
};
