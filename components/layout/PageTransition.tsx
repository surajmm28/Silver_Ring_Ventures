'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  registerPanel,
  sweepOut,
  quickTransition,
  wasManualNav,
  clearManualNav,
} from '@/lib/transitions'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const panelRef  = useRef<HTMLDivElement>(null)
  const monoRef   = useRef<HTMLDivElement>(null)
  const isFirst   = useRef(true)

  // Register panel with singleton on first mount
  useEffect(() => {
    registerPanel(panelRef.current, monoRef.current)
  }, [])

  useEffect(() => {
    // Skip very first render — preloader handles the initial entrance
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    // Reset scroll position on new page
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    if (wasManualNav()) {
      // Panel is already covering the screen from TransitionLink's sweepIn —
      // just sweep it out to reveal the new page
      clearManualNav()
      sweepOut()
    } else {
      // Back / forward button: run a quick full sweep cycle
      quickTransition()
    }
  }, [pathname])

  return (
    <>
      {/* ============================================================
          Transition panel — fixed full-screen, sits above everything.
          GSAP controls position; never interferes with navbar (z 9500
          vs navbar z 100).
          ============================================================ */}
      <div
        ref={panelRef}
        id="page-transition-panel"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9500,
          background: 'var(--black)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Grain texture — same as rest of site */}
        <div
          className="grain-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.04,
          }}
        />

        {/* Hairline accent — top edge */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '0.5px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(196,151,61,0.55) 50%, transparent 100%)',
          }}
        />
        {/* Hairline accent — bottom edge */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '0.5px',
            background:
              'linear-gradient(to right, transparent 0%, rgba(196,151,61,0.55) 50%, transparent 100%)',
          }}
        />

        {/* Monogram mark — visible briefly while panel covers screen */}
        <div
          ref={monoRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            opacity: 0,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {/* SR lettermark */}
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(72px, 14vw, 136px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'rgba(196,151,61,0.2)',
            }}
          >
            SR
          </div>

          {/* Gold rule */}
          <div
            style={{
              width: 44,
              height: '0.5px',
              background: 'rgba(196,151,61,0.4)',
            }}
          />

          {/* Wordmark */}
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(196,151,61,0.38)',
            }}
          >
            SILVERRING VENTURES
          </div>
        </div>
      </div>

      {children}
    </>
  )
}
