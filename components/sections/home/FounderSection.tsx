'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords, animateMedia } from '@/lib/animations'
import SectionTag from '@/components/ui/SectionTag'

const HEADING_WORDS = [
  { text: 'THE', gold: false },
  { text: 'VISION', gold: true },
  { text: 'BEHIND', gold: false },
  { text: 'THE', gold: false },
  { text: 'BRAND.', gold: false },
]

const CREDENTIALS = [
  { label: 'Role', value: 'Founder & Managing Director' },
  { label: 'Experience', value: '20+ years in real estate' },
  { label: 'Specialisation', value: 'Integrated development & JV structuring' },
  { label: 'Based in', value: 'Bangalore, India' },
]

export default function FounderSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      animateWords(headlineRef.current, {
        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%', once: true },
      })
      animateMedia(portraitRef.current, { trigger: portraitRef.current, start: 'top 78%', once: true })
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 82%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: 'var(--deep)', padding: '100px 60px', borderTop: '0.5px solid var(--faint)' }}
    >
      <SectionTag label="05  LEADERSHIP" />

      <div
        ref={headlineRef}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 4.5vw, 64px)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          color: 'var(--white)',
          marginBottom: 64,
        }}
      >
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        gap: 80,
        alignItems: 'start',
      }}
        className="founder-grid"
      >
        {/* Portrait */}
        <div ref={portraitRef}>
          {/* Geometric monogram portrait */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3/4',
            maxWidth: 360,
            background: 'linear-gradient(145deg, #0f0b05 0%, #1a1408 100%)',
            border: '0.5px solid rgba(196,151,61,0.2)',
            overflow: 'hidden',
          }}>
            {/* Abstract architectural portrait lines */}
            <svg
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
              viewBox="0 0 300 400"
            >
              {/* Grid */}
              {Array.from({ length: 8 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50 + 25} x2="300" y2={i * 50 + 25} stroke="#C4973D" strokeWidth="0.4" />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`v${i}`} x1={i * 50 + 25} y1="0" x2={i * 50 + 25} y2="400" stroke="#C4973D" strokeWidth="0.4" />
              ))}
              {/* Frame */}
              <rect x="30" y="40" width="240" height="320" stroke="#C4973D" strokeWidth="0.8" fill="none" />
              <rect x="50" y="60" width="200" height="280" stroke="#C4973D" strokeWidth="0.4" fill="none" />
            </svg>
            {/* Radial glow */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(196,151,61,0.1) 0%, transparent 70%)',
            }} />
            {/* Monogram */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 16,
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(80px, 15vw, 120px)',
                lineHeight: 1,
                color: 'rgba(196,151,61,0.25)',
                letterSpacing: '-0.04em',
                userSelect: 'none',
              }}>
                RG
              </div>
              <div style={{
                width: 40, height: 0.5,
                background: 'rgba(196,151,61,0.4)',
              }} />
            </div>
            {/* Bottom label */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '20px 24px',
              background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 100%)',
              borderTop: '0.5px solid rgba(196,151,61,0.15)',
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: 18,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: 'var(--white)',
              }}>
                Raviraj G
              </div>
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.15em',
                color: 'var(--gold)', marginTop: 4,
              }}>
                Founder & MD
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} style={{ opacity: 0 }}>
          {/* Quote */}
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(20px, 2.8vw, 32px)',
            lineHeight: 1.4,
            color: 'var(--white)',
            marginBottom: 40,
            fontStyle: 'italic',
            borderLeft: '2px solid var(--gold)',
            paddingLeft: 28,
          }}>
            "Real estate in India is fragmented by design — every discipline operates in its own silo.
            Silverring was built to change that. When land, advisory, construction, media,
            and interiors work as one engine, the outcome is categorically better — for
            the investor, the buyer, and the city."
          </div>

          {/* Bio */}
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.9,
            color: 'var(--muted)',
            marginBottom: 48,
            maxWidth: 560,
          }}>
            With over two decades of experience across residential, commercial, and land development
            in Bangalore, Raviraj G. identified a consistent gap — projects failing not due to lack
            of ambition, but lack of integration. Silverring Ventures is his answer to that: a fully
            integrated development company where every discipline is accountable to the outcome.
          </div>

          {/* Credential grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0',
            borderTop: '0.5px solid var(--faint)',
          }}
            className="founder-credentials"
          >
            {CREDENTIALS.map((c) => (
              <div key={c.label} style={{
                padding: '20px 0',
                borderBottom: '0.5px solid var(--faint)',
                paddingRight: 32,
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  color: 'var(--gold)', marginBottom: 6,
                }}>
                  {c.label}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300, fontSize: 14,
                  color: 'var(--white)',
                }}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <a href="/contact" className="btn-text" data-cursor="cta">
              PARTNER WITH US →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
