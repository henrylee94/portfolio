# Releasing

Lightweight release discipline for this static site. (The team repo keeps
`package.json` in sync with semver branch names via CI; full Changesets is
overkill here, so this is the manual equivalent.)

## The rules

1. **Every user-visible change lands via a squash-merged PR** with a clear,
   imperative title — the squash commit becomes the changelog raw material.
2. **CHANGELOG.md is updated in the same PR** that makes the change, under an
   `## [Unreleased]` heading. One bullet per change, written for readers, not
   for git.
3. **Releases are semver tags.** When cutting a release:
   - Bump `version` in `package.json` (patch = fixes/copy, minor = new
     page/section/feature, major = redesign/restructure).
   - Rename `[Unreleased]` in `CHANGELOG.md` to `[x.y.z] - YYYY-MM-DD`.
   - Tag: `git tag vx.y.z && git push origin vx.y.z`.
4. **CI must be green** (`npm run lint-check`) before merging or tagging.

## What we deliberately skip

- No Changesets / release automation — one maintainer, no npm publish.
- No release branches — `main` is always deployable (GitHub Pages).
