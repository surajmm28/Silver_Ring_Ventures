'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { animateWords, animateMedia } from '@/lib/animations'

const EcosystemSphere = dynamic(() => import('@/components/three/EcosystemSphere'), { ssr: false })

const HEADING_WORDS = [
  { text: 'THE', gold: false },
  { text: 'ECOSYSTEM.', gold: false },
  { text: '[FIVE PILLARS.]', gold: true },
  { text: 'ONE', gold: false },
  { text: 'VISION.', gold: false },
]

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
    animateWords(headlineRef.current, { delay: 0.2 })
    const tl = gsap.timeline({ delay: 0.55 })
    tl.fromTo(subRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    tl.fromTo(tagsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4')
    animateMedia(orbRef.current, undefined, { delay: 0.3 })

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
        <div ref={headlineRef}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 80px)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--white)',
          }}>
            {HEADING_WORDS.map((w, i) => (
              <span
                key={i}
                className="anim-word"
                style={{
                  display: 'inline-block',
                  color: w.gold ? 'var(--gold)' : 'inherit',
                  marginRight: i < HEADING_WORDS.length - 1 ? '0.22em' : 0,
                  opacity: 0,
                }}
              >
                {w.text}
              </span>
            ))}
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
        }}
      >
        <EcosystemSphere />
      </div>
    </section>
  )
}
