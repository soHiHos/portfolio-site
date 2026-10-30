import { Document, Font, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer"
import { CONTACT_EMAIL, CONTACT_LINKEDIN } from "../../content/contact"
import { formatRange, inr, type Contact, type Estimate } from "./estimate"

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

const date = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

function Tick({ children }: { children: string }) {
  return (
    <View style={s.item}>
      <Text style={s.tick}>✓</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  )
}

function EstimateDocument({ contact, e, today }: { contact: Contact; e: Estimate; today: Date }) {
  const own = (
    <View style={s.box} wrap={false}>
      <Text style={s.quote}>Own it</Text>
      <View style={s.row}>
        <Text>Build, paid in milestones</Text>
        <Text style={s.big}>{formatRange(e.build)}</Text>
      </View>
      {e.monthly[1] > 0 && (
        <View style={s.row}>
          <Text>Running fees</Text>
          <Text>{formatRange(e.monthly)} a month</Text>
        </View>
      )}
      <Text style={s.muted}>Optional care plan from {inr(e.care)} a month: hosting, security updates, monitoring, backups and bug fixes. You own the code and data from day one.</Text>
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
          {e.subscribe && (
            <View style={s.box} wrap={false}>
              <Text style={s.quote}>Subscribe</Text>
              <View style={s.row}>
                <Text>To start (setup fee)</Text>
                <Text style={s.big}>{formatRange(e.subscribe.setup)}</Text>
              </View>
              <View style={s.row}>
                <Text>Every month</Text>
                <Text style={s.big}>{formatRange(e.subscribe.monthly)}</Text>
              </View>
              <Text style={s.muted}>
                One fee covering hosting, maintenance, support and small changes. {e.subscribe.minimumMonths} months minimum. Your data is always yours, and you can buy the code any time.
              </Text>
            </View>
          )}
          {own}
          <Text style={{ marginBottom: 4 }}>
            <Text style={{ fontWeight: 600 }}>Timeline:</Text> about {e.timeline} for the full build, depending on what&apos;s included.
          </Text>
          {e.needsCall && <Text style={s.muted}>With more than 2,000 users, this range is a rough guide. We&apos;ll size it properly on the call.</Text>}
          {e.ai && (
            <Text style={[s.muted, { marginTop: 4 }]}>
              AI usage: AI models charge for every use. Either you pay the provider&apos;s usage cost directly, at actual cost with no markup, or it&apos;s included in a higher monthly fee with a usage limit agreed upfront.
            </Text>
          )}
          <View style={s.note} wrap={false}>
            <Text style={s.quote}>This is an estimate. Your fixed quote comes after a free 30-minute call.</Text>
            <Text style={s.muted}>To book it, reply to {CONTACT_EMAIL} with a time that suits you.</Text>
          </View>
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.h2}>What&apos;s included</Text>
          <Tick>Built around how your business already works, using the data you already have</Tick>
          <Tick>Simple screens on any phone, learned in a day</Tick>
          <Tick>Setup and training for your team</Tick>
          <Tick>A live demo every week while it&apos;s built</Tick>
          <Tick>Your data is always yours</Tick>
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.h2}>Suggested first step: a {e.pilotDays}-day pilot</Text>
          <Text>
            Pick one process, like invoicing, stock tracking or dispatch, and I&apos;ll digitize or automate just that one thing, for a fixed {formatRange(e.pilot)}. It&apos;s
            measured before and after, you decide at the end whether to continue, and if you do, the pilot fee counts toward your setup.
          </Text>
        </View>

        <Text style={s.footer} fixed>
          Soham Kar · {CONTACT_EMAIL} · {CONTACT_LINKEDIN.replace("https://www.", "")} · Valid until {date(e.validUntil)}
        </Text>
      </Page>
    </Document>
  )
}

let fontsRegistered = false

export async function estimatePdf(contact: Contact, e: Estimate, today = new Date()): Promise<Blob> {
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
  return pdf(<EstimateDocument contact={contact} e={e} today={today} />).toBlob()
}
