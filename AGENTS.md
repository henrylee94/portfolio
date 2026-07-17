# AGENTS.md

Guidance for AI coding agents working in this repository.

**Read [`SKILL.md`](SKILL.md) first** — the authoritative project guide.

## Quick facts

- Static, **multi-page**, bilingual (EN + `zh-*`) portfolio. No build step, no backend.
- Styles in `css/styles.css`; JS in `js/` (external, not inline). GSAP from a pinned CDN.
- **Bilingual parity:** mirror every content change between an EN page and its `zh-*` twin.
- Motion is progressive enhancement — the site must read fully with JS/animations off
  (`js/animations.js` is `prefers-reduced-motion` aware).

## Verify before pushing

```bash
node scripts/check.mjs      # JS syntax (inline + js/*.js) + local link integrity
npx serve .                 # click through in a real browser
```

## Do-not-publish (non-negotiable)

Never commit real names, employer/industry, internal project names, IPs, phone
numbers, API keys, or financial data. Map real-money/gaming terms to neutral
fintech language. Grep before pushing.

## Account

This repo is owned by the **personal** GitHub account `henrylee94`. Operate as that
account (not the company one).
