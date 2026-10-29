/* SORRIE+ ds.js — origem do lead, GA4, barra fixa, vídeo no toque. Vanilla, sem dependências. */
(function () {
  var d = document, WA = 'a[href*="wa.me/5527995828585"]';
  var MAP = [
    [/chatgpt\.com|chat\.openai\.com|openai/, 'ChatGPT'],
    [/perplexity/, 'Perplexity'],
    [/gemini\.google|bard\.google/, 'Gemini'],
    [/copilot\.microsoft|copilot/, 'Copilot'],
    [/claude\.ai|claude/, 'Claude'],
    [/instagram|facebook|^fb$|^ig$/, 'Instagram']
  ];

  // (a) origem: utm_source tem prioridade; senão o host do referrer
  var src = new URLSearchParams(location.search).get('utm_source') || '';
  if (!src && d.referrer) { try { src = new URL(d.referrer).hostname; } catch (e) {} }
  src = src.toLowerCase();
  var origin = '';
  for (var i = 0; i < MAP.length; i++) if (MAP[i][0].test(src)) { origin = MAP[i][1]; break; }

  if (origin) {
    var tema = d.body.getAttribute('data-tema') || 'tratamento';
    var txt = 'Olá! Encontrei a SORRIE+ pelo ' + origin + ' e quero agendar minha avaliação de ' + tema + '.';
    d.querySelectorAll(WA).forEach(function (a) {
      a.href = a.href.split('?')[0] + '?text=' + encodeURIComponent(txt);
    });
  }

  // (b) GA4
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest(WA);
    if (a && window.gtag) gtag('event', 'whatsapp_click', { lead_origin: origin || 'direto', page: location.pathname });
  });

  // (c) barra inferior depois que o hero sai da tela
  var hero = d.querySelector('.ds-hero'), dock = d.querySelector('.ds-dock');
  if (hero && dock && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      dock.classList.toggle('is-on', !en[0].isIntersecting && en[0].boundingClientRect.top < 0);
    }).observe(hero);
  }

  // (d) vídeo: toque no poster vira <video controls playsinline> e dá play
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.ds-play');
    if (!b) return;
    var box = b.parentNode, v = d.createElement('video');
    v.src = box.getAttribute('data-src');
    v.controls = true; v.playsInline = true; v.setAttribute('playsinline', '');
    box.innerHTML = ''; box.appendChild(v);
    v.play();
  });
})();
