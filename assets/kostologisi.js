/* AR Akron Services — free dish costing calculator (same formulas as GoFinanceOS) */
(function () {
  var root = document.getElementById('dc');
  if (!root) return;
  var LANG = (document.documentElement.lang || 'el').slice(0, 2) === 'en' ? 'en' : 'el';
  var T = {
    el: {
      ing: 'Υλικό', price: 'Τιμή αγοράς', per: 'ανά', yld: 'Απόδοση %', qty: 'Ποσότητα', cost: 'Κόστος',
      remove: 'Αφαίρεση υλικού', pc: 'τεμ.', phIng: 'π.χ. Ντομάτα',
      good: 'Καλό', warn: 'Προσοχή', over: 'Εκτός στόχου',
      vGood: 'Άνετα μέσα στον στόχο. Το πιάτο αφήνει καλό περιθώριο.',
      vWarn: 'Κοντά στον στόχο. Προσέξτε τις τιμές των προμηθευτών.',
      vOver: '{n} μονάδες πάνω από τον στόχο. Εξετάστε νέα τιμή ή μικρότερη μερίδα.',
      noPrice: 'Βάλτε τιμή πώλησης για να δείτε food cost και κέρδος.',
      sheet: 'Κάρτα κοστολόγησης', dish: 'Πιάτο', portions: 'Μερίδες', recipe: 'Κόστος συνταγής',
      extras: 'Πρόσθετα / μερίδα', cpp: 'Κόστος / μερίδα', sell: 'Τιμή πώλησης (με ΦΠΑ)', net: 'Καθαρή τιμή',
      pct: 'Food cost', profit: 'Μικτό κέρδος / μερίδα', target: 'Στόχος food cost', sug: 'Προτεινόμενη τιμή (με ΦΠΑ)',
      date: 'Ημερομηνία', noName: 'Χωρίς όνομα', confirmClear: 'Να καθαριστούν όλα τα πεδία;',
      footer: 'Δημιουργήθηκε με το δωρεάν εργαλείο κοστολόγησης της AR Akron Services · arakronservices.gr',
      footer2: 'Όλο το μενού, ιστορικό τιμών και κάρτες για κάθε πιάτο: GoFinanceOS · gofinanceos.com',
      locale: 'el-GR'
    },
    en: {
      ing: 'Ingredient', price: 'Purchase price', per: 'per', yld: 'Yield %', qty: 'Quantity', cost: 'Cost',
      remove: 'Remove ingredient', pc: 'pc', phIng: 'e.g. Tomato',
      good: 'Good', warn: 'Caution', over: 'Over target',
      vGood: 'Comfortably within target. This dish leaves a healthy margin.',
      vWarn: 'Close to target. Keep an eye on supplier prices.',
      vOver: '{n} points over target. Consider a new price or a smaller portion.',
      noPrice: 'Enter a selling price to see food cost and profit.',
      sheet: 'Costing sheet', dish: 'Dish', portions: 'Portions', recipe: 'Recipe cost',
      extras: 'Extras / portion', cpp: 'Cost / portion', sell: 'Selling price (incl. VAT)', net: 'Net price',
      pct: 'Food cost', profit: 'Gross profit / portion', target: 'Target food cost', sug: 'Suggested price (incl. VAT)',
      date: 'Date', noName: 'Untitled dish', confirmClear: 'Clear all fields?',
      footer: 'Created with the free costing tool by AR Akron Services · arakronservices.gr',
      footer2: 'Your whole menu, price history and a sheet for every dish: GoFinanceOS · gofinanceos.com',
      locale: 'en-GB'
    }
  }[LANG];

  // Same unit model as GoFinanceOS: quantity unit converted to the purchase unit.
  var UNITS = { kg: { g: 'm', f: 1 }, g: { g: 'm', f: 0.001 }, L: { g: 'v', f: 1 }, ml: { g: 'v', f: 0.001 }, pc: { g: 'p', f: 1 } };
  var SUB = { kg: ['g', 'kg'], L: ['ml', 'L'], pc: ['pc'] };

  var EXAMPLE = {
    el: { name: 'Χωριάτικη σαλάτα', rows: [
      ['Ντομάτα', 2.2, 'kg', 90, 250, 'g'], ['Αγγούρι', 1.2, 'kg', 85, 80, 'g'], ['Κρεμμύδι', 1, 'kg', 90, 30, 'g'],
      ['Πιπεριά', 2.8, 'kg', 85, 30, 'g'], ['Φέτα', 9.5, 'kg', 100, 80, 'g'], ['Ελιές Καλαμών', 7.5, 'kg', 75, 25, 'g'],
      ['Ελαιόλαδο', 8.5, 'L', 100, 30, 'ml']] },
    en: { name: 'Greek salad', rows: [
      ['Tomato', 2.2, 'kg', 90, 250, 'g'], ['Cucumber', 1.2, 'kg', 85, 80, 'g'], ['Onion', 1, 'kg', 90, 30, 'g'],
      ['Green pepper', 2.8, 'kg', 85, 30, 'g'], ['Feta', 9.5, 'kg', 100, 80, 'g'], ['Kalamata olives', 7.5, 'kg', 75, 25, 'g'],
      ['Olive oil', 8.5, 'L', 100, 30, 'ml']] }
  }[LANG];

  function $(id) { return document.getElementById(id); }
  function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; }
  function eur(n) { return n.toLocaleString(T.locale, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function pct(n) { return n.toLocaleString(T.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%'; }
  function inNum(n) { return String(n).replace('.', LANG === 'el' ? ',' : '.'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uLabel(u) { return u === 'pc' ? T.pc : u; }

  var rowsEl = $('dc-rows');

  function unitOpts(list, sel) {
    return list.map(function (u) { return '<option value="' + u + '"' + (u === sel ? ' selected' : '') + '>' + uLabel(u) + '</option>'; }).join('');
  }

  function addRow(r) {
    r = r || ['', '', 'kg', 100, '', 'g'];
    var div = document.createElement('div');
    div.className = 'dc-row';
    div.innerHTML =
      '<label class="dc-f dc-f-name"><span>' + T.ing + '</span><input type="text" data-k="name" placeholder="' + esc(T.phIng) + '" value="' + esc(r[0]) + '"></label>' +
      '<label class="dc-f"><span>' + T.price + ' (€)</span><input type="text" inputmode="decimal" data-k="price" value="' + (r[1] === '' ? '' : inNum(r[1])) + '"></label>' +
      '<label class="dc-f"><span>' + T.per + '</span><select data-k="bu">' + unitOpts(['kg', 'L', 'pc'], r[2]) + '</select></label>' +
      '<label class="dc-f"><span>' + T.yld + '</span><input type="text" inputmode="decimal" data-k="yield" value="' + inNum(r[3]) + '"></label>' +
      '<label class="dc-f"><span>' + T.qty + '</span><input type="text" inputmode="decimal" data-k="qty" value="' + (r[4] === '' ? '' : inNum(r[4])) + '"></label>' +
      '<label class="dc-f"><span>&nbsp;</span><select data-k="qu" aria-label="' + T.qty + '">' + unitOpts(SUB[r[2]] || SUB.kg, r[5]) + '</select></label>' +
      '<div class="dc-f dc-f-cost"><span>' + T.cost + '</span><output data-k="cost">—</output></div>' +
      '<button type="button" class="dc-del" aria-label="' + T.remove + '">×</button>';
    rowsEl.appendChild(div);
    return div;
  }

  function readRow(div) {
    function v(k) { return div.querySelector('[data-k="' + k + '"]').value; }
    var bu = v('bu'), qu = v('qu');
    var b = UNITS[bu], okQ = UNITS[qu] && UNITS[qu].g === b.g, q = okQ ? UNITS[qu] : b;
    var y = num(v('yield')) || 100;
    if (y > 100) y = 100;
    var real = num(v('price')) / (y / 100);
    return { name: v('name').trim(), price: num(v('price')), bu: bu, yld: y, qty: num(v('qty')), qu: okQ ? qu : bu, real: real, cost: num(v('qty')) * q.f / b.f * real };
  }

  function calc() {
    var lines = [].map.call(rowsEl.querySelectorAll('.dc-row'), function (d) { var l = readRow(d); d.querySelector('[data-k="cost"]').textContent = l.cost > 0 ? eur(l.cost) : '—'; return l; });
    var recipe = lines.reduce(function (s, l) { return s + l.cost; }, 0);
    var portions = Math.max(1, Math.round(num($('dc-portions').value)) || 1);
    var extras = num($('dc-pack').value) + num($('dc-extra').value);
    var cpp = recipe / portions + extras;
    var vat = num($('dc-vat').value), gross = num($('dc-price').value), net = gross / (1 + vat / 100);
    var target = num($('dc-target').value) || 30;
    var p = net > 0 ? cpp / net * 100 : 0, profit = net - cpp, margin = net > 0 ? profit / net * 100 : 0;
    var status = (net <= 0 || cpp <= 0) ? 'none' : p <= target * 0.8 ? 'good' : p <= target ? 'warn' : 'over';
    var sugNet = cpp > 0 ? cpp / (target / 100) : 0, sugGross = sugNet * (1 + vat / 100);
    var sugRound = sugGross > 0 ? Math.ceil(sugGross * 10 - 1e-9) / 10 : 0;
    return { lines: lines, recipe: recipe, portions: portions, extras: extras, cpp: cpp, vat: vat, gross: gross, net: net, pct: p, profit: profit, margin: margin, target: target, status: status, sugNet: sugNet, sugGross: sugRound };
  }

  function render() {
    var c = calc();
    $('dc-r-cpp').textContent = c.cpp > 0 ? eur(c.cpp) : '—';
    $('dc-r-recipe').textContent = c.recipe > 0 ? eur(c.recipe) : '—';
    $('dc-r-sug').textContent = c.sugGross > 0 ? eur(c.sugGross) : '—';
    $('dc-r-sugnet').textContent = c.sugNet > 0 ? eur(c.sugNet) : '—';
    $('dc-r-tgt').textContent = pct(c.target);
    $('dc-m-cpp').textContent = $('dc-r-cpp').textContent;
    $('dc-m-sug').textContent = $('dc-r-sug').textContent;
    $('dc-use').disabled = !(c.sugGross > 0);
    var has = c.status !== 'none';
    $('dc-r-pct').textContent = has ? pct(c.pct) : '—';
    $('dc-r-profit').textContent = has ? eur(c.profit) : '—';
    $('dc-r-margin').textContent = has ? pct(c.margin) : '—';
    $('dc-r-net').textContent = c.net > 0 ? eur(c.net) : '—';
    var badge = $('dc-badge');
    badge.className = 'dc-badge dc-' + c.status;
    badge.textContent = has ? T[c.status] : '';
    $('dc-verdict').textContent = !has ? T.noPrice
      : c.status === 'good' ? T.vGood : c.status === 'warn' ? T.vWarn
      : T.vOver.replace('{n}', (c.pct - c.target).toLocaleString(T.locale, { maximumFractionDigits: 1 }));
    return c;
  }

  rowsEl.addEventListener('input', render);
  rowsEl.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-k') === 'bu') {
      var row = e.target.closest('.dc-row'), qu = row.querySelector('[data-k="qu"]'), list = SUB[e.target.value];
      qu.innerHTML = unitOpts(list, list[0]);
    }
    render();
  });
  rowsEl.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dc-del')) return;
    e.target.closest('.dc-row').remove();
    if (!rowsEl.children.length) addRow();
    render();
  });
  ['dc-name', 'dc-portions', 'dc-price', 'dc-vat', 'dc-target', 'dc-pack', 'dc-extra'].forEach(function (id) {
    $(id).addEventListener('input', render);
    $(id).addEventListener('change', render);
  });
  $('dc-add').addEventListener('click', function () { addRow().querySelector('input').focus(); render(); });
  $('dc-use').addEventListener('click', function () { var c = calc(); if (c.sugGross > 0) { $('dc-price').value = inNum(c.sugGross.toFixed(2)); render(); } });
  $('dc-clear').addEventListener('click', function () {
    if (!window.confirm(T.confirmClear)) return;
    $('dc-name').value = ''; $('dc-portions').value = '1'; $('dc-price').value = ''; $('dc-pack').value = ''; $('dc-extra').value = '';
    rowsEl.innerHTML = ''; addRow(); render();
  });
  $('dc-example').addEventListener('click', loadExample);

  function loadExample() {
    $('dc-name').value = EXAMPLE.name; $('dc-portions').value = '1'; $('dc-price').value = inNum('9.50');
    $('dc-vat').value = '13'; $('dc-target').value = '30'; $('dc-pack').value = ''; $('dc-extra').value = '';
    rowsEl.innerHTML = ''; EXAMPLE.rows.forEach(addRow); render();
  }

  // Costing sheet: filled on demand and printed (the browser's "Save as PDF").
  $('dc-pdf').addEventListener('click', function () {
    var c = render(), name = $('dc-name').value.trim() || T.noName;
    var rows = c.lines.filter(function (l) { return l.name || l.cost > 0; }).map(function (l) {
      return '<tr><td>' + esc(l.name || '—') + '</td><td>' + eur(l.price) + ' / ' + uLabel(l.bu) + '</td><td>' + pct(l.yld) + '</td><td>' + esc(String(l.qty).replace('.', LANG === 'el' ? ',' : '.')) + ' ' + uLabel(l.qu) + '</td><td class="r">' + eur(l.cost) + '</td></tr>';
    }).join('');
    function kv(k, v) { return '<tr><th>' + k + '</th><td class="r">' + v + '</td></tr>'; }
    $('dc-sheet').innerHTML =
      '<div class="ps-head"><div><p class="ps-brand">AR Akron <span>Services</span></p><p class="ps-kicker">' + T.sheet + '</p><h2>' + esc(name) + '</h2></div>' +
      '<p class="ps-date">' + T.date + ': ' + new Date().toLocaleDateString(T.locale) + '<br>' + T.portions + ': ' + c.portions + '</p></div>' +
      '<table class="ps-t"><thead><tr><th>' + T.ing + '</th><th>' + T.price + '</th><th>' + T.yld + '</th><th>' + T.qty + '</th><th class="r">' + T.cost + '</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<table class="ps-kv">' + kv(T.recipe, eur(c.recipe)) + (c.extras > 0 ? kv(T.extras, eur(c.extras)) : '') + kv('<b>' + T.cpp + '</b>', '<b>' + eur(c.cpp) + '</b>') +
      (c.gross > 0 ? kv(T.sell, eur(c.gross)) + kv(T.net, eur(c.net)) + kv(T.pct, pct(c.pct) + ' · ' + T[c.status]) + kv(T.profit, eur(c.profit)) : '') +
      kv(T.target, pct(c.target)) + kv('<b>' + T.sug + '</b>', '<b>' + eur(c.sugGross) + '</b>') + '</table>' +
      '<p class="ps-foot">' + T.footer + '<br>' + T.footer2 + '</p>';
    var old = document.title;
    document.title = T.sheet + ' – ' + name;
    window.print();
    setTimeout(function () { document.title = old; }, 500);
  });

  // Mobile summary bar: visible while the calculator is on screen but the results card is not.
  if ('IntersectionObserver' in window) {
    var mini = $('dc-mini'), inDc = false, resVis = false;
    function upd() { mini.classList.toggle('off', !(inDc && !resVis)); }
    new IntersectionObserver(function (e) { inDc = e[0].isIntersecting; upd(); }).observe(root);
    new IntersectionObserver(function (e) { resVis = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe($('dc-res'));
  }

  loadExample();
})();
