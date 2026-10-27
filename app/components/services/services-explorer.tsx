"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Compass, KeyRound, RotateCcw } from "lucide-react"
import services from "../../content/services.json"
import { inr } from "../../content/inr"

const BARCODE = "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 5px, transparent 5px 8px)"

function Includes({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 border-t border-dashed border-line pt-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-fg">
          <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}

// One labelled block inside a category card; every card uses the same blocks in the same order
function CardBlock({ label, aside, children }: { label: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
        <span>{label}</span>
        {aside}
      </div>
      {children}
    </div>
  )
}

const CHIP = "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors"

function YourMatch() {
  return <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] text-on-accent">YOUR MATCH</span>
}

// ---------- "Find the right fit" questionnaire ----------

type Need = "website" | "saas" | "aiaas"
const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "website", label: "A website", hint: "Marketing site, portfolio, landing page" },
  { id: "saas", label: "A CRM, ERP or SaaS product", hint: "Inventory, orders, staff, billing, or a product to sell" },
  { id: "aiaas", label: "AI automation", hint: "Bots, document Q&A, workflows" },
]
const FEELS = [
  { id: "launch", label: "Simple & clean", hint: "Get online quickly" },
  { id: "growth", label: "Custom & editable", hint: "Stand out, update it yourself" },
  { id: "signature", label: "Immersive & unforgettable", hint: "The site is the experience" },
]
const PAYMENTS = [
  { id: "project", label: "One-time project", hint: "Fixed quote, paid in milestones" },
  { id: "lease", label: "Lower upfront, monthly", hint: "Lease it: hosting & maintenance included" },
]

type Result = { id: string; lease: boolean }

