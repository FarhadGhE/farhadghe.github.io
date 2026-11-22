# fargh.com

Farhad Gholami's site: who I am and what I've done, and at the bottom a few small things I made in my spare time
(Round1, Spacetime Slicer, flow). Built with [Astro](https://astro.build) into static files for GitHub Pages. The
decisions behind it are in [docs/adr](docs/adr/README.md).

## Run it

```sh
npm start
```

The first run installs the dependencies into `node_modules/`. Then it starts the dev server and prints the address
to open, `http://localhost:4321/`. Edits to the words in `src/content/` show up as you save. Ctrl+C stops it.

You need Node 22.23.4 or newer. Nothing is installed outside this folder: `.npmrc` keeps npm's cache in
`.npm-cache/`, and Astro's telemetry is off ([ADR 0001](docs/adr/0001-static-site-stack.md)). npm may warn that it
held back `fsevents`' build script. Nothing is missing: `fsevents` ships a ready-made binary.

## Build

| Command | What it does |
|---|---|
| `npm run build` | writes the static site to `dist/` |
| `npm run preview` | serves `dist/` the way GitHub Pages would |
| `npm run check` | checks `dist/`: no `spacetime-slicer/` path, every in-page link lands, no em-dash in the words, the first screen's weight; `npm run check -- --online` also opens every outside link |

## Where things are

| Path | What it holds | Owner in the manage repo |
|---|---|---|
| `src/content/`, `src/content.config.ts` | the words, as Markdown drafts with their sources, and the images the build processes | Content |
| `public/media/` | media copied as they are: Round1's pictures | Content |
| `src/` (the rest), `public/` (the rest) | layouts, components, pages, styles, scripts, the favicon | Design |
| `docs/adr/`, `tools/`, `.github/`, `CNAME` | decisions, scripts, the deploy workflow | Architecture |
| `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.npmrc`, `README.md`, `LICENSE` | shared files | Architecture |

## Not in this repo

- https://fargh.com/spacetime-slicer/ is the [Spacetime Slicer](https://github.com/FarhadGhE/spacetime-slicer) repo's
  own Pages site, under the same domain. This site never makes a `spacetime-slicer/` path.
- https://round1.fargh.com is the Round1 game's own server.

## Publishing

A push to `main` publishes fargh.com: `.github/workflows/pages-deploy.yml` installs, builds, runs `npm run check` and
puts `dist/` on `gh-pages` (with `CNAME` and `.nojekyll`), which GitHub Pages serves. `public/sw.js` retires the 2021
site's service worker. The decisions are in `docs/adr/0002-publishing.md`.
