import { BUYOUT, PRICING, SCALING, SETUP_PAYMENT_TEXT, buyoutPrice, scaledPrices, type ScaledPrices } from "../../content/pricing"
import { inr } from "../estimator/estimate"

// Plain-view prices for the four service categories (ids from services.json), shown on the home tiles and the
// services page so nobody has to fill in the estimator to see them. Everything comes from content/pricing.ts.
// Each category has two plans: a monthly licence (lower setup, I keep the code) and owning the code (buyout).
// `monthly` and `own` are the two price lines on a services page card
// `points`: separate options shown as bullets above the hint (the website care plans)
export type PriceRow = { label: string; hint: string; points?: string[] }
// `price` is the monthly-plan view; `ownPrice` and `ownNote` are the "own the code" view (software cards only)
// `ownFrom` is the buy-outright figure on its own ("from about ₹1,25,000"), for a card already headed "Buy outright"
export type CategoryPrice = { price: string; ownPrice?: string; ownFrom?: string; ownNote?: string; rows: PriceRow[] }

const S = PRICING.services

const T = PRICING.terms
const weeks = (id: keyof typeof S) => `${PRICING.timeline[id][0]}–${PRICING.timeline[id][1]} weeks`
const TIMELINE_HINT = "from the day you've sent your data and approvals"

const INCLUDED = `Hosting, backups and uptime monitoring. Bug fixes, with a reply within ${T.replyUrgentDays} business day for anything urgent. Security updates. Adjustments to what we built for the first ${T.adjustmentDays} days after go-live, then up to ${T.smallChangeHours} hours of small changes every month.`

const service = (id: "automation" | "erp" | "app", moves: string): CategoryPrice => {
  const s = S[id]
  return {
    price: `Setup from ${inr(s.setup)} (one time) + ${inr(s.licence)}/month`,
    ownPrice: `Buy it outright from about ${inr(s.buyout)}`,
    ownFrom: `from about ${inr(s.buyout)}`,
    ownNote: `Quoted after scope. Fees you've paid count toward it. After the purchase, hosting is yours to run, or you can add a maintenance plan from ${inr(s.retainer)}/month, with a ${T.maintenanceMinMonths}-month minimum.`,
    rows: [
      { label: "What's included", hint: INCLUDED },
      { label: "What moves the price", hint: moves },
      { label: "Typical timeline", hint: `${weeks(id)}, ${TIMELINE_HINT}` },
      { label: "Buying outright", hint: `Agreed before you commit. Your setup and ${Math.round(BUYOUT.feeCreditShare * 100)}% of your monthly fees count toward it, down to ${Math.round(BUYOUT.floorShare * 100)}% of the outright price. Afterwards, hosting is yours to run, or add a maintenance plan from ${inr(s.retainer)}/month. The terms have the full rules.` },
    ],
  }
}

// Every price is a "from" price. The marketing site has no monthly plan and no buyout note: the site files are handed
// over after final payment, and the care plan is optional
export const CATEGORY_PRICES: Record<string, CategoryPrice> = {
  "ai-automations": service("automation", "How many workflows, how many systems they connect, and whether they include AI steps. AI usage and WhatsApp messages are billed at cost on your monthly bill."),
  "custom-software": service("erp", "Which modules you need, integrations such as Tally or payments, and how much data we move from your old system. No per-user charges; typically built for 50,000 to 90,000 monthly active users."),
  "mobile-apps": service("app", "Number of screens and user roles, payments, the admin panel, and integrations with your other systems."),
  websites: {
    price: `Build from ${inr(S.website.setup)} (one time)`,
    rows: [
      { label: "What's included", hint: "Your site, built to your brief, with the files handed over after final payment." },
      { label: "What moves the price", hint: `Number of pages, custom design, forms and integrations. Launch from ${inr(PRICING.siteTiers.launch)}, Business from ${inr(PRICING.siteTiers.business)}, Signature from ${inr(PRICING.siteTiers.signature)}.` },
      { label: "Typical timeline", hint: `${weeks("website")}, ${TIMELINE_HINT}` },
      {
        label: "Care plan",
        points: [
          `Base care, from ${inr(S.website.retainer)}/month: hosting, backups, uptime monitoring and one small edit a month.`,
          `Plus care, ${inr(PRICING.siteCareHigher)}/month: adds visitor analytics (who visits, which pages they view, what they click) and traffic reports.`,
        ],
        hint: "Both are optional, with no minimum. If you cancel mid-month, that month is still billed in full.",
      },
    ],
  },
}

// The note under the cards, stated once
export const PRICE_NOTE = `All prices exclude GST (${Math.round(PRICING.gst * 100)}%). Setup is paid in two parts: ${SETUP_PAYMENT_TEXT}. Monthly plans have a ${PRICING.terms.minMonths}-month minimum. AI usage and third-party services such as WhatsApp are billed at cost. UPI accepted.`

