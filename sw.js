const CACHE='cms-meter-v8';
const ASSETS=[
  './',
  'index.html',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(resp=>{
      if(resp.status===200){const c=resp.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
