# Pricing and services guide, for building PDFs in Penpot

Prepared 8 November 2026. Source of truth: `app/content/pricing.ts`, `app/content/services.json`, `app/terms/page.tsx` and `app/globals.css` in the portfolio-site repo. Every figure below is worked out from those files. If a price changes, regenerate this guide.

**Written for:** Claude, working in Penpot, designing client-facing PDFs for Soham Kar's software studio.

---

## 1. What to make

Suggested documents (the owner decides which):

1. **Services and pricing guide**, A4 portrait, 3 to 4 pages: cover and intro, the four services with prices, the monthly-plan versus own-the-code comparison, how it works and the terms in short.
2. **Price estimate template**, A4 portrait, 2 pages. A design version of the PDF the website's estimator already generates (structure in section 9). Dynamic fields are marked.
3. **Terms summary**, 1 to 2 pages, drawn from section 7. A plain-English draft only, not a contract.

Rules that apply to all of them:

- Every price is a **"from" price**, **excluding GST**. Never present one as a final quote.
- Do not invent prices, services, clients, testimonials or results. If something is not in this file, leave it out or mark it `[to be confirmed]`.
- Seller details (legal name, address, GSTIN, PAN) are **not available yet**. Leave a clearly marked empty slot in the footer; do not make numbers up.
- The terms are a draft awaiting a lawyer's review. Do not label any PDF a contract or an agreement.

---

## 2. Brand

- **Name:** Soham Kar. A one-person software and AI automation studio in Raipur, Chhattisgarh, India, serving growing businesses (target market: India).
- **Voice:** first person singular ("I host it", "I'll reply within 48 hours"). Plain, direct, sentence case everywhere ("Explore work", not "EXPLORE WORK"). No hype.
- **Contact:** sohamkar.work@gmail.com · linkedin.com/in/soham-kar-99b15844a
- **Positioning:** premium, no discounts, no founding-client offers.

### Words to use and avoid

| Use | Avoid |
|---|---|
| monthly plan | licence (only where a contract needs it), subscription fee |
| maintenance plan (after buying the code) | retainer |
| the plan ends, service is paused | switched off, suspended, penalty, fee for leaving |
| early-exit option | exit fee |
| from ₹X | ₹X (as if fixed) |
| live testing (before go-live) | milestone (for payment) |

No aviation wording in content (no "flight plan", "boarding", "hangar"). The aviation theme belongs only to the faint map background.

---

## 3. Design system

Look: **modern, minimal, sharp.** Solid sharp-cornered cards, one accent, quiet map background, content in the middle stays plain so the reader reads the content.

### Colours (light theme, use this for PDFs)

| Token | Hex | Use |
|---|---|---|
| background | `#dce3e8` | page background (misty grey-blue) |
| surface | `#fafcfd` | cards, panels, table bodies (near white) |
| foreground / ink | `#102a43` | body text, headings |
| muted | `#364b60` on the page, `#486078` on cards | secondary text |
| line | `rgba(16,42,67,0.12)` (≈ `#d3dde5` on white) | 1px borders and dividers |
| accent | `#e8a33d` (amber) | every fill and highlight: price bars, buttons, the top bar, highlight chips |
| on-accent | `#102a43` (navy) | text placed on an amber fill |
| accent-ink | `#0f4c81` (steel blue) | accent-coloured **text**: headings, links, highlighted numbers |
| tint | `#eef3f7` | callout boxes |
| status badge | Tailwind `emerald-700` fill, white text | only the "accepting projects" pill (rounded, 10pt, uppercase, wide tracking: the one exception to sentence case and square corners). Leave it out of PDFs unless asked. |

Rules: one accent only. **Never use amber for text** (it is too faint on the page); use accent-ink for coloured text. No third colour, no gradients behind cards, no heavy drop shadows. Borders carry structure.

Dark theme (only if a dark PDF is wanted): background `#111316`, surface `#1a1d22`, foreground `#e6e8eb`, muted `#9aa1aa`, line `rgba(255,255,255,0.12)`, accent `#f97316` (orange, doubles as accent-ink), on-accent `#16191d`.

### Typography

