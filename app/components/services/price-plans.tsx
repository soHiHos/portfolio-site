"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PLANS, PLAN_PRICES, type PlanId } from "./category-price";

// A card spans three rows of the grid (subgrid): across a row the titles, headlines and buttons line up whatever
// the length of the text, so every card is the same size whether or not its breakdown is open. The breakdown is a
// dropdown panel laid over the page below the card, so opening it never changes any card's size. The whole card is
// clickable; the button inside is the keyboard and screen-reader control.
const CARD = "relative row-span-3 grid grid-rows-subgrid cursor-pointer border bg-white transition-colors dark:bg-surface";

type Category = { id: string; title: string; summary: string };

// Services and prices, with a tab for each plan: the monthly licence, or owning the code. Each card shows its
// headline price and opens a dropdown for the full breakdown, so the page isn't crowded.
export default function PricePlans({ categories }: { categories: Category[] }) {
  const [plan, setPlan] = useState<PlanId>("monthly");
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  // Close the dropdown on Escape or a click anywhere outside a card
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => !(e.target as Element).closest("[data-price-card]") && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);
  const active = PLANS.find((p) => p.id === plan)!;

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Pricing plan" className="inline-flex border border-line bg-white dark:bg-surface">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            id={`plan-tab-${p.id}`}
            aria-selected={plan === p.id}
            aria-controls="plan-panel"
            onClick={() => setPlan(p.id)}
            className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink ${
              plan === p.id ? "bg-accent text-on-accent" : "text-muted hover:text-fg hover:bg-fg/5"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{active.blurb}</p>

      <div id="plan-panel" role="tabpanel" aria-labelledby={`plan-tab-${plan}`} className="grid sm:grid-cols-2 gap-x-4">
        {categories.map((category, i) => {
          const price = PLAN_PRICES[plan][category.id];
          const isOpen = open === category.id;
          const card = `${CARD} mb-4 border-line hover:border-accent/60${isOpen ? " z-20" : ""}`;
          const body = (
            <>
              <div className="space-y-2 p-5 sm:p-6">
                <h3 className="text-lg font-bold text-accent-ink">{category.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{category.summary}</p>
              </div>
              <p className="border-t border-accent-ink bg-accent-ink px-5 py-4 sm:px-6 text-xl font-bold text-white dark:text-on-accent">{price.headline}</p>
              <div className="border-t border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`breakdown-${category.id}`}
                  className="group flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm font-semibold text-fg transition-colors cursor-pointer hover:bg-fg/5 hover:text-accent-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink sm:px-6"
                >
                  {isOpen ? "Hide breakdown" : "See breakdown"}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`breakdown-${category.id}`}
                    initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-x-0 top-full -mt-px cursor-auto border border-line bg-white shadow-lg dark:bg-surface"
                  >
                    <div className="space-y-2 px-5 py-2 sm:px-6 sm:py-3">
                      <dl className="divide-y divide-line">
                        {price.rows.map((row) => (
                          <div key={row.label} className="grid gap-x-4 gap-y-1 py-3 sm:grid-cols-[1fr_auto]">
                            <dt className="text-sm font-semibold text-fg">{row.label}</dt>
                            <dd className="text-sm font-semibold tabular-nums text-fg sm:text-right">{row.value}</dd>
                            <dd className="text-xs leading-relaxed text-muted sm:col-span-2">{row.hint}</dd>
                          </div>
                        ))}
                      </dl>
                      {price.note && <p className="pb-2 text-xs leading-relaxed text-muted">{price.note}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          );

          // The marketing site costs the same on both plans, so its card doesn't flip
          if (reduceMotion || category.id === "websites") {
            return <article key={category.id} data-price-card className={card} onClick={() => toggle(category.id)}>{body}</article>;
          }
          // Each card fades out, the content swaps, and it fades back in with a small rise, a little after the card before it
          const delay = i * 0.04;
          return (
            <AnimatePresence key={category.id} mode="wait" initial={false}>
              <motion.article
                key={plan}
                className={card}
                data-price-card
                onClick={() => toggle(category.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut", delay } }}
                exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeIn", delay } }}
              >
                {body}
              </motion.article>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}
