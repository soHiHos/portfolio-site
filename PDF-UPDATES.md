# PDF brief updates

**Written for:** whoever updates the three client PDF briefs in `pdf-content/` (Soham, or Claude working from this file), and then re-designs the PDFs in Penpot.

The service pages on the website were updated on 11 November 2026. The three briefs still describe the old content. This file lists every change each brief needs, with the new text ready to paste. The new text is copied from `app/content/services.json`, which is the source of truth: if the two ever disagree, the website wins.

**What stays the same in every brief:** all prices, the size tables, the payment schedule, monthly plan vs own the code, the general FAQ, the terms and the process. Only the service content changes.

**How to use this file**

1. Make the changes below in each brief (sections 1–4).
2. Update the branding in the master guide `PRICING-AND-SERVICES-FOR-PENPOT.md` (section 5).
3. Re-design or re-export each PDF in Penpot from the updated briefs.
4. Tick off the checklist at the end (section 7).

Section 6 is a changelog of every change made to the website's service pages, for reference.

---

## 1. Mobile Apps (`pdf-content/mobile-apps.md`)

### 1.1 Tagline (line 11)

Replace:

> Android and iOS apps for your team or your customers, from one Flutter codebase.

With:

> Android and iOS apps for your team, suppliers and buyers, from one Flutter codebase.

### 1.2 Who it is for (section 1, line 13)

Replace the whole sentence (field and floor staff, dealer ordering, customer ordering, companion apps) with:

**Who it is for:**

- Businesses whose purchase requests and approvals run on calls, chats and paper
- Manufacturers and distributors whose B2B buyers order again and again
- Teams spread across sites who need projects and updates in one place
- Businesses that send invoices, pay vendors and chase payments every week
- Founders who need a first version (MVP) that can grow

### 1.3 Problems it solves (section 2: new subsection)

The brief has no problems section. Add one above "What I build":

### Problems it solves

- **"We type the same data again and again."** Dispatch slips become invoices, POs go into your system, bills go into your books. All by hand.
- **"Everything happens on WhatsApp, and nothing is recorded."** Orders, production and dispatch get agreed in chats and are forgotten by evening.
- **"Our dealer or distributor network is hard to manage."** Price lists, orders and ledgers live in different places, and every dealer question turns into a phone call.
- **"Payments always come in late."** Chasing money is awkward and easy to forget, so it stays with your customers longer than it should.

### 1.4 What I build (section 2, lines 33–36)

Remove all four old cards: Field and floor apps, Dealer and distributor apps, Customer apps, Companion apps. Replace them with:

- **Procurement apps.** Supplier search, purchase requisitions and approvals from the phone, with every request recorded.
- **B2B eCommerce apps.** Your buyers browse the catalog, reorder in a few taps and check their account, ledger and order status.
- **Collaboration and companion apps.** Projects, tasks and team communication in one place, plus companion apps for the systems I build, so your team can use them on the go.
- **Mobile payment apps.** Send invoices, pay vendors and collect payments from the phone, with every payment tracked.

### 1.5 Every app includes (section 2, line 38)

Optional, to match the website: swap the one-line sentence for the four-item list.

**Every app includes**

- **Android and iPhone.** Built once, released on both.
- **Admin dashboard.** A web panel for your team to manage users, data and orders.
- **Secure login.** Each person sees only what their role allows.
- **Store publishing.** On the Play Store and App Store, under your business's name.

### 1.6 Typical uses (line 40)

Replace with:

> Typical uses: Procurement apps, B2B eCommerce apps, Collaboration & companion apps, Mobile payment apps.

### 1.7 AI add-on (section 2: new subsection)

Add it after "Typical uses". Design it as a highlighted callout (amber border), the same way as the AI assistant on the website.

**Add-on · AI, only where it's worth it**

Not every app needs AI. Most screens work best as plain, fast forms and lists. During discovery I'll suggest AI only where it makes the app easier to use and is worth its running cost for how much it'll be used. Quoted separately; AI usage is billed at cost.

- **Snap and fill.** Take a photo of a bill, label or order slip, and the app fills in the form.
- **Smart search.** Buyers and staff find products, suppliers or past orders by describing what they need.
- **In-app assistant.** Answers common questions from your catalog, policies and order status, any time of day.

