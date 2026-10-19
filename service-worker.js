const CACHE_NAME = 'jueguitos-v7-menu-24wonders';
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/icons.js",
  "./src/board-motion.js",
  "./src/play-session.js",
  "./src/auth.js",
  "./src/sound.js",
  "./src/theme.js",
  "./src/step-counter.js",
  "./src/arcade-nav.js",
  "./src/toast.js",
  "./src/app.js",
  "./src/wow/ui.js",
  "./src/wow/dictionary.js",
  "./src/wow/levels.js",
  "./src/wow/engine.js",
  "./src/toyblast/ui.js",
  "./src/toyblast/levels.js",
  "./src/toyblast/engine.js",
  "./src/matchington/ui.js",
  "./src/matchington/mansion.js",
  "./src/matchington/levels.js",
  "./src/matchington/engine.js",
  "./src/spider/ui.js",
  "./src/spider/card-renderer.js",
  "./src/spider/engine.js",
  "./styles/toyblast.css",
  "./styles/main.css",
  "./styles/matchington.css",
  "./styles/step-counter.css",
  "./styles/refinements.css",
  "./styles/wow.css",
  "./styles/cards.css",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/avatars/rebekkah.png",
  "./assets/avatars/ellen.png",
  "./assets/avatars/susan.png",
  "./assets/avatars/trey.png",
  "./assets/avatars/steph.png",
  "./assets/avatars/daniel.png"
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
