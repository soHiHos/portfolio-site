import type { Metadata } from "next";
import { ChevronDown, Mail, MessageCircle } from "lucide-react";
import SectionHeading from "../components/section-heading";
import AvailabilityBadge from "../components/availability-badge";
import Reveal from "../components/effects/reveal";
import { CONTACT_EMAIL } from "../components/ui/menu/contact-menu";
import services from "../content/services.json";
import ServicesExplorer from "../components/services/services-explorer";
import PricingExtras from "../components/services/pricing-extras";

export const metadata: Metadata = {
  title: "Services — Soham Kar",
  description: "Hire Soham Kar for websites, CRM, ERP and SaaS products, and AI as a service (AIaaS). Fixed-quote projects or a licensed lease plan.",
};

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry")}`;

// Services page: the three categories (websites as ticket classes, CRM/ERP/SaaS, AIaaS), how you pay (lease, retainer),
// then the process, FAQ and booking. Starting prices are shown; the final price is a fixed quote after scoping.
export default function ServicesPage() {
  return (
    <section id="services-page">
      <div className="w-full text-left space-y-14 py-12">
        <div className="space-y-5">
          <SectionHeading title="Services" note="Built to your brief" />
          <Reveal className="flex flex-wrap items-center gap-4">
            <AvailabilityBadge />
            <span className="text-sm text-muted">Free scoping call · fixed quote within 48 hours</span>
          </Reveal>
        </div>

        {/* Questionnaire + plan switch (websites / custom builds / lease) */}
        <ServicesExplorer />

        {/* Monthly care and retainer, and the scale tiers */}
        <PricingExtras />

        {/* Process */}
        <Reveal className="glass p-6 sm:p-8 space-y-4">
          <div className="text-xs font-semibold tracking-[0.25em] text-muted">HOW IT WORKS</div>
          <ol className="relative grid sm:grid-cols-4 gap-6">
            <span className="hidden sm:block absolute left-0 right-0 top-4 border-t-2 border-dashed border-line" aria-hidden="true" />
            {services.process.map((step, i) => (
              <li key={step.step} className="relative space-y-2">
                <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full panel border border-white/10 text-xs font-bold text-accent-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold text-fg">{step.step}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* FAQ */}
        <Reveal className="space-y-4">
          <div className="text-xs font-semibold tracking-[0.25em] text-muted">FREQUENTLY ASKED</div>
          <div className="border border-line bg-surface divide-y divide-line">
            {services.faq.map((item) => (
              <details key={item.q} className="group px-5 py-4">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-base font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        {/* Booking */}
        <Reveal>
          <div className="border border-white/10 panel text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-[10px] font-semibold tracking-[0.25em] text-accent-ink">START A PROJECT</div>
              <h2 className="text-2xl sm:text-3xl font-bold">Have a project in mind?</h2>
              <p className="text-sm text-white/60">Send a short brief and I&apos;ll reply to set up a scoping call.</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <a href={MAILTO} className="btn btn-primary">
                <Mail className="w-4 h-4" /> Email a brief
              </a>
              <span className="inline-flex items-center justify-center gap-2 text-xs text-white/50">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp details are shared in the reply
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