*AI can make mistakes, including wrong or made-up answers, so I build it to suggest and fill in, and people check before it counts. I'm not responsible for its output or for decisions based on it.*

### 1.8 App store fees (section 2, third-party costs, line 61)

Replace "a one-time US$25 for Google Play and US$99 a year for Apple" with:

> a one-time fee of about ₹2,400 for Google Play and about ₹9,000 a year for Apple

### 1.9 Examples (section 5, lines 201–250)

Replace the title, situation, build and size note of all three examples. **Keep each example's price table exactly as it is.** The sizes stay in the same order (smallest, mid, upper end), so the figures don't change.

**Example 1: A procurement app for purchase requests and approvals** (replaces "A field app for supervisors and sales reps")

- **The situation.** Purchase requests come in by phone and WhatsApp, approvals wait on one person, and nobody can see what has been ordered.
- **What I would build.**
  - Procurement app: supplier search, requisitions and approvals from the phone, with every request recorded.
  - An admin dashboard and secure login, published to the Play Store and App Store.
- **Illustrative size.** One workflow and a handful of screens: the smallest size.

**Example 2: A B2B ordering app for dealers and buyers** (replaces "A dealer ordering app")

- **The situation.** Buyers phone in repeat orders and keep asking for price lists, balances and order status.
- **What I would build.**
  - B2B eCommerce app: catalog browsing, reordering and account management.
  - An admin dashboard for your team, secure login and publishing to both stores.
- **Illustrative size.** Two roles, a catalog and ledgers: a mid-sized project.

**Example 3: A payments app for invoicing, vendor payments and collections** (replaces "A customer app with ordering, tracking and support")

- **The situation.** Invoices go out late, vendor payments are tracked in a notebook, and collections depend on phone calls.
- **What I would build.**
  - Mobile payment app: invoicing, vendor payments and collections, with every payment tracked.
  - An admin dashboard, a payment gateway and integrations with your other systems, published to both stores.
- **Illustrative size.** Several roles, payments and integrations: the upper end of the typical range.

### 1.10 Questions clients ask (section 7: add app-specific questions)

The brief has only the general questions. Add these app questions at the top of section 7:

**Do you build for both Android and iPhone?**
Yes. Each app is built once in Flutter, Google's toolkit for making one app that runs on both, and released on both, so you don't pay for two separate apps.

**Do I need both Android and iPhone?**
Not always. An app for your own staff can go Android only if everyone on the team uses Android phones, which also saves the yearly Apple fee. Because the app is built once for both, adding iPhone later means testing and publishing it, not rebuilding it.

**Who owns and pays for the app store accounts?**
Your business. The Play Store and App Store accounts are created in your name, and you pay their fees directly to Google and Apple: a one-time fee of about ₹2,400 for Google Play and about ₹9,000 a year for Apple. I guide you through setting them up, then manage them for you, or you add me as a developer.

**How long do the app stores take to approve the app?**
Typically 7–14 days after I submit it, and sometimes longer. Apple and Google review every new app and every update, and sometimes ask for changes before approving; I handle the submission and anything the reviewers ask for. The store review is built into the timeline in your proposal.

**How do updates reach the people using the app?**
Through the Play Store and App Store, like any other app update. Bug fixes are covered by the monthly plan, and after the first 90 days small changes up to 3 hours a month are included; new screens or features are quoted first.

**Can the app connect to software we already use?**
Yes. The app can work with systems you already have, such as Tally, your website or a payment gateway. Each connection is named and priced in the scope before work starts.

**Does the app work on weak internet?**
Apps used on site or on the road can be built to keep working on weak or no internet and sync once the connection is back. This is agreed in the scope.

The website also asks "How many users can the app handle?". The brief already has "Can you build an app for millions of users?", which covers the same ground, so don't add both.

The brief's general FAQ has "Whose name are the accounts in?" twice (lines 287 and 314). Remove one.

### 1.11 Suggested layout (section 9, line 351)

Replace the page 2 line with:

> Page 2: what you get (four kinds of app), what every app includes, the problems it solves, and the AI add-on as a highlighted callout.

If page 2 gets too full, move the problems to page 5 with the scenarios.

