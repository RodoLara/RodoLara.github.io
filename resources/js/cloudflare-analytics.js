(async () => {
  const EU = new Set([
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU",
    "IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
    "IS","LI","NO" // estos 3 no son UE pero sí EEA
  ]);

  try {
    const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
    const text = await res.text();
    const match = text.match(/loc=([A-Z]{2})/);
    const cc = match ? match[1] : null;

    if (cc && !EU.has(cc)) {
      const s = document.createElement('script');
      s.defer = true;
      s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      s.setAttribute('data-cf-beacon', '{"token": "4ee1178f6110464781ab33507091aec3"}');
      s.onerror = () => {}; // silencia si un ad-blocker lo bloquea
      document.head.appendChild(s);
    }
  } catch (e) {
    // si falla la geo, no inyectamos (fail-safe)
  }
})();