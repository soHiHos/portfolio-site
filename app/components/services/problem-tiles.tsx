"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { PICK_EVENT } from "../estimator/estimator"

type Problem = { id: string; quote: string; detail: string }

// "Sound familiar?" as joined tiles: the grid draws the outer top/left edge, each tile its own right/bottom
// edge. With the estimator on, visitors pick up to `max` tiles and carry them into it; otherwise they're static.
export default function ProblemTiles({ items, max, selectable }: { items: Problem[]; max: number; selectable: boolean }) {
  const [picked, setPicked] = useState<string[]>([])

  // Picking one more than `max` drops the oldest pick
  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id].slice(-max)))
  }

  function price() {
    window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: picked }))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById("estimate")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
  }

  const tiles = items.map((p, i) => {
    const on = picked.includes(p.id)
    const body = (
      <>
        {/* Accent rule that grows across the top on hover, and stays while picked */}
        <span
          className={`absolute left-0 top-0 h-0.5 bg-accent-2 transition-all duration-500 motion-reduce:transition-none ${on ? "w-full" : "w-0 group-hover:w-full"}`}
          aria-hidden="true"
        />
        <span className="mb-4 flex items-center justify-between">
          <span className={`text-sm font-semibold tabular-nums transition-colors duration-300 ${on ? "text-accent-ink" : "text-muted group-hover:text-accent-ink"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          {selectable && (
            <span
              className={`flex h-5 w-5 items-center justify-center border transition-colors duration-300 ${on ? "border-accent-2 bg-accent-2 text-on-accent-2" : "border-line text-transparent group-hover:border-accent-2"}`}
              aria-hidden="true"
            >
              <Check className="h-3.5 w-3.5" />
            </span>
          )}
        </span>
        {/* Every quote gets two lines, so the details line up across a row */}
        <span className="mb-2 block min-h-[2lh] text-base font-semibold leading-snug text-fg">&ldquo;{p.quote}&rdquo;</span>
        <span className="block text-sm leading-relaxed text-muted">{p.detail}</span>
      </>
    )
    const tile = `group relative flex h-full w-full flex-col overflow-hidden p-6 text-left transition-colors duration-300 ${on ? "bg-accent-2/10" : "bg-surface hover:bg-bg"}`
    return (
      <li key={p.id} className="border-r border-b border-line">
        {selectable ? (
          <button
            type="button"
            aria-pressed={on}
            onClick={() => toggle(p.id)}
            className={`${tile} cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink`}
          >
            {body}
          </button>
        ) : (
          <div className={tile}>{body}</div>
        )}
      </li>
    )
  })

  return (
    <div className="space-y-4">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-line">{tiles}</ul>
      {selectable && (
        <div className="flex flex-wrap items-center gap-4" aria-live="polite">
          <p className="text-sm text-muted">
            {picked.length === 0 ? `Pick up to ${max} that sound like you.` : `${picked.length} of ${max} picked.`}
          </p>
          {picked.length > 0 && (
            <button type="button" onClick={price} className="btn btn-primary btn-sm">
              Price {picked.length === 1 ? "this" : "these"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
