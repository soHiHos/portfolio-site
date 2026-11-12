"use client"

import { useEffect } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { istIsDark, savedTheme, saveTheme } from "./ist-theme"

// Toggles the `dark` class on <html>. The choice holds until the next 7am/6pm IST switch (ist-theme.ts), and while
// the page is open the theme follows IST by itself: checked every minute and whenever the tab comes back into view.
// Where the View Transitions API is available, a manual change wipes out in a circle from the button.
export default function ThemeToggle() {
  useEffect(() => {
    const sync = () => document.documentElement.classList.toggle("dark", savedTheme() ?? istIsDark())
    const interval = setInterval(sync, 60_000)
    document.addEventListener("visibilitychange", sync)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])

  function applyTheme(dark: boolean) {
    document.documentElement.classList.toggle("dark", dark)
    saveTheme(dark)
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const next = !document.documentElement.classList.contains("dark")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next)
      return
    }

    const x = e.clientX
    const y = e.clientY
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    // Frosted chrome goes solid for the length of the wipe (globals.css), set before the old snapshot is taken
    const root = document.documentElement
    root.setAttribute("data-theme-switching", "")
    const transition = document.startViewTransition(() => flushSync(() => applyTheme(next)))
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      )
    })
    transition.finished.finally(() => root.removeAttribute("data-theme-switching"))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle dark theme"
      className="group flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 shrink-0 text-muted transition-colors duration-300 hover:text-fg hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer"
    >
      {/* Icon button: the sun turns and the moon tilts on hover */}
      <Sun className="w-4 h-4 dark:hidden transition-transform duration-500 motion-safe:group-hover:rotate-90" />
      <Moon className="w-4 h-4 hidden dark:block transition-transform duration-500 motion-safe:group-hover:-rotate-12" />
    </button>
  )
}
