import { ArrowUpRight, BadgeCheck, Trophy } from "lucide-react"
import SectionHeading from "./section-heading"
import Reveal from "./effects/reveal"
import certifications from "../content/certifications.json"
import SkillsMarquee from "./skills-marquee"
import accolades from "../content/accolades.json"

// Placeholder entries (marked in the JSON) stay off the page until they are filled in
const CERTIFICATIONS = certifications.filter((item) => !item.placeholder)

// About-page extras: toolkit, accolades and certifications (hidden while there are none).
export default function AboutExtras() {
  return (
    <div className="space-y-16 pb-12">
      {/* Toolkit: the full CV skills list as rolling sliders */}
      <div className="space-y-6">
        <SectionHeading title="Toolkit" note="Languages, hardware and design tools" />
        <Reveal>
          <SkillsMarquee />
        </Reveal>
      </div>

      {/* Accolades */}
      <div className="space-y-6">
        <SectionHeading title="Awards" note="Awards, honours and recognition" />
        <Reveal className="grid sm:grid-cols-3 gap-4">
          {accolades.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden border border-line bg-surface p-5 flex flex-col gap-3 transition-all duration-300 motion-safe:hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_16px_32px_-16px_var(--accent)]"
            >
              {/* Accent bar that draws across the top on hover */}
              <span className="absolute inset-x-0 top-0 h-0.5 bg-accent origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
              {/* Faint trophy that tilts in behind the text */}
              <Trophy className="absolute -right-3 -bottom-3 w-24 h-24 text-accent/0 transition-all duration-500 group-hover:text-accent/15 motion-safe:group-hover:-rotate-12 motion-safe:group-hover:scale-110" aria-hidden="true" />

              <div className="relative flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-accent-ink uppercase">{item.type}</span>
                <span className="text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:text-accent-ink">{item.year}</span>
              </div>
              <h3 className="relative text-base font-semibold leading-snug text-fg">{item.title}</h3>
              <p className="relative text-xs font-medium tracking-wide text-muted">{item.issuer}</p>
              <p className="relative text-sm leading-relaxed text-muted">{item.detail}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Certifications */}
      {CERTIFICATIONS.length > 0 && (
        <div className="space-y-6">
          <SectionHeading title="Certifications" note="Courses, credentials and training" />
          <Reveal className="grid sm:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((item, i) => (
              <div
                key={i}
                className="group border border-line bg-surface p-5 flex flex-col gap-3 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-accent/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-accent-ink uppercase">
                    <BadgeCheck className="w-4 h-4" aria-hidden="true" />
                    Certified
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-muted">{item.year}</span>
                </div>
                <h3 className="text-base font-semibold leading-snug text-fg">{item.title}</h3>
                <p className="text-xs font-medium tracking-wide text-muted">{item.issuer}</p>
                {item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-accent-ink hover:underline">
                    VIEW CREDENTIAL <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      )}
    </div>
  )
}
