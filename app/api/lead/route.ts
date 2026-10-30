import { NextResponse } from 'next/server';
import { CONTACT_EMAIL } from '../../content/contact';
import { ESTIMATOR_ON, QUESTIONS, estimate, formatRange, inr, validAnswers, type Contact } from '../../components/estimator/estimate';

// Saves a price-estimator lead to Supabase and emails it to Soham (Resend). No model calls here; those stay
// in /api/ask. The estimate is recomputed from the answers, never taken from the browser. If one of the two
// sinks is down the lead still counts as received, as long as the other one worked.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || CONTACT_EMAIL;
const NOTIFY_FROM = process.env.LEAD_EMAIL_FROM || 'Portfolio leads <onboarding@resend.dev>';

// Best-effort per-IP rate limit (in-memory, per serverless instance), as in /api/ask
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function validContact(c: Record<string, unknown>): Contact | null {
  const contact = { name: text(c.name, 80), business: text(c.business, 120), phone: text(c.phone, 20), email: text(c.email, 120) };
  if (!contact.name || !contact.business) return null;
  if (!/^\+?[\d\s-]{10,16}$/.test(contact.phone)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return null;
  return contact;
}

// Readable label for an answer id
function label(key: keyof typeof QUESTIONS, id: string) {
  return (QUESTIONS[key].options as readonly { id: string; label: string }[]).find((o) => o.id === id)?.label ?? id;
}

async function saveToSupabase(row: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });
  if (!res.ok) console.error('lead: supabase insert failed', res.status, await res.text());
  return res.ok;
}

async function emailSoham(subject: string, body: string, replyTo: string) {
  if (!RESEND_API_KEY) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: NOTIFY_FROM, to: [NOTIFY_TO], reply_to: replyTo, subject, text: body }),
  });
  if (!res.ok) console.error('lead: resend email failed', res.status, await res.text());
  return res.ok;
}

export async function POST(req: Request) {
  if (!ESTIMATOR_ON) return NextResponse.json({ error: 'not_available' }, { status: 404 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // Honeypot: a hidden field people never fill in. Pretend it worked so bots don't retry.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const contact = body.contact && typeof body.contact === 'object' ? validContact(body.contact as Record<string, unknown>) : null;
  if (!validAnswers(body.answers) || !contact || body.consent !== true) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const answers = body.answers;
  const e = estimate(answers);

  const summary = [
    `Business: ${label('business', answers.business)}`,
    `Wants to fix: ${answers.outcomes.map((o) => label('outcomes', o)).join(' | ')}`,
    `Tracks today with: ${answers.tracking.map((t) => label('tracking', t)).join(', ')}`,
    `Users: ${label('users', answers.users)}`,
    `Also needs: ${answers.extras.map((x) => label('extras', x)).join(', ') || 'Neither'}`,
    `AI features: ${label('ai', answers.ai)}`,
    `Payment: ${label('payment', answers.payment)}`,
    `Start: ${label('start', answers.start)}`,
  ];
  const estimateLines = [
    `Build: ${formatRange(e.build)}${e.monthly[1] > 0 ? `, running fees ${formatRange(e.monthly)} a month` : ''}, care plan from ${inr(e.care)} a month`,
    ...(e.subscribe ? [`Subscribe: ${formatRange(e.subscribe.setup)} to start, then ${formatRange(e.subscribe.monthly)} a month`] : []),
    `Timeline: ${e.timeline}`,
  ];

  const [saved, emailed] = await Promise.all([
    saveToSupabase({
      name: contact.name,
      business_name: contact.business,
      phone: contact.phone,
      email: contact.email,
      answers,
      estimate: { build: e.build, monthly: e.monthly, care: e.care, subscribe: e.subscribe, timeline: e.timeline },
      start: answers.start,
    }).catch((err) => (console.error('lead: supabase error', err), false)),
    emailSoham(
      `New estimate lead: ${contact.business} (${label('start', answers.start)})`,
      [`${contact.name}, ${contact.business}`, `Phone/WhatsApp: ${contact.phone}`, `Email: ${contact.email}`, '', ...summary, '', 'Estimate sent:', ...estimateLines].join('\n'),
      contact.email
    ).catch((err) => (console.error('lead: resend error', err), false)),
  ]);

  if (!saved && !emailed) return NextResponse.json({ error: 'not_saved' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
