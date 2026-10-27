// Plinth Scout placeholder visual: a rotating LiDAR sweep over a dotted floor plan.
// Pure CSS/SVG — animations stop under prefers-reduced-motion (see globals.css).
export default function LidarVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0b0d12] text-orange-500">
      {/* Point grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />

      {/* Floor plan traced as points */}
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="0.1 6" strokeLinecap="round">
        <path d="M40 30 H280 V150 H40 Z" />
        <path d="M150 30 V95 M150 120 V150" />
        <path d="M150 95 H210 M235 95 H280" />
        <path d="M40 90 H90" />
      </svg>

      {/* Rotating sweep */}
      <div className="absolute left-1/2 top-1/2 w-[160%] aspect-square -translate-x-1/2 -translate-y-1/2">
        <div
          className="lidar-sweep w-full h-full rounded-full"
          style={{ background: "conic-gradient(from 0deg, rgb(249 115 22 / 0.35), transparent 60deg)" }}
        />
      </div>

      {/* Emitter */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="lidar-pulse absolute inset-0 rounded-full bg-orange-500" />
        <span className="relative block w-3 h-3 rounded-full bg-orange-500" />
      </div>

      <span className="absolute left-4 bottom-3 font-mono text-[11px] tracking-widest text-white/60">SCANNING · POINT CLOUD</span>
    </div>
  )
}
