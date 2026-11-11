import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import services from "../content/services.json";
import { SERVICE_CATEGORY, servicePath } from "../content/service-list";

// Service titles by id, so each pillar lists services by id and the names stay defined once in services.json
const SERVICE_TITLES: Record<string, string> = Object.fromEntries(
  services.categories
    .flatMap((c): { id?: string; title: string }[] => c.services)
    .flatMap((s) => (s.id ? [[s.id, s.title]] : []))
);
const CATEGORY_TITLES: Record<string, string> = Object.fromEntries(services.categories.map((c) => [c.id, c.title]));
const QUOTES: Record<string, string> = Object.fromEntries(services.problems.items.map((p) => [p.id, p.quote]));
// The apps and websites band reuses those service cards' titles and summaries
const ALSO = services.pillarsAlso;
const ALSO_CATEGORIES = ALSO.categories.map((id) => services.categories.find((c) => c.id === id)!);

// "What I do": the three pillars (digitise, automate, analyse), each with one problem it solves and the services
// that deliver it, linking to its main service's page. Each card spans five rows of the parent grid (subgrid), so titles,
// summaries, quotes, lists and links line up across the row whatever the length of the text
export default function PillarsSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="What I do" />
          <Link href="/services#problems" className="btn-link text-sm text-fg">
            The problems I solve
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.pillars.map((pillar, i) => (
            <Reveal key={pillar.id} delay={i * 100} className="row-span-5 grid grid-rows-subgrid">
              {/* Hover or keyboard focus: the border warms, an accent line draws across the top, the marker turns,
                  the list nudges right one item after another and the arrow slides. Reduced motion keeps only the colours.
                  The card opens the pillar's main service (its bottom link stretches over the whole card); each listed
                  service sits above that and opens its own category's page */}
              <div className="group relative row-span-5 grid grid-rows-subgrid gap-y-4 overflow-hidden border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent/40 sm:p-6">
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none" aria-hidden="true" />
                {/* Numbered, because the pillars are steps: digitise first, then automate, then analyse */}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="flex items-center gap-3 text-2xl font-bold text-fg transition-colors duration-300 group-hover:text-accent-ink">
                    <span className="w-[0.4em] h-[0.4em] bg-accent transition-transform duration-300 group-hover:rotate-45 group-focus-within:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
                    {pillar.title}
                  </h3>
                  <span className="text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:text-accent-ink" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted">{pillar.summary}</p>
                <p className="self-start border-l-2 border-accent pl-3 text-base font-medium leading-snug text-fg">
                  &ldquo;{QUOTES[pillar.problem]}&rdquo;
                </p>
                <div className="space-y-3 border-t border-line pt-4">
                  <p className="text-xs font-medium text-muted">What I set up</p>
                  <ul className="space-y-2">
                    {pillar.services.map((serviceId, j) => (
                      <li
                        key={serviceId}
                        className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-within:translate-x-0"
                        style={{ transitionDelay: `${j * 40}ms` }}
                      >
                        <Link
                          href={servicePath(SERVICE_CATEGORY[serviceId])}
                          className="relative z-10 flex items-start gap-2 text-sm leading-relaxed text-fg underline-offset-2 transition-colors hover:text-accent-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                          {SERVICE_TITLES[serviceId]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={servicePath(pillar.category)}
                  className="inline-flex items-center gap-1.5 self-end text-sm font-medium text-fg after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
                >
                  See {CATEGORY_TITLES[pillar.category]}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}

          {/* A slim band below the pillars, so visitors looking for just an app or a website see it here; the prices
              and details stay on the Services cards. It sits in the pillars' grid (all three columns) so the gap above
              it matches the gap between the cards. Side by side from md, stacked on phones */}
          <Reveal className="md:col-span-3 grid divide-y divide-line border border-line bg-surface md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:divide-x md:divide-y-0">
            {/* Navy panel (panel-dark, like the nav bar) with white text; a dark grey panel in the dark theme */}
            <div className="space-y-1.5 panel-dark p-5 sm:p-6">
              <h3 className="text-lg font-bold text-white">{ALSO.title}</h3>
              <p className="text-sm leading-relaxed text-white">{ALSO.body}</p>
            </div>
            {ALSO_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={servicePath(category.id)}
                className="group flex flex-col gap-1.5 p-5 transition-colors duration-300 hover:bg-fg/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink sm:p-6"
              >
                <span className="flex items-center justify-between gap-3 text-base font-bold text-fg transition-colors duration-300 group-hover:text-accent-ink">
                  {category.title}
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-muted">{category.summary}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
