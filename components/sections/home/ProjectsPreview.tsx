'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { animateWords } from '@/lib/animations'
import SectionTag from '@/components/ui/SectionTag'
import { projects } from '@/lib/data/projects'
import { gyro } from '@/lib/gyroscope'
import TransitionLink from '@/components/ui/TransitionLink'

// Unsplash dark-toned urban/architectural photos — one per Bangalore locality
const LOCALITY_IMAGES = [
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&auto=format&fit=crop', // Indiranagar — premium urban night
  'https://images.unsplash.com/photo-1485627941502-d2e6429a8af0?w=800&q=80&auto=format&fit=crop', // Koramangala — dense commercial
  'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&q=80&auto=format&fit=crop', // Whitefield — glass/corporate
  'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80&auto=format&fit=crop', // Sarjapur — development corridor
]

const HEADING_WORDS = [
  { text: 'DEVELOPMENTS', gold: false },
  { text: 'THAT', gold: false },
  { text: '[DEFINE]', gold: true },
  { text: 'NEIGHBOURHOODS.', gold: false },
]

export default function ProjectsPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      animateWords(headlineRef.current, {
        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%', once: true },
      })
      gsap.fromTo(
        '.project-strip-card',
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.13,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      )
    }, sectionRef)
    // Gyro tilt — applied to wrapper divs, not GSAP-animated cards
    const gyroUnsub = gyro.subscribe(({ x, y }) => {
      if (!gyro.isActive || !stripRef.current) return
      const wraps = stripRef.current.querySelectorAll<HTMLElement>('.gyro-tilt-wrap')
      wraps.forEach((el) => {
        el.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 4}deg)`
      })
    })

    return () => {
      ctx.revert()
      gyroUnsub()
    }
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

  const locationData = [
    {
      area: 'Indiranagar',
      coords: '12.9719° N, 77.6412° E',
      highlights: ['Premium residential corridor', '100 Feet Road proximity', 'Metro connectivity'],
      gradient: 'linear-gradient(145deg, #0f0b05 0%, #1c1508 60%, #0a0804 100%)',
      accent: 'rgba(196,151,61,0.12)',
      svgPath: 'M20,160 L20,60 L40,60 L40,40 L50,40 L50,20 L60,20 L60,40 L70,40 L70,60 L90,60 L90,160 M100,160 L100,80 L115,80 L115,50 L125,50 L125,30 L130,30 L130,10 L135,10 L135,30 L140,30 L140,50 L150,50 L150,80 L165,80 L165,160 M175,160 L175,90 L185,90 L185,70 L195,70 L195,90 L205,90 L205,160',
    },
    {
      area: 'Koramangala',
      coords: '12.9352° N, 77.6245° E',
      highlights: ['Premier commercial district', 'Tech ecosystem hub', 'High footfall retail'],
      gradient: 'linear-gradient(145deg, #060610 0%, #0d0d1e 60%, #050508 100%)',
      accent: 'rgba(100,120,220,0.08)',
      svgPath: 'M10,160 L10,40 L30,40 L30,160 M40,160 L40,20 L60,20 L60,160 M70,160 L70,50 L75,50 L75,30 L85,30 L85,50 L90,50 L90,160 M100,160 L100,70 L120,70 L120,160 M130,160 L130,35 L145,35 L145,160 M155,160 L155,55 L170,55 L170,160 M180,160 L180,20 L195,20 L195,160',
    },
    {
      area: 'Whitefield',
      coords: '12.9698° N, 77.7499° E',
      highlights: ['IT corridor investment', 'Luxury residential demand', 'Airport road access'],
      gradient: 'linear-gradient(145deg, #080410 0%, #130818 60%, #060408 100%)',
      accent: 'rgba(160,80,200,0.07)',
      svgPath: 'M15,160 L15,80 L35,80 L35,60 L45,60 L45,40 L55,40 L55,60 L65,60 L65,80 L85,80 L85,160 M95,160 L95,50 L110,50 L110,30 L120,30 L120,10 L125,10 L125,30 L135,30 L135,50 L150,50 L150,160 M160,160 L160,70 L175,70 L175,160 M185,160 L185,45 L200,45 L200,160',
    },
    {
      area: 'Sarjapur Road',
      coords: '12.9010° N, 77.6800° E',
      highlights: ['Fastest-growing corridor', 'Land appreciation >18% YoY', 'Outer Ring Road nexus'],
      gradient: 'linear-gradient(145deg, #040c08 0%, #081510 60%, #030806 100%)',
      accent: 'rgba(60,160,80,0.07)',
      svgPath: 'M20,160 L20,100 L35,100 L35,80 L45,80 L45,60 L55,60 L55,80 L65,80 L65,100 L80,100 L80,160 M90,160 L90,70 L100,70 L100,50 L110,50 L110,30 L115,30 L115,10 L120,10 L120,30 L125,30 L125,50 L135,50 L135,70 L145,70 L145,160 M155,160 L155,85 L165,85 L165,160 M175,160 L175,55 L190,55 L190,160 M200,160 L200,75 L215,75 L215,160',
    },
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
          ref={headlineRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            color: 'var(--white)',
          }}
        >
          {HEADING_WORDS.map((w, i) => (
            <span
              key={i}
              className="anim-word"
              style={{
                display: 'inline-block',
                color: w.gold ? 'var(--gold)' : 'inherit',
                marginRight: i < HEADING_WORDS.length - 1 ? '0.22em' : 0,
                opacity: 0,
              }}
            >
              {w.text}
            </span>
          ))}
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
        {projects.slice(0, 4).map((project, i) => {
          const loc = locationData[i]
          return (
            <div key={project.id} className="gyro-tilt-wrap gyro-project-wrap" style={{ flex: '0 0 400px', height: 520 }}>
            <div
              className="project-strip-card"
              style={{
                flex: 'none',
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: loc.gradient,
                opacity: 0,
                borderRight: '0.5px solid rgba(196,151,61,0.08)',
              }}
            >
              {/* Zoomable background layer — scales on card hover */}
              <div className="project-card-bg-zoom">
                {/* Locality photo */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url('${LOCALITY_IMAGES[i]}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                {/* Dark overlay over photo */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(5,5,5,0.60)',
                  zIndex: 1,
                }} />
                {/* Accent glow */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${loc.accent} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Architectural blueprint SVG */}
                <svg
                  aria-hidden="true"
                  style={{ position: 'absolute', bottom: 80, left: 0, width: '100%', height: 200, opacity: 0.18, zIndex: 3 }}
                  viewBox="0 0 220 160" preserveAspectRatio="xMidYMax meet"
                >
                  <path d={loc.svgPath} stroke="#C4973D" strokeWidth="0.8" fill="none" />
                  <line x1="0" y1="160" x2="220" y2="160" stroke="#C4973D" strokeWidth="0.4" />
                  {Array.from({ length: 6 }, (_, r) =>
                    Array.from({ length: 10 }, (_, c) => (
                      <circle key={`${r}-${c}`} cx={c * 22 + 11} cy={r * 26 + 8} r="0.6" fill="#C4973D" opacity="0.5" />
                    ))
                  )}
                </svg>

                {/* Large watermark location name */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(44px, 6vw, 64px)',
                  textTransform: 'uppercase',
                  color: 'rgba(196,151,61,0.12)',
                  zIndex: 3,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  lineHeight: 1,
                }}>
                  {loc.area}
                </div>
              </div>

              {/* Type + status badges */}
              <div style={{
                position: 'absolute', top: 24, left: 24,
                display: 'flex', gap: 8,
              }}>
                <span style={{
                  padding: '4px 12px',
                  border: '0.5px solid rgba(196,151,61,0.45)',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--gold)',
                }}>
                  {project.type}
                </span>
                <span style={{
                  padding: '4px 12px',
                  background: 'rgba(196,151,61,0.1)',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'var(--gold)',
                }}>
                  {project.status}
                </span>
              </div>

              {/* Coordinates */}
              <div style={{
                position: 'absolute', top: 24, right: 24,
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300, fontSize: 9,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(237,235,230,0.22)',
                textAlign: 'right',
              }}>
                {loc.coords}
              </div>

              {/* Bottom info panel */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '28px 24px 24px',
                background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 70%, transparent 100%)',
              }}>
                {/* Location name */}
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 28, textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: 'var(--white)',
                  marginBottom: 4,
                }}>
                  {loc.area}
                </div>
                <div style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400, fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  color: 'var(--gold)', marginBottom: 16,
                }}>
                  Bangalore — {project.year}
                </div>
                {/* Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {loc.highlights.map((h, hi) => (
                    <div key={hi} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300, fontSize: 11,
                      color: 'rgba(237,235,230,0.5)',
                      letterSpacing: '0.04em',
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', opacity: 0.6, flexShrink: 0 }} />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          )
        })}
      </div>

      <div className="projects-preview-footer" style={{ marginTop: 48, paddingRight: 60 }}>
        <TransitionLink href="/projects" className="btn-text" data-cursor="cta">
          VIEW ALL PROJECTS →
        </TransitionLink>
      </div>
    </section>
  )
}
