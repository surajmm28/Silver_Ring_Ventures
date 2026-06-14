'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function EcosystemHero() {
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(headlineRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' })
    tl.fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    return () => { tl.kill() }
  }, [])

  return (
    <section className="eco-hero-section" style={{
      height: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        right: -60,
        bottom: -80,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(80px, 16vw, 220px)',
        textTransform: 'uppercase',
        color: 'var(--faint)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        ECO
      </div>

      <div ref={headlineRef} style={{ opacity: 0 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(44px, 7vw, 100px)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: 'var(--white)',
          maxWidth: 900,
        }}>
          THE ECOSYSTEM.{' '}
          <span style={{ color: 'var(--gold)' }}>[FIVE PILLARS.]</span>{' '}
          ONE VISION.
        </div>
      </div>

      <div ref={subRef} style={{ opacity: 0, marginTop: 40, maxWidth: 520 }}>
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 300,
          fontSize: 16,
          lineHeight: 1.9,
          color: 'var(--muted)',
        }}>
          Five specialist units. One unified strategy. Every discipline works in concert
          to deliver outcomes that no single firm could achieve alone.
        </div>
      </div>
    </section>
  )
}
