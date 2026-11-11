"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CATEGORY_PRICES } from "./category-price";
import CompareDialog from "./compare-dialog";
import Reveal from "../effects/reveal";
import { TopLine, stagger } from "../effects/hover-card";
import { pillarLabel, servicePath } from "../../content/service-list";

// A card spans the rows of the grid (subgrid): three with prices (title and summary, the price band, the buy-outright
// note), one without. Across a row the titles and prices line up whatever the length of the text. A click anywhere on
// the card opens the service's own page; the title is the real link (keyboard, screen readers, crawlers).
const CARD = "relative grid grid-rows-subgrid cursor-pointer border bg-white transition-colors dark:bg-surface";

type Category = { id: string; title: string; summary: string; pillars: string[] };

// Services, with prices once pricing is reviewed (`showPrices`): each card shows its pillars, title and summary, then
// the monthly plan (or the buy-outright price) in an amber band. The full breakdown is on each service's own page.
export default function PricePlans({ categories, showPrices }: { categories: Category[]; showPrices: boolean }) {
  const router = useRouter();
  const [own, setOwn] = useState(false);

  return (
    <div>
    <div className="grid sm:grid-cols-2 gap-x-4">
      {categories.map((category, i) => {
        const price = CATEGORY_PRICES[category.id];
        // The Reveal wrapper keeps the subgrid (cards appear one after another); the card inside is the click target
        const rows = showPrices ? "row-span-3" : "row-span-1";
        return (
          <Reveal key={category.id} delay={stagger(i)} className={`${rows} mb-4 grid grid-rows-subgrid`}>
          <article
            onClick={() => router.push(servicePath(category.id))}
            className={`${CARD} ${rows} group overflow-hidden border-line hover:border-accent/60`}
          >
            <TopLine />
            <div className="space-y-2 p-5 sm:p-6">
              {category.pillars.length > 0 && <p className="text-xs font-medium text-muted">{pillarLabel(category.pillars)}</p>}
              {/* The title links to the service's own page; its click doesn't also reach the card's */}
              <h3 className="text-lg font-bold text-accent-ink">
                <Link
                  href={servicePath(category.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="group/title inline-flex items-center gap-1.5 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
                >
                  {category.title}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/title:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted">{category.summary}</p>
            </div>
            {showPrices && (
              <>
                <div className="space-y-2 border-t border-accent bg-accent px-5 py-4 text-on-accent sm:px-6">
                  <p className="text-sm font-bold">{own && price.ownPrice ? price.ownPrice : price.price}</p>
                </div>
                <div>{own && price.ownNote && <p className="px-5 py-3 text-xs leading-relaxed text-muted sm:px-6">{price.ownNote}</p>}</div>
              </>
            )}
          </article>
          </Reveal>
        );
      })}
    </div>
    {showPrices && (
    <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 border border-line bg-bg/60 py-3 pl-4 pr-20 backdrop-blur-xl sm:pr-4">
      <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={own}
        aria-labelledby="own-switch-label"
        onClick={() => {
          setOwn((v) => !v);
        }}
        className="relative h-6 w-11 shrink-0 cursor-pointer border border-line bg-white transition-colors dark:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink data-[on=true]:border-accent data-[on=true]:bg-accent"
        data-on={own}
      >
        <span className={`absolute left-0.5 top-0.5 h-4 w-4 bg-accent-ink transition-transform motion-reduce:transition-none data-[on=true]:translate-x-5 data-[on=true]:bg-on-accent`} data-on={own} />
      </button>
      <span id="own-switch-label" className="text-sm font-semibold text-fg">Show the buy-outright prices</span>
      </div>
      {/* Only with prices: even closed, the comparison's figures would be in the page source */}
      <CompareDialog className="btn btn-primary btn-sm ml-auto" />
    </div>
    )}
    </div>
  );
}
