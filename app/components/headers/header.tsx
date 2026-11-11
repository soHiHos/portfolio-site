// app/components/headers/header.tsx
"use client"

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import { CONTACT_WHATSAPP, WhatsAppIcon } from "../ui/menu/contact-menu";
import ContactCard from "./contact-card";
import ThemeToggle from "../effects/theme-toggle";
import { EASTER_EVENT } from "../effects/easter-jet";
import { AVAILABLE_FOR_WORK } from "../../content/availability";
import { useActiveSection } from "../use-active-section";
import ScrollProgress from "./scroll-progress";
import LogoMark from "../logo-mark";

// Page navigation; in-page section navigation lives in the floating side nav on the home page
const PAGES = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
]

// Pulsing accent bar along a nav link's bottom edge while its page is loading (a click on a page that wasn't
// prefetched, mostly on slow phone networks). Must sit inside the <Link>.
function PendingBar() {
  const { pending } = useLinkStatus()
  return pending ? <span className="absolute inset-x-1 bottom-0 h-0.5 bg-accent motion-safe:animate-pulse" aria-hidden="true" /> : null
}

const PILLARS = ["what-i-do"] // module-level so the hook's effect doesn't re-run every render

type NavProps = { pathname: string; hidden: boolean }

const isActive = (href: string, pathname: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

// Floating frosted nav bar: name (accent), page links (the current page sits on an accent block and hovered links
// fade one in), availability and the theme toggle.
function TopNav({ pathname, hidden }: NavProps) {
  const taps = useRef<number[]>([])

  // Easter egg: 5 quick taps on the name launch the jet (the Konami code also works)
  function handleBadgeClick() {
    const now = Date.now()
    taps.current = [...taps.current.filter((t) => now - t < 2000), now]
    if (taps.current.length >= 5) {
      taps.current = []
      window.dispatchEvent(new Event(EASTER_EVENT))
    }
  }

  return (
    <header
      aria-hidden={hidden}
      inert={hidden}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] lg:w-[calc(100%-12rem)] border border-line bg-bg/60 backdrop-blur-xl transition-all duration-500 ${
        hidden ? "-translate-y-[150%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4 px-2 sm:pr-3 py-2">
        <Link
          href="/"
          onClick={handleBadgeClick}
          className="hidden sm:flex items-center gap-2.5 shrink-0 pl-2 text-sm font-semibold text-accent-ink transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-accent-ink"
          aria-label="Soham Kar, home"
        >
          <LogoMark />
          Soham Kar
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center">
          {PAGES.map((item) => {
            const active = isActive(item.href, pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap px-2.5 max-[360px]:px-1.5 sm:px-3.5 py-3 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent-ink ${
                  active ? "bg-accent text-on-accent" : "text-muted hover:text-fg hover:bg-fg/5"
                }`}
              >
                {item.label}
                <PendingBar />
              </Link>
            )
          })}
        </nav>
        <span className="hidden md:flex items-center gap-2 text-xs font-medium text-muted whitespace-nowrap">
          {AVAILABLE_FOR_WORK ? (
            // Same "live" beat as the Accepting projects badge (globals.css): the dot breathes, a ring ripples out
            <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
              <span className="status-ring absolute inset-0 rounded-full border border-emerald-500" />
              <span className="status-dot relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-fg/30" aria-hidden="true" />
          )}
          {AVAILABLE_FOR_WORK ? "Available for work" : "Fully booked"}
        </span>
        <ThemeToggle />
      </div>
      {/* Phones/tablets: page progress line along the bottom edge (desktop has the side nav) */}
      <ScrollProgress />
    </header>
  )
}

export default function Header() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const contactRef = useRef<HTMLDivElement>(null);
    const activeSection = useActiveSection();
    const pathname = usePathname();

    // Only the home page has a hero to stay out of; every other page shows the contact button from the start
    const isPastHero = pathname !== "/" || activeSection !== null;
    // Phones reach Work only after several screens, so there the contact buttons already show once the hero has
    // scrolled away ("What I do" at the top); from sm up they keep waiting for Work
    const pastPillarsTop = useActiveSection(PILLARS) !== null;
    const showContact = isPastHero || pastPillarsTop;

    // Close the contact card when scrolling back up to the hero (adjusting state during render,
    // per React's "you might not need an effect" guidance, instead of a sync effect)
    const [wasShown, setWasShown] = useState(showContact);
    if (showContact !== wasShown) {
        setWasShown(showContact);
        if (!showContact) setIsContactOpen(false);
    }

    // Lets other fixed UI (the side nav) move out of the contact card's way while it's open
    useEffect(() => {
        document.documentElement.toggleAttribute("data-contact-open", isContactOpen);
    }, [isContactOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
                setIsContactOpen(false);
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setIsContactOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <>
        {/* On the home page the nav stays out of the hero and drops in once "What I do" reaches the top */}
        <TopNav pathname={pathname} hidden={pathname === "/" && !pastPillarsTop} />

        {/* Floating contact button: on the home page once scrolled past the hero, on other pages always */}
        {showContact && (
            <div ref={contactRef} className={`fixed right-4 sm:right-7 z-50 bottom-4 sm:bottom-[calc(1.75rem+var(--footer-lift,0px))] ${isPastHero ? "" : "sm:hidden"}`}>
                <ContactCard
                    open={isContactOpen}
                    className="absolute bottom-full right-0 mb-3 origin-bottom-right"
                />

                {/* WhatsApp chat, just above the contact button; shows once CONTACT_WHATSAPP is set */}
                {CONTACT_WHATSAPP && (
                    <a
                        href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Hi Soham, I found your site and would like to talk about a project.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                        className="mx-auto mb-3 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#25D366] bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:bg-[#1da851] hover:border-[#1da851] motion-safe:hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink cursor-pointer"
                    >
                        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                )}

                <button
                    onClick={() => setIsContactOpen((open) => !open)}
                    aria-expanded={isContactOpen}
                    aria-label="Contact"
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent text-on-accent shadow-lg transition-all duration-300 hover:bg-fg hover:text-bg hover:shadow-[0_12px_28px_-10px_var(--foreground)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink cursor-pointer"
                >
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
            </div>
        )}
        </>
    );
}
