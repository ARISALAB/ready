/* AR Akron Services — Health inspection risk check (EN).
   Answers stay in the browser unless the visitor asks for the full report by email. */
(function () {
  var root = document.getElementById('ic');
  if (!root || !window.IC_DATA) return;

  var ENDPOINT = 'https://arakron.netlify.app/.netlify/functions/health-report';
  var D = window.IC_DATA, Q = D.Q;
  var TOTAL = Q.length;
  var A = {};
  var unlocked = false;
  try { unlocked = sessionStorage.getItem('ic-unlocked2') === '1'; } catch (e) {}

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var $ = function (id) { return document.getElementById(id); };

  // ---- build questions
  var form = $('ic-form');
  var ol = el('ol', 'ic-qs');
  Q.forEach(function (q, i) {
    var li = el('li', 'ic-q');
    li.id = 'q-' + q.id;
    var fs = el('fieldset');
    fs.appendChild(el('legend', null, '<span class="ic-num">' + (i + 1 < 10 ? '0' + (i + 1) : i + 1) + '</span>' + esc(q.q)));
    var opts = el('div', 'ic-choices');
    q.o.forEach(function (o) {
      var lab = el('label', 'ic-choice');
      lab.innerHTML = '<input type="radio" name="' + q.id + '" value="' + o.k + '"><span>' + esc(o.t) + '</span>';
      opts.appendChild(lab);
    });
    fs.appendChild(opts);
    li.appendChild(fs);
    ol.appendChild(li);
  });
  form.appendChild(ol);

  form.addEventListener('change', function (e) {
    if (e.target.name) { A[e.target.name] = e.target.value; update(); }
  });

  function factorItem(f) {
    var li = el('li', 'ic-gap ' + (f.o.r >= 4 ? 'ic-w3' : 'ic-w2'));
    li.innerHTML = '<p class="ic-gap-lvl">' + (f.o.r >= 4 ? 'Major factor' : 'Risk factor') + '</p><p class="ic-gap-t">' + esc(f.o.f) + '</p>';
    return li;
  }

  function stakesHtml() {
    return '<p class="ic-gaps-h">What it could cost</p><ul class="ic-stakes">' + D.STAKES.map(function (s) {
      return '<li><span>' + esc(s.t) + '</span><b>' + esc(s.v) + '</b><a href="' + s.s.u + '" target="_blank" rel="noopener">' + esc(s.s.t) + '</a></li>';
    }).join('') + '</ul>';
  }

  function update() {
    var r = D.compute(A);
    $('ic-count').textContent = r.answered + ' of ' + TOTAL + ' answered';
    $('ic-bar').style.width = Math.round(100 * r.answered / TOTAL) + '%';
    var res = $('ic-res');
    res.classList.toggle('is-empty', r.answered === 0);
    res.classList.toggle('is-unlocked', unlocked);
    if (r.answered === 0) { mini(r); return; }

    var L = D.LEVELS[r.level];
    res.dataset.band = r.level === 'high' ? 'low' : r.level === 'medium' ? 'mid' : 'ok';
    $('ic-level').textContent = r.done ? L.t : 'Provisional';
    $('ic-meter').style.width = Math.max(4, r.risk) + '%';
    $('ic-band-d').textContent = r.done ? L.d : 'Answer all ' + TOTAL + ' questions for your result. ' + (TOTAL - r.answered) + ' to go.';
    $('ic-gapn').textContent = r.factors.length;

    var list = $('ic-gaps');
    list.innerHTML = '';
    if (!r.factors.length) list.appendChild(el('li', 'ic-gap-none', 'No risk factors in your answers so far.'));
    (unlocked ? r.factors : r.factors.slice(0, 1)).forEach(function (f) { list.appendChild(factorItem(f)); });
    $('ic-gaps-h').textContent = unlocked || r.factors.length < 2 ? 'Your risk factors' : 'Your biggest risk factor';
    $('ic-stakes').innerHTML = unlocked ? stakesHtml() : '';

    var more = r.factors.length - 1;
    $('ic-lock').hidden = unlocked;
    if (!unlocked) {
      $('ic-lock-h').textContent = more > 0
        ? '+' + more + ' more risk factor' + (more === 1 ? '' : 's') + ', and what they could cost you'
        : 'Your full report, and what a failed inspection could cost you';
      $('ic-lock-p').textContent = r.done
        ? 'Get the full report by email, free. No newsletter.'
        : 'Answer all ' + TOTAL + ' questions, then get the full report by email, free.';
      $('ic-send').disabled = !r.done;
    }
    $('ic-tools').hidden = !unlocked;

    var wa = 'Hello, I did the health inspection risk check on arakronservices.gr. My result: ' + (r.done ? L.t : 'not finished') + ', ' + r.factors.length + ' risk factors. I would like to talk about my venue.';
    $('ic-wa').href = 'https://wa.me/306983661460?text=' + encodeURIComponent(wa);
    mini(r);
    if (unlocked) sheet(r, L);
  }

  // ---- email request
  $('ic-lock').addEventListener('submit', function (e) {
    e.preventDefault();
    var r = D.compute(A);
    var msg = $('ic-msg');
    if (!r.done) { msg.textContent = 'Please answer all ' + TOTAL + ' questions first.'; return; }
    var email = $('ic-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; $('ic-email').focus(); return; }
    if (!$('ic-consent').checked) { msg.textContent = 'Please tick the box so we can send you the report.'; return; }
    var btn = $('ic-send');
    btn.disabled = true; btn.textContent = 'Sending…'; msg.textContent = '';
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, venue: $('ic-venue').value, consent: true, followup: $('ic-followup').checked, website: $('ic-hp').value, answers: A })
    }).then(function (res) { return res.json().catch(function () { return {}; }).then(function (j) { return { ok: res.ok && j.ok, j: j }; }); })
      .then(function (out) {
        if (!out.ok) throw new Error(out.j && out.j.error || 'send');
        unlocked = true;
        try { sessionStorage.setItem('ic-unlocked2', '1'); } catch (e) {}
        $('ic-done').hidden = false;
        $('ic-done-mail').textContent = email;
        update();
        $('ic-res').scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.gtag) { try { window.gtag('event', 'health_check_report', { level: r.level }); } catch (e) {} }
      })
      .catch(function (err) {
        msg.innerHTML = String(err.message) === 'email'
          ? 'That email address does not look right. Please check it.'
          : 'We could not send it right now. Please try again in a minute, or <a href="https://wa.me/306983661460" target="_blank" rel="noopener">message us on WhatsApp</a>.';
      })
      .then(function () { btn.disabled = !D.compute(A).done; btn.textContent = 'Email me the full report'; });
  });

  // ---- mobile summary bar
  var miniBar = $('ic-mini');
  function mini(r) {
    if (!miniBar) return;
    $('ic-m-score').textContent = r.answered ? (r.done ? D.LEVELS[r.level].t : '…') : '—';
    $('ic-m-gaps').textContent = r.answered ? r.factors.length : '—';
    var box = $('ic-res').getBoundingClientRect();
    miniBar.classList.toggle('off', !r.answered || (box.top < window.innerHeight && box.bottom > 0));
  }
  window.addEventListener('scroll', function () { mini(D.compute(A)); }, { passive: true });

  // ---- print sheet (only after the report was requested)
  function sheet(r, L) {
    var venue = ($('ic-venue').value || '').trim();
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    var rows = r.factors.map(function (f, i) { return '<tr><td>' + (i + 1) + '</td><td>' + esc(f.o.f) + '</td></tr>'; }).join('');
    var stakes = D.STAKES.map(function (s) { return '<tr><td>' + esc(s.t) + '</td><td>' + esc(s.v) + '<br><small>' + esc(s.s.t) + '</small></td></tr>'; }).join('');
    $('ic-sheet').innerHTML =
      '<div class="ps-head"><div><p class="ps-brand">AR Akron <span>Services</span></p><p class="ps-kicker">Health inspection risk check</p><h2>' + (venue ? esc(venue) : 'Your venue') + '</h2></div>' +
      '<p class="ps-date">' + date + '<br><b>' + esc(L.t) + '</b></p></div>' +
      '<p>' + esc(L.d) + '</p>' +
      (rows ? '<table><thead><tr><th>#</th><th>Risk factor</th></tr></thead><tbody>' + rows + '</tbody></table>' : '<p>No risk factors in your answers.</p>') +
      '<table style="margin-top:18px"><thead><tr><th>What it could cost</th><th>Penalty</th></tr></thead><tbody>' + stakes + '</tbody></table>' +
      '<p class="ps-foot">Indicative assessment based on your own answers, not legal advice. Fine ranges as of November 2026. ' +
      'arakronservices.gr/blog/health-inspection-checklist-greece · AR Akron Services · +30 698 366 1460 · info@arakronservices.gr</p>';
  }

  $('ic-pdf').addEventListener('click', function () {
    if (!unlocked) return;
    var r = D.compute(A); sheet(r, D.LEVELS[r.level]); window.print();
  });
  $('ic-reset').addEventListener('click', function () {
    A = {};
    form.querySelectorAll('input[type=radio]').forEach(function (i) { i.checked = false; });
    update();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('beforeprint', function () { if (!unlocked) $('ic-sheet').innerHTML = ''; });

  update();
})();
