/* =============================================================
   main.js — Theme toggle, hamburger menu, smooth scroll
   ============================================================= */

(function () {
  'use strict';

  // ── Theme toggle ────────────────────────────────────────────
  function getTheme() {
    return localStorage.getItem('theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);

    // Update toggle button aria-label for accessibility
    var btn = document.querySelector('[data-action="toggle-theme"]');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.textContent = theme === 'dark' ? '☀' : '◑';
    }
  }

  function toggleTheme() {
    var current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── Language toggle ─────────────────────────────────────────
  // Handled by js/i18n.js (in-place translation via js/i18n-zh.js dictionary).
  // No page navigation, no zh-*.html mirror files.
  function initLangToggle() { /* moved to i18n.js */ }

  // ── Hamburger (mobile nav) ───────────────────────────────────
  function initHamburger() {
    var topbar = document.querySelector('.topbar');
    var hamburger = document.querySelector('[data-action="toggle-menu"]');

    if (!topbar || !hamburger) return;

    hamburger.addEventListener('click', function () {
      topbar.classList.toggle('open');
      var isOpen = topbar.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!topbar.contains(e.target)) {
        topbar.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Smooth scroll for nav anchors ───────────────────────────
  function initSmoothScroll() {
    var topbar = document.querySelector('.topbar');

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        // Close mobile menu if open
        if (topbar) topbar.classList.remove('open');

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ── Scroll progress bar (width = scroll %) ──────────────────
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ── Case-diagram flow dots (SMIL) — run only in viewport ────
  // The dots loop via SVG <animateMotion>, which ignores CSS animation
  // rules — so reduced motion and offscreen pausing are gated here.
  function initDiagramFlow() {
    var svgs = document.querySelectorAll('.case-diagram svg');
    if (!svgs.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setRunning(svg, run) {
      if (typeof svg.pauseAnimations !== 'function') return;
      if (run && !reduced) {
        svg.unpauseAnimations();
      } else {
        svg.pauseAnimations();
      }
    }

    svgs.forEach(function (svg) { setRunning(svg, false); });

    if (reduced) return; // stays paused (dots are also hidden via CSS)

    if (!('IntersectionObserver' in window)) {
      svgs.forEach(function (svg) { setRunning(svg, true); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setRunning(entry.target, entry.isIntersecting);
      });
    }, { rootMargin: '80px' });

    svgs.forEach(function (svg) { observer.observe(svg); });
  }

  // ── Boot ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Wire theme toggle
    var themeBtn = document.querySelector('[data-action="toggle-theme"]');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
      // Sync button label to current theme
      applyTheme(getTheme());
    }

    initPageCurtain();
    initLangToggle();
    initHamburger();
    initSmoothScroll();
    initScrollProgress();
    initDiagramFlow();
  });
}());
