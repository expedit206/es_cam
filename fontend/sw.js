// import { register } from "register-service-worker";

self.addEventListener("install", (event) => {
  // //console.log("Service Worker installing...");
  // Perform installation tasks, e.g., caching static assets
  event.waitUntil(
    caches.open("my-cache-v1").then((cache) => {
      return cache.addAll([
        "/home",
        "/",
        "/login",
        "/index.html",
        "/styles.css",
        "/main.js",
        "/images/logo/logo_vert.png",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  //console.log("Service Worker activating...");
  // Perform activation tasks, e.g., cleaning up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== "my-cache-v1") {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // //console.log("Fetching:", event.request.url);
  // Intercept network requests and serve from cache if available
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


