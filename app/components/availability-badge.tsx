import services from "../content/services.json"

// Green "accepting projects" status pill, driven by services.json
export default function AvailabilityBadge() {
  const { accepting, label } = services.availability
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${accepting ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400" : "border-line text-muted"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${accepting ? "bg-emerald-500 motion-safe:animate-pulse" : "bg-muted"}`} aria-hidden="true" />
      {label}
    </span>
  )
}
