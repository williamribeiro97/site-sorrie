/* SORRIE+ ds-scenes.js — cenas em vídeo "play on view" (padrão Apple). Vanilla. */
(function () {
  var d = document, h = d.documentElement, I = 'IntersectionObserver';
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches, dk = matchMedia('(min-width:1024px)').matches;
  function O(f, o) { return new window[I](f, o); }
  if (!(I in window)) return;
  if (!rm) { // fade escalonado nos títulos (cenas 2+)
    h.classList.add('cx-js');
    var r = O(function (e) { e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); r.unobserve(x.target); } }); }, { threshold: .2 });
    d.querySelectorAll('.cx-rv').forEach(function (n) { r.observe(n); });
  }
  d.querySelectorAll('video[data-scene]').forEach(function (v) {
    var D = v.dataset, s = (dk && D.srcD) || D.src, sc = dk && v.closest('[data-scrub]'), vis, stop, b;
    if (rm) { if (D.endPoster) v.poster = D.endPoster; return; }
    if (!s) return;
    function go() { if (vis && !stop && v.readyState > 2) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
    O(function (e, o) {
      if (!e[0].isIntersecting) return;
      o.disconnect(); v.src = s; v.load();
      if (!sc) v.oncanplay = go; // sem resposta da rede, o poster fica no lugar
      if (sc) { addEventListener('scroll', function () { var q = sc.getBoundingClientRect(), p = (innerHeight - q.top) / (innerHeight + q.height); if (v.duration) v.currentTime = Math.min(1, Math.max(0, p)) * v.duration; }, { passive: true }); }
      else if (v.loop) {
        b = d.createElement('button'); b.type = 'button'; b.className = 'cx-pp'; b.setAttribute('aria-label', 'Pausar vídeo');
        b.onclick = function () { stop = !v.paused; stop ? v.pause() : v.play(); };
        v.onplay = v.onpause = function () { b.dataset.p = v.paused ? 1 : ''; b.setAttribute('aria-label', v.paused ? 'Reproduzir vídeo' : 'Pausar vídeo'); };
        v.parentNode.appendChild(b);
      }
    }, { rootMargin: '150% 0px' }).observe(v);
    if (!sc) O(function (e) { vis = e[0].isIntersecting; go(); }, { threshold: .35 }).observe(v);
  });
})();
