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
    <div id={id} className="space-y-12 py-12">
      {/* Accolades: each card spans four rows of the grid (subgrid), so across a row the label, title, issuer and
          description line up whatever the length of the title */}
      <div className="space-y-8">
        <SectionHeading title="Awards" />
        <Reveal className="grid sm:grid-cols-3 gap-4">
          {accolades.map((item, i) => (
            <div
              key={i}
              className="group relative row-span-4 grid grid-rows-subgrid gap-y-3 overflow-hidden border border-line bg-surface p-5 transition-[translate,border-color] duration-300 hover:border-accent/60 motion-safe:hover:-translate-y-1"
            >
              {/* A soft accent tint over the solid card, and a line that draws across the top edge, on hover */}
              <span className="absolute inset-0 bg-accent/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
              <span className="absolute inset-x-0 top-0 h-0.5 bg-accent origin-left opacity-0 transition-all duration-300 group-hover:opacity-100 motion-safe:scale-x-0 motion-safe:group-hover:scale-x-100" aria-hidden="true" />

              <div className="relative flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-accent-ink">{item.type}</span>
                <span className="text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:text-accent-ink">{item.year}</span>
              </div>
              <h3 className="relative text-base font-semibold leading-snug text-fg transition-colors duration-300 group-hover:text-accent-ink">{item.title}</h3>
              <p className="relative text-xs font-medium tracking-wide text-muted">{item.issuer}</p>
              <p className="relative text-sm leading-relaxed text-muted">{item.detail}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Certifications */}
      {CERTIFICATIONS.length > 0 && (
        <div className="space-y-8">
          <SectionHeading title="Certifications" />
          <Reveal className="grid sm:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((item, i) => (
              <div
                key={i}
                className="group border border-line bg-surface p-5 flex flex-col gap-3 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-accent/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-accent-ink">
                    <BadgeCheck className="w-4 h-4" aria-hidden="true" />
                    Certified
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-muted">{item.year}</span>
                </div>
                <h3 className="text-base font-semibold leading-snug text-fg">{item.title}</h3>
                <p className="text-xs font-medium tracking-wide text-muted">{item.issuer}</p>
                {item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink hover:underline">
                    View credential <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
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
