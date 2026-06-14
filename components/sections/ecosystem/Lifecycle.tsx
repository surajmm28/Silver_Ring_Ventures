'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { lifecycle } from '@/lib/data/lifecycle'

export default function Lifecycle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return
    const container = containerRef.current
    const track = trackRef.current

    // Use gsap.context so ctx.revert() kills EVERY ScrollTrigger created here —
    // including all the containerAnimation sub-triggers — not just mainTween.
    const ctx = gsap.context(() => {
      const panels = Array.from(track.querySelectorAll('.lifecycle-panel'))
      const totalWidth = (panels.length - 1) * window.innerWidth

      const mainTween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalWidth + window.innerHeight}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      panels.forEach((panel) => {
        const num = panel.querySelector('.lc-num')
        const title = panel.querySelector('.lc-title')
        const services = panel.querySelectorAll('.lc-service')

        gsap.fromTo(
          [num, title],
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: mainTween,
              start: 'left 60%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        gsap.fromTo(
          services,
          { opacity: 0, x: 30 },
          {
            opacity: 1, x: 0,
            stagger: 0.07,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: mainTween,
              start: 'left 40%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, container) // scope to the container DOM element

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', width: `${lifecycle.length * 100}vw` }}
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
            {/* Background step number */}
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

            {/* Progress */}
            <div style={{
              position: 'absolute',
              bottom: 48,
              right: 80,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--gold)',
            }}>
              {i + 1}/{lifecycle.length}
            </div>

            {/* Gold connecting line across panel */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 0.5,
              background: 'var(--gold-faint)',
              pointerEvents: 'none',
            }} />

            <div className="lc-content-grid">
              {/* Left */}
              <div>
                <div
                  className="lc-num"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 20,
                    opacity: 0,
                  }}
                >
                  PHASE {step.step} — {step.subtitle}
                </div>
                <div
                  className="lc-title"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(48px, 7vw, 96px)',
                    textTransform: 'uppercase',
                    lineHeight: 0.9,
                    color: 'var(--white)',
                    marginBottom: 32,
                    opacity: 0,
                  }}
                >
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

              {/* Right — services */}
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
                    className="lc-service"
                    style={{
                      padding: '18px 0',
                      borderBottom: '0.5px solid var(--faint)',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 600,
                      fontSize: 'clamp(16px, 2vw, 22px)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--white)',
                      opacity: 0,
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
  )
}
