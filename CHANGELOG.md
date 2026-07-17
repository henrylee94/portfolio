# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-07-17

First tagged release. The portfolio is live at https://henrylee94.github.io/portfolio/.

### Added
- Multi-page portfolio: hero + numbers, selected work (`work-*.html`: backbone,
  scale, support, pipeline, ingestion, crypto, reporting), how I think / lead,
  field notes, AI engineering (`ai.html`), home lab (`lab.html`).
- Full **中文 mirror** of every page (`zh-*.html`) with an EN/中文 switch.
- GSAP + ScrollTrigger motion (`js/animations.js`), reduced-motion aware.
- Self-made SVG architecture diagrams for the case studies.
- Repo scaffolding: README, LICENSE (MIT), this changelog, `package.json`,
  `SKILL.md` / `AGENTS.md`, `SECURITY` / `CONTRIBUTING` / `CODE_OF_CONDUCT`,
  issue + PR templates, `.editorconfig`, `robots.txt`, `sitemap.xml`, `404.html`,
  and CI (`scripts/check.mjs`: syntax + link + EN/zh-parity checks).

### Notes
- All content honors an internal do-not-publish list — no real names, employer,
  industry specifics, IPs, phone numbers, or financial data.

[Unreleased]: https://github.com/henrylee94/portfolio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/henrylee94/portfolio/releases/tag/v1.0.0
