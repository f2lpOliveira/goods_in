const CACHE_NAME = "warehouse-inbound-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/style.css",

  "./icons/icon-192.png",
  "./icons/icon-512.png",

  "./libs/xlsx.full.min.js",

  "./js/app.js",
  "./js/router.js",

  "./js/components/autocomplete.js",

  "./js/core/barcode/barcodeTypes.js",
  "./js/core/barcode/detectBarcodeFormat.js",
  "./js/core/barcode/parserFactory.js",
  "./js/core/barcode/parsers/gs1Parser.js",

  "./js/core/catalog/productCatalog.js",
  "./js/core/catalog/product.js",
  "./js/core/catalog/productRepository.js",

  "./js/export/csvExporter.js",

  "./js/models/inbound.js",
  "./js/models/inboundItem.js",

  "./js/repository/currentInboundRepository.js",
  "./js/repository/inboundRepository.js",

  "./js/services/csvService.js",
  "./js/services/exportService.js",

  "./js/state/currentInbound.js",
  "./js/state/inbounds.js",
  "./js/state/navigationState.js",

  "./js/utils/dateUtils.js",
  "./js/utils/idUtils.js",

  "./js/views/home.js",
  "./js/views/inbound.js",
  "./js/views/product.js",
  "./js/views/history.js",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
          console.log("Cached:", file);
        } catch (error) {
          console.error("Failed:", file, error);
        }
      }
    })
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
