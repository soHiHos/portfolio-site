import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CV_PATH, SITE_URL } from '../../content/contact';
import { emailConfig, sendEmail as sendMail, type Attachment } from './email';
import { estimatePdfBuffer } from './estimate-pdf-server';
import { SERVICE_LIST, TIMELINES } from '../../content/service-list';
import { ESTIMATOR_ON, QUESTIONS, estimate, inr, validAnswers, type Contact } from '../../components/estimator/estimate';

// Saves a price-estimator lead, or a contact-form brief (`kind: 'brief'`), to Supabase and emails it to Soham (Resend).
// No model calls here; those stay in /api/ask. The estimate is recomputed from the answers, never taken from the browser. If one of the two
// sinks is down the lead still counts as received, as long as the other one worked.

const SUPABASE_URL = process.env.SUPABASE_URL;
// The secret key (sb_secret_...); the older service_role JWT still works under its old name
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || CONTACT_EMAIL;

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

const emailCfg = emailConfig();
const sendEmail = (to: string, subject: string, body: string, replyTo: string, attachments: Attachment[] = []) =>
  sendMail(emailCfg, to, subject, body, replyTo, attachments);

const emailSoham = (subject: string, body: string, replyTo: string, attachments?: Attachment[]) => sendEmail(NOTIFY_TO, subject, body, replyTo, attachments);

// Reply to the visitor. Never decides whether the lead counts as received: that depends on Supabase / the owner email only.
const emailVisitor = (to: string, subject: string, body: string, attachments?: Attachment[]) =>
  sendEmail(to, subject, body, CONTACT_EMAIL, attachments).catch((err) => (console.error('lead: visitor email error', err), false));

// Services and pricing guides (service-pdfs/, outside public so they only go out by email), by service id.
const SERVICE_PDFS: Record<string, string> = {
  websites: 'sohambuilds-websites.pdf',
  'ai-automations': 'sohambuilds-automation-and-analysis.pdf',
  'custom-software': 'sohambuilds-custom-business-software.pdf',
  'mobile-apps': 'sohambuilds-mobile-apps.pdf',
};

// The guides for the chosen services. A file that can't be read is skipped, so the email still goes out.
async function servicePdfs(services: string[]): Promise<Attachment[]> {
  const files = services.flatMap((id) => (SERVICE_PDFS[id] ? [SERVICE_PDFS[id]] : []));
  const read = await Promise.all(
    files.map((filename) =>
      readFile(path.join(process.cwd(), 'service-pdfs', filename))
        .then((content): Attachment => ({ filename, content }))
        .catch((err) => (console.error(`brief: could not attach ${filename}`, err), null))
    )
  );
  return read.filter((a): a is Attachment => a !== null);
}

// Mail to the visitor goes to an address nobody has verified, so it carries no free text they typed: the greeting
// uses their first name only if it is plain letters (no links), otherwise "there".
const firstName = (name: string) => {
  const first = name.split(/\s+/)[0];
  return /^[\p{L}'-]{1,30}$/u.test(first) ? first : 'there';
};
const SIGN_OFF = [
  'Soham Kar',
  'Founder, sohambuilds.in',
  'Raipur (C.G.), India',
  CONTACT_EMAIL,
  ...(CONTACT_WHATSAPP ? [`WhatsApp: https://wa.me/${CONTACT_WHATSAPP}`] : []),
  SITE_URL,
].join('\n');

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
  // Acknowledgement to the visitor (only if they gave an email; WhatsApp-only briefs get no auto-reply), with the
  // services and pricing guide for each service they chose
  const ack = email
    ? servicePdfs(services).then((guides) => emailVisitor(
      email,
      'We got your project brief',
      [
        `Hi ${firstName(name)},`,
        '',
        "Thanks for your brief. We've received it, and I'll reply personally to set up a scoping call.",
        ...(guides.length
          ? ['', `I've attached our services and pricing ${guides.length > 1 ? 'guides' : 'guide'}, so you can look through the prices and examples before we talk.`]
          : []),
        '',
        'What you picked:',
        `Services: ${serviceNames}`,
        `Timeline: ${timeline || '-'}`,
        '',
        'If anything is missing, just reply to this email.',
        '',
        SIGN_OFF,
      ].join('\n'),
      guides
    ))
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
        [`Hi ${firstName(name)},`, '', 'Thanks for your interest. My CV is attached.', '', 'If you have a project in mind, reply to this email or send a brief from our site.', '', SIGN_OFF].join('\n'),
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
    `Setup from ${inr(e.setup)}${e.licence ? `, monthly plan from ${inr(e.licence)} a month` : ''}${e.siteCare ? `, optional site care from ${inr(e.siteCare)} a month` : ''} (excl. GST)`,
    `Buy outright: ${e.buyout ? `from about ${inr(e.buyout)}${e.retainer ? `, maintenance plan after buying from ${inr(e.retainer)} a month` : ''}` : 'code handed over with setup'} (excl. GST)`,
    `Timeline: ${e.timeline}`,
  ];

  // The same PDF the browser downloads, copied to Soham. The visitor already has it from the browser, and it prints
  // their name and business, so their email gets the figures as fixed text instead. If it can't be built, Soham
  // still gets a plain-text email.
  const pdf = await estimatePdfBuffer(contact, e, answers.payment === 'buyout').catch((err) => (console.error('lead: estimate pdf failed', err), null));
  const attachments = pdf ? [{ filename: `Price estimate - ${contact.business.replace(/[\\/:*?"<>|]/g, '')}.pdf`, content: pdf }] : [];
  const visitorEmail = emailVisitor(
    contact.email,
    'Your price estimate',
    [
      `Hi ${firstName(contact.name)},`,
      '',
      'Thanks for using the estimator. Here is a summary of your price estimate (the PDF downloaded in your browser).',
      '',
      ...estimateLines,
      '',
      'This is an estimate, not a quote. Your proposal comes after a free call: reply to this email with a time that suits you.',
      '',
      SIGN_OFF,
    ].join('\n')
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
