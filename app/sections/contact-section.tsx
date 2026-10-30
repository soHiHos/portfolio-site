"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Mail, Send } from "lucide-react"
import SectionHeading from "../components/section-heading"
import { CONTACT_EMAIL, CONTACT_GITHUB, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, GithubIcon, InstagramIcon, LinkedinIcon, copyToClipboard } from "../components/ui/menu/contact-menu"
import { useIndiaTime } from "../components/use-india-time"
import Reveal from "../components/effects/reveal"
import { BRIEF_EVENT, type BriefDetail } from "../components/ask-tower/answer-blocks"
import services from "../content/services.json"
import { SERVICE_LIST } from "../content/service-list"

const TIMELINES = ["As soon as possible", "Within 1–3 months", "Flexible / exploring"]

// Everything a brief can be about: each service (including apps and websites) and the 30-day pilot
const SERVICE_OPTIONS = [...SERVICE_LIST, { id: "pilot", title: "30-day pilot" }]

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
// copies on click) beside a short project brief. "Send" opens the visitor's mail app with the brief pre-filled (mailto), so no backend is
// involved. The "Ask about my work" assistant can pre-fill the brief via a BRIEF_EVENT, and the services
// page via /?brief=<service id>#contact.
export default function ContactSection({ id }: { id?: string }) {
  const time = useIndiaTime()
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState("")
  const [service, setService] = useState("")
  const [timeline, setTimeline] = useState("")
  const [message, setMessage] = useState("")
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [sent, setSent] = useState(false)

  // Pre-fill from the assistant's "Start a brief"
  useEffect(() => {
    function handleBrief(e: Event) {
      const { service: s, message: m } = (e as CustomEvent<BriefDetail>).detail
      if (s) setService(s)
      if (m) setMessage(m)
      setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 600)
    }
    window.addEventListener(BRIEF_EVENT, handleBrief)
    // Arriving from the services page (/?brief=<service id>#contact) pre-selects the service
    const fromUrl = new URLSearchParams(window.location.search).get("brief")
    const preselect = fromUrl && SERVICE_OPTIONS.some((o) => o.id === fromUrl) ? fromUrl : null
    const timer = preselect ? setTimeout(() => setService(preselect), 0) : undefined
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

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!message.trim()) return
    const serviceName = SERVICE_OPTIONS.find((x) => x.id === service)?.title ?? "Not sure yet"
    const subject = `Project brief${name.trim() ? ` from ${name.trim()}` : ""}`
    const body = [`Name: ${name.trim() || "-"}`, `Service: ${serviceName}`, `Timeline: ${timeline || "-"}`, "", message.trim()].join("\n")
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
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
              <p className="text-sm text-muted">A few lines is enough. Only the last field is required.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className={labelClasses}>Name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={fieldClasses} />
              </label>
              <label className="block space-y-1.5">
                <span className={labelClasses}>Service</span>
                <select value={service} onChange={(e) => setService(e.target.value)} className={fieldClasses}>
                  <option value="">Not sure yet</option>
                  {SERVICE_OPTIONS.map((x) => (
                    <option key={x.id} value={x.id}>{x.title}</option>
                  ))}
                </select>
              </label>
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted" aria-live="polite">
                {sent ? "Sent to your mail app, check it to finish" : "Opens your mail app with the brief filled in"}
              </span>
              <button type="submit" disabled={!message.trim()} className="btn btn-primary">
                Send brief
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