| Role | Font | Notes |
|---|---|---|
| Default face: headings, card titles, buttons, labels, nav, table headers | **Space Grotesk** | the site's body default. Bold for headings (tight tracking on large titles), SemiBold for labels and buttons. Not in the repo; download from Google Fonts. |
| Paragraphs and long-form copy | **Inter** | Regular 400 and SemiBold 600. Files in `design-assets/` (`Inter-Regular.ttf`, `Inter-SemiBold.ttf`, licence included). |
| The existing estimate PDF | **Inter only** | used for everything, because the built-in PDF fonts have no rupee glyph. |

In a PDF, follow the website: Space Grotesk for titles, headings, card titles and table headers; Inter for paragraphs, fine print and **all figures**.

**Rupee sign:** use **Inter for every figure**. If Space Grotesk is used for a large price, check that ₹ (U+20B9) renders, otherwise fall back to Inter.

Type scale used in the existing estimate PDF (points, A4):

| Style | Size / weight | Colour |
|---|---|---|
| Document title | 20 / 600, line-height 1.2 | ink |
| Meta line (prepared for, date, validity) | 10 / 400 | muted |
| Section heading (h2) | 12 / 600 | accent-ink |
| Body | 10 / 400, line-height 1.45 | ink |
| Emphasis or sub-label | 10 / 600 | ink |
| Price figure | 13 / 600 | ink |
| Fine print | 8 / 400 | muted |

For a larger guide, scale up in steps: cover title 36 to 44 (Space Grotesk bold), page heading 26 to 30, card title 14 to 16, body 10 to 11.

### Shape and components

- **Sharp corners everywhere.** No rounded cards, buttons or inputs. The only round things are tiny status dots.
- **Card:** surface fill, 1px line border, padding 12 to 24pt. Default container.
- **Price bar:** a full-width amber band at the bottom of a card (amber fill, navy bold text, 13 to 14pt). It holds the price **only**, nothing else.
- **Callout:** tint `#eef3f7` fill, no border, padding 10pt. Used for "this is an estimate" and similar notes.
- **Top bar:** a 4pt amber rule across the top of page 1.
- **Ticks:** `✓` in accent-ink, hanging indent for lists.
- **Table:** surface fill, 1px line border, header row with a bottom border, SemiBold header text, tabular numerals, the lowest value in a row in bold.
- **Chip** (e.g. "Lowest"): amber fill, navy 8pt SemiBold text, 1px amber border, square corners.
- **Buttons** (only if a PDF has a call-to-action): primary = amber fill with navy text; secondary = outline. Sharp corners.

### Page setup (from the existing estimate PDF)

- A4 portrait, 595 × 842 pt (210 × 297 mm).
- Margins: 44pt left, right and top; bottom 64pt (footer sits at 28pt from the bottom edge).
- Footer on every page: 8pt muted text, 1px line above, 6pt padding. Content: `Soham Kar · sohamkar.work@gmail.com · linkedin.com/in/soham-kar-99b15844a · Valid until <date>` (estimate only). When seller details exist, add legal name, address, GSTIN and PAN to this line, separated by ` · `.

---

## 4. Background images

The website's background is a real street map of **central Raipur** (OpenStreetMap data, © OpenStreetMap contributors, ODbL) with faint dashed **flight routes** above it. In the PDFs it is optional, quiet decoration. Content stays plain on top.

### Files (all in `design-assets/`)

| File | Size | Use |
|---|---|---|
| `raipur-map-light-a4-portrait.svg` | 595 × 842 (cropped to the right of the city, includes the airport runway at lower right) | page background for A4 portrait PDFs |
| `raipur-map-light-landscape.svg` | 1600 × 1000 | full map, covers, wide layouts |
| `raipur-map-dark-a4-portrait.svg`, `raipur-map-dark-landscape.svg` | same | dark theme versions |
| `flight-routes-a4-portrait.svg`, `flight-routes-landscape.svg` | same sizes, transparent | dashed amber routes with one small plane glyph, layered above the map |
| `Inter-Regular.ttf`, `Inter-SemiBold.ttf`, `Inter-LICENSE.txt` | | body font |

Each map SVG has named layers: `ground`, `parks`, `water`, `waterway`, `streets-minor`, `streets-mid`, `streets-major`, `rail`, `apron`, `taxiway`, `runway`. Source data: `public/maps/raipur.json`.

### How to layer it (match the website)

