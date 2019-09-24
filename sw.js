const CACHE_NAME = "football-v1.1";
var urlsToName = [
    "/",
    "/nav.html",
    "/index.html",
    "/detailteam.html",
    "/pages/home.html",
    "/pages/teams.html",
    "/js/api.js",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/css/main.css",
    "/css/materialize.min.css",
    "/assets/land.png",
    "/assets/btnland.png",
    "/assets/btnlandhover.png"
]

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("Instalasi service worker oke");
                cache.addAll(urlsToName);
                return cache;
            })
            .catch(function () {
                console.log("Instalasi service worker gagal");
            })
    )
})
    
self.addEventListener("fetch", function (event) {
    var baseUrl = "https://api.football-data.org/";
    if (event.request.url.indexOf(baseUrl) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        )
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true })
                .then(function (response) {
                    return response || fetch(event.request);
                })
        )
    }
})