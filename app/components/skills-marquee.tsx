import skills from "../content/skills.json"

// The full CV toolkit as rolling sliders: one band per group, the label on the left (above on mobile) and the
// chips scrolling beside it, alternating direction and pausing on hover. Each row renders its chips twice and
// scrolls by exactly one copy (see .marquee-track in globals.css), so the loop is seamless. The duplicate copy
// is hidden from screen readers.
export default function SkillsMarquee() {
  return (
    <div className="border-y border-line divide-y divide-line">
      {skills.map((row, rowIndex) => {
        const items = [...row.items, ...row.items]
        return (
          <div key={row.group} className="grid md:grid-cols-[14rem_1fr] md:items-center gap-3 md:gap-6 py-5">
            <div className="flex items-baseline justify-between gap-3 md:block md:space-y-1">
              <h3 className="text-base font-semibold leading-snug text-fg">{row.group}</h3>
              <span className="block text-sm tabular-nums text-muted">{row.items.length} tools</span>
            </div>
            <div className="marquee overflow-hidden">
              <ul
                className={`marquee-track flex w-max ${rowIndex % 2 === 1 ? "marquee-reverse" : ""}`}
                style={{ ["--dur" as string]: `${row.items.length * 3 + 12}s` }}
              >
                {items.map((item, i) => (
                  <li key={i} className="pr-3" aria-hidden={i >= row.items.length ? true : undefined}>
                    <span className="group/chip flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-[15px] font-medium text-fg transition-colors hover:border-accent hover:bg-accent hover:text-on-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent transition-colors group-hover/chip:bg-on-accent" aria-hidden="true" />
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
