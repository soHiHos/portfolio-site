"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Spinner } from "./media-spinner"

// Subscribes to a media query; false on the server so the first render matches
function useMedia(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", notify)
      return () => mq.removeEventListener("change", notify)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

// Touch screens: only one tile plays at a time, the one nearest the middle of the screen that is mostly in view.
// Once scrolling has settled the previews take turns; the rest show their poster. A looping image can't be paused,
// so a tile plays by mounting its image (restarting the loop) and stops by unmounting it.
const tiles = new Set<HTMLElement>()
const listeners = new Set<() => void>()
let playing: HTMLElement | null = null
let timer: ReturnType<typeof setTimeout> | undefined

function choose() {
  const middle = window.innerHeight / 2
  let best: HTMLElement | null = null
  let bestDistance = Infinity
  for (const el of tiles) {
    const r = el.getBoundingClientRect()
    const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
    if (shown < Math.min(r.height, window.innerHeight) * 0.5) continue
    const distance = Math.abs((r.top + r.bottom) / 2 - middle)
    if (distance < bestDistance) { best = el; bestDistance = distance }
  }
  if (best === playing) return
  playing = best
  listeners.forEach((notify) => notify())
}
function settle() {
  clearTimeout(timer)
  timer = setTimeout(choose, 150)
}
function register(el: HTMLElement) {
  if (tiles.size === 0) {
    window.addEventListener("scroll", settle, { passive: true })
    window.addEventListener("resize", settle)
  }
  tiles.add(el)
  settle()
  return () => {
    tiles.delete(el)
    if (playing === el) playing = null
    if (tiles.size === 0) {
      clearTimeout(timer)
      window.removeEventListener("scroll", settle)
      window.removeEventListener("resize", settle)
    }
  }
}
function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => { listeners.delete(notify) }
}

// Project preview over the poster. Where there is a mouse, it is a muted video that plays only while its parent
// (the tile or frame) is hovered or focused, and goes back to the poster on leave; preload="none", so the file
// downloads on the first hover, not on page load, and a spinner shows while it loads or buffers. On touch screens
// and phones there is no hover, so a short looping animated WebP (the same name as the video, .webp) plays by
// itself instead, one tile at a time (see above). Nothing animates for reduced motion.
export default function HoverVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const reduce = useMedia("(prefers-reduced-motion: reduce)")
  const touch = useMedia("(hover: none), (max-width: 639px)")
  if (reduce) return null
  return touch ? <LoopingPreview src={src.replace(/\.mp4$/i, ".webp")} className={className} /> : <VideoPreview src={src} poster={poster} className={className} />
}

function LoopingPreview({ src, className }: { src: string; className?: string }) {
  const marker = useRef<HTMLSpanElement>(null) // hidden; its parent is the tile that is measured
  const [failed, setFailed] = useState(false)
  const active = useSyncExternalStore(subscribe, () => playing !== null && playing === marker.current?.parentElement, () => false)

  useEffect(() => {
    const tile = marker.current?.parentElement
    return tile ? register(tile) : undefined
  }, [])

  return (
    <>
      <span ref={marker} className="hidden" aria-hidden="true" />
      {active && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" aria-hidden="true" decoding="async" className={className} onError={() => setFailed(true)} />
      )}
    </>
  )
}

function VideoPreview({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const video = ref.current
    const parent = video?.parentElement
    if (!video || !parent) return
    const play = () => {
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
