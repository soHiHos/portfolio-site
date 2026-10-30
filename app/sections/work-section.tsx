import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectTile from "../components/project-tile";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import { PLACEHOLDER_PROJECTS, PROJECTS } from "../content/projects";

// Client projects, then any empty client slots from projects.json
const CLIENT_PROJECTS = [...PROJECTS, ...PLACEHOLDER_PROJECTS].filter((project) => project.kind === "client");

// Pairs of tiles, one row per pair
const ROWS = Array.from({ length: Math.ceil(CLIENT_PROJECTS.length / 2) }, (_, r) => CLIENT_PROJECTS.slice(r * 2, r * 2 + 2));

// Work: client projects as a golden-ratio checkerboard collage: each row is a pair split 1.618 : 1,
// alternating sides (wide | narrow, then narrow | wide) so the big tiles sit on opposite corners. A
// leftover single tile takes a full row. One column on phones. Tiles show only the name; details are on /projects.
export default function WorkSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="Work" />
          <Link href="/projects" className="btn-link text-sm text-fg">
            See all projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div>
          {ROWS.map((row, r) => (
            <div
              key={r}
              className={`grid md:min-h-[22rem] ${row.length === 1 ? "" : r % 2 === 0 ? "md:grid-cols-[1.618fr_1fr]" : "md:grid-cols-[1fr_1.618fr]"}`}
            >
              {row.map((project, i) => (
                <Reveal key={project.id} delay={i * 100}>
                  <div id={project.id} className="scroll-mt-28 h-full">
                    <ProjectTile image={project.image} title={project.title} href={project.link} external placeholder={project.placeholder} />
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
