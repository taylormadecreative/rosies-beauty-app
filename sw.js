const CACHE_NAME = 'rosies-beauty-v3';
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
