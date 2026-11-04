import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import { ESTIMATOR_ON } from "../components/estimator/estimate";
import { HOME_PRICES, RETAINER_NOTE } from "../components/services/category-price";
import services from "../content/services.json";

// Compact home-page "Services" strip: the service tiles, then the main button with availability beside it

// The four service categories, in funnel order: automations and analytics first (the easiest way in), websites last
const TILES = services.categories
export default function ServicesSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="Services" />
          <Link href="/services" className="btn-link text-sm text-fg">
            View services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Reveal className="space-y-6">

          {/* Two columns, like the services page. Every card has the same four parts in the same order: title,
              summary, the three prices side by side (once pricing is reviewed, like the estimator) and tags. Each
              card spans four rows of the parent grid (subgrid), so titles, summaries, prices and tags line up
              across a row whatever the length of the text */}
          <div className="grid gap-4 sm:grid-cols-2">
            {TILES.map((service) => (
              <Link
                key={service.id}
                href="/services"
                className="group row-span-4 grid grid-rows-subgrid gap-y-3 border border-line bg-surface p-5 transition-colors hover:border-accent/40 sm:p-6"
              >
                <span className="block self-end text-lg font-bold leading-snug text-fg transition-colors group-hover:text-accent-ink">{service.title}</span>
                <span className="block text-sm leading-relaxed text-muted">{service.summary}</span>
                {ESTIMATOR_ON ? (
                  <dl className="divide-y divide-line self-start border-y border-line sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {HOME_PRICES[service.id].map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between gap-3 py-2 sm:block sm:space-y-0.5 sm:px-3 sm:py-2.5 sm:first:pl-0 sm:last:pr-0">
                        <dt className="text-xs text-muted">{row.label}</dt>
                        <dd className="whitespace-nowrap text-sm font-semibold tabular-nums text-fg">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <span aria-hidden="true" />
                )}
                <span className="flex flex-wrap content-start gap-1.5">
                  {service.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-md border border-accent-2/50 bg-accent-2/20 px-2 py-0.5 text-xs font-medium text-fg">
                      {tag}
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>

          {ESTIMATOR_ON && <p className="text-sm text-muted">{RETAINER_NOTE}</p>}

          {/* The main button on the left, availability on the right (alone on the right while the estimator is off) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {ESTIMATOR_ON && (
              <Link href="/services#estimate" className="btn btn-primary">
                Get your estimate in 2 minutes <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <span className="ml-auto"><AvailabilityBadge /></span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
