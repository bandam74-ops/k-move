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
