'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import SectionTag from '@/components/ui/SectionTag'
import { units } from '@/lib/data/units'

export default function EcosystemPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
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
      style={{ background: 'var(--deep)', padding: '140px 60px' }}
    >
      <div style={{ maxWidth: 900, marginBottom: 60 }}>
        <SectionTag label="02  THE ECOSYSTEM" />
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: 'var(--white)',
          }}
        >
          FIVE UNITS.{' '}
          <span style={{ color: 'var(--gold)' }}>ONE</span> INTEGRATED VISION.
        </div>
      </div>

      <div style={{ borderTop: '0.5px solid var(--faint)' }}>
        {units.map((unit) => (
          <div
            key={unit.id}
            className="eco-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 1fr auto',
              gap: 24,
              alignItems: 'center',
              padding: '28px 0',
              borderBottom: '0.5px solid var(--faint)',
              opacity: 0,
              cursor: 'none',
            }}
            data-cursor="card"
          >
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.15em',
              color: 'var(--gold)',
            }}>
              {unit.number}
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(18px, 2.2vw, 28px)',
              textTransform: 'uppercase',
              color: 'var(--white)',
            }}>
              {unit.name}
            </div>
            <div className="eco-row-tagline" style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              color: 'var(--muted)',
              paddingRight: 40,
            }}>
              {unit.tagline}
            </div>
            <div className="eco-row-arrow" style={{ color: 'var(--gold)', fontSize: 18 }}>→</div>
          </div>
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
