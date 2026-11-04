// Pricing rules for the price estimator (/services/estimate), its PDF and the price cards. Changing a price means
// changing this file only. Amounts are in rupees, excluding GST. Every figure is a "from" price: the page never shows
// a quote or a range, only a starting point; the final price, scope and milestones are fixed in the proposal.
//
// The model has up to four lines per client: a one-time setup fee (three milestones: signing, demo approval, go-live),
// a monthly licence after go-live (hosting, uptime, backups, fixes and security patches; I keep the code and host it),
// a one-time buyout to own the code, and a monthly retainer. The retainer means two things: on the marketing site
// (no licence, code handed over by default) it is the plain hosting-and-care plan; on the other services it is the
// optional hosting-and-upkeep retainer for a client who has bought the code and wants me to keep running it.
// Changes to an existing system are quoted per request (see `changes`); there is no fixed pack of changes.
//
// Never put the income target, margins or tool/infrastructure costs here or anywhere client-facing.
// The estimator stays hidden on the live site until `reviewed` is true (it still runs in `next dev`).

// The four services. `licence` is null where there is none (the marketing site). `buyout` is a one-time price for the
// code, null where the code is handed over by default. DRAFT: the three post-buyout `retainer` figures are derived,
// not stated by the owner; confirm them before quoting.
const SERVICES = {
  website: {
    title: "Marketing & business sites",
    setup: 30000, // Launch; Business from 40,000 and Signature from 60,000 (see `siteTiers`)
    licence: null,
    retainer: 3000, // hosting, backups, security updates, fixes and a monthly report; no minimum, domain at cost
    buyout: null,
  },
  automation: {
    title: "AI automations & analytics",
    setup: 40000,
    licence: 16000,
    retainer: 15000,
    buyout: 150000,
  },
  erp: {
    title: "Custom software, ERPs & CRMs",
    setup: 100000,
    licence: 20000,
    retainer: 18000,
    buyout: 350000,
  },
  app: {
    title: "Mobile apps",
    setup: 60000,
    licence: 16000,
    retainer: 15000,
    buyout: 200000,
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
      title: "Order-to-cash automation and document capture",
      service: "automation",
      ai: true,
      includes: [
        "Invoices drafted from dispatch slips or POs, with e-invoice and e-way bill details prepared",
        "AI reads bills, invoices and POs into clean data",
        "Invoices sent to customers after your approval, and tracked until paid",
      ],
    },
    numbers: {
      title: "Business Pulse (automated MIS)",
      service: "automation",
      ai: false,
      includes: [
        "A weekly report on your phone and email",
        "A simple dashboard: sales, stock, dispatch and dues",
        "The few things that need your attention, flagged",
        "Deeper analysis and forecasting, built on a properly modelled database, when you need it",
      ],
    },
    whatsapp: {
      title: "WhatsApp and mobile daily entry",
      service: "automation",
      ai: false,
      includes: [
        "Staff log production, stock and dispatch from their phone",
        "A simple form or a photo is enough",
        "Everything lands in your records for you to check and confirm",
      ],
    },
    payments: {
      title: "Collections autopilot",
      service: "automation",
      ai: false,
      includes: [
        "A clear list of who owes what",
        "Automatic payment reminders by email and WhatsApp",
        "Every payment tracked until it comes in",
      ],
    },
    network: {
      title: "Distribution OS",
      service: "erp",
      ai: false,
      includes: [
        "Accounts for dealers, distributors and agents",
        "Price tiers, orders and ledgers",
        "Payments and an online shop",
      ],
    },
    custom: {
      title: "A custom system (CRM, ERP or internal tool)",
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

  // AI, API and WhatsApp message usage (WhatsApp fees count towards it) is included up to `usageIncluded` a month,
  // then billed at cost plus `usageMarkup` after the client approves. DRAFT: whether WhatsApp fees should be a separate
  // pass-through is still open.
  usageIncluded: 2000,
  usageMarkup: 0.15,

  // Marketing site tiers, setup from
  siteTiers: { launch: 30000, business: 40000, signature: 60000 },

  // Changes to an existing system, quoted per request by size; plan clients get `planDiscount` off. A new workflow,
  // channel or integration is a separate mini-project.
  changes: { small: 1500, medium: 4000, planDiscount: 0.1 },

  // Contract terms shown on the page, one line each; the detail goes in the PDFs
  terms: { minMonths: 6, noticeDays: 30, buyoutFromMonth: 12, bugFixDays: 30, dataFiles: 3 },

  // Entry offer: a workflow audit and decision report, credited toward setup if the client proceeds in time
  audit: { price: 10000, creditDays: 30 },

  // Weeks from the day the client has sent their data and approvals, as [low, high]. A mix of services takes the longest.
  timeline: { automation: [3, 5], app: [4, 8], erp: [6, 12], website: [3, 5] } satisfies Record<keyof typeof SERVICES, [number, number]>,

  validDays: 30,
};
