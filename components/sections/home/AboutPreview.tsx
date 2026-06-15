'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { animateLines, animateMedia } from '@/lib/animations'
import SectionTag from '@/components/ui/SectionTag'

const RingModel = dynamic(() => import('@/components/three/RingModel'), { ssr: false })

const HEADLINE_LINES = [
  'WE DON\'T JUST',
  'BUILD PROPERTIES.',
  'WE <gold>ENGINEER</gold>',
  'ECOSYSTEMS.',
]

export default function AboutPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      // Line-by-line heading reveal
      animateLines(headlineRef.current, {
        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%', once: true },
      })

      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: bodyRef.current, start: 'top 85%', once: true },
        }
      )

      // Ring model reveal
      animateMedia(ringRef.current, { trigger: ringRef.current, start: 'top 78%', once: true })

      // Stats
      const statNums = statsRef.current?.querySelectorAll('[data-count]')
      statNums?.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => { el.classList.add('revealed') },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="about-preview-section"
      style={{ background: 'var(--black)', padding: '100px 60px 0' }}
    >
      <div className="about-preview-grid">
        {/* Left */}
        <div>
          <SectionTag label="01  ABOUT SILVERRING" />

          <div
            ref={headlineRef}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(40px, 5.5vw, 80px)',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--white)',
              marginBottom: 36,
            }}
          >
            <div className="anim-line" style={{ opacity: 0 }}>WE DON&apos;T JUST</div>
            <div className="anim-line" style={{ opacity: 0 }}>BUILD PROPERTIES.</div>
            <div className="anim-line" style={{ opacity: 0 }}>
              WE <span style={{ color: 'var(--gold)' }}>ENGINEER</span>
            </div>
            <div className="anim-line" style={{ opacity: 0 }}>ECOSYSTEMS.</div>
          </div>

          <div
            ref={bodyRef}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.9,
              color: 'var(--muted)',
              maxWidth: 520,
              marginBottom: 40,
              opacity: 0,
            }}
          >
            Silverring Ventures is an integrated real estate development company built on a
            simple premise: the best outcomes are achieved when every discipline works as one.
            Through five specialist units, we control every stage of the development lifecycle —
            creating properties that deliver value to investors, buyers, and communities.
          </div>

          <a href="/about" className="btn-text" data-cursor="cta">
            LEARN MORE →
          </a>
        </div>

        {/* Right — Ring */}
        <div ref={ringRef} className="about-ring-container" style={{ height: 480, position: 'relative' }}>
          <RingModel />
        </div>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="stats-bar" style={{ marginTop: 60 }}>
        {[
          { number: '20+', label: 'Years Experience' },
          { number: '5', label: 'Integrated Business Units' },
          { number: '6', label: 'Active Project Pipelines' },
          { number: '₹500Cr+', label: 'Development Pipeline' },
        ].map((stat) => (
          <div key={stat.label} className="stat-item">
            <span className="stat-number" data-count>{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
