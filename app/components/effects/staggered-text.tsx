// Letters rise in one after another on load. CSS-only, so it renders without JS.
export default function StaggeredText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block motion-safe:animate-[letter-rise_600ms_cubic-bezier(0.2,0.7,0.2,1)_both]"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  )
}
