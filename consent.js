/* Συναίνεση cookies: το Google Analytics φορτώνει ΜΟΝΟ μετά από αποδοχή. */
(function () {
  var GA_ID = 'G-XJ6142EJPG';
  var KEY = 'cookieConsent';

  var T = {
    el: {
      text: 'Χρησιμοποιούμε cookies στατιστικών (Google Analytics) για να βλέπουμε πώς χρησιμοποιείται το site. Ενεργοποιούνται μόνο αν συμφωνήσετε.',
      more: 'Πολιτική απορρήτου',
      accept: 'Αποδοχή',
      reject: 'Απόρριψη'
    },
    en: {
      text: 'We use analytics cookies (Google Analytics) to see how the site is used. They are only enabled if you agree.',
      more: 'Privacy policy',
      accept: 'Accept',
      reject: 'Reject'
    },
    es: {
      text: 'Usamos cookies analíticas (Google Analytics) para ver cómo se utiliza el sitio. Solo se activan si usted lo acepta.',
      more: 'Política de privacidad',
      accept: 'Aceptar',
      reject: 'Rechazar'
    }
  };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function lang() { var l = store('selectedLanguage'); return T[l] ? l : 'el'; }

  function loadGA() {
    if (window.__akronGA) return;
    window.__akronGA = true;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script');
    s.async = true;
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
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        ['', '; domain=.' + host, '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  function closeBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.remove();
  }

  function showBanner() {
    closeBanner();
    var t = T[lang()];
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.className = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.innerHTML =
      '<p>' + t.text + ' <a href="./privacy">' + t.more + '</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-accept">' + t.accept + '</button>' +
      '<button type="button" class="cookie-reject">' + t.reject + '</button>' +
      '</div>';
    b.querySelector('.cookie-accept').addEventListener('click', function () {
      store(KEY, 'granted'); loadGA(); closeBanner();
    });
    b.querySelector('.cookie-reject').addEventListener('click', function () {
      store(KEY, 'denied'); stopGA(); closeBanner();
    });
    document.body.appendChild(b);
  }

  window.openCookieSettings = showBanner;

  function init() {
    var c = store(KEY);
    if (c === 'granted') loadGA();
    else if (c !== 'denied') showBanner();
    var btn = document.getElementById('footer-cookies');
    if (btn) btn.addEventListener('click', showBanner);
    var sel = document.getElementById('language-select');
    if (sel) sel.addEventListener('change', function () {
      if (document.getElementById('cookie-banner')) setTimeout(showBanner, 0);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
