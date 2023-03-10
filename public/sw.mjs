// This is the "Offline page" service worker

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js")

const CACHE = "rushSlide_v1"

const offlineFallbackPage = "offline.html"
const offlineFont = "Teko.ttf"
const offlineImage = "logo.png"
const offlineIcon = "favicon.ico"

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      cache.addAll([offlineFallbackPage, offlineFont, offlineImage, offlineIcon])
    }),
  )
})

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable()
}

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse
          if (preloadResp) return preloadResp

          const networkResp = await fetch(event.request)
          return networkResp
        } catch (error) {
          const cache = await caches.open(CACHE)
          const cachedResp = await cache.match(offlineFallbackPage)
          return cachedResp
        }
      })(),
    )
  } else {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse
          if (preloadResp) return preloadResp

          const networkResp = await fetch(event.request)
          return networkResp
        } catch (error) {
          const cache = await caches.open(CACHE)
          let cachedResp

          if (event.request.url.includes("Teko.ttf")) cachedResp = await cache.match(offlineFont)
          else if (event.request.url.includes("favicon.ico")) cachedResp = await cache.match(offlineIcon)
          else cachedResp = await cache.match(offlineImage)

          return cachedResp
        }
      })(),
    )
  }
})
