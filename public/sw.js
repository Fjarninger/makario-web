/* ═══════════════════════════════════════════════════════════════
   MAKARIO — Service Worker v2.0
   Cache-first pour les assets, network-first pour les données
   ═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'makario-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap',
];

// Installation — mise en cache des assets statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('https://fonts')));
    }).then(() => self.skipWaiting())
  );
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — stratégie hybride
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls → network first (pas de cache)
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ success: false, error: 'Hors ligne' }),
        { headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Google Fonts → cache first
  if (url.hostname.includes('fonts.g')) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return res;
      }).catch(() => new Response('')))
    );
    return;
  }

  // Assets statiques → cache first avec fallback network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => {
        // Fallback pour la navigation
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('', { status: 408 });
      });
    })
  );
});
