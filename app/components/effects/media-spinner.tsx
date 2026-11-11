"use client"

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react"

// Centred spinner for a frame that's still loading. Place it inside a `relative` parent; it ignores clicks.
export function Spinner() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center" role="status" aria-label="Loading">
      <span className="h-7 w-7 rounded-full border-2 border-accent/25 border-t-accent motion-safe:animate-spin" />
    </span>
  )
}

// An <img> that shows the spinner until it has loaded. Its parent must be `relative` (every image frame here is).
// Checks `complete` on mount too, since a cached image can finish before React hydrates and never fire onLoad.
// Lazy by default so phones only download images as they scroll near them; pass loading="eager" above the fold.
// `mobileSrc` swaps in a phone-size image below 640px (the same breakpoint HoverVideo treats as a phone).
export default function LoadImg({ alt, mobileSrc, loading = "lazy", decoding = "async", ...props }: ImgHTMLAttributes<HTMLImageElement> & { alt: string; mobileSrc?: string }) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  const img = <img ref={ref} alt={alt} loading={loading} decoding={decoding} {...props} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} />
  return (
    <>
      {mobileSrc ? (
        <picture>
          <source media="(max-width: 639px)" srcSet={mobileSrc} />
          {img}
        </picture>
      ) : img}
      {!loaded && <Spinner />}
    </>
  )
}
