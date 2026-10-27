"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

// "Go to top" button, centred at the bottom of the screen. Appears once the first screen (the hero
// on the home page) has been scrolled past. A frosted square button whose accent outline traces round
// with page progress; on hover it fills with the accent and the arrow nudges up.
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setVisible(window.scrollY > window.innerHeight * 0.9)
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    const first = setTimeout(update, 0)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      clearTimeout(first)
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  function goTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Go to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed left-1/2 -translate-x-1/2 bottom-5 z-50 flex w-12 h-12 items-center justify-center border border-line bg-bg/60 backdrop-blur-xl text-fg transition-all duration-300 hover:bg-accent hover:border-accent hover:text-on-accent motion-safe:hover:-translate-y-0.5 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        visible ? "opacity-100" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Progress outline: traces clockwise from the top-left corner (pathLength 1 = the full perimeter) */}
      <svg viewBox="0 0 48 48" className="absolute -inset-px pointer-events-none" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
      </svg>
      <ArrowUp className="relative w-5 h-5 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5" aria-hidden="true" />
    </button>
  )
}
