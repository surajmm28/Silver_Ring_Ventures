'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import type { Project } from '@/lib/data/projects'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    // Animate in
    const tl = gsap.timeline()
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
    tl.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.6, ease: 'power3.out' }, '-=0.3')

    // ESC key
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' })
    tl.to(backdropRef.current, { opacity: 0, duration: 0.3 }, '-=0.2')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
      }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5,5,5,0.97)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '90%',
          maxWidth: 1200,
          background: 'var(--deep)',
          display: 'flex',
          overflow: 'hidden',
          transform: 'translateX(100%)',
        }}
      >
        {/* Left — Image area */}
        <div style={{
          flex: '0 0 55%',
          background: 'linear-gradient(135deg, #1a1408 0%, #2a200c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" opacity="0.15">
            <rect x="16" y="10" width="68" height="80" stroke="#C4973D" strokeWidth="0.8" />
            <rect x="28" y="22" width="16" height="18" stroke="#C4973D" strokeWidth="0.5" />
            <rect x="56" y="22" width="16" height="18" stroke="#C4973D" strokeWidth="0.5" />
            <rect x="28" y="50" width="16" height="18" stroke="#C4973D" strokeWidth="0.5" />
            <rect x="56" y="50" width="16" height="18" stroke="#C4973D" strokeWidth="0.5" />
            <rect x="38" y="76" width="24" height="14" stroke="#C4973D" strokeWidth="0.5" />
          </svg>
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            padding: '6px 16px',
            border: '0.5px solid var(--gold)',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}>
            {project.type}
          </div>
        </div>

        {/* Right — Info */}
        <div style={{
          flex: '0 0 45%',
          overflowY: 'auto',
          padding: '60px 48px',
          position: 'relative',
        }}>
          {/* Close */}
          <button
            onClick={handleClose}
            data-cursor="cta"
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              fontSize: 24,
              cursor: 'none',
              padding: 8,
              lineHeight: 1,
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.color = 'var(--white)' }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.color = 'var(--muted)' }}
            aria-label="Close modal"
          >
            ×
          </button>

          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(32px, 4vw, 52px)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            color: 'var(--white)',
            marginBottom: 32,
          }}>
            {project.name}
          </div>

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}>
            {[
              { label: 'Location', value: project.location },
              { label: 'Area', value: project.area },
              { label: 'Status', value: project.status },
              { label: 'Year', value: project.year },
            ].map((item) => (
              <div key={item.label} style={{ borderTop: '0.5px solid var(--faint)', paddingTop: 16 }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: 6,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: 14,
                  color: 'var(--white)',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: 1.9,
            color: 'var(--muted)',
            marginBottom: 40,
          }}>
            {project.description}
          </div>

          <a href="/contact" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} data-cursor="cta">
            ENQUIRE ABOUT THIS PROJECT →
          </a>
        </div>
      </div>
    </div>
  )
}
