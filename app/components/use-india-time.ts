"use client"

import { useEffect, useState } from "react"

// Current time in India as HH:MM (24-hour), refreshed every 10 seconds. "--:--" until mounted, so the
// server and first client render match.
export function useIndiaTime() {
  const [time, setTime] = useState("--:--")
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    const tick = () => setTime(format.format(new Date()))
    const first = setTimeout(tick, 0)
    const interval = setInterval(tick, 10_000)
    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [])
  return time
}
