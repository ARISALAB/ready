/* AR Akron Services — health inspection readiness check: shared data (browser + Netlify function) */
(function (root) {
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


  function compute(A) {
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
    return { answered: answered, score: score, gaps: gaps, high: high, done: answered === Q.length };
  }

  function band(r) {
    if (r.score >= 85 && r.high === 0) return { k: 'ok', t: 'Close to ready', d: 'An inspector would find little. Keep the records going every day, not just before a visit.' };
    if (r.score >= 60 && r.high <= 1) return { k: 'mid', t: 'Gaps an inspector would find', d: 'You have the basics, but the gaps below are the kind that lead to fines on the day.' };
    return { k: 'low', t: 'High risk', d: 'As things stand, an inspection would likely end in fines, and some gaps can close the venue.' };
  }

  var D = { SRC: SRC, SECTIONS: SECTIONS, Q: Q, LEVEL: { 3: 'High', 2: 'Medium', 1: 'Low' }, compute: compute, band: band };
  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.IC_DATA = D;
})(this);
