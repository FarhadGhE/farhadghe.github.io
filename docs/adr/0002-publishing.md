# ADR 0002: Publishing fargh.com

- **Status:** accepted on 2026-11-22. The user's go on the manage repo's summary for the coordination FirstVersion,
  round 17 ("Yes, go"), which published the redesign (Skim, version A) in place of the 2021 Jekyll blog.
- **Context and evidence:** the manage repo's `coordinations/2026-11-04_16-48-FirstVersion/round17/summary-v1.md` and
  `coordinator-log.md`.

## Decision

1. **Pages keeps serving the `gh-pages` branch**, as it did for the 2021 site, so no Pages setting changes. A push to
   `main` runs `.github/workflows/pages-deploy.yml`: `npm ci`, `npm run build`, `npm run check`, then
   `tools/deploy.sh` puts `dist/` on `gh-pages` as one fresh commit, with `CNAME` (`fargh.com`) and `.nojekyll`
   (without it Pages would run Jekyll over the files and drop Astro's `_astro/` folder).
2. **The old service worker is retired** by `public/sw.js`. The 2021 site registered a cache-first worker at `/sw.js`
   for the whole domain; browsers check that address for updates when a returning visitor comes back, install the
   new file, which deletes the old caches, unregisters itself and reloads the open tabs from the network. The new
   site registers no worker. A missing `/sw.js` would leave the old one in place. Keep the file for a year or so.
3. **The redesign reached `main` as one commit** on top of the 2021 site's last commit, with the final files of the
   local branch `feature/first-version`; the branch itself is not pushed. A normal push, no force-push on `main`.
4. **System fonts.** Skim uses the system's own sans-serif and monospace fonts, so the page loads no font file; the
   Fontsource packages of ADR 0001 point 4 are removed.

## Consequences

- The 2021 blog's addresses (`/posts/…`, `/about/`, `/tags/…`, `/feed.xml`) answer with the new 404 page.
- Undoing a publish is a revert commit on `main`: the workflow of the reverted commit runs and rebuilds what it holds.
- `https://fargh.com/spacetime-slicer/` stays the Spacetime Slicer repo's own Pages site; `npm run check` fails if
  `dist/` has a `spacetime-slicer/` path.
