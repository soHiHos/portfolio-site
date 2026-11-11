"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, ChevronDown, Mail, Send } from "lucide-react"
import { sendGTMEvent } from "@next/third-parties/google"
import SectionHeading from "../components/section-heading"
import { CONTACT_EMAIL, CONTACT_FACEBOOK, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, CONTACT_WHATSAPP, FacebookIcon, InstagramIcon, LinkedinIcon, WhatsAppIcon, BRAND_HOVER, copyToClipboard } from "../components/ui/menu/contact-menu"
import { useIndiaTime } from "../components/use-india-time"
import Reveal from "../components/effects/reveal"
import { BRIEF_EVENT, type BriefDetail } from "../components/ask-tower/answer-blocks"
import { AVAILABLE_FOR_WORK } from "../content/availability"
import { SERVICE_LIST, TIMELINES } from "../content/service-list"

// The four services a brief can be about; the choice also decides which PDF is sent
const SERVICE_OPTIONS = SERVICE_LIST
const OTHER = "other"

// WhatsApp first: it's how most clients here get in touch. Same pre-filled message as the floating WhatsApp button
const LINKS = [
  ...(CONTACT_WHATSAPP ? [{ label: "WhatsApp", href: `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Hi Soham, I found your site and would like to talk about a project.")}`, icon: WhatsAppIcon }] : []),
  { label: "LinkedIn", href: CONTACT_LINKEDIN, icon: LinkedinIcon },
  { label: "Instagram", href: CONTACT_INSTAGRAM, icon: InstagramIcon },
  ...(CONTACT_FACEBOOK ? [{ label: "Facebook", href: CONTACT_FACEBOOK, icon: FacebookIcon }] : []),
]

// Square icon buttons: lift on hover and fill (the accent for email, each brand's colours for the socials), with a small tooltip naming the link
const iconClasses = "group relative flex w-12 h-12 items-center justify-center border border-line text-fg transition-all duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink cursor-pointer"
const tipClasses = "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap bg-fg px-2 py-1 text-xs font-medium text-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
const fieldClasses = "w-full border border-line bg-bg/50 px-3.5 py-3 text-sm text-fg placeholder:text-muted/70 transition-colors focus:outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent-ink/20"
const labelClasses = "text-xs font-medium text-muted"

