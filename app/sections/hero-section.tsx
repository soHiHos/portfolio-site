"use client"

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ChartLine, Globe, ScanText, Smartphone, Workflow } from "lucide-react";
import StaggeredText from "../components/effects/staggered-text";
import { AVAILABLE_FOR_WORK } from "../content/availability";

// Verb + object pairs, so the rotation covers the three pillars (digitise, automate, analyse) and the apps and sites,
// each with an icon that leads the line
const WORDS = [
  { verb: "digitise", object: "registers", icon: ScanText },
  { verb: "automate", object: "invoicing", icon: Workflow },
  { verb: "analyse", object: "sales", icon: ChartLine },
  { verb: "build", object: "app", icon: Smartphone },
  { verb: "launch", object: "website", icon: Globe },
];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  // Cycle the rotating word; hovering skips ahead to the next one
  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 4500);
    return () => clearInterval(interval);
  }, [wordIndex]);

  const Icon = WORDS[wordIndex].icon;

  return (
    <section>
      {/* Sized with container query units (cqi = 1% of the hero's own width), so the type scales
          fluidly with the space actually available at any screen size */}
      <div className="@container text-left py-[clamp(2.5rem,6cqi,4rem)] space-y-[clamp(1.75rem,4cqi,2.75rem)]">
        {/* Kicker */}
        <div className="flex flex-col gap-y-2 text-[clamp(0.8rem,1.4cqi,1rem)] font-medium text-muted">
          <span className="font-bold">Based in Raipur (C.G.), India</span>
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <span className="font-bold">Software studio</span>
            <span className="flex items-center gap-2 text-fg">
              <span className={`w-2 h-2 rounded-full ${AVAILABLE_FOR_WORK ? "bg-emerald-500" : "bg-fg/30"}`} aria-hidden="true" />
              {AVAILABLE_FOR_WORK ? "Available for new projects" : "Fully booked right now"}
            </span>
          </div>
        </div>

        {/* Name + rotating word */}
        <div className="space-y-[clamp(0.25rem,0.75cqi,0.5rem)]">
          {/* Name fills the content column's width at any screen size ("sohambuilds.in" is ~6.6em wide,
              so 15cqi ≈ 98% of the column), aligned with the rest of the hero */}
          <h1 className="text-[15cqi] leading-[0.82] text-[color:var(--name)] font-bold tracking-tighter whitespace-nowrap">
            <StaggeredText text="sohambuilds.in" />
          </h1>
          <div className="flex flex-wrap items-center gap-x-[clamp(0.75rem,2cqi,1.5rem)] gap-y-3 leading-[1.15]">
            <span className="inline-flex items-center gap-[clamp(0.5rem,1.2cqi,0.875rem)] text-[clamp(1.1rem,3.2cqi,2.25rem)] text-fg font-semibold whitespace-nowrap">
              {/* Rhombus badge: a square in the name's colour (navy, orange in dark mode) turned 45° that spins a half turn with each new word, with the
                  word's icon upright inside it */}
              <span className="relative mx-[0.2em] inline-flex w-[1.1em] h-[1.1em] shrink-0 items-center justify-center" aria-hidden="true">
                <span key={`rhombus-${wordIndex}`} className="absolute inset-0 rotate-45 bg-[color:var(--name)] motion-safe:animate-[rhombus-spin_600ms_cubic-bezier(0.2,0.7,0.2,1)_both]" />
                <Icon key={`icon-${wordIndex}`} className="relative w-[0.62em] h-[0.62em] text-white motion-safe:animate-[word-in_500ms_cubic-bezier(0.2,0.7,0.2,1)_both]" strokeWidth={2.25} />
              </span>
              We <span key={wordIndex} className="inline-block motion-safe:animate-[word-in_500ms_cubic-bezier(0.2,0.7,0.2,1)_both]">{WORDS[wordIndex].verb}</span> your
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

        <div className="space-y-8 sm:space-y-15">
          <p className="text-[clamp(1.05rem,1.9cqi,1.35rem)] leading-relaxed text-muted">
            A software studio building <strong className="text-fg font-semibold">custom apps, websites and automation</strong> that take your business off paper, eliminate repetitive work and show you{" "}
            <strong className="text-fg font-semibold">clear weekly numbers</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Takes visitors straight to the contact form at the bottom of the page */}
            <button
              type="button"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-primary btn-lg max-sm:w-full motion-safe:animate-[btn-float_3s_ease-in-out_infinite] hover:[animation-play-state:paused] focus-visible:[animation-play-state:paused]"
            >
              Book a free scoping call
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-secondary btn-lg max-sm:w-full"
            >
              Explore case studies
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
