'use client'

// ... existing imports (React, Lucide icons if used) ...
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlassCardText } from "../components/ui/cards/glass-card";

const ITEMS = [
  {
    id: 'env-3',
    title: 'Hydro Economy: Environmental Sustainability of Water and Wastewater Resources and Infrastructure',
    summary: 'This paper reviews the global water quality crisis driven by climate change, population growth, deforestation, and pollution (pesticides, heavy metals, wastewater discharge). It highlights how inadequate treatment infrastructure—especially in developing countries—leads to disease and environmental degradation, and calls for economical, effective, and sustainable technologies to manage water and wastewater treatment.',
    links: [
      { label: 'Link', href: 'https://link.springer.com/chapter/10.1007/978-981-16-7509-6_15' },
    ],
  },
  {
    id: 'env-2',
    title: 'Assessing the impact of vegetation coverage ratio in a floating water treatment bed of Pistia stratiotes',
    summary: "This lab-scale study examines how vegetation coverage ratio (VCR) in floating bed (FB) treatment systems affects pollutant removal efficiency. Testing VCRs from 0 to 1.0 using Pistia stratiotes, the study found that moderate coverage (0.5) gave the best COD removal (96.2%), while VCRs of 0.25–0.75 maintained dissolved oxygen levels sufficient for aquatic life. Results show that full vegetation coverage isn't optimal, since it blocks atmospheric oxygen diffusion, and an intermediate coverage balances organic/nutrient removal with oxygen availability.",
    links: [
      { label: 'Link', href: 'https://link.springer.com/article/10.1007/s42452-020-04139-2?utm_source=researchgate.net&utm_medium=article' },
    ],
  },
  {
    id: 'env-1',
    title: 'Ecological floating bed (EFB) for decontamination of polluted water bodies: Design, mechanism and performance',
    summary: 'This review paper examines Ecological Floating Beds (EFBs)—floating mats of aquatic plants used to treat polluted water bodies. It covers plant species selection, root-biofilm interactions for organic degradation, and the role of growth media, depth, buoyancy, and vegetation coverage in treatment performance. The paper details pollutant removal mechanisms (organics, nitrogen, phosphorus, heavy metals) and oxygen transfer dynamics, noting that regular biomass harvesting is essential to prevent nutrient re-release. It concludes EFBs are a promising wastewater treatment technology, with recommendations for future research.',
    links: [
      { label: 'Link', href: 'https://www.sciencedirect.com/science/article/abs/pii/S030147971931268X?via%3Dihub' },
    ],
  },
]

export function ResearchSection({ id }: { id?: string }) {
  return (
    <section id={id}>
      <div className="w-full border-black/20 mt-1 border-t text-left space-y-8 py-12">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-wide uppercase text-black/50">Papers &amp; reading</p>
          <h1 className="text-4xl font-bold tracking-tight">Research</h1>
        </div>

        <div className="space-y-6">
          {ITEMS.map((item) => (
            <GlassCardText
              key={item.id}
              className="group border border-black/10 bg-black/[0.06] backdrop-blur-lg shadow-sm hover:bg-black/[0.09] hover:border-black/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col gap-3 py-4">
                <h2 className="text-xl font-semibold leading-snug">{item.title}</h2>
                <p className="text-base text-black/70 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex flex-wraps gap-4 pt-3 mt-1 border-t border-black/10">
                  {item.links.map((link) => (
                    <Link key={link.label} href={link.href}>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-black/80 group-hover:text-black hover:text-blue-500 hover:underline transition-colors">
                        {link.label}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </GlassCardText>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResearchSection