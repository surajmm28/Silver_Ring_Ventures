'use client'

import { useEffect, useRef } from 'react'
import { animateWords } from '@/lib/animations'

const HEADING_WORDS = [
  { text: 'DEVELOPMENTS', gold: false },
  { text: 'THAT', gold: false },
  { text: '[DEFINE]', gold: true },
  { text: 'NEIGHBOURHOODS.', gold: false },
]

export default function ProjectsHero() {
  const headlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    animateWords(headlineRef.current, { delay: 0.3 })
  }, [])

  return (
    <section className="projects-hero-section" style={{
      height: '60vh',
      minHeight: 460,
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 60px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        right: -40,
        top: -60,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(80px, 18vw, 260px)',
        textTransform: 'uppercase',
        color: 'var(--faint)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        WORK
      </div>

      <div ref={headlineRef}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(40px, 6.5vw, 92px)',
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
    </section>
  )
}
