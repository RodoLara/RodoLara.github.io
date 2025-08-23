(async () => {
  // (si usas filtro por país, déjalo arriba; esto es solo el inyectado)
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', '{"token":"4ee1178f6110464781ab33507091aec3"}');

  s.onload = () => console.log('[CF Analytics] ✅ Cargó beacon.min.js');
  s.onerror = (e) => console.warn('[CF Analytics] ❌ onerror en beacon.min.js', e);

  document.head.appendChild(s);

  // Si en 3s no hubo load ni error, casi seguro lo bloqueó una extensión
  setTimeout(() => {
    if (!s.dataset._seen) {
      console.warn('[CF Analytics] ⏱️ No hubo load/error en 3s. Probable bloqueo por extensión (ERR_BLOCKED_BY_CLIENT).');
    }
  }, 3000);

  // Marcar cuando ocurra alguno
  const markSeen = () => s.dataset._seen = '1';
  s.addEventListener('load', markSeen);
  s.addEventListener('error', markSeen);
})();