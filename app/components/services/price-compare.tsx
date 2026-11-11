"use client";

import { useState } from "react";
import { BUYOUT, PRICING, SCALING, buyoutPrice, scaledPrices } from "../../content/pricing";
import { inr } from "../estimator/estimate";

const IDS = ["automation", "erp", "app"] as const;
type Id = (typeof IDS)[number];
export type CompareServiceId = Id;

const MAX_MONTHS = 48;
const TABLE_MONTHS = [6, 12, 24, 36];
const MAX_SIZE = 4; // the size slider runs from the "from" setup up to this many times it
const STEP = 5000;

const ROUTES = [
  { key: "stay", title: "Stay on the monthly plan", sub: "Setup plus every monthly fee so far." },
  { key: "later", title: "Start monthly, buy outright later", sub: "Everything you paid so far, plus the outright price then." },
  { key: "now", title: "Buy outright from day one", sub: "The outright price, then the maintenance plan each month. You pay for your own hosting." },
] as const;
type RouteKey = (typeof ROUTES)[number]["key"];

// What a client pays over time on each route, for one service. Setup, the monthly fee, the code price and the
// maintenance plan come from PRICING and scale with the project size (see SCALING): the monthly plan rises more slowly
// than setup. The visitor can also set their own code price, which is quoted after scope. Taking the code later counts
// the setup paid and half the monthly fees paid toward it, never below the floor (BUYOUT.floorShare of the code price).
// `service` fixes it to one service (a service's own page): the service tabs are then hidden.
export default function PriceCompare({ service }: { service?: Id }) {
  const [id, setId] = useState<Id>(service ?? "automation");
  const base = PRICING.services[id];
  const [setup, setSetup] = useState<number>(base.setup);
  const [months, setMonths] = useState(12);
  const [codeRaw, setCodeRaw] = useState("");
  const [custom, setCustom] = useState(false);

  const p = scaledPrices(base, setup);
  const typed = Number(codeRaw.replace(/\D/g, ""));
  const buyout = custom && typed > 0 ? typed : p.buyout;
  const growth = Math.round(SCALING.monthlyShare * 100);

  const totals = (n: number): Record<RouteKey, number> => ({
    stay: p.setup + n * p.monthly,
    later: n === 0 ? buyout : p.setup + n * p.monthly + buyoutPrice({ buyoutFrom: buyout, setupPaid: p.setup, monthlyFeesPaid: n * p.monthly }),
    now: buyout + n * p.maintenance,
  });
  const priceThen = (n: number) => buyoutPrice({ buyoutFrom: buyout, setupPaid: p.setup, monthlyFeesPaid: n * p.monthly });
  const lowest = (t: Record<RouteKey, number>) => (Object.keys(t) as RouteKey[]).reduce((a, b) => (t[b] < t[a] ? b : a));

  const now = totals(months);
  const cheapest = lowest(now);

  // The month after which owning from day one costs less than staying on the monthly plan
  const crossover = p.monthly > p.maintenance ? Math.max(1, Math.ceil((buyout - p.setup) / (p.monthly - p.maintenance))) : null;

  const chooseService = (k: Id) => {
    setId(k);
    setSetup(PRICING.services[k].setup);
    setCodeRaw("");
    setCustom(false);
  };

  const label = "text-sm font-semibold text-fg";
  const hint = "text-xs leading-relaxed text-muted";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Fixed at the top of the dialog: the title and the service tabs stay put while the rest scrolls */}
      <div className="shrink-0 space-y-4 border-b border-line px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <div className="space-y-1 pr-10">
          <h3 className="text-xl font-bold text-fg">The two routes side by side</h3>
          <p className="text-sm leading-relaxed text-muted">
            {service
              ? `Compare staying on the monthly plan with buying outright, for ${base.title}. Drag the sliders: how big the project is, and how long you would stay.`
              : "Compare staying on the monthly plan with buying outright. Choose a service, then drag the sliders: how big the project is, and how long you would stay."}
          </p>
        </div>

        {/* Service */}
        {!service && (
        <div role="radiogroup" aria-label="Service" className="grid gap-px border border-line bg-line sm:grid-cols-3">
          {IDS.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={id === k}
              onClick={() => chooseService(k)}
              className={`cursor-pointer px-4 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink ${
                id === k ? "bg-accent text-on-accent" : "bg-white text-fg hover:bg-fg/5 dark:bg-surface"
              }`}
            >
              {PRICING.services[k].title}
            </button>
          ))}
        </div>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
      {/* Sliders */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="cmp-size" className={label}>Project size</label>
            <output htmlFor="cmp-size" className="text-sm font-bold tabular-nums text-accent-ink">Setup {inr(p.setup)}</output>
          </div>
          <input
            id="cmp-size"
            type="range"
            min={base.setup}
            max={base.setup * MAX_SIZE}
            step={STEP}
            value={setup}
            onChange={(e) => setSetup(Number(e.target.value))}
            aria-valuetext={`Setup ${inr(p.setup)}`}
            style={{ accentColor: "var(--accent)" }}
            className="h-6 w-full cursor-pointer"
          />
          <div className={`flex justify-between ${hint}`}>
            <span>Smaller: {inr(base.setup)}</span>
            <span>Bigger: {inr(base.setup * MAX_SIZE)}</span>
          </div>
          <p className={hint}>
            Monthly plan {inr(p.monthly)}/month. Bigger projects cost more to host and support, so it rises more slowly than setup: if setup doubles, it goes up by about {growth}%.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="cmp-months" className={label}>How long you stay</label>
            <output htmlFor="cmp-months" className="text-sm font-bold tabular-nums text-accent-ink">{months} months</output>
          </div>
          <input
            id="cmp-months"
            type="range"
            min={1}
            max={MAX_MONTHS}
            step={1}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            aria-valuetext={`${months} months`}
            style={{ accentColor: "var(--accent)" }}
            className="h-6 w-full cursor-pointer"
          />
          <div className={`flex justify-between ${hint}`}>
            <span>1 month</span>
            <span>{MAX_MONTHS} months</span>
          </div>
        </div>
      </div>

      {/* Code price: optional override */}
      <div className="space-y-2">
        {!custom ? (
          <button type="button" onClick={() => setCustom(true)} className="cursor-pointer text-sm font-semibold text-accent-ink underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink">
            Set your own outright price
          </button>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <label className="space-y-1">
              <span className={label}>Outright price</span>
              <input
                inputMode="numeric"
                value={codeRaw}
                onChange={(e) => setCodeRaw(e.target.value)}
                placeholder={inr(p.buyout)}
                className="mt-1 block w-48 border border-line bg-white px-3 py-2 text-sm tabular-nums text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink dark:bg-surface"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setCustom(false);
                setCodeRaw("");
              }}
              className="btn btn-secondary btn-sm"
            >
              Use {inr(p.buyout)}
            </button>
          </div>
        )}
        <p className={hint}>
          {custom ? "What you expect buying outright to cost. " : ""}The outright price is quoted after scope: about {inr(p.buyout)} for this size. Your setup and half of your monthly fees count toward it.
        </p>
      </div>

      {/* What it adds up to at the chosen month */}
      <div aria-live="polite" className="space-y-3">
        <p className="text-sm font-semibold text-fg">After {months} months, in total</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {ROUTES.map((r) => {
            const best = cheapest === r.key;
            return (
              <div key={r.key} className={`space-y-1 border p-4 ${best ? "border-accent bg-accent/10" : "border-line bg-white dark:bg-surface"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-muted">{r.title}</p>
                  {best && <span className="border border-accent bg-accent px-1.5 py-0.5 text-[0.65rem] font-semibold text-on-accent">Lowest</span>}
                </div>
                <p className="text-2xl font-bold tabular-nums text-fg">{inr(now[r.key])}</p>
                <p className={hint}>
                  {r.key === "later" ? `That is ${inr(p.setup + months * p.monthly)} paid so far plus ${inr(priceThen(months))} to own it.` : r.sub}
                </p>
              </div>
            );
          })}
        </div>
        {now.later > now.now && (
          <p className="text-sm leading-relaxed text-muted">
            Starting monthly and buying outright after {months} months costs about <span className="font-semibold text-fg">{inr(now.later - now.now)}</span> more than buying outright on day one. In return you pay less up front, and I host and support it while you decide.
          </p>
        )}
        {crossover !== null && (
          <p className="text-sm leading-relaxed text-muted">
            Buying outright on day one costs less than staying on the monthly plan after about <span className="font-semibold text-fg">{crossover} months</span>. The monthly plan includes your hosting, support and updates, which you take on yourself when you buy outright.
          </p>
        )}
      </div>

      {/* Table: pick a month */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-fg">At a glance: total paid by each month</p>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">{base.title}: total paid on each route at 6, 12, 24 and 36 months</caption>
            <thead>
              <tr className="border-b border-line align-top text-fg">
                <th scope="col" className="px-4 py-3 font-semibold">
                  After
                  <span className="block text-xs font-normal text-muted">months stayed</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Stay on the monthly plan
                  <span className="block text-xs font-normal text-muted">total paid</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Start monthly, buy outright later
                  <span className="block text-xs font-normal text-muted">total paid, including the purchase</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Buy outright from day one
                  <span className="block text-xs font-normal text-muted">total paid, including maintenance</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Cost to buy at that point
                  <span className="block text-xs font-normal text-muted">on top of what you have paid</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_MONTHS.map((n) => {
                const t = totals(n);
                const low = lowest(t);
                const cell = (k: RouteKey) => `px-4 py-3 tabular-nums ${low === k ? "font-bold text-fg" : "text-muted"}`;
                return (
                  <tr key={n} className={`border-t border-line/60 first:border-t-0 ${months === n ? "bg-accent/10" : ""}`}>
                    <th scope="row" className="p-0 font-normal">
                      <button
                        type="button"
                        onClick={() => setMonths(n)}
                        aria-label={`Show ${n} months`}
                        className="w-full cursor-pointer px-4 py-3 text-left font-semibold text-accent-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-ink"
                      >
                        {n} months
                      </button>
                    </th>
                    <td className={cell("stay")}>{inr(t.stay)}</td>
                    <td className={cell("later")}>{inr(t.later)}</td>
                    <td className={cell("now")}>{inr(t.now)}</td>
                    <td className="px-4 py-3 tabular-nums text-muted">{inr(priceThen(n))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={hint}>The lowest total in each row is bold. Select a row to see that month above.</p>
      </div>

      <p className={hint}>
        Before GST. Buying outright counts your setup and {Math.round(BUYOUT.feeCreditShare * 100)}% of your monthly fees toward the price, down to a minimum of {Math.round(BUYOUT.floorShare * 100)}% of the outright price. AI usage and third-party fees are extra on every route. Your own quote depends on your project.
      </p>
      </div>
    </div>
  );
}