// The home tiles show the same three lines on every card, so they can be read across: setup, the monthly fee, and
// the price to own the code. All "from" prices.
export const HOME_PRICES: Record<string, { label: string; value: string }[]> = {
  "ai-automations": homeRows(S.automation),
  "custom-software": homeRows(S.erp),
  "mobile-apps": homeRows(S.app),
  websites: [
    { label: "Setup", value: `from ${inr(S.website.setup)}` },
    { label: "Care, optional", value: `${inr(S.website.retainer)}/mo` },
    { label: "Buy outright", value: "Included" },
  ],
}

// The home tiles' timeline line (not a price, so it shows even while the prices are hidden)
export const HOME_TIMELINES: Record<string, string> = {
  websites: weeks("website"),
  "ai-automations": weeks("automation"),
  "mobile-apps": weeks("app"),
  "custom-software": weeks("erp"),
}

// The prices at three project sizes (from, mid-range, top of the typical range) for a software service, the same
// figures as the PDFs; null for the websites, which have tiers instead
export const CATEGORY_SERVICE: Record<string, "automation" | "app" | "erp" | null> = {
  websites: null,
  "ai-automations": "automation",
  "mobile-apps": "app",
  "custom-software": "erp",
}
export type SizeId = "from" | "mid" | "top"
export const SIZE_LABELS: Record<SizeId, string> = { from: "From size", mid: "Mid-range", top: "Top of the typical range" }
export function sizePrices(categoryId: string): Record<SizeId, ScaledPrices> | null {
  const key = CATEGORY_SERVICE[categoryId]
  if (!key) return null
  const s = S[key]
  const [from, top] = PRICING.typicalRange[key]
  const at = (setup: number) => scaledPrices({ setup: s.setup, licence: s.licence!, buyout: s.buyout!, retainer: s.retainer }, setup)
  return { from: at(from), mid: at((from + top) / 2), top: at(top) }
}

// The entry offer, said the same way as in the estimate PDF
export const AUDIT_OFFER = `A workflow audit and decision report is ${inr(PRICING.audit.price)}: a deeper look at your workflows and data, with a written report you keep whether or not we build. It's fully credited toward setup if you go ahead within ${PRICING.audit.creditDays} days.`

function homeRows(service: { setup: number; licence: number | null; buyout: number | null }) {
  return [
    { label: "Setup", value: `from ${inr(service.setup)}` },
    { label: "Monthly plan", value: `from ${inr(service.licence!)}` },
    { label: "Buy outright", value: `from ${inr(service.buyout!)}` },
  ]
}

// A worked example from the mobile app prices: buying the code a few months in. Used by the FAQ and the terms page.
const EX = PRICING.services.app
const EX_MONTHS = 4
export const BUYOUT_EXAMPLE = `on a mobile app with a ${inr(EX.setup)} setup, a ${inr(EX.licence)} monthly plan and a ${inr(EX.buyout)} outright price, buying outright after ${EX_MONTHS} months costs ${inr(EX.buyout)} − ${inr(EX.setup)} − ${inr(BUYOUT.feeCreditShare * EX_MONTHS * EX.licence)} = ${inr(buyoutPrice({ buyoutFrom: EX.buyout, setupPaid: EX.setup, monthlyFeesPaid: EX_MONTHS * EX.licence }))}.`

// The FAQ lives in JSON, so any figure that comes from PRICING is written as a {{placeholder}} there and filled in here.
// An unknown placeholder throws, so a typo shows up in the build instead of on the page.
const FAQ_VALUES: Record<string, string | number> = {
  minMonths: PRICING.terms.minMonths,
  noticeDays: PRICING.terms.noticeDays,
  adjustmentDays: PRICING.terms.adjustmentDays,
  smallChangeHours: PRICING.terms.smallChangeHours,
  dataFiles: PRICING.terms.dataFiles,
  replyUrgentDays: PRICING.terms.replyUrgentDays,
  replyOtherDays: PRICING.terms.replyOtherDays,
  growthPercent: Math.round(SCALING.monthlyShare * 100),
  creditPercent: Math.round(BUYOUT.feeCreditShare * 100),
  floorPercent: Math.round(BUYOUT.floorShare * 100),
  gst: Math.round(PRICING.gst * 100),
  buyoutExample: BUYOUT_EXAMPLE,
  setupPayment: SETUP_PAYMENT_TEXT,
  validDays: PRICING.validDays,
}

export function fillFaq(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in FAQ_VALUES)) throw new Error(`Unknown FAQ placeholder: ${key}`)
    return String(FAQ_VALUES[key])
  })
}
