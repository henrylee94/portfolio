---
name: henry-portfolio
description: Guide for working on Henry Lee's main portfolio — a static, multi-page, bilingual (EN/中文) site. Covers structure, conventions, deploy, and the do-not-publish rule.
---

# henry-portfolio — project guide for AI coding agents

## What this is

Henry Lee's main, scannable portfolio: a **static, multi-page** site deployed to
GitHub Pages. No build step, no backend. The interactive companion is the **Lab**
(separate repo `henrylee94/lab`, at https://henrylee94.github.io/lab/).

Live: https://henrylee94.github.io/portfolio/

## Structure

- `index.html` — landing (hero, numbers, selected work, how I think/lead, contact).
- `work.html` + `work-*.html` — case studies (backbone / scale / support / pipeline
  / ingestion / crypto / reporting).
- `ai.html`, `lab.html`, `notes.html` — AI engineering, home lab, field notes.
- `zh-*.html` — a full 中文 mirror of every page.
- `css/styles.css` — all styles (dark theme, CSS custom properties).
- `js/main.js` — nav / interactions. `js/animations.js` — GSAP + ScrollTrigger
  (loaded from CDN, **reduced-motion aware**: the DOM default is the final visible
  state, so it no-ops under `prefers-reduced-motion` or CDN failure).
- `assets/` — favicon and images.

## Conventions

- **No build tool.** Edit the HTML/CSS/JS directly. Keep CSS in `css/styles.css` and
  JS in `js/` (this site separates concerns — unlike the Lab's single-file showcases).
- **Bilingual parity:** any content change to an EN page must be mirrored in its
  `zh-*` counterpart, and vice-versa.
- **Motion is progressive enhancement:** the page must be fully readable with no JS
  and with animations disabled.
- **Verify:** run `node scripts/check.mjs` (syntax + link integrity) and click
  through in a real browser before pushing.

## Do-not-publish (hard rule)

Public, personal site. **Never** add: real names, employer/company name, industry
specifics (map real-money/gaming terms to neutral fintech language — e.g.
"high-concurrency real-money platform"), internal project/platform names, IPs,
phone numbers, API keys, or financial/trading data. Grep before every push.

## Deploy

GitHub Pages, `main` branch, root. `.nojekyll` disables Jekyll. Push → auto-rebuild.
Repo is under the **personal** account `henrylee94`.
