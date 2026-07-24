const CACHE_NAME = "warehouse-inbound-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",

  "./css/style.css",

  "./js/app.js",
  "./js/router.js",
  "./js/storage.js",
  "./js/repository.js",

  "./js/models/inbound.js",
  "./js/models/inboundItem.js",

  "./js/state/currentInbound.js",
  "./js/state/inbounds.js",

  "./js/repository/inboundRepository.js",

  "./js/services/csvService.js",
  "./js/services/exportService.js",

  "./js/export/csvExporter.js",

  "./js/utils/dateUtils.js",

  "./js/views/home.js",
  "./js/views/inbound.js",
  "./js/views/product.js",
  "./js/views/inboundItems.js",

  "./libs/xlsx.full.min.js",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        for (const file of FILES_TO_CACHE) {
          try {
            await cache.add(file);
            console.log("Cached:", file);
          } catch (error) {
            console.error("Failed:", file, error);
          }
        }
      })()
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      )
  );
});
