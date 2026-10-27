"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import LidarVisual from "../components/effects/lidar-visual";
import { PLACEHOLDER_PROJECTS, PROJECTS, type Project } from "../content/projects";

// Own projects only (client work lives in the Work section), then the empty placeholder slots
const ITEMS = [...PROJECTS, ...PLACEHOLDER_PROJECTS].filter((p) => p.kind !== "client");

const INTERVAL_MS = 5000 // time on each page; keep the indicator's 5000ms fill animation below in sync

const cardClasses = "group flex h-full flex-col border border-line bg-surface transition-colors duration-300 hover:border-accent/50"

// Cards per page at each breakpoint; must match the card widths below (1 / sm:2 / lg:3)
function usePerPage() {
  const [perPage, setPerPage] = useState(3)
  useEffect(() => {
    const sm = window.matchMedia("(min-width: 40rem)")
    const lg = window.matchMedia("(min-width: 64rem)")
    const update = () => setPerPage(lg.matches ? 3 : sm.matches ? 2 : 1)
    update()
    sm.addEventListener("change", update)
    lg.addEventListener("change", update)
    return () => {
      sm.removeEventListener("change", update)
      lg.removeEventListener("change", update)
    }
  }, [])
  return perPage
}

// Card body: image (or the LiDAR visual, or an empty frame for placeholders) with the name underneath
function CardBody({ project }: { project: Project }) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden border-b border-line panel">
        {project.visual === "lidar" ? (
          <LidarVisual />
        ) : project.image ? (
          <img src={project.image} alt={`${project.title} screenshot`} className="w-full h-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted/50" aria-hidden="true">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <h3 className={`text-base sm:text-lg font-semibold ${project.placeholder ? "text-muted" : "text-fg group-hover:text-accent-ink"} transition-colors`}>{project.title}</h3>
        {!project.placeholder && (
          <ArrowUpRight className="w-4 h-4 shrink-0 text-muted transition-all group-hover:text-accent-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
    </>
  );
}

// Projects as a paged auto-carousel: a page of cards (3 / 2 / 1 by screen size) slides to the next set
// every few seconds and loops. The last page aligns to the end so it is always full (e.g. 4 projects:
// cards 1–3, then 2–4). Centred bar indicators show the pages, the active one filling as a timer (clicking
// one jumps there), with "Showing X of N" underneath, X being the last card in view. Pauses on hover or
// keyboard focus, and focusing a card brings its page into view. Under reduced motion there is no
// auto-advance or slide animation.
export default function ProjectsSection({ id }: { id?: string }) {
  const perPage = usePerPage()
  const pages = Math.max(1, Math.ceil(ITEMS.length / perPage))
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = Math.min(page, pages - 1)
  const start = Math.min(current * perPage, Math.max(0, ITEMS.length - perPage))

  // Auto-advance one page per interval (restarts whenever the page changes)
  useEffect(() => {
    if (paused || pages < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setTimeout(() => setPage((p) => (Math.min(p, pages - 1) + 1) % pages), INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [current, paused, pages])

  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <SectionHeading title="Projects" note="Things I've built on my own" />

        <Reveal className="space-y-5">
          <div
            className="overflow-hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label="Projects"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ul
              className="flex gap-4 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(calc(${-start} * (100% + 1rem) / ${perPage}))` }}
            >
              {ITEMS.map((project, i) => (
                <li
                  key={project.id}
                  onFocus={() => setPage(Math.floor(Math.min(i, ITEMS.length - 1) / perPage))}
                  className="shrink-0 w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
                >
                  {/* A live link opens the project site; otherwise the card opens its detail page.
                      Placeholders aren't clickable. */}
                  {project.placeholder ? (
                    <div className="flex h-full flex-col border border-dashed border-line bg-surface">
                      <CardBody project={project} />
                    </div>
                  ) : project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
                      <CardBody project={project} />
                    </a>
                  ) : (
                    <Link href={`/projects/${project.id}`} className={cardClasses}>
                      <CardBody project={project} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {pages > 1 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {Array.from({ length: pages }, (_, p) => {
                  const active = p === current
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      aria-label={`Show page ${p + 1} of ${pages}`}
                      aria-current={active ? "true" : undefined}
                      className="group relative h-6 w-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden bg-line transition-colors group-hover:bg-fg/30">
                        {active && (
                          <span
                            key={`${current}-${perPage}`}
                            className="absolute inset-0 origin-left bg-accent motion-safe:animate-[carousel-progress_5000ms_linear_forwards]"
                            style={{ animationPlayState: paused ? "paused" : "running" }}
                          />
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
              <span className="text-xs font-medium tabular-nums text-muted" aria-live="polite">
                Showing {Math.min(start + perPage, ITEMS.length)} of {ITEMS.length}
              </span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
