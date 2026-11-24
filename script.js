(function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  // Tabs
  var tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  // Tooltip
  var tip = document.createElement('div');
  tip.className = 'tip'; tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  function bindTip(el, text) {
    el.addEventListener('mouseenter', function () { tip.textContent = text; tip.style.opacity = 1; });
    el.addEventListener('mousemove', function (e) { tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY - 36) + 'px'; });
    el.addEventListener('mouseleave', function () { tip.style.opacity = 0; });
    el.setAttribute('aria-label', text); el.tabIndex = 0;
  }

  // Charts
  var rates = [
    { y: '2022', rate: 54.5, n: 11, e: 6 },
    { y: '2023', rate: 90.0, n: 10, e: 9 },
    { y: '2024', rate: 90.0, n: 10, e: 9 },
    { y: '2025', rate: 90.0, n: 10, e: 9 }
  ];
  var rateChart = document.getElementById('rateChart');
  rates.forEach(function (d) {
    var col = document.createElement('div');
    col.className = 'vbar';
    col.innerHTML = '<span class="val">' + d.rate + '%</span><span class="fill" data-h="' + d.rate + '"></span><span class="lbl">' + d.y + '</span>';
    bindTip(col, d.y + '년 · 연수 ' + d.n + '명 중 ' + d.e + '명 취업 (' + d.rate + '%)');
    rateChart.appendChild(col);
  });

  var countries = [
    { c: '싱가포르', v: 14 }, { c: '캐나다', v: 11 }, { c: '홍콩', v: 6 }, { c: '오만', v: 2 }
  ];
  var max = 14;
  var countryChart = document.getElementById('countryChart');
  countries.forEach(function (d) {
    var row = document.createElement('div');
    row.className = 'hbar';
    row.innerHTML = '<span>' + d.c + '</span><span class="track"><span class="fill" style="display:block" data-w="' + (d.v / max * 100) + '"></span></span><b>' + d.v + '명</b>';
    bindTip(row, d.c + ' · 누적 ' + d.v + '명 (2022–2025)');
    countryChart.appendChild(row);
  });

  function animate(scope) {
    // 100% maps to 85% of the column so the value label always fits above the bar
    scope.querySelectorAll('[data-h]').forEach(function (el) { el.style.height = (el.dataset.h * 0.85) + '%'; });
    scope.querySelectorAll('[data-w]').forEach(function (el) { el.style.width = el.dataset.w + '%'; });
  }

  // Score bars: store target widths then animate
  var scoreBars = document.querySelectorAll('.score-row .bar i');
  scoreBars.forEach(function (el) { el.dataset.target = el.style.width; el.style.width = '0'; });
  // bar widths are out of 30 max for readability
  scoreBars.forEach(function (el) { var pct = parseFloat(el.dataset.target) / 30 * 100; el.dataset.target = pct + '%'; });

  // Gallery
  var REG = { ph: '필리핀', sg: '싱가포르', ca: '캐나다', hk: '홍콩' };
  var photos = [
    ['ph-01', '국외 어학교육 프로그램 출국 · 인천공항'],
    ['ph-02', 'OK English Academy 어학 수업'],
    ['ph-03', '바콜로드 현지 생활'],
    ['sg-01', '싱가포르 재직 졸업생 미팅'],
    ['sg-02', '현지 태권도장 관계자 미팅'],
    ['sg-03', '현지 도장 수업 참관'],
    ['sg-04', '일도 태권도 수업 참관'],
    ['sg-05', '재직 졸업생 간담회'],
    ['sg-06', '현지 관장 미팅'],
    ['ca-01', 'Master Song’s First Taekwondo MOU 체결'],
    ['ca-02', 'MOU 협약서 교환'],
    ['ca-03', 'Tiger Taekwondo 방문'],
    ['ca-04', 'BB Taekwondo 방문'],
    ['ca-05', 'Master Rim’s Taekwondo 방문'],
    ['ca-06', 'Master Rim’s 근무 졸업생과 함께'],
    ['ca-07', '캐나다 취업생 간담회'],
    ['ca-08', '밴쿠버 경희태권도 방문'],
    ['ca-09', '밴쿠버 K Martial Arts Centre 방문'],
    ['hk-01', '제2회 홍콩총영사배 개막식 시범단'],
    ['hk-02', '홍콩 현지 방송 인터뷰'],
    ['hk-03', '시범공연을 앞둔 시범단'],
    ['hk-04', 'Southorn Stadium 대회장'],
    ['hk-05', '대회장 전경'],
    ['hk-06', '감사패 전달'],
    ['hk-07', '홍콩 현지 관계자와 함께'],
    ['hk-08', 'NRG Taekwondo 도장 방문'],
    ['hk-09', '현지 도장 교류 수업'],
    ['hk-10', '홍콩 태권도장 협약']
  ];
  var grid = document.getElementById('gGrid');
  var items = photos.map(function (p, i) {
    var r = p[0].slice(0, 2);
    var b = document.createElement('button');
    b.className = 'g-item'; b.dataset.r = r; b.dataset.i = i;
    b.setAttribute('aria-label', REG[r] + ' · ' + p[1] + ' (크게 보기)');
    b.innerHTML = '<img loading="lazy" src="images/gallery/' + p[0] + '-t.jpg" alt="' + p[1] + '"><span class="g-cap"><b>' + REG[r] + '</b>' + p[1] + '</span>';
    grid.appendChild(b);
    return b;
  });
  document.querySelectorAll('.g-filters button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.g-filters button').forEach(function (x) { x.classList.toggle('on', x === btn); });
      items.forEach(function (it) { it.hidden = !(btn.dataset.f === 'all' || it.dataset.r === btn.dataset.f); });
    });
  });
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
  var cur = 0, lastFocus = null;
  function visible() { return items.filter(function (it) { return !it.hidden; }).map(function (it) { return +it.dataset.i; }); }
  function show(i) {
    cur = i; var p = photos[i];
    lbImg.src = 'images/gallery/' + p[0] + '.jpg'; lbImg.alt = p[1];
    lbCap.textContent = REG[p[0].slice(0, 2)] + ' · ' + p[1];
  }
  function step(d) { var v = visible(); var k = v.indexOf(cur); show(v[(k + d + v.length) % v.length]); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  grid.addEventListener('click', function (e) {
    var it = e.target.closest('.g-item'); if (!it) return;
    lastFocus = it; show(+it.dataset.i); lb.hidden = false; document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); tx = null; });

  var reveal = document.querySelectorAll('.section-head, .facts, .timeline, .why, .hours, .course-grid, .ai-level, .stat-row, .charts, .country, .process, .progress-card, .adm-grid, .steps, .howto, .phase-grid, .stages, .trips, .faculty-grid, .quote');
  reveal.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        animate(en.target);
        en.target.querySelectorAll('.score-row .bar i').forEach(function (el) { el.style.width = el.dataset.target; });
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('in'); animate(el); });
    scoreBars.forEach(function (el) { el.style.width = el.dataset.target; });
  }
})();
