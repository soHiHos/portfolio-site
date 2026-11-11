import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Bot, Check, ChevronDown, X } from "lucide-react";
import SectionHeading from "../../components/section-heading";
import AvailabilityBadge from "../../components/availability-badge";
import Reveal from "../../components/effects/reveal";
import { ESTIMATOR_ON, inr } from "../../components/estimator/estimate";
import CompareDialog from "../../components/services/compare-dialog";
import CopyForAi from "../../components/services/copy-for-ai";
import { serviceMarkdown } from "../../components/services/service-markdown";
import { CATEGORY_PRICES, CATEGORY_SERVICE, HOME_TIMELINES, PRICE_NOTE, SIZE_LABELS, fillFaq, sizePrices, type SizeId } from "../../components/services/category-price";
import ProcessSection from "../../sections/process-section";
import ContactSection from "../../sections/contact-section";
import SideNav from "../../components/side-nav";
import { HOVER_CARD, TopLine, stagger } from "../../components/effects/hover-card";
import services from "../../content/services.json";
import { PRICING } from "../../content/pricing";
import { SITE_URL } from "../../content/contact";
import { PERSON_ID, pageMeta } from "../../content/seo";
import { pillarLabel, servicePath } from "../../content/service-list";

// One page per service category, at /services/<slug> (slugs in services.json). Only those slugs exist; anything
// else 404s. Every section comes from services.json: the page text in each category's `page`, plus the services it
// covers and the problems it solves by id. The software services (not websites) also have
// examples, what the monthly plan covers, third-party costs and what I need from the client, from the service PDFs.
// Prices show only once pricing is reviewed, worked out from pricing.ts at three project sizes.
export const dynamicParams = false;

// Spacing, kept the same everywhere on this page: cards are p-5 sm:p-6 with a 1rem gap between them; a card with a
// title and a list spaces them space-y-4, a title and a paragraph space-y-2, a small label and its list space-y-2,
// list items space-y-2, a label and a value space-y-1, and a footnote under a border sits pt-4. A section heading sits
// 2rem above its content (space-y-8) and the pieces of one section, a note under the heading included, are 1rem apart
// (space-y-4).
const CARD = HOVER_CARD;
// The two ways to pay (Option 1 and Option 2), highlighted in the accent so the prices stand out: an amber border and
// tint, and an amber tag with navy text (never amber text)
const OPTION_CARD = "!border-accent !bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))]";
const OPTION_TAG = "inline-block bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent";

type Example = { title: string; situation: string; build: string[]; size: SizeId; sizeNote: string };
type PdfContent = { examples?: Example[]; needFromYou?: string[]; thirdParty?: { name: string; text: string }[]; includesTitle?: string; includes?: { title: string; text: string }[] };

export function generateStaticParams() {
  return services.categories.map((c) => ({ slug: c.slug }));
}

const find = (slug: string) => services.categories.find((c) => c.slug === slug);

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = find(slug);
  if (!category) return {};
  const { metaTitle, metaDescription } = category.page;
  const path = servicePath(category.id);
  return pageMeta(`${metaTitle} · Soham Kar`, metaDescription, path);
}

