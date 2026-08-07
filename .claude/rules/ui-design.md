---
paths:
  - "**/*.tsx"
  - "**/app/**/*.css"
---

# UI Design Rules — Glassmorphism

Scoped file — only loads when Claude reads component/page/style files. General behavior is
in CLAUDE.md, architecture is in .claude/rules/skills.md. This file is about visual execution only.

## Grounding
This is a portfolio spanning hardware (LiDAR scanner), an ERP platform, and a sports
community app. Glass surfaces should read like instrument-panel/control-surface layering —
precise, purposeful — not like a generic frosted SaaS card. If a component's content is
hardware/technical (e.g. Plinth Scout), consider a more literal treatment (grid lines, scan
patterns) under the glass rather than a default gradient.

## Tokens — lock these in, don't reinterpret per component
- Base background: deep and non-flat (near-black, deep navy, or a subtle gradient/texture).
  Glass has nothing to refract against on a flat white/black background.
- Glass surface: low-opacity fill (8-14%) + backdrop-blur (12-24px) + a 1px border at
  higher opacity than the fill. Blur without a visible edge reads as smudged, not glass.
- One accent color, used sparingly — not per-component.
- Two typefaces: a display face with character, a body face for legibility.

## Rules
1. 1-2 dominant glass surfaces per view (e.g. nav + one primary card) — not every block.
2. Always pair blur with a visible border. No border = no glass, just blur.
3. Check text contrast at the final rendered opacity through the glass layer.
4. Respect prefers-reduced-motion: hover glow/scale on glass panels should degrade to
   a plain state change.
5. backdrop-filter is expensive, especially on mobile — don't stack multiple blurred
   layers; check scroll performance on any section with layered glass.
6. Pick one signature glass moment. Everything else on the page should be quieter than it.

## Anti-patterns to avoid
- Purple/pink gradient behind every glass card as a default choice
- Heavy drop-shadow stacked on top of blur, muddying the edge
- Identical glass-card treatment repeated for every content type with no hierarchy