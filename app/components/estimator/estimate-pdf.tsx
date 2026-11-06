import { Document, Font, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer"
import { CONTACT_EMAIL, CONTACT_LINKEDIN } from "../../content/contact"
import { PRICING } from "../../content/pricing"
import { GST_PERCENT, inr, type Contact, type Estimate } from "./estimate"

// The estimate PDF, rendered in the visitor's browser (no server work). Inter is bundled in /public/fonts
// because the built-in PDF fonts have no ₹ sign.

const INK = "#102a43"
const MUTED = "#486078"
const ACCENT = "#0f4c81"
const LINE = "#d3dde5"

const s = StyleSheet.create({
  page: { fontFamily: "Inter", fontSize: 10, color: INK, padding: 44, paddingBottom: 64, lineHeight: 1.45 },
  bar: { height: 4, backgroundColor: "#e8a33d", marginBottom: 18 },
  title: { fontSize: 20, fontWeight: 600, lineHeight: 1.2, marginBottom: 6 },
  meta: { color: MUTED },
  section: { marginTop: 18 },
  h2: { fontSize: 12, fontWeight: 600, marginBottom: 6, color: ACCENT },
  quote: { fontWeight: 600, marginBottom: 2 },
  muted: { color: MUTED },
  item: { flexDirection: "row", marginBottom: 2 },
  tick: { width: 12, color: ACCENT },
  box: { borderWidth: 1, borderColor: LINE, padding: 12, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  big: { fontSize: 13, fontWeight: 600 },
  note: { marginTop: 10, padding: 10, backgroundColor: "#eef3f7" },
  footer: { position: "absolute", left: 44, right: 44, bottom: 28, fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 6 },
})

const from = (n: number) => `from ${inr(n)}`
const date = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

function Tick({ children }: { children: string }) {
  return (
    <View style={s.item}>
      <Text style={s.tick}>✓</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  )
}

export function EstimateDocument({ contact, e, today, preferBuyout }: { contact: Contact; e: Estimate; today: Date; preferBuyout: boolean }) {
  const T = PRICING.terms
  const licence = e.licence !== null && (
    <View style={s.box} wrap={false}>
      <Text style={s.quote}>Monthly licence</Text>
      <View style={s.row}>
        <Text>Setup, paid in three milestones</Text>
        <Text style={s.big}>{from(e.setup)}</Text>
      </View>
      <View style={s.row}>
        <Text>Monthly licence</Text>
        <Text style={s.big}>{from(e.licence)} a month</Text>
      </View>
      {e.siteCare !== null && (
        <View style={s.row}>
          <Text>Website hosting and care (optional, no minimum)</Text>
          <Text>{inr(e.siteCare)} a month</Text>
        </View>
      )}
      <Text style={s.muted}>
        Setup covers the build, onboarding and moving your existing records in (up to {T.dataFiles} source files, then quoted). The licence covers your right to use the software, hosting, uptime, backups, bug fixes and security patches; I keep the code. Minimum {T.minMonths} months from go-live, then {T.noticeDays} days&apos; notice. Monthly fees start at go-live. Your data is always yours and can be exported at any time.
      </Text>
    </View>
  )

  const buyout = e.buyout !== null && (
    <View style={s.box} wrap={false}>
      <Text style={s.quote}>Own the code</Text>
      <View style={s.row}>
        <Text>Setup, paid in three milestones</Text>
        <Text style={s.big}>{from(e.setup)}</Text>
      </View>
      <View style={s.row}>
        <Text>Own the code, one-time</Text>
        <Text style={s.big}>{from(e.buyout)}</Text>
      </View>
      {e.retainer !== null && (
        <View style={s.row}>
          <Text>Optional hosting retainer, month to month</Text>
          <Text>{from(e.retainer)} a month</Text>
        </View>
      )}
      <Text style={s.muted}>
        No minimum period; leave any time. You receive the client-specific code and a data export, with a {T.bugFixDays}-day free bug-fix window after handover. The reusable core stays licensed for your own business only. Hosting and running it become yours unless you take the retainer; migration help is a quoted one-time fee.
      </Text>
    </View>
  )

  // A marketing site alone has no licence or buyout: the code is handed over with setup
  const siteOnly = e.licence === null && (
    <View style={s.box} wrap={false}>
      <Text style={s.quote}>Marketing &amp; business sites</Text>
      <View style={s.row}>
        <Text>Setup, paid in three milestones</Text>
        <Text style={s.big}>{from(e.setup)}</Text>
      </View>
      {e.siteCare !== null && (
        <View style={s.row}>
          <Text>Hosting and care (optional, no minimum)</Text>
          <Text>{inr(e.siteCare)} a month</Text>
        </View>
      )}
      <Text style={s.muted}>The code is handed over with setup. Design and content changes after launch are quoted separately; the domain is at cost.</Text>
    </View>
  )

  return (
    <Document title={`Price estimate for ${contact.business}`} author="Soham Kar">
      <Page size="A4" style={s.page}>
        <View style={s.bar} />
        <Text style={s.title}>Price estimate</Text>
        <Text style={s.meta}>
          Prepared for {contact.name}, {contact.business} · {date(today)} · Valid until {date(e.validUntil)}
        </Text>

        <View style={s.section}>
          <Text style={s.h2}>What you told me</Text>
          <Text style={{ marginBottom: 6 }}>You run a {e.business.label.toLowerCase()} business and want to fix:</Text>
          {e.problems.map((p) => (
            <Text key={p} style={s.quote}>&ldquo;{p}&rdquo;</Text>
          ))}
          {e.problems.length === 0 && <Text style={s.quote}>Something specific to how your business works.</Text>}
        </View>

        <View style={s.section}>
          <Text style={s.h2}>Recommended solution</Text>
          {e.solutions.map((sol) => (
            <View key={sol.title} style={{ marginBottom: 6 }} wrap={false}>
              <Text style={s.quote}>{sol.title}</Text>
              {sol.includes.map((i) => (
                <Tick key={i}>{i}</Tick>
              ))}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.h2}>Estimated price</Text>
          {siteOnly}
          {preferBuyout ? buyout : licence}
          {preferBuyout ? licence : buyout}
          <Text style={[s.muted, { marginBottom: 6 }]}>
            These are &quot;from&quot; prices, not a quote; larger systems are quoted. Prices exclude GST. GST at {GST_PERCENT}% is added as a separate line on each invoice. Monthly fees are billed in advance by UPI. Converting a licence plan to ownership is not possible before month {T.buyoutFromMonth} unless we agree otherwise, and the buyout price is paid on top of fees already paid. Changes to an existing system are quoted per request: small from {inr(PRICING.changes.small)}, medium from {inr(PRICING.changes.medium)}; plan clients get {Math.round(PRICING.changes.planDiscount * 100)}% off.
          </Text>
          <Text style={{ marginBottom: 4 }}>
            <Text style={{ fontWeight: 600 }}>Timeline:</Text> about {e.timeline} for the full build, starting once you&apos;ve sent your data and approvals.
          </Text>
          {e.needsCall && <Text style={s.muted}>With more than 2,000 users, this range is a rough guide. We&apos;ll size it properly on the call.</Text>}
          {e.ai && (
            <Text style={[s.muted, { marginTop: 4 }]}>
              AI, API and WhatsApp usage: {inr(PRICING.usageIncluded)} a month is included. Above that it is billed at cost plus {Math.round(PRICING.usageMarkup * 100)}%, with your approval first.
            </Text>
          )}
          <View style={s.note} wrap={false}>
            <Text style={s.quote}>This is an estimate. Your proposal comes after a free call.</Text>
            <Text style={s.muted}>To book it, reply to {CONTACT_EMAIL} with a time that suits you.</Text>
            <Text style={[s.muted, { marginTop: 4 }]}>
              Not ready to commit? A workflow audit and decision report is {inr(PRICING.audit.price)}, fully credited toward setup if you go ahead within {PRICING.audit.creditDays} days.
            </Text>
          </View>
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.h2}>What&apos;s included</Text>
          <Tick>Built around how your business already works, using the data you already have</Tick>
          <Tick>Simple screens that work on a phone</Tick>
          <Tick>Setup and a handover session for your team</Tick>
          <Tick>A demo at each milestone while it&apos;s built</Tick>
          <Tick>Your data is always yours</Tick>
        </View>

        <Text style={s.footer} fixed>
          Soham Kar · {CONTACT_EMAIL} · {CONTACT_LINKEDIN.replace("https://www.", "")} · Valid until {date(e.validUntil)}
        </Text>
      </Page>
    </Document>
  )
}

let fontsRegistered = false

export async function estimatePdf(contact: Contact, e: Estimate, preferBuyout: boolean, today = new Date()): Promise<Blob> {
  if (!fontsRegistered) {
    Font.register({
      family: "Inter",
      fonts: [
        { src: `${window.location.origin}/fonts/Inter-Regular.ttf`, fontWeight: 400 },
        { src: `${window.location.origin}/fonts/Inter-SemiBold.ttf`, fontWeight: 600 },
      ],
    })
    Font.registerHyphenationCallback((word) => [word])
    fontsRegistered = true
  }
  return pdf(<EstimateDocument contact={contact} e={e} today={today} preferBuyout={preferBuyout} />).toBlob()
}
