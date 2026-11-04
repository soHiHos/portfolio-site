import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import services from "../content/services.json";

// Compact home-page "How I work": the steps from services.json (short `label` and `blurb`) as a connected timeline,
// across on large screens and down the left on small ones, linking to the full process and FAQ
export default function ProcessSection({ id }: { id?: string }) {
  const steps = services.process;
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="How I work" />
          <Link href="/services#process" className="btn-link text-sm text-fg">
            Full process and FAQ
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Reveal>
          <ol className="grid gap-0 border border-line bg-surface p-5 sm:p-8 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => {
              const last = i === steps.length - 1;
              return (
                <li key={step.step} className={`relative flex gap-4 lg:block lg:space-y-4 ${last ? "" : "pb-8 lg:pb-0"}`}>
                  {/* The line to the next step: down the left on small screens, across the top on large ones */}
                  {!last && <span className="absolute left-[1.0625rem] top-9 bottom-0 w-px bg-line lg:hidden" aria-hidden="true" />}
                  {!last && <span className="absolute left-12 right-[-1.5rem] top-[1.0625rem] hidden h-px bg-line lg:block" aria-hidden="true" />}
                  <span className="relative z-10 flex h-[2.125rem] w-[2.125rem] shrink-0 items-center justify-center bg-accent text-sm font-bold tabular-nums text-on-accent">
                    {i + 1}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold leading-snug text-fg">{step.label}</h3>
                    <p className="text-sm leading-relaxed text-muted">{step.blurb}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
