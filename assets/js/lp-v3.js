/* SORRIE+ · LP v3 — vídeos, som, entrada suave e barra superior. Sem dependências. */
(function () {
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var videos = [].slice.call(document.querySelectorAll('video[data-lp]'));

  function still(v) {
    v.pause();
    if (v.dataset.endPoster) v.poster = v.dataset.endPoster;
    if (v.dataset.tap) v.controls = true; // vídeo com fala: o visitante pode tocar para assistir
  }
  function setup() {
    videos.forEach(function (v) {
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
      if (rm.matches) { still(v); return; }
      if (v.dataset.startPoster) v.poster = v.dataset.startPoster;
      v.controls = false;
    });
  }
  setup();

  // Tema forçado (?tema=): a <picture> só lê o tema do aparelho, então ajusta as fontes aqui.
  var forced = document.documentElement.getAttribute('data-tema');
  if (forced) {
    var pic = document.querySelector('.lp-hero__photo');
    if (pic) {
      var dark = pic.querySelector('source[media*="prefers-color-scheme"]');
      if (forced === 'escuro') { var img = pic.querySelector('img'); img.src = dark.getAttribute('srcset'); pic.querySelectorAll('source').forEach(function (s) { s.remove(); }); }
      else if (dark) dark.remove();
    }
  }

  // Toca ao ficar visível, pausa ao sair. Respeita a pausa do visitante.
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var v = en.target;
        if (rm.matches || v.dataset.userPaused) return;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { vio.observe(v); });
  }
  rm.addEventListener && rm.addEventListener('change', function () { setup(); });

  // Pausar: todo vídeo em loop precisa de controle (WCAG 2.2.2)
  videos.forEach(function (v) {
    if (rm.matches || v.dataset.tap) return; // vídeo da Dra.: tem botão de som e controles próprios
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'lp-pp'; b.setAttribute('aria-label', 'Pausar vídeo');
    b.onclick = function () {
      if (v.paused) { delete v.dataset.userPaused; v.play(); }
      else { v.dataset.userPaused = 1; v.pause(); }
      b.dataset.p = v.paused ? 1 : '';
      b.setAttribute('aria-label', v.paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
    };
    v.parentNode.appendChild(b);
  });

  // Botão de som
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-sound]');
    if (!b) return;
    var v = b.parentElement.querySelector('video');
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) { delete v.dataset.userPaused; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    b.textContent = v.muted ? 'Ativar som' : 'Desativar som';
    b.setAttribute('aria-pressed', String(!v.muted));
  });

  // Entrada suave só para o que está abaixo da primeira tela
  if (!rm.matches && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('rv-in'); en.target.classList.remove('rv-wait');
        rio.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    [].forEach.call(document.querySelectorAll('[data-rv]'), function (n) {
      if (n.getBoundingClientRect().top < window.innerHeight) return;
      n.classList.add('rv-wait'); rio.observe(n);
    });
  }

  // Barra superior (desktop) ganha fundo e botão depois do hero
  var bar = document.querySelector('.lp-bar');
  function onScroll() { if (bar) bar.classList.toggle('is-scrolled', window.scrollY > window.innerHeight * 0.7); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
