// The estimator's questions, answer validation and the estimate itself. Shared by the questionnaire (browser)
// and the lead route (server), so both compute the same ranges from the same answers. All prices come from
// content/pricing.ts.

import services from "../../content/services.json"
import { PRICING, type Range } from "../../content/pricing"

// The estimator is live once its pricing is reviewed; until then it only runs in `next dev`
export const ESTIMATOR_ON = PRICING.reviewed || process.env.NODE_ENV !== "production"

type OutcomeId = keyof typeof PRICING.outcomes
type TrackingId = keyof typeof PRICING.tracking
type UsersId = keyof typeof PRICING.users
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
  outcomes: { title: "What do you want to fix?", hint: "Pick up to two.", max: 2, options: OUTCOMES },
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
    options: [
      { id: "upfront", label: "Upfront, and own it" },
      { id: "monthly", label: "Spread monthly (Subscribe)" },
    ] as Option<"upfront" | "monthly">[],
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
  tracking: TrackingId[]
  users: UsersId
  extras: AddonId[]
  ai: "yes" | "no" | "unsure"
  payment: "upfront" | "monthly"
  start: "now" | "soon" | "exploring"
}

export type Contact = { name: string; business: string; phone: string; email: string }

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
    isMany(x.outcomes, q.outcomes.options, 1, q.outcomes.max) &&
    isMany(x.tracking, q.tracking.options, 1, q.tracking.options.length) &&
    isOne(x.users, q.users.options) &&
    isMany(x.extras, q.extras.options, 0, q.extras.options.length) &&
    isOne(x.ai, q.ai.options) &&
    isOne(x.payment, q.payment.options) &&
    isOne(x.start, q.start.options)
  )
}

const add = (a: Range, b: Range): Range => [a[0] + b[0], a[1] + b[1]]
const scale = (r: Range, f: number): Range => [r[0] * f, r[1] * f]
const step = (n: number) => (n < PRICING.roundTo.threshold ? PRICING.roundTo.small : PRICING.roundTo.large)
const round = ([lo, hi]: Range): Range => [Math.floor(lo / step(lo)) * step(lo), Math.ceil(hi / step(hi)) * step(hi)]

export function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}
export function formatRange([lo, hi]: Range) {
  return lo === hi ? inr(lo) : `${inr(lo)}–${inr(hi)}`
}

export type Estimate = {
  business: { label: string; examples: string }
  problems: string[] // the visitor's own picks, in their words
  solutions: { title: string; includes: string[] }[]
  build: Range
  monthly: Range // running fees; Own it adds the optional care plan on top
  care: number
  subscribe: { setup: Range; monthly: Range; minimumMonths: number } | null
  pilot: Range
  pilotDays: number
  timeline: string
  ai: boolean
  needsCall: boolean // more than 2,000 users: the range is a rough guide only
  validUntil: Date
}

export function estimate(a: Answers, today = new Date()): Estimate {
  const users = PRICING.users[a.users]
  const outcomes = a.outcomes.map((id) => PRICING.outcomes[id])
  const addons = a.extras.map((id) => PRICING.addons[id])

  // Bringing existing records in: the most involved source sets the range
  const tracking = a.tracking.map((id) => PRICING.tracking[id]).reduce<Range>((m, r) => [Math.max(m[0], r[0]), Math.max(m[1], r[1])], [0, 0])

  const core = scale(outcomes.reduce<Range>((s, o) => add(s, o.build), tracking), users.factor)
  const build = round(addons.reduce<Range>((s, x) => add(s, x.build), core))
  const monthly = round([...outcomes, ...addons].reduce<Range>((s, x) => add(s, x.monthly), [0, 0]))

  const s = PRICING.subscribe
  const subscribe =
    a.payment === "monthly"
      ? { setup: round(scale(build, s.setupShare)), monthly: round(add(scale(build, s.monthlyShare), monthly)), minimumMonths: s.minimumMonths }
      : null

  const business = BUSINESSES.find((b) => b.id === a.business) ?? BUSINESSES[BUSINESSES.length - 1]
  const validUntil = new Date(today)
  validUntil.setDate(validUntil.getDate() + PRICING.validDays)

  return {
    business: { label: business.label, examples: business.examples },
    problems: a.outcomes.map((id) => OUTCOMES.find((o) => o.id === id)?.quote).filter((q): q is string => !!q),
    solutions: [
      ...outcomes.map((o) => ({ title: o.title, includes: o.includes })),
      ...addons.map((x) => ({ title: x.title, includes: [] })),
      ...(tracking[1] > 0 ? [{ title: "Bringing your existing records in", includes: [`Your ${business.examples}, moved into one place`] }] : []),
    ],
    build,
    monthly,
    care: users.care,
    subscribe,
    pilot: PRICING.pilot.price,
    pilotDays: PRICING.pilot.days,
    timeline: PRICING.timeline.find((t) => build[1] <= t.upTo)!.weeks,
    ai: a.ai === "yes" || outcomes.some((o) => o.ai),
    needsCall: a.users === "more",
    validUntil,
  }
}
