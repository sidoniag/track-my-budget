// install service worker
self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files were pre0caches successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// activate service worker
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Removing old cache data', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim()
});

// intercept fetch requests
self.addEventListener('fetch', function(evt) {
    // hand /api request
    if (evt.request.url.includes('/api/')) {
        evt.respondWith(
            caches
                .open(DATA.CACHE_NAME)
                .then(cache => {
                    return fetch(evt.request)
                    .then(response => {
                        // if response was good, clone it and store in in the cache
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        // Network request failed, try to get it from the cache
                        return cache.match(evt.request);
                    });
                })
                .catch(err => console.log(err))
                );
                return;
            }
    // request does not inclue /api/

    evt.respondWith(
        fetch(evt.request).catch(function() {
            return caches.match(evt.request).then(function(response) {
                if (response) {
                    return response;
                } else if (evt.request.headers.get('accept').includes('text/html')) {
                    // return the cached home page for all requests for html pages
                    return caches.match('/');
                }
            });
        })
        );
    });
