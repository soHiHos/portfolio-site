"use client"

import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"

// Toggles the `dark` class on <html> and persists it. Where the View Transitions API
// is available, the new theme wipes out in a circle from the button.
export default function ThemeToggle() {
  function applyTheme(dark: boolean) {
    document.documentElement.classList.toggle("dark", dark)
    try {
      localStorage.setItem("theme", dark ? "dark" : "light")
    } catch {}
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

    document.startViewTransition(() => flushSync(() => applyTheme(next))).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      )
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle dark theme"
      className="group flex items-center justify-center w-9 h-9 shrink-0 text-muted transition-colors duration-300 hover:text-fg hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-accent cursor-pointer"
    >
      {/* Icon button: the sun turns and the moon tilts on hover */}
      <Sun className="w-4 h-4 dark:hidden transition-transform duration-500 motion-safe:group-hover:rotate-90" />
      <Moon className="w-4 h-4 hidden dark:block transition-transform duration-500 motion-safe:group-hover:-rotate-12" />
    </button>
  )
}
