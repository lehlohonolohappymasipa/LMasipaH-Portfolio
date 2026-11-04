(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  document.getElementById('year').textContent = new Date().getFullYear();
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (items) {
    items.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('in'); io.unobserve(i.target); } });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();