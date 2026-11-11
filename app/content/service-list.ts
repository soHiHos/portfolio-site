import services from "./services.json";

// Every service category a visitor can pick or be recommended
export const SERVICE_LIST = services.categories.map((c) => ({ id: c.id, title: c.title }));

// Each service's own page, /services/<slug>, by category id (the ids stay internal: the contact form and emails use them)
const SLUGS: Record<string, string> = Object.fromEntries(services.categories.map((c) => [c.id, c.slug]));
export const servicePath = (id: string) => `/services/${SLUGS[id]}`;

// A service card's pillars as one label, e.g. "Automate · Analyse", from the pillar ids in services.json
const PILLAR_TITLES: Record<string, string> = Object.fromEntries(services.pillars.map((p) => [p.id, p.title]));
export const pillarLabel = (ids: string[]) => ids.map((id) => PILLAR_TITLES[id]).join(" · ");

// The category each service (by id) belongs to, so a service named anywhere can link to its category's page
export const SERVICE_CATEGORY: Record<string, string> = Object.fromEntries(
  services.categories.flatMap((c) => (c.services as { id?: string }[]).flatMap((s) => (s.id ? [[s.id, c.id]] : [])))
);

// The service categories that deliver a pillar: its main one (`category` in services.json) first, then the others
// its listed services belong to
export const pillarCategories = (pillar: (typeof services.pillars)[number]) =>
  [...new Set([pillar.category, ...pillar.services.map((id) => SERVICE_CATEGORY[id])])].map(
    (id) => services.categories.find((c) => c.id === id)!
  );

// How soon the visitor wants to start, as offered on the contact form
export const TIMELINES = ["As soon as possible", "Within 1–3 months", "Flexible / exploring"];
