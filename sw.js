const CACHE_NAME = 'rosies-beauty-v12';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/tokens.css',
  '/css/base.css',
  '/css/components.css',
  '/css/animations.css',
  '/css/tab-bar.css',
  '/css/onboarding.css',
  '/css/home.css',
  '/css/auth.css',
  '/js/app.js',
  '/js/data.js',
  '/js/home.js',
  '/js/onboarding.js',
  '/js/treatment-detail.js',
  '/js/animations.js',
  '/js/book.js',
  '/js/contact.js',
  '/css/treatment-detail.css',
  '/css/book.css',
  '/css/contact.css',
  '/css/rewards.css',
  '/css/profile.css',
  '/js/rewards.js',
  '/js/profile.js',
  '/assets/icons/phosphor.css',
  '/assets/icons/Phosphor.woff2',
  '/assets/fonts/Cardo-Bold.woff2',
  '/assets/fonts/Figtree-Regular.woff2',
  '/assets/fonts/Figtree-SemiBold.woff2',
  '/js/modal.js',
  '/css/modal.css',
  '/js/supabase.js',
  '/js/auth.js',
  '/js/push.js',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(
        STATIC_ASSETS.filter((url) => {
          // Only cache files that exist; skip optional ones gracefully
          return true;
        })
      );
    }).catch((err) => {
      console.warn('[SW] Install cache failed (some assets may not exist yet):', err);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip Supabase API calls — always fetch from network
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache, update in background
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {/* Network unavailable — cache already returned */});

        return cachedResponse;
      }

      // Not in cache — fetch from network and cache it
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push: display incoming push notification
self.addEventListener('push', (event) => {
  let data = { title: "Rosie's Beauty Spa", body: 'You have a new notification' };
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data.body = event.data.text(); }
  }
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/', type: data.type || 'general' },
    actions: data.actions || []
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click: focus existing window or open new one
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  const notifType = (event.notification.data && event.notification.data.type) || 'general';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find an existing window to focus
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', notifType, url: targetUrl });
          return client.focus();
        }
      }
      // No existing window — open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl).then((client) => {
          if (client) {
            client.postMessage({ type: 'NOTIFICATION_CLICK', notifType, url: targetUrl });
          }
        });
      }
    })
  );
});
