import projects from "./projects.json"

export type ProjectCategory = "work" | "github" | "hardware"
// A project's state: live as is, live but being updated, about to go live, still being built, an idea moving to a prototype, or finished (notebooks and studies)
export type ProjectPhase = "deployed" | "servicing" | "soon" | "development" | "prototype" | "complete"

// Shape of an entry in projects.json. Optional fields render only when present, so a project can
// start minimal and gain a case study (problem / approach / outcome) later.
export type Project = {
  id: string
  code: string
  kind: "client" | "personal"
  area?: string // what kind of project it is (e.g. "Data science"); shown as a label on the Others cards
  hideOnHome?: boolean // left out of the home page Work collage; still on /projects
  featured?: boolean // personal project shown with client work under Projects, not under Others
  category: ProjectCategory
  phase: ProjectPhase
  title: string
  tagline: string
  summary: string
  shortSummary?: string // 18–20 words for the Work tiles; project pages and the assistant use `summary`
  status?: string
  image?: string
  video?: string // muted preview played on hover; `image` is its thumbnail
  visual?: "lidar"
  link?: string
  github?: string
  stack?: string[]
  caseStudy?: { problem?: string; approach?: string; outcome?: string }
  metrics?: { value: string; label: string }[] // real results only; placeholders show until set
  testimonial?: { quote: string; author: string; role?: string }
  // Empty slot shown only on the home page's Work collage (client slots; personal slots aren't shown anywhere).
  // To fill one: set a real id, title, image and link, then
  // delete "placeholder" — it then appears everywhere like any other project.
  placeholder?: boolean
}

const ALL = projects as Project[]

// Real projects only: detail pages, /projects and the assistant never see placeholders
export const PROJECTS = ALL.filter((p) => !p.placeholder)
export const PLACEHOLDER_PROJECTS = ALL.filter((p) => p.placeholder)

export const CATEGORIES: { id: ProjectCategory; label: string; note: string }[] = [
  { id: "work", label: "Work", note: "Client builds" },
  { id: "github", label: "GitHub", note: "Open source & side projects" },
  { id: "hardware", label: "Hardware", note: "Devices & prototypes" },
]
