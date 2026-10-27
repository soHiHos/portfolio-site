"use client"

import { useEffect, useRef, useState } from "react"
import { Plane, RotateCcw } from "lucide-react"

const CHECKLIST = [
  "Can this be built?",
  "Can it be simplified?",
  "Does it solve a genuine problem?",
  "Can it create long-term value?",
]

const none = () => CHECKLIST.map(() => false)

// Pre-flight checklist that runs itself once scrolled into view: each check ticks in turn,
// and the plane taxis down the runway to the end.
export default function PreflightChecklist() {
  const [checked, setChecked] = useState(none)
  const rootRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const count = checked.filter(Boolean).length
  const cleared = count === CHECKLIST.length

  function run() {
    timers.current.forEach(clearTimeout)
    setChecked(none())
    const step = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650
    timers.current = CHECKLIST.map((_, i) =>
      setTimeout(() => setChecked((c) => c.map((v, j) => (j === i ? true : v))), 400 + i * step)
    )
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      timers.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <div ref={rootRef} className={`h-full border bg-surface p-6 sm:p-8 transition-colors duration-500 ${cleared ? "border-accent/60" : "border-line"}`}>
      <div className="flex items-center justify-between text-xs font-medium tracking-[0.25em] text-muted mb-1">
        <span>PRE-FLIGHT CHECKLIST</span>
        <span className={`transition-colors ${cleared ? "text-accent-ink" : ""}`} aria-live="polite">
          {cleared ? "CLEARED" : "HOLDING"}
        </span>
      </div>
      <p className="text-sm text-muted mb-5">Every project starts here.</p>

      <ul className="space-y-2">
        {CHECKLIST.map((item, i) => (
          <li
            key={item}
            className={`flex items-center gap-4 px-3 py-3 text-lg font-semibold transition-all duration-300 ${
              checked[i] ? "bg-accent/10 text-fg" : "text-fg/50"
            }`}
          >
            <span
              className={`shrink-0 w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                checked[i] ? "border-accent bg-accent scale-110" : "border-line"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-on-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  strokeDasharray="24"
                  strokeDashoffset={checked[i] ? 0 : 24}
                  style={{ transition: "stroke-dashoffset 300ms ease 100ms" }}
                />
              </svg>
            </span>
            <span className="flex-1">{item}</span>
            <span className={`text-[10px] tracking-[0.2em] transition-colors ${checked[i] ? "text-accent-ink" : "text-muted"}`}>
              {checked[i] ? "CHECK" : `CHK ${i + 1}`}
            </span>
          </li>
        ))}
      </ul>

      {/* Runway: the plane taxis one step per check */}
      <div className="relative mt-8 mb-3 h-1 rounded-full bg-line" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(count / CHECKLIST.length) * 100}%` }} />
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out"
          style={{ left: `${(count / CHECKLIST.length) * 100}%` }}
        >
          <Plane
            className="w-6 h-6 text-accent-ink bg-surface rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <span className={`text-xs font-medium tracking-[0.2em] ${cleared ? "text-accent-ink" : "text-muted"}`}>
          {cleared ? "CLEARED FOR TAKEOFF" : `${count}/${CHECKLIST.length} CHECKS COMPLETE`}
        </span>
        {cleared && (
          <button type="button" onClick={run} className="btn-link text-sm text-fg">
            <RotateCcw className="w-4 h-4" /> Replay
          </button>
        )}
      </div>
    </div>
  )
}
