/* Return-to-Arcade control for packaged, same-origin games. */
(() => {
  'use strict';
  const root = '/arcade/';
  if (location.pathname === root || location.pathname === root + 'index.html') return;
  const create = () => {
    if (document.getElementById('hamboneReturn')) return;
    const link = document.createElement('a');
    link.id = 'hamboneReturn';
    link.href = root + '#games';
    link.textContent = '‹ Arcade';
    link.setAttribute('aria-label', 'Return to Hambone Arcade games');
    link.style.cssText = [
      'position:fixed', 'left:max(10px,env(safe-area-inset-left))',
      'bottom:max(10px,env(safe-area-inset-bottom))', 'z-index:2147483647',
      'display:flex', 'align-items:center', 'justify-content:center',
      'min-width:78px','min-height:42px','padding:8px 13px',
      'font:700 12px/1.1 system-ui,-apple-system,BlinkMacSystemFont,sans-serif',
      'text-decoration:none','color:#101724','background:rgba(255,198,90,.94)',
      'border:1px solid #f8dfa6','border-radius:999px',
      'box-shadow:0 8px 25px rgba(0,0,0,.35)','touch-action:manipulation'
    ].join(';');
    document.body.appendChild(link);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', create, {once:true});
  } else {
    create();
  }
})();
