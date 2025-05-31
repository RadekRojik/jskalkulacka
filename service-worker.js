const CACHE_NAME = 'kalkulacka-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/nastaveni.html',
  '/css/styl.css',
  '/js/events.js',
  '/js/importexport.js',
  '/js/keyboard.js',
  '/js/lang.js',
  '/js/layout.js',
  '/js/logika.js',
  '/js,makeresult.js',
  '/js/mathjs.js',
  '/js/state.js',
  '/js/settings.js',
  '/js/theming.js',
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
