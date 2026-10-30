import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import ITEMS from "../content/research.json";

// Publications as separate solid cream cards (bg-surface): year, field and venue, title, summary and DOI. On hover
// the card lifts, its border and title pick up the accent, and the year column fills with the accent.
// The landing page passes `limit` to show only the newest papers (research.json is newest first) plus a
// link to the full list on /about; the About page shows them all.
export function ResearchSection({ id, limit }: { id?: string; limit?: number }) {
  const items = limit ? ITEMS.slice(0, limit) : ITEMS

  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <SectionHeading title="Research" />

        <div className="space-y-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <a
                href={item.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative grid sm:grid-cols-[6rem_1fr] overflow-hidden border border-line bg-surface transition-[translate,border-color] duration-300 hover:border-accent/50 focus-visible:border-accent/50 motion-safe:hover:-translate-y-1"
              >
                {/* Year column: full-height strip (top strip on phones) that fills with the accent on hover */}
                <span className="px-5 py-3 sm:px-0 sm:py-7 sm:text-center border-b sm:border-b-0 sm:border-r border-line text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:bg-accent-2 group-hover:text-on-accent-2 group-hover:border-accent-2 group-focus-visible:bg-accent-2 group-focus-visible:text-on-accent-2 group-focus-visible:border-accent-2">
                  {item.year}
                </span>
                <div className="space-y-2 p-5 sm:p-7">
                  <span className="block text-xs font-medium text-muted">
                    <span className="text-accent-ink">{item.field}</span> · {item.venue}
                  </span>
                  <h3 className="flex items-start gap-2 text-lg sm:text-xl font-semibold leading-snug text-fg transition-colors duration-300 group-hover:text-accent-ink">
                    {item.title}
                    <ArrowUpRight className="mt-1 w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="text-base text-muted leading-relaxed">{item.shortSummary}</p>
                  <span className="block font-mono text-xs text-muted break-all">DOI {item.doi}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {items.length < ITEMS.length && (
          <Link href="/about#research" className="btn-link text-sm text-fg">
            View all research ({ITEMS.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </section>
  )
}

export default ResearchSection
