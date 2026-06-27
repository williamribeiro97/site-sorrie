/* ============================================================
   SORRIE+ — interações
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Nav: sombra ao rolar ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var body = document.body;

  function closeMenu() {
    body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }
  function toggleMenu() {
    var open = body.classList.toggle('nav-open');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', toggleMenu);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Slider Antes / Depois ---------- */
  var slider = document.getElementById('baSlider');
  if (slider) {
    var after = document.getElementById('baAfter');
    var line = document.getElementById('baLine');
    var dragging = false;

    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      line.style.left = pct + '%';
      slider.setAttribute('aria-valuenow', Math.round(pct));
    }
    function pctFromEvent(clientX) {
      var rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }
    function start() { dragging = true; }
    function stop() { dragging = false; }
    function move(clientX) { if (dragging) setPos(pctFromEvent(clientX)); }

    slider.addEventListener('mousedown', function (e) { start(); setPos(pctFromEvent(e.clientX)); });
    window.addEventListener('mousemove', function (e) { move(e.clientX); });
    window.addEventListener('mouseup', stop);

    slider.addEventListener('touchstart', function (e) { start(); setPos(pctFromEvent(e.touches[0].clientX)); }, { passive: true });
    slider.addEventListener('touchmove', function (e) { move(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchend', stop);

    slider.addEventListener('keydown', function (e) {
      var cur = parseFloat(slider.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft') { setPos(cur - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(cur + 4); e.preventDefault(); }
    });

    setPos(50);
  }

  /* ---------- Máscara de telefone (BR) ---------- */
  var fone = document.getElementById('fone');
  if (fone) {
    fone.addEventListener('input', function () {
      var v = fone.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        fone.value = v.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4').trim();
      } else if (v.length > 6) {
        fone.value = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
      } else if (v.length > 2) {
        fone.value = v.replace(/(\d{2})(\d{0,5})/, '($1) $2').trim();
      } else {
        fone.value = v;
      }
    });
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  var form = document.getElementById('agendaForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = (document.getElementById('nome').value || '').trim();
      var tel = (document.getElementById('fone').value || '').trim();
      var trat = document.getElementById('trat').value;

      if (!nome || !tel) {
        if (!nome) document.getElementById('nome').focus();
        else document.getElementById('fone').focus();
        return;
      }

      var msg = 'Olá! Quero agendar uma avaliação na SORRIE+.\n\n'
        + 'Nome: ' + nome + '\n'
        + 'WhatsApp: ' + tel + '\n'
        + 'Interesse: ' + trat;

      // GA4 — conversão: contato via WhatsApp (formulário). Antes do window.open (mesmo gesto de clique).
      if (typeof gtag === 'function') {
        gtag('event', 'contato_whatsapp', {
          transport_type: 'beacon',
          button_location: 'formulario',
          tratamento: trat
        });
      }

      window.open('https://wa.me/5527999893314?text=' + encodeURIComponent(msg), '_blank');
    });
  }
  /* ---------- Vídeos (toque para tocar) ---------- */
  document.querySelectorAll('[data-video]').forEach(function (card) {
    var v = card.querySelector('video');
    var btn = card.querySelector('.play');
    if (!v || !btn) return;
    btn.addEventListener('click', function () {
      card.classList.add('playing');
      v.play();
    });
    v.addEventListener('ended', function () { card.classList.remove('playing'); });
  });

  /* ---------- GA4 — evento de conversão: contato via WhatsApp ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (!link || typeof gtag !== 'function') return;
    gtag('event', 'contato_whatsapp', {
      transport_type: 'beacon',
      link_url: link.href,
      button_location: link.closest('footer') ? 'rodape'
                     : (link.closest('header') ? 'topo' : 'corpo')
    });
  }, { passive: true });
})();
