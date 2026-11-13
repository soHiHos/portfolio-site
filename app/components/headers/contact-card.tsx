"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Copy, FileText, Mail, X } from "lucide-react"
import { BRAND_HOVER, CONTACT_EMAIL, CONTACT_FACEBOOK, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, CONTACT_WHATSAPP, FacebookIcon, InstagramIcon, LinkedinIcon, WhatsAppIcon, copyToClipboard } from "../ui/menu/contact-menu"
import { useIndiaTime } from "../use-india-time"

const channelClasses = "group/ch flex items-center gap-3 w-full px-3 py-3 sm:py-2.5 text-left hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink"
// Phones: the socials are square icon buttons (same look as the footer), filling with each brand's colours on tap
const socialClasses = "flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
const SOCIALS = [
  { label: "LinkedIn", href: CONTACT_LINKEDIN, icon: LinkedinIcon },
  { label: "Instagram", href: CONTACT_INSTAGRAM, icon: InstagramIcon },
  ...(CONTACT_FACEBOOK ? [{ label: "Facebook", href: CONTACT_FACEBOOK, icon: FacebookIcon }] : []),
]
const WHATSAPP_HREF = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Hi Soham, I found your site and would like to talk about a project.")}`

// Contact card that pops out of the floating contact button, laid out wide: name, role and local time on the
// left, the email and links on the right. Phones (below sm): a bottom sheet instead, full width along the bottom edge
// over a dimmed page (a tap on it closes the sheet), with a close button, Email and WhatsApp as the two main
// buttons, the email address to copy, and the socials as icon buttons.
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
      <div className="relative flex flex-col justify-center gap-1 px-5 pt-3 pb-4 sm:py-5 border-b sm:border-b-0 sm:border-r border-white/10">
        {/* Phones: grab handle, a cue that this is a sheet */}
        <div className="sm:hidden mx-auto mb-3 h-1 w-10 bg-white/20" aria-hidden="true" />
        <div className="text-xl font-bold">Soham Kar</div>
        <div className="text-sm text-white/60">Founder, sohambuilds.in</div>
        <div className="text-sm text-white/60">India · {time} IST</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-6 flex h-10 w-10 items-center justify-center border border-white/10 text-white/70 transition-colors hover:bg-accent hover:text-on-accent focus-visible:outline-2 focus-visible:outline-accent-ink cursor-pointer sm:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-2 py-2 max-sm:px-5 max-sm:pt-4 max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Phones: the two main ways to reach us, as full-size buttons */}
        <div className={`sm:hidden grid gap-2 mb-2 ${CONTACT_WHATSAPP ? "grid-cols-2" : ""}`}>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary" tabIndex={open ? 0 : -1}>
            <Mail className="w-4 h-4" aria-hidden="true" />
            Email us
          </a>
          {CONTACT_WHATSAPP && (
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" tabIndex={open ? 0 : -1}>
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          )}
        </div>
        <button type="button" onClick={handleCopyEmail} className={`${channelClasses} max-sm:px-0`} tabIndex={open ? 0 : -1}>
          <span className="flex-1 min-w-0 text-sm font-medium truncate">{copied ? "Copied to clipboard!" : CONTACT_EMAIL}</span>
          {copied ? <Check className="w-4 h-4 shrink-0 text-accent-ink" /> : <Copy className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />}
        </button>
        {/* Phones: socials as icon buttons, then the CV */}
        <div className="sm:hidden flex items-center gap-2 pt-3 border-t border-white/10">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${socialClasses} ${BRAND_HOVER[label]}`} tabIndex={open ? 0 : -1}>
              <Icon className="w-4 h-4" />
            </a>
          ))}
          <a href="/about#cv" className="ml-auto inline-flex items-center gap-1.5 py-3 text-sm font-medium text-white/70 hover:text-white" tabIndex={open ? 0 : -1}>
            <FileText className="w-4 h-4" aria-hidden="true" />
            Founder&apos;s CV
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
        {/* Larger screens: four links in a 2×2 grid so the labels fit */}
        <div className="hidden sm:grid grid-cols-2">
          <a href={CONTACT_LINKEDIN} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
            <span className="flex-1 text-sm font-medium">LinkedIn</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
          <a href={CONTACT_FACEBOOK} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
            <span className="flex-1 text-sm font-medium">Facebook</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
          <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" className={channelClasses} tabIndex={open ? 0 : -1}>
            <span className="flex-1 text-sm font-medium">Instagram</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
          <a href="/about#cv" className={channelClasses} tabIndex={open ? 0 : -1}>
            <span className="flex-1 text-sm font-medium">CV</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/50 group-hover/ch:text-white" />
          </a>
        </div>
      </div>
    </div>
    </>
  )
}
