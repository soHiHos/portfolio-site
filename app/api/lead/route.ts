import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { CONTACT_EMAIL, CV_PATH } from '../../content/contact';
import { estimatePdfBuffer } from './estimate-pdf-server';
import { SERVICE_LIST, TIMELINES } from '../../content/service-list';
import { ESTIMATOR_ON, QUESTIONS, estimate, inr, validAnswers, type Contact } from '../../components/estimator/estimate';

// Saves a price-estimator lead, or a contact-form brief (`kind: 'brief'`), to Supabase and emails it to Soham (Resend).
// No model calls here; those stay in /api/ask. The estimate is recomputed from the answers, never taken from the browser. If one of the two
// sinks is down the lead still counts as received, as long as the other one worked.

const SUPABASE_URL = process.env.SUPABASE_URL;
// The secret key (sb_secret_...); the older service_role JWT still works under its old name
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
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

async function saveToSupabase(table: 'leads' | 'briefs', row: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    // New secret keys are not JWTs, so they go in apikey only; a legacy service_role JWT also needs the Bearer header
    headers: {
      apikey: SUPABASE_KEY,
      ...(SUPABASE_KEY.startsWith('sb_') ? {} : { Authorization: `Bearer ${SUPABASE_KEY}` }),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) console.error(`lead: supabase insert into ${table} failed`, res.status, await res.text());
  return res.ok;
}

type Attachment = { filename: string; content: Buffer };

async function sendEmail(to: string, subject: string, body: string, replyTo: string, attachments: Attachment[] = []) {
  if (!RESEND_API_KEY) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [to],
      reply_to: replyTo,
      subject,
      text: body,
      ...(attachments.length ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })) } : {}),
    }),
  });
  if (!res.ok) console.error(`lead: resend email to ${to === NOTIFY_TO ? 'owner' : 'visitor'} failed`, res.status, await res.text());
  return res.ok;
}

const emailSoham = (subject: string, body: string, replyTo: string, attachments?: Attachment[]) => sendEmail(NOTIFY_TO, subject, body, replyTo, attachments);

// Reply to the visitor. Never decides whether the lead counts as received: that depends on Supabase / the owner email only.
const emailVisitor = (to: string, subject: string, body: string, attachments?: Attachment[]) =>
  sendEmail(to, subject, body, CONTACT_EMAIL, attachments).catch((err) => (console.error('lead: visitor email error', err), false));

const firstName = (name: string) => name.split(/\s+/)[0] || 'there';
const SIGN_OFF = `Soham Kar\n${CONTACT_EMAIL}`;

// A brief from the contact form: needs a message, a way to reply (email or WhatsApp) and consent. Not tied to the
// estimator, so it works while the estimator is hidden.
async function handleBrief(body: Record<string, unknown>) {
  const name = text(body.name, 80);
  const whatsapp = text(body.whatsapp, 20);
  const email = text(body.email, 120);
  const message = text(body.message, 2000);
  const timeline = text(body.timeline, 40);
  const services = Array.isArray(body.services) ? body.services.filter((s): s is string => typeof s === 'string') : [];

  const valid =
    message &&
    (whatsapp || email) &&
    (!whatsapp || /^\+?[\d\s-]{10,16}$/.test(whatsapp)) &&
    (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) &&
    (!timeline || TIMELINES.includes(timeline)) &&
    services.length <= SERVICE_LIST.length &&
    services.every((s) => SERVICE_LIST.some((x) => x.id === s)) &&
    body.consent === true;
  if (!valid) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const serviceNames = SERVICE_LIST.filter((x) => services.includes(x.id)).map((x) => x.title).join(', ') || 'Not sure yet';
  // Acknowledgement to the visitor (only if they gave an email; WhatsApp-only briefs get no auto-reply)
  const ack = email
    ? emailVisitor(
      email,
      'I got your project brief',
      [
        `Hi ${firstName(name)},`,
        '',
        "Thanks for your brief. I've received it and I'll reply personally to set up a scoping call.",
        '',
        'What you sent:',
        `Services: ${serviceNames}`,
        `Timeline: ${timeline || '-'}`,
        '',
        message,
        '',
        'If anything is missing, just reply to this email.',
        '',
        SIGN_OFF,
      ].join('\n')
    )
    : Promise.resolve(false);
  const [, saved, emailed] = await Promise.all([
    ack,
    saveToSupabase('briefs', { name, whatsapp, email, services, timeline, message, consent: true }).catch((err) => (console.error('brief: supabase error', err), false)),
    emailSoham(
      `New project brief${name ? ` from ${name}` : ''}`,
      [`Name: ${name || '-'}`, `WhatsApp: ${whatsapp || '-'}`, `Email: ${email || '-'}`, `Services: ${serviceNames}`, `Timeline: ${timeline || '-'}`, '', message].join('\n'),
      email || CONTACT_EMAIL
    ).catch((err) => (console.error('brief: resend error', err), false)),
  ]);

  if (!saved && !emailed) return NextResponse.json({ error: 'not_saved' }, { status: 502 });
  return NextResponse.json({ ok: true });
}

