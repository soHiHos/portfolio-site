// The "SK" monogram: an amber square with the top-right corner cut at 45 degrees. Same drawing as app/icon.svg,
// but coloured from the theme tokens so it follows light and dark.
export default function LogoMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <polygon points="0,0 46,0 64,18 64,64 0,64" fill="var(--accent)" />
      <g fill="none" stroke="var(--on-accent)" strokeWidth="5" strokeLinejoin="miter">
        <path d="M28 22H12V32H28V42H12" />
        <path d="M38 19.5V44.5M53 20L39 32.5M43.5 30L54 44.5" />
      </g>
    </svg>
  )
}
