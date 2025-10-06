// Plantilla de Service Worker

// 1. Nombre del caché y archivos a cachear
const CACHE_NAME = "nombre-del-cache";
const urlsToCache = [
    "index.html",
    "offline.html"
];

// 2. INSTALL -> el evento que se ejecuta al instalar el sw
//Se dispara la primera vez que se registra el service worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsToCache))
    );
});

// 3. ACTIVATE -> este evento se ejecuta al activarse 
// debe limpiar cachés viejas
//Se dispara cuando el SW se activa (está en ejecución)
self.addEventListener("activate", event=> {
    event.waitUntil(
        caches.keys().then( keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key=>caches.delete(key))
            )
        )
    );
});

//4. FETCH -> intercepta las peticiones de la PWA
// Intercepta cada petición de cada página de la PWA
// Busca primero en caché
// Si el recurso no está, va a la red
// Si falla todo, muestra offline.html
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(
                () =>caches.match("offline.html"));
        })
    );
});

//5. PUSH -> notificaciones en segundo plano (Opcional)
self.addEventListener("push", event => {
    const data = event.data  ? event.data.text() : "Notificación sin datos";
    event.waitUntil(
        self.registration.showNotification("Mi PWA", { body: data })
    );
});

// Opcional:
//     SYNC -> sincronización en segundo plano
//     Manejo de eventos de APIs que el navegador soporte


