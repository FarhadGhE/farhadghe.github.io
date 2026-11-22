#!/usr/bin/env node
// Checks the built site in dist/ (docs/adr/0001-static-site-stack.md). Run `npm run build` first.
//   npm run check               the offline checks
//   npm run check -- --online   also requests every outside link and reports its HTTP status
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const online = process.argv.includes('--online');
const BUDGET = 300 * 1024; // the first screen, before anything is clicked or scrolled (manage repo, FirstVersion r01)

let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL  ${msg}`); };
const ok = (msg) => console.log(`  ok    ${msg}`);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

if (!existsSync(dist)) { console.error('No dist/ yet: run `npm run build` first.'); process.exit(1); }

const files = [];
const walk = (d) => {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p); else files.push({ path: p, rel: relative(dist, p).split('\\').join('/'), size: s.size });
  }
};
walk(dist);
const byRel = new Map(files.map((f) => [f.rel, f]));
console.log(`dist/: ${files.length} files, ${kb(files.reduce((a, f) => a + f.size, 0))} in all\n`);

// 1. The neighbour's path stays free.
console.log('Paths');
const clash = files.filter((f) => f.rel.split('/')[0].toLowerCase() === 'spacetime-slicer');
if (clash.length) fail(`dist/ has a spacetime-slicer/ path, which belongs to the Spacetime Slicer repo: ${clash.map((f) => f.rel).join(', ')}`);
else ok('no spacetime-slicer/ path');
const exts = [...new Set(files.map((f) => extname(f.rel) || '(none)'))].sort();
const allowed = new Set(['.html', '.css', '.js', '.woff2', '.woff', '.svg', '.webp', '.avif', '.jpg', '.jpeg', '.png', '.ico', '.mp4', '.webm', '.txt', '.xml', '.json', '.webmanifest', '.md']);
const odd = exts.filter((e) => !allowed.has(e));
if (odd.length) fail(`unexpected file types for a static site: ${odd.join(', ')}`); else ok(`static files only: ${exts.join(' ')}`);
for (const f of files.filter((f) => f.size > 2 * 1024 * 1024)) fail(`${f.rel} is ${kb(f.size)}, over 2 MB`);

// 2. Every page: its links, its anchors, its words.
const pages = files.filter((f) => f.rel.endsWith('.html'));
const html = new Map(pages.map((p) => [p.rel, readFileSync(p.path, 'utf8')]));
const idsOf = (src) => new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const resolvePage = (path) => {
  const clean = decodeURI(path.split(/[?#]/)[0]).replace(/^\//, '');
  for (const c of [clean, `${clean}index.html`, `${clean}/index.html`, `${clean}.html`]) if (byRel.has(c)) return c;
  return null;
};
const visibleText = (src) => src
  .replace(/<(script|style|template|svg)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"')
  .replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014')
  .replace(/\s+/g, ' ');
const outside = new Map();
for (const [rel, src] of html) {
  console.log(`\n${rel}`);
  const ids = idsOf(src);
  const refs = [...src.matchAll(/\s(?:href|src|poster|data-src)="([^"]+)"/g)].map((m) => m[1])
    .concat([...src.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])));
  let bad = 0;
  for (const r of refs) {
    if (/^https?:\/\//.test(r)) { if (!outside.has(r)) outside.set(r, rel); continue; }
    if (/^(mailto:|tel:|data:|javascript:)/.test(r)) continue;
    if (r.startsWith('#')) { if (r.length > 1 && !ids.has(decodeURIComponent(r.slice(1)))) { bad++; fail(`${r}: no element with that id`); } continue; }
    if (r.startsWith('/')) {
      const target = resolvePage(r);
      if (!target) { bad++; fail(`${r}: no such file in dist/`); continue; }
      const hash = r.split('#')[1];
      if (hash && target.endsWith('.html') && !idsOf(html.get(target)).has(hash)) { bad++; fail(`${r}: no #${hash} on ${target}`); }
    }
  }
  if (!bad) ok(`${refs.length} links and sources resolve`);
  const text = visibleText(src);
  const dashes = [...text.matchAll(/.{0,40}\u2014.{0,40}/g)].map((m) => m[0].trim());
  if (dashes.length) dashes.forEach((d) => fail(`em-dash in the words: "${d}"`)); else ok('no em-dash in the words');
  if (!/<html[^>]*\slang="[a-z-]+"/i.test(src)) fail('no lang on <html>'); else ok('the page declares its language');
  const h1 = (src.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(`${h1} <h1> elements, expected 1`); else ok('one <h1>');
  const noAlt = [...src.matchAll(/<img\b(?![^>]*\salt=)[^>]*>/g)];
  if (noAlt.length) fail(`${noAlt.length} <img> without alt`); else ok('every <img> has alt');
}

