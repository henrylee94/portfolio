# Contributing

This is a personal portfolio, so it isn't seeking feature contributions — but bug
reports, accessibility feedback, and small fixes are welcome.

## Ground rules

- **No build step.** Static HTML/CSS/JS. Styles live in `css/styles.css`, JS in `js/`.
- **Bilingual parity:** any content change to an EN page must be mirrored in its
  `zh-*` counterpart (and vice-versa). CI checks the pages exist in pairs.
- **Motion is progressive enhancement:** the site must read fully with JS/animations
  off (`js/animations.js` honors `prefers-reduced-motion`).
- **Match the surrounding style.**

## Before you open a PR

```bash
node scripts/check.mjs      # JS syntax + local links + EN/zh parity
npx serve .                 # click through in a real browser
```

See [`SKILL.md`](SKILL.md) for the full project guide.
