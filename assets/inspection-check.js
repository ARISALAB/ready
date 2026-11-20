/* AR Akron Services — Health inspection readiness check (EN).
   Answers stay in the browser unless the visitor asks for the full report by email. */
(function () {
  var root = document.getElementById('ic');
  if (!root || !window.IC_DATA) return;

  var ENDPOINT = 'https://arakron.netlify.app/.netlify/functions/health-report';
  var D = window.IC_DATA, SRC = D.SRC, SECTIONS = D.SECTIONS, Q = D.Q, LEVEL = D.LEVEL;
  var TOTAL = Q.length;
  var A = {};
  var unlocked = false;
  try { unlocked = sessionStorage.getItem('ic-unlocked') === '1'; } catch (e) {}

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var $ = function (id) { return document.getElementById(id); };

  // ---- build questions
  var form = $('ic-form');
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

  function sourceLink(key) {
    var s = SRC[key];
    return s ? '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + '</a>' : '';
  }

  function gapItem(g) {
    var q = g.q;
    var li = el('li', 'ic-gap ic-w' + q.w);
    li.innerHTML =
      '<p class="ic-gap-lvl">' + LEVEL[q.w] + ' risk' + (g.unsure ? ' · not sure' : '') + '</p>' +
      '<p class="ic-gap-t">' + esc(q.gap) + '</p>' +
      '<p class="ic-gap-f"><span>Penalty</span>' + esc(q.fine.txt) + (q.fine.src ? ' <em>' + sourceLink(q.fine.src) + '</em>' : '') + '</p>' +
      '<a class="ic-gap-q" href="#q-' + q.id + '">Change answer</a>';
    return li;
  }

  function update() {
    var r = D.compute(A);
    $('ic-count').textContent = r.answered + ' of ' + TOTAL + ' answered';
    $('ic-bar').style.width = Math.round(100 * r.answered / TOTAL) + '%';
    var res = $('ic-res');
    res.classList.toggle('is-empty', r.answered === 0);
    res.classList.toggle('is-unlocked', unlocked);
    if (r.answered === 0) { mini(r); return; }

    $('ic-score').textContent = r.score;
    $('ic-meter').style.width = r.score + '%';
    var b = D.band(r);
    res.dataset.band = b.k;
    $('ic-band').textContent = r.done ? b.t : 'Provisional';
    $('ic-band-d').textContent = r.done ? b.d : 'Answer all ' + TOTAL + ' questions for your final result. ' + (TOTAL - r.answered) + ' to go.';
    $('ic-gapn').textContent = r.gaps.length;
    $('ic-highn').textContent = r.high;
    $('ic-closure').hidden = !r.gaps.some(function (g) { return g.q.fine.closure; });

    var list = $('ic-gaps');
    list.innerHTML = '';
    if (!r.gaps.length) list.appendChild(el('li', 'ic-gap-none', 'No gaps in the questions you have answered so far.'));
    var shown = unlocked ? r.gaps : r.gaps.slice(0, 1);
    shown.forEach(function (g) { list.appendChild(gapItem(g)); });
    $('ic-gaps-h').textContent = unlocked || r.gaps.length < 2 ? 'What an inspector would find' : 'The most serious gap';

    // lock / email block
    var more = r.gaps.length - 1;
    var lock = $('ic-lock');
    lock.hidden = unlocked;
    if (!unlocked) {
      $('ic-lock-h').textContent = more > 0
        ? '+' + more + ' more gap' + (more === 1 ? '' : 's') + ' with their penalties and sources'
        : 'Your full report, with penalties and sources';
      $('ic-lock-p').textContent = r.done
        ? 'Get the full report by email, free. No newsletter.'
        : 'Answer all ' + TOTAL + ' questions, then get the full report by email, free.';
      $('ic-send').disabled = !r.done;
    }
    $('ic-tools').hidden = !unlocked;

    var wa = 'Hello, I did the health inspection readiness check on arakronservices.gr. My score is ' + r.score + '/100 with ' + r.gaps.length + ' gaps. I would like to talk about my venue.';
    $('ic-wa').href = 'https://wa.me/306983661460?text=' + encodeURIComponent(wa);
    mini(r);
    if (unlocked) sheet(r, b);
  }

  // ---- email request
  var mailForm = $('ic-lock');
  mailForm.addEventListener('submit', function (e) {
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
        try { sessionStorage.setItem('ic-unlocked', '1'); } catch (e) {}
        $('ic-done').hidden = false;
        $('ic-done-mail').textContent = email;
        update();
        $('ic-res').scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.gtag) { try { window.gtag('event', 'health_check_report', { score: r.score }); } catch (e) {} }
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
    $('ic-m-score').textContent = r.answered ? r.score + '/100' : '—';
    $('ic-m-gaps').textContent = r.answered ? r.gaps.length : '—';
    var box = $('ic-res').getBoundingClientRect();
    miniBar.classList.toggle('off', !r.answered || (box.top < window.innerHeight && box.bottom > 0));
  }
  window.addEventListener('scroll', function () { mini(D.compute(A)); }, { passive: true });

  // ---- print sheet (only after the report was requested)
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

  $('ic-pdf').addEventListener('click', function () {
    if (!unlocked) return;
    var r = D.compute(A); sheet(r, D.band(r)); window.print();
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
