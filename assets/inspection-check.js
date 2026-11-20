/* AR Akron Services — Health inspection readiness check (EN). Runs in the browser, sends nothing. */
(function () {
  var root = document.getElementById('ic');
  if (!root) return;

  var SRC = {
    l5243: { t: 'Law 5243/2025, art. 104', u: 'https://www.taxheaven.gr/law/5243/2025/arthro/104' },
    l4442: { t: 'Law 4442/2016, art. 15', u: 'https://www.taxheaven.gr/law/4442/2016/arthro/15' },
    erg: { t: 'Labour Inspectorate fines', u: 'https://www.naftemporiki.gr/finance/economy/2074740/poy-tha-chtypisei-i-epitheorisi-ergasias/' },
    card: { t: 'Law 4808/2021 (digital work card)', u: 'https://www.powergame.gr/epichirisis/295968/yp-ergasias-prostima-eos-10-500-evro-gia-tin-paraviasi-tis-nomothesias/' },
    aade: { t: 'AADE decision A.1115/2026', u: 'https://www.aade.gr/sites/default/files/2026-06/a1115_2026.pdf' }
  };

  var HYG = { txt: '€500 – €5,000', max: 5000, src: 'l5243', note: 'hygiene' };
  var NOTIF = { txt: '€100 – €20,000', max: 20000, src: 'l4442' };

  var SECTIONS = [
    { id: 'lic', no: 'I', title: 'Licence and premises' },
    { id: 'staff', no: 'II', title: 'Staff' },
    { id: 'food', no: 'III', title: 'Food safety records' },
    { id: 'ops', no: 'IV', title: 'Fire safety, receipts and smoking' }
  ];

  // w: 3 high, 2 medium, 1 low. na: question can be "doesn't apply".
  var Q = [
    { id: 'notif', s: 'lic', w: 3, q: 'The operating notification for the venue was submitted on notifybusiness.gov.gr, and the municipal fee was paid, before you opened.',
      gap: 'No proof that the business was notified before opening. Inspectors usually ask for this first.', fine: NOTIF },
    { id: 'changes', s: 'lic', w: 2, q: 'The premises match what was notified: same floor area, same rooms, same activity. Any change since then was notified too.',
      gap: 'The premises may differ from what was notified. Unnotified changes are treated like a missing notification.', fine: NOTIF },
    { id: 'tables', s: 'lic', w: 1, na: true, q: 'If you have tables outside, you hold a valid municipal permit for the public space, and you keep within the permitted area.',
      gap: 'Outdoor tables without a valid permit, or outside the permitted area.', fine: { txt: 'Set by the municipality', max: 0 } },
    { id: 'music', s: 'lic', w: 1, na: true, q: 'If you play music, the use of music was notified to the municipality and you keep to the permitted hours and limits.',
      gap: 'Music without notification, or outside the permitted hours.', fine: { txt: 'Set by the municipality', max: 0 } },
    { id: 'prices', s: 'lic', w: 1, q: 'A price list is on display, and every menu shows final prices including taxes.',
      gap: 'No visible price list, or prices that are not final.', fine: { txt: 'Set by the market inspection authority', max: 0 } },

    { id: 'ergani', s: 'staff', w: 3, q: 'Every person working at the venue, including trial days, family and part-timers, is declared on ERGANI before their first shift.',
      gap: 'Undeclared work: the single most expensive finding in a Greek inspection.', fine: { txt: '€10,500 per worker, up to €31,500 on a repeat offence', max: 10500, src: 'erg' } },
    { id: 'card', s: 'staff', w: 3, q: 'The digital work card is active for every employee, and the recorded hours match the declared schedule.',
      gap: 'Digital work card not active, or hours that do not match the schedule.', fine: { txt: '€10,500 per employee', max: 10500, src: 'card' } },
    { id: 'health', s: 'staff', w: 2, q: 'Everyone who handles food holds a valid health certificate, and a copy is kept at the venue.',
      gap: 'Food handlers without a valid health certificate on file.', fine: HYG },
    { id: 'training', s: 'staff', w: 2, q: 'Your staff have completed the food hygiene training required for your type of venue, and you can show proof.',
      gap: 'No proof of hygiene training for the staff.', fine: HYG },
    { id: 'conduct', s: 'staff', w: 1, q: 'Kitchen staff wear clean work clothes, keep wounds covered, and nobody smokes or eats in food areas.',
      gap: 'Staff hygiene rules are not kept. Inspectors check this by looking, on the day.', fine: HYG },

    { id: 'haccp', s: 'food', w: 3, q: 'Your venue has its own food safety self-check file, based on HACCP principles, and it is up to date.',
      gap: 'No written self-check procedures for your venue.', fine: { txt: '€500 – €5,000', max: 5000, src: 'l5243' } },
    { id: 'temps', s: 'food', w: 2, q: 'Temperature records for your fridges and freezers are kept and up to date.',
      gap: 'Temperature records missing, incomplete or not believable.', fine: HYG },
    { id: 'trace', s: 'food', w: 3, q: 'For every product you buy you keep supplier invoices or delivery notes, so you can show where it came from.',
      gap: 'You cannot trace products back to the supplier.', fine: { txt: '€500 – €20,000', max: 20000, src: 'l5243' } },
    { id: 'labels', s: 'food', w: 2, q: 'Food in storage is labelled and kept the way inspectors expect.',
      gap: 'Food storage and labelling not in order.', fine: HYG },
    { id: 'pest', s: 'food', w: 2, q: 'Your pest control file is complete and up to date.',
      gap: 'No pest control file.', fine: HYG },
    { id: 'clean', s: 'food', w: 1, q: 'Your cleaning is documented.',
      gap: 'No cleaning schedule or cleaning records.', fine: HYG },
    { id: 'hands', s: 'food', w: 2, q: 'Your hand-washing facilities meet the hygiene requirements.',
      gap: 'Hand-washing facilities missing or not equipped.', fine: HYG },
    { id: 'water', s: 'food', w: 1, q: 'The venue uses water from the public network, or, if it does not, you hold recent water analyses.',
      gap: 'No proof that the water you use is safe.', fine: HYG },
    { id: 'allergens', s: 'food', w: 2, q: 'Your staff can tell a customer which of the 14 allergens each dish contains, and the information is written down.',
      gap: 'No allergen information for your dishes.', fine: { txt: '€200 – €5,000', max: 5000, src: 'l5243', note: 'other' } },

    { id: 'fire', s: 'ops', w: 3, q: 'Fire safety is in order for your size of venue, documents and equipment included.',
      gap: 'Fire safety documents or equipment not in order.', fine: { txt: 'Set by the Fire Service; no fixed range is published', max: 0 } },
    { id: 'receipts', s: 'ops', w: 3, q: 'A receipt is issued for every sale, and the card terminal is linked to the cash register as required.',
      gap: 'Sales without a receipt or not transmitted to AADE.', fine: { txt: 'Immediate 48-hour closure (more than 10 receipts or over €500 not issued); 96 hours on a repeat', max: 0, src: 'aade', closure: true } },
    { id: 'smoking', s: 'ops', w: 2, na: true, q: 'Nobody smokes in indoor areas, and the no-smoking signs are in place.',
      gap: 'Smoking in indoor areas. The venue operator is fined, not only the smoker.', fine: { txt: 'Fine on the operator, rising with each repeat; possible temporary closure', max: 0 } }
  ];

  var A = {}; // id -> 'y' | 'n' | 'u' | 'x'
  var LEVEL = { 3: 'High', 2: 'Medium', 1: 'Low' };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---- build questions
  var form = document.getElementById('ic-form');
  var n = 0;
  SECTIONS.forEach(function (sec) {
    var box = el('section', 'ic-sec');
    box.appendChild(el('h2', 'ic-sec-h', '<span>' + sec.no + '</span>' + esc(sec.title)));
    var ol = el('ol', 'ic-qs');
    Q.filter(function (q) { return q.s === sec.id; }).forEach(function (q) {
      n++;
      var li = el('li', 'ic-q');
      li.id = 'q-' + q.id;
      var fs = el('fieldset');
      fs.appendChild(el('legend', null, '<span class="ic-num">' + (n < 10 ? '0' + n : n) + '</span>' + esc(q.q)));
      var opts = el('div', 'ic-opts');
      var choices = [['y', 'Yes'], ['n', 'No'], ['u', 'Not sure']];
      if (q.na) choices.push(['x', 'Doesn’t apply']);
      choices.forEach(function (c) {
        var lab = el('label', 'ic-opt ic-' + c[0]);
        lab.innerHTML = '<input type="radio" name="' + q.id + '" value="' + c[0] + '"><span>' + c[1] + '</span>';
        opts.appendChild(lab);
      });
      fs.appendChild(opts);
      li.appendChild(fs);
      ol.appendChild(li);
    });
    box.appendChild(ol);
    form.appendChild(box);
  });

  form.addEventListener('change', function (e) {
    if (e.target.name) { A[e.target.name] = e.target.value; update(); }
  });

  // ---- results
  var $ = function (id) { return document.getElementById(id); };
  var TOTAL = Q.length;

  function compute() {
    var answered = 0, got = 0, max = 0, gaps = [];
    Q.forEach(function (q) {
      var a = A[q.id];
      if (!a) return;
      answered++;
      if (a === 'x') return;
      max += q.w;
      if (a === 'y') got += q.w;
      else gaps.push({ q: q, unsure: a === 'u' });
    });
    gaps.sort(function (a, b) {
      return (b.q.fine.closure ? 1 : 0) - (a.q.fine.closure ? 1 : 0) || b.q.w - a.q.w || (b.q.fine.max || 0) - (a.q.fine.max || 0);
    });
    var score = max ? Math.round(100 * got / max) : 0;
    var high = gaps.filter(function (g) { return g.q.w === 3; }).length;
    return { answered: answered, score: score, gaps: gaps, high: high, done: answered === TOTAL };
  }

  function band(r) {
    if (r.score >= 85 && r.high === 0) return { k: 'ok', t: 'Close to ready', d: 'An inspector would find little. Keep the records going every day, not just before a visit.' };
    if (r.score >= 60 && r.high <= 1) return { k: 'mid', t: 'Gaps an inspector would find', d: 'You have the basics, but the gaps below are the kind that lead to fines on the day.' };
    return { k: 'low', t: 'High risk', d: 'As things stand, an inspection would likely end in fines, and some gaps can close the venue.' };
  }

  function sourceLink(key) {
    var s = SRC[key];
    return s ? '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + '</a>' : '';
  }

  function update() {
    var r = compute();
    $('ic-count').textContent = r.answered + ' of ' + TOTAL + ' answered';
    $('ic-bar').style.width = Math.round(100 * r.answered / TOTAL) + '%';
    var res = $('ic-res');
    res.classList.toggle('is-empty', r.answered === 0);
    if (r.answered === 0) { mini(r); return; }

    $('ic-score').textContent = r.score;
    $('ic-meter').style.width = r.score + '%';
    var b = band(r);
    res.dataset.band = b.k;
    $('ic-band').textContent = r.done ? b.t : 'Provisional';
    $('ic-band-d').textContent = r.done ? b.d : 'Answer all ' + TOTAL + ' questions for your final result. ' + (TOTAL - r.answered) + ' to go.';
    $('ic-gapn').textContent = r.gaps.length;
    $('ic-highn').textContent = r.high;
    var closure = r.gaps.some(function (g) { return g.q.fine.closure; });
    $('ic-closure').hidden = !closure;

    var list = $('ic-gaps');
    list.innerHTML = '';
    if (!r.gaps.length) {
      list.appendChild(el('li', 'ic-gap-none', 'No gaps in the questions you have answered so far.'));
    }
    r.gaps.forEach(function (g) {
      var q = g.q;
      var li = el('li', 'ic-gap ic-w' + q.w);
      li.innerHTML =
        '<p class="ic-gap-lvl">' + LEVEL[q.w] + ' risk' + (g.unsure ? ' · not sure' : '') + '</p>' +
        '<p class="ic-gap-t">' + esc(q.gap) + '</p>' +
        '<p class="ic-gap-f"><span>Penalty</span>' + esc(q.fine.txt) + (q.fine.src ? ' <em>' + sourceLink(q.fine.src) + '</em>' : '') + '</p>' +
        '<a class="ic-gap-q" href="#q-' + q.id + '">Change answer</a>';
      list.appendChild(li);
    });
    $('ic-actions').hidden = false;
    var wa = 'Hello, I did the health inspection readiness check on arakronservices.gr. My score is ' + r.score + '/100 with ' + r.gaps.length + ' gaps. I would like to talk about my venue.';
    $('ic-wa').href = 'https://wa.me/306983661460?text=' + encodeURIComponent(wa);
    mini(r);
    sheet(r, b);
  }

  // ---- mobile summary bar
  var miniBar = $('ic-mini');
  function mini(r) {
    if (!miniBar) return;
    $('ic-m-score').textContent = r.answered ? r.score + '/100' : '—';
    $('ic-m-gaps').textContent = r.answered ? r.gaps.length : '—';
    var resBox = $('ic-res').getBoundingClientRect();
    var inView = resBox.top < window.innerHeight && resBox.bottom > 0;
    miniBar.classList.toggle('off', !r.answered || inView);
  }
  window.addEventListener('scroll', function () { mini(compute()); }, { passive: true });

  // ---- print sheet
  function sheet(r, b) {
    var s = $('ic-sheet');
    var venue = ($('ic-venue').value || '').trim();
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    var rows = r.gaps.map(function (g, i) {
      return '<tr><td>' + (i + 1) + '</td><td>' + esc(g.q.gap) + (g.unsure ? ' <i>(not sure)</i>' : '') + '</td><td>' + LEVEL[g.q.w] + '</td><td>' + esc(g.q.fine.txt) + (g.q.fine.src ? '<br><small>' + esc(SRC[g.q.fine.src].t) + '</small>' : '') + '</td></tr>';
    }).join('');
    s.innerHTML =
      '<div class="ps-head"><div><p class="ps-brand">AR Akron <span>Services</span></p><p class="ps-kicker">Health inspection readiness check</p><h2>' + (venue ? esc(venue) : 'Your venue') + '</h2></div>' +
      '<p class="ps-date">' + date + '<br>Score <b>' + r.score + '/100</b><br>' + esc(r.done ? b.t : 'Provisional (' + r.answered + '/' + TOTAL + ' answered)') + '</p></div>' +
      (rows ? '<table><thead><tr><th>#</th><th>Gap</th><th>Risk</th><th>Penalty</th></tr></thead><tbody>' + rows + '</tbody></table>' : '<p>No gaps found in the answered questions.</p>') +
      '<p class="ps-foot">Indicative information based on your own answers, not legal advice. The exact fine is set by the inspecting authority. Fine ranges as of November 2026. ' +
      'Prepared with the free tool at arakronservices.gr/blog/health-inspection-checklist-greece · AR Akron Services · +30 698 366 1460 · info@arakronservices.gr</p>';
  }

  $('ic-pdf').addEventListener('click', function () { sheet(compute(), band(compute())); window.print(); });
  $('ic-venue').addEventListener('input', function () { sheet(compute(), band(compute())); });
  $('ic-reset').addEventListener('click', function () {
    A = {};
    form.querySelectorAll('input[type=radio]').forEach(function (i) { i.checked = false; });
    update();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  update();
})();
