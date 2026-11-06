import type { Metadata } from "next";
import Reveal from "../components/effects/reveal";
import { CONTACT_EMAIL } from "../content/contact";

export const metadata: Metadata = {
  title: "Privacy policy · Soham Kar",
  description: "What this site collects, why, who handles it, and how to ask me to delete it.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "What I collect",
    body: (
      <>
        <p>
          Only what you send me. If you use the contact form, that is your name, your WhatsApp number and/or email, the
          services you are interested in, your timeline and your message. The form has a consent checkbox, and nothing is
          sent until you tick it and press send.
        </p>
        <p>
          If you download my CV, I ask for your name and email first, with the same kind of consent checkbox, so I know who
          took it. The site has no accounts, no payments and no newsletter.
        </p>
      </>
    ),
  },
  {
    title: "How I use it",
    body: (
      <p>
        To reply to you and scope your project. I don&apos;t sell your details, and I won&apos;t add you to a mailing list
        without asking. The message, or the name and email from a CV download, is stored in a database and emailed to me, so I can answer by email or WhatsApp.
      </p>
    ),
  },
  {
    title: "Analytics and cookies",
    body: (
      <>
        <p>
          I use two tools to see how the site is used. Google Analytics (loaded through Google Tag Manager) sets cookies
          and records things like the pages you view, how long you stay, your device and browser, where you came from and
          your approximate location. Vercel Web Analytics counts page views without cookies.
        </p>
        <p>
          Nothing you type into the contact form is sent to either tool. The only form-related signals are that a brief was
          sent, along with the services ticked, and that the CV was downloaded. You can block Google Analytics with your browser&apos;s cookie settings, a
          content blocker, or Google&apos;s opt-out browser add-on.
        </p>
      </>
    ),
  },
  {
    title: "Who handles your data",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Vercel hosts the site and provides Vercel Web Analytics.</li>
        <li>Supabase stores contact-form messages.</li>
        <li>Resend delivers the notification email to me.</li>
        <li>Google provides Tag Manager and Analytics.</li>
      </ul>
    ),
  },
  {
    title: "Where it is stored",
    body: (
      <p>
        These services run on servers that may be outside India. To limit spam, the form briefly counts requests per
        network address in memory. That address is not saved with your message.
      </p>
    ),
  },
  {
    title: "How long I keep it",
    body: (
      <p>
        Contact-form messages are kept for as long as needed to reply and, if we work together, to keep a record of the
        work. Google Analytics data is kept for 14 months. You can ask me to delete your message at any time.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask me what I hold about you, ask me to correct it, or ask me to delete it. Write to{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20request`} className="text-accent-ink underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>{" "}
        and I&apos;ll reply as soon as I can.
      </p>
    ),
  },
  {
    title: "Other sites",
    body: (
      <p>
        Pages here link to client sites and social profiles. Their privacy practices are their own, and this policy
        doesn&apos;t cover them.
      </p>
    ),
  },
  {
    title: "Changes",
    body: <p>If I change what the site collects, I&apos;ll update this page and the date below.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl space-y-8 pb-12">
      <Reveal>
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg">Privacy policy</h1>
          <p className="text-lg leading-relaxed text-muted">
            This site is a portfolio. It collects very little, and this page says exactly what and why.
          </p>
        </div>
      </Reveal>

      <div className="space-y-6">
        {SECTIONS.map(({ title, body }) => (
          <Reveal key={title}>
            <div className="space-y-2 border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-fg">{title}</h2>
              <div className="space-y-3 leading-relaxed text-muted">{body}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="text-sm text-muted">Last updated 5 November 2026.</p>
    </section>
  );
}
