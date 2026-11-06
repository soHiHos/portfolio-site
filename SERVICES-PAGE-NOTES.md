# Services page: notes, section by section

Route: `/services` ([app/services/page.tsx](app/services/page.tsx)). Content comes from [services.json](app/content/services.json) and [pricing.ts](app/content/pricing.ts). Last updated 2026-11-03.

## How the page is switched on and off

- `ESTIMATOR_ON` ([estimate.ts](app/components/estimator/estimate.ts)) is true when `PRICING.reviewed` is true, or when running `next dev`.
- `PRICING.reviewed` is currently **false**, so on the live site:
  - "Services and prices" and "Get an exact estimate" are hidden, along with their side-nav links.
  - Tiles don't show the "Usually delivered as" line or the "Price this" button.
  - The hero's primary button becomes "Book a free call".
  - `/services/estimate` returns 404, and `/api/lead` returns 404.
- In `next dev` everything shows.
- "Work in action" shows only when the case study is no longer a placeholder, or when there are demo links. Today `placeholder: true` and `demos: []`, so it is hidden everywhere.

Side nav order (when everything is on): Prices, Sound familiar, Estimate, Work in action, How we'll work, Questions, Let's talk.

---

## 1. Hero

- Title from `services.hero.title`: "Less manual work. Clearer numbers. Better decisions."
- Buttons (`Actions`):
  - Estimator on: "Get your price estimate in 2 minutes" (scrolls to `#estimate`), plus a "Book a free call" text link (mailto, subject "Free call").
  - Estimator off: "Book a free call" is the one primary button.
- Availability badge, driven by `services.availability` (`accepting`, label).
- `hero.promise` exists in the JSON but the page doesn't render it.

## 2. Services and prices (`#prices`, estimator on only)

Component: [price-plans.tsx](app/components/services/price-plans.tsx). Data: [category-price.ts](app/components/services/category-price.ts), built entirely from `PRICING`.

- **Plan tabs:** "Monthly licence" (lower setup, then a monthly fee; I host, maintain and keep the code) or "Own the code" (pay once, receive the code, licence and retainer end). Switching fades the cards; the marketing site card doesn't flip because its price is the same on both plans.
- **Four cards**, in this order:
  1. AI automations & analytics
  2. Custom software, ERPs & CRMs
  3. Mobile apps
  4. Marketing & business sites
- **Each card:**
  - Title and one-line summary.
  - A harbor-blue price bar. Monthly plan: "Setup from ₹X + ₹Y/month" (marketing site: "From ₹X"). Own the code: "From ₹X".
  - A "See breakdown" button. The whole card is clickable.
- **Breakdown:** it opens as a dropdown laid over the page, so card sizes never change. One opens at a time, and Escape or a click outside closes it. It lists:
  - Setup range, monthly licence range, optional retainer.
  - For the own-the-code plan: the one-time price, "You get: the code", and "No licence".
  - The automation card also carries the AI usage note (₹2,000 a month included, billed at cost above that).
- Below the cards: the indicative-price note (excludes GST at 18%, milestones, billed in advance) and a link to the estimator.
- Cards share row heights through a subgrid, so titles and price bars line up across a row.

### Price reference (excl. GST, from `pricing.ts`)

| Service | Setup | Licence / month | Retainer / month | Buyout |
|---|---|---|---|---|
| Marketing site | 25,000–60,000 | 2,000–4,000 (optional) | none | 25,000–60,000 |
| Invoice and workflow automation | 40,000–80,000 | 5,000–10,000 | 10,000–20,000 | 1,50,000–3,00,000 |
| Custom software, ERPs & CRMs | 1,00,000–2,50,000 | 10,000–20,000 | 15,000–25,000 | 3,50,000–7,00,000 |
| Flutter mobile app | 60,000–1,50,000 | 5,000–10,000 | 8,000–15,000 | 2,00,000–4,00,000 |

- Pilot: ₹40,000–75,000 over 30 days; the fee counts toward setup if the client continues. It appears only in the estimate PDF.
- Timeline by the top of the setup range: up to ₹1.5L = 3–5 weeks, up to ₹4L = 6–10 weeks, above = 10–16 weeks. Both the timeline and the AI allowance are marked DRAFT in the file.
- Ranges are rounded outward: to ₹1,000 under ₹1,00,000, to ₹5,000 above it.

## 3. Sound familiar? (`#problems`)

Component: [problem-tiles.tsx](app/components/services/problem-tiles.tsx).

- **Left card:** six clickable problems (a radio group).
  1. retyping: "We type the same data again and again."
  2. numbers: "We don't know our real numbers until it's too late."
  3. whatsapp: "Everything happens on WhatsApp, and nothing is recorded."
  4. payments: "Payments always come in late."
  5. network: "Our dealer or distributor network is hard to manage."
  6. custom: "Every tool we try makes us change how we work."
- **Right card:** a one- or two-sentence detail, then "We can help with automating" with the help lines, then the next step. The "Price this" button (or the "What to know before you reach out" link when the estimator is off) is pinned to the bottom.
- **Help lines** come from `PRICING.outcomes[id].includes`, so the tile and the estimator can't drift. Quote and detail live in `services.json`; tile ids must match the outcome keys.
- **Mapping:** retyping, numbers, whatsapp and payments map to Invoice and workflow automation; network and custom map to Custom software, ERPs & CRMs. The "Usually delivered as: {title}, setup from {amount}." line shows only when the estimator is on.
- **Behaviour:**
  - It auto-cycles every 3 seconds until the visitor hovers or focuses the section.
  - Reduced motion turns the cycling off.
  - Both cards keep a constant size: the right card reserves the height of the tallest panel.
  - "Price this" fires `estimator:pick` with the id and scrolls to the estimator.

