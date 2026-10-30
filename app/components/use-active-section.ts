"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

// Every section id used across the pages, in page order. The hook only tracks ids present on the
// current page, and re-scans after client-side navigation (the header persists across pages).
export const SECTION_IDS = ["work", "services", "about", "collaborators", "research", "contact", "all-projects"]

// Returns the id of the last section whose top has scrolled past the header, or null above them all
export function useActiveSection(ids: string[] = SECTION_IDS): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const offset = 120 // px from the top of the viewport, roughly the header's height

    function updateActiveId() {
      let current: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= offset) current = el.id
      }
      setActiveId(current)
    }

    updateActiveId()
    window.addEventListener("scroll", updateActiveId, { passive: true })
    window.addEventListener("resize", updateActiveId)
    return () => {
      window.removeEventListener("scroll", updateActiveId)
      window.removeEventListener("resize", updateActiveId)
    }
  }, [ids, pathname])

  return activeId
}
