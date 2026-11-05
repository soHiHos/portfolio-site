import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, PlayCircle } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import { ESTIMATOR_ON } from "../components/estimator/estimate";
import { RETAINER_NOTE } from "../components/services/category-price";
import PricePlans from "../components/services/price-plans";
import services from "../content/services.json";
import Estimator from "../components/estimator/estimator";
import ProblemTiles from "../components/services/problem-tiles";
import ProcessSteps from "../components/services/process-steps";
import SideNav from "../components/side-nav";
import ContactSection from "../sections/contact-section";

export const metadata: Metadata = {
  title: "Services — Soham Kar",
  description: `Software and AI automations that remove manual work and give growing businesses clear numbers.${ESTIMATOR_ON ? " Get a price estimate in two minutes." : ""}`,
};

// Proof shows only what's finished: the case study once it's cleared (no "placeholder"), and any demo videos
const CASE_STUDY = services.proof.caseStudy.placeholder ? null : services.proof.caseStudy;
const DEMOS = services.proof.demos as { title: string; href: string }[];

const NAV = [
  ...(ESTIMATOR_ON ? [{ id: "prices", label: "Prices" }] : []),
  { id: "problems", label: "Problems" },
  ...(ESTIMATOR_ON ? [{ id: "estimate", label: "Estimate" }] : []),
  ...(CASE_STUDY || DEMOS.length > 0 ? [{ id: "proof", label: "Work in action" }] : []),
  { id: "process", label: "How we'll work" },
  { id: "faq", label: "Questions" },
  { id: "talk", label: "Let's talk" },
];

// The page's one front door is the form; the free call follows my reply. With the estimator on, it sits alongside.
function Actions() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link href="#talk" className="btn btn-primary">
        Fill out the form <ArrowRight className="w-4 h-4" />
      </Link>
      {ESTIMATOR_ON && (
        <Link href="#estimate" className="btn-link text-sm text-fg">
          Get your price estimate in 2 minutes <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// Services page: one line on what I do, the prices in plain view, the problems I solve with the estimator right
// under them for an exact range, then proof, how we'll work, the FAQ and booking. The proposal comes after a call.
export default function ServicesPage() {
  return (
    <section id="services-page">
      <SideNav sections={NAV} />
      <div className="w-full text-left space-y-14 py-12">
        {/* Hero */}
        <div className="space-y-5">
          <SectionHeading title={services.hero.title} />
          <Reveal className="space-y-5">
            <Actions />
            <AvailabilityBadge />
          </Reveal>
        </div>

        {/* Prices in plain view: a range for every service, so nobody has to use the estimator to see them */}
        {ESTIMATOR_ON && (
          <Reveal id="prices" className="space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-fg">Services and prices</h2>
            <PricePlans categories={services.categories} />
            <p className="text-sm text-muted">{RETAINER_NOTE}</p>
            <Link href="#estimate" className="btn-link text-sm text-fg">
              Want a figure for your business? Use the estimator <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        )}

        {/* Sound familiar? */}
        <Reveal id="problems" className="space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">Six problems I solve</h2>
          <ProblemTiles items={services.problems.items} selectable={ESTIMATOR_ON} />
          <div id="before-you-reach-out" className="scroll-mt-28 border border-line bg-surface p-5 sm:p-6 space-y-4">
            <h3 className="text-lg font-semibold text-fg">{services.cta.requirement.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{services.cta.requirement.body}</p>
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-semibold text-fg">{services.cta.title}</span> {services.cta.summary}
            </p>
            <Link href="#talk" className="btn btn-primary btn-sm">
              Fill out the form <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* The price estimator, right under the problems it prices */}
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

        {/* Process */}
        <Reveal id="process" className="border border-line bg-white dark:bg-surface p-5 sm:p-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">How we&apos;ll work</h2>
          <ProcessSteps steps={services.process} />
          <p className="border-t border-line pt-4 text-sm text-muted">{services.nda}</p>
        </Reveal>

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
                <p className="pt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        {/* Let's talk: the project brief form */}
        <ContactSection id="talk" />
      </div>
    </section>
  );
}