---

## 2. Automation & Analysis (`pdf-content/workflow-automation.md`)

### 2.1 Service name (title and "Written for" line)

The website now calls this service **Automation & Analysis**, while the brief says "Workflow Automation". Choose one:

- **Rename** the brief and the PDF to "Automation & Analysis" to match the website (recommended), or
- **Keep** "Workflow Automation" for the PDF on purpose.

### 2.2 What I build (section 2, lines 40–47)

Replace all 10 old cards with the new 6.

| Old cards | Become |
|---|---|
| Paper to digital, Document capture | Paper and documents to data |
| WhatsApp, Telegram and mobile daily entry | unchanged |
| Invoice automation (order to cash), Collections autopilot | Invoicing and collections |
| Follow-up automation | unchanged |
| Business Pulse, Know your best customers, Decision Report | Business Pulse (automated MIS) |
| Market and price tracking | unchanged |

New text:

- **Paper and documents to data.** Send photos of registers, job cards and stock books, or forward bills, invoices and POs. I turn them into clean, searchable data in your records.
- **WhatsApp, Telegram and mobile daily entry.** Supervisors and staff log production, stock in and out, and dispatch from their phone with a simple form or a photo. It lands in your records for you to check and confirm.
- **Invoicing and collections.** Invoices drafted from dispatch slips or POs, with e-invoice and e-way bill details, sent after your approval and tracked until paid. A clear list of who owes what, with automatic reminders by email and WhatsApp.
- **Follow-up automation.** Enquiries, quotes and customer follow-ups sent on time by WhatsApp and email, so no lead goes cold.
- **Business Pulse (automated MIS).** Every week: a report on your phone and email and a simple dashboard of sales, stock, dispatch and dues, including who your best customers are and who has gone quiet. Or start with a one-off report: three months of data, three decisions to act on this month.
- **Market and price tracking.** Automatic checks of competitor prices, marketplace listings, tenders or supplier rates (public web data only), delivered to you as a daily or weekly sheet or alert.

The website card still says "AI reads them into clean, searchable data". In the PDF, use "I turn them into" as written above, so the card doesn't present AI as standard while the add-on calls it optional. The website card should get the same fix.

"Typical uses" (line 49) stays the same.

### 2.3 AI add-on (section 2: new subsection)

Add it after "Typical uses" as a highlighted callout.

**Add-on · AI, only where it's worth it**

Not every automation needs AI. Most run on plain, predictable rules. During discovery I'll suggest AI only where it saves real time and is worth its running cost for how much you'll use it. Quoted separately; AI usage is billed at cost.

- **Reading documents.** AI reads bills, invoices, POs and photos of registers, including handwriting, into clean data.
- **Drafted replies.** Follow-ups and replies to common customer questions drafted for your team to approve and send.
- **Ask your numbers.** Ask about sales, stock or dues in plain language and get an answer from your own data.

*AI can make mistakes, including wrong or made-up answers, so I build it to suggest and draft, and your team checks before acting on it. I'm not responsible for its output or for decisions based on it.*

### 2.4 What moves the price (section 3, line 82)

"…and whether they include AI steps" can stay. If you like, add: "AI is an add-on, suggested only where it's worth the cost."

### 2.5 Examples (section 5, lines 209–259)

Only the service names inside the "What I would build" lines change. Titles, situations, sizes and price tables stay the same.

**Example 1**

- "Order-to-cash automation:" → "**Invoicing and collections:**"
- "Document capture: AI reads bills…" → "**Paper and documents to data:** bills, invoices and POs read into clean data in your records."

**Example 2**

- "Collections autopilot:" → "**Invoicing and collections:**"
- The Business Pulse line stays.

**Example 3**

- "Paper to digital:" → "**Paper and documents to data:**"
- The daily entry and Business Pulse lines stay.

### 2.6 Questions clients ask (section 7: add service questions)

The brief has only the general questions. Add these from the website at the top of section 7:

**Does this work with Tally or our billing software?**
Usually, yes. I work with the exports your billing and accounting software already produces, such as Excel or CSV files, so you keep using what you have.

**Will WhatsApp messages come from our own number?**
Yes. I set up a dedicated WhatsApp Business number in your company's name, and reminders and updates go out from it. WhatsApp's message fees are billed at cost.

