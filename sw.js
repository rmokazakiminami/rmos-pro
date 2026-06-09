// Service Worker — プッシュ通知対応版
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

// ── プッシュ通知受信 ──────────────────────────────
self.addEventListener('push', event => {
  const title = 'RMOS Pro';
  const body = event.data ? event.data.text() : 'お知らせがあります。';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: './icon-192.png',
      tag: 'rmos-push',
      renotify: true
    })
  );
});

// ── 通知タップ → アプリを開く ──────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes(self.location.origin) && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/rmos-pro/');
    })
  );
});
