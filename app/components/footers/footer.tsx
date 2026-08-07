"use client"

// Simple footer component for your Next.js portfolio
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_LINKEDIN, LinkedinIcon, copyToClipboard } from '../ui/menu/contact-menu';

export default function Footer() {
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
    <footer className="border-t border-black/10">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-12">
        <p className="text-sm text-left text-black/50">&copy; {new Date().getFullYear()} Made by Soham Kar</p>
        <nav className="flex items-center gap-5 text-right">
          <a
            href={CONTACT_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-black/70 hover:text-blue-500 transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
            LinkedIn
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 text-sm text-black/70 hover:text-blue-500 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            {copied ? 'Copied!' : CONTACT_EMAIL}
          </button>
        </nav>
      </div>
    </footer>
  );
}
