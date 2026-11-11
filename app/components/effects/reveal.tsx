"use client"

import { useEffect, useRef } from "react"

// Fades/slides children in when scrolled into view. Styles live in globals.css.
// Content renders visible, so the first screen paints without waiting for JS (that wait was the page's LCP).
// Once hydrated, only blocks still below the fold are hidden, then revealed as they scroll in; blocks already on
// screen are left alone.
export default function Reveal({ children, id, className, delay = 0 }: { children: React.ReactNode; id?: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) return
    el.setAttribute("data-hidden", "")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.removeAttribute("data-hidden")
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} id={id} data-reveal className={className} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
