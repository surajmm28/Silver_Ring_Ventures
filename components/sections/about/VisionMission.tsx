'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'

const panels = [
  {
    label: 'VISION',
    statement: 'To be the most trusted integrated real estate development company in India — known for delivering exceptional value through seamless collaboration.',
    body: 'We aspire to redefine how real estate is developed by making integration the standard, not the exception. Every project we undertake is a commitment to that vision.',
  },
  {
    label: 'MISSION',
    statement: 'To engineer real estate ecosystems that create lasting value for our partners, buyers, and communities — through disciplined integration of every function.',
    body: 'By bringing land, advisory, construction, media, and interiors under one accountable umbrella, we eliminate the fragmentation that holds most development projects back.',
  },
  {
    label: 'POSITIONING',
    statement: 'The only development partner you need. Not a contractor, not a broker — an integrated development engine built for results.',
    body: 'We sit at the intersection of developer, builder, and creative studio. Our unique structure means our incentives are always aligned with yours — because we share the outcome.',
  },
]

export default function VisionMission() {
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panelsRef.current) return
    const ctx = gsap.context(() => {
      panelsRef.current!.querySelectorAll('.vmp').forEach((panel) => {
        // Panel label fade
        const label = panel.querySelector('.vmp-label')
        if (label) {
          gsap.fromTo(label, { opacity: 0, x: -16 }, {
            opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
          })
        }
        // Statement heading: word stagger
        const statement = panel.querySelector('.vmp-statement')
        if (statement) {
          animateWords(statement, {
            scrollTrigger: { trigger: panel, start: 'top 80%', once: true },
          })
        }
      })
    }, panelsRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={panelsRef}
      className="vision-section"
      style={{ background: 'var(--black)', padding: '80px 60px', perspective: '1000px' }}
    >
      {panels.map((panel, i) => (
        <div
          key={panel.label}
          className="vmp"
          style={{
            paddingTop: 48,
            paddingBottom: 48,
            borderBottom: '0.5px solid var(--faint)',
          }}
        >
          <div className="vmp-label" style={{ marginBottom: 24, opacity: 0 }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              {String(i + 1).padStart(2, '0')} — {panel.label}
            </span>
          </div>
          <div
            className="vmp-statement"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(24px, 3.5vw, 48px)',
              lineHeight: 1.1,
              color: 'var(--white)',
              maxWidth: 860,
              marginBottom: 28,
            }}
          >
            {panel.statement.split(' ').map((word, wi) => (
              <span
                key={wi}
                className="anim-word"
                style={{
                  display: 'inline-block',
                  marginRight: wi < panel.statement.split(' ').length - 1 ? '0.22em' : 0,
                  opacity: 0,
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.9,
            color: 'var(--muted)',
            maxWidth: 640,
          }}>
            {panel.body}
          </div>
        </div>
      ))}
    </section>
  )
}
