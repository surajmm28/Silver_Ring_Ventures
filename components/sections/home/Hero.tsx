'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const BuildingFallback = dynamic(() => import('@/components/three/BuildingFallback'), {
  ssr: false,
})

const TITLE = 'SILVERRING VENTURES'

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const vertLineRef = useRef<HTMLDivElement>(null)
  const sectionNumRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll progress indicator
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          if (progressFillRef.current) {
            progressFillRef.current.style.height = `${self.progress * 100}%`
          }
        },
      })

      // CSS `position: sticky` on stickyRef handles the visual pinning.
      // GSAP only drives the scrubbed animation timeline — no GSAP pin needed.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // 0–10%: scroll hint
      tl.fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0)
      tl.to(scrollHintRef.current, { opacity: 0, duration: 0.05 }, 0.12)

      // 10–35%: vertical line draws + "01"
      tl.fromTo(
        vertLineRef.current,
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: 0.2 },
        0.1
      )
      tl.fromTo(sectionNumRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.28)

      // 35–60%: title letters stagger in
      const letters = titleRef.current?.querySelectorAll('span')
      if (letters?.length) {
        tl.fromTo(
          letters,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.01 },
          0.35
        )
      }

      // 60–78%: tagline + meta
      tl.fromTo(taglineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.6)
      tl.fromTo(metaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12 }, 0.68)

      // 78–92%: gold rule sweeps + CTAs
      tl.fromTo(ruleRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.12 }, 0.78)
      tl.fromTo(ctasRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12 }, 0.84)

      // 92–100%: fade to black
      tl.to(stickyRef.current, { opacity: 0, duration: 0.08 }, 0.92)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Split title into individual letter spans
  const titleChars = TITLE.split('').map((char, i) => (
    <span
      key={i}
      style={{
        display: 'inline-block',
        opacity: 0,
        transform: 'translateY(60px)',
      }}
    >
      {char === ' ' ? ' ' : char}
    </span>
  ))

  return (
    <div id="hero-section" ref={sectionRef} style={{ height: '600vh', position: 'relative' }}>
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--black)',
        }}
      >
        {/* Three.js canvas */}
        <div id="hero-canvas-container">
          <BuildingFallback scrollContainer="#hero-section" />
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.22em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            zIndex: 20,
            opacity: 0,
            whiteSpace: 'nowrap',
          }}
        >
          SCROLL TO BUILD ↓
        </div>

        {/* Left vertical line + section number */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: '30%',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            ref={vertLineRef}
            style={{
              width: 1,
              height: 80,
              background: 'var(--gold)',
              transform: 'scaleY(0)',
              transformOrigin: 'top',
            }}
          />
          <div
            ref={sectionNumRef}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--gold)',
              opacity: 0,
            }}
          >
            01
          </div>
        </div>

        {/* Main content */}
        <div id="hero-content">
          {/* Title */}
          <div
            ref={titleRef}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(52px, 8vw, 120px)',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--white)',
              marginBottom: 32,
            }}
          >
            {titleChars}
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(13px, 1.8vw, 18px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              opacity: 0,
              marginBottom: 24,
            }}
          >
            BUILDING VALUE THROUGH INTEGRATED EXCELLENCE
          </div>

          {/* Meta */}
          <div
            ref={metaRef}
            style={{
              display: 'flex',
              gap: 60,
              opacity: 0,
              marginBottom: 48,
            }}
          >
            <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 13, color: 'var(--muted)' }}>
              Integrated Real Estate Development
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 13, color: 'var(--muted)' }}>
              Bangalore, India · Est. 2025
            </div>
          </div>

          {/* Rule */}
          <div
            ref={ruleRef}
            style={{
              height: 0.5,
              background: 'var(--gold)',
              width: '100%',
              maxWidth: 640,
              marginBottom: 32,
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />

          {/* CTAs */}
          <div ref={ctasRef} style={{ display: 'flex', gap: 48, opacity: 0 }}>
            <a href="/projects" className="btn-text" data-cursor="cta">
              EXPLORE OUR WORK →
            </a>
            <a href="/ecosystem" className="btn-text" data-cursor="cta">
              OUR ECOSYSTEM →
            </a>
          </div>
        </div>

        {/* Scroll progress bar (left edge) */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: '35%',
            bottom: '35%',
            width: 1,
            background: 'var(--faint)',
            zIndex: 20,
          }}
        >
          <div
            ref={progressFillRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 0,
              background: 'var(--gold)',
              transition: 'height 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  )
}
