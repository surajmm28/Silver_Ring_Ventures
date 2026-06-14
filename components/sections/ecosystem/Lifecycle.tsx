'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { lifecycle } from '@/lib/data/lifecycle'

const N = lifecycle.length

export default function Lifecycle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    const updateTrack = (progress: number) => {
      const px = -progress * (N - 1) * window.innerWidth
      track.style.transform = `translateX(${px}px)`
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => updateTrack(self.progress),
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    /* Outer scroll container — height = N viewports so CSS sticky pins for (N-1) vh of scroll */
    <div
      ref={containerRef}
      style={{ height: `${N * 100}vh`, position: 'relative' }}
    >
      {/* Sticky viewport — 100vh tall, holds the entire horizontal track */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Section label */}
        <div style={{
          position: 'absolute',
          top: 48,
          left: 60,
          zIndex: 20,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          pointerEvents: 'none',
        }}>
          Project Lifecycle
        </div>

        {/* Horizontal track — N panels side by side */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: `${N * 100}vw`,
            height: '100%',
            willChange: 'transform',
          }}
        >
          {lifecycle.map((step, i) => (
            <div
              key={step.step}
              className="lifecycle-panel"
              style={{
                minWidth: '100vw',
                height: '100vh',
                background: i % 2 === 0 ? 'var(--black)' : 'var(--deep)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 80px',
              }}
            >
              {/* Giant background step number */}
              <div style={{
                position: 'absolute',
                left: 60,
                top: 60,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(100px, 16vw, 180px)',
                color: 'var(--gold-faint)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                {step.step}
              </div>

              {/* Panel counter */}
              <div style={{
                position: 'absolute',
                bottom: 48,
                right: 80,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.2em',
                color: 'var(--gold)',
                pointerEvents: 'none',
              }}>
                {i + 1} / {N}
              </div>

              {/* Horizontal gold hairline */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 0.5,
                background: 'var(--gold-faint)',
                pointerEvents: 'none',
              }} />

              {/* Two-column content */}
              <div className="lc-content-grid">
                {/* Left — headline */}
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 20,
                  }}>
                    PHASE {step.step} — {step.subtitle}
                  </div>

                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(48px, 7vw, 96px)',
                    textTransform: 'uppercase',
                    lineHeight: 0.9,
                    color: 'var(--white)',
                    marginBottom: 32,
                  }}>
                    {step.title}
                  </div>

                  <div style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: 15,
                    lineHeight: 1.9,
                    color: 'var(--muted)',
                    maxWidth: 440,
                  }}>
                    {step.description}
                  </div>

                  <div style={{
                    marginTop: 24,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                  }}>
                    Led by: {step.unit}
                  </div>
                </div>

                {/* Right — services list */}
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 28,
                  }}>
                    KEY SERVICES
                  </div>

                  {step.services.map((service, si) => (
                    <div
                      key={si}
                      style={{
                        padding: '18px 0',
                        borderBottom: '0.5px solid var(--faint)',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 600,
                        fontSize: 'clamp(16px, 2vw, 22px)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--white)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