### Closing block, "Before you reach out" (`#before-you-reach-out`)

- States once that automation only works when the team uses it. We set up a dedicated WhatsApp Business number, someone on the client's side runs it, and a simple portal works for anyone who prefers it.
- "Need a proper estimate?" asks for the services needed and what's slowing the business down. The reply promise is **within 48 hours** by email or WhatsApp.
- Button "Fill out the form" scrolls to the form at the bottom of the page (`#talk`).

## 4. Get an exact estimate (`#estimate`, estimator on only)

Component: [estimator.tsx](app/components/estimator/estimator.tsx). Logic: [estimate.ts](app/components/estimator/estimate.ts).

- Eight one-at-a-time questions:
  1. Business type
  2. Primary problem (one pick, or "Other" in their own words; the six problems above)
  3. How they track things today (paper, Excel, Tally, other software)
  4. Number of users
  5. Mobile app and/or website too
  6. AI features (yes, no, not sure)
  7. Payment preference (monthly licence or own the code)
  8. Start (right away, 1–3 months, just exploring)
- Then contact details (name, business, phone, email), a consent checkbox and a honeypot.
- Submitting posts to `/api/lead`, which re-computes the estimate on the server. The lead is saved to Supabase and emailed through Resend; either one working counts as received, and there is a per-IP limit of 5 requests per 10 minutes.
- The browser then builds and downloads a PDF estimate ([estimate-pdf.tsx](app/components/estimator/estimate-pdf.tsx)), even if saving failed.
- The same estimator also lives at `/services/estimate`.

## 5. Work in action (`#proof`, currently hidden)

- Demo links (a grid) and a case study (business, problem, what was built, result).
- The case study is the Rever distributor platform, still flagged `placeholder: true` with no result. It stays hidden until cleared.

## 6. How we'll work (`#process`)

Component: [process-steps.tsx](app/components/services/process-steps.tsx): numbered tabs with Back and Next. Five steps:

1. A free call or Google Meet. An honest view on whether custom software is needed at all.
2. A written proposal in 3–5 days. Setup is paid in three milestones (signing, demo approval, go-live).
3. Prototype, then built in stages. The team signs off a prototype first.
4. Launch and training. A handover session is included; extra or on-site training is quoted.
5. After go-live. The licence keeps it hosted and secure; a review at 60–90 days; extra changes are change requests or use the optional retainer.

Below the steps: "Happy to sign an NDA before we talk, if you'd like."

## 7. Common questions (`#faq`)

Nine accordion questions (only one open at a time):

1. Will this work for a team that isn't tech-savvy?
2. Do we have to replace our current software? (No; Excel or CSV exports are enough.)
3. Who owns our data? (The client; the code is licensed, and it can be bought outright.)
4. What happens if we stop the subscription?
5. Is our data safe? (Role-based access, weekly backups, optional daily backups, NDA.)
6. How long does it take? (A pilot takes 30 days; full systems "4–12 weeks". **This conflicts with the estimator timelines; see below.**)
7. Which AI do you use, and who pays? (Included up to a limit; above it, billed at cost after approval.)
8. Can I see a demo built for my business? (Yes; priced as a small share of the project fee.)
9. Can you build an app for millions of users? (No; up to about 50,000–100,000 monthly active users.)

## 8. Let's talk, the project brief form (`#talk`)

Component: [contact-section.tsx](app/sections/contact-section.tsx), shared with the home, about and projects pages.

- **Fields:** name, WhatsApp number, "Services you need" (multi-select of the four categories), timeline (as soon as possible, 1–3 months, flexible), and "What are you building?" (required).
- **Consent:** the checkbox appears once a WhatsApp number is entered and must be ticked before sending.
- **Honeypot:** a hidden field that blocks sending when filled.
- **Sending:** "Send brief" opens the visitor's mail app with everything filled in (a mailto, so there is no backend).
- **Pre-fill:** `?brief=<service id>` in the URL and the ask-bar assistant's "Start a brief" can both pre-select services.
- It also shows availability, local India time, and links for email (copies on click), LinkedIn, GitHub and Instagram.

---

## Open decisions and loose ends

1. **Timelines don't agree:** the FAQ says 4–12 weeks; the estimator says 3–16 weeks by price band (both unconfirmed).
2. **Service names:** the tile line says "Invoice and workflow automation", but the page category is "AI automations & analytics". The "Flutter mobile app" and "Marketing site" titles also differ from their page categories.
3. **AI allowance:** ₹2,000 a month is shown on the page; the PDF says "a limit agreed upfront". It is marked DRAFT.
4. **Pilot price:** ₹40,000–75,000 shows only in the PDF.
5. **The form is a mailto.** A real bot check (such as Turnstile) and the automated PDF email need a submit route, which isn't built.
6. **Estimator pre-fill of the form** is not wired.
7. **WhatsApp per-message fees:** pass through at cost, or include in the licence? Needs a line in the PDF.
8. **48-hour reply:** if weekends or travel make it unsafe, the fallback wording is "within two working days".
9. **Not covered by a tile or price:** the customer-facing reply bot, mobile apps and marketing sites (they appear only in the price cards and the form).
10. **Unused content:** `services.cta`, `problems.intro` and `hero.promise` in `services.json` are no longer rendered.
11. **Turning prices on** means setting `PRICING.reviewed` to true once the figures are signed off.
