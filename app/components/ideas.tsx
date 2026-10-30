import SectionHeading from "./section-heading"
import Reveal from "./effects/reveal"
import ideas from "../content/ideas.json"

// Placeholder entries in ideas.json stay out of the page until they are filled in
export const IDEAS = ideas.filter((idea) => !idea.placeholder)

// Static class names so Tailwind picks them up; a lone idea gets a readable width instead of a third
const COLS = { 1: "max-w-2xl", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as Record<number, string>

// Ideas board, shared by the About and Projects pages. Renders nothing while there are no ideas.
export default function Ideas() {
  if (IDEAS.length === 0) return null

  return (
    <div id="ideas" className="space-y-6">
      <SectionHeading title="Ideas" />
      <Reveal className={`grid gap-4 ${COLS[Math.min(IDEAS.length, 3)]}`}>
        {IDEAS.map((idea, i) => (
          <div key={i} className="border border-line bg-surface p-5 space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-muted">IDEA {String(i + 1).padStart(2, "0")}</span>
            {idea.stage && <div className="text-[10px] font-semibold tracking-[0.2em] text-accent-ink uppercase">{idea.stage}</div>}
            <h3 className="text-base font-semibold text-fg">{idea.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{idea.summary}</p>
            {idea.points && (
              <ul className="space-y-1.5 border-t border-dashed border-line pt-3 text-sm leading-relaxed text-muted">
                {idea.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 w-1 h-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Reveal>
    </div>
  )
}
