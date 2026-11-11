// Pricing rules for the price estimator (/services/estimate), its PDF and the price cards. Changing a price means
// changing this file only. Amounts are in rupees, excluding GST. Every figure is a "from" price: the page never shows
// a quote or a range, only a starting point; the final price, scope and payment schedule are fixed in the proposal.
//
// The model has up to four lines per client: a one-time setup fee (paid in two parts: 50% at signing and 50% at live testing),
// a monthly plan after go-live (hosting, uptime, backups, bug fixes, security updates and small changes; I keep the code and
// host it), a "from about" figure to own the code, and a maintenance plan after a purchase (on the marketing site, the
// optional care plan). Bigger changes are quoted (see `terms.dayRate`).
//
// Never put the income target, margins or tool/infrastructure costs here or anywhere client-facing.
// The estimator stays hidden on the live site until `reviewed` is true (it still runs in `next dev`).

// The four services. `licence` is the monthly plan, null where there is none (the marketing site has an optional care
// plan instead, held in `retainer`). `buyout` is a "from about" figure for owning the code, set by hand and quoted after
// scope; null where the code is handed over by default. For the three software services `retainer` is the maintenance
// plan after a code purchase, set at half the monthly plan, and `buyout` is set so that owning from day one beats staying on
// the monthly plan within about a year on paper (about 15 months once the owner's own hosting is counted). The names are defined here once and used on tiles, cards, estimator and PDF.
const SERVICES = {
  website: {
    title: "Websites",
    setup: 35000, // Business from 40,000 and Signature from 60,000 (see `siteTiers`)
    licence: null,
    retainer: 3000, // care plan: hosting, backups, uptime monitoring and one small edit a month; no minimum
    buyout: null,
  },
  automation: {
    title: "Automation & Analysis",
    setup: 40000,
    licence: 18000,
    retainer: 9000,
    buyout: 125000,
  },
  erp: {
    title: "Custom Business Software",
    setup: 150000,
    licence: 20000,
    retainer: 10000,
    buyout: 250000,
  },
  app: {
    title: "Mobile Apps",
    setup: 60000,
    licence: 15000,
    retainer: 7500,
    buyout: 125000,
  },
} satisfies Record<string, { title: string; setup: number; licence: number | null; retainer: number; buyout: number | null }>;

export const PRICING = {
  services: SERVICES,

  reviewed: false,

  // GST is shown as a separate line on top of every price, never included in it
  gst: 0.18,

  // Q2: the outcomes a visitor can pick (up to two). Each maps to the service that delivers it; picking two
  // outcomes on the same service prices that service once.
  outcomes: {
    retyping: {
      title: "Paper and documents to data, and invoicing",
      service: "automation",
      ai: false,
      includes: [
        "Invoices drafted from dispatch slips or POs, with e-invoice and e-way bill details prepared",
        "Bills, invoices and POs read into clean data",
        "Invoices sent to customers after your approval, and tracked until paid",
      ],
    },
    numbers: {
      title: "Business Pulse (automated MIS)",
      service: "automation",
      ai: false,
      includes: [
        "A weekly report on your phone and email, with the few things that need your attention flagged",
        "A simple dashboard of sales, stock, dispatch and dues",
        "Who your best customers are, and who has gone quiet",
        "Or start with a one-off report: three months of data, three decisions to act on this month",
      ],
    },
    whatsapp: {
      title: "WhatsApp, Telegram and mobile daily entry",
      service: "automation",
      ai: false,
      includes: [
        "Staff log production, stock and dispatch from their phone",
        "A simple form or a photo is enough",
        "Everything lands in your records for you to check and confirm",
      ],
    },
    payments: {
      title: "Invoicing and collections",
      service: "automation",
      ai: false,
      includes: [
        "A clear list of who owes what",
        "Automatic payment reminders by email and WhatsApp",
        "Every payment tracked until it comes in",
      ],
    },
    network: {
      title: "Dealer and distributor platform (Distribution OS)",
      service: "erp",
      ai: false,
      includes: [
        "Accounts for dealers, distributors and agents",
        "Price tiers, orders and ledgers",
        "Payments and an online shop",
      ],
    },
    custom: {
      title: "ERP, CRM or a custom tool",
      service: "erp",
      ai: false,
      includes: [
        "Built around how your business already works",
        "Works with the data you already have",
        "A tool for the one job off-the-shelf software doesn't do well",
      ],
    },
  } satisfies Record<string, { title: string; service: keyof typeof SERVICES; ai: boolean; includes: string[] }>,

  // Q5 add-ons: each is a service of its own
  addons: {
    app: { service: "app" },
    website: { service: "website" },
  } satisfies Record<string, { service: keyof typeof SERVICES }>,

  // AI usage and third-party fees (WhatsApp and similar) are never included: they are billed at cost as separate lines on the
  // monthly bill and named in the signed scope.

  // Marketing site tiers, setup from
  siteTiers: { launch: 35000, business: 40000, signature: 60000 },

  // Marketing site care plan: the higher tier adds analytics and traffic reports
  siteCareHigher: 5000,

  // Contract terms shown on the page, one line each; the detail goes in the PDFs. Small changes: `smallChangeHours` hours a
  // month after the first `adjustmentDays` days; bigger changes are quoted at `dayRate` a day. DRAFT: the notice, export,
  // response and day-rate defaults are proposed, not confirmed.
  terms: { minMonths: 6, maintenanceMinMonths: 3, noticeDays: 30, bugFixDays: 30, dataFiles: 3, smallChangeHours: 3, adjustmentDays: 90, dayRate: 10000, replyUrgentDays: 1, replyOtherDays: 3, exportDays: 30, overdueDays: 15, warningDays: 7, dataKeepDays: 30 },

  // Entry offer: a workflow audit and decision report, credited toward setup if the client proceeds in time
  audit: { price: 10000, creditDays: 30 },

  // The typical setup range of the software services, as [from, top]: the service pages show prices at the from size,
  // the middle of the range and the top (the same three sizes as the PDFs), worked out with `scaledPrices` below
  typicalRange: { automation: [40000, 80000], app: [60000, 150000], erp: [150000, 250000] } satisfies Partial<Record<keyof typeof SERVICES, [number, number]>>,

  // Weeks from the day the client has sent their data and approvals, as [low, high]. A mix of services takes the longest.
  timeline: { automation: [4, 16], app: [4, 12], erp: [5, 20], website: [1, 5] } satisfies Record<keyof typeof SERVICES, [number, number]>,

  validDays: 21,
};

