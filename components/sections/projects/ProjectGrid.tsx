'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { projects, type Project, type ProjectType } from '@/lib/data/projects'
import ProjectModal from './ProjectModal'
import TransitionLink from '@/components/ui/TransitionLink'

const FILTERS: Array<'All' | ProjectType> = ['All', 'Residential', 'Commercial', 'Land']

const CARD_HEIGHTS = [480, 560, 520, 480, 560, 520]

const CARD_BG = [
  'linear-gradient(135deg, #1a1408 0%, #2a200c 100%)',
  'linear-gradient(135deg, #0a0a12 0%, #141425 100%)',
  'linear-gradient(135deg, #101008 0%, #1a1a0c 100%)',
  'linear-gradient(135deg, #0a0f0a 0%, #101a10 100%)',
  'linear-gradient(135deg, #12080a 0%, #1e1010 100%)',
  'linear-gradient(135deg, #08080f 0%, #101018 100%)',
]

export default function ProjectGrid() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectType>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.type === activeFilter)

  const isInitialized = useRef(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const el = sectionRef.current
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.pgrid-card'))
    if (!cards.length) return

    if (!isInitialized.current) {
      isInitialized.current = true
      // First mount: scroll-triggered reveal
      const ctx = gsap.context(() => {
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        )
      }, el) // Pass DOM element (not ref) as scope
      return () => {
        ctx.revert()
        isInitialized.current = false
      }
    }

    // Filter change: animate new cards in directly
    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }
    )
  }, [activeFilter])

  const handleFilterChange = (filter: 'All' | ProjectType) => {
    if (!sectionRef.current) { setActiveFilter(filter); return }
    const cards = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('.pgrid-card'))
    if (!cards.length) { setActiveFilter(filter); return }
    gsap.to(cards, {
      opacity: 0, y: 20,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.in',
      onComplete: () => {
        gsap.killTweensOf(cards)
        setActiveFilter(filter)
      },
    })
  }

  return (
    <>
      <section ref={sectionRef} className="pgrid-section" style={{ background: 'var(--black)', padding: '0 60px 100px' }}>
        {/* Filter bar */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '0.5px solid var(--faint)',
          marginBottom: 60,
        }}>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              style={{
                padding: '20px 32px',
                background: 'none',
                border: 'none',
                borderBottom: `1px solid ${activeFilter === filter ? 'var(--gold)' : 'transparent'}`,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: activeFilter === filter ? 'var(--white)' : 'var(--muted)',
                cursor: 'none',
                transition: 'color 0.3s, border-color 0.3s',
                marginBottom: -0.5,
              }}
              data-cursor="cta"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry-like 3-column grid */}
        <div className="pgrid-grid" style={{ gap: 1 }}>
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="pgrid-card project-card"
              onClick={() => setSelectedProject(project)}
              data-cursor="card"
              style={{
                height: CARD_HEIGHTS[i % CARD_HEIGHTS.length],
                background: CARD_BG[i % CARD_BG.length],
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
              }}
            >
              {/* Placeholder building icon */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.15">
                  <rect x="14" y="8" width="52" height="64" stroke="#C4973D" strokeWidth="0.8" />
                  <rect x="24" y="18" width="12" height="14" stroke="#C4973D" strokeWidth="0.5" />
                  <rect x="44" y="18" width="12" height="14" stroke="#C4973D" strokeWidth="0.5" />
                  <rect x="24" y="42" width="12" height="14" stroke="#C4973D" strokeWidth="0.5" />
                  <rect x="44" y="42" width="12" height="14" stroke="#C4973D" strokeWidth="0.5" />
                  <rect x="30" y="60" width="20" height="12" stroke="#C4973D" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Type badge */}
              <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
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

              {/* Hover overlay */}
              <div className="project-card-overlay">
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  textTransform: 'uppercase',
                  color: 'var(--white)',
                  marginBottom: 6,
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
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pgrid-cta-section" style={{
        background: 'var(--deep)',
        padding: '80px 60px',
        borderTop: '0.5px solid var(--faint)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 5vw, 72px)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          color: 'var(--white)',
          marginBottom: 40,
        }}>
          HAVE A SITE IN MIND?
        </div>
        <TransitionLink href="/contact" className="btn-gold" data-cursor="cta">
          START A CONVERSATION →
        </TransitionLink>
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
