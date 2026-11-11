import type { Metadata } from "next";
import { pageMeta } from "../content/seo";
import { notFound } from "next/navigation";
import Reveal from "../components/effects/reveal";
import LegalLayout from "../components/legal-layout";
import { ESTIMATOR_ON, inr } from "../components/estimator/estimate";
import { BUYOUT, PRICING, SETUP_PAYMENT_TEXT } from "../content/pricing";
import { BUYOUT_EXAMPLE } from "../components/services/category-price";

export const metadata: Metadata = pageMeta(
  "Terms · Soham Kar",
  "How the setup fee, the monthly plan, changes, leaving and buying outright work.",
  "/terms",
);

const T = PRICING.terms;
const GST = Math.round(PRICING.gst * 100);

const example = ` For example, ${BUYOUT_EXAMPLE}`;

const SUMMARY = [
  "You pay a setup fee and a monthly plan. I host, maintain and support your software.",
  "Your data and your accounts are always yours. The code is yours when you buy it.",
  `Monthly plans have a ${T.minMonths}-month minimum, with two ways to leave early.`,
  "Small changes are included each month; bigger ones are quoted first.",
  "If I ever stop offering the service, the code and your data pass to you free.",
];

const TERMS: { title: string; body: string }[] = [
  {
    title: "The service",
    body: "The monthly plan gives you the right to use the software I build for you for as long as the plan runs. I host and maintain it during that time.",
  },
  {
    title: "Scope",
    body: "Before work starts we agree in writing what I will build, the price, and every third-party service the system uses (for example AI models, WhatsApp Business API, Meta services, payment gateways, SMS and email), with what each is for.",
  },
  {
    title: "Fees and payment",
    body: `All prices exclude GST at ${GST}%. Setup is paid in two parts: ${SETUP_PAYMENT_TEXT}. Live testing is the testing phase, when real users first start using the software before it goes fully live. The monthly plan starts at go-live, after live testing, and is invoiced monthly. AI usage and third-party services are billed at cost as separate lines on the monthly bill. UPI is accepted.`,
  },
  {
    title: "Changes",
    body: `For ${T.adjustmentDays} days after go-live, adjustments to what I built are included; new features are not. After that, the plan includes up to ${T.smallChangeHours} hours of small changes a month; unused hours do not roll over. Bigger changes, new features, new integrations and new third-party services are quoted before work starts, at a day rate of ${inr(T.dayRate)}.`,
  },
  {
    title: "Support",
    body: `On business days (Monday to Friday), I reply within ${T.replyUrgentDays} business day to issues that stop your work, and within ${T.replyOtherDays} business days to everything else. A bug is anything that does not work as the agreed scope describes.`,
  },
  {
    title: "Minimum term",
    body: `Monthly plans have a ${T.minMonths}-month minimum. Maintenance plans after buying outright have a ${T.maintenanceMinMonths}-month minimum. Website care plans and outright purchases have no minimum.`,
  },
  {
    title: "Ending the plan",
    body: `Inside the first ${T.minMonths} months, you can end the plan by paying two months' plan fees, or by buying the software outright. After ${T.minMonths} months, you can end it with ${T.noticeDays} days' written notice. In every case, outstanding invoices are settled, setup fees already paid are not refunded, you receive an export of your data within ${T.exportDays} days, and the service then ends. After the export period your data is deleted from my servers.`,
  },
  {
    title: "Late payment",
    body: `If an invoice is more than ${T.overdueDays} days overdue, I will give ${T.warningDays} days' written notice and then pause the service. Your data is kept for ${T.dataKeepDays} days after a pause so you can pay or take an export. If neither happens, the plan ends as under "Ending the plan".`,
  },
  {
    title: "Buying outright",
    body: `You can buy the software outright at any time. The price is agreed before you commit. Setup already paid and half of the monthly fees already paid are deducted, and the price never goes below ${Math.round(BUYOUT.floorShare * 100)}% of the agreed outright price. You receive the full source code as it stands on the day of purchase, and the monthly plan ends. After that, you run hosting, or you can add a maintenance plan, which includes bug fixes, security updates and up to ${T.smallChangeHours} hours of small changes a month. Problems caused by your own edits to the code are quoted separately.` + example,
  },
  {
    title: "Ownership",
    body: "Until you buy it, the code remains mine. Your data is always yours. App store accounts, domains, WhatsApp numbers, payment gateways and similar accounts are created in your business's name; I manage them or am added as a developer, and I remove my access when the plan ends.",
  },
  {
    title: "If I stop offering the service",
    body: "If I stop offering the service for any reason, the code and your data pass to you free of charge, as they stand on that day.",
  },
  {
    title: "Websites",
    body: "Websites are paid in two parts: 50% when you approve the proposal and 50% before launch. Website files are handed over after final payment. Care plans are optional and have no minimum. A month that is cancelled part-way is billed in full.",
  },
  {
    title: "AI assistants",
    body: "An AI assistant answers from the content you provide, but AI can make mistakes: it can occasionally give wrong, outdated or made-up answers. The assistant shows visitors a notice saying so. Keeping your content accurate is your responsibility, and I'm not liable for the assistant's answers or for decisions anyone makes based on them.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts at Raipur, Chhattisgarh.",
  },
];

// The terms stay hidden with the prices until PRICING.reviewed is true (they still show in `next dev`)
export default function TermsPage() {
  if (!ESTIMATOR_ON) notFound();
  return (
    <LegalLayout>
      <Reveal>
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg">Terms</h1>
          <p className="text-lg leading-relaxed text-muted">How the setup fee, the monthly plan, changes, leaving and buying outright work.</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="space-y-2 border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-fg">In short</h2>
          <ul className="list-disc space-y-1 pl-5 leading-relaxed text-muted">
            {SUMMARY.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="space-y-6">
        {TERMS.map(({ title, body }, i) => (
          <Reveal key={title}>
            <div className="space-y-2 border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-fg">{i + 1}. {title}</h2>
              <p className="leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="text-sm text-muted">Last updated 8 November 2026.</p>
    </LegalLayout>
  );
}
