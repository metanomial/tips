const cacheId = '0.0.1'
const cacheFiles = [
	'/app.js',
	'/app.webmanifest',
	'/Epilogue-Italic.woff2',
	'/Epilogue.woff2',
	'/favicon.ico',
	'/icon.svg',
	'/index.html',
	'/main.css',
	'/maskable-icon.svg',
	'/service-worker.js'
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches
			.open(cacheId)
			.then(cache => cache.addAll(cacheFiles))
			.catch(console.error)
	)
})

self.addEventListener('activate', event => {
	const purgeOldCache = key => key != cacheId
		? caches.delete(key)
		: null
	event.waitUntil(
		caches
			.keys()
			.then(keyList => Promise.all(keyList.map(purgeOldCache)))
			.catch(console.error)
	)
})

self.addEventListener('fetch', event => {
	event.respondWith(
		caches
			.match(event.request)
			.then(response => response || fetch(event.request)
				.then(response => caches
					.open(cacheId)
					.then(cache => {
						cache.put(event.request, response.clone())
						return response
					})
				)
			)
			.catch(console.error)
	)
})
