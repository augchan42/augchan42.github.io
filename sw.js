// Service worker cleanup script
// This unregisters any existing service workers from previous versions of the site

self.addEventListener('install', function(event) {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Clear all caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      // Unregister this service worker
      return self.registration.unregister();
    }).then(function() {
      // Force refresh all clients
      return clients.matchAll().then(function(clients) {
        return Promise.all(
          clients.map(function(client) {
            return client.navigate(client.url);
          })
        );
      });
    })
  );
});