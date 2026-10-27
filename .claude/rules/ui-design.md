---
paths:
  - "**/*.tsx"
  - "**/app/**/*.css"
---

# UI Design Rules — Modern minimal, sharp

Scoped file — only loads when Claude reads component/page/style files. General behavior is
in CLAUDE.md, architecture is in .claude/rules/skills.md. This file is about visual execution only.

## Grounding
A portfolio spanning hardware (LiDAR scanner), client software (ERP, sports community app) and
research. The look is modern and minimal: solid sharp-cornered cards, plain sentence-case copy, one
accent, and a quiet aviation theme kept only at the edges of the site. Content in the middle of the
page (work, projects, research, contact) stays plain so visitors read the work, not the costume.

## Tokens — lock these in, don't reinterpret per component
- Page background: muted, low-saturation (`--background`: greige #e2ddd5 light, #111316 dark) with
  the faint Raipur map + flight routes behind it (components/effects/backdrop.tsx).
- Cards: solid `bg-surface` (cream #fffdf9 light) + `border-line`. This is the default container.
- Glass only for floating chrome and text that sits on the map, never for content cards:
  - Floating chrome (top nav, go-to-top button): `bg-bg/60 backdrop-blur-xl` + 1px `border-line`.
  - Text panels on the map (`glass` utility in globals.css): 14% fill + 16px blur + 1px border.
- One accent (`--accent`: amber light / orange dark), used for: active nav link, the name in the nav,
  primary buttons, the floating contact button, and hover fills. Never a second accent.
- Two typefaces: Space Grotesk (display) and Inter (body).

## Shape
- Sharp corners everywhere: cards, panels, inputs, buttons, nav bar, floating buttons, dropdowns.
- Round only for tiny decorative/status elements: status dots, logo circles, small tech tags,
  chat bubbles.

## Buttons and links
- Use the shared system in globals.css, never one-off button styles: `.btn` + `.btn-primary` (accent
  fill, sheen) / `.btn-secondary` (outline, fill wipe) / `.btn-link` (text, underline grows), sizes
  `.btn-sm` / `.btn-lg`. Icons move with their meaning on hover (arrows slide, download dips).
- Icon-only buttons: square, 1px border, fill with the accent on hover, tooltip/`aria-label` names them.

## Copy
- Sentence case for headings, buttons, nav and labels ("Explore work", not "EXPLORE WORK").
- No aviation wording in content sections. The theme lives only in: the map backdrop, the footer
  boarding pass, the 404 page, the easter-egg jet and the preflight checklist.
- Never show visitors unfinished content. Placeholders (`"placeholder": true` in content JSON) are
  hidden everywhere except the deliberate project slots on the home page.

## Rules
1. Respect prefers-reduced-motion: transforms, slides and auto-advance degrade to a plain state change.
2. Pair every blur with a visible border; don't stack blurred layers (backdrop-filter is expensive,
   especially on mobile).
3. Check text contrast at the final rendered colours, including on accent fills and over the map.
4. Light theme `.panel` remaps white/black (globals.css); don't use `.panel` behind photos or dark
   gradients — use a plain dark background instead.
5. Every interactive element gets a visible accent focus ring.

## Anti-patterns to avoid
- Rounded cards or buttons (the site is sharp; keep it consistent)
- A second accent colour, or gradients behind cards as decoration
- Heavy drop-shadows on cards; borders carry the structure
- All-caps tracked labels in content sections
- Aviation metaphors in content ("hangar", "flight plan", "boarding") outside the themed edges
