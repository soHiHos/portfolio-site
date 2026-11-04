import { PRICING } from "../../content/pricing"
import { GST_PERCENT, inr } from "../estimator/estimate"

// Plain-view prices for the four service categories (ids from services.json), shown on the home tiles and the
// services page so nobody has to fill in the estimator to see them. Everything comes from content/pricing.ts.
// Each category has two plans: a monthly licence (lower setup, I keep the code) and owning the code (buyout).
// `headline` is the short "from" price on the services page cards; `rows` is the breakdown shown on the services page
export type PriceRow = { label: string; value: string; hint: string }
export type CategoryPrice = { headline: string; rows: PriceRow[]; note?: string }

// Every price is a "from" price; the proposal follows the form and a free call
export const RETAINER_NOTE = `All prices are "from" prices and exclude GST, which is added at ${GST_PERCENT}%. Setup is paid in three milestones; monthly fees start at go-live and are billed in advance by UPI. Larger systems are quoted. Your proposal follows my reply to your form.`

export const PLANS = [
  { id: "monthly", label: "Monthly licence", blurb: "Lower setup, then a monthly fee. I host and maintain it and keep the code." },
  { id: "own", label: "Own the code", blurb: "Pay once and receive the code. No minimum period, leave any time." },
] as const

export type PlanId = (typeof PLANS)[number]["id"]

const S = PRICING.services
const T = PRICING.terms

const AI_NOTE = `AI, API and WhatsApp message usage up to ${inr(PRICING.usageIncluded)} a month is included. Above that, billed at cost plus ${Math.round(PRICING.usageMarkup * 100)}%, with your approval first.`
const CHANGES_NOTE = `Changes to an existing system are quoted per request: small from ${inr(PRICING.changes.small)}, medium from ${inr(PRICING.changes.medium)}. Plan clients get ${Math.round(PRICING.changes.planDiscount * 100)}% off.`

const monthly = (service: { setup: number; licence: number | null }, note?: string): CategoryPrice => ({
  headline: `From ${inr(service.setup)} setup + ${inr(service.licence!)}/month`,
  rows: [
    { label: "Setup", value: `from ${inr(service.setup)}`, hint: "One-time, paid in three milestones: signing, demo approval and go-live. Larger systems quoted" },
    { label: "Monthly licence", value: `from ${inr(service.licence!)}/month`, hint: `Minimum ${T.minMonths} months from go-live, then ${T.noticeDays} days' notice. Hosting, uptime, backups, bug fixes and security patches included` },
  ],
  note: [note, CHANGES_NOTE].filter(Boolean).join(" "),
})

const own = (service: { buyout: number | null; retainer: number }, note?: string): CategoryPrice => ({
  headline: `From ${inr(service.buyout!)}`,
  rows: [
    { label: "One-time price", value: `from ${inr(service.buyout!)}`, hint: "No minimum, leave any time. Larger systems quoted" },
    { label: "You get", value: "The code", hint: `The client-specific code and a data export, after full payment, with a ${T.bugFixDays}-day free bug-fix window. The reusable core stays licensed for your own business` },
    { label: "Hosting retainer (optional)", value: `from ${inr(service.retainer)}/month`, hint: "If you want me to keep hosting and maintaining it. Month to month" },
  ],
  note: [note, CHANGES_NOTE].filter(Boolean).join(" "),
})

// The marketing site costs the same on both plans: the code is handed over by default
const site: CategoryPrice = {
  headline: `From ${inr(S.website.setup)}`,
  rows: [
    { label: "Setup", value: `from ${inr(S.website.setup)}`, hint: `Launch from ${inr(PRICING.siteTiers.launch)}, Business from ${inr(PRICING.siteTiers.business)}, Signature from ${inr(PRICING.siteTiers.signature)}. Code handed over, included` },
    { label: "Hosting and care (optional)", value: `${inr(S.website.retainer)}/month`, hint: "Hosting, backups, security updates, fixes and a monthly report. No minimum. Design and content changes quoted separately; domain at cost" },
  ],
}

export const PLAN_PRICES: Record<PlanId, Record<string, CategoryPrice>> = {
  monthly: {
    "ai-automations": monthly(S.automation, AI_NOTE),
    "custom-software": monthly(S.erp),
    "mobile-apps": monthly(S.app),
    websites: site,
  },
  own: {
    "ai-automations": own(S.automation, AI_NOTE),
    "custom-software": own(S.erp),
    "mobile-apps": own(S.app),
    websites: site,
  },
}

// The home tiles show the same three lines on every card, so they can be read across: setup, the monthly fee, and
// the price to own the code. All "from" prices.
export const HOME_PRICES: Record<string, { label: string; value: string }[]> = {
  "ai-automations": homeRows(S.automation),
  "custom-software": homeRows(S.erp),
  "mobile-apps": homeRows(S.app),
  websites: [
    { label: "Setup", value: `from ${inr(S.website.setup)}` },
    { label: "Care, optional", value: `${inr(S.website.retainer)}/mo` },
    { label: "Own the code", value: "Included" },
  ],
}

function homeRows(service: { setup: number; licence: number | null; buyout: number | null }) {
  return [
    { label: "Setup", value: `from ${inr(service.setup)}` },
    { label: "Monthly licence", value: `from ${inr(service.licence!)}` },
    { label: "Own the code", value: `from ${inr(service.buyout!)}` },
  ]
}
