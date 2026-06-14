'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function ProjectsHero() {
  const headlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tween = gsap.fromTo(headlineRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.3 })
    return () => { tween.kill() }
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

      <div ref={headlineRef} style={{ opacity: 0 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(40px, 6.5vw, 92px)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: 'var(--white)',
        }}>
          DEVELOPMENTS THAT{' '}
          <span style={{ color: 'var(--gold)' }}>[DEFINE]</span>{' '}
          NEIGHBOURHOODS.
        </div>
      </div>
    </section>
  )
}
