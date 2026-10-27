import type { Metadata } from "next";
import AboutSection from "../sections/about-section";
import AboutExtras from "../components/about-extras";
import ResearchSection from "../sections/research-section";
import Reveal from "../components/effects/reveal";
import journey from "../content/journey.json";

export const metadata: Metadata = {
  title: "About — Soham Kar",
  description: "Soham Kar's background: civil engineering, environmental research, entrepreneurship, and self-taught software, hardware and AI.",
};

export default function AboutPage() {
  return (
    <>
      <AboutSection id="about" />

      {/* Journey as a plain timeline (About page only, not on the landing page) */}
      <Reveal className="glass p-6 sm:p-8 space-y-4 mb-16">
        <h3 className="text-xl font-semibold text-fg">Journey</h3>
        <ol className="border-l border-line space-y-6 pl-6">
          {journey.map((stop) => (
            <li key={stop.code} className="relative">
              <span className="absolute -left-[calc(1.75rem+0.5px)] top-2 w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
              {"year" in stop && stop.year && <span className="block text-xs font-medium text-muted mb-0.5">{stop.year}</span>}
              <div className="text-base font-semibold text-fg">{stop.title}</div>
              <p className="text-sm text-muted leading-relaxed">{stop.detail}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Every paper; the landing page shows only the newest two and links here */}
      <ResearchSection id="research" />

      <AboutExtras />
    </>
  );
}
