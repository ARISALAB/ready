/* AR Akron Services — website check: SEO, AI visibility, customers (front end). Needs sitecheck-data.js. */
(function () {
  var root = document.getElementById('sc');
  if (!root || !window.SC_DATA) return;
  var D = window.SC_DATA;
  var L = root.getAttribute('data-lang') === 'en' ? 'en' : 'el';
  var REPORT_ENDPOINT = 'https://arakron.netlify.app/.netlify/functions/site-report';

  var T = {
    el: {
      label: 'Η διεύθυνση του site σας', ph: 'π.χ. onomaepixeirisis.gr', go: 'Ελέγξτε το site',
      hint: 'Δωρεάν, χωρίς εγγραφή. Ο έλεγχος κρατά 10 με 20 δευτερόλεπτα.',
      empty: 'Γράψτε τη διεύθυνση του site.',
      steps: ['Ανοίγω την αρχική και τις βασικές σελίδες', 'Ελέγχω τι βλέπει η Google', 'Ελέγχω αν μπορούν να το διαβάσουν τα AI', 'Ελέγχω αν φέρνει πελάτες', 'Βγάζω τον βαθμό'],
      fail: 'Δεν κατάφερα να διαβάσω αυτό το site. Ελέγξτε τη διεύθυνση ή στείλτε μου μήνυμα να το δω εγώ.',
      busy: 'Πολλοί έλεγχοι αυτή τη στιγμή. Δοκιμάστε ξανά σε ένα λεπτό.',
      slow: 'Το site άργησε πολύ να απαντήσει. Δοκιμάστε ξανά.',
      checked: 'Ελέγχθηκε', pages: function (n) { return n === 1 ? '1 σελίδα' : n + ' σελίδες'; },
      st: { pass: 'Εντάξει', warn: 'Μισό', fail: 'Λείπει' },
      d: {
        platform: function (x) { return 'μέσω ' + x; }, phone: 'μόνο με τηλέφωνο', form: 'φόρμα στο site', bots: function (b) { return 'μπλοκάρει: ' + b; }, all: 'μπλοκάρει όλα τα bots', words: function (n) { return 'μόνο ' + n + ' λέξεις'; },
        pdf: 'μόνο σε PDF', photos: function (n) { return n === 1 ? '1 φωτογραφία' : n + ' φωτογραφίες'; }, nolink: 'υπάρχει, χωρίς σύνδεσμο', addr: 'μόνο διεύθυνση'
      },
      scoreL: 'Βαθμός site', of: '/100', biggest: 'Το μεγαλύτερο κενό', none: 'Δεν βρήκα κενό σε κανέναν από τους ελέγχους. Μπράβο.',
      problems: function (n) { return n === 1 ? '1 κενό' : n + ' κενά'; }, ok: function (n) { return n + ' εντάξει'; },
      lockH: 'Η πλήρης αναφορά στο email σας',
      lockP: 'Όλα τα κενά με σειρά προτεραιότητας και τι σας κοστίζει το καθένα, γραμμένα για ιδιοκτήτη επιχείρησης και όχι για προγραμματιστή.',
      email: 'Το email σας', venue: 'Όνομα επιχείρησης (προαιρετικό)', venuePh: 'π.χ. Λογιστικό γραφείο Παπαδόπουλος',
      consent: 'Στείλτε μου την αναφορά. Διάβασα την <a href="/privacy" target="_blank">πολιτική απορρήτου</a>.',
      followup: 'Μπορείτε να μου στείλετε ένα ακόμα email για τα αποτελέσματα.',
      send: 'Στείλτε μου την αναφορά', sending: 'Στέλνω…',
      badEmail: 'Γράψτε ένα σωστό email.', needConsent: 'Τσεκάρετε ότι θέλετε να σας στείλουμε την αναφορά.', sendFail: 'Δεν στάλθηκε. Δοκιμάστε ξανά σε λίγο ή στείλτε μου μήνυμα στο WhatsApp.',
      done: function (m) { return 'Στάλθηκε στο <b>' + m + '</b>. Αν δεν τη δείτε σε λίγα λεπτά, κοιτάξτε και στα ανεπιθύμητα.'; },
      ctaH: 'Θέλετε να το φτιάξουμε μαζί;',
      ctaP: 'Φτιάχνουμε ιστοσελίδες που βρίσκονται στη Google, διαβάζονται από τα AI και φέρνουν πελάτες. Η πρώτη κουβέντα, 30 λεπτά, είναι δωρεάν.',
      book: 'Κλείστε δωρεάν ραντεβού 30 λεπτών', wa: 'Στείλτε μου το αποτέλεσμα στο WhatsApp',
      waText: function (h, s) { return 'Γεια σας, έκανα τον έλεγχο ιστοσελίδας για το ' + h + ' και πήρα ' + s + '/100. Θα ήθελα να το δούμε.'; },
      again: 'Ελέγξτε άλλο site', bookUrl: 'https://rantevou.arakronservices.gr/arakron?lang=el&service=intro',
      note: 'Ενδεικτικός έλεγχος της αρχικής σελίδας, έως 5 εσωτερικών σελίδων, του robots.txt και του llms.txt. Δεν μετρά θέση στη Google ούτε επισκεψιμότητα.'
    },
    en: {
      label: 'Your website address', ph: 'e.g. yourbusiness.com', go: 'Check my site',
      hint: 'Free, no sign-up. The check takes 10 to 20 seconds.',
      empty: 'Type your website address.',
      steps: ['Opening your home page and key pages', 'Checking what Google sees', 'Checking whether AI tools can read it', 'Checking whether it brings in customers', 'Working out your score'],
      fail: 'I could not read this site. Check the address, or send me a message and I will look at it myself.',
      busy: 'Too many checks right now. Try again in a minute.',
      slow: 'The site took too long to respond. Try again.',
      checked: 'Checked', pages: function (n) { return n === 1 ? '1 page' : n + ' pages'; },
      st: { pass: 'OK', warn: 'Partly', fail: 'Missing' },
      d: {
        platform: function (x) { return 'via ' + x; }, phone: 'by phone only', form: 'form on the site', bots: function (b) { return 'blocks: ' + b; }, all: 'blocks all bots', words: function (n) { return 'only ' + n + ' words'; },
        pdf: 'PDF only', photos: function (n) { return n === 1 ? '1 photo' : n + ' photos'; }, nolink: 'shown, not tappable', addr: 'address only'
      },
      scoreL: 'Website score', of: '/100', biggest: 'Your biggest gap', none: 'I found no gaps in any of the checks. Well done.',
      problems: function (n) { return n === 1 ? '1 gap' : n + ' gaps'; }, ok: function (n) { return n + ' OK'; },
      lockH: 'Get the full report by email',
      lockP: 'Every gap in order of priority and what each one costs you, written for a business owner, not for a developer.',
      email: 'Your email', venue: 'Business name (optional)', venuePh: 'e.g. Blue Bay Villas',
      consent: 'Send me my report. I have read the <a href="/en/privacy" target="_blank">privacy policy</a>.',
      followup: 'You may email me once more about my results.',
      send: 'Email me the full report', sending: 'Sending…',
      badEmail: 'Please enter a valid email.', needConsent: 'Please tick the box so we can send your report.', sendFail: 'It was not sent. Try again shortly or message me on WhatsApp.',
      done: function (m) { return 'Sent to <b>' + m + '</b>. If you don’t see it in a few minutes, check your spam folder.'; },
      ctaH: 'Want us to fix it with you?',
      ctaP: 'We build websites that show up on Google, are read by AI assistants and bring in customers. The first 30-minute call is free.',
      book: 'Book a free 30-minute call', wa: 'Send me your result on WhatsApp',
      waText: function (h, s) { return 'Hello, I ran the website check for ' + h + ' and got ' + s + '/100. I would like to talk about it.'; },
      again: 'Check another site', bookUrl: 'https://rantevou.arakronservices.gr/arakron?lang=en&service=intro',
      note: 'Indicative check of the home page, up to 5 inner pages, robots.txt and llms.txt. It does not measure Google ranking or traffic.'
    }
  }[L];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  root.innerHTML =
    '<form class="sc-form" id="sc-form" novalidate>' +
      '<label class="sc-fl" for="sc-url">' + T.label + '</label>' +
      '<div class="sc-row"><input id="sc-url" type="text" inputmode="url" autocomplete="url" autocapitalize="off" spellcheck="false" placeholder="' + T.ph + '">' +
      '<button type="submit" class="btn btn-gold" id="sc-go">' + T.go + '</button></div>' +
      '<p class="sc-hint">' + T.hint + '</p><p class="sc-err" id="sc-err" role="alert"></p>' +
    '</form>' +
    '<div class="sc-wait" id="sc-wait" hidden><p class="sc-wait-host" id="sc-wait-host"></p><ol class="sc-steps" id="sc-steps">' +
      T.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol><div class="sc-track"><i id="sc-tbar"></i></div></div>' +
    '<div class="sc-out" id="sc-out" hidden>' +
      '<div class="sc-main"><p class="sc-site" id="sc-site"></p><div id="sc-groups"></div><p class="sc-note">' + T.note + '</p></div>' +
      '<aside class="sc-res" id="sc-res" aria-live="polite">' +
        '<p class="sc-label">' + T.scoreL + '</p>' +
        '<p class="sc-scoreline"><b id="sc-score">0</b><span>' + T.of + '</span></p>' +
        '<div class="sc-meter"><i id="sc-meter"></i></div>' +
        '<p class="sc-band" id="sc-band"></p><p class="sc-band-d" id="sc-band-d"></p>' +
        '<div class="sc-heads" id="sc-heads"></div>' +
        '<div class="sc-stats"><p><b id="sc-pn">0</b><span id="sc-pl"></span></p><p><b id="sc-on">0</b><span id="sc-ol"></span></p></div>' +
        '<div class="sc-top" id="sc-top"></div>' +
        '<form class="sc-lock" id="sc-lock" novalidate>' +
          '<p class="sc-lock-h">' + T.lockH + '</p><p class="sc-lock-p">' + T.lockP + '</p>' +
          '<label class="sc-fl" for="sc-email">' + T.email + '</label><input type="email" id="sc-email" autocomplete="email" placeholder="name@example.com">' +
          '<label class="sc-fl" for="sc-venue">' + T.venue + '</label><input type="text" id="sc-venue" maxlength="60" autocomplete="organization" placeholder="' + T.venuePh + '">' +
          '<input type="text" id="sc-hp" name="website" tabindex="-1" autocomplete="off" class="sc-hp" aria-hidden="true">' +
          '<label class="sc-check"><input type="checkbox" id="sc-consent"><span>' + T.consent + '</span></label>' +
          '<label class="sc-check"><input type="checkbox" id="sc-followup"><span>' + T.followup + '</span></label>' +
          '<button type="submit" class="btn btn-gold" id="sc-send">' + T.send + '</button><p class="sc-msg" id="sc-msg" role="alert"></p>' +
        '</form>' +
        '<p class="sc-done" id="sc-done" hidden></p>' +
        '<div class="sc-cta"><h3>' + T.ctaH + '</h3><p>' + T.ctaP + '</p>' +
          '<a class="btn btn-gold" href="' + T.bookUrl + '">' + T.book + '</a>' +
          '<a class="btn btn-ghost" id="sc-wa" href="https://wa.me/306983661460" target="_blank" rel="noopener">' + T.wa + '</a></div>' +
        '<p class="sc-tools"><button type="button" class="sc-link" id="sc-again">' + T.again + '</button></p>' +
      '</aside>' +
    '</div>';

  var form = $('sc-form'), input = $('sc-url'), err = $('sc-err'), wait = $('sc-wait'), out = $('sc-out');
  var last = null, timer = null;

  try { var pre = new URLSearchParams(location.search).get('site'); if (pre) input.value = pre.slice(0, 200); } catch (e) { /* noop */ }

  function clean(v) { return String(v || '').trim().replace(/\s+/g, ''); }
  function hostOf(u) { try { return new URL(/^https?:\/\//i.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }

  function startWait(host) {
    $('sc-wait-host').textContent = host;
    var lis = $('sc-steps').children, i = 0, bar = $('sc-tbar');
    Array.prototype.forEach.call(lis, function (li) { li.className = ''; });
    lis[0].className = 'on'; bar.style.width = '6%';
    wait.hidden = false;
    timer = setInterval(function () {
      if (i < lis.length - 1) { lis[i].className = 'done'; i++; lis[i].className = 'on'; }
      bar.style.width = Math.min(92, 6 + i * 21) + '%';
    }, 3200);
  }
  function stopWait() { clearInterval(timer); wait.hidden = true; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = clean(input.value);
    err.textContent = '';
    if (!v || v.indexOf('.') < 0) { err.textContent = T.empty; input.focus(); return; }
    run(v);
  });

  function run(v) {
    out.hidden = true; form.classList.add('is-busy'); $('sc-go').disabled = true;
    startWait(hostOf(v));
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    fetch(D.ENGINE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: v }), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (r.status === 429) throw new Error('busy'); return r.json(); })
      .then(function (j) {
        if (!j || !j.ok || !j.report) throw new Error(j && /άργησε/.test(j.error || '') ? 'slow' : 'fail');
        var list = D.fromReport(j.report);
        if (list.length < 6) throw new Error('fail');
        show(j.report, list);
      })
      .catch(function (e) {
        var m = e && e.message;
        err.textContent = m === 'busy' ? T.busy : (m === 'slow' || (e && e.name === 'AbortError')) ? T.slow : T.fail;
      })
      .then(function () { clearTimeout(to); stopWait(); form.classList.remove('is-busy'); $('sc-go').disabled = false; });
  }

  function detail(id, status, d) {
    d = d || {};
    if (id === 'book') { if (d.platform) return T.d.platform(d.platform); if (d.how === 'phone') return T.d.phone; if (d.how === 'form') return T.d.form; }
    if (id === 'menu' && d.pdf) return T.d.pdf;
    if (id === 'photos' && typeof d.n === 'number') return T.d.photos(d.n);
    if (id === 'call' && status === 'warn') return T.d.nolink;
    if (id === 'map' && status === 'warn') return T.d.addr;
    if (id === 'aibots' && status !== 'pass') { if (d.all) return T.d.all; if (d.bots && d.bots.length) return T.d.bots(d.bots.slice(0, 3).join(', ') + (d.bots.length > 3 ? '…' : '')); }
    if (id === 'nojs' && status !== 'pass' && typeof d.words === 'number') return T.d.words(d.words);
    return '';
  }

  function show(rep, list) {
    var r = D.compute(list);
    var vd = {}; ((rep.venue && rep.venue.items) || []).concat((rep.ai && rep.ai.items) || []).forEach(function (i) { vd[i.id] = i.d; });
    var host = (rep.meta && rep.meta.host) || hostOf(rep.meta && rep.meta.url);
    last = { url: (rep.meta && rep.meta.url) || '', host: host, list: list, r: r };

    $('sc-site').innerHTML = T.checked + ': <b>' + esc(host) + '</b> · ' + T.pages((rep.meta && rep.meta.pages) || 1);
    $('sc-groups').innerHTML = r.groups.map(function (g, gi) {
      var G = D.GROUPS.filter(function (x) { return x.id === g.id; })[0];
      return '<div class="sc-g"><div class="sc-g-h"><span class="sc-g-n">0' + (gi + 1) + '</span><h3>' + esc(G[L]) + '</h3><b>' + g.score + '</b></div>' +
        '<div class="sc-g-bar" data-s="' + band(g.score) + '"><i style="width:' + g.score + '%"></i></div>' +
        '<ul class="sc-items">' + g.items.map(function (it) {
          var x = detail(it.id, it.status, vd[it.id]);
          return '<li class="sc-i sc-' + it.status + '"><span class="sc-mk" aria-hidden="true"></span><span class="sc-in">' + esc(D.ITEMS[it.id][L].n) + '</span>' +
            '<span class="sc-st">' + T.st[it.status] + (x ? '<em>' + esc(x) + '</em>' : '') + '</span></li>';
        }).join('') + '</ul></div>';
    }).join('');

    var res = $('sc-res'); res.setAttribute('data-band', r.band);
    countTo($('sc-score'), r.score);
    $('sc-meter').style.width = r.score + '%';
    $('sc-heads').innerHTML = D.HEADS.filter(function (h) { return r.heads[h.id] !== null; }).map(function (h) {
      var v = r.heads[h.id];
      return '<p data-s="' + band(v) + '"><span>' + h[L] + '</span><b>' + v + '</b><i><em style="width:' + v + '%"></em></i></p>';
    }).join('');
    var B = D.BANDS[r.band][L];
    $('sc-band').textContent = B.t; $('sc-band-d').textContent = B.d;
    var okN = r.n - r.problems.length;
    $('sc-pn').textContent = r.problems.length; $('sc-pl').textContent = T.problems(r.problems.length).replace(/^\d+\s/, '');
    $('sc-on').textContent = okN; $('sc-ol').textContent = T.ok(okN).replace(/^\d+\s/, '');
    var top = r.problems[0];
    $('sc-top').innerHTML = top
      ? '<p class="sc-top-h">' + T.biggest + '</p><p class="sc-top-n">' + esc(D.ITEMS[top.id][L].n) + '</p><p class="sc-top-r">' + esc(D.ITEMS[top.id][L].r) + '</p>'
      : '<p class="sc-top-r">' + T.none + '</p>';
    $('sc-wa').href = 'https://wa.me/306983661460?text=' + encodeURIComponent(T.waText(host, r.score));
    $('sc-lock').hidden = !r.problems.length; $('sc-done').hidden = true; $('sc-msg').textContent = '';
    out.hidden = false;
    var y = out.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function band(s) { return s >= 80 ? 'good' : s >= 60 ? 'ok' : s >= 40 ? 'mid' : 'low'; }
  function countTo(el, n) {
    var t0 = null, dur = 700;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = n; return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  $('sc-again').addEventListener('click', function () {
    out.hidden = true; input.value = ''; err.textContent = '';
    window.scrollTo({ top: root.getBoundingClientRect().top + window.pageYOffset - 120, behavior: 'smooth' });
    setTimeout(function () { input.focus(); }, 400);
  });

  $('sc-lock').addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('sc-msg'), btn = $('sc-send');
    var email = $('sc-email').value.trim();
    msg.textContent = '';
    if (!/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,24}$/i.test(email)) { msg.textContent = T.badEmail; return; }
    if (!$('sc-consent').checked) { msg.textContent = T.needConsent; return; }
    if (!last) return;
    btn.disabled = true; btn.textContent = T.sending;
    fetch(REPORT_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: L, url: last.url, items: last.list, email: email, venue: $('sc-venue').value.trim(), consent: true, followup: $('sc-followup').checked, website: $('sc-hp').value })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) throw new Error('send');
      $('sc-lock').hidden = true;
      var dn = $('sc-done'); dn.innerHTML = T.done(esc(email)); dn.hidden = false;
    }).catch(function () { msg.textContent = T.sendFail; })
      .then(function () { btn.disabled = false; btn.textContent = T.send; });
  });
})();
