// AR Akron Services — emails the full health inspection risk report.
// Runs on the Netlify project "arakron". Needs the env var BREVO_API_KEY (optional: BREVO_LIST_ID).
// The report is built here from the answer codes, never from text sent by the browser.
const D = require('../../assets/inspection-data.js');

const ORIGINS = ['https://www.arakronservices.gr', 'https://arakronservices.gr'];
const OWNER = 'info@arakronservices.gr';
const SENDER = { name: 'Aris Alampourinos · AR Akron Services', email: 'info@arakronservices.gr' };
const PAGE = 'https://www.arakronservices.gr/blog/health-inspection-checklist-greece';
const BOOK = 'https://rantevou.arakronservices.gr/arakron?lang=en&service=intro';
const WA = 'https://wa.me/306983661460';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function cleanVenue(v) {
  let s = String(v || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, 60);
  if (/(https?:|www\.|\.[a-z]{2,6}(\/|\b))/i.test(s)) s = ''; // no links in the venue name
  return s.replace(/\s+/g, ' ');
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

function factorRows(r) {
  return r.factors.map((f, i) => `<tr><td style="padding:12px 0;border-bottom:1px solid #e6e1d6;vertical-align:top;width:26px;color:#999;font-size:13px">${i + 1}</td>
<td style="padding:12px 0;border-bottom:1px solid #e6e1d6;vertical-align:top">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${f.o.r >= 4 ? '#b4442f' : '#9a7417'};font-weight:600">${f.o.r >= 4 ? 'Major factor' : 'Risk factor'}</div>
<div style="font-size:15px;color:#1a1a1a;margin-top:3px;line-height:1.5">${esc(f.o.f)}</div></td></tr>`).join('');
}

function stakeRows() {
  return D.STAKES.map((s) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e6e1d6;font-size:14px;color:#555">${esc(s.t)}<br><a href="${s.s.u}" style="font-size:12px;color:#999">${esc(s.s.t)}</a></td>
<td style="padding:10px 0;border-bottom:1px solid #e6e1d6;font-family:Georgia,serif;font-size:16px;color:#b4442f;text-align:right;white-space:nowrap;vertical-align:top">${esc(s.v)}</td></tr>`).join('');
}

function visitorEmail(r, L, venue) {
  const n = r.factors.length;
  const col = r.level === 'high' ? '#b4442f' : r.level === 'medium' ? '#9a7417' : '#2f7a45';
  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f1ea;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e6e1d6">
<tr><td style="background:#0b0b0c;padding:22px 28px"><span style="font-family:Georgia,serif;font-size:20px;color:#efebe3">AR Akron</span> <span style="font-size:10px;letter-spacing:.3em;color:#c9a24a">SERVICES</span></td></tr>
<tr><td style="padding:28px 28px 8px">
<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#9a7417;font-weight:600">Health inspection risk report</div>
<div style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin-top:6px">${venue ? esc(venue) : 'Your venue'}</div>
<div style="font-family:Georgia,serif;font-size:36px;color:${col};margin-top:16px">${esc(L.t)}</div>
<p style="font-size:15px;color:#555;line-height:1.55;margin:8px 0 0">${esc(L.d)}</p>
</td></tr>
<tr><td style="padding:14px 28px 0"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#888;font-weight:600">${n} risk factor${n === 1 ? '' : 's'}</div>
${n ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${factorRows(r)}</table>` : '<p style="font-size:15px;color:#555">No risk factors in your answers.</p>'}</td></tr>
<tr><td style="padding:22px 28px 0"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#888;font-weight:600">What a failed inspection could cost</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stakeRows()}</table></td></tr>
<tr><td style="padding:26px 28px 8px">
<div style="font-family:Georgia,serif;font-size:20px;color:#1a1a1a">Want someone to take this off your hands?</div>
<p style="font-size:15px;color:#555;line-height:1.55;margin:6px 0 16px">I take on compliance and opening supervision for restaurants, cafés and bars in Greece, in English, and coordinate your accountant, engineer and pest control company. In a free 30-minute call we go through your venue and what needs to happen first.</p>
<a href="${BOOK}" style="display:inline-block;background:#c9a24a;color:#111;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 22px;border-radius:6px">Book a free 30-minute call</a>
<a href="${WA}" style="display:inline-block;color:#6b5418;font-size:15px;padding:13px 10px">or message me on WhatsApp</a>
</td></tr>
<tr><td style="padding:18px 28px 26px">
<p style="font-size:15px;color:#1a1a1a;margin:0">Aris Alampourinos<br><span style="color:#888">AR Akron Services · +30 698 366 1460</span></p>
<p style="font-size:12px;color:#999;line-height:1.5;margin:18px 0 0">Indicative assessment based on your own answers, not legal advice. Fine ranges as of November 2026. You received this because you asked for your report at <a href="${PAGE}" style="color:#999">arakronservices.gr</a>. Reply to this email if you want us to delete your details.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function ownerEmail(r, L, venue, email, followup, A) {
  const qa = D.Q.map((q) => {
    const o = q.o.find((x) => x.k === A[q.id]);
    return `<tr><td style="padding:6px 10px 6px 0;border-bottom:1px solid #eee;color:#666;vertical-align:top">${esc(q.q)}</td><td style="padding:6px 0;border-bottom:1px solid #eee;vertical-align:top"><b>${o ? esc(o.t) : '-'}</b>${o && o.f ? ' ⚠' : ''}</td></tr>`;
  }).join('');
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a">
<p><b>New lead from the health inspection risk check</b></p>
<p>Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>Venue: ${venue ? esc(venue) : '(not given)'}<br>
Result: <b>${esc(L.t)}</b> (${r.risk}/100) · ${r.factors.length} risk factors<br>
Agreed to one follow-up email: ${followup ? 'yes' : 'no'}<br>Time: ${new Date().toISOString()}</p>
<table cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;font-size:13px">${qa}</table></div>`;
}

async function brevo(path, body) {
  const res = await fetch('https://api.brevo.com/v3' + path, {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 204) throw new Error('Brevo ' + path + ' ' + res.status + ' ' + (await res.text()).slice(0, 200));
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

  const email = String(data.email || '').trim().toLowerCase();
  if (!/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,24}$/i.test(email)) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"email"}' };
  if (data.consent !== true) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"consent"}' };

  const A = {};
  D.Q.forEach((q) => {
    const k = data.answers && data.answers[q.id];
    if (q.o.some((o) => o.k === k)) A[q.id] = k;
  });
  const r = D.compute(A);
  if (!r.done) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"incomplete"}' };
  const L = D.LEVELS[r.level];
  const venue = cleanVenue(data.venue);
  const followup = data.followup === true;

  try {
    await brevo('/smtp/email', {
      sender: SENDER, to: [{ email }], replyTo: { email: OWNER, name: 'Aris Alampourinos' },
      subject: `Your health inspection risk report: ${L.t}`,
      htmlContent: visitorEmail(r, L, venue), tags: ['health-check'],
    });
    await brevo('/smtp/email', {
      sender: SENDER, to: [{ email: OWNER }], replyTo: { email },
      subject: `Risk check lead: ${L.t}${venue ? ' · ' + venue : ''}`,
      htmlContent: ownerEmail(r, L, venue, email, followup, A), tags: ['health-check-lead'],
    });
  } catch (e) {
    console.error(e.message);
    return { statusCode: 502, headers: h, body: '{"ok":false,"error":"send"}' };
  }

  if (followup && process.env.BREVO_LIST_ID) {
    try {
      await brevo('/contacts', {
        email, updateEnabled: true, listIds: [Number(process.env.BREVO_LIST_ID)]
      });
    } catch (e) { console.error(e.message); } // the report was sent; a list error must not fail the request
  }
  return { statusCode: 200, headers: h, body: JSON.stringify({ ok: true }) };
};
