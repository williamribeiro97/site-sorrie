/* Vídeos das LPs da BF de Implantes: início, 50% e fim no GA4 (nomes recomendados pelo Google),
   no Clarity e no Pixel da Meta (só o início, para público de quem assistiu). */
(function () {
  function ev(nome, v, pct) {
    var p = { video_title: v.dataset.titulo, video_provider: 'site', transport_type: 'beacon' };
    if (pct) p.video_percent = pct;
    if (typeof gtag === 'function') gtag('event', nome, p);
    if (window.clarity) clarity('event', nome + '_' + v.dataset.titulo);
    if (window.fbq && nome === 'video_start') fbq('trackCustom', 'VideoStart', { video: v.dataset.titulo });
  }
  [].forEach.call(document.querySelectorAll('video[data-titulo]'), function (v) {
    var inicio = false, meio = false, fim = false;
    v.addEventListener('play', function () { if (!inicio) { inicio = true; ev('video_start', v); } });
    v.addEventListener('timeupdate', function () {
      if (!meio && v.duration && v.currentTime / v.duration >= 0.5) { meio = true; ev('video_progress', v, 50); }
    });
    v.addEventListener('ended', function () { if (!fim) { fim = true; ev('video_complete', v, 100); } });
  });

  /* Tenta tocar com som (é a Dra. Karine falando o CTA). O navegador bloqueia som sem toque
     da pessoa; nesse caso o vídeo segue sem som e aparece o botão para ouvir. */
  [].forEach.call(document.querySelectorAll('video[data-titulo][autoplay]'), function (v) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bf-som';
    b.textContent = '🔊 Toque para ouvir a Dra. Karine';
    b.hidden = true;
    b.addEventListener('click', function () { v.muted = false; v.play(); b.hidden = true; });
    v.addEventListener('volumechange', function () { if (!v.muted) b.hidden = true; });
    v.parentNode.appendChild(b);
    v.muted = false;
    var p = v.play();
    if (p && p.catch) p.catch(function () { v.muted = true; v.play(); b.hidden = false; });
  });
})();
