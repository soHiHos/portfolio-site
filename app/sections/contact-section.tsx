"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Mail, Send } from "lucide-react"
import SectionHeading from "../components/section-heading"
import { CONTACT_EMAIL, CONTACT_GITHUB, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, GithubIcon, InstagramIcon, LinkedinIcon, copyToClipboard } from "../components/ui/menu/contact-menu"
import { useIndiaTime } from "../components/use-india-time"
import Reveal from "../components/effects/reveal"
import { BRIEF_EVENT, type BriefDetail } from "../components/ask-tower/answer-blocks"
import services from "../content/services.json"
import { SERVICE_LIST, TIMELINES } from "../content/service-list"

// The four services a brief can be about; the choice also decides which PDF is sent
const SERVICE_OPTIONS = SERVICE_LIST

const LINKS = [
  { label: "LinkedIn", href: CONTACT_LINKEDIN, icon: LinkedinIcon },
  { label: "GitHub", href: CONTACT_GITHUB, icon: GithubIcon },
  { label: "Instagram", href: CONTACT_INSTAGRAM, icon: InstagramIcon },
]

// Square icon buttons: fill with the accent and lift on hover, with a small tooltip naming the link
const iconClasses = "group relative flex w-12 h-12 items-center justify-center border border-line text-fg transition-all duration-300 hover:border-accent hover:bg-accent hover:text-on-accent motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink cursor-pointer"
const tipClasses = "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap bg-fg px-2 py-1 text-xs font-medium text-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
const fieldClasses = "w-full border border-line bg-bg/50 px-3.5 py-3 text-sm text-fg placeholder:text-muted/70 transition-colors focus:outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent-ink/20"
const labelClasses = "text-xs font-medium text-muted"

