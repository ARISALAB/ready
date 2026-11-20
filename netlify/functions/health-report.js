// AR Akron Services — emails the full health inspection readiness report.
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

function gapRows(r, forOwner) {
  return r.gaps.map((g, i) => {
    const q = g.q, src = q.fine.src ? D.SRC[q.fine.src] : null;
    const lvl = D.LEVEL[q.w];
    const color = q.w === 3 ? '#b4442f' : q.w === 2 ? '#9a7417' : '#666';
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #e6e1d6;vertical-align:top;width:26px;color:#999;font-size:13px">${i + 1}</td>
<td style="padding:12px 0;border-bottom:1px solid #e6e1d6;vertical-align:top">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${color};font-weight:600">${lvl} risk${g.unsure ? ' · not sure' : ''}</div>
<div style="font-size:15px;color:#1a1a1a;margin:3px 0 4px;line-height:1.45">${esc(q.gap)}</div>
<div style="font-size:14px;color:#6b5418;line-height:1.45"><span style="color:#888">Penalty:</span> ${esc(q.fine.txt)}</div>
${src ? `<div style="font-size:12px;margin-top:2px"><a href="${src.u}" style="color:#888">${esc(src.t)}</a></div>` : ''}
${forOwner ? `<div style="font-size:12px;color:#888;margin-top:2px">Question: ${esc(q.q)}</div>` : ''}
</td></tr>`;
  }).join('');
}

function visitorEmail(r, b, venue) {
  const n = r.gaps.length;
  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f1ea;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e6e1d6">
<tr><td style="background:#0b0b0c;padding:22px 28px"><span style="font-family:Georgia,serif;font-size:20px;color:#efebe3">AR Akron</span> <span style="font-size:10px;letter-spacing:.3em;color:#c9a24a">SERVICES</span></td></tr>
<tr><td style="padding:28px 28px 8px">
<div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#9a7417;font-weight:600">Health inspection readiness report</div>
<div style="font-family:Georgia,serif;font-size:26px;color:#1a1a1a;margin-top:6px">${venue ? esc(venue) : 'Your venue'}</div>
<div style="margin-top:18px"><span style="font-family:Georgia,serif;font-size:48px;color:#1a1a1a">${r.score}</span><span style="color:#888;font-size:18px"> / 100</span></div>
<div style="font-family:Georgia,serif;font-size:20px;color:${b.k === 'low' ? '#b4442f' : '#1a1a1a'};margin-top:4px">${esc(b.t)}</div>
<p style="font-size:15px;color:#555;line-height:1.55;margin:8px 0 0">${esc(b.d)}</p>
<p style="font-size:15px;color:#1a1a1a;margin:18px 0 0"><b>${n}</b> gap${n === 1 ? '' : 's'} found, <b>${r.high}</b> high risk.</p>
</td></tr>
<tr><td style="padding:8px 28px 0">${n ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${gapRows(r, false)}</table>` : '<p style="font-size:15px;color:#555">No gaps found in your answers.</p>'}</td></tr>
<tr><td style="padding:26px 28px 8px">
<div style="font-family:Georgia,serif;font-size:20px;color:#1a1a1a">Want these closed before an inspector finds them?</div>
<p style="font-size:15px;color:#555;line-height:1.55;margin:6px 0 16px">I take on compliance and opening supervision for restaurants, cafés and bars in Greece, in English, and coordinate your accountant, engineer and pest control company. The first 30-minute call is free.</p>
<a href="${BOOK}" style="display:inline-block;background:#c9a24a;color:#111;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 22px;border-radius:6px">Book a free 30-minute call</a>
<a href="${WA}" style="display:inline-block;color:#6b5418;font-size:15px;padding:13px 10px">or message me on WhatsApp</a>
</td></tr>
<tr><td style="padding:18px 28px 26px">
<p style="font-size:15px;color:#1a1a1a;margin:0">Aris Alampourinos<br><span style="color:#888">AR Akron Services · +30 698 366 1460</span></p>
<p style="font-size:12px;color:#999;line-height:1.5;margin:18px 0 0">Indicative information based on your own answers, not legal advice. The exact fine is set by the inspecting authority. Fine ranges as of November 2026. You received this because you asked for your report at <a href="${PAGE}" style="color:#999">arakronservices.gr</a>. Reply to this email if you want us to delete your details.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function ownerEmail(r, b, venue, email, followup) {
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a">
<p><b>New lead from the health inspection check</b></p>
<p>Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>Venue: ${venue ? esc(venue) : '(not given)'}<br>
Score: <b>${r.score}/100</b> · ${esc(b.t)} · ${r.gaps.length} gaps, ${r.high} high risk<br>
Agreed to one follow-up email: ${followup ? 'yes' : 'no'}<br>Time: ${new Date().toISOString()}</p>
<table cellpadding="0" cellspacing="0" width="100%" style="max-width:640px">${gapRows(r, true)}</table></div>`;
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
  const allowed = { y: 1, n: 1, u: 1, x: 1 };
  D.Q.forEach((q) => {
    const a = data.answers && data.answers[q.id];
    if (allowed[a] && (a !== 'x' || q.na)) A[q.id] = a;
  });
  const r = D.compute(A);
  if (r.answered < D.Q.length) return { statusCode: 400, headers: h, body: '{"ok":false,"error":"incomplete"}' };
  const b = D.band(r);
  const venue = cleanVenue(data.venue);
  const followup = data.followup === true;

  try {
    await brevo('/smtp/email', {
      sender: SENDER, to: [{ email }], replyTo: { email: OWNER, name: 'Aris Alampourinos' },
      subject: `Your health inspection readiness report: ${r.score}/100`,
      htmlContent: visitorEmail(r, b, venue), tags: ['health-check'],
    });
    await brevo('/smtp/email', {
      sender: SENDER, to: [{ email: OWNER }], replyTo: { email },
      subject: `Health check lead: ${r.score}/100${venue ? ' · ' + venue : ''}`,
      htmlContent: ownerEmail(r, b, venue, email, followup), tags: ['health-check-lead'],
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
