import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionHeading from "../../components/section-heading";
import Estimator from "../../components/estimator/estimator";
import { ESTIMATOR_ON } from "../../components/estimator/estimate";

export const metadata: Metadata = {
  title: "Price estimate — Soham Kar",
  description: "Answer eight quick questions and get a price range for your software or AI automation as a PDF.",
};

// Price estimator page. Hidden on the live site until the pricing in content/pricing.ts is reviewed.
export default function EstimatePage() {
  if (!ESTIMATOR_ON) notFound();
  return (
    <section id="estimate">
      <div className="w-full max-w-3xl text-left space-y-8 py-12">
        <SectionHeading title="Get your price estimate" />
        <Estimator />
      </div>
    </section>
  );
}
