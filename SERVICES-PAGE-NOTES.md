# Services page: notes, section by section

Routes: `/services` ([app/services/page.tsx](app/services/page.tsx)) and `/terms` ([app/terms/page.tsx](app/terms/page.tsx)). Content comes from [services.json](app/content/services.json) and [pricing.ts](app/content/pricing.ts). Last updated 2026-11-08.

## How the pages are switched on and off

- `ESTIMATOR_ON` ([estimate.ts](app/components/estimator/estimate.ts)) is true when `PRICING.reviewed` is true, or when running `next dev`.
- `PRICING.reviewed` is currently **false**, so on the live site:
  - "Services and prices" and "Get an exact estimate" are hidden, along with their side-nav links.
  - Tiles don't show the "Usually delivered as" line or the "Price this" button.
  - The hero's primary button becomes "Book a free call".
  - `/services/estimate` and `/terms` return 404, and `/api/lead` returns 404.
- In `next dev` everything shows.
- "Work in action" shows only when the case study is no longer a placeholder, or when there are demo links. Today `placeholder: true` and `demos: []`, so it is hidden everywhere.

Side nav order (when everything is on): Prices, Sound familiar, How we'll work, Estimate, Work in action, Questions, Let's talk.

---

## 1. Hero

- Title from `services.hero.title`. Buttons (`Actions`): the estimator link plus "Fill out the form", or just the form button when the estimator is off. Availability badge from `services.availability`.
- `hero.promise` exists in the JSON but the page doesn't render it.

## 2. Services and prices (`#prices`, estimator on only)

Components: [price-plans.tsx](app/components/services/price-plans.tsx) (cards, switch, dialog), [price-compare.tsx](app/components/services/price-compare.tsx) (the comparison), [category-price.ts](app/components/services/category-price.ts) (all card text). Every figure is derived from `PRICING`.

- **Intro:** a title and short paragraph from `services.pricingIntro`.
- **Four cards** (names are defined once in `pricing.ts`): Workflow Automation, Custom Business Software, Mobile Apps, Business and Marketing Websites.
  - Software cards show one line: "Setup from ₹X (one time) + ₹Y/month". The website card shows "Build from ₹35,000 (one time)".
  - The whole card is clickable and opens a "See breakdown" dropdown (one at a time; Escape or a click outside closes it; no layout shift).
  - The dropdown has four rows: what's included, what moves the price, typical timeline, and owning the code (software, kept to the key rules and pointing to the terms) or the care plan (websites).
- **Switch below the cards:** "Show the own-the-code prices" swaps the software cards to "Own the code: from about ₹Z, quoted after scope" plus the maintenance-plan line. The website card does not change.
- **"Compare both routes" button** opens a dialog:
  - Pick a service; drag "Project size" (setup from the "from" price up to four times it) and "How long you stay" (1 to 48 months).
  - Optional "Set your own price for owning the code".
  - Three result cards (stay on the monthly plan, start monthly and buy later, own from day one) with the lowest marked, a break-even line, and a table at 6, 12, 24 and 36 months whose rows set the month.
- **Note below the cards (once):** GST, setup paid in two parts (50% at signing, 50% at live testing), 6-month minimum, AI and third-party fees at cost, UPI, with a link to `/terms`, then a link to the estimator, which emails a detailed PDF.

### Price reference (excl. GST, from `pricing.ts`)

| Service | Setup from | Monthly plan | Own the code from about | Maintenance plan after buying |
|---|---|---|---|---|
| Workflow Automation | 40,000 | 18,000 | 1,25,000 | 9,000 |
| Custom Business Software | 1,50,000 | 20,000 | 2,50,000 | 10,000 |
| Mobile Apps | 60,000 | 15,000 | 1,25,000 | 7,500 |
| Business and Marketing Websites | 35,000 | none | code included | care plan 3,000 (higher tier 5,000) |

### Rules behind the numbers

- **Buyout:** a "from about" figure, quoted after scope. A client who starts monthly and buys later gets the setup paid deducted and 50% of the monthly fees paid credited, never below 25% of the code price (`BUYOUT` and `buyoutPrice`, with unit tests in [pricing.test.ts](app/content/pricing.test.ts); run `npm test`).
- **Break-even:** with maintenance at half the monthly plan and these code prices, owning from day one beats the monthly plan after about 9 to 10 months on paper, about 15 once the owner's own hosting (about ₹3,000 a month) is counted.
- **Scaling with project size** (`SCALING`, `scaledPrices`): the monthly plan rises at half the rate of setup (doubling setup raises it about 50%); the code price scales fully with setup; the maintenance plan follows the monthly plan. Used by the comparison dialog and the FAQ.
- **Terms** (`PRICING.terms`): 6-month minimum on the monthly plan, 3-month on the maintenance plan, 90 days of adjustments after go-live, then up to 3 hours of small changes a month, a ₹10,000 day rate for bigger changes, 30 days' notice. AI usage and third-party fees (WhatsApp and similar) are never included: billed at cost as separate lines.
- **User scale:** no per-user charges. The page says "typically 50,000 to 90,000 monthly active users".
- **Timelines** (weeks, one source in `pricing.ts`): automation 4–16, custom software 5–20, mobile apps 4–12, websites 1–5. The estimator and PDF use the same values.
- Several terms values are marked DRAFT in `pricing.ts` (notice, export window, overdue and warning days, response times, day rate).

## 3. Sound familiar? (`#problems`)

