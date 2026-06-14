'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a08',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      fontFamily: "'Barlow Condensed', sans-serif",
      color: '#fff',
      padding: '0 40px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4973d' }}>
        Something went wrong
      </div>
      <div style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1 }}>
        Page failed to load.
      </div>
      <button
        onClick={reset}
        style={{
          marginTop: 8,
          padding: '10px 28px',
          border: '0.5px solid #c4973d',
          background: 'transparent',
          color: '#c4973d',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
