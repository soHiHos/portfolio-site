"use client"

import { useEffect, useRef, useState } from "react"
import { Spinner } from "./media-spinner"

// Muted preview that plays only while its parent (the tile or frame) is hovered or focused, and goes back to
// the poster on leave. preload="none", so the file downloads on the first hover, not on page load; a spinner
// shows while it loads or buffers. Never plays for reduced motion; touch screens (no hover) just show the poster.
export default function HoverVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const video = ref.current
    const parent = video?.parentElement
    if (!video || !parent) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const play = () => {
      if (reduce.matches) return
      setLoading(video.readyState < 3)
      video.play().catch(() => setLoading(false))
    }
    const stop = () => {
      video.load() // pauses and shows the poster again
      setLoading(false)
    }
    parent.addEventListener("mouseenter", play)
    parent.addEventListener("mouseleave", stop)
    parent.addEventListener("focusin", play)
    parent.addEventListener("focusout", stop)
    return () => {
      parent.removeEventListener("mouseenter", play)
      parent.removeEventListener("mouseleave", stop)
      parent.removeEventListener("focusin", play)
      parent.removeEventListener("focusout", stop)
    }
  }, [])

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className={className}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
      />
      {loading && <Spinner />}
    </>
  )
}
