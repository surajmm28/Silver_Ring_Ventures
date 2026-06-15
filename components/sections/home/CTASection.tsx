'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import TransitionLink from '@/components/ui/TransitionLink'

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ruleRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      )
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true },
          delay: 0.1,
        }
      )
      gsap.fromTo(
        [subRef.current, btnRef.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%', once: true },
          delay: 0.35,
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="cta-section">
      <div aria-hidden="true" className="grain-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div ref={ruleRef} style={{ width: 60, height: 0.5, background: 'var(--gold)', marginBottom: 52, transform: 'scaleX(0)' }} />

      <div ref={headRef} style={{ opacity: 0 }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(40px, 6vw, 92px)',
          lineHeight: 0.92,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: 'var(--white)',
          maxWidth: 860,
          marginBottom: 28,
        }}>
          Ready to build something exceptional?
        </div>
      </div>

      <div
        ref={subRef}
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 300,
          fontSize: 15,
          lineHeight: 1.9,
          color: 'var(--muted)',
          maxWidth: 460,
          marginBottom: 52,
          opacity: 0,
        }}
      >
        Whether you&apos;re a landowner, investor, or developer — let&apos;s discuss how Silverring
        Ventures can deliver an integrated outcome for your next project.
      </div>

      <TransitionLink
        ref={btnRef}
        href="/contact"
        className="btn-outline"
        data-cursor="cta"
        style={{ opacity: 0 }}
      >
        <span>LET&apos;S TALK</span>
        <span className="btn-outline-arrow">→</span>
      </TransitionLink>
    </section>
  )
}
