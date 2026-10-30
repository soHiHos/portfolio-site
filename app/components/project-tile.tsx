import Link from "next/link"
import { ArrowRight, ArrowUpRight, ImageIcon } from "lucide-react"
import LidarVisual from "./effects/lidar-visual"
import type { ProjectPhase } from "../content/projects"

interface ProjectTileProps {
  phase?: ProjectPhase // status line; left out for a name-only tile
  image?: string
  visual?: "lidar"
  title: string
  summary?: string
  href?: string
  external?: boolean // open href in a new tab (live site) vs. navigate (detail page)
  stack?: string[]
  placeholder?: boolean // empty slot: dashed frame with the title, not clickable
}

const PHASE = {
  deployed: { label: "Live", dot: "bg-emerald-500" },
  servicing: { label: "Live · updating", dot: "bg-amber-400" },
  development: { label: "In development", dot: "bg-accent" },
  complete: { label: "Complete", dot: "bg-white/50" },
}

// A project as an image tile: the screenshot fills the tile and the title, summary and status sit
// on a gradient at the bottom. Stack chips fade in on hover (always visible on touch screens).
// Without a summary it's name-only, and the dark tint shrinks to a band behind the name.
export default function ProjectTile({ phase, image, visual, title, summary, href, external, stack, placeholder }: ProjectTileProps) {
  if (placeholder) {
    return (
      <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 border border-dashed border-line bg-surface text-muted">
        <ImageIcon className="w-8 h-8 opacity-50" aria-hidden="true" />
        <span className="text-lg font-semibold">{title}</span>
      </div>
    )
  }

  const Arrow = external ? ArrowUpRight : ArrowRight
  // Plain dark background, not .panel: in the light theme .panel swaps white/black (globals.css), which
  // would turn the dark gradient over the image into a white wash
  const tileClass = `group relative block h-full min-h-72 overflow-hidden border border-line bg-neutral-900 transition-colors duration-300 hover:border-accent/50`

  const body = (
    <>
      {/* No image yet: the tile stays a plain dark panel with the name */}
      {visual === "lidar" ? (
        <div className="absolute inset-0"><LidarVisual /></div>
      ) : image && (
        <img src={image} alt={`${title} screenshot`} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
      )}
      {summary && <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />}

      <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-2 text-white ${summary ? "" : "pt-12 bg-gradient-to-t from-black/75 to-transparent"}`}>
        {phase && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-white/70">
            <span className={`w-1.5 h-1.5 rounded-full ${PHASE[phase].dot}`} aria-hidden="true" />
            {PHASE[phase].label}
          </span>
        )}
        <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
          {title}
          {href && <Arrow className="w-4 h-4 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
        </h3>
        {summary && <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/75">{summary}</p>}
        {stack && stack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 motion-safe:md:translate-y-2 motion-safe:md:group-hover:translate-y-0">
            {stack.map((item) => (
              <span key={item} className="rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-xs">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  if (!href) return <div className={tileClass}>{body}</div>
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={tileClass}>{body}</a>
  return <Link href={href} className={tileClass}>{body}</Link>
}
