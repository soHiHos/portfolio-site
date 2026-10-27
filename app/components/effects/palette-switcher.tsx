"use client"

import { useEffect, useState } from "react"

// TEMPORARY: compares light-theme palettes. Once one is picked, delete this component, its line in
// layout.tsx, the palette bit of the theme script in layout.tsx, and the [data-palette] block in globals.css.
const PALETTES = [
  { id: "latte", label: "Latte", swatch: ["#e2ddd5", "#fbf5ea", "#f59e0b"] },
  { id: "navy", label: "Navy & Turquoise", swatch: ["#f1ebdd", "#ffffff", "#2ec4b6"] },
]

export default function PaletteSwitcher() {
  const [active, setActive] = useState("latte")

  useEffect(() => {
    const saved = document.documentElement.getAttribute("data-palette")
    // Sync with the value the inline script restored before paint
    const timer = setTimeout(() => saved && PALETTES.some((p) => p.id === saved) && setActive(saved), 0)
    return () => clearTimeout(timer)
  }, [])

  function pick(id: string) {
    setActive(id)
    const root = document.documentElement
    if (id === "latte") root.removeAttribute("data-palette")
    else root.setAttribute("data-palette", id)
    try {
      localStorage.setItem("palette", id)
    } catch {}
  }

  return (
    <div className="dark:hidden fixed bottom-4 left-4 z-[70] flex flex-wrap items-center gap-1 rounded-xl border border-white/10 panel p-1.5 shadow-xl max-w-[calc(100vw-2rem)]">
      <span className="px-2 text-[9px] font-semibold tracking-[0.2em] text-white/50">LIGHT PALETTE</span>
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => pick(p.id)}
          aria-pressed={active === p.id}
          className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-semibold tracking-wider cursor-pointer transition-colors ${
            active === p.id ? "border-accent bg-accent/15 text-white" : "border-white/10 text-white/60 hover:text-white"
          }`}
        >
          <span className="flex" aria-hidden="true">
            {p.swatch.map((c, i) => (
              <span key={i} className={`w-3 h-3 border border-black/20 ${i === 0 ? "rounded-l-full" : i === p.swatch.length - 1 ? "rounded-r-full" : ""}`} style={{ background: c }} />
            ))}
          </span>
          {p.label}
        </button>
      ))}
    </div>
  )
}
