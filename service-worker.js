const CACHE_NAME = 'kalkulacka-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styl.css',
  '/js/logika.js',
  '/js/layout.js',
  '/js/mathjs.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Instalace – stáhneme vše
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Aktivace – smažeme staré cache, pokud existují
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Po instalaci: vše jen z cache (bez pokusu o fetch z webu)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
  );
});
