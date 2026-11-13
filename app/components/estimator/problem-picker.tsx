"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { OTHER_MAX } from "./estimate"

type Option = { id: string; label: string }

// "What is your primary problem?" as a dropdown: one pick, and the menu closes once it is made. "Other" opens a box
// for the visitor to describe it. `other` is undefined until Other is chosen.
export default function ProblemPicker({
  options,
  value,
  other,
  onChange,
}: {
  options: readonly Option[]
  value: string[]
  other: string | undefined
  onChange: (value: string[], other: string | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", away)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", away)
      document.removeEventListener("keydown", esc)
    }
  }, [open])

  // Choosing an option replaces the previous pick and closes the menu; choosing the same one again clears it
  function choose(id: string) {
    onChange(value.includes(id) ? [] : [id], undefined)
    setOpen(false)
  }
  function chooseOther() {
    onChange([], other === undefined ? "" : undefined)
    setOpen(false)
  }

  const labels = [...value.map((id) => options.find((o) => o.id === id)?.label ?? id), ...(other === undefined ? [] : ["Other"])]

  return (
    <div className="space-y-3">
      <div ref={root} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-3 border border-line bg-bg/40 px-4 py-3 text-left text-sm text-fg transition-colors hover:border-accent/60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
        >
          <span className={labels.length ? "" : "text-muted"}>{labels.length ? labels.join(" · ") : "Select your primary problem"}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {open && (
          <ul role="listbox" className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-auto border border-line bg-surface dark:bg-[var(--panel-2)] divide-y divide-line">
            {[...options, { id: "other", label: "Other (describe it yourself)" }].map((o) => {
              const on = o.id === "other" ? other !== undefined : value.includes(o.id)
              return (
                <li key={o.id} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => (o.id === "other" ? chooseOther() : choose(o.id))}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm text-fg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink ${on ? "bg-accent/10" : "hover:bg-fg/5"}`}
                  >
                    {o.label}
                    {on && <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {other !== undefined && (
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted">Describe the problem in your own words</span>
          <textarea
            value={other}
            onChange={(e) => onChange(value, e.target.value)}
            maxLength={OTHER_MAX}
            rows={4}
            placeholder="For example: we re-type every dispatch slip into Tally, and month-end takes a week."
            className="w-full border border-line bg-bg/50 px-3.5 py-3 text-sm text-fg placeholder:text-muted/70 transition-colors focus:outline-none focus:border-accent-ink focus:ring-2 focus:ring-accent-ink/20"
          />
        </label>
      )}
    </div>
  )
}
