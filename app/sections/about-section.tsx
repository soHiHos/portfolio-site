"use client"
import { useEffect, useRef, useState } from "react"
import Button from "../components/ui/buttons/button-big"
import GlassChip from "../components/ui/chips/glass-chip"

export function AboutSection({ id }: { id?: string }) {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <section id={id}>
      {/* Two-column side-by-side layout */}
      <div className="w-full border-black/20 mt-1 border-t space-y-10 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">About Me</h1>
        
        {/* Two columns - side-by-side on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Column 1: Bio & Contact (left/wider) */}
          <div className="lg:w-[80%] md:w-full pr-4">
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              I'm Soham, an interdisciplinary engineer working across AI, software, hardware, and environmental engineering — a path that started in Civil Engineering, moved through a Post Graduate Diploma in Entrepreneurship, and led into self-taught software, hardware and AI work.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Every project starts with the same questions: <strong className="text-black dark:text-white">Can this be built?</strong> <strong className="text-black dark:text-white"> Can it be simplified?</strong> <strong className="text-black dark:text-white"> Does it solve a genuine problem? </strong> <strong className="text-black dark:text-white">Can it create long-term value?</strong> 
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Technology is never the goal — it's the tool. Models, frameworks, and languages will keep evolving, but a well-designed product that solves a real problem stays valuable. My priority is always the same: <strong className="text-black dark:text-white">simple, </strong> <strong className="text-black dark:text-white">cost-effective</strong> <strong className="text-black dark:text-white">practical projects</strong> built with <strong className="text-black dark:text-white">user ownership</strong> and <strong className="text-black dark:text-white">open source</strong> in mind.
            </p>

            <div className="relative inline-block" ref={downloadRef}>
              <Button onClick={() => setIsDownloadOpen((open) => !open)}>
                Download
              </Button>

              <div
                className={`absolute left-0 top-full text-white mt-2 w-40 rounded-xl border border-black bg-black shadow-lg overflow-hidden transition-all duration-200 origin-top ${
                  isDownloadOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="p-1 rounded-xl">
                  <a
                    href="/cv-resume/SOHAM_KAR_cv_02-2026.pdf"
                    download
                    className="block px-5 py-3 text-sm font-medium hover:bg-white/50 rounded-xl hover:text-white transition-colors border-t border-black/20"
                    onClick={() => setIsDownloadOpen(false)}
                  >
                    CV
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Skills (right/narrower) */}
          <div className="lg:w-[20%] md:w-full">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Exploring</h2>
            
            {skills.map((skill) => (
              <p key={skill.id} className="text-lg leading-relaxed text-muted-foreground mb-2">
                <GlassChip>
                  <span className="font-semibold">{skill.name}</span>
                </GlassChip>
              </p>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

// Content lives here (JSON/MDX pattern per your project)
const skills = [
  { id: '1', name: 'Applied A.I' },
  { id: '2', name: 'Full-Stack Development' },
  { id: '3', name: 'Product Design' },
  { id: '4', name: 'Hardware' },
  { id: '5', name: 'Sustainability' },
  { id: '6', name: 'Software' },
  { id: '7', name: 'Environmental Systems' },
]

export default AboutSection