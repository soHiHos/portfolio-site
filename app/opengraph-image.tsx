import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'Soham Kar · Apps, websites, digitalisation and automation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Link preview in the light "Harbor" palette (globals.css): misty page, navy name, amber for fills only,
// steel blue for accent text. Hex values mirror the tokens since ImageResponse can't read CSS variables.
const C = {
  background: '#dce3e8',
  foreground: '#102a43',
  muted: '#364b60',
  name: '#1b2a41',
  accent: '#e8a33d',
  accentInk: '#0f4c81',
  grid: 'rgba(16,42,67,0.06)',
}

export default async function Image() {
  const fonts = join(process.cwd(), 'public/fonts')
  const [regular, semibold] = await Promise.all([
    readFile(join(fonts, 'Inter-Regular.ttf')),
    readFile(join(fonts, 'Inter-SemiBold.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px 0',
          background: C.background,
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          color: C.foreground,
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: C.muted }}>Based in Raipur (C.G.), India</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 168, fontWeight: 600, letterSpacing: -6, lineHeight: 0.9, color: C.name }}>SOHAM KAR</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 36, fontSize: 52, fontWeight: 600 }}>
            <div style={{ width: 22, height: 22, marginRight: 22, background: C.accent }} />
            I digitise your&nbsp;<span style={{ color: C.accentInk }}>business</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 28, color: C.muted, marginBottom: 48 }}>
            Apps · Websites · Digitalisation · Automation · Analysis
          </div>
          {/* Amber band along the bottom edge */}
          <div style={{ display: 'flex', height: 14, marginLeft: -80, marginRight: -80, background: C.accent }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: semibold, weight: 600, style: 'normal' },
      ],
    }
  )
}
