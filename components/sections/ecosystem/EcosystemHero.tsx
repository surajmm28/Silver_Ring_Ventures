'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const EcosystemOrb = dynamic(() => import('@/components/three/EcosystemOrb'), { ssr: false })

const UNIT_LABELS = [
  'Silverring Ventures',
  'Citex',
  'Alkins Constructions',
  'Rhythmscape Media',
  'Studio Nabi',
]

export default function EcosystemHero() {
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.25 })
    tl.fromTo(headlineRef.current, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' })
    tl.fromTo(subRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
    tl.fromTo(tagsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4')
    tl.fromTo(orbRef.current, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out' }, '-=0.9')

    // After the dynamic import loads and layout stabilises, recalculate all
    // ScrollTrigger positions so the Lifecycle horizontal-scroll pin is correct.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800)

    return () => {
      tl.kill()
      clearTimeout(refreshTimer)
    }
  }, [])

  return (
    <section
      className="eco-hero-section"
      style={{
        height: '100vh',
        background: 'var(--black)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '0 60px',
        position: 'relative',
        overflow: 'hidden',
        gap: 32,
      }}
    >
      {/* Watermark */}
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
        zIndex: 0,
      }}>
        ECO
      </div>

      {/* Left: text */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={headlineRef} style={{ opacity: 0 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 80px)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--white)',
          }}>
            THE ECOSYSTEM.{' '}
            <span style={{ color: 'var(--gold)' }}>[FIVE PILLARS.]</span>{' '}
            ONE VISION.
          </div>
        </div>

        <div ref={subRef} style={{ opacity: 0, marginTop: 32 }}>
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.9,
            color: 'var(--muted)',
            maxWidth: 400,
            margin: 0,
          }}>
            Five specialist units. One unified strategy. Every discipline works in
            concert to deliver outcomes that no single firm could achieve alone.
          </p>
        </div>

        <div ref={tagsRef} style={{ opacity: 0, marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {UNIT_LABELS.map((label, i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              <span style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--gold)',
                opacity: 0.55 + i * 0.09,
                flexShrink: 0,
              }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Right: 3D orb */}
      <div
        ref={orbRef}
        style={{
          position: 'relative',
          zIndex: 1,
          height: '68vh',
          maxHeight: 580,
          opacity: 0,
        }}
      >
        <EcosystemOrb />
      </div>
    </section>
  )
}
