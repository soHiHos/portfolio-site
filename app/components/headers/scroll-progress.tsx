"use client"

import { useEffect, useState } from "react"

// Thin accent line along the bottom of the nav that fills with page progress. Phones and tablets only.
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="lg:hidden pointer-events-none absolute inset-x-8 bottom-0 h-px bg-fg/10" aria-hidden="true">
      <span className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${progress * 100}%` }} />
    </div>
  )
}