**What is Business Pulse?**
An automated MIS: a weekly report on your phone and email, plus a simple dashboard of sales, stock, dispatch and dues, with the few things that need your attention flagged and the customers who have gone quiet. If you'd rather start small, share three months of data for a one-off, one-page report with three decisions to act on.

**Do you use AI, and is our data safe?**
AI is used where it helps, such as reading bills and invoices, and its usage is billed at cost as a separate line. Access is limited by role and your data is backed up weekly.

The brief already has "Which AI do you use, and who pays for it?" (line 299). Keep it.

### 2.7 Suggested layout (section 9, line 360)

Replace "the eight workflows as small cards" with:

> Page 2: what you get (the six services as small cards), the problems it solves (quotes), and the AI add-on as a highlighted callout.

---

## 3. Custom Business Software (`pdf-content/custom-business-software.md`)

### 3.1 Who it is for (section 1, line 13)

Add manufacturers. The full list, to match the website:

- Businesses that have outgrown Excel sheets and WhatsApp groups
- Manufacturers tracking production, stock and dispatch across sheets and registers
- Distributors and brands managing dealers, agents or price tiers
- Teams paying per-user fees for software that doesn't fit
- Companies that need a tool for a job no product does well

### 3.2 Problems it solves (section 2, lines 31–34)

The brief has 2 problems; the website has 4. Replace with:

- **"Everything happens on WhatsApp, and nothing is recorded."** Orders, production and dispatch get agreed in chats and are forgotten by evening.
- **"Our dealer or distributor network is hard to manage."** Price lists, orders and ledgers live in different places, and every dealer question turns into a phone call.
- **"Every tool we try makes us change how we work."** Off-the-shelf software forces its own process on your business, and your team stops using it.
- **"We don't know our real numbers until it's too late."** Sales, stock and dues sit in different sheets and different heads, so you find out what happened long after it could have helped.

### 3.3 What I build (section 2, lines 36–39)

There were 2 cards; now there are 4. ERP and CRM are new, and Distribution OS is renamed:

- **ERP.** Orders, stock, production, purchase and dispatch in one system, linked to Tally, so everyone works from the same numbers.
- **CRM.** Leads, quotes, follow-ups and each customer's full history in one place, so your sales team knows whom to call and what was promised.
- **Dealer and distributor platform (Distribution OS).** One platform for dealers, distributors or agents: price tiers, orders, ledgers, payments and an online shop. Add a mobile app so your dealers can order from their phone.
- **Custom tools.** Something specific to your business? I build internal portals, calculators and quoting tools, and admin dashboards around how you already work.

"Typical uses" (line 41) stays the same.

### 3.4 Every system includes (section 2: new subsection)

Add it after "What I build":

**Every system includes**

- **Role-based login.** Each person sees only what their role allows.
- **Admin dashboard.** Users, settings and reports in one place.
- **Phone and desktop.** Works in the browser on both, with nothing to install.
- **Backups and export.** Weekly backups, and a full export of your data if the plan ends.

### 3.5 AI add-on (section 2: new subsection)

Add it after "Typical uses" as a highlighted callout.

**Add-on · AI, only where it's worth it**

Not every system needs AI. Your orders, stock, ledgers and approvals run best on plain, predictable software. During discovery I'll suggest AI only where it saves your team real time and is worth its running cost for how much you'll use it. Quoted separately; AI usage is billed at cost.

- **Reading documents.** Bills, invoices and POs read straight into the system, so nobody types them in.
- **Drafted quotes and messages.** Quotes, follow-ups and summaries drafted from your data for your team to check and send.
- **Ask your data.** Ask about orders, stock, dealers or customers in plain language and get an answer from your own records.

*AI can make mistakes, including wrong or made-up answers, so I build it to suggest and draft, and your team checks before acting on it. I'm not responsible for its output or for decisions based on it.*

### 3.6 Third-party costs (section 2, line 60 onwards)

Add one line, since the AI add-on can now apply to this service:

- **AI usage** (only if the AI add-on is used): billed at cost as a separate line on the monthly bill, and named in the scope before work starts.

