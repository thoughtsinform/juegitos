const CACHE_NAME = 'jueguitos-v10-appstore-polish';
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          fetch(new Request(url, { cache: 'reload' }))
            .then((res) => (res.ok ? cache.put(url, res) : undefined))
            .catch(() => {})
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      let hadOldCache = false;
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            hadOldCache = true;
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
      if (hadOldCache) {
        const windowClients = await self.clients.matchAll({ type: 'window' });
        for (const client of windowClients) {
          if ('navigate' in client) {
            client.navigate(client.url).catch(() => {});
          }
        }
      }
    })()
  );
});

// Network-First with Offline Cache Fallback so iOS Safari never gets stuck on stale JS/CSS
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
