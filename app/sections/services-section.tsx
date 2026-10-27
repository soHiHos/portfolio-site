import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import services from "../content/services.json";

// Compact home-page "Services" strip: availability, the service tiles, and a link to /services

// The three service categories: websites, CRM/ERP/SaaS products and AIaaS
const TILES = services.categories
export default function ServicesSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <SectionHeading title="Services" note="Hire me for your next build" />

        <Reveal className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <AvailabilityBadge />
            <Link href="/services" className="btn-link text-sm text-fg">
              View services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TILES.map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group flex items-stretch border border-line bg-surface overflow-hidden transition-colors hover:border-accent/40"
              >
                <span className="p-4 space-y-1">
                  <span className="block text-base font-semibold text-fg group-hover:text-accent-ink transition-colors">{service.title}</span>
                  <span className="block text-sm leading-relaxed text-muted">{service.summary}</span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
