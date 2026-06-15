'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'

const HEADING_WORDS = [
  { text: 'ABOUT', gold: false },
  { text: '[SILVERRING]', gold: true },
  { text: 'VENTURES.', gold: false },
]

export default function AboutHero() {
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    animateWords(headlineRef.current, { delay: 0.25 })
    const sub = gsap.fromTo(
      subRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.65 }
    )
    return () => { sub.kill() }
  }, [])

  return (
    <section
      className="about-hero-section"
      style={{
        height: '100vh',
        background: 'var(--black)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background word */}
      <div style={{
        position: 'absolute',
        right: -40,
        bottom: -60,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(100px, 18vw, 260px)',
        textTransform: 'uppercase',
        color: 'var(--faint)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        ABOUT
      </div>

      <div ref={headlineRef} style={{ maxWidth: 900 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(52px, 8vw, 120px)',
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

      <div ref={subRef} style={{ opacity: 0, marginTop: 40, maxWidth: 560 }} aria-hidden="false">
        <div style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 300,
          fontSize: 16,
          lineHeight: 1.9,
          color: 'var(--muted)',
        }}>
          An integrated real estate development company focused on land, growth, and value.
        </div>
      </div>

      {/* Bottom meta */}
      <div className="about-hero-bottom" style={{
        position: 'absolute',
        bottom: 48,
        left: 60,
        right: 60,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Established 2025 · Bangalore, India
        </div>
        {/* Scroll indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 1, height: 60, background: 'var(--faint)', position: 'relative', overflow: 'hidden' }}>
            <div className="scroll-line-fill" />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            SCROLL
          </span>
        </div>
      </div>
    </section>
  )
}
