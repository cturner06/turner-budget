// Turner Budget service worker.
// Caches nothing on purpose — a cached sign-in page cost us hours.
// It exists so the browser offers "Install app", which needs a real
// fetch handler, so this one passes requests through and only steps
// in when the network is gone.
self.addEventListener('install',  () => self.skipWaiting());

self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.map(n => caches.delete(n))))
    .then(() => self.clients.claim())));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() =>
      e.request.mode === 'navigate'
        ? new Response(
            '<!doctype html><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<body style="font:400 16px/1.6 system-ui;padding:40px;color:#12263F;background:#FBFAF7">' +
            '<h2 style="margin:0 0 8px">No connection</h2>' +
            '<p style="color:#7A8899">Turner Budget needs the network. Try again once you are back online.</p>',
            { headers: { 'Content-Type': 'text/html' } })
        : Response.error())
  );
});
