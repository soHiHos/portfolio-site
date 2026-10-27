import ProjectTile from "../components/project-tile";
import SectionHeading from "../components/section-heading";
import Reveal from "../components/effects/reveal";
import { PLACEHOLDER_PROJECTS, PROJECTS } from "../content/projects";

// Client projects, then any empty client slots from projects.json
const CLIENT_PROJECTS = [...PROJECTS, ...PLACEHOLDER_PROJECTS].filter((project) => project.kind === "client");

// Pairs of tiles, one row per pair
const ROWS = Array.from({ length: Math.ceil(CLIENT_PROJECTS.length / 2) }, (_, r) => CLIENT_PROJECTS.slice(r * 2, r * 2 + 2));

// Golden-ratio checkerboard collage: each row is a pair split 1.618 : 1, alternating sides (wide |
// narrow, then narrow | wide) so the big tiles sit on opposite corners. A leftover single tile takes a
// full row. One column on phones.
export default function WorkSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full text-left space-y-8 py-12">
        <SectionHeading title="Work" note="Client projects" />
        <div>
          {ROWS.map((row, r) => (
            <div
              key={r}
              className={`grid md:min-h-[22rem] ${row.length === 1 ? "" : r % 2 === 0 ? "md:grid-cols-[1.618fr_1fr]" : "md:grid-cols-[1fr_1.618fr]"}`}
            >
              {row.map((project, i) => (
                <Reveal key={project.id} delay={i * 100}>
                  <div id={project.id} className="scroll-mt-28 h-full">
                    <ProjectTile
                      phase={project.phase}
                      image={project.image}
                      title={project.title}
                      summary={project.shortSummary ?? project.summary}
                      href={project.link}
                      external
                      stack={project.stack}
                      placeholder={project.placeholder}
                    />
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