Component: [problem-tiles.tsx](app/components/services/problem-tiles.tsx). Six clickable problems on the left (retyping, numbers, whatsapp, payments, network, custom); on the right a detail, the help lines from `PRICING.outcomes[id].includes`, and the next step. "Price this" appears only when the estimator is on and fires `estimator:pick`. It auto-cycles every 3 seconds until hovered or focused, and stops with reduced motion. Both cards keep a constant size.

The "Usually delivered as: {title}, setup from {amount}." line uses the service names and "from" setups in `PRICING`.

### Closing block, "Before you reach out" (`#before-you-reach-out`)

States that automation only works when the team uses it, offers a dedicated WhatsApp Business number or a simple portal, and promises a reply within 48 hours. The button scrolls to the form (`#talk`).

## 4. Get an exact estimate (`#estimate`, estimator on only)

Component: [estimator.tsx](app/components/estimator/estimator.tsx). Logic: [estimate.ts](app/components/estimator/estimate.ts). Same estimator also lives at `/services/estimate`.

- Eight one-at-a-time questions: business type, primary problem, how they track things today, number of users, mobile app and/or website too, AI features, payment preference ("Monthly plan" or "Own the code"), start.
- Then contact details, a consent checkbox and a honeypot. Submitting posts to `/api/lead`, which re-computes the estimate, saves the lead to Supabase and emails it through Resend (either one working counts), with a per-IP limit of 5 requests per 10 minutes.
- The browser builds and downloads a PDF estimate ([estimate-pdf.tsx](app/components/estimator/estimate-pdf.tsx)). Its own-the-code section uses the same wording as the page: price depends on scope, setup paid deducted, half the monthly fees credited down to a 25% floor, maintenance plan after buying. The users flag says "You chose more than 2,000 users, so these starting prices are a rough guide."

## 5. Work in action (`#proof`, currently hidden)

Demo links and a case study (business, problem, what was built, result). The case study is the Rever distributor platform, still `placeholder: true` with no result.

## 6. How we'll work (`#process`)

[process-steps.tsx](app/components/services/process-steps.tsx): five numbered steps with Back and Next: free call (including budget and start date), free discovery (a visit in or around Raipur, a screen share elsewhere, working with me personally) then a written proposal in 5–7 days (scope, price, timeline; detailed design after approval; the paid audit for a deeper analysis), proposal free, no obligation, valid 21 days; 50% of setup then prototype as the first milestone of a staged build (changes within scope included, new features quoted; the other 50% at live testing), launch and training, and after go-live (the monthly plan keeps it hosted; a review at 60–90 days; small changes included after 90 days, bigger ones quoted; after buying outright, 30 days of bug fixes then an optional maintenance plan). The websites page shows its own five steps instead (page.process in services.json): call, proposal, design, build and launch with 50% before launch, optional care plan. Below: "Happy to sign an NDA before we talk, if you'd like."

## 7. Common questions (`#faq`)

Eighteen accordion questions, one open at a time. Figures that come from `PRICING` are written as `{{placeholders}}` in `services.json` and filled in by `fillFaq` in `category-price.ts` (an unknown placeholder fails the build). Money and terms questions: how the monthly plan works (including what it covers), whether the fee rises for a bigger project, what counts as a change, how quickly problems are fixed, owning the code (the worked example is on the terms page), who owns the data, whose name the accounts are in, other costs, stopping, what if I stop working on this, and how payments work. The rest cover non-technical teams, replacing software, data safety, timelines, AI, demos and scale.

## 8. Terms (`/terms`, estimator on only)

Thirteen numbered clauses and an "In short" box, drawn from `PRICING.terms`. It is a plain-English draft that a lawyer should review before it goes into a contract. It is not linked anywhere until the estimator is on.

## 9. Let's talk, the project brief form (`#talk`)

Component: [contact-section.tsx](app/sections/contact-section.tsx), shared with the home, about and projects pages. Fields: name, WhatsApp number, services needed (multi-select of the four categories), timeline, and what are you building. "Send brief" opens the mail app (a mailto). `?brief=<service id>` and the ask-bar assistant can pre-select services.

---

## Open decisions and loose ends

1. **Contract:** none yet; waiting on the lawyer. Seller details (legal name, address, GSTIN, PAN) go in `BUSINESS` in `contact.ts`; the PDF footer shows them once filled. Missing from the terms page: an annual price review, a liability cap, an outage policy, data-protection terms, and a quote validity (the PDF uses 21 days, `PRICING.validDays`).
2. **Capacity:** no cap on plan clients; the availability badge does not reflect it.
3. **Billing:** invoices by UPI only; auto-debit is not set up.
4. **Prices against effort and real clients:** not checked yet.
5. **Proof:** the case study is still a placeholder.
6. **DRAFT defaults** in `PRICING.terms` need confirming.
7. **WhatsApp fees** are passed through at cost; the PDF line should be checked against the contract wording.
8. **The form is a mailto.** A real bot check and the automated PDF email need a submit route that isn't built.
9. **Estimator pre-fill of the form** is not wired.
10. **Content not shown on this page:** `problems.intro` and `cta.note` in `services.json` are not rendered anywhere. `hero.promise` and `categoriesIntro` are used by the ask route, and the category `tags` by the home page, so keep those.
11. **Turning prices on** means setting `PRICING.reviewed` to true once the figures are signed off.
12. **Buyout floor kicks in early:** at "from" prices the 25% floor already applies by month 6 for every software service, so the cost to buy then stays fixed (₹31,250 automation, ₹62,500 custom software, ₹31,250 apps) and "start monthly, buy later" always costs more in total than the other two routes. Options: keep it, lower `BUYOUT.floorShare`, or lower `BUYOUT.feeCreditShare`. Undecided.
