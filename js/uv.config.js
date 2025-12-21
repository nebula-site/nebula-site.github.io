/* uv.sw.js */
importScripts('https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.bundle.js');
importScripts('https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.config.js');
importScripts(__uv$config.sw || 'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.sw.js');

const uv = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            if (uv.route(event)) {
                return await uv.fetch(event);
            }
            return await fetch(event.request);
        })()
    );
});
