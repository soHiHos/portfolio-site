import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import PhoneCollapse from "../components/phone-collapse";
import { ESTIMATOR_ON } from "../components/estimator/estimate";
import { AUDIT_OFFER, HOME_PRICES, HOME_TIMELINES, PRICE_NOTE } from "../components/services/category-price";
import services from "../content/services.json";
import { pillarLabel, servicePath } from "../content/service-list";

// Compact home-page "Services" strip. "What I do" above already explains each service, so this is about cost and
// how to start: how the pricing works, the service tiles, the entry audit, then the main button. Everything about price shows only once pricing is reviewed (ESTIMATOR_ON), like the estimator.

// The four service categories, cheapest first (services.json order): websites, automation, apps, custom software
const TILES = services.categories
export default function ServicesSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={ESTIMATOR_ON ? "Services and prices" : "Services"} />
          <Link href="/services" className="btn-link text-sm text-fg">
            View services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Reveal className="space-y-6">
          {/* How the pricing works, before any number: most clients expect a one-time payment */}
          {ESTIMATOR_ON && (
            <div className="space-y-1">
              <p className="text-base font-semibold text-fg">{services.pricingIntro.title}</p>
              <p className="text-sm leading-relaxed text-muted">{services.pricingIntro.body}</p>
            </div>
          )}

          {/* Two columns, like the services page. Every card has the same four parts in the same order: title,
              summary, the three prices side by side (once pricing is reviewed) and the typical timeline. Each
              card spans four rows of the parent grid (subgrid), so they line up across a row whatever the length
              of the text */}
          {/* The title's link stretches over the whole card. Phones: the prices and timeline fold away behind a toggle,
              so the four cards stay short */}
          <div className="grid gap-4 sm:grid-cols-2">
            {TILES.map((service) => (
              <div
                key={service.id}
                className="group relative grid gap-y-3 sm:row-span-4 sm:grid-rows-subgrid border border-line bg-surface p-5 transition-colors hover:border-accent/40 sm:p-6"
              >
                <span className="block self-end space-y-1">
                  {service.pillars.length > 0 && <span className="block text-xs font-medium text-muted">{pillarLabel(service.pillars)}</span>}
                  <Link href={servicePath(service.id)} className="block text-lg font-bold leading-snug text-fg transition-colors group-hover:text-accent-ink after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink">{service.title}</Link>
                </span>
                <span className="block text-sm leading-relaxed text-muted">{service.summary}</span>
                <PhoneCollapse label={ESTIMATOR_ON ? "Prices and timeline" : "Typical timeline"}>
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
                <span className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-xs text-muted">Typical timeline</span>
                  <span className="font-semibold tabular-nums text-fg">{HOME_TIMELINES[service.id]}</span>
                </span>
                </PhoneCollapse>
              </div>
            ))}
          </div>

          {ESTIMATOR_ON && <p className="text-sm text-muted">{PRICE_NOTE}</p>}

          {/* For anyone unsure which service they need: the entry audit (it has a price, so only once pricing is
              reviewed), then an invitation to just get in touch, which always shows */}
          <p className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-fg">Not sure where to start?</span>{" "}
            {ESTIMATOR_ON && <>{AUDIT_OFFER} Still unsure? </>}
            Feel free to{" "}
            <a href="#contact" className="font-semibold text-accent-ink underline underline-offset-2 hover:no-underline">contact me</a>
            , and we&apos;ll work out the right first step together.
          </p>

          {/* The main button (availability is in the top nav, always on screen) */}
          {ESTIMATOR_ON && (
            <Link href="/services#estimate" className="btn btn-primary">
              Get your estimate in 2 minutes <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
