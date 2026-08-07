"use client"

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Placeholder contact details — replace with real values
export const CONTACT_EMAIL = "sohamkar.work@gmail.com";
export const CONTACT_LINKEDIN = "https://www.linkedin.com/in/soham-kar-a82169364";

// Copies text to the clipboard, falling back to the legacy execCommand trick
// for non-secure contexts / older browsers. Shared by the contact menu and footer.
export async function copyToClipboard(text: string) {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}

// lucide-react 1.x dropped brand icons, so LinkedIn is a small inline SVG
export function LinkedinIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452z" />
        </svg>
    );
}

interface ContactMenuProps {
    open: boolean;
    onClose: () => void;
    className?: string;
}

// Shared dropdown panel used by both the hero "Contact" button and the
// floating contact button that appears once you scroll past the hero.
export function ContactMenu({ open, onClose, className = "" }: ContactMenuProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopyEmail() {
        try {
            await copyToClipboard(CONTACT_EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Copy failed silently — email is still visible to select/copy manually
        }
    }

    return (
        <div
            className={`z-[60] rounded-xl border border-black/10 bg-black/[0.85] backdrop-blur-lg text-white shadow-lg overflow-hidden transition-all duration-200 ${
                open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            } ${className}`}
        >
            <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors w-full text-left whitespace-nowrap"
            >
                {copied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                {copied ? "Copied!" : CONTACT_EMAIL}
            </button>
            <a
                href={CONTACT_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors border-t border-white/10"
                onClick={onClose}
            >
                <LinkedinIcon className="w-4 h-4 shrink-0" />
                LinkedIn
            </a>
        </div>
    );
}
