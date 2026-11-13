import type { Metadata } from "next";
import { pageMeta } from "../content/seo";
import AboutSection from "../sections/about-section";
import AboutExtras from "../components/about-extras";
import ResearchSection from "../sections/research-section";
import OrganizationsSection from "../sections/organizations-section";
import ContactSection from "../sections/contact-section";
import SectionHeading from "../components/section-heading";
import SkillsToolkit from "../components/skills-toolkit";
import Reveal from "../components/effects/reveal";
import SideNav from "../components/side-nav";

export const metadata: Metadata = pageMeta(
  "About · sohambuilds.in",
  "sohambuilds.in is a software development company in Raipur, India, started by engineer Soham Kar, whose background spans civil and environmental engineering, research and entrepreneurship. We build apps, websites and software for digitalisation, automation and analysis.",
  "/about",
);

const NAV = [
  { id: "about", label: "About" },
  { id: "toolkit", label: "Toolkit" },
  { id: "research", label: "Research" },
  { id: "collaborators", label: "Collaborators" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

export default function AboutPage() {
  return (
    <>
      <SideNav sections={NAV} />
      <AboutSection id="about" />

      {/* Toolkit: the tools behind the services, grouped by what each is used for */}
      <div id="toolkit" className="space-y-8 pb-12">
        <SectionHeading title="Toolkit" />
        <Reveal>
          <SkillsToolkit />
        </Reveal>
      </div>

      <ResearchSection id="research" />

      <OrganizationsSection id="collaborators" />

      <AboutExtras id="awards" />

      <ContactSection id="contact" />
    </>
  );
}