// Contact: a headline, then one card with the description, availability and icon-only links (email
// copies on click) beside a short project brief. "Send" posts the brief to /api/lead (saved to Supabase and emailed);
// if that fails it opens the visitor's mail app with the brief filled in. The "Ask about my work" assistant can
// pre-fill the brief via a BRIEF_EVENT, and the services page via /?brief=<service id>#contact.
export default function ContactSection({ id }: { id?: string }) {
  const time = useIndiaTime()
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState("")
  const [picked, setPicked] = useState<string[]>([])
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("") // honeypot: a hidden field people never fill in
  const [timeline, setTimeline] = useState("")
  const [message, setMessage] = useState("")
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle")

  // Pre-fill from the assistant's "Start a brief"
  useEffect(() => {
    function handleBrief(e: Event) {
      const { service: s, message: m } = (e as CustomEvent<BriefDetail>).detail
      if (s) setPicked((p) => (p.includes(s) ? p : [...p, s]))
      if (m) setMessage(m)
      setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 600)
    }
    window.addEventListener(BRIEF_EVENT, handleBrief)
    // Arriving from the services page (/?brief=<service id>#contact) pre-selects the service
    const fromUrl = new URLSearchParams(window.location.search).get("brief")
    const preselect = fromUrl && SERVICE_OPTIONS.some((o) => o.id === fromUrl) ? fromUrl : null
    const timer = preselect ? setTimeout(() => setPicked([preselect]), 0) : undefined
    return () => {
      window.removeEventListener(BRIEF_EVENT, handleBrief)
      clearTimeout(timer)
    }
  }, [])

  async function handleCopyEmail() {
    try {
      await copyToClipboard(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Copy failed silently — email is still visible to select/copy manually
    }
  }

  // A message, a way to reply (email or WhatsApp) and consent are needed
  const canSend = !!message.trim() && !!(whatsapp.trim() || email.trim()) && consent

  // Sends the brief to /api/lead (saved to Supabase and emailed). If that fails, it falls back to the visitor's mail app
  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSend || status === "sending") return
    setStatus("sending")
    const sent = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "brief", name, whatsapp, email, services: picked, timeline, message, consent, website }),
    })
      .then((r) => r.ok)
      .catch(() => false)
    if (sent) {
      setStatus("sent")
      setName(""); setWhatsapp(""); setEmail(""); setPicked([]); setTimeline(""); setMessage(""); setConsent(false)
      return
    }
    const serviceName = SERVICE_OPTIONS.filter((x) => picked.includes(x.id)).map((x) => x.title).join(", ") || "Not sure yet"
    const subject = `Project brief${name.trim() ? ` from ${name.trim()}` : ""}`
    const body = [`Name: ${name.trim() || "-"}`, `Services: ${serviceName}`, `WhatsApp: ${whatsapp.trim() || "-"}`, `Email: ${email.trim() || "-"}`, `Timeline: ${timeline || "-"}`, "", message.trim()].join("\n")
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus("fallback")
  }

  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <SectionHeading
          title={<>Let&apos;s build something <span className="underline decoration-accent decoration-4 underline-offset-8">real</span>.</>}
        />

        <Reveal className="grid lg:grid-cols-[1fr_1.4fr] border border-line bg-surface">
          {/* Description, availability and icon-only links */}
          <div className="flex flex-col gap-6 p-5 sm:p-8">
            <p className="text-lg leading-relaxed text-muted">
              Have a project in mind? Send a short brief and I&apos;ll reply to set up a scoping call, or reach me directly.
            </p>
            <div className="space-y-1.5 text-sm text-muted">
              <span className="flex items-center gap-2 font-medium text-fg">
                <span className={`w-2 h-2 rounded-full ${services.availability.accepting ? "bg-emerald-500" : "bg-fg/30"}`} aria-hidden="true" />
                {services.availability.accepting ? "Available for new projects" : "Fully booked right now"}
              </span>
              <span className="block">Based in India · {time} IST</span>
            </div>
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={handleCopyEmail} aria-label={copied ? "Email copied" : `Copy email (${CONTACT_EMAIL})`} className={iconClasses}>
                {copied ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                <span className={tipClasses} aria-hidden="true">{copied ? "Copied!" : "Copy email"}</span>
              </button>
              {LINKS.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconClasses}>
                  <Icon className="w-5 h-5" />
                  <span className={tipClasses} aria-hidden="true">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Brief form */}
          <form onSubmit={handleSend} className="space-y-5 p-5 sm:p-8 border-t lg:border-t-0 lg:border-l border-line">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-fg">Send a project brief</div>
              <p className="text-sm text-muted">A few lines is enough. I need your message, and an email or WhatsApp number to reply on.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className={labelClasses}>Name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={fieldClasses} />
              </label>
              <label className="block space-y-1.5">
                <span className={labelClasses}>WhatsApp number</span>
                <input type="tel" inputMode="tel" autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" pattern="\+?[\d\s\-]{10,16}" maxLength={20} className={fieldClasses} />
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className={labelClasses}>Email</span>
                <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" maxLength={120} className={fieldClasses} />
              </label>
            </div>
            <div className="space-y-1.5">
              <span className={labelClasses} id="services-label">Services you need</span>
              <div role="group" aria-labelledby="services-label" className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((x) => {
                  const selected = picked.includes(x.id)
                  return (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPicked(selected ? picked.filter((id) => id !== x.id) : [...picked, x.id])}
                      className={`border px-3 py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer ${
                        selected ? "border-accent bg-accent text-on-accent" : "border-line text-muted hover:border-fg/40 hover:text-fg"
                      }`}
                    >
                      {x.title}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <span className={labelClasses} id="timeline-label">Timeline</span>
              <div role="radiogroup" aria-labelledby="timeline-label" className="flex flex-wrap gap-2">
                {TIMELINES.map((t) => {
                  const selected = timeline === t
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setTimeline(selected ? "" : t)}
                      className={`border px-3 py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer ${
                        selected ? "border-accent bg-accent text-on-accent" : "border-line text-muted hover:border-fg/40 hover:text-fg"
                      }`}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
            <label className="block space-y-1.5">
              <span className={labelClasses}>What are you building?</span>
              <textarea
                ref={messageRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="The problem, who it's for, and what you have so far"
                rows={4}
                required
                className={`${fieldClasses} resize-none`}
              />
            </label>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
              <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--accent-ink)]" />
              <span>I agree to be contacted about my enquiry by email or WhatsApp, including with a PDF of service details, and that my details are stored to handle it.</span>
            </label>
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted" aria-live="polite">
                {status === "sent"
                  ? "Thanks, I've got your brief. I'll reply by email or WhatsApp within 48 hours."
                  : status === "fallback"
                    ? "Couldn't send it just now. Your mail app has opened with the brief filled in, send it from there."
                    : "I reply by email or WhatsApp within 48 hours."}
              </span>
              <button type="submit" disabled={!canSend || status === "sending"} className="btn btn-primary">
                {status === "sending" ? "Sending" : "Send brief"}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
