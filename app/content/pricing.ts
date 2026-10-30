// Pricing rules for the price estimator (/services/estimate) and its PDF. Changing a price means changing
// this file only. Amounts are in rupees, as [low, high] ranges; the estimator only ever shows ranges.
//
// Figures marked DRAFT were not in the pricing doc and need confirming. The estimator stays hidden on the
// live site until `reviewed` is true (it still runs in `next dev` so it can be checked).

export type Range = [number, number];

export const PRICING = {
  reviewed: false,

  // Q2: the outcomes a visitor can pick (up to two). `build` is the one-time build price, `monthly` the
  // running fee for that service (on top of any care plan or Subscribe fee).
  outcomes: {
    retyping: {
      title: "Order-to-cash automation and document capture",
      build: [100000, 200000], // DRAFT high end; doc: AI automations from ₹1,00,000
      monthly: [8000, 20000],
      ai: true,
      includes: [
        "Invoices drafted from dispatch slips or POs",
        "E-invoice and e-way bill details prepared",
        "AI reads bills, invoices and POs into clean data",
        "Invoices sent to customers and tracked until paid",
      ],
    },
    numbers: {
      title: "Business Pulse (automated MIS)",
      build: [25000, 50000], // DRAFT: doc says "plus a one-time setup" without a figure
      monthly: [5000, 10000], // DRAFT high end; doc: from ₹5,000 a month
      ai: false,
      includes: [
        "A weekly report on your phone and email",
        "A simple dashboard: sales, stock, dispatch and dues",
        "The few things that need your attention, flagged",
      ],
    },
    whatsapp: {
      title: "Mobile daily entry",
      build: [25000, 50000], // DRAFT: doc says "plus a one-time setup" without a figure
      monthly: [6000, 12000], // DRAFT high end; doc: from ₹6,000 a month per site
      ai: false,
      includes: [
        "Staff log production, stock and dispatch from their phone",
        "A simple form or a photo, learned in a day",
        "Everything goes straight into your records",
      ],
    },
    payments: {
      title: "Collections autopilot",
      build: [100000, 150000], // DRAFT high end; doc: AI automations from ₹1,00,000
      monthly: [8000, 15000], // DRAFT high end; doc: ₹8,000–20,000 a month
      ai: false,
      includes: [
        "A clear list of who owes what",
        "Automatic payment reminders by email and SMS",
        "Payments tracked until they come in",
      ],
    },
    network: {
      title: "Distribution OS",
      build: [250000, 500000], // DRAFT high end; doc: from ₹2,50,000
      monthly: [0, 0],
      ai: false,
      includes: [
        "Dealer, distributor or agent accounts",
        "Price tiers, orders and ledgers",
        "Payments and an online shop",
      ],
    },
    custom: {
      title: "A custom system (CRM, ERP or internal tool)",
      build: [250000, 600000], // DRAFT high end; doc: from ₹2,50,000
      monthly: [0, 0],
      ai: false,
      includes: ["Built around how your business already works", "Works with the data you already have"],
    },
  } satisfies Record<string, { title: string; build: Range; monthly: Range; ai: boolean; includes: string[] }>,

  // Q3: extra one-time work to bring existing records in. DRAFT: none of these were in the doc.
  tracking: {
    paper: [25000, 60000],
    excel: [0, 15000],
    tally: [15000, 30000],
    software: [15000, 40000],
  } satisfies Record<string, Range>,

  // Q4: users. `factor` scales the build price; `care` is the Own it care plan for that size (doc: ₹5,000,
  // ₹10,000 or ₹20,000 a month). DRAFT: the factors, and the care plan for the largest band.
  users: {
    under50: { factor: 1, care: 5000 },
    to500: { factor: 1.2, care: 10000 },
    to2000: { factor: 1.5, care: 20000 },
    more: { factor: 2, care: 20000 },
  } satisfies Record<string, { factor: number; care: number }>,

  // Q5 add-ons. DRAFT: the doc has no app price, and only the Launch website price (from ₹35,000).
  addons: {
    app: { title: "Mobile app (Android and iPhone)", build: [150000, 300000] as Range, monthly: [0, 0] as Range },
    website: { title: "Website with lead capture", build: [35000, 100000] as Range, monthly: [1500, 3000] as Range },
  },

  // Subscribe: setup is this share of the build price; the monthly fee is this share of the build price per
  // month (doc example: ₹3,00,000 build → about ₹1,05,000 to start, then about ₹12,000 a month).
  subscribe: { setupShare: 0.35, monthlyShare: 0.04, minimumMonths: 12 },

  pilot: { price: [40000, 75000] as Range, days: 30 },

  // Timeline by the top of the build range. DRAFT: the doc only says "most full systems take 4–12 weeks".
  timeline: [
    { upTo: 150000, weeks: "3–5 weeks" },
    { upTo: 400000, weeks: "6–10 weeks" },
    { upTo: Infinity, weeks: "10–16 weeks" },
  ],

  validDays: 30,
  // Ranges are widened to round numbers: to ₹1,000 under ₹1,00,000, to ₹5,000 above it
  roundTo: { small: 1000, large: 5000, threshold: 100000 },
};
