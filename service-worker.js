const CACHE_NAME = 'juegitos-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './styles/cards.css',
  './styles/step-counter.css',
  './styles/wow.css',
  './src/app.js',
  './src/auth.js',
  './src/sound.js',
  './src/step-counter.js',
  './src/arcade-nav.js',
  './src/spider/engine.js',
  './src/spider/card-renderer.js',
  './src/spider/ui.js',
  './src/wow/levels.js',
  './src/wow/dictionary.js',
  './src/wow/engine.js',
  './src/wow/ui.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
