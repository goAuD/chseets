const CACHE = 'chseets-v12';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/wasd.css',
    '/assets/js/app.js',
    '/assets/js/modal.js',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    // Subpages - both with trailing slash and explicit index.html
    '/sheets/',
    '/sheets/index.html',
    '/about/',
    '/about/index.html',
    '/api/',
    '/api/index.html',
    '/pwa/',
    '/pwa/index.html',
    '/profile/',
    '/profile/index.html'
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

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', e => {
    // Skip non-GET requests
    if (e.request.method !== 'GET') return;

    // Skip external requests (Supabase API, fonts, etc.)
    if (!e.request.url.startsWith(self.location.origin)) return;

    const url = new URL(e.request.url);
    const isNavigation = e.request.mode === 'navigate';
    const isAsset = url.pathname.startsWith('/assets/');

    // Navigation requests: network-first (always try to get fresh content)
    if (isNavigation) {
        e.respondWith(
            fetch(e.request)
                .then(response => {
                    // Cache the fresh response
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE).then(cache => cache.put(e.request, clone));
                    }
                    return response;
                })
                .catch(async () => {
                    // Offline: try to match the exact URL first
                    const cached = await caches.match(e.request);
                    if (cached) return cached;

                    // Try with/without trailing slash
                    const altUrl = url.pathname.endsWith('/')
                        ? url.pathname + 'index.html'
                        : url.pathname + '/';
                    const altCached = await caches.match(altUrl);
                    if (altCached) return altCached;

                    // Last resort: return cached home page
                    return caches.match('/');
                })
        );
        return;
    }

    // Asset requests: cache-first with background update (stale-while-revalidate)
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) {
                // Update cache in background
                fetch(e.request).then(response => {
                    if (response.ok) {
                        caches.open(CACHE).then(cache => cache.put(e.request, response));
                    }
                }).catch(() => { });
                return cached;
            }

            // Not in cache, fetch from network
            return fetch(e.request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, clone));
                }
                return response;
            });
        })
    );
});
