// Service Worker: hält die App offline lauffähig, ohne veraltete Inhalte
// festzuhalten.
//
// Zwei Strategien, weil sich die beiden Arten von Anfragen unterschiedlich
// verhalten:
//
//   * Seitenaufrufe  -> zuerst Netz, Cache nur als Fallback. Vorher lag hier
//     Cache-first, und damit blieb die einmal gespeicherte Seite hängen: neue
//     Inhalte wurden erst nach einem Wechsel von CACHE_NAME sichtbar. Genau
//     das ist passiert.
//   * Statische Dateien (JS, CSS, Bilder, Fonts) -> zuerst Cache. Deren Namen
//     enthalten einen Hash, sie ändern sich also nie unter derselben URL.

const CACHE_NAME = "hausfest-via-v35";
const SHELL = ["/", "/en", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function cachen(request, response) {
  if (response.ok && response.type === "basic") {
    const clone = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Nur same-origin. Externe Assets (Ticketshop, Karten) unangetastet.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Seitenaufrufe: immer das Aktuelle zeigen, solange Netz da ist.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => cachen(request, response))
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Alles andere: aus dem Cache, sonst aus dem Netz und dabei ablegen.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => cachen(request, response))
        .catch(() => cached || Response.error());
    })
  );
});
