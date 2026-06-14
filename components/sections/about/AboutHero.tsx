'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function AboutHero() {
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(headlineRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' })
    tl.fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    return () => { tl.kill() }
  }, [])

  return (
    <section
      style={{
        height: '100vh',
        background: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background word */}
      <div style={{
        position: 'absolute',
        right: -40,
        bottom: -60,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(100px, 18vw, 260px)',
        textTransform: 'uppercase',
        color: 'var(--faint)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        ABOUT
      </div>

      <div ref={headlineRef} style={{ opacity: 0, maxWidth: 900 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(52px, 8vw, 120px)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: 'var(--white)',
        }}>
          ABOUT{' '}
          <span style={{ color: 'var(--gold)' }}>[SILVERRING]</span>{' '}
          VENTURES.
        </div>
      </div>

      <div ref={subRef} style={{ opacity: 0, marginTop: 40, maxWidth: 560 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 300,
          fontSize: 16,
          lineHeight: 1.9,
          color: 'var(--muted)',
        }}>
          An integrated real estate development company focused on land, growth, and value.
        </div>
      </div>

      {/* Bottom meta */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Established 2025 · Bangalore, India
        </div>
        {/* Scroll indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 1, height: 60, background: 'var(--faint)', position: 'relative', overflow: 'hidden' }}>
            <div className="scroll-line-fill" />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            SCROLL
          </span>
        </div>
      </div>
    </section>
  )
}
