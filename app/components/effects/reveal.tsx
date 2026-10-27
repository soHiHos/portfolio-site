"use client"

import { useEffect, useRef } from "react"

// Fades/slides children in when scrolled into view. Styles live in globals.css.
export default function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "")
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-reveal className={className} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
