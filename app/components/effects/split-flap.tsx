"use client"

import { useEffect, useRef, useState } from "react"

// Order a real split-flap drum cycles through. Characters outside it are shown immediately.
const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-./"

function FlapChar({ char, delay }: { char: string; delay: number }) {
  const [shown, setShown] = useState(char)
  const shownRef = useRef(" ") // first run flips up from blank

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const target = ALPHABET.indexOf(char)
    let idx = ALPHABET.indexOf(shownRef.current)
    let timer: ReturnType<typeof setTimeout>

    function step() {
      if (reduceMotion || target === -1 || idx === -1 || idx === target) {
        shownRef.current = char
        setShown(char)
        return
      }
      idx = (idx + 1) % ALPHABET.length
      shownRef.current = ALPHABET[idx]
      setShown(ALPHABET[idx])
      if (idx !== target) timer = setTimeout(step, 45)
    }

    timer = setTimeout(step, delay)
    return () => clearTimeout(timer)
  }, [char, delay])

  return (
    <span className="flap">
      <span key={shown} className="flap-char">{shown === " " ? " " : shown}</span>
    </span>
  )
}

// Renders `text` as a row of split-flap tiles that flip into place, padded/cut to `length`.
// Tiles are sized in em, so set font-size on a parent to scale them.
export default function SplitFlap({ text, length, delay = 0, className }: { text: string; length?: number; delay?: number; className?: string }) {
  const chars = (length ? text.slice(0, length).padEnd(length) : text).toUpperCase().split("")

  return (
    <span className={`inline-flex gap-[0.08em] ${className || ""}`} aria-label={text}>
      <span className="contents" aria-hidden="true">
        {chars.map((char, i) => (
          <FlapChar key={i} char={char} delay={delay + i * 30} />
        ))}
      </span>
    </span>
  )
}
