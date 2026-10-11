// Turner Budget service worker.
// The shell is cached so the app opens instantly and shows the sign-in
// screen even on a dead signal. Supabase calls always go to the network.
const V = 'tb-v2';
const SHELL = ['/', '/index.html',
               '/images/manifest.webmanifest',
               '/images/icon-192.png', '/images/icon-512.png',
               '/images/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== V).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.origin !== location.origin) return;      // Supabase, fonts, CDN: straight to network
  e.respondWith(
    fetch(r)
      .then(res => { const copy = res.clone();
        caches.open(V).then(c => c.put(r, copy)); return res; })
      .catch(() => caches.match(r).then(hit => hit || caches.match('/index.html')))
  );
});
