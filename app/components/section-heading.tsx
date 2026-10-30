import Reveal from "./effects/reveal"

interface SectionHeadingProps {
  title: React.ReactNode // plain text, or text with inline emphasis (e.g. the Contact heading's underline)
}

// Plain section heading: just the title
export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <Reveal>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg">{title}</h2>
    </Reveal>
  )
}
