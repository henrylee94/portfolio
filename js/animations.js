/**
 * animations.js — hero entrance + scroll-reveal micro-motion (GSAP + ScrollTrigger)
 * Requires: gsap.min.js, ScrollTrigger.min.js (loaded before this script, deferred).
 * Reduced-motion aware: DOM default state is already the final visible state, so on
 * prefers-reduced-motion (or missing GSAP/ScrollTrigger) we simply do nothing.
 */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return; // CDN failure: static page stays fully visible

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // final states are the default DOM — nothing to animate

  gsap.registerPlugin(ScrollTrigger);

  // ---------------------------------------------------------------------------
  // 1. Hero: simple layered entrance — no DOM restructuring (gradient text on
  //    .hero-line must never gain transformed descendants).
  // ---------------------------------------------------------------------------
  if (document.querySelector('#hero .hero-name')) {
    const tl = gsap
      .timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
      .from('#hero .hero-name .hero-line', { y: 28, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.1);

    if (document.querySelector('#hero .hero-role')) {
      tl.from('#hero .hero-role', { y: 20, opacity: 0, duration: 0.5 }, 0.45);
    }

    tl.from('.hero-positioning', { y: 20, opacity: 0, duration: 0.4 }, 0.6);

    if (document.querySelector('#hero .hero-supporting')) {
      tl.from('.hero-supporting', { y: 20, opacity: 0, duration: 0.4 }, 0.75);
    }

    const heroStats = document.querySelector('#hero .hero-stat-item')
      ? '#hero .hero-stat-item'
      : '#hero .hero-stat';

    tl.from(heroStats, { y: 16, opacity: 0, duration: 0.35, stagger: 0.05 }, 0.9)
      .from('.hero-ctas', { y: 16, opacity: 0, duration: 0.35 }, 1.05);

    if (document.querySelector('#hero .hero-scroll-cue')) {
      tl.from('.hero-scroll-cue', { opacity: 0, duration: 0.4 }, 1.2);
    }

    const heroSvg = document.querySelector('#hero .hero-diagram svg');
    if (heroSvg) {
      tl.from('.hero-visual', { x: 24, opacity: 0, duration: 0.5 }, 0.6);
      const heroWires = Array.from(heroSvg.querySelectorAll('.dg-wire')).filter(
        (w) => typeof w.getTotalLength === 'function',
      );
      if (heroWires.length) {
        heroWires.forEach((w) => {
          const len = w.getTotalLength();
          gsap.set(w, { strokeDasharray: len, strokeDashoffset: len });
        });
        tl.to(
          heroWires,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power1.inOut',
            onComplete: () =>
              gsap.set(heroWires, { clearProps: 'strokeDasharray,strokeDashoffset' }),
          },
          0.8,
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Section headings: fade-up on entry
  // ---------------------------------------------------------------------------
  gsap.utils.toArray('.section-heading').forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Scroll-reveal: fade-up with stagger for the main content blocks.
  //    clearProps removes the leftover transform so sticky case diagrams
  //    and CSS hover translations keep working after the reveal.
  // ---------------------------------------------------------------------------
  const targets = gsap.utils.toArray(
    '.about-body, .about-lines, .about-cta, .num-cell, .band-cell, .band-facts, .case, .case-mini, .case-beat, .more-work, .principle, .principle-card, .principle-line, .statement, .note-card, .demo-row, .xp-item, .tier, .lab-card, .road, .featured-card',
  );
  if (targets.length) {
    gsap.set(targets, { y: 24, opacity: 0 });

    ScrollTrigger.batch(targets, {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform',
        }),
    });
  }

  // ---------------------------------------------------------------------------
  // 3b. Ghost numerals: slow scroll-linked parallax (±30px, scrubbed) so the
  //     oversized section numbers keep drifting as long as the page moves.
  // ---------------------------------------------------------------------------
  gsap.utils.toArray('.section-num').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30 },
      {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      },
    );
  });

  // ---------------------------------------------------------------------------
  // 4. Numbers wall: count-up on scroll-into-view (once). Numeric tokens animate
  //    from 0; non-numeric parts (M, ×, +, –) stay static.
  // ---------------------------------------------------------------------------
  gsap.utils.toArray('.num-value').forEach((el) => {
    const original = el.textContent;
    // Split into alternating [text, number, text, ...] — odd indexes are numbers
    const parts = original.split(/(\d[\d,]*(?:\.\d+)?)/);
    if (parts.length < 2) return;

    const spec = parts.map((part, i) => {
      if (i % 2 === 0) return { text: part };
      return {
        target: parseFloat(part.replace(/,/g, '')),
        decimals: (part.split('.')[1] || '').length,
        grouped: part.indexOf(',') !== -1,
        value: 0,
      };
    });
    const nums = spec.filter((s) => s.text === undefined);

    const render = () => {
      el.textContent = spec
        .map((s) => {
          if (s.text !== undefined) return s.text;
          return s.value.toLocaleString('en-US', {
            minimumFractionDigits: s.decimals,
            maximumFractionDigits: s.decimals,
            useGrouping: s.grouped,
          });
        })
        .join('');
    };

    gsap.to(nums, {
      value: (i, t) => t.target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: render,
      onComplete: () => {
        el.textContent = original;
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Terminal cards: typing reveal — lines appear sequentially on first
  //    scroll-into-view; the CSS caret keeps blinking on the last line.
  // ---------------------------------------------------------------------------
  gsap.utils.toArray('.demo-terminal-body').forEach((body) => {
    const lines = body.querySelectorAll('.term-line');
    if (!lines.length) return;
    gsap.set(lines, { autoAlpha: 0 });
    gsap.to(lines, {
      autoAlpha: 1,
      duration: 0.05,
      ease: 'none',
      stagger: 0.2,
      scrollTrigger: { trigger: body, start: 'top 85%', once: true },
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Case diagrams: wire-flow draw (stroke-dashoffset) on scroll-into-view.
  //    clearProps afterwards restores CSS dash styling (e.g. .dg-wire-loop).
  // ---------------------------------------------------------------------------
  gsap.utils.toArray('.case-diagram svg').forEach((svg) => {
    if (svg.closest('.hero-diagram')) return; // hero diagram draws in its own timeline
    const wires = Array.from(svg.querySelectorAll('.dg-wire')).filter(
      (w) => typeof w.getTotalLength === 'function',
    );
    if (!wires.length) return;

    wires.forEach((w) => {
      const len = w.getTotalLength();
      gsap.set(w, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.to(wires, {
      strokeDashoffset: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power1.inOut',
      onComplete: () => gsap.set(wires, { clearProps: 'strokeDasharray,strokeDashoffset' }),
      scrollTrigger: { trigger: svg, start: 'top 80%', once: true },
    });
  });
})();
