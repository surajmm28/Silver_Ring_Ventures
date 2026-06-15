'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { animateLines, animateMedia } from '@/lib/animations'
import TransitionLink from '@/components/ui/TransitionLink'
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

      // Stats count-up animation
      const statEls = statsRef.current?.querySelectorAll<HTMLSpanElement>('.stat-number[data-end]')
      statEls?.forEach((el) => {
        const end = parseInt(el.getAttribute('data-end') ?? '0', 10)
        const prefix = el.getAttribute('data-prefix') ?? ''
        const suffix = el.getAttribute('data-suffix') ?? ''
        const proxy = { n: 0 }
        gsap.to(proxy, {
          n: end,
          duration: 2.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + Math.round(proxy.n) + suffix
          },
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            once: true,
          },
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

          <TransitionLink href="/about" className="btn-text" data-cursor="cta">
            LEARN MORE →
          </TransitionLink>
        </div>

        {/* Right — Ring */}
        <div ref={ringRef} className="about-ring-container" style={{ height: 480, position: 'relative' }}>
          <RingModel />
        </div>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="stats-bar" style={{ marginTop: 60 }}>
        {[
          { end: 20,  prefix: '',  suffix: '+',    label: 'Years Experience' },
          { end: 5,   prefix: '',  suffix: '',     label: 'Integrated Business Units' },
          { end: 6,   prefix: '',  suffix: '',     label: 'Active Project Pipelines' },
          { end: 500, prefix: '₹', suffix: 'Cr+',  label: 'Development Pipeline' },
        ].map((stat) => (
          <div key={stat.label} className="stat-item">
            <span
              className="stat-number"
              data-end={stat.end}
              data-prefix={stat.prefix}
              data-suffix={stat.suffix}
            >
              {stat.prefix}0{stat.suffix}
            </span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
