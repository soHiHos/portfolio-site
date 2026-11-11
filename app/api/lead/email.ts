// Sends mail through Resend. Kept free of Next and content imports so the tests (npm test) can run it directly.

export type Attachment = { filename: string; content: Buffer };
export type EmailConfig = { apiKey?: string; from: string };

export function emailConfig(env: Record<string, string | undefined> = process.env): EmailConfig {
  return { apiKey: env.RESEND_API_KEY || undefined, from: env.LEAD_EMAIL_FROM || 'Portfolio leads <onboarding@resend.dev>' };
}

// Returns true only when Resend accepted the message. A missing key or a rejection is logged, never thrown.
export async function sendEmail(
  cfg: EmailConfig,
  to: string,
  subject: string,
  body: string,
  replyTo: string,
  attachments: Attachment[] = [],
  doFetch: typeof fetch = fetch
): Promise<boolean> {
  if (!cfg.apiKey) {
    console.error('lead: RESEND_API_KEY is not set, so no email was sent. Add it to .env.local and to the Vercel project settings.');
    return false;
  }
  const res = await doFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: cfg.from,
      to: [to],
      reply_to: replyTo,
      subject,
      text: body,
      ...(attachments.length ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })) } : {}),
    }),
  });
  if (!res.ok) console.error(`lead: resend email to ${to} failed`, res.status, await res.text());
  return res.ok;
}
