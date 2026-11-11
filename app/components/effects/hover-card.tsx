// Cards that react to hover: the border warms and an accent line draws across the top (TopLine, the card needs
// `group` from HOVER_CARD). Used on the service pages for cards that aren't links too, so there's no pointer cursor
// and nothing that shifts the layout; reduced motion keeps only the colour change.
export const HOVER_CARD = "group relative overflow-hidden border border-line bg-surface transition-colors duration-300 hover:border-accent/40";

export function TopLine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
    />
  );
}

// Cards in a grid appear one after another as they scroll in (a Reveal delay), capped so long grids don't lag
export const stagger = (i: number) => Math.min(i, 5) * 80;
