'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { units } from '@/lib/data/units'

export default function UnitList() {
  const [activeIdx, setActiveIdx] = useState(0)
  const prevIdxRef = useRef(-1)
  const contentRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  const handleTabClick = (newIdx: number) => {
    if (newIdx === activeIdx || isAnimatingRef.current || !contentRef.current) return
    const dir = newIdx > activeIdx ? 1 : -1
    isAnimatingRef.current = true

    gsap.to(contentRef.current, {
      x: -40 * dir,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        prevIdxRef.current = activeIdx
        setActiveIdx(newIdx)
      },
    })
  }

  // Animate content in after activeIdx state change
  useEffect(() => {
    if (prevIdxRef.current === -1 || !contentRef.current) return
    const dir = activeIdx > prevIdxRef.current ? 1 : -1
    gsap.fromTo(
      contentRef.current,
      { x: 40 * dir, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.38,
        ease: 'power3.out',
        onComplete: () => { isAnimatingRef.current = false },
      }
    )
    // Stagger char animation on the unit name heading
    const chars = contentRef.current.querySelectorAll('.anim-char')
    if (chars.length) {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.018, duration: 0.45, ease: 'power3.out', delay: 0.1 }
      )
    }
  }, [activeIdx])

  // Initial mount — fade in
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 })
    const chars = contentRef.current.querySelectorAll('.anim-char')
    if (chars.length) {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.018, duration: 0.45, ease: 'power3.out', delay: 0.3 }
      )
    }
  }, [])

  const unit = units[activeIdx]

  return (
    <div>
      {/* Tab navigation */}
      <div className="unit-tabs" role="tablist" aria-label="Ecosystem units">
        {units.map((u, i) => (
          <button
            key={u.id}
            role="tab"
            aria-selected={i === activeIdx}
            className={`unit-tab${i === activeIdx ? ' active' : ''}`}
            onClick={() => handleTabClick(i)}
          >
            <span className="unit-tab-num">{u.number}</span>
            <span className="unit-tab-name">{u.name}</span>
          </button>
        ))}
      </div>

      {/* Unit content — single panel, animated on tab switch */}
      <div
        ref={contentRef}
        className="unit-panel"
        role="tabpanel"
        style={{
          background: activeIdx % 2 === 0 ? 'var(--black)' : 'var(--deep)',
          position: 'relative',
          minHeight: '60vh',
        }}
      >
        {/* Large background number */}
        <div className="unit-number">{unit.number}</div>

        <div className="unit-panel-inner">
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
    </div>
  )
}
