import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import SectionHeading from "../components/section-heading"
import Reveal from "../components/effects/reveal"
import CountOn from "../components/count-on"

// `short`: the home page's summary with a link to /about; the about page shows the full bio and the CV download
export function AboutSection({ id, short }: { id?: string; short?: boolean }) {
  return (
    <section id={id}>
      <div className="w-full space-y-12 py-12">
        <SectionHeading title="About" />

        <div className="grid lg:grid-cols-2">
          {/* Bio */}
          <Reveal className="border border-line bg-surface p-6 sm:p-8 space-y-6">
            {short ? (
              <>
                <p className="text-lg leading-relaxed text-muted">
                  I&apos;m Soham, an engineer working across web, software, AI, hardware and environmental engineering. That mix helps me see business problems from every angle and design solutions that fit how a business actually runs.
                </p>
                <p className="text-lg leading-relaxed text-muted">
                  I help businesses and founders turn messy, manual work into <strong className="text-fg font-semibold">clear, reliable systems</strong>: custom software, ERPs, AI automations, data insights, mobile apps and websites that teams use every day. I keep them <strong className="text-fg font-semibold">simple, practical and cost-effective</strong>, and easy to hand over, maintain and grow.
                </p>
                <Link href="/about" className="btn-link text-sm text-fg">
                  More about me <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="text-lg leading-relaxed text-muted">
                  I&apos;m Soham, an engineer working across web, software, AI, hardware and environmental engineering. That mix helps me understand business problems from every angle and design solutions that actually fit how a business runs.
                </p>
                <p className="text-lg leading-relaxed text-muted">
                  I help businesses and founders turn messy, manual work into <strong className="text-fg font-semibold">clear, reliable systems</strong>: custom software, ERPs, AI automations, data insights, mobile apps and websites. The systems and automations I build are used by businesses every day to run their operations and take the routine work off their teams, so I know what it takes to build something people depend on.
                </p>
                <p className="text-lg leading-relaxed text-muted">
                  Models and frameworks will keep changing, but a well-designed system that solves a real problem keeps paying off. So I build what&apos;s <strong className="text-fg font-semibold">simple, practical and cost-effective</strong>, and easy to hand over, maintain and grow.
                </p>
              </>
            )}
            {!short && (
              <a
                href="/cv-resume/SOHAM_KAR_cv_02-2026.pdf"
                download
                className="btn btn-secondary btn-lg"
              >
                <Download className="w-5 h-5" />
                Download CV
              </a>
            )}
          </Reveal>

          {/* Overlaps the bio by 1px so the shared edge is a single border */}
          <Reveal className="-mt-px lg:mt-0 lg:-ml-px">
            <CountOn />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
