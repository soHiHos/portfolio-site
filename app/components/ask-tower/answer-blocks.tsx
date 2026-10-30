"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight, ClipboardEdit, Mail } from "lucide-react"
import type { AskBlock } from "../../api/ask/schema"
import { PROJECTS } from "../../content/projects"
import research from "../../content/research.json"
import { SERVICE_LIST } from "../../content/service-list"
import { CONTACT_EMAIL, CONTACT_GITHUB, CONTACT_INSTAGRAM, CONTACT_LINKEDIN } from "../../content/contact"
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../ui/menu/contact-menu"

// Event the contact section listens for to pre-fill its brief form
export const BRIEF_EVENT = "tower:brief"
export type BriefDetail = { service: string | null; message: string }

// Pre-fill the contact section's brief form and scroll to it
function startBrief(detail: BriefDetail) {
  window.dispatchEvent(new CustomEvent<BriefDetail>(BRIEF_EVENT, { detail }))
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
}

const card = "border border-white/10 bg-white/[0.04] p-4 space-y-2"
const kicker = "text-[10px] font-semibold tracking-[0.25em] text-accent-ink"

// Renders one answer block with the site's own templates. The model only supplies IDs and short
// text; titles, links and images come from site content. Text may still be streaming in.
export default function AnswerBlock({ block }: { block: AskBlock }) {
  switch (block.template) {
    case "project": {
      const project = PROJECTS.find((p) => p.id === block.projectId)
      if (!project) return null
      return (
        <Link href={`/projects/${project.id}`} className={`${card} group block hover:border-accent/50 transition-colors`}>
          <div className={kicker}>PROJECT</div>
          <div className="flex items-center justify-between gap-3 font-semibold">
            {project.title}
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-accent-ink transition-colors" />
          </div>
          {block.body && <p className="text-sm text-white/70">{block.body}</p>}
        </Link>
      )
    }
    case "research": {
      const paper = research.find((r) => r.id === block.paperId)
      if (!paper) return null
      return (
        <a href={paper.links[0]?.href} target="_blank" rel="noopener noreferrer" className={`${card} group block hover:border-accent/50 transition-colors`}>
          <div className={kicker}>RESEARCH · {paper.year}</div>
          <div className="flex items-start justify-between gap-3 font-semibold leading-snug">
            {paper.title}
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover:text-accent-ink transition-colors" />
          </div>
          <div className="text-xs text-white/50">{paper.venue}</div>
          {block.body && <p className="text-sm text-white/70">{block.body}</p>}
        </a>
      )
    }
    case "service": {
      const service = SERVICE_LIST.find((s) => s.id === block.serviceId)
      if (!service) return null
      return (
        <div className={`${card} flex gap-4`}>
          <span className="space-y-2">
            <Link href="/services" className="group flex items-center gap-2 font-semibold hover:text-accent-ink transition-colors">
              {service.title}
              <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-accent-ink transition-colors" />
            </Link>
            {block.body && <span className="block text-sm text-white/70">{block.body}</span>}
            <button
              type="button"
              onClick={() => startBrief({ service: service.id, message: "" })}
              className="btn-link text-xs text-accent-ink"
            >
              <ClipboardEdit className="w-3.5 h-3.5" /> Start a brief
            </button>
          </span>
        </div>
      )
    }
    case "brief":
      return (
        <div className={`${card} border-accent/40`}>
          <div className={kicker}>READY TO START A BRIEF?</div>
          {block.body && <p className="text-sm italic text-white/80">&ldquo;{block.body}&rdquo;</p>}
          <button
            type="button"
            onClick={() => startBrief({ service: block.serviceId, message: block.body ?? "" })}
            className="btn btn-primary btn-sm"
          >
            <ClipboardEdit className="w-4 h-4" /> Start a brief
          </button>
        </div>
      )
    case "skills":
      return (
        <div className="flex flex-wrap gap-2">
          {(block.items ?? []).map((item) => (
            <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">{item}</span>
          ))}
        </div>
      )
    case "contact":
      return (
        <div className={card}>
          {block.title && <div className="font-semibold">{block.title}</div>}
          {block.body && <p className="text-sm text-white/70">{block.body}</p>}
          <div className="flex flex-wrap gap-4 pt-1 text-sm">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-accent-ink transition-colors"><Mail className="w-4 h-4" /> Email</a>
            <a href={CONTACT_LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink transition-colors"><LinkedinIcon className="w-4 h-4" /> LinkedIn</a>
            <a href={CONTACT_GITHUB} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink transition-colors"><GithubIcon className="w-4 h-4" /> GitHub</a>
            <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink transition-colors"><InstagramIcon className="w-4 h-4" /> Instagram</a>
          </div>
        </div>
      )
    case "prose":
      return (
        <div className="space-y-1">
          {block.title && <div className="font-semibold">{block.title}</div>}
          {block.body && <p className="text-sm leading-relaxed text-white/80">{block.body}</p>}
        </div>
      )
    default:
      return null
  }
}
