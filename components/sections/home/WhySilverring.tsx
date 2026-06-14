'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import SectionTag from '@/components/ui/SectionTag'
import { values } from '@/lib/data/values'

export default function WhySilverring() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.value-row',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.08,
          duration: 0.8,
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
      className="why-section"
      style={{ background: 'var(--deep)', padding: '120px 60px' }}
    >
      <div className="why-grid">
        {/* Left */}
        <div>
          <SectionTag label="04  WHY SILVERRING" />
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              color: 'var(--white)',
            }}
          >
            EIGHT REASONS{' '}
            <span style={{ color: 'var(--gold)' }}>TO CHOOSE</span>{' '}
            INTEGRATED EXCELLENCE.
          </div>
        </div>

        {/* Right — value rows (first 4) */}
        <div>
          {values.slice(0, 4).map((val) => (
            <div
              key={val.number}
              className="value-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: 24,
                padding: '24px 0',
                borderBottom: '0.5px solid var(--faint)',
                opacity: 0,
              }}
            >
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.15em',
                color: 'var(--gold)',
                paddingTop: 3,
              }}>
                {val.number}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--white)',
                  marginBottom: 6,
                }}>
                  {val.title}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'var(--muted)',
                }}>
                  {val.description}
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 36 }}>
            <a href="/about" className="btn-text" data-cursor="cta">
              ALL 8 VALUES →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
