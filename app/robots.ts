import type { MetadataRoute } from "next";
import { SITE_URL } from "./content/contact";

// Every page may be crawled, except the API routes; points crawlers at the sitemap
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
