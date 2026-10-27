// JSON schema for OpenAI structured outputs (strict mode).
// The model returns scope + confidence flags (used to escalate to a stronger model) and an ordered list
// of 1-3 blocks picked from the fixed template set. It only ever picks IDs from curated lists;
// links, images and titles for projects, papers and services are looked up from site content.
// Every field is nullable-but-required, per strict-mode rules (no optional keys).

import projects from "../../content/projects.json";
import research from "../../content/research.json";
import services from "../../content/services.json";

export const TEMPLATE_IDS = ["project", "research", "service", "brief", "skills", "contact", "prose"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const PROJECT_IDS = projects.filter((p) => !("placeholder" in p)).map((p) => p.id);
export const PAPER_IDS = research.map((r) => r.id);
export const SERVICE_IDS = services.categories.map((s) => s.id);

export type AskBlock = {
  template: TemplateId;
  projectId: string | null;
  paperId: string | null;
  serviceId: string | null;
  title: string | null;
  body: string | null;
  items: string[] | null;
};

export type AskResponse = {
  scope: "portfolio" | "off_topic";
  confidence: "high" | "low";
  layout: AskBlock[];
};

export const ASK_JSON_SCHEMA = {
  name: "ask_response",
  strict: true,
  schema: {
    type: "object",
    properties: {
      // Leading keys on purpose: the route reads them (plus the first block's template) early in the
      // stream to decide whether to escalate to the stronger model
      scope: { type: "string", enum: ["portfolio", "off_topic"] },
      confidence: { type: "string", enum: ["high", "low"] },
      layout: {
        type: "array",
        minItems: 1,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            template: { type: "string", enum: TEMPLATE_IDS },
            projectId: { type: ["string", "null"], enum: [...PROJECT_IDS, null] },
            paperId: { type: ["string", "null"], enum: [...PAPER_IDS, null] },
            serviceId: { type: ["string", "null"], enum: [...SERVICE_IDS, null] },
            title: { type: ["string", "null"] },
            body: { type: ["string", "null"] },
            items: { type: ["array", "null"], items: { type: "string" } },
          },
          required: ["template", "projectId", "paperId", "serviceId", "title", "body", "items"],
          additionalProperties: false,
        },
      },
    },
    required: ["scope", "confidence", "layout"],
    additionalProperties: false,
  },
} as const;
