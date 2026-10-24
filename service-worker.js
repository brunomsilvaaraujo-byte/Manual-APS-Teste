/* Manual APS 3.0 — frontend Cloudflare; NUNCA armazenar respostas da API no cache */
const CACHE='manual-aps-cloudflare-shell-v1-20261024';
const ASSETS=['./index.html','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{let c=await caches.open(CACHE);await Promise.allSettled(ASSETS.map(u=>c.add(u)));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('manual-aps-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const u=new URL(req.url);if(u.origin!==self.location.origin)return;
  if(req.mode==='navigate'){event.respondWith(fetch(req).then(resp=>{if(resp.ok)caches.open(CACHE).then(c=>c.put(req,resp.clone()));return resp}).catch(()=>caches.match('./index.html')));return;}
  if(u.pathname.endsWith('/config.js')){event.respondWith(fetch(req).then(resp=>{if(resp.ok)caches.open(CACHE).then(c=>c.put(req,resp.clone()));return resp}).catch(()=>caches.match(req)));return;}
  if(ASSETS.some(a=>u.pathname.endsWith(a.substring(1))))event.respondWith(caches.match(req).then(resp=>resp||fetch(req)));
});
