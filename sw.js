const CACHE_NAME = "gluecalc-cache-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./calc.js",
  "./manifest.webmanifest",
  // Add icons here if you want them cached offline:
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./datalists.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    })
  );
});

// Cache-first fetch (offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// Listen for 'updateCache' message from app.js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    self.skipWaiting();
    updateStaticAssets();
  }
});

function updateStaticAssets() {
  fetchAndCache(STATIC_ASSETS);
}

function fetchAndCache(urls) {
  caches.open(CACHE_NAME).then((cache) => {
    urls.forEach((url) => {
      fetch(url).then((response) => {
        if (response.ok) cache.put(url, response.clone());
        alert('OK ', url);
      }).catch(() => alert('Failed to fetch ' + url));
    });
  });
}