const PROBLEMS = Object.fromEntries(services.problems.items.map((p) => [p.id, p]));

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const category = find(slug);
  if (!category) notFound();
  const { page } = category;
  const covers: { title: string; summary: string; for?: string }[] = category.services;
  const vertical = category.id === "websites";
  const hasFor = covers.some((s) => s.for);
  const problems = page.problems.map((id) => PROBLEMS[id]);
  const others = services.categories.filter((c) => c.id !== category.id);
  const price = CATEGORY_PRICES[category.id];
  const url = `${SITE_URL}${servicePath(category.id)}`;
  const { examples = [], needFromYou = [], thirdParty = [], includesTitle, includes = [] } = page as PdfContent;
  const sizes = sizePrices(category.id); // null for websites, which have no monthly plan
  const serviceKey = CATEGORY_SERVICE[category.id];
  const plan = services.planCovers;

  // The side nav: one tick per section that's on this page
  const nav = [
    { id: "for", label: "Who it's for" },
    { id: "covers", label: "What it covers" },
    ...(problems.length > 0 ? [{ id: "problems", label: "Problems" }] : []),
    ...(examples.length > 0 ? [{ id: "examples", label: "Examples" }] : []),
    ...(sizes ? [{ id: "plan", label: "Monthly plan" }] : []),
    ...(ESTIMATOR_ON && sizes ? [{ id: "prices", label: "Prices" }] : []),
    { id: "process", label: "How I work" },
    { id: "faq", label: "Questions" },
    { id: "others", label: "Other services" },
    { id: "contact", label: "Contact" },
  ];

  // Structured data for search engines and AI answer engines: the service, its FAQ and the breadcrumb trail
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: category.title,
        serviceType: category.title,
        description: page.metaDescription,
        url,
        areaServed: { "@type": "Country", name: "India" },
        provider: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: "Soham Kar",
          url: SITE_URL,
          address: { "@type": "PostalAddress", addressLocality: "Raipur", addressRegion: "Chhattisgarh", addressCountry: "IN" },
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: category.title,
          itemListElement: covers.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.summary } })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: fillFaq(f.a) } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Services", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 2, name: category.title, item: url },
        ],
      },
    ],
  };

  return (
    <section>
      <SideNav sections={nav} />
      {/* "<" escaped so the JSON can never close the script tag */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="w-full text-left space-y-14 py-12">
        {/* Heading: breadcrumb, pillars, title (availability at its top right) and intro, then the next step */}
        <Reveal className="space-y-6">
          <Link href="/services" className="btn-link text-sm text-muted">
            <ArrowLeft className="w-4 h-4" /> All services
          </Link>
          <div className="space-y-3">
            {category.pillars.length > 0 && <p className="text-sm font-medium text-muted">{pillarLabel(category.pillars)}</p>}
            <div className="flex items-start justify-between gap-4">
              <h1 className="min-w-0 text-4xl sm:text-5xl font-bold tracking-tight text-fg">{category.title}</h1>
              <div className="shrink-0 pt-2">
                <AvailabilityBadge />
              </div>
            </div>
            <p className="glass px-4 py-3 text-lg leading-relaxed text-muted">{page.intro}</p>
          </div>
          {/* The main button, and beside it the page as text to paste into an AI (wraps below on narrow screens) */}
          <div className="flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn btn-primary">
              Talk about your project <ArrowRight className="w-4 h-4" />
            </a>
            <CopyForAi markdown={serviceMarkdown(category)} />
          </div>
        </Reveal>

        {/* Who it's for, then a horizontal card below it: the timeline (and, once pricing is reviewed, the starting
            price beside it and the price breakdown in a row underneath) */}
        <Reveal id="for" className="scroll-mt-28 space-y-4">
          <div className={`${CARD} space-y-4 p-5 sm:p-6`}>
            <TopLine />
            <h2 className="text-2xl font-bold text-fg">Who it&apos;s for</h2>
            <ul className="space-y-2">
              {page.forWho.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-fg">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          {/* Separate cards side by side: the timeline, then (once pricing is reviewed) the two ways to pay, marked
              Option 1 and Option 2 so they read as alternatives. Websites have one price, as their files are handed
              over after payment */}
          <div className="grid gap-4 md:grid-flow-col md:auto-cols-fr">
            <dl className={`${CARD} space-y-1 p-5 sm:p-6`}>
              <TopLine />
              <dt className="text-sm font-semibold text-fg">Typical timeline</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent-ink">{HOME_TIMELINES[category.id]}</dd>
              <dd className="text-xs text-muted">from the day you&apos;ve sent your data and approvals</dd>
            </dl>
            {ESTIMATOR_ON && (
              <div className={`${CARD} space-y-1 p-5 sm:p-6 ${OPTION_CARD}`}>
                <TopLine />
                {price.ownFrom && <p className={OPTION_TAG}>Option 1 · Pay monthly</p>}
                <h3 className="text-sm font-semibold text-fg">{price.ownFrom ? "Monthly plan" : "Price"}</h3>
                <p className="text-lg font-semibold text-accent-ink">{price.price}</p>
                {price.ownFrom && (
                  <p className="text-xs leading-relaxed text-muted">
                    I host, maintain and support it. {PRICING.terms.minMonths}-month minimum.
                  </p>
                )}
              </div>
            )}
            {ESTIMATOR_ON && price.ownFrom && (
              <div className={`${CARD} space-y-1 p-5 sm:p-6 ${OPTION_CARD}`}>
                <TopLine />
                <p className={OPTION_TAG}>Option 2 · Pay once</p>
                <h3 className="text-sm font-semibold text-fg">Buy outright</h3>
                <p className="text-lg font-semibold text-accent-ink">{price.ownFrom}</p>
                <p className="text-xs leading-relaxed text-muted">{price.ownNote}</p>
              </div>
            )}
          </div>
          {/* The price breakdown in its own card, side by side inside it (the timeline is already above) */}
          {ESTIMATOR_ON && (
            <div className="border border-line bg-surface">
              <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
                {price.rows
                  .filter((row) => row.label !== "Typical timeline")
                  .map((row) => (
                    <dl key={row.label} className="space-y-1 p-5 sm:p-6">
                      <dt className="text-sm font-semibold text-fg">{row.label}</dt>
                      {row.points && (
                        <dd>
                          <ul className="space-y-1">
                            {row.points.map((point) => (
                              <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-fg">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-ink" aria-hidden="true" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      )}
                      <dd className="text-xs leading-relaxed text-muted">{row.hint}</dd>
                    </dl>
                  ))}
              </div>
              <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted sm:px-6">{PRICE_NOTE}</p>
            </div>
          )}
        </Reveal>

        {/* Everything the service covers */}
        <div id="covers" className="scroll-mt-28 space-y-8">
          <SectionHeading title="What it covers" />
          <div className="space-y-4">
            {/* Websites (three packages): tall cards three across; other services two across. Every card is the
                same: title and summary, then who it's for as a footnote under a border. The cards share two rows of
                the grid (subgrid), so in a row the summaries take the same height and the borders and footnotes line
                up whatever the length of the text */}
            <div className={`grid gap-4 ${vertical ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
              {covers.map((s, i) => (
                <Reveal key={s.title} delay={stagger(i)} className={`${CARD} grid gap-y-4 p-5 sm:p-6 ${hasFor ? "row-span-2 grid-rows-subgrid" : ""}`}>
                  <TopLine />
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-fg transition-colors duration-300 group-hover:text-accent-ink">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{s.summary}</p>
                  </div>
                  {s.for && (
                    <p className="border-t border-line pt-4 text-xs leading-relaxed text-muted">
                      <span className="font-semibold text-fg">For:</span> {s.for}
                    </p>
                  )}
                </Reveal>
              ))}
            </div>
            {/* What comes with every build (mobile apps, custom software), one cell each, four across on large screens; the 1px gap
                over the line colour draws the dividers. Without it, the category's one-line note */}
            {includes.length > 0 ? (
              <Reveal className="border border-line bg-surface">
                <h3 className="border-b border-line px-5 py-3 text-sm font-semibold text-fg sm:px-6">{includesTitle}</h3>
                <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
                  {includes.map((item) => (
                    <div key={item.title} className="space-y-1 bg-surface p-5 sm:p-6">
                      <dt className="flex items-start gap-2 text-sm font-semibold text-fg">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                        {item.title}
                      </dt>
                      <dd className="pl-6 text-xs leading-relaxed text-muted">{item.text}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : (
              "note" in category && category.note && <p className="glass px-4 py-3 text-sm text-muted">{category.note}</p>
            )}
            {/* An add-on (websites: the AI assistant), highlighted with an accent border and a gentle float.
                Reduced motion keeps it still. py-1.5 matches the 6px float, so it never comes closer than the
                usual 1rem to the pieces above and below */}
            {"addon" in category && category.addon && (
              <Reveal className="py-1.5">
                <div className={`${CARD} flex items-start gap-4 !border-accent p-5 motion-safe:animate-[btn-float_4s_ease-in-out_infinite] sm:p-6`}>
                  <TopLine />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-on-accent" aria-hidden="true">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted">{category.addon.label}</p>
                      <h3 className="text-lg font-bold text-fg transition-colors duration-300 group-hover:text-accent-ink">{category.addon.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{category.addon.body}</p>
                    </div>
                    {/* The two versions as a list */}
                    <ul className="space-y-2">
                      {category.addon.options.map((o) => (
                        <li key={o.name} className="flex items-start gap-2 text-sm leading-relaxed text-fg">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                          <span><span className="font-semibold">{o.name}.</span> {o.text}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-line pt-4 text-xs leading-relaxed text-muted">{category.addon.disclaimer}</p>
                  </div>
                </div>
              </Reveal>
            )}
            <div className="glass flex flex-wrap items-center gap-2 px-4 py-3">
              <span className="text-sm font-semibold text-fg">Typical uses:</span>
              {category.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-accent-2/50 bg-accent-2/20 px-2 py-0.5 text-xs font-medium text-fg">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* The problems from services.json this service solves, when there are any */}
        {problems.length > 0 && (
          <div id="problems" className="scroll-mt-28 space-y-8">
            <SectionHeading title="Problems it solves" />
            <div className="grid gap-4 md:grid-cols-2">
              {problems.map((p, i) => (
                <Reveal key={p.id} delay={stagger(i)} className={`${CARD} space-y-2 p-5 sm:p-6`}>
                  <TopLine />
                  <p className="border-l-2 border-accent pl-3 text-base font-medium leading-snug text-fg">&ldquo;{p.quote}&rdquo;</p>
                  <p className="text-sm leading-relaxed text-muted">{p.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Examples: illustrations, not client work; with prices for their size once pricing is reviewed */}
        {examples.length > 0 && (
          <div id="examples" className="scroll-mt-28 space-y-8">
            <div className="space-y-4">
              <SectionHeading title="Examples" />
              <p className="glass px-4 py-3 text-sm text-muted">These are illustrations, not client case studies or results. Your own quote follows the scope we agree.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {examples.map((ex, i) => {
                const p = sizes?.[ex.size];
                return (
                  // From lg the cards share rows (subgrid), so the heading, the build list, the size and the prices
                  // line up across the three cards whatever the length of the text
                  <Reveal
                    key={ex.title}
                    delay={stagger(i)}
                    className={`${CARD} flex flex-col gap-4 p-5 sm:p-6 lg:grid lg:grid-rows-subgrid ${ESTIMATOR_ON && sizes ? "lg:row-span-4" : "lg:row-span-3"}`}
                  >
                    <TopLine />
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold leading-snug text-fg transition-colors duration-300 group-hover:text-accent-ink">{ex.title}</h3>
                      <p className="text-sm leading-relaxed text-muted"><span className="font-semibold text-fg">The situation.</span> {ex.situation}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-fg">What I&apos;d build</p>
                      <ul className="space-y-2">
                        {ex.build.map((line, j) => (
                          <li
                            key={line}
                            className="flex items-start gap-2 text-sm leading-relaxed text-fg transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            style={{ transitionDelay: `${j * 40}ms` }}
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs leading-relaxed text-muted"><span className="font-semibold text-fg">Size.</span> {ex.sizeNote}</p>
                    {ESTIMATOR_ON && p && (
                      <dl className="divide-y divide-line border-t border-line text-sm">
                        {[
                          ["Setup (one time)", inr(p.setup)],
                          ["Monthly plan", `${inr(p.monthly)}/month`],
                          ["First year, before GST", inr(p.setup + 12 * p.monthly)],
                          ["Or buy outright", `from about ${inr(p.buyout)}`],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-baseline justify-between gap-3 py-2">
                            <dt className="text-xs text-muted">{label}</dt>
                            <dd className="font-semibold tabular-nums text-fg">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {/* The monthly plan and third-party costs (software services only; websites have a care plan instead) */}
        {sizes && (
          <div id="plan" className="scroll-mt-28 space-y-8">
            <SectionHeading title="What the monthly plan covers" />
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { title: "Included", items: plan.included, Icon: Check },
                  { title: "Not included: quoted, or billed at cost", items: plan.notIncluded, Icon: X },
                ].map(({ title, items, Icon }, i) => (
                  <Reveal key={title} delay={stagger(i)} className={`${CARD} space-y-4 p-5 sm:p-6`}>
                    <TopLine />
                    <h3 className="text-lg font-bold text-fg transition-colors duration-300 group-hover:text-accent-ink">{title}</h3>
                    <ul className="space-y-2">
                      {items.map(fillFaq).map((line) => (
                        <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-fg">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
              <p className="glass !border-l-2 !border-l-accent px-4 py-3 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-fg">The simple test.</span> {plan.test}
              </p>
              {thirdParty.length > 0 && (
                <Reveal className={`${CARD} space-y-4 p-5 sm:p-6`}>
                  <TopLine />
                  <h3 className="text-lg font-bold text-fg transition-colors duration-300 group-hover:text-accent-ink">Third-party and usage costs</h3>
                  <dl className="space-y-2">
                    {thirdParty.map((t) => (
                      <div key={t.name} className="text-sm leading-relaxed text-muted">
                        <dt className="inline font-semibold text-fg">{t.name}. </dt>
                        <dd className="inline">{t.text}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="border-t border-line pt-4 text-xs leading-relaxed text-muted">{plan.note}</p>
                </Reveal>
              )}
            </div>
          </div>
        )}

        {/* Prices at three project sizes, the same figures as the PDFs (only once pricing is reviewed) */}
        {ESTIMATOR_ON && sizes && (
          <div id="prices" className="scroll-mt-28 space-y-8">
            <div className="space-y-4">
              <SectionHeading title="Prices at three project sizes" />
              <p className="glass px-4 py-3 text-sm text-muted">
                All &ldquo;from&rdquo; prices, before GST. Bigger projects cost more to host and support, so the monthly plan rises more slowly than setup. Your own figures are agreed after scope.
              </p>
            </div>
            <div className="space-y-4">
            <Reveal className="overflow-x-auto border border-line bg-surface">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b border-line text-xs text-muted">
                  <tr>
                    {["Size", "Setup (one time)", "Monthly plan", "Buy outright, from about", "Maintenance after buying"].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {(Object.keys(SIZE_LABELS) as SizeId[]).map((id) => {
                    const p = sizes[id];
                    return (
                      <tr key={id}>
                        <th scope="row" className="px-4 py-3 font-semibold text-fg">{SIZE_LABELS[id]}</th>
                        <td className="px-4 py-3 tabular-nums text-fg">{inr(p.setup)}</td>
                        <td className="px-4 py-3 tabular-nums text-fg">{inr(p.monthly)}/month</td>
                        <td className="px-4 py-3 tabular-nums text-fg">{inr(p.buyout)}</td>
                        <td className="px-4 py-3 tabular-nums text-fg">{inr(p.maintenance)}/month</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Reveal>
            {/* The monthly plan against buying outright, for this service only */}
            <Reveal className={`${CARD} flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
              <TopLine />
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-semibold text-fg">Monthly plan or buy outright?</span> See what each route costs over time for your project size.
              </p>
              {serviceKey && <CompareDialog service={serviceKey} />}
            </Reveal>
            </div>
          </div>
        )}

        {/* flush: the page's own section gap spaces it, so it drops its built-in vertical padding */}
        <ProcessSection id="process" flush steps={"process" in page ? page.process : undefined} />

        {/* What the client brings, from the service PDFs */}
        {needFromYou.length > 0 && (
          <Reveal className={`${CARD} space-y-4 p-5 sm:p-6`}>
            <TopLine />
            <h2 className="text-2xl font-bold text-fg">What I need from you</h2>
            <ul className="space-y-2">
              {needFromYou.map(fillFaq).map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-fg">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* Questions about this service, then a link to the rest */}
        <div id="faq" className="scroll-mt-28 space-y-8">
          <SectionHeading title="Common questions" />
          <Reveal className="space-y-4">
          <div className="border border-line bg-surface divide-y divide-line">
            {page.faq.map((item) => (
              <details key={item.q} name="faq" className="faq group px-5 py-4 sm:px-6 transition-colors duration-300 hover:bg-bg open:bg-bg">
                <summary className="-my-4 py-4 flex items-center justify-between gap-4 cursor-pointer list-none text-base font-semibold text-fg transition-colors group-hover:text-accent-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pt-2 text-sm leading-relaxed text-muted">{fillFaq(item.a)}</p>
              </details>
            ))}
          </div>
          <Link href="/services#faq" className="btn-link text-sm text-fg">
            More questions about plans, payments and ownership <ArrowRight className="w-4 h-4" />
          </Link>
          </Reveal>
        </div>

        {/* The other services, so every service page links to the rest */}
        <div id="others" className="scroll-mt-28 space-y-8">
          <SectionHeading title="Other services" />
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((c, i) => (
              <Reveal key={c.id} delay={stagger(i)}>
              <Link
                href={servicePath(c.id)}
                className={`${CARD} flex h-full flex-col gap-2 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink sm:p-6`}
              >
                <TopLine />
                {c.pillars.length > 0 && <span className="text-xs text-muted">{pillarLabel(c.pillars)}</span>}
                <span className="flex items-center justify-between gap-3 text-lg font-bold text-fg transition-colors group-hover:text-accent-ink">
                  {c.title}
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-muted">{c.summary}</span>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* The brief form, with this service already picked */}
        <ContactSection id="contact" service={category.id} flush />
      </div>
    </section>
  );
}
