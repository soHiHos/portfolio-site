// app/components/headers/header.tsx
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import ContactCard from "./contact-card";
import ThemeToggle from "../effects/theme-toggle";
import { EASTER_EVENT } from "../effects/easter-jet";
import services from "../../content/services.json";
import { useActiveSection } from "../use-active-section";
import ScrollProgress from "./scroll-progress";

// Page navigation; in-page section navigation lives in the floating side nav on the home page
const PAGES = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
]

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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(80rem,calc(100%-1.5rem))] border border-line bg-bg/60 backdrop-blur-xl transition-all duration-500 ${
        hidden ? "-translate-y-[150%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4 px-2 sm:pr-3 py-2">
        <Link
          href="/"
          onClick={handleBadgeClick}
          className="hidden sm:block shrink-0 pl-3 text-sm font-semibold text-accent-ink transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-accent-ink"
          aria-label="Soham Kar, home"
        >
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
                className={`whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent-ink ${
                  active ? "bg-accent text-on-accent" : "text-muted hover:text-fg hover:bg-fg/5"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <span className="hidden md:flex items-center gap-2 text-xs font-medium text-muted whitespace-nowrap">
          {services.availability.accepting ? (
            // Same "live" beat as the Accepting projects badge (globals.css): the dot breathes, a ring ripples out
            <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
              <span className="status-ring absolute inset-0 rounded-full border border-emerald-500" />
              <span className="status-dot relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-fg/30" aria-hidden="true" />
          )}
          {services.availability.accepting ? "Available for work" : "Fully booked"}
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

    // Close the contact card when scrolling back up to the hero (adjusting state during render,
    // per React's "you might not need an effect" guidance, instead of a sync effect)
    const [wasPastHero, setWasPastHero] = useState(isPastHero);
    if (isPastHero !== wasPastHero) {
        setWasPastHero(isPastHero);
        if (!isPastHero) setIsContactOpen(false);
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
        {/* On the home page the nav stays out of the hero and drops in once Work reaches the top */}
        <TopNav pathname={pathname} hidden={pathname === "/" && !isPastHero} />

        {/* Floating contact button: on the home page once scrolled past the hero, on other pages always */}
        {isPastHero && (
            <div ref={contactRef} className="fixed right-7 z-50" style={{ bottom: "calc(1.75rem + var(--footer-lift, 0px))" }}>
                <ContactCard
                    open={isContactOpen}
                    className="absolute bottom-full right-0 mb-3 origin-bottom-right"
                />

                <button
                    onClick={() => setIsContactOpen((open) => !open)}
                    aria-expanded={isContactOpen}
                    aria-label="Contact"
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-accent text-on-accent shadow-lg transition-all duration-300 hover:bg-fg hover:text-bg hover:shadow-[0_12px_28px_-10px_var(--foreground)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink cursor-pointer"
                >
                    <Mail className="w-7 h-7" />
                </button>
            </div>
        )}
        </>
    );
}
