// The estimator's questions, answer validation and the estimate itself. Shared by the questionnaire (browser)
// and the lead route (server), so both compute the same figures from the same answers. All prices come from
// content/pricing.ts.

import services from "../../content/services.json"
import { PRICING } from "../../content/pricing"

// The estimator is live once its pricing is reviewed; until then it only runs in `next dev`
export const ESTIMATOR_ON = PRICING.reviewed || process.env.NODE_ENV !== "production"

type OutcomeId = keyof typeof PRICING.outcomes
type TrackingId = "paper" | "excel" | "tally" | "software"
type UsersId = "under50" | "to500" | "to2000" | "more"
type ServiceId = keyof typeof PRICING.services
type AddonId = keyof typeof PRICING.addons

type Option<T extends string> = { id: T; label: string }

const BUSINESSES = [
  { id: "manufacturing", label: "Manufacturing", examples: "job cards, production logs and dispatch slips" },
  { id: "warehouse", label: "Warehouse", examples: "gate passes, stock in and out, and dispatch" },
  { id: "distribution", label: "Distribution", examples: "dealer orders, price tiers and ledgers" },
  { id: "retail", label: "Retail", examples: "daily sales, stock and supplier bills" },
  { id: "other", label: "Other", examples: "your registers, sheets and daily updates" },
] as const

// The six problems from the services page (the last, "custom", is a system built around their workflow)
const OUTCOMES: (Option<OutcomeId> & { quote: string })[] = services.problems.items.map((p) => ({ id: p.id as OutcomeId, label: p.quote, quote: p.quote }))

export const QUESTIONS = {
  business: { title: "What kind of business are you?", options: BUSINESSES as readonly Option<string>[] },
  outcomes: { title: "What is your primary problem?", hint: "Pick the main one, or choose Other and describe it in your own words.", max: 1, options: OUTCOMES },
  tracking: {
    title: "How do you track things today?",
    hint: "Pick all that apply.",
    options: [
      { id: "paper", label: "Paper registers" },
      { id: "excel", label: "Excel or Google Sheets" },
      { id: "tally", label: "Tally" },
      { id: "software", label: "Other software" },
    ] as Option<TrackingId>[],
  },
  users: {
    title: "Roughly how many people will use it?",
    hint: "Your team, plus any dealers or customers who log in.",
    options: [
      { id: "under50", label: "Under 50" },
      { id: "to500", label: "50–500" },
      { id: "to2000", label: "500–2,000" },
      { id: "more", label: "More than 2,000" },
    ] as Option<UsersId>[],
  },
  extras: {
    title: "Do you need a mobile app or a website too?",
    hint: "Pick any, or neither.",
    options: [
      { id: "app", label: "A mobile app" },
      { id: "website", label: "A website" },
    ] as Option<AddonId>[],
  },
  ai: {
    title: "Do you want AI features?",
    hint: "For example a WhatsApp agent, or reading bills and POs automatically.",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "unsure", label: "Not sure yet" },
    ] as Option<"yes" | "no" | "unsure">[],
  },
  payment: {
    title: "How would you prefer to pay?",
    hint: "Monthly licence means a lower setup fee, then a monthly fee (6-month minimum) while I host and maintain it. With Own the code you pay once and receive the code, with no minimum period.",
    options: [
      { id: "licence", label: "Monthly licence" },
      { id: "buyout", label: "Own the code" },
    ] as Option<"licence" | "buyout">[],
  },
  start: {
    title: "When do you want to start?",
    options: [
      { id: "now", label: "Right away" },
      { id: "soon", label: "Within 1–3 months" },
      { id: "exploring", label: "Just exploring" },
    ] as Option<"now" | "soon" | "exploring">[],
  },
}

export type Answers = {
  business: string
  outcomes: OutcomeId[]
  other?: string // the visitor's own words; set (even if empty) once they choose "Other"
  tracking: TrackingId[]
  users: UsersId
  extras: AddonId[]
  ai: "yes" | "no" | "unsure"
  payment: "licence" | "buyout"
  start: "now" | "soon" | "exploring"
}

export type Contact = { name: string; business: string; phone: string; email: string }

export const OTHER_MAX = 500

const ids = (options: readonly { id: string }[]) => options.map((o) => o.id)
const isOne = (v: unknown, options: readonly { id: string }[]) => typeof v === "string" && ids(options).includes(v)
const isMany = (v: unknown, options: readonly { id: string }[], min: number, max: number) =>
  Array.isArray(v) && v.length >= min && v.length <= max && new Set(v).size === v.length && v.every((x) => isOne(x, options))

