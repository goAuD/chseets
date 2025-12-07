const CACHE = 'chseets-v10';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/wasd.css',
    '/assets/js/app.js',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/sheets/',
    '/about/',
    '/api/',
    '/pwa/',
    '/profile/'
];

// Install: cache all assets
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Fetch: cache-first, then network with cache update
self.addEventListener('fetch', e => {
    // Skip non-GET requests
    if (e.request.method !== 'GET') return;

    // Skip external requests (Supabase API, fonts, etc.)
    if (!e.request.url.startsWith(self.location.origin)) return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            // Return cached version if available
            if (cached) {
                // Update cache in background (stale-while-revalidate)
                fetch(e.request).then(response => {
                    if (response.ok) {
                        caches.open(CACHE).then(cache => cache.put(e.request, response));
                    }
                }).catch(() => { });
                return cached;
            }

            // Otherwise fetch from network
            return fetch(e.request).then(response => {
                // Cache successful responses
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, clone));
                }
                return response;
            }).catch(() => {
                // Offline fallback for navigation requests
                if (e.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});
