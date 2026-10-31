/* SORRIE+ · site-v3 — complemento do main.js (que segue cuidando de menu, slider, formulário,
   vídeos e eventos de conversão, incluindo o rótulo "barra_mobile"). Sem dependências. */
(function () {
  // Barra fixa do celular: aparece só depois da primeira tela, para não competir com o botão principal.
  var root = document.documentElement;

  // Vídeo com versão clara e escura: data-src-light / data-src-dark (e data-poster-light / data-poster-dark).
  // Só o arquivo do tema atual recebe src, então o navegador baixa uma versão por acesso.
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() {
    var t = document.documentElement.getAttribute('data-tema');
    return t ? t === 'escuro' : mqDark.matches;
  }
  function themeVideos() {
    var dark = isDark();
    [].forEach.call(document.querySelectorAll('video[data-src-light][data-src-dark]'), function (v) {
      var src = dark ? v.dataset.srcDark : v.dataset.srcLight;
      var poster = dark ? v.dataset.posterDark : v.dataset.posterLight;
      if (poster && v.getAttribute('poster') !== poster) v.poster = poster;
      if (v.getAttribute('src') === src) return;
      var playing = !v.paused;
      v.setAttribute('src', src);
      if (playing) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }
  themeVideos();
  mqDark.addEventListener && mqDark.addEventListener('change', themeVideos);

  function onScroll() { root.classList.toggle('v3-past-hero', window.scrollY > window.innerHeight * 0.6); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Tema forçado para revisão (?tema=claro|escuro): a <picture> só lê o tema do aparelho,
  // então as fontes com prefers-color-scheme são resolvidas aqui.
  var forced = root.getAttribute('data-tema');
  if (!forced) return;
  [].forEach.call(document.querySelectorAll('picture'), function (pic) {
    var dark = pic.querySelector('source[media*="prefers-color-scheme"]');
    if (!dark) return;
    if (forced === 'escuro') {
      var img = pic.querySelector('img');
      img.src = dark.getAttribute('srcset');
      img.removeAttribute('srcset');
      [].forEach.call(pic.querySelectorAll('source'), function (s) { s.remove(); });
    } else dark.remove();
  });
})();
