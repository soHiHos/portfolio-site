import SectionHeading from "./section-heading"
import Reveal from "./effects/reveal"
import LoadImg from "./effects/media-spinner"
import ideas from "../content/ideas.json"

// Fields an entry in ideas.json can have. `image` (a path under /public) and `imageAlt` are optional: the image
// shows at the end of the first idea's card, and the card is text only without one.
type Idea = { title: string; summary: string; stage?: string; points?: string[]; image?: string; imageAlt?: string; placeholder?: boolean }

// Placeholder entries in ideas.json stay out of the page until they are filled in
export const IDEAS = (ideas as Idea[]).filter((idea) => !idea.placeholder)

// Ideas board, shared by the About and Projects pages. The first idea is the featured one: it stretches the full
// width with its text beside the key points, and its image (if any) at the end. The rest sit below in columns.
// Renders nothing while there are no ideas.
export default function Ideas() {
  if (IDEAS.length === 0) return null
  const [first, ...rest] = IDEAS

  return (
    <div id="ideas" className="space-y-6">
      <SectionHeading title="Ideas" />
      <Reveal className="space-y-4">
        <div className={`grid border border-line bg-surface ${first.image ? "lg:grid-cols-[1fr_1fr_20rem]" : "lg:grid-cols-2"}`}>
          <div className="space-y-2 p-5 sm:p-6">
            {first.stage && <div className="text-xs font-semibold text-accent-ink">{first.stage}</div>}
            <h3 className="text-xl font-bold text-fg">{first.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{first.summary}</p>
          </div>
          {first.points && (
            <ul className="space-y-2 border-t border-dashed border-line p-5 text-sm leading-relaxed text-muted sm:p-6 lg:border-l lg:border-t-0 lg:self-center">
              {first.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-2 w-1 h-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          )}
          {first.image && (
            <figure className="relative min-h-56 border-t border-line lg:min-h-full lg:border-l lg:border-t-0">
              <LoadImg src={first.image} alt={first.imageAlt ?? first.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
            </figure>
          )}
        </div>

        {rest.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((idea) => (
              <div key={idea.title} className="border border-line bg-surface p-5 space-y-2">
                {idea.stage && <div className="text-xs font-semibold text-accent-ink">{idea.stage}</div>}
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
          </div>
        )}
      </Reveal>
    </div>
  )
}
