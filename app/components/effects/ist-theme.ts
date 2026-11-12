// The theme follows the time of day in India: light 7am-6pm IST, dark otherwise, for every visitor wherever they are.
// IST is a fixed UTC+5:30 with no daylight saving, so plain arithmetic on the UTC clock is enough.
// A manual toggle holds only until the next switch (saved as `theme` + `themeUntil`), then IST takes over again.
// The inline script in app/layout.tsx applies the same rule before paint — keep the two in sync.

const HOUR = 3_600_000
const DAY = 24 * HOUR
const IST_OFFSET = 5.5 * HOUR
const LIGHT_FROM = 7 * HOUR
const DARK_FROM = 18 * HOUR

const sinceIstMidnight = (now: number) => (now + IST_OFFSET) % DAY

export function istIsDark(now = Date.now()) {
  const t = sinceIstMidnight(now)
  return t < LIGHT_FROM || t >= DARK_FROM
}

// Timestamp of the next 7am or 6pm in IST
export function nextIstSwitch(now = Date.now()) {
  const t = sinceIstMidnight(now)
  const at = t < LIGHT_FROM ? LIGHT_FROM : t < DARK_FROM ? DARK_FROM : DAY + LIGHT_FROM
  return now - t + at
}

// The visitor's manual choice, if it hasn't expired yet
export function savedTheme(now = Date.now()): boolean | null {
  try {
    const theme = localStorage.getItem("theme")
    if (theme && Number(localStorage.getItem("themeUntil")) > now) return theme === "dark"
  } catch {}
  return null
}

export function saveTheme(dark: boolean, now = Date.now()) {
  try {
    localStorage.setItem("theme", dark ? "dark" : "light")
    localStorage.setItem("themeUntil", String(nextIstSwitch(now)))
  } catch {}
}

export const themeScript = `(function(){try{var n=Date.now(),H=36e5,t=(n+5.5*H)%(24*H),d=t<7*H||t>=18*H,s=localStorage.getItem('theme');if(s&&+localStorage.getItem('themeUntil')>n)d=s==='dark';if(d)document.documentElement.classList.add('dark')}catch(e){}})()`