1. Bottom: the map SVG, full bleed.
2. A **veil**: a rectangle in the page colour (`#dce3e8`) at **78% opacity** over the whole page. This quiets the map so text reads cleanly. On the cover only, use about 35% opacity so the map shows more.
3. Above the veil: the flight-routes SVG (amber `#e8a33d` dashes `6 9`, 1.3 stroke, 30% opacity).
4. Content (cards, tables) on top, on solid surface fills. **Never put body text straight on the map**; text panels over the map use a frosted panel (about 14% white fill, 16px blur, 1px border).
5. The site blurs the map by about 1.2px; it is optional in a PDF.

### Other image assets in the repo (only if the owner asks)

- Project thumbnails and screenshots: `public/images/` (`rever-home.png`, `co-daftar.png`, `local-legends.png`, `as-metals_thumbnail.webp`, `frontwave_thumbnail.webp`, `munshi_thumbnail.webp`).
- Logos: `public/logos/` (`co-daftar.svg`, `futurise.webp`).
- The case study is still a placeholder, so **do not show a case study or results** in the PDFs yet.

---

## 5. Services and prices

### Intro (use as written)

> **Apps, websites and software that take your business off paper, automate the routine work and show you clear numbers.**
> You pay a setup fee and a monthly plan. I host it, fix it and keep it up to date, so your team just uses it. If you ever want to own the code, you can.

### The four services

#### Automation & Analysis

Connect WhatsApp or Telegram, invoices, spreadsheets and your other tools so routine work runs on its own.

- **Price bar (monthly plan):** Setup from ₹40,000 (one time) + ₹18,000/month
- **Price bar (own the code):** Own the code from about ₹1,25,000
  - small print: Quoted after scope. Fees you've paid count toward it. After the purchase, hosting is yours to run, or you can add a maintenance plan from ₹9,000/month, with a 3-month minimum.
- **Typical timeline:** 4–16 weeks, from the day you've sent your data and approvals

#### Custom Business Software

Your own ERP or CRM, built around how your business actually runs. No per-user fees.

- **Price bar (monthly plan):** Setup from ₹1,50,000 (one time) + ₹20,000/month
- **Price bar (own the code):** Own the code from about ₹2,50,000
  - small print: Quoted after scope. Fees you've paid count toward it. After the purchase, hosting is yours to run, or you can add a maintenance plan from ₹10,000/month, with a 3-month minimum.
- **Typical timeline:** 5–20 weeks, from the day you've sent your data and approvals

#### Mobile Apps

Android and iOS apps for your team or your customers, from one Flutter codebase.

- **Price bar (monthly plan):** Setup from ₹60,000 (one time) + ₹15,000/month
- **Price bar (own the code):** Own the code from about ₹1,25,000
  - small print: Quoted after scope. Fees you've paid count toward it. After the purchase, hosting is yours to run, or you can add a maintenance plan from ₹7,500/month, with a 3-month minimum.
- **Typical timeline:** 4–12 weeks, from the day you've sent your data and approvals

#### Websites

A fast, clear website that explains what you do and brings in enquiries.

- **Price bar:** Build from ₹35,000 (one time)
- **Typical timeline:** 1–5 weeks, from the day you've sent your data and approvals
- **Tiers:** Launch from ₹35,000, Business from ₹40,000, Signature from ₹60,000
- **Site files are handed over after final payment**, so there is no code purchase.
- **Optional care plan:** Base care from ₹3,000/month (hosting, backups, uptime monitoring, one small edit a month). Plus care ₹5,000/month adds visitor analytics (who visits, which pages they view, what they click) and traffic reports. No minimum; cancelling mid-month still bills the full month.

### Breakdown rows (the four things each software service explains)

1. **What's included:** Hosting, backups and uptime monitoring. Bug fixes, with a reply within 1 business day for anything urgent. Security updates. Adjustments to what I built for the first 90 days after go-live, then up to 3 hours of small changes every month.
2. **What moves the price:**
   - Automation & Analysis: How many workflows, how many systems they connect, and whether they include AI steps. AI usage and WhatsApp messages are billed at cost on your monthly bill.
   - Custom Business Software: Which modules you need, integrations such as Tally or payments, and how much data I move from your old system. No per-user charges; typically built for 50,000 to 90,000 monthly active users.
   - Mobile Apps: Number of screens and user roles, payments, the admin panel, and integrations with your other systems.
3. **Typical timeline:** see each service above.
4. **Owning the code:** Agreed before you commit. Your setup and 50% of your monthly fees count toward it, down to 25% of the code price. Afterwards, hosting is yours to run, or add a maintenance plan. The terms have the full rules.

