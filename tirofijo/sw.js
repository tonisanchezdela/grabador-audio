// Tirofijo: funciona sin conexión (la app y sus librerías quedan guardadas en el móvil)
const CACHE='tirofijo-v24.1';
const FILES=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png',
  './vendor/jspdf.umd.min.js','./vendor/html2canvas.min.js','./vendor/peerjs.min.js',
  './vendor/firebase-app-compat.js','./vendor/firebase-auth-compat.js','./vendor/firebase-firestore-compat.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;   // Firebase, Google, PeerJS: siempre red
  // la página: primero la red (para tener siempre la última versión), si no hay conexión la guardada
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(k=>k.put('./index.html',c)); return r; })
      .catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request)));
});
