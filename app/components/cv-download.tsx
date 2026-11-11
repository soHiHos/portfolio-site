"use client"

import { useRef, useState } from "react"
import { Download, Loader2, X } from "lucide-react"
import { sendGTMEvent } from "@next/third-parties/google"
import { CV_PATH } from "../content/contact"

const fieldClasses = "w-full border border-line bg-bg/50 px-3.5 py-3 text-sm text-fg placeholder:text-muted/70 transition-colors focus:outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent-ink/20"
const labelClasses = "text-xs font-medium text-muted"

// "Download CV" button. It opens a small form for a name and email (with consent); /api/lead saves them to
// Supabase and emails them to Soham, then the PDF downloads. If saving fails the PDF still downloads, so a
// visitor is never blocked by a server problem. The PDF itself stays in /public, so this is a prompt, not a lock.
export default function CvDownload({ className = "", iconClassName = "w-4 h-4" }: { className?: string; iconClassName?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("") // honeypot: a hidden field people never fill in
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle")
  const [tried, setTried] = useState(false)

  const nameError = tried && !name.trim() ? "Enter your name." : ""
  const emailError = tried && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Enter a valid email address." : ""

  function startDownload() {
    const a = document.createElement("a")
    a.href = CV_PATH
    a.download = ""
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return
    setTried(true)
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !consent) return
    setStatus("sending")
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "cv", name, email, consent, website }),
    }).catch(() => null)
    // Tells GTM a CV was downloaded (no personal data)
    sendGTMEvent({ event: "cv_download", lead_source: "cv_form" })
    startDownload()
    setStatus("done")
  }

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={className}>
        <Download className={iconClassName} />
        Download CV
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="cv-title"
        onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current?.close() }}
        className="m-auto w-[min(26rem,calc(100%-2rem))] border border-line bg-surface p-0 text-fg backdrop:bg-black/50"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 id="cv-title" className="text-lg font-semibold">{status === "done" ? "Your download has started" : "Get my CV"}</h2>
              <p className="text-sm text-muted">
                {status === "done" ? "Thanks. If nothing downloaded, use the link below." : "Leave your name and email and the PDF downloads straight away."}
              </p>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="-m-2 p-2 text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === "done" ? (
            <div className="flex flex-wrap gap-3">
              <a href={CV_PATH} download className="btn btn-secondary">
                <Download className="w-4 h-4" />
                Download again
              </a>
              <button type="button" onClick={() => dialogRef.current?.close()} className="btn btn-link">Close</button>
            </div>
          ) : (
            <>
              <label className="block space-y-1.5">
                <span className={labelClasses}>Your name</span>
                <input type="text" autoComplete="name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={80} aria-invalid={!!nameError} className={`${fieldClasses} ${nameError ? "border-red-600" : ""}`} />
                {nameError && <span className="block text-xs text-red-700 dark:text-red-400" role="alert">{nameError}</span>}
              </label>
              <label className="block space-y-1.5">
                <span className={labelClasses}>Email</span>
                <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" maxLength={120} aria-invalid={!!emailError} className={`${fieldClasses} ${emailError ? "border-red-600" : ""}`} />
                {emailError && <span className="block text-xs text-red-700 dark:text-red-400" role="alert">{emailError}</span>}
              </label>
              <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--accent-ink)]" />
                <span>I&apos;m fine with you saving my name and email to know who downloaded the CV (<a href="/privacy" className="underline hover:text-fg">privacy</a>).</span>
              </label>
              <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <button type="submit" disabled={!consent || status === "sending"} className="btn btn-primary">
                {status === "sending" ? "One moment" : "Download CV"}
                {status === "sending" ? <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" /> : <Download className="w-4 h-4" />}
              </button>
            </>
          )}
        </form>
      </dialog>
    </>
  )
}
