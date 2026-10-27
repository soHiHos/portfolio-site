import skills from "../content/skills.json"

// The full CV toolkit as rolling sliders: one row per group, alternating direction, pausing on hover.
// Each row renders its chips twice and scrolls by exactly one copy (see .marquee-track in globals.css),
// so the loop is seamless. The duplicate copy is hidden from screen readers.
export default function SkillsMarquee() {
  return (
    <div className="space-y-6">
      {skills.map((row, rowIndex) => {
        const items = [...row.items, ...row.items]
        return (
          <div key={row.group} className="space-y-3">
            <div className="flex items-baseline gap-3 text-[10px] font-semibold tracking-[0.25em] uppercase">
              <span className="text-fg">{row.group}</span>
              <span className="text-muted">· {row.items.length}</span>
            </div>
            <div className="marquee overflow-hidden">
              <ul
                className={`marquee-track flex w-max ${rowIndex % 2 === 1 ? "marquee-reverse" : ""}`}
                style={{ ["--dur" as string]: `${row.items.length * 3 + 12}s` }}
              >
                {items.map((item, i) => (
                  <li key={i} className="pr-3" aria-hidden={i >= row.items.length ? true : undefined}>
                    <span className="block whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent-ink">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}