### 3.7 Examples (section 5, lines 202–250)

Each price table stays with its size, so:

- **Example 1** (smallest size, line 202): keep it; only rename the service.
- **Example 2** (mid): new example. **Keep the old Example 2 mid price table.**
- **Example 3** (upper end): new example. **Keep the old Example 3 upper-end price table.**

**Example 1: A distributor whose dealers order by phone** (keep)

- In the build line, "Distribution OS:" → "**Dealer and distributor platform (Distribution OS):**"

**Example 2: A manufacturer running on sheets and registers** (replaces "A company that stopped using off-the-shelf software")

- **The situation.** Orders, production, stock and dispatch are tracked in separate Excel sheets and paper registers, so nobody knows what's in stock or what's running late until someone checks by hand.
- **What I would build.**
  - ERP: orders, stock, production, purchase and dispatch in one system, linked to Tally.
  - Role-based logins for the office, the floor and the owner, with an admin dashboard.
- **Illustrative size.** Several connected modules and a data move from sheets: a mid-sized project.

**Example 3: A company that stopped using off-the-shelf software** (replaces "A network business that needs the platform and the internal tools")

- **The situation.** The CRM they paid for per user forced its own process on the sales team, so everyone went back to sheets and chats.
- **What I would build.**
  - CRM: leads, quotes, follow-ups and each customer's full history, built around how the sales team already works.
  - Quoting tools and calculators on the same data, plus an admin dashboard.
- **Illustrative size.** Several modules, a data move from the old system and integrations: the upper end of the typical range.

### 3.8 Questions clients ask (section 7: add service questions)

Add these from the website at the top of section 7:

**Why custom software instead of an off-the-shelf product?**
When a product fits your process, I'll tell you to use it. Custom software makes sense when a product forces its own process on you, charges per user, or can't handle your pricing, approvals or reports.

**Can you move our existing data in?**
Yes. Setup includes moving your existing records in from up to 3 source files, such as Excel sheets or software exports. More are quoted.

**Can it connect to Tally or a payment gateway?**
Yes. Integrations such as Tally or payments are scoped and priced in your proposal.

**Can we start small?**
Yes. For larger systems we start with one workflow, then expand once your team is using it.

**How is this different from Zoho, Tally or a ready-made ERP?**
Tally stays your accounting system, and the software I build works alongside it. Ready-made ERPs and CRMs like Zoho suit businesses whose process matches theirs, and charge for every user. A custom system follows your own pricing, approvals and reports, with no per-user fees.

**Are we locked in to you?**
No. Your data is yours, with a full export if the plan ends. You can buy the source code outright at any time, and if I ever stop offering the service, the code and your data pass to you free of charge.

### 3.9 Suggested layout (section 9, line 351)

Replace "what you get (Distribution OS and custom tools)" with:

> Page 2: what you get (ERP, CRM, dealer and distributor platform, custom tools), what every system includes, the problems it solves, and the AI add-on as a highlighted callout.

---

## 4. All three briefs

### 4.1 Checklist (section 10)

Add these lines to each checklist:

- AI is an add-on, suggested only where it's worth the cost. Never show it as included or standard.
- Service names match the website exactly. No old names: Field and floor apps, Dealer ordering, Customer apps, Companion apps (on their own), Paper to digital, Document capture, Collections autopilot, Know your best customers, Decision Report as a card. "Distribution OS" appears only in brackets after "Dealer and distributor platform".
- Rupee amounts only. No dollar figures.

### 4.2 Not affected

- **The paid "workflow audit and decision report" (₹10,000).** It appears in `PRICING-AND-SERVICES-FOR-PENPOT.md` and the estimate PDF. It's a separate paid offer, not the old Decision Report card, so leave it.
- **`PRICING-AND-SERVICES-FOR-PENPOT.md`.** The design system, fonts and colours are unchanged.

---

## 5. Branding and positioning (`PRICING-AND-SERVICES-FOR-PENPOT.md`)

The master guide was written on 8 November 2026. Since then the website's positioning has moved to apps, websites and software built on three pillars: digitise, automate, analyse. AI is now an add-on, not the headline. The colours, fonts, shapes, page setup and background images have **not** changed.

### 5.1 Brand description (section 2, line 28)

