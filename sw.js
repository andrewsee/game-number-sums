const CACHE_NAME = 'number-sums-v1';
const urlsToCache = [
  './game.html',
  './src/game.js',
  './src/actions.js',
  './src/renderer.js',
  './src/background.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});