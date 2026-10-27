import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SplitFlap from "./components/effects/split-flap";

// 404 as a split-flap "gate closed" notice
export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-start justify-center gap-8 py-16">
      <div className="text-xs font-semibold tracking-[0.3em] text-muted">ERROR 404 · GATE CLOSED</div>
      <div className="text-5xl sm:text-7xl font-bold [--flap-fg:var(--accent)]">
        <SplitFlap text="NO FLIGHT" delay={150} />
      </div>
      <div className="w-full max-w-xl border border-white/10 panel text-white p-5 space-y-2 text-sm">
        <div className="grid grid-cols-[6rem_1fr] gap-2 text-white/50 text-[10px] tracking-[0.25em]">
          <span>STATUS</span>
          <span className="text-accent-ink">CANCELLED</span>
          <span>REMARKS</span>
          <span className="text-white/80 normal-case tracking-normal text-sm">This page doesn&apos;t exist or has moved to another gate.</span>
        </div>
      </div>
      <Link href="/" className="btn btn-secondary">
        <ArrowLeft className="w-4 h-4" /> Return to terminal
      </Link>
    </section>
  );
}
