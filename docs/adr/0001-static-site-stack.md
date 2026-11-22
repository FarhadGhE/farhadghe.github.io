# ADR 0001: The static site stack

- **Status:** accepted on 2026-11-04. The user's go on the manage repo's summary for the coordination FirstVersion,
  round 01, which recommended Astro: "A · Spacetime, go (Recommended)".
- **Context and evidence:** the manage repo's `coordinations/2026-11-04_16-48-FirstVersion/round01/summary-v1.md`
  (§2 "The stack", §4 "Constraints and their sources") and `coordinator-log.md`.

## Context

The site is being redesigned from scratch. In 2021 it was a Jekyll blog on the Chirpy theme, with one About page and
no posts, built by `.github/workflows/pages-deploy.yml` into `gh-pages` and served by GitHub Pages at fargh.com.

The user's requirements for the stack, in their words:

- "It runs here with what this Mac already has, builds to static files that GitHub Pages can host later, and leaves
  /spacetime-slicer/ and [round1.fargh.com] alone." (The address in brackets is the game's current one; the user
  named the one it had then.)
- "no installs outside REPO_WEB, and $0."
- "It works on a phone and on a desktop, loads fast, and is accessible."

What the machine has (2026-11-04): Node 24.19, npm 11.17 and pnpm 10.10; Python 3.9.6; the system Ruby 2.6.10 with
bundler 1.17.2, and no Jekyll.

What the site needs: the words in their own files, so they can be reviewed and changed apart from the design (the
manage repo's Content and Design experts own different paths); images resized and converted for speed; no JavaScript
except where a component needs it.

## Options

| | **Astro 7.4** | Eleventy 3.1 | No build (plain HTML) | Jekyll 4.4 |
|---|---|---|---|---|
| Runs with this machine's tools | Yes: it needs Node ≥ 22.23.4 (https://www.npmjs.com/package/astro) | Yes | Yes | No: jekyll 4.4.1 needs Ruby ≥ 2.7.0 (https://rubygems.org/gems/jekyll/versions/4.4.1), and a newer Ruby is an install outside the repo |
| Static files for Pages | `dist/` | `_site/` | the folder itself | `_site/` |
| Words apart from the design | Markdown content collections with a checked schema | Markdown and data files | No: the words live inside the HTML | Yes |
| Images | Built in, through sharp | A plugin, through sharp | By hand | Plugins |
| JavaScript shipped by default | None | None | None | None |
| Licence | MIT | MIT | none needed | MIT |

## Decision

1. **Astro 7.4.5, static output.** `npm run build` writes plain files to `dist/`: HTML, CSS, a little JavaScript,
   fonts, images and media. No server code.
2. **One command.** `npm start` (`tools/start.mjs`) runs `npm ci` when `node_modules/` is missing or older than
   `package-lock.json`, then starts the dev server, which prints `http://localhost:4321/`. `npm run preview` serves the
   built `dist/` as Pages would. `npm run check` checks `dist/` (`tools/check-dist.mjs`).
3. **Nothing outside the repo.** Dependencies go into `node_modules/`, and `.npmrc` keeps npm's download cache and logs
   in `.npm-cache/`; both are ignored by Git. Every Astro command runs through `tools/astro.mjs` with
   `ASTRO_TELEMETRY_DISABLED=1`, so Astro sends no telemetry and writes no settings in the user's home. Images are
   processed by sharp, whose prebuilt binaries come from npm into `node_modules/` (`@img/sharp-darwin-arm64`).
4. **Fonts are self-hosted** from Fontsource's npm packages (`@fontsource-variable/geist`,
   `@fontsource-variable/geist-mono`, OFL-1.1): no request to a font service.
5. **The words** are Markdown files with front matter in `src/content/`, checked by the schema in
   `src/content.config.ts`. Media that the build processes sits beside them in `src/content/media/`; media copied as
   it is (video, SVG) sits in `public/media/`.
6. **The rest of `src/`** (layouts, components, pages, styles and scripts) and `public/` outside `public/media/` render
   the site.
7. **The neighbours stay alone.** `https://fargh.com/spacetime-slicer/` is the Spacetime Slicer repo's own Pages site
   under the same domain, so this site never creates a `spacetime-slicer/` path (`npm run check` fails if `dist/` has
   one). `round1.fargh.com`, the Round1 game's own server, is a DNS record this repo doesn't touch.
8. **YouTube loads only on a click**, from `youtube-nocookie.com`; until then the page shows a self-hosted thumbnail.
   No analytics and no cookies of the site's own.

## Consequences

- Building needs Node ≥ 22.23.4. A machine without it can't build the site.
- `.github/workflows/pages-deploy.yml`, `tools/test.sh` and `tools/deploy.sh` still build the old Jekyll site, which is
  gone from this branch. Before the redesign is published, a later round must replace them (Astro's GitHub Pages
  workflow: https://docs.astro.build/en/guides/deploy/github/), decide how `CNAME` reaches the published files, and
  retire the old cache-first service worker at `/sw.js` with one that clears its cache and unregisters itself.
- The Round1 pictures in `public/media/round1/` come from the game's private repo (`art/`, every picture AI-made, see
  `public/media/round1/CREDITS.md`). They become public when this branch is pushed to this public repo.
