import skills from "../content/skills.json"

// The toolkit grouped by the job each tool does for a client: what the group is for, then the tools behind it.
// Static, so it reads at a glance. Add a tool by editing content/skills.json.
export default function SkillsToolkit() {
  return (
    <div className="border-y border-line divide-y divide-line">
      {skills.map((row) => (
        <div key={row.group} className="grid md:grid-cols-[18rem_1fr] md:items-baseline gap-3 md:gap-6 py-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug text-fg">{row.group}</h3>
            <p className="text-sm leading-snug text-muted">{row.use}</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {row.items.map((item) => (
              <li key={item} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-fg">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
