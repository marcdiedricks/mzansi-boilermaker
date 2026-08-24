const CACHE_NAME = 'mzansi-boilermaker-v0.1b-04g';

const APP_SHELL = [
  './',
  './index.html',
  './km01.html',
  './km02.html',
  './km03.html',
  './km04a.html',
  './km04b.html',
  './km04c.html',
  './km04d.html',
  './km04e.html',
  './km04f.html',
  './km04g.html',
  './styles.css',
  './app.js',
  './storage.js',
  './audit.js',
  './attachment-ui.js',
  './review-ui.js',
  './handoff-ui.js',
  './audit-ui.js',
  './backup-ui.js',
  './dashboard-ui.js',
  './readiness-ui.js',
  './safety-rules.json',
  './manifest.webmanifest',
  './assets/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() =>
        caches.match(event.request)
          .then(cached => cached || caches.match('./index.html'))
      )
  );
});
