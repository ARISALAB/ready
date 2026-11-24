// AR Akron Services — emails the full website check report (SEO, AI visibility, customers).
// Runs on the Netlify project "arakron", like health-report.js. Needs BREVO_API_KEY (optional: BREVO_LIST_ID).
// The browser sends only check ids and statuses. Every text in the email comes from assets/sitecheck-data.js.
const D = require('../../assets/sitecheck-data.js');

const ORIGINS = ['https://www.arakronservices.gr', 'https://arakronservices.gr'];
const OWNER = 'info@arakronservices.gr';
const SENDER = { name: 'Άρης Αλαμπουρινός · AR Akron Services', email: 'info@arakronservices.gr' };
const SENDER_EN = { name: 'Aris Alampourinos · AR Akron Services', email: 'info@arakronservices.gr' };
const WA = 'https://wa.me/306983661460';

const C = {
  el: {
    page: 'https://www.arakronservices.gr/blog/elegxos-istoselidas',
    book: 'https://rantevou.arakronservices.gr/arakron?lang=el&service=intro',
    kicker: 'Έλεγχος ιστοσελίδας: Google, AI, πελάτες', yourSite: 'Το site σας',
    gaps: (n) => (n === 1 ? '1 κενό, με σειρά προτεραιότητας' : n + ' κενά, με σειρά προτεραιότητας'),
    noGaps: 'Δεν βρέθηκε κενό σε κανέναν από τους ελέγχους.',
    st: { warn: 'Μισό', fail: 'Λείπει' },
    okH: 'Τι κάνει ήδη σωστά', groupsH: 'Ο βαθμός ανά ενότητα',
    ctaH: 'Θέλετε να το φτιάξουμε μαζί;',
    ctaP: 'Φτιάχνουμε ιστοσελίδες που βρίσκονται στη Google, διαβάζονται από τα AI και φέρνουν πελάτες, και διορθώνουμε υπάρχουσες. Στην πρώτη κουβέντα, 30 λεπτά και δωρεάν, βλέπουμε μαζί το site σας και από πού να ξεκινήσετε.',
    ctaB: 'Κλείστε δωρεάν ραντεβού 30 λεπτών', ctaW: 'ή στείλτε μου μήνυμα στο WhatsApp',
    sign: 'Άρης Αλαμπουρινός',
    foot: (p) => `Ενδεικτικός έλεγχος της αρχικής σελίδας, έως 5 εσωτερικών σελίδων, του robots.txt και του llms.txt, Νοέμβριος 2026. Δεν μετρά θέση στη Google ούτε επισκεψιμότητα. Λάβατε αυτό το email επειδή ζητήσατε την αναφορά σας στο <a href="${p}" style="color:#999">arakronservices.gr</a>. Απαντήστε σε αυτό το email αν θέλετε να διαγράψουμε τα στοιχεία σας.`,
    subject: (s, b) => `Η αναφορά του site σας: ${s}/100 · ${b}`,
  },
  en: {
    page: 'https://www.arakronservices.gr/blog/website-check',
    book: 'https://rantevou.arakronservices.gr/arakron?lang=en&service=intro',
    kicker: 'Website check: Google, AI, customers', yourSite: 'Your website',
    gaps: (n) => (n === 1 ? '1 gap, in order of priority' : n + ' gaps, in order of priority'),
    noGaps: 'No gaps were found in any of the checks.',
    st: { warn: 'Partly', fail: 'Missing' },
    okH: 'What it already does well', groupsH: 'Score by area',
    ctaH: 'Want us to fix it with you?',
    ctaP: 'We build websites that show up on Google, are read by AI assistants and bring in customers, and we fix existing ones. In a free 30-minute call we look at your site together and where to start.',
    ctaB: 'Book a free 30-minute call', ctaW: 'or message me on WhatsApp',
    sign: 'Aris Alampourinos',
    foot: (p) => `Indicative check of the home page, up to 5 inner pages, robots.txt and llms.txt, November 2026. It does not measure Google ranking or traffic. You received this because you asked for your report at <a href="${p}" style="color:#999">arakronservices.gr</a>. Reply to this email if you want us to delete your details.`,
    subject: (s, b) => `Your website report: ${s}/100 · ${b}`,
  },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Shown as text, split so mail apps do not turn it into a link.
// Uppercase labels: drop Greek accents (mail apps keep them with text-transform).
const up = (x) => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
const hostText = (h) => esc(h).replace(/\./g, '<span>.</span>');

function cleanVenue(v) {
  let s = String(v || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, 60);
  if (/(https?:|www\.|\.[a-z]{2,6}(\/|\b))/i.test(s)) s = '';
  return s.replace(/\s+/g, ' ');
}
function cleanHost(u) {
  try {
    const x = new URL(/^https?:\/\//i.test(String(u)) ? String(u) : 'https://' + u);
    const h = x.hostname.toLowerCase().replace(/^www\./, '');
    return /^[a-z0-9.-]{3,120}$/.test(h) && h.includes('.') ? h : '';
  } catch (e) { return ''; }
}

function headers(origin) {
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    Vary: 'Origin',
  };
}

const COL = { good: '#2f7a45', ok: '#9a7417', mid: '#9a7417', low: '#b4442f' };

function visitorEmail(r, L, host, venue) {
  const c = C[L], B = D.BANDS[r.band][L];
  const gaps = r.problems.map((p, i) => {
    const it = D.ITEMS[p.id][L];
    const col = p.status === 'fail' ? '#b4442f' : '#9a7417';
    return `<tr><td style="padding:14px 0;border-bottom:1px solid #e6e1d6;vertical-align:top;width:26px;color:#999;font-size:13px">${i + 1}</td>
<td style="padding:14px 0;border-bottom:1px solid #e6e1d6;vertical-align:top">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${col};font-weight:600">${up(c.st[p.status])}</div>
<div style="font-size:16px;color:#1a1a1a;margin-top:3px">${esc(it.n)}</div>
<div style="font-size:14px;color:#555;margin-top:4px;line-height:1.55">${esc(it.r)}</div></td></tr>`;
  }).join('');
  const groups = r.groups.map((g) => {
    const G = D.GROUPS.find((x) => x.id === g.id);
    return `<tr><td style="padding:8px 0;border-bottom:1px solid #e6e1d6;font-size:14px;color:#555">${esc(G[L])}</td>
<td style="padding:8px 0;border-bottom:1px solid #e6e1d6;font-family:Georgia,serif;font-size:17px;color:#1a1a1a;text-align:right">${g.score}</td></tr>`;
  }).join('');
  const heads = D.HEADS.filter((x) => r.heads[x.id] !== null).map((x) => `<td style="padding:12px 0 0;vertical-align:top"><div style="font-size:11px;letter-spacing:.14em;color:#888;font-weight:600">${up(x[L])}</div><div style="font-family:Georgia,serif;font-size:26px;color:${r.heads[x.id] < 40 ? '#b4442f' : '#1a1a1a'}">${r.heads[x.id]}</div></td>`).join('');
  const ok = Object.keys(r.map).filter((id) => r.map[id] === 'pass').map((id) => esc(D.ITEMS[id][L].n)).join(' · ');
  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f1ea;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e6e1d6">
<tr><td style="background:#0b0b0c;padding:22px 28px"><span style="font-family:Georgia,serif;font-size:20px;color:#efebe3">AR Akron</span> <span style="font-size:10px;letter-spacing:.3em;color:#c9a24a">SERVICES</span></td></tr>
<tr><td style="padding:28px 28px 8px">
<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#9a7417;font-weight:600">${up(c.kicker)}</div>
<div style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin-top:6px">${venue ? esc(venue) : c.yourSite}</div>
<div style="font-size:14px;color:#888;margin-top:2px">${hostText(host)}</div>
<div style="margin-top:18px"><span style="font-family:Georgia,serif;font-size:48px;color:${COL[r.band]}">${r.score}</span><span style="font-size:16px;color:#999">/100</span></div>
<div style="font-family:Georgia,serif;font-size:21px;color:#1a1a1a;margin-top:4px">${esc(B.t)}</div>
<p style="font-size:15px;color:#555;line-height:1.55;margin:6px 0 0">${esc(B.d)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid #e6e1d6"><tr>${heads}</tr></table>
</td></tr>
<tr><td style="padding:18px 28px 0"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#888;font-weight:600">${r.problems.length ? up(c.gaps(r.problems.length)) : ''}</div>
${r.problems.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${gaps}</table>` : `<p style="font-size:15px;color:#555">${c.noGaps}</p>`}</td></tr>
<tr><td style="padding:22px 28px 0"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#888;font-weight:600">${up(c.groupsH)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${groups}</table></td></tr>
${ok ? `<tr><td style="padding:22px 28px 0"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#888;font-weight:600">${up(c.okH)}</div>
<p style="font-size:14px;color:#555;line-height:1.7;margin:8px 0 0">${ok}</p></td></tr>` : ''}
<tr><td style="padding:26px 28px 8px">
<div style="font-family:Georgia,serif;font-size:20px;color:#1a1a1a">${c.ctaH}</div>
<p style="font-size:15px;color:#555;line-height:1.55;margin:6px 0 16px">${c.ctaP}</p>
<a href="${c.book}" style="display:inline-block;background:#c9a24a;color:#111;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 22px;border-radius:6px">${c.ctaB}</a>
<a href="${WA}" style="display:inline-block;color:#6b5418;font-size:15px;padding:13px 10px">${c.ctaW}</a>
</td></tr>
<tr><td style="padding:18px 28px 26px">
<p style="font-size:15px;color:#1a1a1a;margin:0">${c.sign}<br><span style="color:#888">AR Akron Services · +30 698 366 1460</span></p>
<p style="font-size:12px;color:#999;line-height:1.5;margin:18px 0 0">${c.foot(c.page)}</p>
</td></tr></table></td></tr></table></body></html>`;
}

function ownerEmail(r, L, host, venue, email, followup) {
  const rows = Object.keys(r.map).map((id) => `<tr><td style="padding:5px 10px 5px 0;border-bottom:1px solid #eee;color:#666">${esc(D.ITEMS[id].el.n)}</td><td style="padding:5px 0;border-bottom:1px solid #eee"><b>${r.map[id]}</b></td></tr>`).join('');
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a">
<p><b>Νέο lead από τον έλεγχο ιστοσελίδας</b> (${L === 'en' ? 'αγγλική' : 'ελληνική'} σελίδα)</p>
<p>Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>Επιχείρηση: ${venue ? esc(venue) : '(δεν δόθηκε)'}<br>Site: ${esc(host)}<br>
Βαθμός: <b>${r.score}/100</b> (Google ${r.heads.seo}, AI ${r.heads.ai}, Πελάτες ${r.heads.leads}) · ${esc(D.BANDS[r.band].el.t)} · ${r.problems.length} κενά<br>
Δέχεται ένα ακόμα email: ${followup ? 'ναι' : 'όχι'}<br>Ώρα: ${new Date().toISOString()}</p>
<table cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;font-size:13px">${rows}</table></div>`;
}

async function brevo(path, body) {
  const res = await fetch('https://api.brevo.com/v3' + path, {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 204) throw new Error('Brevo ' + path + ' ' + res.status + ' ' + (await res.text()).slice(0, 200));
}

// simple in-memory limit per IP (first line of defence; resets when the function goes cold)
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 60 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 6;
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const h = headers(origin);
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: h, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: h, body: '{"ok":false}' };
  if (!ORIGINS.includes(origin)) return { statusCode: 403, headers: h, body: '{"ok":false,"error":"origin"}' };
  if (!process.env.BREVO_API_KEY) return { statusCode: 500, headers: h, body: '{"ok":false,"error":"config"}' };

  let data;
  try { data = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, headers: h, body: '{"ok":false}' }; }
  if (data.website) return { statusCode: 200, headers: h, body: '{"ok":true}' }; // honeypot

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  if (limited(ip)) return { statusCode: 429, headers: h, body: '{"ok":false,"error":"limit"}' };

  const L = data.lang === 'en' ? 'en' : 'el';
  const email = String(data.email || '').trim().toLowerCase();
  if (!/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,24}$/i.test(email)) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"email"}' };
  if (data.consent !== true) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"consent"}' };
  const host = cleanHost(data.url);
  if (!host) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"url"}' };

  const list = Array.isArray(data.items) ? data.items.slice(0, 40).filter((x) => Array.isArray(x) && D.ITEMS[x[0]] && ['pass', 'warn', 'fail'].includes(x[1])) : [];
  const r = D.compute(list);
  if (r.n < 6) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"items"}' };
  const venue = cleanVenue(data.venue);
  const followup = data.followup === true;
  const B = D.BANDS[r.band];

  try {
    await brevo('/smtp/email', {
      sender: L === 'en' ? SENDER_EN : SENDER, to: [{ email }], replyTo: { email: OWNER, name: L === 'en' ? 'Aris Alampourinos' : 'Άρης Αλαμπουρινός' },
      subject: C[L].subject(r.score, B[L].t),
      htmlContent: visitorEmail(r, L, host, venue), tags: ['site-check'],
    });
    await brevo('/smtp/email', {
      sender: SENDER, to: [{ email: OWNER }], replyTo: { email },
      subject: `Lead έλεγχος site: ${host} · ${r.score}/100${venue ? ' · ' + venue : ''}`,
      htmlContent: ownerEmail(r, L, host, venue, email, followup), tags: ['site-check-lead'],
    });
  } catch (e) {
    console.error(e.message);
    return { statusCode: 502, headers: h, body: '{"ok":false,"error":"send"}' };
  }

  if (followup && process.env.BREVO_LIST_ID) {
    try {
      await brevo('/contacts', { email, updateEnabled: true, listIds: [Number(process.env.BREVO_LIST_ID)] });
    } catch (e) { console.error(e.message); }
  }
  return { statusCode: 200, headers: h, body: JSON.stringify({ ok: true }) };
};
