"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Download, Loader2 } from "lucide-react"
import { CONTACT_EMAIL } from "../../content/contact"
import { QUESTIONS, estimate, type Answers, type Contact } from "./estimate"

type Key = keyof typeof QUESTIONS
const ORDER: Key[] = ["business", "outcomes", "tracking", "users", "extras", "ai", "payment", "start"]
const MULTI: Partial<Record<Key, { min: number; max: number }>> = {
  outcomes: { min: 1, max: QUESTIONS.outcomes.max },
  tracking: { min: 1, max: QUESTIONS.tracking.options.length },
  extras: { min: 0, max: QUESTIONS.extras.options.length },
}

const optionClasses =
  "group flex w-full items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
const fieldClasses =
  "w-full border border-line bg-bg/50 px-3.5 py-3 text-sm text-fg placeholder:text-muted/70 transition-colors focus:outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent-ink/20"
const labelClasses = "text-xs font-medium text-muted"

type Status = "idle" | "sending" | "done"

// Fired by the problem tiles on the services page (detail: outcome ids) to pre-tick "What do you want to fix?"
export const PICK_EVENT = "estimator:pick"

// The price estimator: eight questions, one at a time, then contact details. Submitting saves the lead
// (/api/lead) and downloads a PDF estimate built in the browser. The PDF is given even if saving fails.
export default function Estimator() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Record<Key, string | string[]>>>({ extras: [] })
  const [contact, setContact] = useState<Contact>({ name: "", business: "", phone: "", email: "" })
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [saveFailed, setSaveFailed] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    const pick = (e: Event) => setAnswers((a) => ({ ...a, outcomes: (e as CustomEvent<string[]>).detail }))
    window.addEventListener(PICK_EVENT, pick)
    return () => window.removeEventListener(PICK_EVENT, pick)
  }, [])

  const total = ORDER.length + 1
  const key = ORDER[step]
  const multi = key ? MULTI[key] : undefined
  const picked = key ? answers[key] : undefined
  const pickedList = Array.isArray(picked) ? picked : []

  function choose(id: string) {
    if (!key) return
    if (multi) {
      const next = pickedList.includes(id) ? pickedList.filter((x) => x !== id) : pickedList.length < multi.max ? [...pickedList, id] : pickedList
      setAnswers({ ...answers, [key]: next })
    } else {
      setAnswers({ ...answers, [key]: id })
      setStep(step + 1)
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!consent) return
    setStatus("sending")
    const full = answers as unknown as Answers
    const today = new Date()

    const saved = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: full, contact, consent, website: honeypot }),
    })
      .then((r) => r.ok)
      .catch(() => false)
    setSaveFailed(!saved)

    const { estimatePdf } = await import("./estimate-pdf")
    const blob = await estimatePdf(contact, estimate(full, today), today)
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)
    setStatus("done")
    download(url)
  }

  function download(url: string) {
    const a = document.createElement("a")
    a.href = url
    a.download = `Price estimate - ${contact.business}.pdf`
    a.click()
  }

  return (
    <div className="border border-line bg-surface p-5 sm:p-8 space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{status === "done" ? "Done" : `Step ${step + 1} of ${total}`}</span>
          {step > 0 && status === "idle" && (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-link text-xs text-fg">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
        </div>
        <div className="h-1 bg-line" aria-hidden="true">
          <div className="h-1 bg-accent transition-all" style={{ width: `${((status === "done" ? total : step) / total) * 100}%` }} />
        </div>
      </div>

      {key && (
        <fieldset className="space-y-4">
          <legend className="space-y-1">
            <span className="block text-xl sm:text-2xl font-bold text-fg">{QUESTIONS[key].title}</span>
            {"hint" in QUESTIONS[key] && <span className="block text-sm text-muted">{(QUESTIONS[key] as { hint: string }).hint}</span>}
          </legend>
          <div className="grid sm:grid-cols-2 gap-3">
            {(QUESTIONS[key].options as readonly { id: string; label: string }[]).map((o) => {
              const on = multi ? pickedList.includes(o.id) : picked === o.id
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(o.id)}
                  className={`${optionClasses} ${on ? "border-accent bg-accent/10 text-fg" : "border-line bg-bg/40 text-fg hover:border-accent/60"}`}
                >
                  {o.label}
                  {on ? <Check className="w-4 h-4 shrink-0 text-accent-ink" /> : !multi && <ArrowRight className="w-4 h-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />}
                </button>
              )
            })}
          </div>
          {multi && (
            <button type="button" disabled={pickedList.length < multi.min} onClick={() => setStep(step + 1)} className="btn btn-primary disabled:opacity-50 disabled:pointer-events-none">
              {pickedList.length === 0 && multi.min === 0 ? "Neither, continue" : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </fieldset>
      )}

      {!key && status !== "done" && (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-fg">Where should I send your estimate?</h2>
            <p className="text-sm text-muted">Your PDF downloads straight away. I&apos;ll also follow up once, to offer a free 30-minute call.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {(
              [
                ["name", "Your name", "text", "name"],
                ["business", "Business name", "text", "organization"],
                ["phone", "Phone (WhatsApp)", "tel", "tel"],
                ["email", "Email", "email", "email"],
              ] as const
            ).map(([field, text, type, auto]) => (
              <label key={field} className="space-y-1.5">
                <span className={labelClasses}>{text}</span>
                <input
                  required
                  type={type}
                  autoComplete={auto}
                  value={contact[field]}
                  onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                  pattern={field === "phone" ? "\\+?[\\d\\s\\-]{10,16}" : undefined}
                  maxLength={field === "business" ? 120 : 80}
                  className={fieldClasses}
                />
              </label>
            ))}
          </div>
          {/* Honeypot: hidden from people, filled in by bots */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px] w-px h-px opacity-0"
          />
          <label className="flex items-start gap-2 text-sm text-fg">
            <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-accent" />
            <span>I agree to Soham Kar storing these details and contacting me about this estimate by phone, WhatsApp or email.</span>
          </label>
          <button type="submit" disabled={status === "sending"} className="btn btn-primary">
            {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Get my estimate
          </button>
        </form>
      )}

      {status === "done" && pdfUrl && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-fg">Your estimate is ready</h2>
          <p className="text-sm text-muted">It&apos;s a range, not a quote. Your fixed quote comes after a free 30-minute call.</p>
          {saveFailed && (
            <p className="border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-fg">
              Your details didn&apos;t reach me. Please email the PDF to {CONTACT_EMAIL} so I can follow up.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => download(pdfUrl)} className="btn btn-primary">
              <Download className="w-4 h-4" /> Download again
            </button>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Book a call: ${contact.business}`)}`} className="btn btn-secondary">
              Book a free call
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