function FitFinder({ onResult }: { onResult: (r: Result | null) => void }) {
  const [need, setNeed] = useState<Need | null>(null)
  const [feel, setFeel] = useState<string | null>(null)
  const [payment, setPayment] = useState<string | null>(null)

  const steps = need === "website" ? 3 : 2
  const step = !need ? 1 : need === "website" && !feel ? 2 : !payment ? steps : steps + 1
  const done = step > steps
  const resultId = need === "website" ? feel : need
  const lease = payment === "lease"

  function finish(p: string) {
    setPayment(p)
    onResult({ id: need === "website" ? feel! : need!, lease: p === "lease" })
  }
  function reset() {
    setNeed(null)
    setFeel(null)
    setPayment(null)
    onResult(null)
  }

  const result =
    resultId && (services.classes.find((c) => c.id === resultId) ?? services.categories.find((s) => s.id === resultId))
  const resultLabel = result ? ("name" in result ? result.name : result.title) : ""
  const briefHref = `/?brief=${lease ? "lease" : resultId}#contact`

  const Option = ({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="group text-left border border-white/10 bg-white/[0.03] px-4 py-3 transition-all hover:border-accent/60 hover:bg-white/[0.06] hover:-translate-y-0.5 cursor-pointer"
    >
      <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white">
        {label}
        <ArrowRight className="w-4 h-4 text-white/30 transition-all group-hover:text-accent-ink group-hover:translate-x-0.5" />
      </span>
      <span className="block text-xs text-white/50 mt-0.5">{hint}</span>
    </button>
  )

  return (
    <div className="border border-white/10 panel text-white p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em]">
          <Compass className="w-4 h-4 text-accent-ink" /> FIND THE RIGHT FIT
        </span>
        <span className="flex items-center gap-3">
          {/* Step lights */}
          <span className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: steps }, (_, i) => (
              <span key={i} className={`w-6 h-1 rounded-full transition-colors ${i < step - 1 ? "bg-accent" : "bg-white/15"}`} />
            ))}
          </span>
          {need && (
            <button type="button" onClick={reset} className="btn-link text-xs text-white/50">
              <RotateCcw className="w-3 h-3" /> Restart
            </button>
          )}
        </span>
      </div>

      <div aria-live="polite">
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-white/70">What do you need built?</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {NEEDS.map((n) => <Option key={n.id} label={n.label} hint={n.hint} onClick={() => setNeed(n.id)} />)}
            </div>
          </div>
        )}
        {step === 2 && need === "website" && (
          <div className="space-y-3">
            <p className="text-sm text-white/70">How should it feel?</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {FEELS.map((f) => <Option key={f.id} label={f.label} hint={f.hint} onClick={() => setFeel(f.id)} />)}
            </div>
          </div>
        )}
        {!done && step === steps && (need !== "website" || feel) && (
          <div className="space-y-3">
            <p className="text-sm text-white/70">How would you like to pay?</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENTS.map((p) => <Option key={p.id} label={p.label} hint={p.hint} onClick={() => finish(p.id)} />)}
            </div>
          </div>
        )}
        {done && result && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-accent/40 bg-white/[0.03] p-4">
            <div className="space-y-1">
              <div className="text-[10px] font-semibold tracking-[0.25em] text-white/50">RECOMMENDED FOR YOU</div>
              <div className="text-lg font-bold text-accent-ink">{resultLabel}</div>
              {lease && <div className="text-sm text-white/70">Paid as a <span className="text-white font-semibold">Lease</span>: lower upfront, monthly, hosting & maintenance included.</div>}
            </div>
            <Link
              href={briefHref}
              className="btn btn-primary shrink-0"
            >
              Start a brief <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Explorer: finder + the three category cards + how you pay ----------

const RECOMMENDED_CLASS = services.classes.find((c) => "recommended" in c && c.recommended)?.id ?? services.classes[0].id

export default function ServicesExplorer() {
  const [tier, setTier] = useState<string>(RECOMMENDED_CLASS)
  const [picked, setPicked] = useState<Result | null>(null)

  // Deep links (/services#saas, #growth, #lease…): a website class selects that tier inside the
  // Websites card, then the page scrolls to the card
  useEffect(() => {
    function applyHash() {
      const id = window.location.hash.slice(1)
      const isClass = services.classes.some((c) => c.id === id)
      const target = isClass ? "websites" : id
      if (!target || !document.getElementById(target)) return
      if (isClass) setTier(id)
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }))
    }
    const first = setTimeout(applyHash, 0)
    window.addEventListener("hashchange", applyHash)
    return () => {
      clearTimeout(first)
      window.removeEventListener("hashchange", applyHash)
    }
  }, [])

  function handleResult(r: Result | null) {
    setPicked(r)
    if (r && services.classes.some((c) => c.id === r.id)) setTier(r.id)
  }

  const pickedClass = picked ? services.classes.some((c) => c.id === picked.id) : false
  const isPicked = (categoryId: string) => picked?.id === categoryId || (categoryId === "websites" && pickedClass)
  const cls = services.classes.find((c) => c.id === tier) ?? services.classes[0]

  return (
    <div className="space-y-10">
      <FitFinder onResult={handleResult} />

      {/* The three categories; website classes are picked inside the Websites card */}
      <div className="space-y-5">
        <p className="text-center text-xs font-semibold tracking-[0.25em] text-muted">THREE SERVICES · STARTING PRICES · FIXED QUOTE AFTER A SCOPING CALL</p>
        <div className="grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto_1fr_auto_auto] gap-6 lg:gap-y-0 items-stretch">
          {services.categories.map((category, c) => {
            const mine = isPicked(category.id)
            const isWeb = category.id === "websites"
            return (
              <article
                key={category.id}
                id={category.id}
                className={`relative scroll-mt-28 flex flex-col lg:grid lg:row-span-7 lg:grid-rows-subgrid border bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  mine ? "border-accent ring-2 ring-accent/50 -translate-y-1" : "border-line"
                }`}
              >
                <div className="panel flex items-center justify-between px-5 py-3 text-white">
                  <span className="text-sm font-semibold tabular-nums text-white/60">{String(c + 1).padStart(2, "0")}</span>
                  {mine && <YourMatch />}
                </div>

                <div className="px-5 pt-5 space-y-1">
                  <h2 className="text-2xl font-semibold text-fg">{category.title}</h2>
                  <p className="text-sm leading-relaxed text-muted">{category.summary}</p>
                </div>

                {/* Covers: static chips, or the class picker on the Websites card */}
                <div className="px-5 pt-5">
                  <CardBlock label={isWeb ? "Pick a class" : "Covers"}>
                    {isWeb ? (
                      <div role="tablist" aria-label="Website class" className="flex flex-wrap gap-1.5">
                        {services.classes.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            role="tab"
                            aria-selected={tier === c.id}
                            onClick={() => setTier(c.id)}
                            className={`${CHIP} cursor-pointer ${tier === c.id ? "bg-accent text-on-accent" : "bg-accent/15 text-accent-ink hover:bg-accent/30"}`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {category.covers.map((item) => (
                          <span key={item} className={`${CHIP} bg-accent/15 text-accent-ink`}>{item}</span>
                        ))}
                      </div>
                    )}
                  </CardBlock>
                </div>

                <div className="px-5 pt-5">
                  <CardBlock label="Ideal for">
                    <div className="flex flex-wrap gap-1.5">
                      {(isWeb ? cls.for : category.for).map((who) => (
                        <span key={who} className={`${CHIP} border border-line font-medium text-fg`}>{who}</span>
                      ))}
                    </div>
                  </CardBlock>
                </div>

                <div className="px-5 pt-5">
                  <CardBlock
                    label={isWeb ? `Included · ${cls.name}` : "Included"}
                    aside={
                      isWeb && "recommended" in cls && cls.recommended ? (
                        <span className="rounded-full border border-accent/60 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] text-accent-ink">RECOMMENDED</span>
                      ) : null
                    }
                  >
                    <Includes items={isWeb ? cls.includes : category.includes} />
                  </CardBlock>
                </div>

                <div className="px-5 py-5">
                  <CardBlock label="Price depends on">
                    <div className="flex flex-wrap gap-1.5">
                      {category.priceFactors.map((factor) => (
                        <span key={factor} className={`${CHIP} border border-dashed border-line font-medium text-muted`}>{factor}</span>
                      ))}
                    </div>
                  </CardBlock>
                </div>

                <div className="relative flex items-center justify-between gap-3 border-t-2 border-dashed border-line px-5 py-3.5">
                  <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-bg" aria-hidden="true" />
                  <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-bg" aria-hidden="true" />
                  <span className="flex items-baseline gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-muted">FROM</span>
                    <span className="text-xl font-bold tabular-nums text-fg">{inr(category.priceFrom)}</span>
                  </span>
                  <span aria-hidden="true" className="h-6 w-16 text-fg/50" style={{ background: BARCODE }} />
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* How you pay: a full build or a lease, for any category */}
      <div className="space-y-5">
        <p className="text-center text-xs font-semibold tracking-[0.25em] text-muted">HOW YOU PAY · FULL BUILD OR LEASE · ANY CATEGORY</p>
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {services.engagements
            .filter((e) => e.id === "build" || e.id === "lease")
            .map((e) => {
              const isLease = e.id === "lease"
              const stats = isLease
                ? [
                    { label: "SETUP", value: services.lease.setup },
                    { label: "MONTHLY", value: services.lease.monthly },
                  ]
                : e.stats ?? []
              const points = isLease ? services.lease.includes : e.points ?? []
              return (
                <article
                  key={e.id}
                  id={isLease ? "lease" : "full-build"}
                  className={`scroll-mt-28 relative flex flex-col gap-4 border p-5 sm:p-6 transition-all duration-300 ${
                    isLease ? `panel text-white ${picked?.lease ? "border-accent ring-2 ring-accent/50" : "border-white/10"}` : "bg-surface border-line"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-lg font-semibold ${isLease ? "text-white" : "text-fg"}`}>{isLease ? services.lease.title : e.title}</h3>
                    {isLease && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.2em] text-accent-ink">
                        <KeyRound className="w-3 h-3" /> LOWER UPFRONT
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${isLease ? "text-white/70" : "text-muted"}`}>{isLease ? services.lease.summary : e.summary}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((s) => (
                      <div key={s.label} className={`border px-3 py-2.5 ${isLease ? "border-white/10 bg-white/[0.03]" : "border-line bg-bg"}`}>
                        <div className={`text-[10px] tracking-[0.2em] ${isLease ? "text-white/50" : "text-muted"}`}>{s.label}</div>
                        <div className={`text-sm font-semibold ${isLease ? "text-white" : "text-fg"}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <ul className={`space-y-2 border-t border-dashed pt-4 ${isLease ? "border-white/15" : "border-line"}`}>
                    {points.map((item) => (
                      <li key={item} className={`flex items-start gap-2 text-sm ${isLease ? "text-white" : "text-fg"}`}>
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
        </div>
      </div>
    </div>
  )
}
