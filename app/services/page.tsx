import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Mail, MessageCircle, PlayCircle } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import { CONTACT_EMAIL } from "../components/ui/menu/contact-menu";
import { ESTIMATOR_ON, QUESTIONS } from "../components/estimator/estimate";
import services from "../content/services.json";
import Estimator from "../components/estimator/estimator";
import ProblemTiles from "../components/services/problem-tiles";
import SideNav from "../components/side-nav";

export const metadata: Metadata = {
  title: "Services — Soham Kar",
  description: "Software and AI automations that remove manual work and give growing businesses clear numbers. Get a price estimate in two minutes.",
};

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Free 30-minute call")}`;

// Proof shows only what's finished: the case study once it's cleared (no "placeholder"), and any demo videos
const CASE_STUDY = services.proof.caseStudy.placeholder ? null : services.proof.caseStudy;
const DEMOS = services.proof.demos as { title: string; href: string }[];

const NAV = [
  { id: "problems", label: "Sound familiar" },
  ...(ESTIMATOR_ON ? [{ id: "estimate", label: "Estimate" }] : []),
  ...(CASE_STUDY || DEMOS.length > 0 ? [{ id: "proof", label: "Work in action" }] : []),
  { id: "process", label: "How we'll work" },
  { id: "faq", label: "Questions" },
  { id: "talk", label: "Let's talk" },
];

// The page's one call to action: the price estimator, with booking a call alongside. Without the
// estimator (pricing not yet reviewed), booking a call is the call to action.
function Actions({ dark }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {ESTIMATOR_ON && (
        <Link href="#estimate" className="btn btn-primary">
          Get your price estimate in 2 minutes <ArrowRight className="w-4 h-4" />
        </Link>
      )}
      <a href={MAILTO} className={ESTIMATOR_ON ? `btn-link text-sm ${dark ? "text-white" : "text-fg"}` : "btn btn-primary"}>
        <Mail className="w-4 h-4" /> Book a free 30-minute call
      </a>
    </div>
  );
}

// Services page: one line on what I do, the problems I solve, the estimator right under them, then proof, how we'll work,
// the FAQ and booking. No prices here: the estimator gives ranges, and the fixed quote comes after a call.
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

        {/* Sound familiar? */}
        <Reveal id="problems" className="space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">Sound familiar?</h2>
          <ProblemTiles items={services.problems.items} max={QUESTIONS.outcomes.max} selectable={ESTIMATOR_ON} />
        </Reveal>

        {/* The price estimator, right under the problems it prices */}
        {ESTIMATOR_ON && (
          <div id="estimate" className="scroll-mt-28 max-w-3xl space-y-5">
            <SectionHeading title="Get your price estimate" />
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
        <Reveal id="process" className="glass p-6 sm:p-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">How we&apos;ll work</h2>
          <ol className="relative grid sm:grid-cols-4 gap-6">
            <span className="hidden sm:block absolute left-0 right-0 top-4 border-t-2 border-dashed border-line" aria-hidden="true" />
            {services.process.map((step, i) => (
              <li key={step.step} className="group relative space-y-2">
                <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full panel border border-white/10 text-xs font-bold text-accent-ink transition-all duration-300 motion-safe:group-hover:scale-110 group-hover:bg-accent-2 group-hover:text-on-accent-2 group-hover:border-accent-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold text-fg transition-colors duration-300 group-hover:text-accent-ink">{step.step}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">{services.nda}</p>
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

        {/* Let's talk */}
        <Reveal id="talk" className="space-y-4">
          <div className="border border-white/10 panel text-white p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-bold">{services.cta.title}</h2>
              <p className="max-w-xl text-sm text-white/60">{services.cta.summary}</p>
            </div>
            <Actions dark />
            <span className="inline-flex items-center gap-2 text-xs text-white/50">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp details are shared in the reply
            </span>
          </div>
          <p className="text-sm text-muted">{services.cta.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
