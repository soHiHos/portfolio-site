"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { PICK_EVENT } from "../estimator/estimator"
import { inr } from "../estimator/estimate"
import { PRICING } from "../../content/pricing"

const CYCLE_MS = 3000

type Problem = { id: string; quote: string; detail: string }

// "Sound familiar?" as a list of problems with the answer beside it: pick a problem and see what I can help
// automate for it. With the estimator on (`selectable`), "Price this" carries the pick into it; otherwise the panel is
// information only, with a link down to the requirements and the form.
// The help lines come from PRICING.outcomes, so the tile and the estimate say the same thing.
export default function ProblemTiles({ items, selectable }: { items: Problem[]; selectable: boolean }) {
  const [id, setId] = useState(items[0].id)
  const reduceMotion = useReducedMotion()
  // Cycles through the problems every few seconds until the visitor hovers, focuses or picks one; never with reduced motion
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto || reduceMotion) return
    const timer = setInterval(() => setId((cur) => items[(items.findIndex((p) => p.id === cur) + 1) % items.length].id), CYCLE_MS)
    return () => clearInterval(timer)
  }, [auto, reduceMotion, items])
  const problem = items.find((p) => p.id === id)!

  function price() {
    window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: [id] }))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById("estimate")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
  }

  // One problem's panel: its detail, what we help with, and the next step
  function detail(p: Problem) {
    const o = PRICING.outcomes[p.id as keyof typeof PRICING.outcomes]
    return (
      <div className="flex h-full flex-col gap-5">
        <p className="text-base leading-relaxed text-muted">{p.detail}</p>
        <div className="space-y-3 border-t border-line pt-5">
          <h3 className="text-lg font-bold text-accent-ink">What I&apos;d set up for you</h3>
          <ul className="space-y-2">
            {o.includes.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-fg">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          {selectable && (
            <p className="text-sm text-muted">
              Usually delivered as: {PRICING.services[o.service].title}, setup from {inr(PRICING.services[o.service].setup)}.
            </p>
          )}
        </div>
        <div className="mt-auto">
          {selectable ? (
            <button type="button" onClick={price} className="btn btn-primary btn-sm">
              Price this <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <a href="#before-you-reach-out" className="btn btn-primary btn-sm">
              What to know before you reach out <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      onMouseEnter={() => setAuto(false)}
      onFocus={() => setAuto(false)}
    >
      <ul role="radiogroup" aria-label="Your biggest problem" className="flex flex-col divide-y divide-line border border-line bg-white dark:bg-surface">
        {items.map((p, i) => {
          const on = p.id === id
          return (
            <li key={p.id} className="flex-1">
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setId(p.id)}
                className={`group relative flex h-full w-full items-center gap-4 px-5 py-4 text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink ${on ? "bg-accent/10" : "hover:bg-fg/5"}`}
              >
                <span className={`absolute inset-y-0 left-0 w-1 bg-accent transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                <span className={`pt-0.5 text-sm font-semibold tabular-nums transition-colors ${on ? "text-accent-ink" : "text-muted group-hover:text-accent-ink"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-base leading-snug text-fg ${on ? "font-semibold" : "font-medium"}`}>&ldquo;{p.quote}&rdquo;</span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Every problem's panel is laid out in the same cell, hidden, so the card is always as tall as the tallest one */}
      <div className="grid border border-line bg-white dark:bg-surface p-5 sm:p-6" aria-live="polite">
        {items.map((p) => (
          <div key={p.id} aria-hidden="true" className="invisible col-start-1 row-start-1 h-full">
            {detail(p)}
          </div>
        ))}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="col-start-1 row-start-1 h-full"
          >
            {detail(problem)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
