import projects from "./projects.json"

export type ProjectCategory = "work" | "github" | "hardware"
// A project's state: live as is, live but being updated, or still being built
export type ProjectPhase = "deployed" | "servicing" | "development"

// Shape of an entry in projects.json. Optional fields render only when present, so a project can
// start minimal and gain a case study (problem / approach / outcome) later.
export type Project = {
  id: string
  code: string
  kind: "client" | "personal"
  category: ProjectCategory
  phase: ProjectPhase
  title: string
  tagline: string
  summary: string
  shortSummary?: string // 18–20 words for the Work tiles; project pages and the assistant use `summary`
  status?: string
  image?: string
  visual?: "lidar"
  link?: string
  github?: string
  stack?: string[]
  caseStudy?: { problem?: string; approach?: string; outcome?: string }
  metrics?: { value: string; label: string }[] // real results only; placeholders show until set
  testimonial?: { quote: string; author: string; role?: string }
  // Empty slot shown only on the home page (Work collage for client slots, Projects carousel for your own).
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
