const CACHE_NAME = 'vidx-v5';
const urlsToCache = [
  '/',
  '/static/css/dark-mode.css',
  '/static/components/auth-modal.js',
  '/static/components/user-dropdown.js',
  '/static/js/dark-mode.js',
  '/static/js/theme-bootstrap.js',
  '/static/js/icons.js',
  '/static/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Allow the browser to handle navigations and full-page HTML requests directly.
  if (event.request.method !== 'GET') {
    return;
  }

  const acceptHeader = event.request.headers.get('accept') || '';
  if (event.request.mode === 'navigate' || acceptHeader.includes('text/html')) {
    return;
  }

  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  // Skip caching for video files (too large)
  if (event.request.url.includes('.m4v') || event.request.url.includes('.mp4')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Skip caching for auth-service.js to always get latest API configuration
  if (event.request.url.includes('/js/auth-service.js')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request.clone()).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
