'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import SectionTag from '@/components/ui/SectionTag'
import { units } from '@/lib/data/units'

const POSITIONS = [
  { x: '50%', y: '10%' },   // Silverring top
  { x: '85%', y: '38%' },   // Citex right-top
  { x: '70%', y: '82%' },   // Alkins right-bottom
  { x: '30%', y: '82%' },   // Rhythmscape left-bottom
  { x: '15%', y: '38%' },   // Studio Nabi left-top
]

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [2, 3], [3, 4], [4, 1],
]

export default function IntegratedModel() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.network-node',
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1, scale: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            onEnter: () => setDrawn(true),
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const isConnected = (a: number, b: number) =>
    CONNECTIONS.some(([x, y]) => (x === a && y === b) || (x === b && y === a))

  const getLineOpacity = (conn: number[]) => {
    if (hoveredIndex === null) return 0.2
    if (conn.includes(hoveredIndex)) return 1
    return 0.04
  }

  return (
    <section ref={sectionRef} className="integrated-section" style={{ background: 'var(--black)', padding: '80px 60px' }}>
      <SectionTag label="02  THE INTEGRATED MODEL" />
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(36px, 5vw, 72px)',
        lineHeight: 0.95,
        textTransform: 'uppercase',
        color: 'var(--white)',
        marginBottom: 16,
      }}>
        FIVE UNITS. <span style={{ color: 'var(--gold)' }}>ONE</span> ENGINE.
      </div>
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        fontWeight: 300,
        fontSize: 15,
        lineHeight: 1.9,
        color: 'var(--muted)',
        maxWidth: 540,
        marginBottom: 48,
      }}>
        Every unit of Silverring Ventures is built to work in harmony. Hover over a unit
        to see how it connects to every other discipline in the ecosystem.
      </div>

      {/* Network diagram */}
      <div className="network-diagram" style={{ position: 'relative', width: '100%', maxWidth: 700, margin: '0 auto', height: 500 }}>
        {/* SVG connections */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          {CONNECTIONS.map((conn, i) => {
            const a = POSITIONS[conn[0]]
            const b = POSITIONS[conn[1]]
            return (
              <line
                key={i}
                x1={a.x} y1={a.y}
                x2={b.x} y2={b.y}
                stroke="#C4973D"
                strokeWidth={hoveredIndex !== null && conn.includes(hoveredIndex) ? 1.5 : 0.5}
                strokeOpacity={getLineOpacity(conn)}
                style={{ transition: 'stroke-opacity 0.4s, stroke-width 0.4s' }}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {units.map((unit, i) => (
          <div
            key={unit.id}
            className="network-node"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: 'absolute',
              left: POSITIONS[i].x,
              top: POSITIONS[i].y,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              cursor: 'none',
              opacity: 0,
              zIndex: hoveredIndex === i ? 10 : 1,
              transition: 'opacity 0.4s',
            }}
            data-cursor="card"
          >
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: `1.5px solid ${hoveredIndex === i ? 'var(--gold)' : 'rgba(196,151,61,0.4)'}`,
              background: hoveredIndex === i ? 'var(--gold-dim)' : 'var(--deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              transition: 'border-color 0.3s, background 0.3s',
              position: 'relative',
            }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 13,
                color: hoveredIndex === i ? 'var(--gold)' : 'var(--muted)',
              }}>
                {unit.number}
              </span>
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: hoveredIndex === i ? 'var(--white)' : 'var(--muted)',
              transition: 'color 0.3s',
              maxWidth: 100,
              lineHeight: 1.2,
            }}>
              {unit.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
