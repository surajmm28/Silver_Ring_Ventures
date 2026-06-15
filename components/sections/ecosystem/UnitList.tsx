'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateChars } from '@/lib/animations'
import { units } from '@/lib/data/units'

export default function UnitList() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      // Unit name: char stagger — premium character reveal
      sectionRef.current!.querySelectorAll('.unit-name-heading').forEach((heading) => {
        animateChars(heading, {
          scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
        })
      })
      // Panel content: subtle fade for the rest
      sectionRef.current!.querySelectorAll('.unit-panel-inner').forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef}>
      {units.map((unit, i) => (
        <div
          key={unit.id}
          className="unit-panel"
          style={{
            background: i % 2 === 0 ? 'var(--black)' : 'var(--deep)',
            position: 'relative',
          }}
        >
          {/* Large background number */}
          <div className="unit-number">{unit.number}</div>

          <div className="unit-panel-inner" style={{ opacity: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: 60 }}>
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--gold)',
                marginBottom: 16,
              }}>
                {unit.role}
              </div>
              <div
                className="unit-name-heading"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(40px, 6vw, 88px)',
                  lineHeight: 0.9,
                  textTransform: 'uppercase',
                  color: 'var(--white)',
                }}
              >
                {unit.name.split('').map((char, ci) => (
                  <span
                    key={ci}
                    className="anim-char"
                    style={{
                      display: 'inline-block',
                      whiteSpace: char === ' ' ? 'pre' : undefined,
                      opacity: 0,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* 2-col content */}
            <div className="unit-content-grid">
              <div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: 15,
                  lineHeight: 1.9,
                  color: 'var(--muted)',
                  marginBottom: 36,
                }}>
                  {unit.description}
                </div>
              </div>

              {/* Services */}
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: 24,
                }}>
                  SERVICES
                </div>
                {unit.services.map((service, si) => (
                  <div
                    key={si}
                    style={{
                      padding: '14px 0',
                      borderBottom: '0.5px solid var(--faint)',
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300,
                      fontSize: 14,
                      color: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: 10 }}>◆</span>
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Advantages */}
            <div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 32,
              }}>
                THE {unit.name.toUpperCase()} ADVANTAGE
              </div>
              <div className="unit-advantages-grid">
                {unit.advantages.map((adv, ai) => (
                  <div key={ai} style={{ borderTop: '0.5px solid var(--faint)', paddingTop: 24 }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--white)',
                      marginBottom: 10,
                    }}>
                      {adv.title}
                    </div>
                    <div style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: 'var(--muted)',
                    }}>
                      {adv.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