// A CV download: the visitor leaves a name and email (and consent) so Soham knows who took it. Stored with the briefs
// (message "CV download") and emailed; the PDF itself is downloaded by the browser.
async function handleCv(body: Record<string, unknown>) {
  const name = text(body.name, 80);
  const email = text(body.email, 120);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  // A copy of the CV for their inbox (the browser download still starts on its own)
  const cvCopy = readFile(path.join(process.cwd(), 'public', CV_PATH))
    .then((content) =>
      emailVisitor(
        email,
        'My CV',
        [`Hi ${firstName(name)},`, '', 'Thanks for your interest. My CV is attached.', '', 'If you have a project in mind, reply to this email or send a brief from my site.', '', SIGN_OFF].join('\n'),
        [{ filename: path.basename(CV_PATH), content }]
      )
    )
    .catch((err) => (console.error('cv: could not attach the CV', err), false));
  const [, saved, emailed] = await Promise.all([
    cvCopy,
    saveToSupabase('briefs', { name, whatsapp: '', email, services: [], timeline: '', message: 'CV download', consent: true }).catch((err) => (console.error('cv: supabase error', err), false)),
    emailSoham(`CV downloaded by ${name}`, [`Name: ${name}`, `Email: ${email}`].join('\n'), email).catch((err) => (console.error('cv: resend error', err), false)),
  ]);
  if (!saved && !emailed) return NextResponse.json({ error: 'not_saved' }, { status: 502 });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
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

  if (body.kind === 'brief') return handleBrief(body);
  if (body.kind === 'cv') return handleCv(body);

  if (!ESTIMATOR_ON) return NextResponse.json({ error: 'not_available' }, { status: 404 });

  const contact = body.contact && typeof body.contact === 'object' ? validContact(body.contact as Record<string, unknown>) : null;
  if (!validAnswers(body.answers) || !contact || body.consent !== true) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const answers = body.answers;
  const e = estimate(answers);

  const summary = [
    `Business: ${label('business', answers.business)}`,
    `Wants to fix: ${answers.outcomes.map((o) => label('outcomes', o)).join(' | ') || '(see the note below)'}`,
    ...(answers.other?.trim() ? [`In their own words: ${answers.other.trim()}`] : []),
    `Tracks today with: ${answers.tracking.map((t) => label('tracking', t)).join(', ')}`,
    `Users: ${label('users', answers.users)}`,
    `Also needs: ${answers.extras.map((x) => label('extras', x)).join(', ') || 'Neither'}`,
    `AI features: ${label('ai', answers.ai)}`,
    `Payment: ${label('payment', answers.payment)}`,
    `Start: ${label('start', answers.start)}`,
  ];
  const estimateLines = [
    `Setup from ${inr(e.setup)}${e.licence ? `, licence from ${inr(e.licence)} a month` : ''}${e.siteCare ? `, optional site care from ${inr(e.siteCare)} a month` : ''} (excl. GST)`,
    `Buyout: ${e.buyout ? `from ${inr(e.buyout)}${e.retainer ? `, optional retainer from ${inr(e.retainer)} a month` : ''}` : 'code handed over with setup'} (excl. GST)`,
    `Timeline: ${e.timeline}`,
  ];

  // The same PDF the browser downloads, emailed to the visitor and copied to Soham. If it can't be built, both
  // still get a plain-text email.
  const pdf = await estimatePdfBuffer(contact, e, answers.payment === 'buyout').catch((err) => (console.error('lead: estimate pdf failed', err), null));
  const attachments = pdf ? [{ filename: `Price estimate - ${contact.business.replace(/[\\/:*?"<>|]/g, '')}.pdf`, content: pdf }] : [];
  const visitorEmail = emailVisitor(
    contact.email,
    `Your price estimate, ${contact.business}`,
    [
      `Hi ${firstName(contact.name)},`,
      '',
      pdf ? 'Thanks for using the estimator. Your price estimate is attached as a PDF.' : 'Thanks for using the estimator. Here is a summary of your price estimate.',
      '',
      ...estimateLines,
      '',
      'This is an estimate, not a quote. Your proposal comes after a free call: reply to this email with a time that suits you.',
      '',
      SIGN_OFF,
    ].join('\n'),
    attachments
  );

  const [, saved, emailed] = await Promise.all([
    visitorEmail,
    saveToSupabase('leads', {
      name: contact.name,
      business_name: contact.business,
      phone: contact.phone,
      email: contact.email,
      answers,
      estimate: { setup: e.setup, licence: e.licence, siteCare: e.siteCare, retainer: e.retainer, buyout: e.buyout, timeline: e.timeline },
      start: answers.start,
    }).catch((err) => (console.error('lead: supabase error', err), false)),
    emailSoham(
      `New estimate lead: ${contact.business} (${label('start', answers.start)})`,
      [`${contact.name}, ${contact.business}`, `Phone/WhatsApp: ${contact.phone}`, `Email: ${contact.email}`, '', ...summary, '', 'Estimate sent:', ...estimateLines].join('\n'),
      contact.email,
      attachments
    ).catch((err) => (console.error('lead: resend error', err), false)),
  ]);

  if (!saved && !emailed) return NextResponse.json({ error: 'not_saved' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
