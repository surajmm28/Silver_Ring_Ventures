'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'

const WORDS = [
  { text: 'MOST', gold: false },
  { text: 'DEVELOPERS', gold: false },
  { text: 'HAND', gold: false },
  { text: 'OFF', gold: false },
  { text: 'THE', gold: false },
  { text: 'PROBLEM.', gold: false },
  { text: 'WE', gold: true },
  { text: 'OWN', gold: true },
  { text: 'THE', gold: true },
  { text: 'OUTCOME.', gold: true },
]

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [ruleRef.current, labelRef.current],
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      )
      animateWords(textRef.current, {
        scrollTrigger: { trigger: textRef.current, start: 'top 75%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="manifesto-section">
      <div aria-hidden="true" className="grain-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div ref={ruleRef} style={{ width: 40, height: 0.5, background: 'var(--gold)', marginBottom: 36, opacity: 0 }} />

      <div
        ref={labelRef}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: 44,
          opacity: 0,
        }}
      >
        OUR PHILOSOPHY
      </div>

      <div
        ref={textRef}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(44px, 7vw, 112px)',
          lineHeight: 0.93,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: 'var(--white)',
          maxWidth: 1100,
        }}
      >
        {WORDS.map((w, i) => (
          <span
            key={i}
            className="anim-word"
            style={{
              display: 'inline-block',
              color: w.gold ? 'var(--gold)' : 'inherit',
              marginRight: i < WORDS.length - 1 ? '0.2em' : 0,
              opacity: 0,
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </section>
  )
}
