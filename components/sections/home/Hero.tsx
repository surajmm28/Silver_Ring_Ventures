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
        {/* Atmospheric background layers */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          {/* Base radial glow — warm amber focal point */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 55% at 62% 58%, rgba(196,151,61,0.07) 0%, transparent 70%)',
          }} />
          {/* Secondary cool depth gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(15,12,8,0.9) 0%, transparent 55%, rgba(5,5,5,0.95) 100%)',
          }} />
          {/* Perspective floor grid */}
          <svg
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '50%', opacity: 0.07 }}
            viewBox="0 0 1440 360" preserveAspectRatio="none"
          >
            {/* Vanishing-point grid lines converging to centre */}
            {Array.from({ length: 14 }, (_, i) => {
              const x = (i / 13) * 1440
              return <line key={`v${i}`} x1={x} y1={360} x2={720} y2={0} stroke="#C4973D" strokeWidth="0.6" />
            })}
            {Array.from({ length: 9 }, (_, i) => {
              const y = 360 - (i / 8) * 360
              const spread = (y / 360) * 720
              return <line key={`h${i}`} x1={720 - spread} y1={y} x2={720 + spread} y2={y} stroke="#C4973D" strokeWidth="0.5" />
            })}
          </svg>
          {/* Bangalore skyline silhouette */}
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '44%', opacity: 0.055 }}
            viewBox="0 0 1440 320" preserveAspectRatio="none"
          >
            <path
              fill="#C4973D"
              d="M0,320 L0,240 L40,240 L40,200 L55,200 L55,160 L70,160 L70,200 L85,200 L85,240
                 L120,240 L120,180 L130,180 L130,120 L138,120 L138,80 L146,80 L146,120 L154,120
                 L154,180 L165,180 L165,240 L200,240 L200,200 L215,200 L215,150 L225,150
                 L225,100 L235,100 L235,70 L245,70 L245,50 L248,50 L248,30 L252,30 L252,50
                 L255,50 L255,70 L265,70 L265,100 L275,100 L275,150 L285,150 L285,200 L300,200
                 L300,240 L340,240 L340,190 L355,190 L355,140 L368,140 L368,110 L380,110
                 L380,140 L393,140 L393,190 L410,190 L410,240 L450,240 L450,210 L465,210
                 L465,170 L475,170 L475,130 L480,130 L480,90 L485,90 L485,60 L490,60
                 L490,40 L495,40 L495,20 L498,20 L498,8 L502,8 L502,20 L505,20 L505,40
                 L510,40 L510,60 L515,60 L515,90 L520,90 L520,130 L525,130 L525,170
                 L535,170 L535,210 L550,210 L550,240 L590,240 L590,190 L605,190 L605,145
                 L618,145 L618,100 L628,100 L628,75 L635,75 L635,55 L640,55 L640,75
                 L645,75 L645,100 L655,100 L655,145 L668,145 L668,190 L685,190 L685,240
                 L720,240 L720,210 L735,210 L735,175 L748,175 L748,135 L758,135 L758,95
                 L765,95 L765,65 L772,65 L772,45 L775,45 L775,25 L778,25 L778,15 L782,15
                 L782,25 L785,25 L785,45 L788,45 L788,65 L795,65 L795,95 L802,95 L802,135
                 L812,135 L812,175 L825,175 L825,210 L840,210 L840,240 L880,240 L880,200
                 L895,200 L895,160 L908,160 L908,120 L918,120 L918,90 L925,90 L925,60
                 L932,60 L932,40 L938,40 L938,60 L944,60 L944,90 L951,90 L951,120
                 L961,120 L961,160 L974,160 L974,200 L990,200 L990,240 L1030,240 L1030,195
                 L1045,195 L1045,150 L1055,150 L1055,115 L1065,115 L1065,80 L1072,80
                 L1072,50 L1078,50 L1078,30 L1082,30 L1082,15 L1085,15 L1085,5 L1088,5
                 L1088,15 L1091,15 L1091,30 L1095,30 L1095,50 L1101,50 L1101,80 L1108,80
                 L1108,115 L1118,115 L1118,150 L1128,150 L1128,195 L1145,195 L1145,240
                 L1180,240 L1180,210 L1195,210 L1195,170 L1205,170 L1205,130 L1215,130
                 L1215,170 L1225,170 L1225,210 L1240,210 L1240,240 L1280,240 L1280,200
                 L1295,200 L1295,160 L1310,160 L1310,200 L1325,200 L1325,240 L1360,240
                 L1360,210 L1375,210 L1375,180 L1385,180 L1385,210 L1400,210 L1400,240
                 L1440,240 L1440,320 Z"
            />
          </svg>
          {/* Top vignette */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 100%)',
          }} />
          {/* Bottom scrim over skyline */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '48%',
            background: 'linear-gradient(to top, rgba(5,5,5,0.88) 0%, transparent 100%)',
          }} />
        </div>

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
            className="hero-meta"
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
          <div ref={ctasRef} className="hero-ctas" style={{ display: 'flex', gap: 48, opacity: 0 }}>
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