// 3. The first screen's weight: the page, its CSS, its scripts, the fonts a Latin page uses, and what loads eagerly.
console.log('\nWeight of index.html before any click or scroll');
const index = html.get('index.html');
if (index) {
  const parts = new Map([['index.html', byRel.get('index.html').size]]);
  const add = (r) => { const t = resolvePage(r); if (t && !parts.has(t)) parts.set(t, byRel.get(t).size); return t; };
  const css = [...index.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g), ...index.matchAll(/<link[^>]+href="([^"]+)"[^>]*rel="stylesheet"/g)].map((m) => m[1]);
  const scripts = [...index.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const preloads = [...index.matchAll(/<link[^>]+rel="(?:preload|modulepreload)"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const eagerImgs = [...index.matchAll(/<img\b([^>]*)>/g)].filter((m) => !/loading="lazy"/.test(m[1]))
    .map((m) => (m[1].match(/\ssrc="([^"]+)"/) || [])[1]).filter(Boolean);
  const inlineCss = [...index.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const cssText = [inlineCss, ...css.map((h) => { const t = add(h); return t ? readFileSync(join(dist, t), 'utf8') : ''; })].join('\n');
  [...scripts, ...preloads, ...eagerImgs].forEach(add);
  // Fonts: only the Latin subset (unicode-range from U+0000-00FF, which the minifier writes U+??) is fetched for this page's words.
  for (const m of cssText.matchAll(/@font-face\s*{([^}]*)}/g)) {
    const block = m[1];
    if (!/unicode-range:\s*U\+(?:0+-0*FF\b|\?\?(?![0-9A-F?]))/i.test(block)) continue;
    const url = (block.match(/url\(([^)]+\.woff2)\)/) || [])[1];
    if (url) add(url.replace(/["']/g, ''));
  }
  // Background images set in the page or its CSS (the portrait's layers use one image).
  for (const m of (index + cssText).matchAll(/url\((?:&quot;|["'])?(\/_astro\/[^)"'&]+\.(?:webp|avif|jpg|png))/g)) add(m[1]);
  let total = 0;
  for (const [rel, size] of [...parts].sort((a, b) => b[1] - a[1])) { total += size; console.log(`        ${kb(size).padStart(9)}  ${rel}`); }
  if (total > BUDGET) fail(`first screen ${kb(total)}, over the ${kb(BUDGET)} budget`); else ok(`first screen ${kb(total)}, within the ${kb(BUDGET)} budget (uncompressed; Pages also gzips)`);
}

// 4. Outside links.
console.log(`\nOutside links: ${outside.size}`);
if (online) {
  for (const [url, page] of outside) {
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) fargh.com link check' } });
      if (res.status >= 400) fail(`${res.status} ${url} (on ${page})`); else ok(`${res.status} ${url}`);
    } catch (e) { fail(`${url}: ${e.message} (on ${page})`); }
  }
} else {
  for (const url of outside.keys()) console.log(`        ${url}`);
  console.log('        (add -- --online to request each one)');
}

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