// Contact: a headline, then one card with the description, availability and icon-only links (email
// copies on click) beside a short project brief. "Send" posts the brief to /api/lead (saved to Supabase and emailed);
// if that fails it opens the visitor's mail app with the brief filled in. The "Ask about my work" assistant can
// pre-fill the brief via a BRIEF_EVENT, and the services page via /?brief=<service id>#contact.
// `service`: a service id to pre-select, e.g. on that service's own page. `flush`: no vertical padding, for pages
// that space their sections with a gap of their own (the services pages)
export default function ContactSection({ id, service, flush }: { id?: string; service?: string; flush?: boolean }) {
  const time = useIndiaTime()
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState("")
  const [choice, setChoice] = useState(service ?? "") // "" (nothing yet), a service id, or OTHER
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("") // honeypot: a hidden field people never fill in
  const [timeline, setTimeline] = useState("")
  const [message, setMessage] = useState("")
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle")
  const [step, setStep] = useState<1 | 2>(1)
  const [contactBy, setContactBy] = useState<"email" | "whatsapp">("email")
  const [tried, setTried] = useState(false) // errors show only after the visitor has tried to move on

  useEffect(() => {
    if (step === 2) nameRef.current?.focus({ preventScroll: true })
  }, [step])

  // Pre-fill from the assistant's "Start a brief"
  useEffect(() => {
    function handleBrief(e: Event) {
      const { service: s, message: m } = (e as CustomEvent<BriefDetail>).detail
      if (m) { setMessage(m); setChoice(OTHER) } else if (s) setChoice(s)
      setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 600)
    }
    window.addEventListener(BRIEF_EVENT, handleBrief)
    // Arriving from the services page (/?brief=<service id>#contact) pre-selects the service
    const fromUrl = new URLSearchParams(window.location.search).get("brief")
    const preselect = fromUrl && SERVICE_OPTIONS.some((o) => o.id === fromUrl) ? fromUrl : null
    const timer = preselect ? setTimeout(() => setChoice(preselect), 0) : undefined
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

  // Step 1 needs a message; step 2 needs one valid way to reply (the other is left empty) and consent
  const contactValue = contactBy === "email" ? email.trim() : whatsapp.trim()
  const contactValid = contactBy === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue) : /^\+?[\d\s-]{10,16}$/.test(contactValue)
  const chosen = SERVICE_OPTIONS.find((x) => x.id === choice)
  const picked = chosen ? [chosen.id] : []
  // A listed service sends a one-line message; "Other" sends what the visitor typed
  const finalMessage = choice === OTHER ? message.trim() : chosen ? `Interested in: ${chosen.title}` : ""
  const choiceError = tried && !choice ? "Pick the closest option." : ""
  const messageError = tried && choice === OTHER && !message.trim() ? "Add a line or two about what you need." : ""
  const contactError = tried && !contactValid ? (contactBy === "email" ? "Enter a valid email address." : "Enter a valid number, like +91 98765 43210.") : ""

  function goToStep2() {
    setTried(true)
    if (!finalMessage) return
    setTried(false)
    setStep(2)
  }

  // Sends the brief to /api/lead (saved to Supabase and emailed). If that fails, it falls back to the visitor's mail app
  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return
    setTried(true)
    if (!finalMessage || !contactValid || !consent) return
    setStatus("sending")
    const sent = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "brief", name, whatsapp: contactBy === "whatsapp" ? whatsapp : "", email: contactBy === "email" ? email : "", services: picked, timeline, message: finalMessage, consent, website }),
    })
      .then((r) => r.ok)
      .catch(() => false)
    if (sent) {
      // Tells GTM a brief was sent (no personal data), for a GA4 "generate_lead" tag
      sendGTMEvent({ event: "generate_lead", lead_source: "contact_form", services: picked.join(",") })
      setStatus("sent")
      setName(""); setWhatsapp(""); setEmail(""); setChoice(""); setTimeline(""); setMessage(""); setConsent(false); setTried(false); setStep(1)
      return
    }
    const serviceName = chosen?.title ?? "Other"
    const subject = `Project brief${name.trim() ? ` from ${name.trim()}` : ""}`
    const body = [`Name: ${name.trim() || "-"}`, `Services: ${serviceName}`, `WhatsApp: ${contactBy === "whatsapp" ? whatsapp.trim() : "-"}`, `Email: ${contactBy === "email" ? email.trim() : "-"}`, `Timeline: ${timeline || "-"}`, "", finalMessage].join("\n")
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus("fallback")
  }

  return (
    <section id={id} className={flush ? "scroll-mt-28" : undefined}>
      <div className={`w-full text-left space-y-8 ${flush ? "" : "py-12"}`}>
        <SectionHeading
          title="Tell me about your project"
        />

        <Reveal className="grid lg:grid-cols-[1fr_1.4fr] border border-line bg-surface">
          {/* Description, availability and icon-only links */}
          <div className="flex flex-col gap-6 p-5 sm:p-8">
            <p className="text-lg leading-relaxed text-muted">
              Send a short brief (about a minute) and I&apos;ll reply to set up a scoping call, or reach me directly with the links below.
            </p>
            <div className="space-y-1.5 text-sm text-muted">
              <span className="flex items-center gap-2 font-medium text-fg">
                <span className={`w-2 h-2 rounded-full ${AVAILABLE_FOR_WORK ? "bg-emerald-500" : "bg-fg/30"}`} aria-hidden="true" />
                {AVAILABLE_FOR_WORK ? "Available for new projects" : "Fully booked right now"}
              </span>
              <span className="block">Based in India · {time} IST</span>
            </div>
            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={handleCopyEmail} aria-label={copied ? "Email copied" : `Copy email (${CONTACT_EMAIL})`} className={`${iconClasses} hover:border-accent hover:bg-accent hover:text-on-accent`}>
                {copied ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                <span className={tipClasses} aria-hidden="true">{copied ? "Copied!" : "Copy email"}</span>
              </button>
              {LINKS.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${iconClasses} ${BRAND_HOVER[label]}`}>
                  <Icon className="w-5 h-5" />
                  <span className={tipClasses} aria-hidden="true">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Brief form: two short steps, message first, then how to reach you */}
          <form onSubmit={handleSend} noValidate className="space-y-6 p-5 sm:p-8 border-t lg:border-t-0 lg:border-l border-line">
            {status === "sent" ? (
              <div className="flex h-full flex-col items-start justify-center gap-4 py-8" role="status">
                <span className="flex h-12 w-12 items-center justify-center bg-accent text-on-accent"><Check className="w-6 h-6" /></span>
                <div className="space-y-1">
                  <div className="text-xl font-semibold text-fg">Got it, thank you.</div>
                  <p className="text-sm text-muted">I&apos;ll reply by email or WhatsApp within 48 hours.</p>
                </div>
                <button type="button" onClick={() => setStatus("idle")} className="btn btn-link">Send another brief</button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-semibold text-fg">{step === 1 ? "What do you need?" : "Where can I reach you?"}</div>
                    <span className="text-xs text-muted">Step {step} of 2</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5" aria-hidden="true">
                    <span className="h-1 bg-accent" />
                    <span className={`h-1 transition-colors duration-300 ${step === 2 ? "bg-accent" : "bg-line"}`} />
                  </div>
                </div>

                <div className="grid min-h-[29rem] sm:min-h-[27rem]">
                  <div inert={step !== 1} className={`col-start-1 row-start-1 flex flex-col gap-5 ${step === 1 ? "" : "invisible"}`}>
                    <label className="block space-y-1.5">
                      <span className={labelClasses}>What do you need?</span>
                      <span className="relative block">
                        <select
                          value={choice}
                          onChange={(e) => {
                            setChoice(e.target.value)
                            if (e.target.value === OTHER) setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 0)
                          }}
                          aria-invalid={!!choiceError}
                          className={`${fieldClasses} appearance-none pr-10 cursor-pointer ${choiceError ? "border-red-600" : ""} ${choice ? "" : "text-muted/70"}`}
                        >
                          <option value="" disabled>Choose one</option>
                          {SERVICE_OPTIONS.map((x) => (
                            <option key={x.id} value={x.id}>{x.title}</option>
                          ))}
                          <option value={OTHER}>Other</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                      </span>
                      {choiceError && <span className="block text-xs text-red-700 dark:text-red-400" role="alert">{choiceError}</span>}
                    </label>
                    {choice === OTHER && (
                      <label className="block space-y-1.5">
                        <span className={labelClasses}>Tell me about it</span>
                        <textarea
                          ref={messageRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="The problem, who it's for, and what you have so far. A few lines is plenty."
                          rows={4}
                          maxLength={2000}
                          aria-invalid={!!messageError}
                          className={`${fieldClasses} resize-none ${messageError ? "border-red-600" : ""}`}
                        />
                        {messageError && <span className="block text-xs text-red-700 dark:text-red-400" role="alert">{messageError}</span>}
                      </label>
                    )}
                    <div className="space-y-1.5">
                      <span className={labelClasses} id="timeline-label">When do you want to start? <span className="font-normal">(optional)</span></span>
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
                              className={`border px-3 py-2.5 sm:py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink cursor-pointer ${
                                selected ? "border-accent bg-accent text-on-accent" : "border-line text-muted hover:border-fg/40 hover:text-fg"
                              }`}
                            >
                              {t}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="mt-auto flex justify-end pt-1">
                      <button type="button" onClick={goToStep2} className="btn btn-primary">
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div inert={step !== 2} className={`col-start-1 row-start-1 flex flex-col gap-5 ${step === 2 ? "" : "invisible"}`}>
                    <label className="block space-y-1.5">
                      <span className={labelClasses}>Your name <span className="font-normal">(optional)</span></span>
                      <input type="text" autoComplete="name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={80} className={fieldClasses} />
                    </label>
                    <div className="space-y-1.5">
                      <span className={labelClasses} id="reach-label">Reply to me by</span>
                      <div role="radiogroup" aria-labelledby="reach-label" className="grid grid-cols-2 border border-line">
                        {(["email", "whatsapp"] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            role="radio"
                            aria-checked={contactBy === m}
                            onClick={() => { setContactBy(m); setTried(false) }}
                            className={`px-3 py-3 sm:py-2 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink cursor-pointer ${
                              contactBy === m ? "bg-accent text-on-accent" : "text-muted hover:text-fg"
                            }`}
                          >
                            {m === "email" ? "Email" : "WhatsApp"}
                          </button>
                        ))}
                      </div>
                      {contactBy === "email" ? (
                        <input key="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" maxLength={120} aria-label="Email" aria-invalid={!!contactError} className={`${fieldClasses} ${contactError ? "border-red-600" : ""}`} />
                      ) : (
                        <input key="wa" type="tel" inputMode="tel" autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" maxLength={20} aria-label="WhatsApp number" aria-invalid={!!contactError} className={`${fieldClasses} ${contactError ? "border-red-600" : ""}`} />
                      )}
                      {contactError && <span className="block text-xs text-red-700 dark:text-red-400" role="alert">{contactError}</span>}
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--accent-ink)]" />
                        <span>It&apos;s fine to contact me about this enquiry. My details are stored only to handle it (<a href="/privacy" className="underline hover:text-fg">privacy</a>).</span>
                      </label>
                      {!consent && (
                        <p className="pl-6 text-xs leading-relaxed text-muted">
                          Rather not tick? Copy{" "}
                          <button type="button" onClick={handleCopyEmail} className="underline hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer">
                            {copied ? "copied!" : CONTACT_EMAIL}
                          </button>{" "}
                          and email me from your own inbox.
                        </p>
                      )}
                    </div>
                    <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button type="button" onClick={() => { setTried(false); setStep(1) }} className="btn btn-link">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button type="submit" disabled={!consent || status === "sending"} className="btn btn-primary">
                        {status === "sending" ? "Sending" : "Send brief"}
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted" aria-live="polite">
                      {status === "fallback"
                        ? "Couldn't send it just now. Your mail app has opened with the brief filled in; send it from there."
                        : "I reply within 48 hours."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
