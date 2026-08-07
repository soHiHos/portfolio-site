import Image from "next/image";
import HeroSection from "./sections/hero-section";
import SearchSection from "./sections/search-section";
import AboutSection from "./sections/about-section";
import WorkSection from "./sections/work-section";
import ResearchSection from "./sections/research-section";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Your content will appear above the shader */}
      <div>
        <HeroSection />
        {/* <SearchSection /> */}
        <WorkSection id="work"/>
        <AboutSection id="about" />
        <ResearchSection id="research"/>
      </div>

    </div>
  );
}
