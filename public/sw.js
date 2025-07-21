const CACHE_NAME = 'pokemon-palette-v1';
const STATIC_CACHE = 'pokemon-palette-static-v1';
const DYNAMIC_CACHE = 'pokemon-palette-dynamic-v1';
const MAX_CACHE_ITEMS = 50; // Maximum number of items to keep in dynamic cache

// Fallback Pokemon data for offline scenarios
const FALLBACK_POKEMON_DATA = {
  id: 1,
  name: 'bulbasaur',
  sprites: {
    front_default: '/images/fallback-pokemon.png',
  },
  types: [{ type: { name: 'grass' } }],
};

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/offline.html',
];

// Pokemon API patterns to cache
const POKEMON_API_PATTERNS = [
  /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+$/,
  /^https:\/\/pokeapi\.co\/api\/v2\/pokemon-species\/\d+$/,
  /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/master\/sprites\/pokemon\/\d+\.png$/,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Pokemon API requests
  if (POKEMON_API_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then(networkResponse => {
              // Only cache successful responses with supported protocols
              if (
                networkResponse.status === 200 &&
                (url.protocol === 'http:' || url.protocol === 'https:')
              ) {
                cache.put(request, networkResponse.clone());
                limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_ITEMS);
              }
              return networkResponse;
            })
            .catch(() => {
              // Return a fallback response for Pokemon data
              return new Response(JSON.stringify(FALLBACK_POKEMON_DATA), {
                headers: { 'Content-Type': 'application/json' },
              });
            });
        });
      })
    );
    return;
  }

  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(networkResponse => {
            // Cache successful responses with supported protocols
            if (
              networkResponse.status === 200 &&
              (url.protocol === 'http:' || url.protocol === 'https:')
            ) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, responseClone);
                limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_ITEMS);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }

            // Return a fallback for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
    );
  }
});

// Background sync for saving favorites - DISABLED until IndexedDB implementation is ready
// self.addEventListener('sync', event => {
//   if (event.tag === 'sync-favorites') {
//     event.waitUntil(syncFavorites());
//   }
// });

// async function syncFavorites() {
//   try {
//     // Get pending favorites from IndexedDB
//     const pendingFavorites = await getPendingFavorites();

//     for (const favorite of pendingFavorites) {
//       try {
//         await fetch('/api/favorites', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(favorite),
//         });

//         // Remove from pending after successful sync
//         await removePendingFavorite(favorite.id);
//       } catch (error) {
//         console.error('Failed to sync favorite:', error);
//       }
//     }
//   } catch (error) {
//     console.error('Background sync failed:', error);
//   }
// }

// Helper functions for IndexedDB operations - DISABLED until implementation is ready
// async function getPendingFavorites() {
//   // Implementation would use IndexedDB to get pending items
//   return [];
// }

// async function removePendingFavorite(id) {
//   // Implementation would remove item from IndexedDB
// }

// Function to limit cache size
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Sort keys by creation time (oldest first)
    const sortedKeys = keys.sort((a, b) => {
      const aTime = a.headers.get('date') || 0;
      const bTime = b.headers.get('date') || 0;
      return new Date(aTime) - new Date(bTime);
    });

    // Delete oldest entries to maintain size limit
    const keysToDelete = sortedKeys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}
