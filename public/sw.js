// Development-only service worker - does nothing
console.log('Development SW loaded - no caching in dev mode');

// Immediately unregister this service worker
self.addEventListener('install', event => {
  console.log('Dev SW installing - will unregister');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Dev SW activating - clearing all caches');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
      return self.registration.unregister();
    })
  );
});

// Don't intercept any requests in development
self.addEventListener('fetch', event => {
  // Just let the request pass through
  return;
});