### Price reference (excluding GST)

| Service | Setup from | Monthly plan | Own the code from about | Maintenance plan after buying | Timeline |
|---|---|---|---|---|---|
| Automation & Analysis | ₹40,000 | ₹18,000 | ₹1,25,000 | ₹9,000 | 4–16 weeks |
| Custom Business Software | ₹1,50,000 | ₹20,000 | ₹2,50,000 | ₹10,000 | 5–20 weeks |
| Mobile Apps | ₹60,000 | ₹15,000 | ₹1,25,000 | ₹7,500 | 4–12 weeks |
| Websites | ₹35,000 | none (care plan from ₹3,000, optional) | code included | care plan only | 1–5 weeks |

### Note under the cards (state this once)

> All prices exclude GST (18%). Setup is paid in two parts: 50% at signing and 50% when it goes to live testing. Monthly plans have a 6-month minimum. AI usage and third-party services such as WhatsApp are billed at cost. UPI accepted.

### Rules behind the numbers

- **Setup payment:** two parts, 50% at signing and 50% when it goes to live testing. *Live testing* is the testing phase when real users first start using the software, **before** it goes fully live. The monthly plan starts at **go-live**, after live testing, and is invoiced monthly in advance.
- **Minimum terms:** monthly plan 6 months from go-live; maintenance plan 3 months; website care plan and code purchases none.
- **Leaving early (inside the first 6 months):** pay two months' plan fees and end the plan, **or** buy the code. After 6 months: 30 days' notice.
- **Buying the code later:** price = code price − setup already paid − 50% of monthly fees already paid, **never below 25% of the code price**. The plan ends and the client receives the code as it stands that day.
- **Worked example (use this one):** on a mobile app with a ₹60,000 setup, a ₹15,000 monthly plan and a ₹1,25,000 code price, buying after 4 months costs ₹1,25,000 − ₹60,000 − ₹30,000 = ₹35,000.
- **Bigger projects:** the monthly plan rises more slowly than setup. If setup doubles, the monthly plan goes up by about 50% (the code price scales fully with setup, the maintenance plan follows the monthly plan).
- **Changes:** adjustments to what was built are included for 90 days after go-live; after that, up to 3 hours of small changes a month (unused hours do not roll over). Bigger changes, new features, new integrations and new third-party services are quoted first, at a day rate of ₹10,000.
- **Not included, billed at cost as separate lines on the monthly bill:** AI usage and third-party fees (WhatsApp, Meta services, payment gateways, SMS, email and similar). Each is named in the signed scope before work starts. Telegram or a simple portal can be used instead of WhatsApp.
- **Estimate validity:** 21 days.
- **Workflow audit and decision report:** ₹10,000, for businesses not ready to build: a deeper look at their workflows and data, with a written report they keep whether or not they build. Fully credited toward setup if the client goes ahead within 30 days.

---

## 6. Comparison tables (worked out from the prices above)

What a client has paid in total after N months on each route, at the **"from" size** of each service. Use these for the comparison page; do not round them.

- **Stay on the monthly plan** = setup + months × monthly plan.
- **Start monthly, buy the code later** = what was paid so far + the cost to buy at that point.
- **Own from day one** = code price + months × maintenance plan (the owner also pays their own hosting, not included here).
- **Cost to buy at that point** = max(25% of code price, code price − setup − 50% of fees paid).

### Automation & Analysis

Setup ₹40,000 · monthly plan ₹18,000 · code price ₹1,25,000 · maintenance plan ₹9,000

| After | Stay on the monthly plan | Start monthly, buy later | Own from day one | Cost to buy at that point |
|---|---|---|---|---|
| 6 months | ₹1,48,000 | ₹1,79,250 | **₹1,79,000** | ₹31,250 |
| 12 months | ₹2,56,000 | ₹2,87,250 | **₹2,33,000** | ₹31,250 |
| 24 months | ₹4,72,000 | ₹5,03,250 | **₹3,41,000** | ₹31,250 |
| 36 months | ₹6,88,000 | ₹7,19,250 | **₹4,49,000** | ₹31,250 |

