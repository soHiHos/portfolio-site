import type { Metadata } from "next";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import ProjectTile from "../components/project-tile";
import Ideas from "../components/ideas";
import { CATEGORIES, PROJECTS } from "../content/projects";

export const metadata: Metadata = {
  title: "Projects — Soham Kar",
  description: "All of Soham Kar's projects: client work, GitHub projects and hardware.",
};

// Every project grouped by category (work, GitHub, hardware); each card opens its detail page.
// Categories with no projects yet are skipped.
export default function ProjectsPage() {
  return (
    <section id="all-projects">
      <div className="w-full text-left space-y-12 py-12">
        <SectionHeading title="Projects" note="Client work and hardware" />

        {CATEGORIES.map((category) => {
          const items = PROJECTS.filter((p) => p.category === category.id);
          if (items.length === 0) return null;
          return (
            <div key={category.id} className="space-y-5">
              <div className="flex items-baseline gap-3 text-xs font-semibold tracking-[0.25em] uppercase">
                <span className="text-fg">{category.label}</span>
                <span className="text-muted">· {category.note} · {items.length}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                {items.map((project, i) => (
                  <Reveal key={project.id} delay={i * 100}>
                    <ProjectTile
                      phase={project.phase}
                      image={project.image}
                      visual={project.visual}
                      title={project.title}
                      summary={project.tagline}
                      href={`/projects/${project.id}`}
                      stack={project.stack}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}

        <Ideas />
      </div>
    </section>
  );
}
