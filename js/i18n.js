/* Lightweight i18n: one set of English pages + a zh dictionary (js/i18n-zh.js).
   Toggles text in place, persists in localStorage, falls back to English for
   any string not in the dictionary. No build step, works on file:// and http. */
(function () {
  var DICT = window.I18N_ZH || {};
  var orig = new Map();               // textNode -> original English value
  var btn;

  function walk(fn) {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n; while ((n = w.nextNode())) fn(n);
  }
  function toZh() {
    walk(function (n) {
      var t = n.nodeValue.trim();
      if (!t) return;
      if (!orig.has(n)) orig.set(n, n.nodeValue);
      if (DICT[t]) n.nodeValue = n.nodeValue.replace(t, DICT[t]);
    });
    document.documentElement.lang = 'zh';
  }
  function toEn() {
    orig.forEach(function (v, n) { n.nodeValue = v; });
    document.documentElement.lang = 'en';
  }
  function apply(lang) {
    if (lang === 'zh') toZh(); else toEn();
    if (btn) btn.textContent = (lang === 'zh') ? 'EN' : '中';
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }
  function toggle() { apply((localStorage.getItem('lang') === 'zh') ? 'en' : 'zh'); }

  document.addEventListener('DOMContentLoaded', function () {
    btn = document.querySelector('[data-action="toggle-lang"]');
    if (btn) { btn.removeAttribute('href'); btn.addEventListener('click', function (e) { e.preventDefault(); toggle(); }); }
    var saved = 'en';
    try { saved = localStorage.getItem('lang') || 'en'; } catch (e) {}
    if (saved === 'zh') apply('zh'); else if (btn) btn.textContent = '中';
  });
}());