Replace:

> A one-person software and AI automation studio in Raipur, Chhattisgarh, India, serving growing businesses (target market: India).

With:

> A one-person studio in Raipur, Chhattisgarh, India, that builds apps, websites and software for growing businesses (target market: India). The work takes a business off paper, automates the routine work and shows the owner clear numbers.

The brand name stays **Soham Kar**.

### 5.2 Positioning (section 2: add after line 31)

Add these lines:

- **Headline promise (use as written):** "I build apps, websites and software that take your business off paper, automate the routine work and show you clear numbers."
- **Three pillars, always in this order:** digitise, then automate, then analyse. They are steps, so number them 1, 2, 3 if they're shown together.
  - **Digitise:** Registers, paper slips and WhatsApp orders move into one system your team can use from any phone.
  - **Automate:** Invoices, follow-ups and payment reminders go out on their own. You approve, and the system does the rest.
  - **Analyse:** Sales, stock, dues and customers in one weekly report, with the few things that need your attention flagged.
- **Apps and websites are headline services too:** "Need just one of these? I build both on their own, and they're how the three steps above reach your team and your customers."
- **AI is an add-on:** "Not every build needs AI. I suggest it only where it saves real time and is worth its running cost." Never call the studio an "AI studio" or present AI as included.
- **Website title for reference:** "Soham Kar · Apps, websites, digitalisation and automation".

### 5.3 Words to use and avoid (section 2, table at line 35)

Add these rows:

| Use | Avoid |
|---|---|
| apps, websites and software | AI automation studio, AI agency |
| AI add-on, AI where it's worth it | AI-powered (as a blanket claim) |
| digitise, automate, analyse | digital transformation |
| Android and iPhone | Android and iOS (fine in technical lines; "iPhone" in client copy) |
| about ₹2,400 / about ₹9,000 a year (store fees) | US$25 / US$99 |

### 5.4 Service summaries (section 5, lines 158–187)

Two of the four one-line summaries changed on the website:

- **Automation & Analysis (line 160):** replace "Connect WhatsApp or Telegram, invoices, spreadsheets and your other tools so routine work runs on its own." with "Invoicing, follow-ups and payment reminders run on their own, and your numbers arrive as a clear weekly report."
- **Mobile Apps (line 178):** replace "Android and iOS apps for your team or your customers, from one Flutter codebase." with "Android and iPhone apps for your team, suppliers and buyers, built once for both."
- **Custom Business Software and Websites:** no change.

### 5.5 Pricing intro (section 5, line 154)

The website's last sentence changed. Replace "If you ever want to own the code, you can." with:

> If you'd rather own it, you can buy it outright at any time.

### 5.6 New components (section 3, "Shape and components", after line 107)

The website now has two new highlight styles. Use them in the PDFs too:

- **Price option card** (Option 1 · Pay monthly / Option 2 · Pay once): 1px amber `#e8a33d` border, a light amber fill `#f8f3ea` (10% amber over the surface colour), and a small tag at the top with an amber fill, navy `#102a43` 8pt SemiBold text and square corners. Use it wherever the two ways to pay sit side by side. Both options get the same treatment, since there is only one accent colour.
- **Add-on callout** (the AI add-on): a surface `#fafcfd` card with a 1px amber border, a square amber icon tile (navy robot/bot glyph) on the left, then a small muted "Add-on" label, the title in Space Grotesk bold, the body, the three options as a ticked list, and the disclaimer in small muted text under a 1px line.

### 5.7 Not relevant to the PDFs

These branding changes on the website don't apply to print:

- Glass panels on the map now use a heavier 32px blur.
- Social icons (LinkedIn, GitHub, Instagram, Facebook) fill with their own brand colours on hover. This is the only use of non-token colours, and it's web-only.

---

## 6. Changelog: changes made to the website's service pages

All content is in `app/content/services.json` unless noted. These changes are made on the website; sections 1–5 carry them into the PDFs.

### 6.1 Mobile Apps (`/services/mobile-apps`)

