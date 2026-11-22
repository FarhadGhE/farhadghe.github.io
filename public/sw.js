// Retires the 2021 blog's service worker. That one cached the old pages for the whole domain and served them first, so
// returning visitors kept seeing the old site. Browsers check /sw.js for updates on their next visit and install this
// file in its place: it deletes every cache the old one made, unregisters itself, and reloads the open tabs from the
// network. The new site registers no service worker (docs/adr/0002-publishing.md).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) await caches.delete(key);
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
  })());
});
