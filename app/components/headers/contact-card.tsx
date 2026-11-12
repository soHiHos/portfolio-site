"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Copy, FileText, Mail, X } from "lucide-react"
import { CONTACT_EMAIL, CONTACT_FACEBOOK, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, FacebookIcon, InstagramIcon, LinkedinIcon, copyToClipboard } from "../ui/menu/contact-menu"
import { useIndiaTime } from "../use-india-time"

const channelClasses = "group/ch flex items-center gap-3 w-full px-3 py-3.5 sm:py-2.5 text-left hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink"
// Channel icons show on phones only, where the rows are big tap targets
const iconClasses = "w-4 h-4 shrink-0 text-white/60 sm:hidden"

// Contact card that pops out of the floating contact button, laid out wide: name, role and local time on the
// left, the email and links on the right. Phones (below sm): a bottom sheet instead, full width along the bottom edge
// over a dimmed page (a tap on it closes the sheet), with a close button and an icon on each channel.
export default function ContactCard({ open, onClose, className = "" }: { open: boolean; onClose: () => void; className?: string }) {
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
    <>
    {/* Phones: dims the page behind the sheet */}
    <div
      onClick={onClose}
      aria-hidden="true"
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 sm:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    />
    <div
      role="dialog"
      data-contact-card
      aria-label="Contact Soham"
      aria-hidden={!open}
      className={`grid sm:grid-cols-[auto_1fr] w-[560px] max-w-[calc(100vw-2rem)] border border-white/10 panel text-white shadow-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)] max-sm:ease-out ${
        open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none max-sm:translate-y-full max-sm:scale-100"
      } ${className} max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:border-x-0 max-sm:border-b-0`}
    >
      <div className="relative flex flex-col justify-center gap-1 px-5 py-4 sm:py-5 border-b sm:border-b-0 sm:border-r border-white/10">
        <div className="text-xl font-bold">Soham Kar</div>
        <div className="text-sm text-white/60">Engineer</div>
        <div className="text-sm text-white/60">India · {time} IST</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/10 text-white/70 transition-colors hover:bg-accent hover:text-on-accent focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer sm:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-2 py-2 max-sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button type="button" onClick={handleCopyEmail} className={channelClasses} tabIndex={open ? 0 : -1}>
          <Mail className={iconClasses} aria-hidden="true" />
          <span className="flex-1 min-w-0 text-sm font-medium truncate">{copied ? "Copied to clipboard!" : CONTACT_EMAIL}</span>
          {copied ? <Check className="w-4 h-4 shrink-0 text-accent-ink" /> : <Copy className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />}
        </button>
        {/* Four links in a 2×2 grid so the labels fit */}
        <div className="grid grid-cols-2">
          <a href={CONTACT_LINKEDIN} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
            <LinkedinIcon className={iconClasses} />
            <span className="flex-1 text-sm font-medium">LinkedIn</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
          <a href={CONTACT_FACEBOOK} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
            <FacebookIcon className={iconClasses} />
            <span className="flex-1 text-sm font-medium">Facebook</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
          <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
            <InstagramIcon className={iconClasses} />
            <span className="flex-1 text-sm font-medium">Instagram</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
          <a href="/about#cv" className={channelClasses} tabIndex={open ? 0 : -1}>
            <FileText className={iconClasses} aria-hidden="true" />
            <span className="flex-1 text-sm font-medium">CV</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
        </div>
      </div>
    </div>
    </>
  )
}
