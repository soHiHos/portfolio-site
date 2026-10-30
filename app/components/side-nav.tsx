"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useActiveSection } from "./use-active-section"

export type NavSection = { id: string; label: string }

const HOME_SECTIONS: NavSection[] = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "collaborators", label: "Collaborators" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
]

// Floating in-page section nav (right edge), for the home page by default; other pages pass their own sections.
// One labelled tick per section, top to bottom. The
// current section's tick is long and accent and its label is bold; the others brighten on hover.
// Hidden over the hero (appears once the first section reaches the top). Vertically centred on the screen, but never
// lower than just above the floating contact button, which rises with the footer (--footer-lift) on the
// last sections. While the contact card is open it slides left beside it, but only if the two would
// actually overlap (see globals.css). Large screens only.
//
// `bottom` places the nav's centre (translate-y-1/2 shifts it down by half its height): the larger of
// mid-screen and button top (1.75rem offset + 4rem button + lift) + 1rem gap + half the nav.
// Every item is h-8 and the panel adds py-2 — keep ITEM_REM and PAD_REM in sync if those change.
const ITEM_REM = 2
const PAD_REM = 1

export default function SideNav({ sections = HOME_SECTIONS }: { sections?: NavSection[] }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections])
  const active = useActiveSection(ids)
  const bottom = `max(50%, calc(${1.75 + 4 + 1 + (sections.length * ITEM_REM + PAD_REM) / 2}rem + var(--footer-lift, 0px)))`
  const visible = active !== null
  const activeIndex = Math.max(0, ids.indexOf(active ?? ""))
  const navRef = useRef<HTMLElement>(null)
  const [shifted, setShifted] = useState(false)

  // Re-check overlap with the contact card whenever it opens/closes (header toggles data-contact-open
  // on <html>) and on scroll/resize, since both the card and the nav move with the footer
  useEffect(() => {
    const root = document.documentElement
    function update() {
      const card = document.querySelector("[data-contact-card]")
      if (!navRef.current || !card || !root.hasAttribute("data-contact-open")) return setShifted(false)
      const nav = navRef.current.getBoundingClientRect()
      const box = card.getBoundingClientRect()
      setShifted(nav.bottom > box.top - 8 && nav.top < box.bottom + 8)
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ["data-contact-open"] })
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <nav
      ref={navRef}
      data-shifted={shifted || undefined}
      aria-label="Sections"
      aria-hidden={!visible}
      inert={!visible}
      className={`side-nav hidden lg:block fixed right-6 xl:right-12 translate-y-1/2 px-3 py-2 z-40 transition-[opacity,transform,translate] duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"
      }`}
      style={{ bottom }}
    >
      <ul className="relative flex flex-col items-end">
        {/* A ruler on the right edge: the rail runs from the first tick to the last, fills with the accent
            down to the current section, and a small square marker glides to it */}
        <span className="absolute right-0 top-4 bottom-4 w-px bg-fg/20" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 bg-accent transition-[height] duration-500 ease-out" style={{ height: `${activeIndex * ITEM_REM}rem` }} />
          <span
            className="absolute -left-[3px] -top-[3.5px] h-[7px] w-[7px] bg-accent-2 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
            style={{ transform: `translateY(${activeIndex * ITEM_REM}rem)` }}
          />
        </span>
        {sections.map((section, i) => {
          const isActive = section.id === active
          const passed = i < activeIndex
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex h-8 items-center justify-end gap-3 focus:outline-none"
              >
                <span
                  className={`text-xs whitespace-nowrap transition-[color,translate] duration-300 ${
                    isActive ? "font-semibold text-fg" : "font-medium text-muted group-hover:text-fg motion-safe:group-hover:-translate-x-1 group-focus-visible:text-accent-ink"
                  }`}
                >
                  {section.label}
                </span>
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    isActive ? "w-8 bg-accent" : `w-4 ${passed ? "bg-accent/60" : "bg-fg/45"} group-hover:w-6 group-hover:bg-fg group-focus-visible:w-6 group-focus-visible:bg-accent`
                  }`}
                  aria-hidden="true"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
