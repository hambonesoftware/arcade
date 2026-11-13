'use strict';

const $ = id => document.getElementById(id);
const API = String(window.HAMBONE_COMMUNITY_API || '').replace(/\/+$/, '');
const GUEST_KEY = 'hambone-community-guest-v1';
const state = { connected: false, turnstileId: null, formTurnstileId: null, siteKey: '', poll: null };
let guest = '';
try { guest = localStorage.getItem(GUEST_KEY) || ''; } catch { /* local storage may be blocked */ }

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function announce(id, message) { $(id).textContent = message; }
function empty(container, message) {
  container.replaceChildren(element('p', message, 'empty-card'));
}
function remember(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return;
  guest = token;
  try { localStorage.setItem(GUEST_KEY, token); } catch { /* ephemeral identity */ }
}
function resetIdentity() {
  guest = '';
  try { localStorage.removeItem(GUEST_KEY); } catch { /* private browsing */ }
}
async function api(path, options = {}) {
  if (!API || !API.startsWith('https://')) throw new Error('The community service is not connected yet.');
  if (!navigator.onLine && options.method === 'POST') throw new Error('Connect to the internet before submitting or voting.');
  let response;
  try {
    response = await fetch(API + '/api/' + path, {
      method: options.method || 'GET',
      mode: 'cors',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', ...(guest ? { 'X-Guest-Token': guest } : {}) },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw new Error('Cannot reach the community service. Check your connection and try again.');
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && guest) {
    resetIdentity();
    if ((options.method || 'GET') === 'GET') return api(path, options);
  }
  if (!response.ok) throw new Error(data.error || 'The server could not complete your request.');
  if (data.guestToken) remember(data.guestToken);
  return data;
}
function humanToken(widgetId) {
  if (!window.turnstile || widgetId === null) {
    throw new Error('Verification is unavailable. Try reloading while online.');
  }
  const token = window.turnstile.getResponse(widgetId);
  if (!token) {
    if (!$('suggestDialog').open) $('verificationPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
    throw new Error('Please finish the quick human check before participating.');
  }
  return token;
}
let pendingWrite = false;
async function write(path, body) {
  if (pendingWrite) throw new Error('Please finish the first action before submitting another.');
  const widgetId = path === 'ideas' ? state.formTurnstileId : state.turnstileId;
  const turnstileToken = humanToken(widgetId);
  pendingWrite = true;
  try {
    return await api(path, { method: 'POST', body: { ...body, turnstileToken } });
  } finally {
    pendingWrite = false;
    if (window.turnstile && widgetId !== null) {
      window.turnstile.reset(widgetId);
    }
  }
}
function formatDate(iso) {
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) ? date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
}
function pollOption(option, poll, total) {
  const card = element('article', undefined, 'poll-option');
  const top = element('div', undefined, 'poll-head');
  const label = element('h3', option.title);
  const chosen = poll.votedOptionId === option.id;
  const button = element('button', chosen ? '✓ Your vote' : 'Vote for this');
  button.type = 'button';
  button.setAttribute('aria-pressed', String(chosen));
  button.setAttribute('aria-label', (chosen ? 'Change vote from ' : 'Vote for ') + option.title);
  button.addEventListener('click', async () => {
    if (!state.connected) return;
    button.disabled = true;
    try {
      await write('polls/' + poll.id + '/vote', { optionId: option.id });
      announce('voteMessage', 'Your choice was recorded. You can change it until the poll closes.');
      await loadPoll();
    } catch (error) {
      announce('voteMessage', error.message);
    } finally {
      button.disabled = false;
    }
  });
  top.append(label, button);
  const bar = element('div', undefined, 'poll-bar');
  const fill = element('div', undefined, 'poll-fill');
  const count = Number(option.votes) || 0;
  const percent = total > 0 ? Math.round(100 * count / total) : 0;
  fill.style.width = Math.max(0, Math.min(100, percent)) + '%';
  bar.append(fill);
  const meta = element('div', undefined, 'poll-meta');
  meta.append(element('span', count + (count === 1 ? ' vote' : ' votes')), element('span', percent + '%'));
  card.append(top, bar, meta);
  return card;
}
async function loadPoll() {
  const result = await api('polls/current');
  const box = $('pollOptions');
  box.replaceChildren();
  const poll = result.poll;
  state.poll = poll;
  if (!poll) {
    announce('pollIntro', 'No official vote is running right now. Check back when the next showdown begins.');
    empty(box, 'No active poll yet — we are collecting game ideas!');
    return;
  }
  const total = poll.options.reduce((sum, option) => sum + (Number(option.votes) || 0), 0);
  announce('pollIntro', poll.title + ' · Voting closes ' + formatDate(poll.ends_at) + ' · ' + total + ' total votes.');
  for (const option of poll.options) box.append(pollOption(option, poll, total));
}
function ideaCard(idea) {
  const card = element('article', undefined, 'idea-card');
  const meta = element('div', idea.genre + ' · Suggested by ' + idea.nickname, 'idea-meta');
  const title = element('h3', idea.title);
  const desc = element('p', idea.description);
  const bottom = element('div', undefined, 'idea-bottom');
  const button = element('button', idea.supported ? '♥ Supported' : '♡ Support');
  const supports = Number(idea.supporters) || 0;
  const count = element('small', supports + (supports === 1 ? ' supporter' : ' supporters'));
  button.type = 'button';
  button.setAttribute('aria-pressed', String(Boolean(idea.supported)));
  button.setAttribute('aria-label', (idea.supported ? 'Remove support for ' : 'Support ') + idea.title);
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      await write('ideas/' + idea.id + '/support', { support: !idea.supported });
      announce('ideaMessage', idea.supported ? 'Support removed.' : 'Your support was recorded!');
      await loadIdeas();
    } catch (error) {
      announce('ideaMessage', error.message);
    } finally {
      button.disabled = false;
    }
  });
  bottom.append(button, count);
  const report = element('details', undefined, 'report-control');
  report.append(element('summary', 'Report this suggestion'));
  const reportRow = element('div', undefined, 'report-row');
  const select = element('select');
  select.setAttribute('aria-label', 'Reason for report');
  for (const [value, label] of [['spam', 'Spam'], ['inappropriate', 'Inappropriate content'], ['off-topic', 'Off-topic']]) {
    const option = element('option', label);
    option.value = value;
    select.append(option);
  }
  const reportButton = element('button', 'Send report');
  reportButton.type = 'button';
  reportButton.addEventListener('click', async () => {
    reportButton.disabled = true;
    try {
      await write('ideas/' + idea.id + '/report', { reason: select.value });
      announce('ideaMessage', 'Report received. A moderator will review it.');
      report.open = false;
    } catch (error) {
      announce('ideaMessage', error.message);
    } finally {
      reportButton.disabled = false;
    }
  });
  reportRow.append(select, reportButton);
  report.append(reportRow);
  card.append(meta, title, desc, bottom, report);
  return card;
}
async function loadIdeas() {
  const result = await api('ideas?sort=' + encodeURIComponent($('ideaSort').value));
  const list = $('ideaList');
  list.replaceChildren();
  if (!result.ideas.length) {
    empty(list, 'No approved suggestions yet. Be the first to pitch a great game!');
    return;
  }
  for (const item of result.ideas) list.append(ideaCard(item));
}
async function loadRoadmap() {
  const result = await api('roadmap');
  const list = $('roadmapList');
  list.replaceChildren();
  if (!result.roadmap.length) {
    empty(list, 'The workshop board is empty for now. When a project wins a vote, its progress will appear here.');
    return;
  }
  for (const item of result.roadmap) {
    const card = element('article', undefined, 'roadmap-card');
    card.append(element('small', item.status), element('strong', item.title), element('p', item.summary));
    if (item.release_url) {
      const link = element('a', 'Play released game ↗');
      link.href = item.release_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.append(link);
    }
    list.append(card);
  }
}
function openForm() {
  $('formFeedback').textContent = '';
  $('suggestDialog').showModal();
  if (window.turnstile && state.siteKey && state.formTurnstileId === null) {
    state.formTurnstileId = window.turnstile.render('#formTurnstileBox', {
      sitekey: state.siteKey, theme: 'dark', action: 'community'
    });
  }
}
function closeForm() { $('suggestDialog').close(); }
$('suggestOpen').addEventListener('click', openForm);
$('suggestClose').addEventListener('click', closeForm);
$('suggestCancel').addEventListener('click', closeForm);
$('ideaSort').addEventListener('change', () => {
  loadIdeas().catch(error => announce('ideaMessage', error.message));
});
$('suggestForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  button.disabled = true;
  try {
    await write('ideas', {
      title: values.get('title'), genre: values.get('genre'),
      description: values.get('description'), nickname: values.get('nickname')
    });
    closeForm();
    form.reset();
    announce('connectionStatus', 'Your game idea was sent to the moderators. Thanks for pitching it!');
  } catch (error) {
    announce('formFeedback', error.message);
  } finally {
    button.disabled = false;
  }
});
async function showVerification(siteKey) {
  $('verificationPanel').hidden = false;
  for (let attempts = 0; attempts < 40 && !window.turnstile; attempts++) {
    await new Promise(resolve => setTimeout(resolve, 125));
  }
  if (!window.turnstile) throw new Error('Could not load human verification. Try disabling content blockers for this site.');
  state.turnstileId = window.turnstile.render('#turnstileBox', {
    sitekey: siteKey,
    theme: 'dark',
    action: 'community',
    'expired-callback': () => announce('voteMessage', 'Verification expired. Please check the box again.')
  });
}
async function initialize() {
  if (!API) {
    announce('connectionStatus', 'Community voting is being connected. Games remain playable while we finish setup.');
    empty($('pollOptions'), 'The official voting service has not launched yet.');
    empty($('ideaList'), 'Suggestions will appear once the community API is connected.');
    empty($('roadmapList'), 'The development board will appear here after setup.');
    return;
  }
  try {
    const config = await api('config');
    if (!config.enabled || !config.siteKey) throw new Error('Community service is not fully configured yet.');
    await Promise.all([loadPoll(), loadIdeas(), loadRoadmap()]);
    state.siteKey = config.siteKey;
    await showVerification(config.siteKey);
    state.connected = true;
    $('suggestOpen').disabled = false;
    announce('connectionStatus', 'Community online · No account needed');
  } catch (error) {
    announce('connectionStatus', error.message);
    if (!$('pollOptions').children.length) empty($('pollOptions'), 'Community voting is temporarily unavailable.');
    if (!$('ideaList').children.length) empty($('ideaList'), 'Suggestions are temporarily unavailable.');
    if (!$('roadmapList').children.length) empty($('roadmapList'), 'The workshop is temporarily unavailable.');
  }
}
window.addEventListener('online', () => {
  if (state.connected) announce('connectionStatus', 'Community online · No account needed');
  else initialize();
});
window.addEventListener('offline', () => announce('connectionStatus',
  'You are offline. Downloaded arcade games still work; voting and suggestions need a connection.'));
initialize();
