'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from '@/lib/gsap'

const PAGE_LABELS: Record<string, string> = {
  '/': 'HOME',
  '/about': 'ABOUT',
  '/ecosystem': 'ECOSYSTEM',
  '/projects': 'PROJECTS',
  '/contact': 'GET IN TOUCH',
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirst = useRef(true)

  useEffect(() => {
    const label = PAGE_LABELS[pathname] ?? (pathname.replace('/', '').toUpperCase() || 'HOME')
    if (labelRef.current) labelRef.current.textContent = label

    const overlay = overlayRef.current
    const labelEl = labelRef.current
    const content = contentRef.current
    if (!overlay || !labelEl || !content) return

    // Skip animation on initial page load — preloader handles that
    if (isFirst.current) {
      isFirst.current = false
      gsap.set(overlay, { left: '-100%' })
      return
    }

    gsap.set(overlay, { left: '-100%' })
    gsap.set(labelEl, { opacity: 0, y: 32 })
    gsap.set(content, { opacity: 0, y: 28 })

    const tl = gsap.timeline()

    // Gold panel sweeps in from left, covering the screen
    tl.to(overlay, { left: '0%', duration: 0.52, ease: 'power3.inOut' })
    // Page name rises into view on the gold panel
    tl.to(labelEl, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' }, '-=0.12')
    // Hold so the label is readable
    tl.to({}, { duration: 0.32 })
    // Label fades up and out
    tl.to(labelEl, { opacity: 0, y: -24, duration: 0.22, ease: 'power2.in' })
    // Panel sweeps out to the right, revealing new page
    tl.to(overlay, { left: '100%', duration: 0.52, ease: 'power3.inOut' }, '-=0.06')
    // New page content fades + rises in
    tl.to(content, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.32')

    return () => { tl.kill() }
  }, [pathname])

  return (
    <>
      {/* Full-screen gold transition overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100vh',
          background: 'var(--gold)',
          zIndex: 4000,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={labelRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(52px, 10vw, 128px)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: 'var(--black)',
            opacity: 0,
            userSelect: 'none',
          }}
        />
      </div>

      <div ref={contentRef}>
        {children}
      </div>
    </>
  )
}
