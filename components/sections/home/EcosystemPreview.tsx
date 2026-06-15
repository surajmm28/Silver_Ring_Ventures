'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'
import SectionTag from '@/components/ui/SectionTag'
import { units } from '@/lib/data/units'

const HEADING_WORDS = [
  { text: 'FIVE', gold: false },
  { text: 'UNITS.', gold: false },
  { text: 'ONE', gold: true },
  { text: 'INTEGRATED', gold: false },
  { text: 'VISION.', gold: false },
]

function UnitIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    silverring: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="3" width="12" height="12" stroke="#C4973D" strokeWidth="0.8" />
        <rect x="6" y="6" width="6" height="6" stroke="#C4973D" strokeWidth="0.6" />
      </svg>
    ),
    citex: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="5.5" stroke="#C4973D" strokeWidth="0.8" />
        <circle cx="9" cy="9" r="2" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="9" y1="3" x2="9" y2="0.5" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="9" y1="15" x2="9" y2="17.5" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="3" y1="9" x2="0.5" y2="9" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="15" y1="9" x2="17.5" y2="9" stroke="#C4973D" strokeWidth="0.6" />
      </svg>
    ),
    alkins: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <polygon points="9,2 16,16 2,16" stroke="#C4973D" strokeWidth="0.8" fill="none" />
        <line x1="9" y1="8" x2="9" y2="16" stroke="#C4973D" strokeWidth="0.6" />
      </svg>
    ),
    rhythmscape: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <line x1="2" y1="9" x2="5" y2="9" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="5" y1="9" x2="7" y2="4" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="7" y1="4" x2="9" y2="14" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="9" y1="14" x2="11" y2="6" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="11" y1="6" x2="13" y2="9" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="13" y1="9" x2="16" y2="9" stroke="#C4973D" strokeWidth="0.8" />
      </svg>
    ),
    studionabi: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="10" stroke="#C4973D" strokeWidth="0.8" fill="none" />
        <line x1="2" y1="6" x2="16" y2="6" stroke="#C4973D" strokeWidth="0.5" />
        <line x1="9" y1="2" x2="9" y2="12" stroke="#C4973D" strokeWidth="0.5" />
        <line x1="5" y1="14" x2="13" y2="14" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="9" y1="12" x2="9" y2="14" stroke="#C4973D" strokeWidth="0.8" />
      </svg>
    ),
  }
  return <>{icons[id] ?? null}</>
}

export default function EcosystemPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      animateWords(headlineRef.current, {
        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%', once: true },
      })
      gsap.fromTo(
        '.eco-row',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="eco-preview-section"
      style={{ background: 'var(--deep)', padding: '100px 60px' }}
    >
      <div style={{ maxWidth: 900, marginBottom: 40 }}>
        <SectionTag label="02  THE ECOSYSTEM" />
        <div
          ref={headlineRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: 'var(--white)',
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
      </div>

      <div style={{ borderTop: '0.5px solid var(--faint)' }}>
        {units.map((unit) => (
          <a
            key={unit.id}
            href={`/ecosystem#${unit.id}`}
            className="eco-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 40px 1fr 1.2fr auto',
              gap: 28,
              alignItems: 'center',
              padding: '26px 0',
              borderBottom: '0.5px solid var(--faint)',
              opacity: 0,
              cursor: 'none',
              textDecoration: 'none',
              transition: 'background 0.3s',
            }}
            data-cursor="card"
          >
            {/* Number */}
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.15em',
              color: 'var(--gold)',
            }}>
              {unit.number}
            </div>
            {/* Role icon — geometric SVG */}
            <div style={{
              width: 36, height: 36,
              border: '0.5px solid rgba(196,151,61,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <UnitIcon id={unit.id} />
            </div>
            {/* Name + role */}
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(16px, 2vw, 24px)',
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: 3,
              }}>
                {unit.name}
              </div>
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--gold)',
              }}>
                {unit.role}
              </div>
            </div>
            {/* Description */}
            <div className="eco-row-desc" style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--muted)',
              paddingRight: 32,
            }}>
              {unit.description.split('.')[0]}.
            </div>
            <div className="eco-row-arrow" style={{ color: 'var(--gold)', fontSize: 18 }}>→</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 48 }}>
        <a href="/ecosystem" className="btn-text" data-cursor="cta">
          VIEW ALL UNITS →
        </a>
      </div>
    </section>
  )
}
