"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ESTIMATOR_ON } from "./estimator/estimate"

const PAGES = [
  { href: "/privacy", label: "Privacy policy", note: "What the site collects and why" },
  { href: "/terms", label: "Terms", note: "Plans, payments and leaving" },
]

// Layout for the privacy and terms pages: a menu of the two pages in a left column (sticky while scrolling) and the
// page's content on the right. On small screens the menu sits above the content as a row.
// The menu shows only while the terms page is live (it 404s until pricing is reviewed); until then the content
// renders alone, so the privacy page never links to it early.
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const content = <section className="max-w-3xl min-w-0 space-y-8 pb-12">{children}</section>
  if (!ESTIMATOR_ON) return content
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-10 lg:gap-12">
      <nav aria-label="Legal pages" className="md:sticky md:top-28 md:w-56 md:shrink-0 md:self-start">
        <p className="mb-3 text-xs font-medium text-muted">Legal</p>
        {/* Plain text on a thin rail (under the row on small screens, left of the column on larger ones). The current
            page gets an amber bar on the rail and an accent number; the others nudge along on hover */}
        <ul className="flex border-b border-line md:flex-col md:border-b-0 md:border-l">
          {PAGES.map(({ href, label, note }, i) => {
            const active = pathname === href
            return (
              <li key={href} className="flex-1 md:flex-none">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex items-baseline gap-3 py-2.5 pr-4 md:py-3 md:pl-5 md:pr-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute bg-accent transition-transform duration-300 motion-reduce:transition-none -bottom-px left-0 right-4 h-0.5 origin-left md:-left-px md:right-auto md:top-0 md:bottom-0 md:h-auto md:w-0.5 md:origin-top ${
                      active ? "scale-100" : "scale-0 group-hover:scale-100 group-hover:bg-fg/30"
                    }`}
                  />
                  <span className={`text-xs tabular-nums ${active ? "text-accent-ink font-semibold" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                    <span className={`block font-display text-base transition-colors ${active ? "font-semibold text-fg" : "font-medium text-muted group-hover:text-fg"}`}>{label}</span>
                    <span className="mt-0.5 hidden text-xs text-muted md:block">{note}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {content}
    </div>
  )
}
