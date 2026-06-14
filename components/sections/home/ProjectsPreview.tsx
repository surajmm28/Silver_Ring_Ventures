'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import SectionTag from '@/components/ui/SectionTag'
import { projects } from '@/lib/data/projects'

export default function ProjectsPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-strip-card',
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    scrollStartX.current = stripRef.current?.scrollLeft ?? 0
    document.body.style.userSelect = 'none'
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !stripRef.current) return
    const dx = e.clientX - dragStartX.current
    stripRef.current.scrollLeft = scrollStartX.current - dx
  }

  const onMouseUp = () => {
    setIsDragging(false)
    document.body.style.userSelect = ''
  }

  // Placeholder gradient colors for cards
  const cardColors = [
    'linear-gradient(135deg, #1a1408 0%, #2a200c 100%)',
    'linear-gradient(135deg, #0a0a0f 0%, #141420 100%)',
    'linear-gradient(135deg, #100808 0%, #1a1010 100%)',
    'linear-gradient(135deg, #080c0a 0%, #101a14 100%)',
  ]

  return (
    <section
      ref={sectionRef}
      className="projects-preview-section"
      style={{ background: 'var(--black)', padding: '100px 0 100px 60px' }}
    >
      <div className="projects-preview-header" style={{ paddingRight: 60, marginBottom: 60 }}>
        <SectionTag label="03  PROJECTS" />
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: 'var(--white)',
          }}
        >
          DEVELOPMENTS THAT{' '}
          <span style={{ color: 'var(--gold)' }}>[DEFINE]</span>{' '}
          NEIGHBOURHOODS.
        </div>
      </div>

      {/* Drag strip */}
      <div
        ref={stripRef}
        data-cursor="drag"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          marginRight: 0,
          gap: 0,
        }}
      >
        {projects.slice(0, 4).map((project, i) => (
          <div
            key={project.id}
            className="project-strip-card"
            style={{
              flex: '0 0 380px',
              height: 500,
              position: 'relative',
              overflow: 'hidden',
              background: cardColors[i % cardColors.length],
              opacity: 0,
            }}
          >
            {/* Placeholder visual */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
            }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.2">
                <rect x="10" y="5" width="40" height="50" stroke="#C4973D" strokeWidth="0.8" />
                <rect x="18" y="15" width="8" height="10" stroke="#C4973D" strokeWidth="0.5" />
                <rect x="34" y="15" width="8" height="10" stroke="#C4973D" strokeWidth="0.5" />
                <rect x="18" y="32" width="8" height="10" stroke="#C4973D" strokeWidth="0.5" />
                <rect x="34" y="32" width="8" height="10" stroke="#C4973D" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Bottom info */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: '0.5px solid var(--faint)',
                padding: '20px 24px',
                background: 'rgba(5,5,5,0.8)',
              }}
            >
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: 4,
              }}>
                {project.name}
              </div>
              <div style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--gold)',
              }}>
                {project.location}
              </div>
            </div>

            {/* Type badge */}
            <div style={{
              position: 'absolute',
              top: 20,
              right: 20,
              padding: '4px 12px',
              border: '0.5px solid var(--gold)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              {project.type}
            </div>
          </div>
        ))}
      </div>

      <div className="projects-preview-footer" style={{ marginTop: 48, paddingRight: 60 }}>
        <a href="/projects" className="btn-text" data-cursor="cta">
          VIEW ALL PROJECTS →
        </a>
      </div>
    </section>
  )
}
