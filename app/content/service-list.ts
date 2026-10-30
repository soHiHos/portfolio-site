import services from "./services.json";

// Every service category a visitor can pick or be recommended
export const SERVICE_LIST = services.categories.map((c) => ({ id: c.id, title: c.title }));
