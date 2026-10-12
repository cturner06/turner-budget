// Turner Budget — push only.
// There is deliberately no fetch handler here. The last service worker
// cached HTML and served a stale sign-in page for two days; this one
// cannot touch page loads at all.
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = { title: 'Turner Budget', body: '', url: 'https://budget.turnerjonesmgmt.com' };
  try { d = { ...d, ...e.data.json() }; } catch { if (e.data) d.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: d.kind || 'budget',
    data: { url: d.url },
    requireInteraction: d.kind === 'went_unpaid',
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.location.origin) && 'focus' in c) return c.focus();
    return clients.openWindow(url);
  }));
});
