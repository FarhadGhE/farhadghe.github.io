#!/usr/bin/env node
// Runs Astro from this repo with its telemetry off, so a run sends nothing and writes nothing outside the repo
// (docs/adr/0001-static-site-stack.md). Usage: node tools/astro.mjs <dev | build | preview> [astro's options]
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = join(root, 'node_modules', 'astro', 'package.json');
if (!existsSync(pkgPath)) {
  console.error('Astro is not installed yet. Run `npm start` (it installs what is missing), or `npm ci`.');
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const bin = join(dirname(pkgPath), typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.astro);

const child = spawn(process.execPath, [bin, ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
});
child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
