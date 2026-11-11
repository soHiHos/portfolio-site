// One switch for "open to new work": the chip, hero/contact status lines, nav pill and the ask assistant all read it.
// Set AVAILABLE_FOR_WORK=false (or 0 / no / off) in .env.local or Vercel to show "fully booked". Unset means available.
export const AVAILABLE_FOR_WORK = !["false", "0", "no", "off"].includes((process.env.AVAILABLE_FOR_WORK ?? "").trim().toLowerCase())
