'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import SectionTag from '@/components/ui/SectionTag'
import { values } from '@/lib/data/values'

export default function Values() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
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

  // 3D tilt on mouse
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
    <section ref={sectionRef} style={{ background: 'var(--deep)', padding: '120px 60px' }}>
      <SectionTag label="03  OUR VALUES" />
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(36px, 5vw, 72px)',
        lineHeight: 0.95,
        textTransform: 'uppercase',
        color: 'var(--white)',
        marginBottom: 80,
      }}>
        WHAT WE <span style={{ color: 'var(--gold)' }}>STAND FOR.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
        {values.map((val) => (
          <div
            key={val.number}
            className="val-card value-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ opacity: 0, cursor: 'none', transition: 'transform 0.3s cubic-bezier(0.19,1,0.22,1)' }}
          >
            <div className="value-card-num">{val.number}</div>
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
        ))}
      </div>
    </section>
  )
}
