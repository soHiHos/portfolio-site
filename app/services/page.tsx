import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, PlayCircle } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import { ESTIMATOR_ON } from "../components/estimator/estimate";
import PricePlans from "../components/services/price-plans";
import { PRICE_NOTE, fillFaq } from "../components/services/category-price";
import services from "../content/services.json";
import Estimator from "../components/estimator/estimator";
import ProblemTiles from "../components/services/problem-tiles";
import ProcessSteps from "../components/services/process-steps";
import SideNav from "../components/side-nav";
import ContactSection from "../sections/contact-section";
import { HOVER_CARD, TopLine } from "../components/effects/hover-card";
import { pillarCategories, servicePath } from "../content/service-list";

export const metadata: Metadata = {
  title: "Services: digitalisation, automation and analysis · Soham Kar",
  alternates: { canonical: "/services" },
  description: `Digitalisation, automation and analysis for growing businesses in India. ${services.hero.title}.${ESTIMATOR_ON ? " Get a price estimate in two minutes." : ""}`,
};

// Proof shows only what's finished: the case study once it's cleared (no "placeholder"), and any demo videos
const CASE_STUDY = services.proof.caseStudy.placeholder ? null : services.proof.caseStudy;
const DEMOS = services.proof.demos as { title: string; href: string }[];

const NAV = [
  { id: "prices", label: ESTIMATOR_ON ? "Prices" : "Services" },
  { id: "problems", label: "Problems" },
  { id: "process", label: "How I work" },
  ...(ESTIMATOR_ON ? [{ id: "estimate", label: "Estimate" }] : []),
  ...(CASE_STUDY || DEMOS.length > 0 ? [{ id: "proof", label: "Work in action" }] : []),
  { id: "faq", label: "Questions" },
  { id: "talk", label: "Let's talk" },
];

