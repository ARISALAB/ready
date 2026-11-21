/* AR Akron Services — health inspection risk check: shared data (browser + Netlify function).
   The questions are about the venue's situation, not about specific legal obligations. */
(function (root) {
  // r = risk points for that answer. f = risk factor shown in the result (only for risky answers).
  var Q = [
    { id: 'stage', q: 'Where is your venue right now?', o: [
      { k: 'o1', t: 'Opening in less than a month', r: 4, f: 'You open in less than a month. Inspections can come in the first weeks, and putting documents in place takes longer than most owners expect.' },
      { k: 'o3', t: 'Opening in 1–3 months', r: 3, f: 'You open within three months. That is enough time only if the paperwork starts now.' },
      { k: 'o6', t: 'Opening in more than 3 months', r: 1 },
      { k: 'n1', t: 'Open for less than a year', r: 3, f: 'You opened less than a year ago. New venues are often inspected in their first year, and early gaps are still there.' },
      { k: 'nx', t: 'Open for more than a year', r: 1 }
    ]},
    { id: 'type', q: 'What kind of venue is it?', o: [
      { k: 'cafe', t: 'Café, bar or all-day', r: 2 },
      { k: 'rest', t: 'Restaurant or taverna', r: 2 },
      { k: 'take', t: 'Takeaway, delivery or bakery', r: 1 },
      { k: 'multi', t: 'Hotel kitchen, or more than one venue', r: 4, f: 'A hotel kitchen or several venues carry stricter requirements and more for an inspector to check.' }
    ]},
    { id: 'staff', q: 'How many people work there, including part-time and seasonal staff?', o: [
      { k: 's1', t: '1–3', r: 1 },
      { k: 's2', t: '4–10', r: 2 },
      { k: 's3', t: '11–25', r: 3, f: 'With more than ten people, a single staff paperwork mistake is repeated for every person, and staff fines are counted per employee.' },
      { k: 's4', t: 'More than 25', r: 4, f: 'With more than 25 people, staff paperwork is your largest exposure: staff fines are counted per employee.' }
    ]},
    { id: 'greek', q: 'Can you read official documents in Greek?', o: [
      { k: 'yes', t: 'Yes, comfortably', r: 0 },
      { k: 'some', t: 'Partly, with help', r: 2, f: 'You read Greek only partly. Official documents and inspection reports are in Greek, so a gap can go unnoticed until an inspector points it out.' },
      { k: 'no', t: 'No', r: 4, f: 'You do not read Greek. Notices, documents and inspection reports are in Greek, so you may not know what is missing until an inspector tells you.' }
    ]},
    { id: 'people', q: 'Who handles your staff declarations and paperwork?', o: [
      { k: 'acc', t: 'An accountant who works with food businesses', r: 0 },
      { k: 'acc2', t: 'An accountant, but not one who knows food businesses', r: 1 },
      { k: 'me', t: 'I do it myself', r: 2, f: 'You handle staff paperwork yourself. It is the area where one mistake costs the most.' },
      { k: 'none', t: 'Nobody yet, or I’m not sure', r: 4, f: 'Nobody has clearly taken on staff paperwork. In Greek inspections this is the single most expensive area to get wrong.' }
    ]},
    { id: 'hyg', q: 'Who looks after your food safety file?', o: [
      { k: 'pro', t: 'A food technologist or consultant who keeps it up to date', r: 0 },
      { k: 'tpl', t: 'We use a template we bought or downloaded', r: 3, f: 'Your food safety file comes from a generic template. Inspectors look for procedures that match your own venue, menu and equipment.' },
      { k: 'none', t: 'Nobody yet', r: 4, f: 'Nobody looks after your food safety file. It is one of the first things a hygiene inspector asks for.' },
      { k: 'unk', t: 'I’m not sure what that is', r: 4, f: 'You are not sure what a food safety file is. Every food business in Greece is expected to have one, and to keep it going.' }
    ]},
    { id: 'last', q: 'When was the venue last inspected?', o: [
      { k: 'never', t: 'Never, or not open yet', r: 2 },
      { k: 'ok', t: 'In the last year, with no remarks', r: 0 },
      { k: 'remark', t: 'In the last year, with remarks or a fine', r: 4, f: 'Your last inspection ended with remarks or a fine. A follow-up visit is likely, and repeated findings are fined more heavily.' },
      { k: 'old', t: 'More than a year ago', r: 2 }
    ]},
    { id: 'changes', q: 'Since the paperwork for the premises was filed, has anything changed: layout, kitchen, type of menu or opening hours?', o: [
      { k: 'no', t: 'No', r: 0 },
      { k: 'small', t: 'Small changes', r: 2 },
      { k: 'big', t: 'Yes, significant changes', r: 3, f: 'Significant changes since the paperwork was filed often leave documents that no longer match the venue an inspector sees.' },
      { k: 'unk', t: 'I don’t know what was filed', r: 3, f: 'You do not know what was filed for the premises, so you cannot be sure it matches the venue today.' }
    ]},
    { id: 'conf', q: 'If an inspector walked in tomorrow, how sure are you that you could show every document they ask for?', o: [
      { k: 'c4', t: 'Completely sure', r: 0 },
      { k: 'c3', t: 'Fairly sure', r: 1 },
      { k: 'c2', t: 'Not very sure', r: 3, f: 'You are not sure you could show every document today. On the day of an inspection, a document you cannot show counts as missing.' },
      { k: 'c1', t: 'Not sure at all', r: 4, f: 'You are not at all sure you could show the documents an inspector would ask for. On the day, a document you cannot show counts as missing.' }
    ]},
    { id: 'time', q: 'How much time can you give to paperwork and records each week?', o: [
      { k: 't3', t: 'As much as it needs', r: 0 },
      { k: 't2', t: 'A few hours', r: 1 },
      { k: 't1', t: 'Almost none', r: 3, f: 'You have almost no time for paperwork. Records that fall behind are easy for an inspector to spot.' }
    ]}
  ];

  var STAKES = [
    { t: 'Each undeclared worker', v: '€10,500', s: { t: 'Labour Inspectorate fines', u: 'https://www.naftemporiki.gr/finance/economy/2074740/poy-tha-chtypisei-i-epitheorisi-ergasias/' } },
    { t: 'Receipts not issued', v: '48-hour closure', s: { t: 'AADE decision A.1115/2026', u: 'https://www.aade.gr/sites/default/files/2026-06/a1115_2026.pdf' } },
    { t: 'Food hygiene breaches', v: '€200 – €20,000', s: { t: 'Law 5243/2025, art. 104', u: 'https://www.taxheaven.gr/law/5243/2025/arthro/104' } },
    { t: 'Operating outside what was notified', v: '€100 – €20,000', s: { t: 'Law 4442/2016, art. 15', u: 'https://www.taxheaven.gr/law/4442/2016/arthro/15' } }
  ];

  var MAX = Q.reduce(function (s, q) { return s + Math.max.apply(null, q.o.map(function (o) { return o.r; })); }, 0);

  function compute(A) {
    var answered = 0, pts = 0, factors = [];
    Q.forEach(function (q) {
      var k = A[q.id]; if (!k) return;
      var o = q.o.filter(function (x) { return x.k === k; })[0]; if (!o) return;
      answered++; pts += o.r;
      if (o.f) factors.push({ q: q, o: o });
    });
    factors.sort(function (a, b) { return b.o.r - a.o.r; });
    var risk = Math.round(100 * pts / MAX);
    var heavy = factors.filter(function (f) { return f.o.r >= 4; }).length;
    var level = risk >= 55 || heavy >= 3 ? 'high' : risk >= 30 || heavy >= 1 ? 'medium' : 'low';
    return { answered: answered, done: answered === Q.length, risk: risk, level: level, factors: factors };
  }

  var LEVELS = {
    high: { t: 'High risk', d: 'Your situation is the kind where inspections end in fines. Not because you are doing something wrong, but because nothing is in place to catch it in time.' },
    medium: { t: 'Medium risk', d: 'Some things are covered, but there are weak points an inspection is likely to find.' },
    low: { t: 'Low risk', d: 'Your situation looks well covered. Keep it that way: most problems start when records fall behind.' }
  };

  var D = { Q: Q, STAKES: STAKES, LEVELS: LEVELS, compute: compute };
  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.IC_DATA = D;
})(this);