// Owning the code is a "from about" figure per service (`buyout` above), quoted after scope. A client who starts on the
// monthly plan and buys later has the setup already paid deducted and `feeCreditShare` of the monthly fees already paid
// credited. The price never goes below `floorShare` of the agreed code price, so staying long enough never makes the
// code free.
export const BUYOUT = {
  feeCreditShare: 0.5,
  deductSetupPaid: true,
  floorShare: 0.25,
} as const;

// price = max(floorShare * buyoutFrom, buyoutFrom - setupPaid - feeCreditShare * monthlyFeesPaid)
export function buyoutPrice({ buyoutFrom, setupPaid = 0, monthlyFeesPaid = 0 }: { buyoutFrom: number; setupPaid?: number; monthlyFeesPaid?: number }): number {
  const credit = (BUYOUT.deductSetupPaid ? setupPaid : 0) + BUYOUT.feeCreditShare * monthlyFeesPaid;
  return Math.max(BUYOUT.floorShare * buyoutFrom, buyoutFrom - credit);
}

// Bigger projects cost more to host and support, so the monthly plan rises with the project size, but more slowly than
// setup: it grows by `monthlyShare` of the growth in setup (doubling setup raises the monthly plan by about 50%). The
// buyout figure scales fully with setup, and the maintenance plan follows the monthly plan. "From" prices are the
// smallest size, so a setup below them is treated as the "from" size. Rounded to the nearest 1,000. DRAFT.
export const SCALING = { monthlyShare: 0.5 } as const;

export type ScaledPrices = { setup: number; monthly: number; buyout: number; maintenance: number };

export function scaledPrices(service: { setup: number; licence: number; buyout: number; retainer: number }, setup: number): ScaledPrices {
  const k = Math.max(1, setup / service.setup);
  const monthlyFactor = 1 + SCALING.monthlyShare * (k - 1);
  // The "from" size keeps the exact prices (a ₹7,500 maintenance plan must not round to ₹8,000)
  const round = (n: number) => (k === 1 ? n : Math.round(n / 1000) * 1000);
  return {
    setup: Math.max(setup, service.setup),
    monthly: round(service.licence * monthlyFactor),
    buyout: round(service.buyout * k),
    maintenance: round(service.retainer * monthlyFactor),
  };
}

// Setup is paid in two parts: a share at signing and the rest when the software goes to live testing (the testing phase
// when real users first use it, before go-live). The monthly plan starts at go-live, after live testing.
export const SETUP_SPLIT = { signingPercent: 50, liveTestingPercent: 50 } as const;
export const SETUP_PAYMENT_TEXT = `${SETUP_SPLIT.signingPercent}% at signing and ${SETUP_SPLIT.liveTestingPercent}% when it goes to live testing`;
