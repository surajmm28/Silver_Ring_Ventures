'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from '@/lib/gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const barRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // On route change — run enter animation
  useEffect(() => {
    const bar = barRef.current
    const content = contentRef.current
    if (!bar || !content) return

    const tl = gsap.timeline()

    // Bar slides out (enter)
    tl.fromTo(
      bar,
      { left: '0%', width: '100%' },
      { left: '100%', duration: 0.5, ease: 'power3.inOut' }
    )

    // Content slides up and fades in
    tl.fromTo(
      content,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.25'
    )

    return () => { tl.kill() }
  }, [pathname])

  return (
    <>
      {/* Transition bar */}
      <div
        ref={barRef}
        id="page-transition-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100vh',
          background: 'var(--gold)',
          zIndex: 4000,
          pointerEvents: 'none',
        }}
      />

      <div ref={contentRef}>
        {children}
      </div>
    </>
  )
}
