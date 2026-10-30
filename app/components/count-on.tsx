import { Plane } from "lucide-react"

const PROMISES = [
  { title: "A fixed quote in 48 hours", detail: "After a free 30-minute call: a clear scope, price and timeline. No open-ended bills." },
  { title: "A live demo every week", detail: "You see real progress every week and can change direction early, not at the end." },
  { title: "Built to hand over", detail: "Documented, with your team trained, so any developer can maintain and grow it." },
]

// "What you can count on" panel beside the bio: three commitments, in the order a project runs. Static, with
// small hover details; the one nod to the site's aviation theme is the plane that crosses the line on hover.
export default function CountOn() {
  return (
    <div className="group/panel flex h-full flex-col gap-6 border border-line bg-surface p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-fg">What you can count on</h3>

      <ol className="flex-1 space-y-5">
        {PROMISES.map((p, i) => (
          <li key={p.title} className="group flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="space-y-1">
              <span className="block text-lg font-semibold text-fg transition-colors duration-300 group-hover:text-accent-ink">{p.title}</span>
              <span className="block text-base leading-relaxed text-muted">{p.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      {/* The plane waits at the start of the line and glides to the end while the panel is hovered */}
      <div className="relative h-6" aria-hidden="true">
        <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
        <span className="absolute inset-y-0 left-0 w-full transition-transform duration-[1200ms] ease-in-out motion-safe:group-hover/panel:translate-x-[calc(100%-1.5rem)]">
          <Plane className="h-6 w-6 rotate-45 bg-surface p-0.5 text-accent-ink" />
        </span>
      </div>
    </div>
  )
}
