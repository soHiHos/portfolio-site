import services from "../content/services.json";
import { serviceMarkdown } from "../components/services/service-markdown";

export const dynamic = "force-static";

// /llms-full.txt: every service page as Markdown (the same text as each page's "Copy for AI" button), for AI answer engines
export function GET() {
  const body = `# Soham Kar: services in full\n\n${services.categories.map(serviceMarkdown).join("\n\n---\n\n")}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