// Services page: the page heading and one line on what I do, the service cards (with prices in plain view once
// pricing is reviewed), the problems I solve, how I work, the estimator, proof, the FAQ and booking. The proposal
// comes after a call.
export default function ServicesPage() {
  return (
    <section id="services-page">
      <SideNav sections={NAV} />
      <div className="w-full text-left space-y-14 py-12">
        {/* The service cards always show, so visitors can see what I offer; the prices, the pricing intro and the
            notes under the cards only once pricing is reviewed (ESTIMATOR_ON) */}
        <Reveal id="prices" className="space-y-5">
          {/* The heading on the left, availability on the right (below it on narrow screens) */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              {/* The three pillars, the same kicker line as the home hero */}
              <p className="text-sm font-medium text-muted">Apps · Websites · Digitalisation · Automation · Analysis</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg">{ESTIMATOR_ON ? "Services and prices" : "Services"}</h1>
            </div>
            <AvailabilityBadge />
          </div>
          {ESTIMATOR_ON && (
            <div className="glass space-y-2 px-4 py-3">
              <p className="text-lg font-semibold text-fg">{services.pricingIntro.title}</p>
              <p className="text-sm leading-relaxed text-muted">{services.pricingIntro.body}</p>
            </div>
          )}
          {/* A short guide from the three pillars on the home page to the service cards below: each pillar's
              main service first, then the others that deliver it */}
          <div className="border border-line bg-surface">
            <p className="border-b border-line px-5 py-3 text-sm font-semibold text-fg sm:px-6">Not sure which service? Start from what you want to do</p>
            <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
              {services.pillars.map((pillar) => (
                <div key={pillar.id} className="space-y-2 p-5 sm:p-6">
                  <p className="flex items-center gap-2 text-base font-bold text-fg">
                    <span className="h-2 w-2 bg-accent" aria-hidden="true" />
                    {pillar.title}
                  </p>
                  <ul className="space-y-1">
                    {pillarCategories(pillar).map((c) => (
                      <li key={c.id}>
                        <Link href={servicePath(c.id)} className="btn-link text-sm text-fg">
                          {c.title} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <PricePlans categories={services.categories} showPrices={ESTIMATOR_ON} />
          {ESTIMATOR_ON && (
            <>
              <p className="glass px-4 py-3 text-sm text-muted">
                {PRICE_NOTE}{" "}
                <Link href="/terms" className="font-semibold text-accent-ink underline underline-offset-2 hover:no-underline">Read the full terms.</Link>
              </p>
              <Link href="#estimate" className="btn-link text-sm text-fg">
                Want a detailed breakdown for your business, emailed to you? Use the estimator <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </Reveal>

        {/* Sound familiar? */}
        <Reveal id="problems" className="space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">Six problems I solve</h2>
          <ProblemTiles items={services.problems.items} selectable={ESTIMATOR_ON} />
          <div id="before-you-reach-out" className={`${HOVER_CARD} scroll-mt-28 space-y-4 p-5 sm:p-6`}>
            <TopLine />
            <h3 className="text-lg font-semibold text-fg transition-colors duration-300 group-hover:text-accent-ink">{services.cta.requirement.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{services.cta.requirement.body}</p>
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-semibold text-fg">{services.cta.title}</span> {services.cta.summary}
            </p>
            <Link href="#talk" className="btn btn-primary btn-sm">
              Fill out the form <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* Process */}
        <Reveal id="process" className={`${HOVER_CARD} space-y-5 p-5 sm:p-6`}>
          <TopLine />
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">How I work</h2>
          <ProcessSteps steps={services.process.map((s) => ({ step: fillFaq(s.step), detail: fillFaq(s.detail) }))} />
          <p className="border-t border-line pt-4 text-sm text-muted">{services.nda}</p>
        </Reveal>

        {/* The price estimator, after how we work */}
        {ESTIMATOR_ON && (
          <div id="estimate" className="scroll-mt-28 space-y-5">
            <SectionHeading title="Get a price estimate" />
            <Reveal>
              <Estimator />
            </Reveal>
          </div>
        )}

        {/* Proof */}
        {(CASE_STUDY || DEMOS.length > 0) && (
          <Reveal id="proof" className="space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-fg">Work in action</h2>
            {DEMOS.length > 0 && (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMOS.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 border border-line bg-surface p-4 hover:border-accent/50 transition-colors">
                      <PlayCircle className="w-5 h-5 shrink-0 text-accent-ink" aria-hidden="true" />
                      <span className="text-sm font-semibold text-fg group-hover:text-accent-ink transition-colors">{d.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {CASE_STUDY && (
              <article className="border border-line bg-surface p-5 sm:p-6 space-y-4">
                <h3 className="text-lg font-semibold text-fg">{CASE_STUDY.title}</h3>
                <p className="text-sm leading-relaxed text-muted"><span className="font-semibold text-fg">The business.</span> {CASE_STUDY.business}</p>
                <p className="text-sm leading-relaxed text-muted"><span className="font-semibold text-fg">The problem.</span> {CASE_STUDY.problem}</p>
                <div className="space-y-2">
                  <p className="text-sm text-muted"><span className="font-semibold text-fg">What I built.</span> {CASE_STUDY.builtIntro}</p>
                  <ul className="space-y-1.5">
                    {CASE_STUDY.built.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-fg">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                {CASE_STUDY.result && <p className="text-sm leading-relaxed text-muted"><span className="font-semibold text-fg">The result.</span> {CASE_STUDY.result}</p>}
              </article>
            )}
          </Reveal>
        )}

        {/* FAQ */}
        <Reveal id="faq" className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">Common questions</h2>
          <div className="border border-line bg-surface divide-y divide-line">
            {services.faq.map((item) => (
              <details key={item.q} name="faq" className="faq group px-5 py-4 transition-colors duration-300 hover:bg-bg open:bg-bg">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-base font-semibold text-fg transition-colors group-hover:text-accent-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pt-2 text-sm leading-relaxed text-muted">{fillFaq(item.a)}</p>
              </details>
            ))}
          </div>
        </Reveal>

        {/* Let's talk: the project brief form */}
        <ContactSection id="talk" flush />
      </div>
    </section>
  );
}
