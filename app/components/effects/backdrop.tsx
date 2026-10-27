"use client"

import { useEffect, useState } from "react"

// Fixed map backdrop: a real street map of central Raipur (OpenStreetMap data, converted to SVG
// path strings in /public/maps/raipur.json) with flight routes above it.
// The map is fetched after load so its ~430KB stays out of the HTML; until then (or if it fails)
// only the flight patterns show. Credit for the data is in the footer.

const W = 1600
const H = 1000

type CityMap = Record<"major" | "mid" | "minor" | "rail" | "waterway" | "water" | "parks" | "runway" | "taxiway" | "apron", string>

// Traffic for Raipur's Swami Vivekananda Airport (runway 06/24, lower right of the map):
// arrivals sweep in and land on either runway direction, departures take off and turn away, and one
// overflight arcs across at cruise altitude. Planes are separated in time: all routes share one 60s
// cycle (so relative timing never drifts) and the begin offsets were found by simulating a full
// cycle (every moment, including fades), then verified in-browser, keeping planes 110+ units
// apart. A begin of -k puts a plane k seconds into its cycle at load.
const FLIGHTS = [
  { d: "M-80 420 C520 560 1047.7 1009.6 1270.3 875.2 L1364.5 818.4", begin: "0s" }, // west arrival, lands 06
  { d: "M200 -80 C600 450 1073.4 994.1 1270.3 875.2 L1364.5 818.4", begin: "-30s" }, // north-west arrival, lands 06
  { d: "M1000 -80 C1250 250 1662.6 638.4 1405.8 793.4 L1311.6 850.2", begin: "-13s" }, // north arrival, lands 24
  { d: "M1278.9 870 L1385.5 805.7 C1577 690 1600 400 1500 -80", begin: "-13s" }, // departs 06, turns north
  { d: "M1397.2 798.6 L1290.6 862.9 C1099.1 978.6 700 1050 -80 760", begin: "-58s" }, // departs 24, turns west
  { d: "M-80 150 C520 30 1080 60 1700 200", begin: "-57s" }, // high overflight
]
const FLIGHT_DUR = "60s"
// Small plane silhouette, nose pointing +x so animateMotion's rotate="auto" aims it along the route
const PLANE = "M7 0 L1 -1.5 L-1 -7 L-2.5 -7 L-1.5 -1.5 L-5 -1 L-6.5 -3 L-7.5 -3 L-6.5 0 L-7.5 3 L-6.5 3 L-5 1 L-1.5 1.5 L-2.5 7 L-1 7 L1 1.5 Z"

export default function Backdrop() {
  const [map, setMap] = useState<CityMap | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/maps/raipur.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setMap(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      {/* Map layer: blurred slightly and kept separate from the animated flights, so the blur is
          rasterised once instead of being recomputed on every animation frame */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full blur-[1.2px]">
        {map && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={map.parks} fill="var(--park)" />
            {/* Water under the roads, so bridges cross it */}
            <path d={map.waterway} stroke="var(--river-bank)" strokeWidth={7.5} />
            <path d={map.water} fill="var(--river)" stroke="var(--river-bank)" strokeWidth={1.5} />
            <path d={map.waterway} stroke="var(--river)" strokeWidth={5.5} />
            <path d={map.minor} stroke="var(--street)" strokeWidth={1} />
            <path d={map.mid} stroke="var(--street-major)" strokeWidth={2} />
            <path d={map.major} stroke="var(--street-major)" strokeWidth={3.2} />
            <path d={map.rail} stroke="var(--rail)" strokeWidth={1.6} strokeDasharray="7 4" />
            {/* Airport: apron/terminal, taxiways, then the runway with its centreline */}
            <path d={map.apron} fill="var(--runway)" fillOpacity={0.45} />
            <path d={map.taxiway} stroke="var(--runway)" strokeWidth={2.2} />
            <path d={map.runway} stroke="var(--runway)" strokeWidth={7} strokeLinecap="butt" />
            <path d={map.runway} stroke="var(--background)" strokeWidth={0.8} strokeDasharray="5 4" strokeLinecap="butt" />
          </g>
        )}
      </svg>

      {/* Flight patterns above the city, kept sharp */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        {FLIGHTS.map((flight, i) => (
          <g key={flight.d}>
            <path id={`flight-${i}`} d={flight.d} fill="none" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="1.3" strokeDasharray="6 9" />
            <path className="flight-plane" d={PLANE} fill="var(--accent)" fillOpacity="0.85" transform="scale(1.4)" opacity={0}>
              <animateMotion dur={FLIGHT_DUR} begin={flight.begin} repeatCount="indefinite" rotate="auto">
                <mpath href={`#flight-${i}`} />
              </animateMotion>
              <animate attributeName="opacity" dur={FLIGHT_DUR} begin={flight.begin} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.02;0.98;1" />
            </path>
          </g>
        ))}
      </svg>
    </div>
  )
}
