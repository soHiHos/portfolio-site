import HeroSection from "./sections/hero-section";
import AboutSection from "./sections/about-section";
import WorkSection from "./sections/work-section";
import ContactSection from "./sections/contact-section";
import SideNav from "./components/side-nav";
import ServicesSection from "./sections/services-section";
import ProcessSection from "./sections/process-section";
import PillarsSection from "./sections/pillars-section";
import type { Metadata } from "next";
import { OG_IMAGE, SHARE_DESCRIPTION, SITE_JSON_LD, SITE_TITLE, jsonLdHtml } from "./content/seo";

// The home page's own og:url (a page's openGraph replaces the layout's, so the rest of the preview is restated)
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: SITE_TITLE, description: SHARE_DESCRIPTION, url: "/", type: "website", images: OG_IMAGE },
};

// Only the hero is a full screen. Scrolling snaps (proximity) at two points, the hero and the
// start of What we do, so leaving the hero lands cleanly on the first section; after that sections keep
// their natural height and scroll freely.
export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Who runs the site, for search engines and AI answer engines (content/seo.ts) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(SITE_JSON_LD)} />
      <SideNav />
      <div>
        {/* The hero absorbs main's top padding so it fills exactly the first screen; equal top and bottom padding
            (enough to clear the floating header) keep its content centred vertically on the screen */}
        <div className="snap-start min-h-svh -mt-24 sm:-mt-28 md:-mt-35 py-16 flex flex-col justify-center">
          <HeroSection />
        </div>
        <div className="snap-start"><PillarsSection id="what-we-do" /></div>
        <WorkSection id="work" />
        <ServicesSection id="services" />
        <ProcessSection id="process" />
        <AboutSection id="about" short />
        <ContactSection id="contact" />
      </div>
    </div>
  );
}
