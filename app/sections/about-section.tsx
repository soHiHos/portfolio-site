import Link from "next/link"
import { ArrowRight } from "lucide-react"
import SectionHeading from "../components/section-heading"
import Reveal from "../components/effects/reveal"
import LoadImg from "../components/effects/media-spinner"
import GalleryCollage, { FEATURED } from "../components/gallery-collage"
import CvDownload from "../components/cv-download"

// `short`: the home page's summary with a link to /about; the about page shows the full bio. Both have the CV download
export function AboutSection({ id, short }: { id?: string; short?: boolean }) {
  return (
    <section id={id}>
      <div className="w-full space-y-8 py-12">
        <SectionHeading title="About" />

        <div className={`grid gap-4 ${short && FEATURED ? "lg:grid-cols-[20rem_1fr]" : "lg:grid-cols-2"}`}>
          {/* Bio */}
          <Reveal className={`border border-line bg-surface p-5 sm:p-8 space-y-6 ${short && FEATURED ? "lg:flex lg:flex-col lg:justify-center" : ""}`}>
            {short ? (
              <>
                <p className="text-base sm:text-lg leading-relaxed text-muted text-left sm:text-justify">
                  <strong className="text-fg font-semibold">Built by engineers, not from templates.</strong> sohambuilds.in was founded by Soham Kar, who started in civil and environmental engineering before moving into web, mobile and AI. So we start from how your business runs and what your numbers say. Soham leads every project directly, with freelance designers and testers brought in when a project needs them. Our focus is one thing: turning messy daily operations into <strong className="text-fg font-semibold">simple, reliable software</strong> that grows with your business.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg leading-relaxed text-muted text-left sm:text-justify">
                  <strong className="text-fg font-semibold">Built by engineers, not from templates.</strong> sohambuilds.in was founded by Soham Kar, who started in civil and environmental engineering before moving into web, mobile and AI. So we start from how your business runs and what your numbers say. Soham leads every project directly, with freelance designers and testers brought in when a project needs them. Our focus is one thing: turning messy daily operations into <strong className="text-fg font-semibold">simple, reliable software</strong> that grows with your business.
                </p>
                <p className="text-lg leading-relaxed text-muted text-left sm:text-justify">
                  Soham&apos;s own work spans web, software, AI, hardware and environmental engineering, which helps us see a business problem from several angles. We help businesses get off paper, automate the routine work and see clear numbers: <strong className="text-fg font-semibold">digitalisation, automation and analysis</strong>, delivered as the apps, websites and custom software they run on every day, kept <strong className="text-fg font-semibold">simple, practical and cost-effective</strong>, and easy to hand over and grow.
                </p>
              </>
            )}
            {/* Home summary: link to /about next to the CV; the about page shows the CV alone */}
            <div id="cv" className="flex flex-wrap gap-3 scroll-mt-32">
              {short && (
                <Link href="/about" className="btn btn-secondary">
                  More about the studio <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <CvDownload className={`btn btn-secondary ${short ? "" : "btn-lg"}`} iconClassName={short ? "w-4 h-4" : "w-5 h-5"} />
            </div>
          </Reveal>

          {/* Beside the bio: the collage of paintings and drawings on the about page, one featured picture on the left on the home page
              (a landscape crop on phones, so it doesn't fill a whole screen) */}
          {short && FEATURED ? (
            <Reveal className="lg:order-first">
              <figure className="relative aspect-[4/3] sm:aspect-[4/5] max-h-[28rem] w-full overflow-hidden border border-line bg-surface lg:max-h-none">
                <LoadImg src={FEATURED.src} alt={FEATURED.alt} className="h-full w-full object-cover" />
              </figure>
            </Reveal>
          ) : (
            <Reveal>
              <GalleryCollage />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
