# Henry Lee — Portfolio

[![Live](https://img.shields.io/badge/live-henrylee94.github.io%2Fportfolio-4de3ff?style=flat)](https://henrylee94.github.io/portfolio/)
[![License: MIT](https://img.shields.io/badge/license-MIT-f0a63c?style=flat)](LICENSE)
![No build step](https://img.shields.io/badge/build-none%20(static)-26d07c?style=flat)

> Backend Team Lead — I design and ship the systems behind a high-concurrency,
> real-money platform, from legacy monolith to modern microservices.

The main, scannable portfolio: signature work, how I lead, field notes, and AI
engineering — in English and 中文. Companion to the interactive **[Lab](https://henrylee94.github.io/lab/)**.

**▶ Live: https://henrylee94.github.io/portfolio/**

## Pages

- `index.html` — hero, numbers, selected work, how I think / lead, contact
- `work.html` + `work-*.html` — signature case studies (backbone, scale, support,
  pipeline, ingestion, crypto, reporting)
- `ai.html` — AI-native engineering: the SDLC pipeline and the rules my agents live by
- `lab.html` — home lab & side projects
- `notes.html` — field notes
- `zh-*.html` — full 中文 mirror of every page

## Tech stack

- HTML5 / CSS3 (custom properties, dark theme) — styles in `css/styles.css`
- Vanilla JS (`js/main.js`) + [GSAP](https://gsap.com) + ScrollTrigger for motion
  (`js/animations.js`) — loaded from CDN, reduced-motion aware
- Self-made SVG architecture diagrams
- **No build step, no backend.** Hosted on GitHub Pages.

## Run locally

```bash
npx serve .        # or: python3 -m http.server 8000
```

## Deploy

GitHub Pages, `main` branch, root. `.nojekyll` serves files as-is. Any static host
works with no build command.

## License

[MIT](LICENSE) © 2026 Henry Lee — code is free to learn from; the written content
and personal branding are mine.
