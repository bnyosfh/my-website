// sw.js
const CACHE_NAME = 'arbaeen-guide-v1'; // يمكنك تغيير رقم الإصدار عند إجراء تحديثات كبيرة
const urlsToCache = [
  '/',
  '/index.html',
  // '/style.css', // إذا كان الـ CSS في ملف منفصل
  '/logo.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js',
  // أضف ملفات بياناتك هنا:
  '/data-ar.json',
  '/data-en.json',
  '/data-fa.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وُجدت الاستجابة في الكاش، أعدها
        if (response) {
          return response;
        }
        // إذا لم توجد في الكاش، اجلبها من الشبكة
        return fetch(event.request).then(
          function(response) {
            // تحقق مما إذا تلقينا استجابة صالحة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // هام: استنسخ الاستجابة. الاستجابة عبارة عن تدفق (stream)
            // ويمكن استهلاكها مرة واحدة فقط. يجب علينا استنساخها حتى يتمكن
            // المتصفح والكاش من استهلاكها.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // احذف الكاشات القديمة التي ليست في القائمة البيضاء
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
