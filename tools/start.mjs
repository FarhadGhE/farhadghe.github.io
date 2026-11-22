#!/usr/bin/env node
// `npm start`, the one command: installs the dependencies into this repo when they are missing or older than the
// lockfile, then starts the dev server, which prints the address to open (http://localhost:4321/).
// Nothing is installed outside the repo: .npmrc keeps npm's cache in .npm-cache/ (docs/adr/0001-static-site-stack.md).
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lock = join(root, 'package-lock.json');
const installed = join(root, 'node_modules', '.package-lock.json');

const stale = !existsSync(join(root, 'node_modules', 'astro')) || !existsSync(installed)
  || (existsSync(lock) && statSync(lock).mtimeMs > statSync(installed).mtimeMs);

if (stale) {
  console.log('\nInstalling the site\'s dependencies into node_modules/ (only when they are missing or out of date)...\n');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const r = spawnSync(npm, [existsSync(lock) ? 'ci' : 'install', '--no-audit'], {
    cwd: root, stdio: 'inherit', shell: process.platform === 'win32',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('\nStarting fargh.com. Open the "Local" address below; Ctrl+C stops it.\n');
const r = spawnSync(process.execPath, [join(root, 'tools', 'astro.mjs'), 'dev', ...process.argv.slice(2)], {
  cwd: root, stdio: 'inherit',
});
process.exit(r.status ?? 0);
