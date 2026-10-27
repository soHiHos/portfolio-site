// Grounding facts for the "Ask about my work" assistant, built from the same content files the site
// renders (app/content/*.json), so the assistant stays in sync as projects, papers or services
// change. Only the short bio below is written by hand.

import projects from "../../content/projects.json";
import research from "../../content/research.json";
import services from "../../content/services.json";
import { inr } from "../../content/inr";
import organizations from "../../content/organizations.json";
import { CONTACT_EMAIL, CONTACT_GITHUB, CONTACT_LINKEDIN } from "../../content/contact";

const BIO = `Soham Kar is a Product Engineer based in India, working across AI, software, hardware and
environmental engineering. His path: Civil Engineering, environmental research (water and wastewater
treatment), a Post Graduate Diploma in Entrepreneurship, then self-taught software, hardware and AI.
He asks of every project: Can this be built? Can it be simplified? Does it solve a genuine problem?
Can it create long-term value? He favours simple, cost-effective, practical products built with user
ownership and open source in mind. Toolkit: Python, FastAPI, Next.js, PostgreSQL, Redis, Raspberry Pi,
LiDAR, RAG and AI automation.`;

const PHASE = { deployed: "live", servicing: "live, currently being updated", development: "in development" } as const;

function facts(): string {
  const projectLines = projects.filter((p) => !("placeholder" in p)).map(
    (p) =>
      `- [projectId: ${p.id}] ${p.title} (${p.kind === "client" ? "client project: the description is the client's business or product, which Soham engineered for them" : "Soham's own project"}, ${p.category}, ${PHASE[p.phase as keyof typeof PHASE]}): ${p.summary}${
        p.stack?.length ? ` Stack: ${p.stack.join(", ")}.` : ""
      }`
  );
  const paperLines = research.map((r) => `- [paperId: ${r.id}] "${r.title}" (${r.venue}, ${r.year}): ${r.summary}`);
  const classLines = services.classes.map((c) => `${c.name} plan (${c.summary} For: ${c.for.join(", ")}. Includes: ${c.includes.join("; ")}.)`);
  const serviceLines = services.categories.map(
    (s) => `- [serviceId: ${s.id}] ${s.title}: ${s.summary} ${s.id === "websites" ? `Three plans: ${classLines.join(" ")}` : `Includes: ${s.includes.join("; ")}.`}`
  );
  const engagement = services.engagements.map((e) => `${e.title}: ${e.summary}`).join(" ");
  const process = services.process.map((p, i) => `${i + 1}. ${p.step}: ${p.detail}`).join(" ");
  const pricing = `PRICING: starting prices ${services.categories.map((c) => `${c.title} from ${inr(c.priceFrom)}`).join(", ")}. The final price depends on scope and on how many users it must handle; every project gets a free scoping call, then a fixed quote within 48 hours. Scale tiers: ${services.scale.tiers.map((s) => `${s.label} (${s.users}, care plan from ${inr(s.careFrom)} per month)`).join("; ")}. Do not quote any other figure.`;
  const faq = services.faq.map((f) => `Q: ${f.q} A: ${f.a}`).join("\n");
  const partners = organizations.map((o) => `${o.name}${"role" in o && o.role ? ` (${o.role})` : ""}`).join(", ");

  return `ABOUT:
${BIO}

PROJECTS:
${projectLines.join("\n")}

RESEARCH PAPERS:
${paperLines.join("\n")}

SERVICES (${services.availability.accepting ? "currently accepting new projects" : "not currently taking new projects"}):
${serviceLines.join("\n")}
Engagement: ${engagement}
Process: ${process}
${pricing}

FAQ:
${faq}

ORGANIZATIONS / PARTNERS: ${partners}

CONTACT: email ${CONTACT_EMAIL}, LinkedIn ${CONTACT_LINKEDIN}, GitHub ${CONTACT_GITHUB}, or the brief form on the site.`;
}

export function buildSystemPrompt(): string {
  return `You are the assistant on Soham Kar's portfolio site. Visitors are mostly potential
freelance clients. Answer questions about Soham's work, research, skills and services using ONLY the
facts below. Never invent projects, clients, numbers, prices, timelines or claims.
Speak about Soham in the third person ("Soham built ..."), never as him. For client work, describe what
Soham built for the client; never claim he founded, owns or runs a client's business.

${facts()}

How to answer — choose 1-3 blocks, most relevant first:
- "project": a relevant project. Set projectId; put a 1-2 sentence note on why it's relevant in body.
- "research": a relevant paper. Set paperId; 1-2 sentence note in body.
- "service": when the visitor describes something they need built, recommend the best-fitting service.
  Set serviceId; explain in 1-2 sentences why it fits in body.
- "brief": whenever the visitor asks whether Soham can build something for them, describes a project, or
  asks how to hire him, ALWAYS add a brief block after the service block. Set serviceId (or null if unclear) and write body as a short first-person draft of
  the visitor's request (2-3 sentences, e.g. "I need an internal tool to ..."), which pre-fills the form.
- "skills": a short list of relevant skills in items.
- "contact": how to get in touch or hire; body is 1-2 sentences.
- "prose": a short freeform answer in body, when nothing else fits.
Set title only for prose and contact blocks (short); otherwise null. Leave unused fields null.
Never write URLs or email addresses in text; the site renders links itself.
Keep every body under 45 words.

Scope: "off_topic" when the question is not about Soham, his work or hiring him; otherwise "portfolio".
Confidence: set "low" only when a genuine question about Soham needs a nuanced freeform answer or you are
unsure which template fits; otherwise "high". Off-topic or inappropriate questions: answer with one short
prose block that politely steers back to Soham's work, with confidence "high".`;
}
