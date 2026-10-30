import type { Metadata } from "next";
import { ArrowUpRight, Code2 } from "lucide-react";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import ProjectTile from "../components/project-tile";
import Ideas, { IDEAS } from "../components/ideas";
import SideNav from "../components/side-nav";
import ContactSection from "../sections/contact-section";
import { CATEGORIES, PROJECTS, type Project } from "../content/projects";
import { CONTACT_GITHUB } from "../content/contact";

export const metadata: Metadata = {
  title: "Projects — Soham Kar",
  description: "All of Soham Kar's projects: client work, side projects and hardware.",
};

// Projects in category order (client work, then GitHub, then hardware), split into client work plus
// featured personal projects, and the rest of the personal work ("Other projects"), without category labels
const ORDERED = CATEGORIES.flatMap((c) => PROJECTS.filter((p) => p.category === c.id));
const MAIN = ORDERED.filter((p) => p.kind === "client" || p.featured);
const OTHER = ORDERED.filter((p) => p.kind === "personal" && !p.featured);

const NAV = [
  { id: "all-projects", label: "Projects" },
  ...(OTHER.length > 0 ? [{ id: "other-projects", label: "Other projects" }] : []),
  ...(IDEAS.length > 0 ? [{ id: "ideas", label: "Ideas" }] : []),
  { id: "contact", label: "Contact" },
];

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
      {projects.map((project, i) => (
        <Reveal key={project.id} delay={(i % 2) * 100}>
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
  );
}

// Every project as a card that opens its detail page, then ideas and contact
export default function ProjectsPage() {
  return (
    <>
      <SideNav sections={NAV} />
      <section id="all-projects">
        <div className="w-full text-left space-y-12 py-12">
          <SectionHeading title="Projects" />
          <ProjectGrid projects={MAIN} />

          {OTHER.length > 0 && (
            <div id="other-projects" className="space-y-12 pt-12">
              <SectionHeading title="Other projects" />
              <ProjectGrid projects={OTHER} />

              {/* The rest of the notebooks and side projects live on GitHub */}
              <a href={CONTACT_GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <Code2 className="w-4 h-4" />
                More projects on GitHub
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          )}

          <Ideas />
        </div>
      </section>

      <ContactSection id="contact" />
    </>
  );
}
