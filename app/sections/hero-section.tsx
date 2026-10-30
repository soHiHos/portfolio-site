"use client"

import { useEffect, useState } from "react";
import { ArrowDown, Mail } from "lucide-react";
import StaggeredText from "../components/effects/staggered-text";

const WORDS = ["systems", "solutions", "products", "platforms", "services"];

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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[clamp(0.625rem,1.1cqi,0.8rem)] font-semibold tracking-[0.3em] text-muted">
          <span className="flex items-center gap-2 text-fg">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            ENGINEER
          </span>
          <span>AI · SOFTWARE · HARDWARE — INDIA</span>
        </div>

        {/* Name + rotating word */}
        <div className="space-y-[clamp(1rem,2.5cqi,1.75rem)]">
          {/* Name fills the content column's width at any screen size ("SOHAM KAR" is ~5.15em wide,
              so 19cqi ≈ 98% of the column), aligned with the rest of the hero */}
          <h1 className="text-[19cqi] leading-[0.82] text-[color:var(--name)] font-bold tracking-tighter whitespace-nowrap">
            <StaggeredText text="SOHAM KAR" />
          </h1>
          <div className="flex flex-wrap items-center gap-x-[clamp(0.75rem,2cqi,1.5rem)] gap-y-3">
            <span className="text-[clamp(1.1rem,3.2cqi,2.25rem)] text-fg font-semibold whitespace-nowrap">— engineering better</span>
            <span
              className="text-[clamp(1.875rem,6.75cqi,4.75rem)] font-bold text-accent-ink cursor-default"
              onMouseEnter={() => setWordIndex((i) => (i + 1) % WORDS.length)}
            >
              {/* Keyed so each new word remounts and replays the fade-up */}
              <span key={wordIndex} className="inline-block motion-safe:animate-[word-in_500ms_cubic-bezier(0.2,0.7,0.2,1)_both]">{WORDS[wordIndex]}</span>
            </span>
          </div>
        </div>

        <div className="space-y-7">
          <p className="text-[clamp(1.05rem,1.9cqi,1.35rem)] leading-relaxed text-muted">
            Working across <strong className="text-fg font-semibold">web, software, AI and hardware</strong>, I turn messy, manual work into{" "}
            <strong className="text-fg font-semibold">clear, reliable systems</strong> that businesses run on every day. Simple, practical, and built to last.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Takes visitors straight to the contact form at the bottom of the page */}
            <button
              type="button"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-primary btn-lg"
            >
              <Mail className="w-4 h-4" />
              Contact
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-secondary btn-lg"
            >
              Explore work
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
