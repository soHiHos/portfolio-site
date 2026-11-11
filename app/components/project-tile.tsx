import Link from "next/link"
import { ArrowRight, ArrowUpRight, ImageIcon } from "lucide-react"
import LidarVisual from "./effects/lidar-visual"
import HoverVideo from "./effects/hover-video"
import LoadImg from "./effects/media-spinner"
import type { ProjectPhase } from "../content/projects"

interface ProjectTileProps {
  phase?: ProjectPhase // status line; left out for a name-only tile
  image?: string
  imageMobile?: string // phone-size screenshot used below 640px instead of the cropped desktop one
  video?: string // muted preview over the image: plays on hover, or loops by itself (one tile at a time) on touch screens
  visual?: "lidar"
  title: string
  summary?: string
  href?: string
  external?: boolean // open href in a new tab (live site) vs. navigate (detail page)
  placeholder?: boolean // empty slot: dashed frame with the title, not clickable
  priority?: boolean // on screen at load (top of the projects page): load the image at once instead of lazily
}

const PHASE = {
  deployed: { label: "Live", dot: "bg-emerald-500" },
  servicing: { label: "Live · updating", dot: "bg-amber-400" },
  soon: { label: "Deploying soon", dot: "bg-sky-400" }, // blue: amber-400 matched the light accent used by "In development"
  development: { label: "In development", dot: "bg-accent" },
  prototype: { label: "Idea to prototype stage", dot: "bg-accent" },
  complete: { label: "Complete", dot: "bg-white/50" },
}

// A project as an image tile: the screenshot fills the tile and the title, summary and status sit
// on a gradient at the bottom. Without a summary it's name-only, and the dark tint shrinks to a band behind the name.
export default function ProjectTile({ phase, image, imageMobile, video, visual, title, summary, href, external, placeholder, priority }: ProjectTileProps) {
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
        <LoadImg src={image} mobileSrc={imageMobile} alt={`${title} screenshot`} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
      )}
      {video && (
        <HoverVideo
          src={video}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      )}
      {summary && <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />}

      <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-2 text-white ${summary ? "" : "pt-12 bg-gradient-to-t from-black/75 to-transparent"}`}>
        {phase && (
          <span className="flex w-fit items-center gap-1.5 bg-black px-2.5 py-1 text-xs font-medium text-white">
            <span className={`w-1.5 h-1.5 rounded-full ${PHASE[phase].dot}`} aria-hidden="true" />
            {PHASE[phase].label}
          </span>
        )}
        <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
          {title}
          {href && <Arrow className="w-4 h-4 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
        </h3>
        {summary && <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/75">{summary}</p>}
      </div>
    </>
  )

  if (!href) return <div className={tileClass}>{body}</div>
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={tileClass}>{body}</a>
  return <Link href={href} className={tileClass}>{body}</Link>
}
