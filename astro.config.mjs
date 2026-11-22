// Astro's configuration. The decisions behind it are in docs/adr/0001-static-site-stack.md.
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The site's address once published. Nothing here publishes it.
  site: 'https://fargh.com',
  // Static files only: GitHub Pages serves dist/ as it is.
  output: 'static',
  build: {
    // /404.html for GitHub Pages; every other page as a folder with index.html.
    format: 'directory',
  },
  // No toolbar over the page while you review it.
  devToolbar: { enabled: false },
  server: { port: 4321 },
});
