import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import Reveal from "../../components/effects/reveal";
import LidarVisual from "../../components/effects/lidar-visual";
import { CATEGORIES, PROJECTS } from "../../content/projects";

// Only ids in projects.json exist; anything else 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  return project ? { title: `${project.title} — Soham Kar`, description: project.tagline } : {};
}

const CHAPTERS = [
  { key: "problem", label: "The problem" },
  { key: "approach", label: "The approach" },
  { key: "outcome", label: "The outcome" },
] as const;

// Static class names so Tailwind picks them up (one column needs none)
const CHAPTER_COLS = { 2: "md:grid-cols-2", 3: "md:grid-cols-3" } as Record<number, string>;

// Project detail page: overview, details, and the case study, results and testimonial. Each of
// those shows only once its content is added in projects.json, so nothing unfinished is on show.
export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const index = PROJECTS.findIndex((p) => p.id === id);
  if (index === -1) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const category = CATEGORIES.find((c) => c.id === project.category);
  const chapters = CHAPTERS.flatMap((chapter) => {
    const text = project.caseStudy?.[chapter.key];
    return text ? [{ chapter, text }] : [];
  });

  return (
    <article className="w-full text-left space-y-10 py-12">
      <Link href="/projects" className="btn-link text-sm text-muted">
        <ArrowLeft className="w-4 h-4" /> All projects
      </Link>

      {/* Title plate */}
      <Reveal className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase">
          <span className="text-muted">{category?.label} · {project.kind === "client" ? "Client work" : "Personal"}</span>
          <span className={`rounded-full border px-2 py-0.5 ${project.status ? "border-accent/60 text-accent-ink" : "border-line text-fg"}`}>
            {project.status ?? "Live"}
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-fg">{project.title}</h1>
        <p className="text-lg sm:text-xl text-accent-ink font-medium">{project.tagline}</p>
      </Reveal>

      {/* No image yet: skip the frame rather than show an empty one */}
      {(project.visual === "lidar" || project.image) && (
        <Reveal>
          <div className="relative aspect-video border border-line overflow-hidden panel">
            {project.visual === "lidar" ? (
              <LidarVisual />
            ) : (
              <img src={project.image} alt={`${project.title} screenshot`} className="w-full h-full object-contain" />
            )}
          </div>
        </Reveal>
      )}

      {/* Overview + details */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
        <Reveal className="space-y-3">
          <div className="text-xs font-semibold tracking-[0.25em] text-muted">OVERVIEW</div>
          <p className="text-lg leading-relaxed text-muted">{project.summary}</p>
        </Reveal>
        <Reveal className="border border-line bg-surface p-5 space-y-4 self-start">
          <div className="text-xs font-semibold tracking-[0.25em] text-muted">DETAILS</div>
          {project.stack && project.stack.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] tracking-[0.2em] text-muted">STACK</div>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-lg border border-line px-2.5 py-1 text-xs text-fg">{item}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-link text-sm text-fg">
                Visit live site <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-link text-sm text-fg">
                <Code2 className="w-4 h-4" /> View source <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </Reveal>
      </div>

      {/* Case study: only the chapters written in projects.json; hidden until at least one is */}
      {chapters.length > 0 && (
        <Reveal className="space-y-4">
          <div className="text-xs font-semibold tracking-[0.25em] text-muted">CASE STUDY</div>
          <div className={`grid ${CHAPTER_COLS[chapters.length] ?? ""} border border-line bg-surface overflow-hidden`}>
            {chapters.map(({ chapter, text }, c) => (
              <div key={chapter.key} className={`p-5 sm:p-6 space-y-2 ${c > 0 ? "border-t md:border-t-0 md:border-l border-line" : ""}`}>
                <div className="text-[10px] font-semibold tracking-[0.25em] text-accent-ink uppercase">
                  {String(c + 1).padStart(2, "0")} · {chapter.label}
                </div>
                <p className="text-base leading-relaxed text-fg">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* Results + testimonial: each shows only once real ones are added in projects.json */}
      {(project.metrics?.length || project.testimonial) && (
        <Reveal className="space-y-4">
          <div className="text-xs font-semibold tracking-[0.25em] text-muted">RESULTS</div>
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4">
              {project.metrics.map((metric, i) => (
                <div key={i} className="border border-line bg-surface p-5 space-y-1">
                  <div className="text-3xl font-bold text-accent-ink">{metric.value}</div>
                  <div className="text-sm text-muted">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          {project.testimonial && (
            <figure className="border border-line bg-surface p-6 space-y-3">
              <blockquote className="text-lg leading-relaxed text-fg">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
              <figcaption className="text-sm text-muted">
                {project.testimonial.author}{project.testimonial.role && ` · ${project.testimonial.role}`}
              </figcaption>
            </figure>
          )}
        </Reveal>
      )}

      {/* Next project */}
      {next.id !== project.id && (
        <Link href={`/projects/${next.id}`} className="group flex items-center justify-between gap-4 border border-white/10 panel text-white px-5 sm:px-7 py-5 transition-colors hover:bg-panel-2">
          <span>
            <span className="block text-[10px] font-semibold tracking-[0.25em] text-white/50">NEXT PROJECT</span>
            <span className="text-xl font-semibold">{next.title}</span>
          </span>
          <ArrowUpRight className="w-6 h-6 text-accent-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      )}
    </article>
  );
}
