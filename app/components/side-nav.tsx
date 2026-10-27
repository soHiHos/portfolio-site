"use client"

import { useEffect, useRef, useState } from "react"
import { useActiveSection } from "./use-active-section"

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "partners", label: "Partners" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
]
const IDS = SECTIONS.map((s) => s.id)

// Floating in-page section nav for the home page (right edge): one tick per section, top to bottom.
// The current section's tick is long and accent with its label shown; other labels slide in on hover.
// Hidden over the hero (appears once Work reaches the top). Vertically centred on the screen, but never
// lower than just above the floating contact button, which rises with the footer (--footer-lift) on the
// last sections. While the contact card is open it slides left beside it, but only if the two would
// actually overlap (see globals.css). Large screens only.
//
// `bottom` places the nav's centre (translate-y-1/2 shifts it down by half its height): the larger of
// mid-screen and button top (1.75rem offset + 4rem button + lift) + 1rem gap + half the nav (7rem).
// The nav is 14rem tall because every item is h-8 — keep ITEM_REM in sync if that changes.
const ITEM_REM = 2
const HALF_NAV_REM = (SECTIONS.length * ITEM_REM) / 2
const BOTTOM = `max(50%, calc(${1.75 + 4 + 1 + HALF_NAV_REM}rem + var(--footer-lift, 0px)))`

export default function SideNav() {
  const active = useActiveSection(IDS)
  const visible = active !== null
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
      className={`side-nav hidden lg:block fixed right-12 translate-y-1/2 z-40 transition-[opacity,transform,translate] duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"
      }`}
      style={{ bottom: BOTTOM }}
    >
      <ul className="flex flex-col items-end">
        {SECTIONS.map((section) => {
          const isActive = section.id === active
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex h-8 items-center justify-end gap-3 focus:outline-none"
              >
                <span
                  className={`rounded-md bg-bg/80 px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-300 motion-reduce:transition-none ${
                    isActive
                      ? "opacity-100 text-fg"
                      : "opacity-0 text-muted motion-safe:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                  }`}
                >
                  {section.label}
                </span>
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    isActive ? "w-8 bg-accent" : "w-4 bg-fg/30 group-hover:w-6 group-hover:bg-fg/70 group-focus-visible:w-6 group-focus-visible:bg-accent"
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
