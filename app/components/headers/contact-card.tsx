"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Copy, Download } from "lucide-react"
import { CONTACT_EMAIL, CONTACT_GITHUB, CONTACT_LINKEDIN, copyToClipboard } from "../ui/menu/contact-menu"
import { useIndiaTime } from "../use-india-time"

const channelClasses = "group/ch flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-white/5 transition-colors cursor-pointer"

// Contact card that pops out of the floating contact button: name, role, local time and links.
export default function ContactCard({ open, className = "" }: { open: boolean; className?: string }) {
  const [copied, setCopied] = useState(false)
  const time = useIndiaTime()

  async function handleCopyEmail() {
    try {
      await copyToClipboard(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Copy failed silently — email is still visible to select/copy manually
    }
  }

  return (
    <div
      role="dialog"
      data-contact-card
      aria-label="Contact Soham"
      aria-hidden={!open}
      className={`w-[330px] max-w-[calc(100vw-2rem)] border border-white/10 panel text-white shadow-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)] ${
        open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      } ${className}`}
    >
      <div className="px-5 pt-5 pb-4 space-y-1">
        <div className="text-xl font-bold">Soham Kar</div>
        <div className="text-sm text-white/60">Product Engineer · India · {time} IST</div>
      </div>

      <div className="border-t border-white/10 px-2 py-2">
        <button type="button" onClick={handleCopyEmail} className={channelClasses} tabIndex={open ? 0 : -1}>
          <span className="flex-1 min-w-0 text-sm font-medium truncate">{copied ? "Copied to clipboard!" : CONTACT_EMAIL}</span>
          {copied ? <Check className="w-4 h-4 shrink-0 text-accent-ink" /> : <Copy className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />}
        </button>
        <a href={CONTACT_LINKEDIN} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
          <span className="flex-1 text-sm font-medium">LinkedIn</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
        </a>
        <a href={CONTACT_GITHUB} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
          <span className="flex-1 text-sm font-medium">GitHub</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
        </a>
        <a href="/cv-resume/SOHAM_KAR_cv_02-2026.pdf" download className={channelClasses} tabIndex={open ? 0 : -1}>
          <span className="flex-1 text-sm font-medium">Download CV</span>
          <Download className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
        </a>
      </div>
    </div>
  )
}
