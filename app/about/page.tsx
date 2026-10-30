import type { Metadata } from "next";
import AboutSection from "../sections/about-section";
import AboutExtras from "../components/about-extras";
import ResearchSection from "../sections/research-section";
import ContactSection from "../sections/contact-section";
import SectionHeading from "../components/section-heading";
import SkillsMarquee from "../components/skills-marquee";
import Reveal from "../components/effects/reveal";
import SideNav from "../components/side-nav";

export const metadata: Metadata = {
  title: "About — Soham Kar",
  description: "Soham Kar's background: civil engineering, environmental research, entrepreneurship, and self-taught software, hardware and AI.",
};

const NAV = [
  { id: "about", label: "About" },
  { id: "toolkit", label: "Toolkit" },
  { id: "research", label: "Research" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

export default function AboutPage() {
  return (
    <>
      <SideNav sections={NAV} />
      <AboutSection id="about" />

      {/* Toolkit: the full CV skills list as rolling sliders */}
      <div id="toolkit" className="space-y-6 pb-12">
        <SectionHeading title="Toolkit" />
        <Reveal>
          <SkillsMarquee />
        </Reveal>
      </div>

      {/* Every paper; the landing page shows only the newest two and links here */}
      <ResearchSection id="research" />

      <AboutExtras id="awards" />

      <ContactSection id="contact" />
    </>
  );
}
