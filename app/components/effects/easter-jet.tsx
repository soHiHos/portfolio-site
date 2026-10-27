"use client"

import { useEffect, useRef, useState } from "react"
import { Plane } from "lucide-react"

export const EASTER_EVENT = "easter:jet"

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

// Easter egg: the Konami code (or tapping the SK badge in the nav 5 times, which dispatches EASTER_EVENT) sends a
// jet across the screen. Under reduced motion only the "cleared for takeoff" toast shows.
export default function EasterJet() {
  const [flight, setFlight] = useState(0) // bumps to replay the flyby
  const progress = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    function launch() {
      setFlight((n) => n + 1)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setFlight(0), 3500)
    }
    function onKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      progress.current = key === KONAMI[progress.current] ? progress.current + 1 : key === KONAMI[0] ? 1 : 0
      if (progress.current === KONAMI.length) {
        progress.current = 0
        launch()
      }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener(EASTER_EVENT, launch)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(EASTER_EVENT, launch)
      clearTimeout(timer.current)
    }
  }, [])

  if (!flight) return null

  return (
    <div key={flight} className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-live="polite">
      <div className="motion-reduce:hidden absolute top-1/3 animate-[jet-flyby_2.6s_cubic-bezier(0.4,0,0.6,1)_forwards]">
        <div className="relative flex items-center">
          <span className="w-48 h-1 rounded-full bg-gradient-to-l from-accent/70 to-transparent" />
          <Plane className="w-16 h-16 -ml-2 text-accent-ink rotate-45 drop-shadow-[0_8px_12px_rgb(0_0_0/0.3)]" />
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 panel px-4 py-2.5 text-xs font-semibold tracking-[0.25em] text-white shadow-xl">
        <span className="text-accent-ink">✈</span> CLEARED FOR TAKEOFF
      </div>
    </div>
  )
}
