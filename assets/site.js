/* AR Akron Services — site.js */
(function () {
  var LANG = (document.documentElement.lang || 'el').slice(0, 2) === 'en' ? 'en' : 'el';
  var T = {
    el: {
      cookie: 'Χρησιμοποιούμε cookies στατιστικών (Google Analytics) για να βλέπουμε πώς χρησιμοποιείται το site. Ενεργοποιούνται μόνο αν συμφωνήσετε.',
      more: 'Πολιτική απορρήτου', accept: 'Αποδοχή', reject: 'Απόρριψη', privacy: '/privacy',
      menu: 'Μενού', close: 'Κλείσιμο',
      sending: 'Αποστολή…', ok: 'Ευχαριστούμε! Το μήνυμά σας στάλθηκε και θα σας απαντήσουμε σύντομα.',
      err: 'Το μήνυμα δεν στάλθηκε. Δοκιμάστε ξανά ή γράψτε μας στο info@arakronservices.gr.'
    },
    en: {
      cookie: 'We use analytics cookies (Google Analytics) to see how the site is used. They are only enabled if you agree.',
      more: 'Privacy policy', accept: 'Accept', reject: 'Reject', privacy: '/en/privacy',
      menu: 'Menu', close: 'Close',
      sending: 'Sending…', ok: 'Thank you! Your message was sent and we will reply soon.',
      err: 'The message was not sent. Please try again or email info@arakronservices.gr.'
    }
  }[LANG];

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ---------- Mobile menu ---------- */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? T.close : T.menu;
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('open')) btn.click();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }


  /* ---------- Αριθμοί που "τρέχουν" ---------- */
  var nums = document.querySelectorAll('.stat-n');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el) {
    var m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    var target = parseInt(m[1], 10), suffix = m[2], dur = 1800, start = null;
    el.textContent = '0' + suffix;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); nio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { nio.observe(n); });
  }

  /* ---------- Cookie consent + Google Analytics ---------- */
  var GA_ID = 'G-XJ6142EJPG', KEY = 'cookieConsent';
  function loadGA() {
    if (window.__ga) return; window.__ga = true;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }
  function stopGA() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n.indexOf('_ga') === 0) ['', '; domain=.' + host, '; domain=' + location.hostname].forEach(function (d) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }
  function closeBanner() { var b = document.getElementById('cookie'); if (b) b.remove(); }
  function showBanner() {
    closeBanner();
    var b = document.createElement('div');
    b.id = 'cookie'; b.className = 'cookie'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-live', 'polite');
    b.innerHTML = '<p>' + T.cookie + ' <a href="' + T.privacy + '">' + T.more + '</a></p>' +
      '<div class="cookie-actions"><button type="button" class="btn btn-gold" data-c="1">' + T.accept +
      '</button><button type="button" class="btn btn-ghost" data-c="0">' + T.reject + '</button></div>';
    b.addEventListener('click', function (e) {
      var c = e.target.getAttribute('data-c'); if (c === null) return;
      if (c === '1') { store(KEY, 'granted'); loadGA(); } else { store(KEY, 'denied'); stopGA(); }
      closeBanner();
    });
    document.body.appendChild(b);
  }
  var consent = store(KEY);
  if (consent === 'granted') loadGA(); else if (consent !== 'denied') showBanner();
  var cs = document.getElementById('cookie-settings');
  if (cs) cs.addEventListener('click', showBanner);

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.botcheck && form.botcheck.checked) return;
      status.className = 'form-status'; status.textContent = T.sending; submit.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.success) throw new Error(j.message || 'error');
          status.className = 'form-status ok'; status.textContent = T.ok; form.reset();
        })
        .catch(function () { status.className = 'form-status err'; status.textContent = T.err; })
        .then(function () { submit.disabled = false; });
    });
  }
})();
