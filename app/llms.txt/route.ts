import services from "../content/services.json";
import { PROJECTS } from "../content/projects";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, SITE_URL } from "../content/contact";
import { servicePath } from "../content/service-list";

export const dynamic = "force-static";

// /llms.txt: a plain Markdown map of the site for AI answer engines (llmstxt.org), built from the same content
// files as the pages. /llms-full.txt has the full service pages.
export function GET() {
  const body = `# Soham Kar

> ${services.hero.promise} Based in Raipur, Chhattisgarh, working with growing businesses across India: digitalisation, automation and analysis.

## Services

${services.categories.map((c) => `- [${c.title}](${SITE_URL}${servicePath(c.id)}): ${c.page.metaDescription}`).join("\n")}
- [All services](${SITE_URL}/services)

## Projects

${PROJECTS.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.id}): ${p.tagline}`).join("\n")}

## About and contact

- [About Soham Kar](${SITE_URL}/about): background, toolkit and research
- Email: ${CONTACT_EMAIL}${CONTACT_WHATSAPP ? `\n- WhatsApp: https://wa.me/${CONTACT_WHATSAPP}` : ""}
- [Contact form](${SITE_URL}/#contact)

## Optional

- [Full service details](${SITE_URL}/llms-full.txt)
- [Privacy policy](${SITE_URL}/privacy)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
