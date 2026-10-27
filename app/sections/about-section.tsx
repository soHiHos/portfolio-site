import { Download } from "lucide-react"
import SectionHeading from "../components/section-heading"
import Reveal from "../components/effects/reveal"
import PreflightChecklist from "../components/preflight-checklist"

export function AboutSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full space-y-12 py-12">
        <SectionHeading title="About" note="A bit about me" />

        <div className="grid lg:grid-cols-2">
          {/* Bio */}
          <Reveal className="border border-line bg-surface p-6 sm:p-8 space-y-6">
            <p className="text-lg leading-relaxed text-muted">
              I&apos;m Soham, an interdisciplinary engineer working across AI, software, hardware, and environmental engineering. Technology is never the goal — it&apos;s the tool. Models, frameworks, and languages will keep evolving, but a well-designed product that solves a real problem stays valuable.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              My priority is always the same: <strong className="text-fg font-semibold">simple, cost-effective, practical projects</strong> built with <strong className="text-fg font-semibold">user ownership</strong> and <strong className="text-fg font-semibold">open source</strong> in mind.
            </p>
            <a
              href="/cv-resume/SOHAM_KAR_cv_02-2026.pdf"
              download
              className="btn btn-secondary btn-lg"
            >
              <Download className="w-5 h-5" />
              Download CV
            </a>
          </Reveal>

          {/* Overlaps the bio by 1px so the shared edge is a single border */}
          <Reveal className="-mt-px lg:mt-0 lg:-ml-px">
            <PreflightChecklist />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
