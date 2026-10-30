import { ImageResponse } from 'next/og'

export const alt = 'Soham Kar — Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#0b0d12',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          color: '#ededed',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>SOHAM KAR</div>
        <div style={{ fontSize: 32, marginTop: 16, color: '#a0a0a8' }}>— engineering better</div>
        <div style={{ fontSize: 160, fontWeight: 700, color: '#f97316', lineHeight: 1 }}>FUTURES</div>
        <div style={{ fontSize: 28, marginTop: 32, color: '#a0a0a8' }}>Engineer · AI · Software · Hardware</div>
      </div>
    ),
    size
  )
}
