import services from "../content/services.json"

// Green-filled "accepting projects" status pill (white text on emerald-700 keeps AA contrast at this size), driven by services.json
export default function AvailabilityBadge() {
  const { accepting, label } = services.availability
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${accepting ? "status-live border-emerald-700 bg-emerald-700 text-white" : "border-line text-muted"}`}>
      {accepting ? (
        // "Live" signal on one beat (globals.css): the dot breathes, a ring ripples out, the badge glows
        <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
          <span className="status-ring absolute inset-0 rounded-full border border-white" />
          <span className="status-dot relative w-1.5 h-1.5 rounded-full bg-white" />
        </span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-muted" aria-hidden="true" />
      )}
      {label}
    </span>
  )
}
