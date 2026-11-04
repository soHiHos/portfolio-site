import services from "./services.json";

// Every service category a visitor can pick or be recommended
export const SERVICE_LIST = services.categories.map((c) => ({ id: c.id, title: c.title }));

// How soon the visitor wants to start, as offered on the contact form
export const TIMELINES = ["As soon as possible", "Within 1–3 months", "Flexible / exploring"];
