const CACHE_NAME = 'yamada-tools-v1';
const OFFLINE_TOOLS = [
  '/',
  '/generator/random-picker',
  '/generator/password',
  '/generator/text-case',
  '/generator/qr-code',
  '/image/flip',
  '/image/compress',
  '/image/rotate',
  '/image/format-convert',
  '/image/blur',
  '/image/brightness',
  '/image/monochrome',
  '/image/sepia',
  '/image/mosaic',
  '/convert/wareki',
  '/convert/unit',
  '/convert/base64',
  '/convert/url-encode',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_TOOLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
