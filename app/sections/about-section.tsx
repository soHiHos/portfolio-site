import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import SectionHeading from "../components/section-heading"
import Reveal from "../components/effects/reveal"
import LoadImg from "../components/effects/media-spinner"
import GalleryCollage, { FEATURED } from "../components/gallery-collage"

// `short`: the home page's summary with a link to /about; the about page shows the full bio and the CV download
export function AboutSection({ id, short }: { id?: string; short?: boolean }) {
  return (
    <section id={id}>
      <div className="w-full space-y-12 py-12">
        <SectionHeading title="About" />

        <div className={`grid ${short && FEATURED ? "lg:grid-cols-[20rem_1fr]" : "lg:grid-cols-2"}`}>
          {/* Bio */}
          <Reveal className={`border border-line bg-surface p-6 sm:p-8 space-y-6 ${short && FEATURED ? "lg:flex lg:flex-col lg:justify-center" : ""}`}>
            {short ? (
              <>
                <p className="text-lg leading-relaxed text-muted text-justify">
                  I&apos;m Soham. I started in civil and environmental engineering, then taught myself web, mobile and AI. Now I build <strong className="text-fg font-semibold">clear, reliable systems</strong> for businesses, kept <strong className="text-fg font-semibold">simple, practical and easy to grow</strong>.
                </p>
                <Link href="/about" className="btn btn-secondary">
                  More about me <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="text-lg leading-relaxed text-muted text-justify">
                  I&apos;m Soham, an engineer working across web, software, AI, hardware and environmental engineering. That mix helps me see a business problem from several angles and build something that fits how the business runs.
                </p>
                <p className="text-lg leading-relaxed text-muted text-justify">
                  I turn messy, manual work into <strong className="text-fg font-semibold">clear, reliable systems</strong>: custom software, ERPs, AI automations, data insights, mobile apps and websites that businesses run on every day. I keep them <strong className="text-fg font-semibold">simple, practical and cost-effective</strong>, and easy to hand over and grow.
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

          {/* Beside the bio: the collage of paintings and drawings on the about page, one featured picture on the left on the home page */}
          {short && FEATURED ? (
            <Reveal className="mt-2 lg:mt-0 lg:mr-2 lg:order-first">
              <figure className="relative aspect-[4/5] max-h-[28rem] w-full overflow-hidden border border-line bg-surface lg:max-h-none">
                <LoadImg src={FEATURED.src} alt={FEATURED.alt} className="h-full w-full object-cover" />
              </figure>
            </Reveal>
          ) : (
            <Reveal className="mt-2 lg:mt-0 lg:ml-2">
              <GalleryCollage />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
