// app/components/headers/header.tsx
"use client"

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, BookOpenIcon, Contact, Network } from "lucide-react";
import { ContactMenu } from "../ui/menu/contact-menu";

const sectionIds = ["work", "about", "research"];

function useActiveSection(ids: string[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        const offset = 120; // px from the top of the viewport, roughly the header's height

        function updateActiveId() {
            let current: string | null = null;
            for (const el of elements) {
                if (el.getBoundingClientRect().top <= offset) {
                    current = el.id;
                }
            }
            setActiveId(current);
        }

        updateActiveId();
        window.addEventListener('scroll', updateActiveId, { passive: true });
        window.addEventListener('resize', updateActiveId);
        return () => {
            window.removeEventListener('scroll', updateActiveId);
            window.removeEventListener('resize', updateActiveId);
        };
    }, [ids]);

    return activeId;
}

const navLinkClasses = "flex items-center justify-center h-8 text-black font-medium hover:text-white hover:bg-black transition-colors px-2 rounded-xl group";
const navIconClasses = "shrink-0 overflow-hidden transition-[width,margin,opacity] duration-200 group-hover:animate-pulse group-hover:w-5 group-hover:mr-2 group-hover:opacity-100";
const navLinkActiveClasses = "text-white bg-black rounded-xl";

export default function Header() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const contactRef = useRef<HTMLDivElement>(null);
    const activeSection = useActiveSection(sectionIds);

    const isPastHero = activeSection !== null;

    useEffect(() => {
        if (!isPastHero) setIsContactOpen(false);
    }, [isPastHero]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
                setIsContactOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
        <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 bg-white/50 backdrop-blur-lg shadow-md rounded-xl">
            <div className="flex items-center justify-center max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
                {/* Navigation */}
                <nav className="flex items-center space-x-1 sm:space-x-4">
                    <Link
                        href="#work"
                        aria-current={activeSection === "work" ? "true" : undefined}
                        className={`${navLinkClasses} ${activeSection === "work" ? navLinkActiveClasses : ""}`}
                    >
                        <Network
                            className={`${navIconClasses} ${activeSection === "work" ? "w-5 mr-2 opacity-100" : "w-0 mr-0 opacity-0"}`}
                        />
                        Work

                    </Link>

                    <Link
                        href="#about"
                        aria-current={activeSection === "about" ? "true" : undefined}
                        className={`${navLinkClasses} ${activeSection === "about" ? navLinkActiveClasses : ""}`}
                    >
                        <Contact
                            className={`${navIconClasses} ${activeSection === "about" ? "w-5 mr-2 opacity-100" : "w-0 mr-0 opacity-0"}`}
                        />
                        About
                    </Link>

                    <Link
                        href="#research"
                        aria-current={activeSection === "research" ? "true" : undefined}
                        className={`${navLinkClasses} ${activeSection === "research" ? navLinkActiveClasses : ""}`}
                    >
                        <BookOpenIcon
                            className={`${navIconClasses} ${activeSection === "research" ? "w-5 mr-2 opacity-100" : "w-0 mr-0 opacity-0"}`}
                        />
                        Research
                    </Link>
                </nav>
            </div>
        </header>

        {/* Floating contact button, shown once scrolled past the hero section */}
        {isPastHero && (
            <div ref={contactRef} className="fixed bottom-7 right-7 z-50">
                <ContactMenu
                    open={isContactOpen}
                    onClose={() => setIsContactOpen(false)}
                    className="absolute bottom-full right-0 mb-2 origin-bottom-right"
                />

                <button
                    onClick={() => setIsContactOpen((open) => !open)}
                    aria-expanded={isContactOpen}
                    aria-label="Contact"
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-black text-white sm:bg-white/50 sm:text-black sm:hover:bg-black sm:hover:text-white backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer"
                >
                    <Contact className="w-6 h-6" />
                </button>
            </div>
        )}
        </>
    );
}
