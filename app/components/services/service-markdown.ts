import services from "../../content/services.json";
import { CONTACT_EMAIL, SITE_URL } from "../../content/contact";
import { servicePath } from "../../content/service-list";
import { ESTIMATOR_ON } from "../estimator/estimate";
import { CATEGORY_PRICES, HOME_TIMELINES, PRICE_NOTE, fillFaq } from "./category-price";

type Category = (typeof services.categories)[number];
type Example = { title: string; situation: string; build: string[]; sizeNote: string };

const PROBLEMS = Object.fromEntries(services.problems.items.map((p) => [p.id, p]));
const list = (items: string[]) => items.map((line) => `- ${line}`).join("\n");

// A service page as plain Markdown, for the "Copy for AI" button: the same content as the page, from services.json,
// so a visitor can paste it into ChatGPT or similar and ask questions. Prices only once pricing is reviewed, as on the page.
export function serviceMarkdown(category: Category): string {
  const page = category.page as Category["page"] & {
    examples?: Example[];
    process?: { step: string; blurb: string }[];
    includesTitle?: string;
    includes?: { title: string; text: string }[];
  };
  const covers: { title: string; summary: string; for?: string }[] = category.services;
  const addon = "addon" in category ? category.addon : undefined;
  const steps = page.process ? page.process.map((s) => `${s.step}: ${fillFaq(s.blurb)}`) : services.process.map((s) => `${s.step}: ${fillFaq(s.detail)}`);
  const price = CATEGORY_PRICES[category.id];

  const sections = [
    `# ${category.title} · sohambuilds.in`,
    `${page.intro}\n\nPage: ${SITE_URL}${servicePath(category.id)}`,
    `## Who it's for\n\n${list(page.forWho)}`,
    `## What it covers\n\n${covers.map((s) => `- **${s.title}.** ${s.summary}${s.for ? ` For: ${s.for}.` : ""}`).join("\n")}` +
      ("note" in category && category.note ? `\n\n${category.note}` : ""),
    page.includes?.length && `## ${page.includesTitle}\n\n${list(page.includes.map((i) => `**${i.title}.** ${i.text}`))}`,
    addon &&
      `## ${addon.label}: ${addon.title}\n\n${addon.body}\n\n${list(addon.options.map((o) => `**${o.name}.** ${o.text}`))}\n\n${addon.disclaimer}`,
    `Typical uses: ${category.tags.join(", ")}.`,
    `Typical timeline: ${HOME_TIMELINES[category.id]}, from the day you've sent your data and approvals.`,
    ESTIMATOR_ON && `## Prices\n\n${price.price}${price.ownFrom ? `. Or buy outright: ${price.ownFrom}` : ""}\n\n${list(price.rows.map((r) => `**${r.label}.** ${[...(r.points ?? []), r.hint].join(" ")}`))}\n\n${PRICE_NOTE}`,
    page.problems.length > 0 && `## Problems it solves\n\n${list(page.problems.map((id) => `"${PROBLEMS[id].quote}" ${PROBLEMS[id].detail}`))}`,
    page.examples?.length &&
      `## Examples (illustrations, not client case studies)\n\n${page.examples.map((ex) => `### ${ex.title}\n\n${ex.situation}\n\nWhat we'd build:\n\n${list(ex.build)}\n\nSize: ${ex.sizeNote}`).join("\n\n")}`,
    `## How we work\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    `## Common questions\n\n${page.faq.map((f) => `**${f.q}**\n${fillFaq(f.a)}`).join("\n\n")}`,
    `## Contact\n\nsohambuilds.in, Raipur (C.G.), India. Email ${CONTACT_EMAIL}, or use the form at ${SITE_URL}${servicePath(category.id)}#contact.`,
  ];
  return sections.filter(Boolean).join("\n\n") + "\n";
}
