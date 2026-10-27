import { ImageResponse } from "next/og";
import { CONTACT_EMAIL } from "../content/contact";

// Downloadable boarding pass (PNG) with contact details, generated at build time
export const dynamic = "force-static";

const BARS = Array.from({ length: 30 }, (_, i) => [2, 1, 3, 1, 2, 4, 1, 2][i % 8]);

export function GET() {
  const field = (label: string, value: string, accent = false) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 16, letterSpacing: 4, color: "#8b8f99" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent ? "#f97316" : "#ededed" }}>{value}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0d12", padding: 40 }}>
        <div style={{ flex: 1, display: "flex", borderRadius: 28, background: "#161920", border: "2px solid #2a2e38", overflow: "hidden" }}>
          {/* Ticket */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48, borderRight: "4px dashed #2a2e38" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: 6, color: "#8b8f99" }}>
              <span>BOARDING PASS · SK AIRWAYS</span>
              <span style={{ color: "#f97316" }}>CLASS OF ONE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 96, fontWeight: 800, color: "#ededed", lineHeight: 1 }}>YOU</span>
                <span style={{ fontSize: 16, letterSpacing: 5, color: "#8b8f99" }}>YOUR IDEA</span>
              </div>
              <div style={{ flex: 1, height: 0, borderTop: "4px dashed #3a3f4a" }} />
              <span style={{ fontSize: 44, color: "#f97316" }}>✈</span>
              <div style={{ flex: 1, height: 0, borderTop: "4px dashed #3a3f4a" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 96, fontWeight: 800, color: "#f97316", lineHeight: 1 }}>SK</span>
                <span style={{ fontSize: 16, letterSpacing: 5, color: "#8b8f99" }}>SOHAM KAR</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 56 }}>
              {field("PILOT", "SOHAM KAR")}
              {field("ROLE", "PRODUCT ENGINEER")}
              {field("BASE", "INDIA")}
              {field("STATUS", "BOARDING", true)}
            </div>
          </div>
          {/* Stub */}
          <div style={{ width: 380, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 44 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {field("GATE", "CONTACT")}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 16, letterSpacing: 4, color: "#8b8f99" }}>EMAIL</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#ededed" }}>{CONTACT_EMAIL}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, height: 70 }}>
              {BARS.map((w, i) => (
                <div key={i} style={{ width: w * 2, height: "100%", background: i % 2 ? "transparent" : "#8b8f99" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1600,
      height: 560,
      headers: { "Content-Disposition": 'attachment; filename="soham-kar-boarding-pass.png"' },
    }
  );
}
