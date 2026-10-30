import { ArrowUpRight, BadgeCheck } from "lucide-react"
import SectionHeading from "./section-heading"
import Reveal from "./effects/reveal"
import certifications from "../content/certifications.json"
import accolades from "../content/accolades.json"

// Placeholder entries (marked in the JSON) stay off the page until they are filled in
const CERTIFICATIONS = certifications.filter((item) => !item.placeholder)

// About-page extras: accolades and certifications (hidden while there are none).
export default function AboutExtras({ id }: { id?: string }) {
  return (
    <div id={id} className="space-y-16 pb-12">
      {/* Accolades */}
      <div className="space-y-6">
        <SectionHeading title="Awards" />
        <Reveal className="grid sm:grid-cols-3 gap-4">
          {accolades.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden border border-line bg-surface p-5 flex flex-col gap-3 transition-colors duration-300 hover:border-accent/60"
            >
              {/* Soft accent fill that rises from the bottom on hover */}
              <span className="absolute inset-0 bg-accent/[0.07] origin-bottom opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 motion-safe:scale-y-0 motion-safe:group-hover:scale-y-100" aria-hidden="true" />
              {/* Accent bar that draws up the left edge */}
              <span className="absolute inset-y-0 left-0 w-0.5 bg-accent-2 origin-bottom opacity-0 transition-all duration-300 delay-100 group-hover:opacity-100 motion-safe:scale-y-0 motion-safe:group-hover:scale-y-100" aria-hidden="true" />

              <div className="relative flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-accent-ink uppercase">{item.type}</span>
                <span className="text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:text-accent-ink">{item.year}</span>
              </div>
              <h3 className="relative text-base font-semibold leading-snug text-fg transition-transform duration-300 motion-safe:group-hover:translate-x-1">{item.title}</h3>
              <p className="relative text-xs font-medium tracking-wide text-muted">{item.issuer}</p>
              <p className="relative text-sm leading-relaxed text-muted">{item.detail}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Certifications */}
      {CERTIFICATIONS.length > 0 && (
        <div className="space-y-6">
          <SectionHeading title="Certifications" />
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
