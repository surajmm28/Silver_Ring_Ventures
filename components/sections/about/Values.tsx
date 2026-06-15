'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'
import SectionTag from '@/components/ui/SectionTag'
import { values } from '@/lib/data/values'

const HEADING_WORDS = [
  { text: 'WHAT', gold: false },
  { text: 'WE', gold: false },
  { text: 'STAND', gold: true },
  { text: 'FOR.', gold: true },
]

// Geometric SVG icons for each value
const VALUE_ICONS: Record<string, React.ReactNode> = {
  '01': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="0.8" />
      <rect x="12" y="2" width="6" height="6" stroke="currentColor" strokeWidth="0.8" />
      <rect x="2" y="12" width="6" height="6" stroke="currentColor" strokeWidth="0.8" />
      <rect x="12" y="12" width="6" height="6" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  '02': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="3" y1="17" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="17" x2="8" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="17" x2="13" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="17" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="3,8 8,5 13,2 17,6" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 1.5" />
    </svg>
  ),
  '03': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2 L17 5 L17 10 C17 14 13.5 17.5 10 18.5 C6.5 17.5 3 14 3 10 L3 5 Z" stroke="currentColor" strokeWidth="0.8" />
      <polyline points="7,10 9.5,12.5 13.5,8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '04': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <polygon points="10,2 16,7 16,13 10,18 4,13 4,7" stroke="currentColor" strokeWidth="0.8" />
      <polygon points="10,5 14,8.5 14,11.5 10,15 6,11.5 6,8.5" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  ),
  '05': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <ellipse cx="10" cy="10" rx="8" ry="5" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="0.8" />
      <line x1="2" y1="10" x2="4" y2="10" stroke="currentColor" strokeWidth="0.6" />
      <line x1="16" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  ),
  '06': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <polyline points="3,17 8,8 12,12 17,3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="13,3 17,3 17,7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '07': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3 L3 9 L3 17 L8 17 L8 13 L12 13 L12 17 L17 17 L17 9 Z" stroke="currentColor" strokeWidth="0.8" />
      <line x1="10" y1="1" x2="10" y2="3" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  '08': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="0.8" />
      <line x1="10" y1="5" x2="10" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="10" x2="14" y2="12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  ),
}

export default function Values() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      animateWords(headlineRef.current, {
        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%', once: true },
      })
      gsap.fromTo(
        '.val-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(600px) rotateX(0) rotateY(0)'
  }

  return (
    <section ref={sectionRef} className="values-section" style={{ background: 'var(--deep)', padding: '80px 60px' }}>
      <SectionTag label="03  OUR VALUES" />
      <div
        ref={headlineRef}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 5vw, 72px)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          color: 'var(--white)',
          marginBottom: 48,
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

      <div className="values-grid">
        {values.map((val) => (
          <div
            key={val.number}
            className="val-card value-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ opacity: 0, cursor: 'none', transition: 'transform 0.3s cubic-bezier(0.19,1,0.22,1)' }}
          >
            {/* Subtle grain texture overlay */}
            <div className="val-card-grain" />

            {/* Geometric icon */}
            <div className="value-card-icon">
              {VALUE_ICONS[val.number]}
            </div>

            <div className="val-card-num-wrap">
              <div className="value-card-num">{val.number}</div>
            </div>
            <div className="val-card-title-wrap">
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--white)',
                marginBottom: 12,
              }}>
                {val.title}
              </div>
            </div>
            <div className="val-card-desc-wrap">
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: 14,
                lineHeight: 1.8,
                color: 'var(--muted)',
              }}>
                {val.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
