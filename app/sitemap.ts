import type { MetadataRoute } from "next";
import services from "./content/services.json";
import { PROJECTS } from "./content/projects";
import { SITE_URL } from "./content/contact";
import { servicePath } from "./content/service-list";

// Every public page, for search engines: the main pages, one page per service and one per project
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${SITE_URL}${path}`, priority });
  return [
    page("", 1),
    page("/services", 0.9),
    ...services.categories.map((c) => page(servicePath(c.id), 0.9)),
    page("/projects", 0.7),
    ...PROJECTS.map((p) => page(`/projects/${p.id}`, 0.6)),
    page("/about", 0.6),
    page("/terms", 0.3),
    page("/privacy", 0.3),
  ];
}