- **What it covers:** the old 4 cards (Field and floor, Dealer and distributor, Customer, Companion) were replaced by Procurement, B2B eCommerce, Collaboration and companion, and Mobile payment apps. Logistics and supply chain apps was added, then removed.
- **Card summaries:** rewritten as full sentences.
- **Typical uses chips:** now match the 4 cards.
- **Intro, meta description and category summary:** rewritten for procurement, B2B ordering, collaboration and payment apps.
- **Who it's for:** rewritten (5 lines).
- **Problems it solves:** 2 cards → 4 (added retyping and payments).
- **Examples:** all three replaced (procurement, B2B ordering, payments).
- **FAQ:**
  - App store fees are now in rupees (about ₹2,400 and about ₹9,000 a year).
  - Store approval is now "typically 7–14 days, and sometimes longer".
  - The weak internet answer now says "Apps used on site or on the road".
- **AI add-on:** added (Snap and fill, Smart search, In-app assistant).
- **Home page:** "Procurement apps" replaced "Field and floor apps" in the Digitise pillar. "Mobile payment apps" was added to the Automate pillar.

### 6.2 Automation & Analysis (`/services/automation-and-analysis`)

- **What it covers:** 10 cards → 6. Merged cards keep their old ids, so links still work.
  - Paper and documents to data (from Paper to digital and Document capture)
  - Invoicing and collections (from Invoice automation and Collections autopilot)
  - Business Pulse (absorbed Know your best customers and Decision Report)
  - Daily entry, Follow-up automation and Market and price tracking are unchanged.
- **Examples:** build lines renamed to the new card names.
- **FAQ:** "What is Business Pulse?" now mentions quiet customers and the one-off report.
- **AI add-on:** added (Reading documents, Drafted replies, Ask your numbers).
- **Home page pillars:**
  - Automate is now Invoicing and collections, Follow-up automation and Mobile payment apps.
  - Analyse is now Business Pulse and Market and price tracking.
- **Still to do on the website:** the "Paper and documents to data" card still says "AI reads them".

### 6.3 Custom Business Software (`/services/custom-software`)

- **What it covers:** 2 cards → 4 (ERP and CRM added, Distribution OS renamed to "Dealer and distributor platform (Distribution OS)" with a line about adding a mobile app).
- **Who it's for:** manufacturers line added.
- **Problems it solves:** 3 cards → 4 (added WhatsApp).
- **Examples:** the second Distribution OS example was removed. Added a manufacturer ERP example (mid) and turned the off-the-shelf example into a per-user CRM (upper end).
- **FAQ:** added "How is this different from Zoho, Tally or a ready-made ERP?" and "Are we locked in to you?".
- **Every system includes:** new section (role-based login, admin dashboard, phone and desktop, backups and export).
- **AI add-on:** added (Reading documents, Drafted quotes and messages, Ask your data).

### 6.4 Websites (`/services/websites`)

- **No changes.** It keeps its own AI assistant add-on.

### 6.5 All service pages (code)

- **`app/services/[slug]/page.tsx`:**
  - The "Every … includes" heading now comes from a new `includesTitle` field in the content, instead of always saying "Every app includes".
  - The Option 1 and Option 2 price cards are highlighted: amber border, light amber fill, and an amber tag with navy text. Websites, with a single price, stay plain.
- **`app/components/services/service-markdown.ts`:** the Copy for AI text uses the same `includesTitle`.
- **Prices visible only in development:** the price cards show only in local development until `reviewed: true` is set in `app/content/pricing.ts`.

### 6.6 Not changed (on purpose)

- **Estimator labels** in `app/content/pricing.ts` still say "Collections autopilot", "Order-to-cash automation and document capture" and "Distribution OS". They name what a visitor wants to fix, so they don't have to match the cards.
- **The paid workflow audit and decision report (₹10,000)** is a separate offer, unchanged.

---

## 7. After the briefs are updated

- [ ] Mobile Apps brief updated (1.1–1.11)
- [ ] Automation & Analysis brief updated (2.1–2.7)
- [ ] Custom Business Software brief updated (3.1–3.9)
- [ ] Checklist lines added to all three (4.1)
- [ ] Master guide branding updated (5.1–5.6)
- [ ] All three PDFs re-designed or re-exported in Penpot, using the new option card and add-on callout styles
- [ ] Website card "Paper and documents to data": "AI reads them" changed to "I turn them" (2.2)
