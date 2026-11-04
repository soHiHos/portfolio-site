"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Step = { step: string; detail: string };

// "How we'll work" one step at a time: numbered tabs along the top, the current step below, and Back / Next.
export default function ProcessSteps({ steps }: { steps: Step[] }) {
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  const reduceMotion = useReducedMotion();
  const current = steps[index];

  function go(next: number) {
    if (next < 0 || next >= steps.length || next === index) return;
    setPage([next, next > index ? 1 : -1]);
  }

  const shift = reduceMotion ? 0 : 24;

  return (
    <div className="space-y-6">
      {/* Step numbers: a line runs behind them, filled up to the current step */}
      <div role="tablist" aria-label="Steps" className="relative flex items-center justify-between">
        <span className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-line" aria-hidden="true" />
        <span
          className="absolute left-4 top-1/2 h-px -translate-y-1/2 bg-accent transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `calc((100% - 2rem) * ${index / (steps.length - 1)})` }}
          aria-hidden="true"
        />
        {steps.map((s, i) => (
          <button
            key={s.step}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Step ${i + 1}: ${s.step}`}
            onClick={() => go(i)}
            className={`relative z-10 flex h-8 w-8 items-center justify-center border text-xs font-bold tabular-nums transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink ${
              i === index
                ? "border-accent bg-accent text-on-accent"
                : i < index
                  ? "border-accent bg-white dark:bg-surface text-accent-ink"
                  : "border-line bg-white dark:bg-surface text-muted hover:border-accent hover:text-fg"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      {/* The current step. A fixed minimum height stops the buttons below jumping between steps of different lengths. */}
      <div className="min-h-40 overflow-hidden" aria-live="polite">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * shift }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: -d * shift }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            <p className="text-sm font-semibold tabular-nums text-accent-ink">
              Step {index + 1} of {steps.length}
            </p>
            <h3 className="text-2xl font-bold text-fg">{current.step}</h3>
            <p className="max-w-2xl text-base leading-relaxed text-muted">{current.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn btn-secondary btn-sm disabled:opacity-40 disabled:pointer-events-none">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === steps.length - 1} className="btn btn-primary btn-sm disabled:opacity-40 disabled:pointer-events-none">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
