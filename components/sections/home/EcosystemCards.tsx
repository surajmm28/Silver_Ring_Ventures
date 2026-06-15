'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'
import SectionTag from '@/components/ui/SectionTag'
import { units } from '@/lib/data/units'
import { gyro } from '@/lib/gyroscope'

const HEADING_WORDS = [
  { text: 'FIVE', gold: false },
  { text: 'UNITS.', gold: false },
  { text: 'ONE', gold: true },
  { text: 'INTEGRATED', gold: false },
  { text: 'VISION.', gold: false },
]

const UNIT_ACCENTS: Record<string, string> = {
  silverring: 'rgba(196,151,61,0.07)',
  citex:      'rgba(100,120,220,0.06)',
  alkins:     'rgba(200,80,60,0.06)',
  rhythmscape:'rgba(60,160,180,0.06)',
  studionabi: 'rgba(140,80,200,0.06)',
}

function UnitIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    silverring: (
      <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="3" width="12" height="12" stroke="#C4973D" strokeWidth="0.8" />
        <rect x="6" y="6" width="6" height="6" stroke="#C4973D" strokeWidth="0.6" />
      </svg>
    ),
    citex: (
      <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="5.5" stroke="#C4973D" strokeWidth="0.8" />
        <circle cx="9" cy="9" r="2" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="9" y1="3" x2="9" y2="0.5" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="9" y1="15" x2="9" y2="17.5" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="3" y1="9" x2="0.5" y2="9" stroke="#C4973D" strokeWidth="0.6" />
        <line x1="15" y1="9" x2="17.5" y2="9" stroke="#C4973D" strokeWidth="0.6" />
      </svg>
    ),
    alkins: (
      <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
        <polygon points="9,2 16,16 2,16" stroke="#C4973D" strokeWidth="0.8" fill="none" />
        <line x1="9" y1="8" x2="9" y2="16" stroke="#C4973D" strokeWidth="0.6" />
      </svg>
    ),
    rhythmscape: (
      <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
        <line x1="2" y1="9" x2="5" y2="9" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="5" y1="9" x2="7" y2="4" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="7" y1="4" x2="9" y2="14" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="9" y1="14" x2="11" y2="6" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="11" y1="6" x2="13" y2="9" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="13" y1="9" x2="16" y2="9" stroke="#C4973D" strokeWidth="0.8" />
      </svg>
    ),
    studionabi: (
      <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="10" stroke="#C4973D" strokeWidth="0.8" fill="none" />
        <line x1="2" y1="6" x2="16" y2="6" stroke="#C4973D" strokeWidth="0.5" />
        <line x1="9" y1="2" x2="9" y2="12" stroke="#C4973D" strokeWidth="0.5" />
        <line x1="5" y1="14" x2="13" y2="14" stroke="#C4973D" strokeWidth="0.8" />
        <line x1="9" y1="12" x2="9" y2="14" stroke="#C4973D" strokeWidth="0.8" />
      </svg>
    ),
  }
  return <>{icons[id] ?? null}</>
}

export default function EcosystemCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      animateWords(headlineRef.current, {
        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%', once: true },
      })
      gsap.fromTo(
        '.eco-card',
        { opacity: 0, y: 48, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.11,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: stripRef.current, start: 'top 82%', once: true },
        }
      )
    }, sectionRef)

    // Gyro tilt — applied to wrapper divs so GSAP on .eco-card is unaffected
    const gyroUnsub = gyro.subscribe(({ x, y }) => {
      if (!gyro.isActive || !stripRef.current) return
      const wraps = stripRef.current.querySelectorAll<HTMLElement>('.gyro-tilt-wrap')
      wraps.forEach((el) => {
        el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`
      })
    })

    return () => {
      ctx.revert()
      gyroUnsub()
    }
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    scrollStartX.current = stripRef.current?.scrollLeft ?? 0
    document.body.style.userSelect = 'none'
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !stripRef.current) return
    stripRef.current.scrollLeft = scrollStartX.current - (e.clientX - dragStartX.current)
  }

  const onMouseUp = () => {
    setIsDragging(false)
    document.body.style.userSelect = ''
  }

  return (
    <section
      ref={sectionRef}
      style={{ background: 'var(--deep)', padding: '100px 0 100px 60px', borderTop: '0.5px solid var(--faint)' }}
    >
      <div style={{ paddingRight: 60, marginBottom: 56 }}>
        <SectionTag label="02  THE ECOSYSTEM" />
        <div
          ref={headlineRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: 'var(--white)',
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
      </div>

      <div
        ref={stripRef}
        data-cursor="drag"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          paddingRight: 60,
          paddingBottom: 2,
        }}
      >
        {units.map((unit) => (
          <div key={unit.id} className="gyro-tilt-wrap gyro-eco-wrap" style={{ flex: '0 0 300px', height: 440 }}>
          <a
            href={`/ecosystem#${unit.id}`}
            className="eco-card"
            data-cursor="card"
            style={{ opacity: 0, flex: 'none', width: '100%', height: '100%' }}
          >
            {/* Background accent glow */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 90% 70% at 20% 30%, ${UNIT_ACCENTS[unit.id]} 0%, transparent 65%)`,
              pointerEvents: 'none',
            }} />

            {/* Watermark number */}
            <div className="eco-card-watermark">{unit.number}</div>

            {/* Icon */}
            <div className="eco-card-icon">
              <UnitIcon id={unit.id} />
            </div>

            {/* Static content */}
            <div className="eco-card-body">
              <div className="eco-card-role">{unit.role}</div>
              <div className="eco-card-name">{unit.name}</div>
              <div className="eco-card-tagline">{unit.tagline}</div>
            </div>

            {/* Hover reveal panel */}
            <div className="eco-card-reveal">
              <p className="eco-card-desc">{unit.description.split('.')[0]}.</p>
              <div className="eco-card-cta">
                <span>EXPLORE</span>
                <span className="eco-card-arrow">→</span>
              </div>
            </div>
          </a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, paddingRight: 60 }}>
        <a href="/ecosystem" className="btn-text" data-cursor="cta">
          VIEW ALL UNITS →
        </a>
      </div>
    </section>
  )
}
