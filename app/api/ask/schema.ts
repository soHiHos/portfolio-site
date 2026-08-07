// JSON schema for OpenAI structured outputs (strict mode).
// The model must return one object matching this shape: an audience guess,
// plus an ordered list of 1-4 blocks picked from the fixed template set.
// Every field is nullable-but-required, per strict-mode rules (no optional keys).

export const TEMPLATE_IDS = ["project", "research", "skills", "contact", "prose"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

// Curated image IDs the model is allowed to pick from — must match assets that exist.
export const IMAGE_IDS = ["rever-home", "local-legends", "co-daftar", "plinth"] as const;
export type ImageId = (typeof IMAGE_IDS)[number];

export type AskBlock = {
  template: TemplateId;
  title: string | null;
  summary: string | null;
  body: string | null;
  link: string | null;
  imageId: ImageId | null;
  items: string[] | null;
};

export type AskResponse = {
  audience: "recruiter" | "founder" | "researcher" | "general";
  layout: AskBlock[];
};

export const ASK_JSON_SCHEMA = {
  name: "ask_response",
  strict: true,
  schema: {
    type: "object",
    properties: {
      audience: {
        type: "string",
        enum: ["recruiter", "founder", "researcher", "general"],
      },
      layout: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "object",
          properties: {
            template: { type: "string", enum: TEMPLATE_IDS },
            title: { type: ["string", "null"] },
            summary: { type: ["string", "null"] },
            body: { type: ["string", "null"] },
            link: { type: ["string", "null"] },
            imageId: { type: ["string", "null"], enum: [...IMAGE_IDS, null] },
            items: {
              type: ["array", "null"],
              items: { type: "string" },
            },
          },
          required: ["template", "title", "summary", "body", "link", "imageId", "items"],
          additionalProperties: false,
        },
      },
    },
    required: ["audience", "layout"],
    additionalProperties: false,
  },
} as const;
