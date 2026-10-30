import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import { ESTIMATOR_ON } from "../components/estimator/estimate";
import services from "../content/services.json";

// Compact home-page "Services" strip: the service tiles, then the main button with availability beside it

// The six service categories, in funnel order: data first (the easiest way in), websites last
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

          {/* Each card spans two rows of the parent grid (subgrid), so across a row every card's tags start
              at the same height, whatever the length of its summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TILES.map((service) => (
              <Link
                key={service.id}
                href="/services"
                className="group row-span-2 grid grid-rows-subgrid gap-4 border border-line bg-surface p-5 transition-colors hover:border-accent/40"
              >
                <span className="space-y-1.5">
                  <span className="block text-base font-semibold text-fg group-hover:text-accent-ink transition-colors">{service.title}</span>
                  <span className="block text-sm leading-relaxed text-muted">{service.summary}</span>
                </span>
                <span className="flex flex-wrap content-start gap-1.5">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-accent-2/50 bg-accent-2/20 px-2 py-0.5 text-xs font-medium text-fg">
                      {tag}
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>

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
