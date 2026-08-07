# skills.md

Project-specific patterns for this repo. Read alongside CLAUDE.md (general behavior rules).
CLAUDE.md says how to work; this file says what exists so the agent doesn't reinvent it.

Stack: Next.js (TypeScript only, no separate backend), deployed on Vercel.

## 1. API surface — single route handler

- All model calls go through one place: app/api/ask/route.ts. It proxies to OpenAI.
- Do not create additional API routes for model calls. If a new capability is needed,
  extend this handler — don't scatter fetches to OpenAI across components.
- Client components call this route, never the OpenAI SDK directly.

## 2. Content lives in the app folder, not a CMS or DB

- Project/skill content is structured JSON or MDX files inside the app folder.
- Adding or editing a project = editing/adding a JSON or MDX file, not touching route
  or component logic, unless the shape of the content is changing.

## 3. Template system — slots, not freeform generation

- UI is a fixed set of pre-built templates with named slots (layout/spacing set at build
  time). The model only fills text content and picks image-asset IDs from a curated list.
- Never have the model generate raw markup, JSX, or arbitrary HTML. If a query doesn't fit
  an existing template, it goes to the ProseCard catch-all — don't invent a new template
  for a one-off query.
- Adding a genuinely new template = adding to the template registry with its own slot
  schema, matching the existing pattern of the other templates.

## 4. Model routing — gpt-4o-mini default, gpt-4o escalation only

- gpt-4o-mini handles intent extraction and slot-filling for known templates. This is
  the default path.
- gpt-4o only fires for: the ProseCard fallback, or ambiguous template selection.
- Don't route to gpt-4o by default "to be safe" — that defeats the cost design (budget
  is a fixed $6 OpenAI credit, not a monthly plan).

## 5. Streaming + rendering

- Generated content streams slot fills progressively into a dialog below the ask bar
  (same pattern as inline rendering in Claude's own UI).
- Don't block the UI waiting for the full response if the existing components already
  support incremental fill.

## 6. Graceful degradation is required, not optional

- If the ask bar fails to load or errors, a complete traditional portfolio must still
  render below the hero: projects grid, about/skills, contact, optional timeline.
- Any change to the ask bar or API route must not break this fallback path. Check it
  still renders standalone before considering a change done.

## 7. Deployment constraints

- Vercel hobby tier. Keep this in mind for anything long-running or high-memory —
  favor the existing Route Handler + streaming pattern over background jobs or queues.

## When extending this file

Add a pattern here only once it's actually locked in and built — not for planned/future
features. Speculative patterns belong in project notes, not here.