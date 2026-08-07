"use client"

import { useEffect, useRef, useState } from "react";
import { color } from "three/tsl";
import Button from "../components/ui/buttons/button-big";
import { GlassButton } from "../components/ui/buttons/glass-button"
import GlassChip from "../components/ui/chips/glass-chip";
import { ContactMenu } from "../components/ui/menu/contact-menu";

export default function HeroSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
        setIsContactOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section>
      <div className="max-w-5xl text-left space-y-7 py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl text-black font-bold tracking-tight">
          SOHAM KAR
        </h1>
        <div className="space-y-0 md:leading-none">
          <span className="text-lg sm:text-xl md:text-2xl text-black font-bold md:leading-none"> — trying to engineer a better</span>
          <h3 className="text-5xl sm:text-7xl md:text-9xl text-orange-600 font-bold md:leading-none md:-mt-2">
            FUTURE
          </h3>
        </div>
        <p className="text-lg text-black md:text-xl text-gray-500 text-left dark:text-gray-300">
          A <strong className="text-black dark:text-white">Product Engineer</strong> based in India, building at the intersection of AI, software, and hardware.
        </p>
        <p className="text-lg text-black md:text-xl text-gray-500 text-left dark:text-gray-300 max-w-2xl">
          Every project starts with <em>a question</em> — <strong className="text-black dark:text-white">can it be built?</strong>{" "}
          <strong className="text-black dark:text-white">Does it solve something real?</strong>{" "}
          <strong className="text-black dark:text-white">Can it last?</strong>
        </p>

        <div className="pt-6 border-black/10 space-x-4">
          <div className="relative inline-block" ref={contactRef}>
            <Button onClick={() => setIsContactOpen((open) => !open)}>
              Contact
            </Button>
            <ContactMenu
              open={isContactOpen}
              onClose={() => setIsContactOpen(false)}
              className="absolute left-0 top-full mt-2 w-max origin-top-left"
            />
          </div>
          <Button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
            Explore
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 py-10">
          <GlassChip>
            A.I.
          </GlassChip>
          <GlassChip>
            Software
          </GlassChip>
          <GlassChip>
            Sustainability
          </GlassChip>
          <GlassChip>
            Hardware
          </GlassChip>
        </div>
      </div>
    </section>
  );
}

