"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import PriceCompare, { type CompareServiceId } from "./price-compare";

// "Compare both routes": a button that opens the price comparison in a dialog. Without `service` the visitor picks the
// service (the services page); with it, the comparison is fixed to that service (its own page). Only render it once
// pricing is reviewed: even closed, the comparison's figures are in the page source.
export default function CompareDialog({ service, className = "btn btn-primary btn-sm" }: { service?: CompareServiceId; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={className}>
        Compare both routes
      </button>
      <dialog
        ref={ref}
        aria-label="The two routes side by side"
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        className="m-auto max-h-[85vh] w-[min(56rem,calc(100vw-2rem))] overflow-hidden border border-line bg-white p-0 text-fg backdrop:bg-black/50 open:flex open:flex-col dark:bg-surface"
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center border border-line transition-colors hover:border-accent hover:bg-accent hover:text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <PriceCompare service={service} />
        </div>
      </dialog>
    </>
  );
}
