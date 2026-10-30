"use client"

// Footer styled as a final boarding pass: route, flight details, the boarding pass download, map credit
// and barcode on the ticket; copyright and contact links on the tear-off stub.
import { useEffect, useRef, useState } from 'react';
import { Check, Contact, Mail, Plane, PlaneTakeoff, Ticket } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_GITHUB, CONTACT_INSTAGRAM, CONTACT_LINKEDIN, GithubIcon, InstagramIcon, LinkedinIcon, copyToClipboard } from '../ui/menu/contact-menu';

const year = new Date().getFullYear();

const FIELDS = [
  { label: 'PASSENGER', value: 'VISITOR' },
  { label: 'FLIGHT', value: `SK-${year}` },
  { label: 'GATE', value: 'CONTACT' },
  { label: 'SEAT', value: '1A' },
  { label: 'BOARDING', value: 'NOW', accent: true },
];

const linkClasses = 'inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent-ink transition-colors cursor-pointer';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Publishes how far the footer has risen into the viewport (--footer-lift) so the fixed contact
  // button can stop above it instead of covering it
  useEffect(() => {
    const root = document.documentElement;
    function update() {
      const top = footerRef.current?.getBoundingClientRect().top ?? window.innerHeight;
      root.style.setProperty('--footer-lift', `${Math.max(0, window.innerHeight - top)}px`);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      root.style.removeProperty('--footer-lift');
    };
  }, []);

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
    // Negative margins cancel most of the page's side padding (see layout.tsx body: 1rem, 3rem, 6rem,
    // 12rem), leaving an even 1.5rem gutter on both sides and the same space above and below
    <footer ref={footerRef} className="py-6 px-2 sm:px-0 sm:-mx-6 md:-mx-18 lg:-mx-42">
      <div className="flex flex-col md:flex-row">
        {/* Ticket */}
        <div className="relative flex-1 border border-line border-b-2 [border-bottom-style:dashed] md:border-b md:[border-bottom-style:solid] md:border-r-2 md:[border-right-style:dashed] bg-surface p-4 sm:p-5">
          {/* Punched notches at both ends of the perforation */}
          <span className="absolute z-10 -left-3 -bottom-3 md:left-auto md:bottom-auto md:-right-3 md:-top-3 w-6 h-6 rounded-full bg-bg" aria-hidden="true" />
          <span className="absolute z-10 -right-3 -bottom-3 w-6 h-6 rounded-full bg-bg" aria-hidden="true" />

          <div className="flex items-center justify-between text-xs font-medium tracking-[0.25em] text-muted">
            <span className="flex items-center gap-2">
              <PlaneTakeoff className="w-4 h-4 text-accent-ink" />
              FINAL BOARDING PASS
            </span>
            <span className="hidden sm:inline">ECONOMY · CLASS OF ONE</span>
          </div>

          {/* Route */}
          <div className="flex items-center gap-4 sm:gap-6 my-3 sm:my-4">
            <div>
              <div className="text-3xl sm:text-4xl font-bold tracking-wider text-fg">YOU</div>
              <div className="text-[10px] tracking-[0.25em] text-muted">VISITOR</div>
            </div>
            <div className="relative flex-1 h-6" aria-hidden="true">
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-line" />
              <Plane className="footer-plane absolute top-1/2 -translate-y-1/2 w-5 h-5 text-accent-ink" />
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-bold tracking-wider text-accent-ink">SK</div>
              <div className="text-[10px] tracking-[0.25em] text-muted">SOHAM KAR</div>
            </div>
          </div>

          <dl className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-[10px] tracking-[0.2em] text-muted">
            {FIELDS.map((field) => (
              <div key={field.label}>
                <dt>{field.label}</dt>
                <dd className={`text-sm font-semibold tracking-wider ${field.accent ? 'text-accent-ink' : 'text-fg'}`}>{field.value}</dd>
              </div>
            ))}
          </dl>

          {/* Boarding pass download + map credit, just above the barcode */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <a href="/boarding-pass" download="soham-kar-boarding-pass.png" className={linkClasses}>
              <Ticket className="w-4 h-4" />
              Download boarding pass
            </a>
            <p className="text-[11px] text-muted">
              Background map data &copy;{' '}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-ink">
                OpenStreetMap contributors
              </a>
            </p>
          </div>

          {/* Barcode */}
          <div
            aria-hidden="true"
            className="mt-2 h-6 text-fg/50"
            style={{ background: 'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 5px, transparent 5px 8px, currentColor 8px 11px, transparent 11px 13px)' }}
          />
        </div>

        {/* Stub */}
        <div className="md:w-96 flex flex-col justify-between gap-3 border border-line border-t-0 md:border-t md:border-l-0 bg-surface p-4 sm:p-5">
          <div className="space-y-2">
            <div className="text-xs font-medium tracking-[0.25em] text-muted">THANKS FOR FLYING</div>
            <nav className="flex flex-col items-start gap-1.5">
              <a href={CONTACT_LINKEDIN} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <LinkedinIcon className="w-4 h-4" />
                LinkedIn
              </a>
              <a href={CONTACT_GITHUB} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <InstagramIcon className="w-4 h-4" />
                Instagram
              </a>
              <button type="button" onClick={handleCopyEmail} className={linkClasses}>
                {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {copied ? 'Copied!' : CONTACT_EMAIL}
              </button>
              <a href="/soham-kar.vcf" download className={linkClasses}>
                <Contact className="w-4 h-4" />
                Save contact
              </a>
            </nav>
          </div>
          {/* Pinned to the stub's bottom-right corner (the stub is a column with justify-between) */}
          <p className="self-end text-right text-sm text-fg">&copy; {year} Made by Soham Kar</p>
        </div>
      </div>
    </footer>
  );
}
