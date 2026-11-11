"use client"

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import StaggeredText from "../components/effects/staggered-text";
import { AVAILABLE_FOR_WORK } from "../content/availability";

// Verb + object pairs, so the rotation covers the three pillars (digitise, automate, analyse) and the apps and sites
const WORDS = [
  { verb: "digitise", object: "registers" },
  { verb: "automate", object: "invoicing" },
  { verb: "analyse", object: "sales" },
  { verb: "build", object: "app" },
  { verb: "launch", object: "website" },
];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  // Cycle the rotating word; hovering skips ahead to the next one
  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 4500);
    return () => clearInterval(interval);
  }, [wordIndex]);

  return (
    <section>
      {/* Sized with container query units (cqi = 1% of the hero's own width), so the type scales
          fluidly with the space actually available at any screen size */}
      <div className="@container text-left py-[clamp(2.5rem,6cqi,4rem)] space-y-[clamp(1.75rem,4cqi,2.75rem)]">
        {/* Kicker */}
        <div className="flex flex-col gap-y-2 text-[clamp(0.8rem,1.4cqi,1rem)] font-medium text-muted">
          <span>Based in Raipur (C.G.), India</span>
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <span>Apps · Websites · Digitalisation · Automation · Analysis</span>
            <span className="flex items-center gap-2 text-fg">
              <span className={`w-2 h-2 rounded-full ${AVAILABLE_FOR_WORK ? "bg-emerald-500" : "bg-fg/30"}`} aria-hidden="true" />
              {AVAILABLE_FOR_WORK ? "Available for new projects" : "Fully booked right now"}
            </span>
          </div>
        </div>

        {/* Name + rotating word */}
        <div className="space-y-[clamp(1rem,2.5cqi,1.75rem)]">
          {/* Name fills the content column's width at any screen size ("SOHAM KAR" is ~5.15em wide,
              so 19cqi ≈ 98% of the column), aligned with the rest of the hero */}
          <h1 className="text-[19cqi] leading-[0.82] text-[color:var(--name)] font-bold tracking-tighter whitespace-nowrap">
            <StaggeredText text="SOHAM KAR" />
          </h1>
          <div className="flex flex-wrap items-center gap-x-[clamp(0.75rem,2cqi,1.5rem)] gap-y-3">
            <span className="inline-flex items-center gap-[clamp(0.5rem,1.2cqi,0.875rem)] text-[clamp(1.1rem,3.2cqi,2.25rem)] text-fg font-semibold whitespace-nowrap">
              <span className="w-[0.4em] h-[0.4em] bg-accent" aria-hidden="true" />
              I <span key={wordIndex} className="inline-block motion-safe:animate-[word-in_500ms_cubic-bezier(0.2,0.7,0.2,1)_both]">{WORDS[wordIndex].verb}</span> your
            </span>
            <span
              className="text-[clamp(1.875rem,6.75cqi,4.75rem)] font-bold text-accent-ink cursor-default"
              onMouseEnter={() => setWordIndex((i) => (i + 1) % WORDS.length)}
            >
              {/* Keyed so each new word remounts and replays the fade-up */}
              <span key={wordIndex} className="inline-block motion-safe:animate-[word-in_500ms_cubic-bezier(0.2,0.7,0.2,1)_both]">{WORDS[wordIndex].object}</span>
            </span>
          </div>
        </div>

        <div className="space-y-7">
          <p className="text-[clamp(1.05rem,1.9cqi,1.35rem)] leading-relaxed text-muted">
            I build <strong className="text-fg font-semibold">apps, websites and software</strong> that take your business off paper, automate the routine work and show you{" "}
            <strong className="text-fg font-semibold">clear numbers</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Takes visitors straight to the contact form at the bottom of the page */}
            <button
              type="button"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-primary btn-lg motion-safe:animate-[btn-float_3s_ease-in-out_infinite] hover:[animation-play-state:paused] focus-visible:[animation-play-state:paused]"
            >
              Book a free call
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-secondary btn-lg"
            >
              See my work
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