// Server-side check of answers posted to the lead route
export function validAnswers(a: unknown): a is Answers {
  if (!a || typeof a !== "object") return false
  const x = a as Record<string, unknown>
  const q = QUESTIONS
  return (
    isOne(x.business, q.business.options) &&
    isMany(x.outcomes, q.outcomes.options, 0, q.outcomes.max) &&
    (x.other === undefined || (typeof x.other === "string" && x.other.length <= OTHER_MAX)) &&
    (x.outcomes as unknown[]).length + (x.other === undefined ? 0 : 1) <= q.outcomes.max &&
    ((x.outcomes as unknown[]).length > 0 || (typeof x.other === "string" && x.other.trim().length > 0)) &&
    isMany(x.tracking, q.tracking.options, 1, q.tracking.options.length) &&
    isOne(x.users, q.users.options) &&
    isMany(x.extras, q.extras.options, 0, q.extras.options.length) &&
    isOne(x.ai, q.ai.options) &&
    isOne(x.payment, q.payment.options) &&
    isOne(x.start, q.start.options)
  )
}

const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0)
const orNull = (nums: number[]) => (nums.length > 0 ? sum(nums) : null)

export function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

// Prices exclude GST; the PDF and the page show it as a separate line at this rate
export const GST_PERCENT = Math.round(PRICING.gst * 100)

export type Estimate = {
  business: { label: string; examples: string }
  problems: string[] // the visitor's own picks, in their words
  solutions: { title: string; includes: string[] }[]
  // All "from" prices, excluding GST
  setup: number // one-time, paid in three milestones
  licence: number | null // monthly, billed in advance; null when only a marketing site is chosen (it has none)
  siteCare: number | null // marketing site only: optional monthly hosting and care, no minimum
  buyout: number | null // one-time to own the code, on top of nothing else; null when only a marketing site is chosen (code handed over)
  retainer: number | null // optional monthly hosting and upkeep after a buyout; null when there is no buyout
  timeline: string
  ai: boolean
  needsCall: boolean // more than 2,000 users: the range is a rough guide only
  validUntil: Date
}

export function estimate(a: Answers, today = new Date()): Estimate {
  // Only "Other" chosen: priced as a custom system until the call
  const outcomes = a.outcomes.length > 0 ? a.outcomes.map((id) => PRICING.outcomes[id]) : [PRICING.outcomes.custom]
  const other = a.other?.trim()

  // A service is priced once, however many of the visitor's picks it delivers
  const serviceIds = [...new Set<ServiceId>([...outcomes.map((o) => o.service), ...a.extras.map((id) => PRICING.addons[id].service)])]
  const services = serviceIds.map((id) => PRICING.services[id])
  const licensed = services.filter((x) => x.licence !== null)
  const site = services.filter((x) => x.licence === null)

  const weeks = serviceIds.map((id) => PRICING.timeline[id])

  const business = BUSINESSES.find((b) => b.id === a.business) ?? BUSINESSES[BUSINESSES.length - 1]
  const validUntil = new Date(today)
  validUntil.setDate(validUntil.getDate() + PRICING.validDays)

  return {
    business: { label: business.label, examples: business.examples },
    problems: [...a.outcomes.map((id) => OUTCOMES.find((o) => o.id === id)?.quote).filter((q): q is string => !!q), ...(other ? [other] : [])],
    solutions: [
      ...outcomes.map((o) => ({ title: o.title, includes: o.includes })),
      ...a.extras.map((id) => ({ title: PRICING.services[PRICING.addons[id].service].title, includes: [] })),
      { title: "Bringing your existing records in", includes: [`Your ${business.examples}, moved into one place, as part of setup`] },
    ],
    setup: sum(services.map((x) => x.setup)),
    licence: orNull(licensed.map((x) => x.licence!)),
    siteCare: orNull(site.map((x) => x.retainer)),
    buyout: orNull(licensed.map((x) => x.buyout!)),
    retainer: orNull(licensed.map((x) => x.retainer)),
    timeline: `${Math.max(...weeks.map((w) => w[0]))}–${Math.max(...weeks.map((w) => w[1]))} weeks`,
    ai: a.ai === "yes" || outcomes.some((o) => o.ai),
    needsCall: a.users === "more",
    validUntil,
  }
}
