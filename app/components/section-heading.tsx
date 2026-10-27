import Reveal from "./effects/reveal"

interface SectionHeadingProps {
  title: React.ReactNode // plain text, or text with inline emphasis (e.g. the Contact heading's underline)
  note: string
}

// Plain section heading: title with a one-line note underneath.
export default function SectionHeading({ title, note }: SectionHeadingProps) {
  return (
    <Reveal className="space-y-2">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{title}</h2>
      <p className="text-base text-muted">{note}</p>
    </Reveal>
  )
}
