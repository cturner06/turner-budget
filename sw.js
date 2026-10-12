// Turner Budget service worker — deliberately caches nothing.
// It exists only so the browser offers "Install app". Caching HTML
// cost us a stale sign-in page more than once; not worth it.
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.map(n => caches.delete(n))))
               .then(() => self.clients.claim())));
self.addEventListener('fetch', e => { /* pass straight through to the network */ });
