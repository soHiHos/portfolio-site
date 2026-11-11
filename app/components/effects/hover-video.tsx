"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
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

// Data Saver on, or a 2G/3G connection: phones keep the still image, since each looping preview is 1-2 MB.
// The Network Information API is Chromium-only (most Android phones); elsewhere this stays false.
type Connection = { saveData?: boolean; effectiveType?: string }
function useLightData() {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const c = (navigator as Navigator & { connection?: Connection }).connection
      return !!c && (c.saveData === true || /2g|3g/.test(c.effectiveType ?? ""))
    },
    () => false
  )
}

// Touch screens: only one tile plays at a time, the one nearest the middle of the screen that is mostly in view.
// Once scrolling has settled the previews take turns; the rest are paused and hidden, showing the image under them.
// Nothing plays until the first scroll: a video starting by itself at load would become the page's Largest Contentful
// Paint (its first frame replaces the same-size image), tying that metric to a 1-2 MB download.
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

// Project preview over the tile's image. Where there is a mouse, it is a muted video that plays only while its parent
// (the tile or frame) is hovered or focused, and goes back to the image on leave; preload="none", so the file
// downloads on the first hover, not on page load, and a spinner shows while it loads or buffers. On touch screens
// and phones there is no hover, so the same video loops by itself instead, one tile at a time (see above). Nothing animates for reduced motion.
// No poster: the video stays invisible until it is playing, so the image underneath shows (a poster would also be
// downloaded straight away, ignoring the image's lazy loading).
export default function HoverVideo({ src, className }: { src: string; className?: string }) {
  const reduce = useMedia("(prefers-reduced-motion: reduce)")
  const touch = useMedia("(hover: none), (max-width: 639px)")
  const lightData = useLightData()
  if (reduce || (touch && lightData)) return null
  return touch ? <LoopingPreview src={src} className={className} /> : <VideoPreview src={src} className={className} />
}

// Loops with a soft dip instead of a hard cut: the last moment dims the video, and it restarts already dimmed and
// brightens again, so the loop feels continuous. The transition is inline because the tile's own transition-transform
// class would override a transition-filter class. Needs the video without the `loop` attribute.
// Also keeps the video invisible except while it plays (onPlaying shows it, onPause hides it).
const FADE_MS = 400
const DIM = 0.35
function useFadeLoop(ref: React.RefObject<HTMLVideoElement | null>) {
  const [dim, setDim] = useState(false)
  const [shown, setShown] = useState(false)
  const reset = useCallback(() => setDim(false), [])
  const onTimeUpdate = () => {
    const video = ref.current
    if (video && video.duration && video.duration - video.currentTime < FADE_MS / 1000) setDim(true)
  }
  const onEnded = () => {
    const video = ref.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
    setDim(false)
  }
  return {
    onEnded,
    onTimeUpdate,
    onPlaying: () => setShown(true),
    onPause: () => setShown(false),
    reset,
    fadeStyle: { filter: `brightness(${dim ? DIM : 1})`, opacity: shown ? 1 : 0, transition: `filter ${FADE_MS}ms ease, opacity 300ms ease, transform 500ms` },
  }
}

function LoopingPreview({ src, className }: { src: string; className?: string }) {
  const marker = useRef<HTMLSpanElement>(null) // hidden; its parent is the tile that is measured
  const ref = useRef<HTMLVideoElement>(null)
  const active = useSyncExternalStore(subscribe, () => playing !== null && playing === marker.current?.parentElement, () => false)
  const { onEnded, onTimeUpdate, onPlaying, onPause, reset, fadeStyle } = useFadeLoop(ref)

  useEffect(() => {
    const tile = marker.current?.parentElement
    return tile ? register(tile) : undefined
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active) video.play().catch(() => {})
    else {
      reset()
      video.pause() // fires onPause, which hides the video again
      video.currentTime = 0
    }
  }, [active, reset])

  return (
    <>
      <span ref={marker} className="hidden" aria-hidden="true" />
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={className}
        style={fadeStyle}
        onPlaying={onPlaying}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
    </>
  )
}

function VideoPreview({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(false)
  const { onEnded, onTimeUpdate, onPlaying, onPause, reset, fadeStyle } = useFadeLoop(ref)

  useEffect(() => {
    const video = ref.current
    const parent = video?.parentElement
    if (!video || !parent) return
    const play = () => {
      setLoading(video.readyState < 3)
      video.play().catch(() => setLoading(false))
    }
    const stop = () => {
      // Pause and rewind, keeping the buffered data so the next hover starts at once (video.load() would throw it
      // away and download again); pausing hides the video, so the image shows again
      reset()
      video.pause()
      video.currentTime = 0
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
  }, [reset])

  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={className}
        style={fadeStyle}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onPause={onPause}
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false)
          onPlaying()
        }}
      />
      {loading && <Spinner />}
    </>
  )
}
