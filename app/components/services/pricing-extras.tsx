import { Check, Gauge, Wrench } from "lucide-react"
import Reveal from "../effects/reveal"
import services from "../../content/services.json"
import { inr } from "../../content/inr"

const MONTHLY = services.engagements.filter((e) => e.id === "care" || e.id === "retainer")

// After the build: the monthly care plan and retainer, then the scale tiers that size a build to its users.
export default function PricingExtras() {
  return (
    <div className="space-y-14">
      <Reveal className="space-y-5">
        <div className="text-xs font-semibold tracking-[0.25em] text-muted">AFTER LAUNCH · MONTHLY</div>
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {MONTHLY.map((e) => (
            <article key={e.id} id={e.id} className="scroll-mt-28 flex flex-col gap-4 border border-line bg-surface p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-fg">{e.title}</h3>
                <span className="text-right">
                  <span className="block text-[10px] tracking-[0.2em] text-muted">FROM</span>
                  <span className="text-lg font-bold tabular-nums text-fg">{inr(e.from ?? 0)}</span>
                  <span className="text-xs text-muted"> / month</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{e.summary}</p>
              <ul className="space-y-2 border-t border-dashed border-line pt-4">
                {(e.points ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-fg">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-muted">
          <Gauge className="w-4 h-4 text-accent-ink" aria-hidden="true" /> BUILT TO SCALE · APPS AND AI
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{services.scale.intro}</p>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {services.scale.tiers.map((tier, i) => (
            <article key={tier.id} id={`scale-${tier.id}`} className="scroll-mt-28 flex flex-col gap-3 border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.25em] text-accent-ink uppercase">
                <span>{tier.label}</span>
                <span className="text-muted">TIER {i + 1}</span>
              </div>
              <div className="text-2xl font-bold text-fg">{tier.users}</div>
              <p className="text-sm leading-relaxed text-muted">{tier.summary}</p>
              <div className="mt-auto flex items-center gap-2 border-t border-dashed border-line pt-3 text-xs text-muted">
                <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
                Care plan from <span className="font-semibold text-fg">{inr(tier.careFrom)}</span> / month
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