Owning from day one costs less than staying on the monthly plan after about **10 months** (15 months once about ₹3,000 a month of the owner's own hosting is counted). In return, the monthly plan costs less up front and I host and support it while the client decides.

### Custom Business Software

Setup ₹1,50,000 · monthly plan ₹20,000 · code price ₹2,50,000 · maintenance plan ₹10,000

| After | Stay on the monthly plan | Start monthly, buy later | Own from day one | Cost to buy at that point |
|---|---|---|---|---|
| 6 months | ₹2,70,000 | ₹3,32,500 | **₹3,10,000** | ₹62,500 |
| 12 months | ₹3,90,000 | ₹4,52,500 | **₹3,70,000** | ₹62,500 |
| 24 months | ₹6,30,000 | ₹6,92,500 | **₹4,90,000** | ₹62,500 |
| 36 months | ₹8,70,000 | ₹9,32,500 | **₹6,10,000** | ₹62,500 |

Owning from day one costs less than staying on the monthly plan after about **10 months** (15 months once about ₹3,000 a month of the owner's own hosting is counted). In return, the monthly plan costs less up front and I host and support it while the client decides.

### Mobile Apps

Setup ₹60,000 · monthly plan ₹15,000 · code price ₹1,25,000 · maintenance plan ₹7,500

| After | Stay on the monthly plan | Start monthly, buy later | Own from day one | Cost to buy at that point |
|---|---|---|---|---|
| 6 months | ₹1,50,000 | ₹1,81,250 | **₹1,70,000** | ₹31,250 |
| 12 months | ₹2,40,000 | ₹2,71,250 | **₹2,15,000** | ₹31,250 |
| 24 months | ₹4,20,000 | ₹4,51,250 | **₹3,05,000** | ₹31,250 |
| 36 months | ₹6,00,000 | ₹6,31,250 | **₹3,95,000** | ₹31,250 |

Owning from day one costs less than staying on the monthly plan after about **9 months** (15 months once about ₹3,000 a month of the owner's own hosting is counted). In return, the monthly plan costs less up front and I host and support it while the client decides.

Suggested chart (optional): a line chart of total paid over 48 months with three lines (stay = amber solid thick, buy later = ink solid, own from day one = muted dashed) and a marker line at the chosen month. Vary line weight and dash, not just colour.

---

## 7. Terms in short, and full terms (draft)

**Status:** plain-English draft, **awaiting a lawyer's review**. Not a contract. Do not add signature blocks.

### In short

- You pay a setup fee and a monthly plan. I host, maintain and support your software.
- Your data and your accounts are always yours. The code is yours when you buy it.
- Monthly plans have a 6-month minimum, with two ways to leave early.
- Small changes are included each month; bigger ones are quoted first.
- If I ever stop offering the service, the code and your data pass to you free.

1. **The service.** The monthly plan gives you the right to use the software I build for you for as long as the plan runs. I host and maintain it during that time.
2. **Scope.** Before work starts we agree in writing what I will build, the price, and every third-party service the system uses (for example AI models, WhatsApp Business API, Meta services, payment gateways, SMS and email), with what each is for.
3. **Fees and payment.** All prices exclude GST at 18%. Setup is paid in two parts: 50% at signing and 50% when it goes to live testing. Live testing is the testing phase, when real users first start using the software before it goes fully live. The monthly plan starts at go-live, after live testing, and is invoiced monthly. AI usage and third-party services are billed at cost as separate lines on the monthly bill. UPI is accepted.
4. **Changes.** For 90 days after go-live, adjustments to what I built are included; new features are not. After that, the plan includes up to 3 hours of small changes a month; unused hours do not roll over. Bigger changes, new features, new integrations and new third-party services are quoted before work starts, at a day rate of ₹10,000.
5. **Support.** On business days (Monday to Friday), I reply within 1 business day to issues that stop your work, and within 3 business days to everything else. A bug is anything that does not work as the agreed scope describes.
6. **Minimum term.** Monthly plans have a 6-month minimum. Maintenance plans after buying the code have a 3-month minimum. Website care plans and code purchases have no minimum.
7. **Ending the plan.** Inside the first 6 months, you can end the plan by paying two months' plan fees, or by buying the code. After 6 months, you can end it with 30 days' written notice. In every case, outstanding invoices are settled, setup fees already paid are not refunded, you receive an export of your data within 30 days, and the service then ends. After the export period your data is deleted from my servers.
8. **Late payment.** If an invoice is more than 15 days overdue, I will give 7 days' written notice and then pause the service. Your data is kept for 30 days after a pause so you can pay or take an export. If neither happens, the plan ends as under "Ending the plan".
9. **Buying the code.** You can buy the code at any time. The price is agreed before you commit. Setup already paid and half of the monthly fees already paid are deducted, and the price never goes below 25% of the agreed code price. You receive the code as it stands on the day of purchase, and the monthly plan ends. After that, you run hosting, or you can add a maintenance plan, which includes bug fixes, security updates and up to 3 hours of small changes a month. Problems caused by your own edits to the code are quoted separately. For example, on a mobile app with a ₹60,000 setup, a ₹15,000 monthly plan and a ₹1,25,000 code price, buying after 4 months costs ₹1,25,000 − ₹60,000 − ₹30,000 = ₹35,000.
10. **Ownership.** Until you buy it, the code remains mine. Your data is always yours. App store accounts, domains, WhatsApp numbers, payment gateways and similar accounts are created in your business's name; I manage them or am added as a developer, and I remove my access when the plan ends.
11. **If I stop offering the service.** If I stop offering the service for any reason, the code and your data pass to you free of charge, as they stand on that day.
12. **Websites.** Website files are handed over after final payment. Care plans are optional and have no minimum. A month that is cancelled part-way is billed in full.
13. **Governing law.** These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts at Raipur, Chhattisgarh.

**Marked as proposed defaults, not yet confirmed:** notice period, export window, overdue and warning days, reply times, the day rate. Still missing, for the lawyer: annual price review, liability cap, outage policy, data-protection clause. Do not invent text for these.

---

## 8. How we work, problems solved, and questions

### How we'll work (5 steps)

1. **Fill out the form, then a free call or Google Meet.** Tell me which services you need. I reply by email or WhatsApp within 48 hours, and we set up a call where you walk me through how things work today, your budget and when you'd like to start. I'll tell you whether you need custom software at all, or whether a free product already does the same job.
2. **Discovery, then a written proposal in 5–7 days.** If you're in or around Raipur, I visit your office, shop or warehouse to see how work gets done and which software, sheets and apps you use. If you're further away, you walk me through it on a screen share. You work with me personally throughout, from this first look to launch, with no salesperson or middleman in between. Within 5–7 days of the visit or walkthrough you get a written proposal, free and with no obligation: how I understand your business, what the system will do, and the scope, price, timeline and payment schedule. It stays valid for 21 days, and the detailed design comes after you approve it. If you'd like a deeper analysis before deciding, the paid workflow audit gives you a written report you keep, whether or not we build.
3. **Prototype, then built in stages.** Once you approve the proposal and pay 50% of the setup fee, I work out the detailed design and build a prototype as the first milestone. Your team signs it off before the full build. For larger systems we start with one workflow and expand. You see a demo at each milestone, and changes within the agreed scope are included; new features are quoted separately. The other 50% is due when it goes to live testing.
4. **Launch and training.** I set it up and run a handover session so your team knows how to use it. If you need more, such as extra sessions or on-site training, it's quoted in your proposal.
5. **After go-live.** The monthly plan keeps it hosted, up and secure, with bug fixes. We review how it's being used at 60–90 days. After the first 90 days, small changes up to 3 hours a month are included; bigger changes are quoted. If you buy the code outright, you get 30 days of free bug fixes after handover; after that, hosting is yours to run, or a maintenance plan covers bug fixes, security updates and up to 3 hours of small changes a month.

I'll sign an NDA before we talk if you want one.

### Six problems I solve

- **"We type the same data again and again."** Dispatch slips become invoices, POs go into your system, bills go into your books. All by hand.
- **"We don't know our real numbers until it's too late."** Sales, stock and dues sit in different sheets and different heads, so you find out what happened long after it could have helped.
- **"Everything happens on WhatsApp, and nothing is recorded."** Orders, production and dispatch get agreed in chats and are forgotten by evening.
- **"Payments always come in late."** Chasing money is awkward and easy to forget, so it stays with your customers longer than it should.
- **"Our dealer or distributor network is hard to manage."** Price lists, orders and ledgers live in different places, and every dealer question turns into a phone call.
- **"Every tool we try makes us change how we work."** Off-the-shelf software forces its own process on your business, and your team stops using it.

### Before you reach out

Automation only works when your team uses it. Most Indian businesses already work on WhatsApp, so that is the usual choice: I set up a dedicated WhatsApp Business number for your company. Telegram or a simple portal work too, and we can choose according to your use case. Someone on your side runs it day to day.

**Need a proper estimate?** Tell me which services you need and what's slowing your business down. Fill out the form, and you'll get a reply by email or WhatsApp within 48 hours.

### Common questions (filled in with current figures)

**Our team isn't very tech-savvy. Will this work for us?**  
Most likely. I keep the screens simple so teams pick them up quickly, and they work on a phone. A handover session is included in setup; extra or on-site training is quoted in your proposal. You'll need one person on your side who owns it day to day.

**Do we have to replace our current software?**  
No. I usually work with the data your software already exports, like Excel or CSV files, so you keep what you use today.

**How does the monthly plan work?**  
You pay a setup fee to get the software built, then a monthly fee to use it. Think of it as a licence: you use the software for as long as the plan runs, and you can buy the code whenever you like. The plan covers hosting, backups, uptime monitoring, bug fixes and security updates. For the first 90 days after go-live, adjustments to what I built are included. After that, up to 3 hours of small changes a month are included. Bigger changes are quoted before I start.

**Does the monthly fee go up for a bigger project?**  
A bigger system has more to host and support, so the monthly plan rises with the size of the project, but more slowly than the setup fee. As a rule of thumb, if the setup fee doubles, the monthly plan goes up by about 50%. The exact figures are agreed in your quote.

**What counts as a change?**  
If something doesn't work the way we agreed, it's a bug and I fix it free. If it works as agreed and you'd like it to work differently, or you want something new, that's a change.

**How quickly do you fix problems?**  
On working days (Monday to Friday), I reply to anything that stops your work within 1 business day, and to everything else within 3 business days.

**What if we want to own the code?**  
You can, at any time. You receive the code as it stands on the day you buy, and the monthly plan ends. The price is agreed before you commit, and what you've already paid counts toward it: the setup fee, plus 50% of your monthly fees. The price never drops below 25% of the agreed code price. For example, on a mobile app with a ₹60,000 setup, a ₹15,000 monthly plan and a ₹1,25,000 code price, buying after 4 months costs ₹1,25,000 − ₹60,000 − ₹30,000 = ₹35,000. After buying, you can run hosting yourself or keep me on a maintenance plan.

**Who owns our data?**  
You do, always. If the plan ends, you get a full export of your data. See also "What if we want to own the code?"

**Whose name are the accounts in?**  
Yours. App store accounts, your domain, your WhatsApp number and payment gateway are all created in your business's name. For the domain, you can buy it yourself and give me access, or I can buy it for you; either way it sits in your own account. I manage the rest for you, or you add me as a developer.

**Are there other costs?**  
GST at 18% is added to all prices. AI usage and third-party services such as WhatsApp are billed at cost, as separate lines on your monthly bill. Every service your system uses is listed in the agreement before work starts, so nothing new appears later without your approval.

**What if we want to stop?**  
Monthly plans start with a 6-month minimum. If you need to leave inside those 6 months, you can choose: pay two months' plan fees and end the plan, or buy the code. After 6 months you can leave with 30 days' notice. Either way you get an export of your data, and the accounts stay in your name.

**What if you stop working on this?**  
If I ever stop offering the service, the code and your data pass to you free of charge, so your business is never stuck.

**How do payments work?**  
Setup is paid in two parts: 50% at signing and 50% when it goes to live testing. Live testing is when real users first start using it, before it goes fully live. The monthly plan starts at go-live, after live testing, and is invoiced each month. UPI is accepted.

**Is our data safe?**  
Access is limited by role, your data is backed up weekly as standard, and I'll sign an NDA if you want one. Daily backups are available as a paid add-on.

**How long does it take?**  
Workflow automation takes 4–16 weeks, custom software 5–20 weeks, mobile apps 4–12 weeks and websites 1–5 weeks. The clock starts once you've sent your data and approvals. Your proposal will say exactly.

**Which AI do you use, and who pays for it?**  
I use the latest models from leading AI providers, picked for each task. AI usage and third-party fees such as WhatsApp aren't included in your monthly fee. They're billed at cost as separate lines on your monthly bill, and each one is named in the scope before we start.

**Can I see a demo built for my business before committing?**  
Yes. I can build a working demo around your own process and data, so you see exactly how it would work for you. It's priced as a small share of the estimated project fee, confirmed once we've discussed the scope of work (SOW).

**Can you build an app for millions of users?**  
That's not what I focus on. I build systems for businesses and their teams, dealers and customers, from a handful of users up to typically 50,000 to 90,000 monthly active users. I can also build MVPs designed to grow to that size. I'm a one-person studio, and that focus keeps your costs predictable and lets me give each client proper attention. If you're building a mass-market consumer app, a larger team will serve you better, and I'm happy to point you to one.

---

## 9. The estimate PDF (structure to design)

Generated in the browser after the visitor finishes the estimator, 2 pages. Variable content is in `{curly braces}`.

**Page 1**

1. 4pt amber top bar.
2. Title **Price estimate**, then meta: `Prepared for {name}, {business} · {date} · Valid until {date + 21 days}`.
3. **What you told me:** `You run a {business type} business and want to fix:` then the visitor's problem as a bold quote.
4. **Recommended solution:** the solution title in bold with ✓ bullets, plus "Bringing your existing records in" with one ✓ line (examples depend on business type). Add-ons (mobile app, website) appear as bold lines.
5. **Estimated price:** up to two boxes (surface, 1px line), the visitor's preferred route first.
   - *Monthly plan box:* title; row `Setup, paid 50% at signing and 50% at live testing` → `from {setup}`; row `Monthly plan` → `from {monthly} a month`; optional row `Website hosting and care (optional, no minimum)` → `{care} a month`; then fine print: setup covers the build, onboarding and moving existing records in (up to 3 source files, then quoted); the plan covers the right to use the software, hosting, uptime, backups, bug fixes and security updates, plus small changes up to 3 hours a month after the first 90 days; I keep the code; minimum 6 months from go-live, then 30 days' notice; monthly fees start at go-live, after live testing; early exit inside 6 months = two months' fees or buy the code; data always yours and exportable.
   - *Own the code box:* title; same setup row; row `Own the code` → `from about {buyout}`; row `Maintenance plan after buying, 3-month minimum` → `from {maintenance} a month`; fine print: price depends on the project and is agreed once scope is fixed; setup paid is deducted and 50% of monthly fees count, down to a minimum of 25% of the code price; code handed over as it stands on purchase day with a 30-day free bug-fix window; reusable core stays licensed for the client's own business only; hosting is theirs or add the maintenance plan.
   - *Website-only box:* title, setup row, optional care row, fine print: code handed over with setup; design and content changes after launch quoted separately; domain at cost.

**Page 2**

6. Fine print: "from" prices, not a quote; larger systems are quoted; prices exclude GST (18% added as a separate line on each invoice); monthly fees billed in advance by UPI; changes beyond the included small changes quoted at ₹10,000 a day.
7. **Timeline:** `about {x–y weeks} for the full build, starting once you've sent your data and approvals.`
8. Conditional: if the visitor chose more than 2,000 users, a muted line: `You chose more than 2,000 users, so this range is a rough guide. We'll size it properly on the call.`
9. Conditional (AI features chosen): `AI usage and third-party fees (WhatsApp and similar) are not included. They are billed at cost as separate lines on the monthly bill, and each one is named in the scope before work starts.`
10. **Callout** (tint): **This is an estimate. Your proposal comes after a free call.** · To book it, reply to sohamkar.work@gmail.com with a time that suits you. · Not ready to commit? A workflow audit and decision report is ₹10,000: a deeper look at your workflows and data, with a written report you keep whether or not we build. It's fully credited toward setup if you go ahead within 30 days.
11. **What's included** (✓ list): Built around how your business already works, using the data you already have · Simple screens that work on a phone · Setup and a handover session for your team · A demo at each stage while it's built · Your data is always yours.
12. Footer on both pages (section 3).

---

## 10. Checklist before any PDF is sent

- Every price says "from" and excludes GST. No price is shown without its unit (one time, per month).
- No "licence" or "retainer" in client-facing copy; "monthly plan" and "maintenance plan" instead.
- The setup payment is described as two parts (50% at signing, 50% at live testing), never three milestones.
- The code price is always "from about", quoted after scope. Floor of 25% is mentioned wherever the credit rule is explained.
- No case study, client logos, testimonials or results.
- Seller details slot left empty and marked until GSTIN, PAN, legal name and address exist.
- Currency symbol renders (use Inter). Indian digit grouping (₹1,25,000, not ₹125,000).
- Text on amber is navy. No amber text. Sharp corners. Map behind a 78% veil.
- Terms are labelled a plain-English summary, not a contract.

