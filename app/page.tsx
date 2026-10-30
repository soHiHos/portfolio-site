import HeroSection from "./sections/hero-section";
import AboutSection from "./sections/about-section";
import WorkSection from "./sections/work-section";
import ResearchSection from "./sections/research-section";
import ContactSection from "./sections/contact-section";
import OrganizationsSection from "./sections/organizations-section";
import SideNav from "./components/side-nav";
import ServicesSection from "./sections/services-section";

// Only the hero is a full screen. Scrolling snaps (proximity) at two points, the hero and the
// start of Work, so leaving the hero lands cleanly on the first section; after that sections keep
// their natural height and scroll freely.
export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SideNav />
      <div>
        {/* The hero absorbs main's top padding so it fills exactly the first screen */}
        <div className="snap-start min-h-svh -mt-24 sm:-mt-28 md:-mt-35 pt-24 sm:pt-28 md:pt-35 flex flex-col justify-center">
          <HeroSection />
        </div>
        <div className="snap-start"><WorkSection id="work" /></div>
        <ServicesSection id="services" />
        <AboutSection id="about" short />
        <OrganizationsSection id="collaborators" />
        <ResearchSection id="research" limit={2} />
        <ContactSection id="contact" />
      </div>
    </div>
  );
}
