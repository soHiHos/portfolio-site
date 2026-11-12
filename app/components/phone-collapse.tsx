"use client"

import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"

// Phones (below sm): a toggle that shows or hides part of a card, so a stack of cards stays short. From sm the
// toggle is gone and the content always shows. The wrapper is display: contents, so its children stay items of the
// card's own grid (subgrid alignment on larger screens is unaffected). The toggle sits above a card's stretched link.
export default function PhoneCollapse({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 flex w-full cursor-pointer items-center justify-between gap-3 border-t border-line pt-3 text-sm font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink sm:hidden"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div id={id} className={open ? "contents" : "max-sm:hidden sm:contents"}>
        {children}
      </div>
    </>
  )
}
