const CACHE_NAME = 'jeu-cache-v1';
// Ajoute ici tous les fichiers dont ton jeu a besoin (images, css, js)
const urlsToCache = [
  './',
  './game.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation du Service Worker et mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes pour jouer hors ligne
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne le fichier en cache s'il existe, sinon le télécharge
        return response || fetch(event.request);
      })
  );
});
