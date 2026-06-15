'use client'

import { useEffect, useRef, useState } from 'react'
import { gyro } from '@/lib/gyroscope'

type Phase = 'idle' | 'prompt' | 'granted' | 'denied'

const STORAGE_KEY = 'sr_gyro_perm'

export default function GyroController() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [indicatorVisible, setIndicatorVisible] = useState(false)
  const promptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only runs on mobile devices that support orientation events
    if (
      !gyro.isMobile() ||
      typeof window === 'undefined' ||
      !('DeviceOrientationEvent' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored === 'granted') {
      if (gyro.needsExplicitPermission()) {
        // iOS resets permission each session — must prompt again
        const t = setTimeout(() => setPhase('prompt'), 1800)
        return () => clearTimeout(t)
      } else {
        // Android — start immediately
        gyro.start()
        setPhase('granted')
        setTimeout(() => setIndicatorVisible(true), 600)
      }
    } else if (stored === 'denied') {
      setPhase('denied')
    } else {
      // First visit — show prompt after preloader settles
      const t = setTimeout(() => setPhase('prompt'), 2500)
      return () => clearTimeout(t)
    }
  }, [])

  // Slide-in prompt
  useEffect(() => {
    if (phase !== 'prompt' || !promptRef.current) return
    promptRef.current.style.transform = 'translateY(100%)'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (promptRef.current) {
          promptRef.current.style.transition = 'transform 0.55s cubic-bezier(0.19,1,0.22,1)'
          promptRef.current.style.transform = 'translateY(0)'
        }
      })
    })
  }, [phase])

  const handleAllow = async () => {
    const result = await gyro.requestPermission()
    if (result === 'granted') {
      localStorage.setItem(STORAGE_KEY, 'granted')
      gyro.start()
      setPhase('granted')
      setTimeout(() => setIndicatorVisible(true), 500)
    } else {
      localStorage.setItem(STORAGE_KEY, 'denied')
      setPhase('denied')
    }
  }

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'denied')
    setPhase('denied')
  }

  if (phase === 'idle' || phase === 'denied') return null

  return (
    <>
      {/* Permission prompt — bottom sheet */}
      {phase === 'prompt' && (
        <div
          ref={promptRef}
          className="gyro-prompt"
          role="dialog"
          aria-modal="true"
          aria-label="Motion access request"
        >
          <div className="gyro-prompt-inner">
            <div className="gyro-prompt-top">
              <div className="gyro-prompt-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="12" cy="18.5" r="1.2" fill="currentColor" />
                  <line x1="9.5" y1="5" x2="14.5" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M3 9 L1 12 L3 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 9 L23 12 L21 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="gyro-prompt-text">
                <p className="gyro-prompt-title">Enhanced Experience</p>
                <p className="gyro-prompt-sub">
                  Allow motion access for an immersive depth parallax as you tilt your phone.
                </p>
              </div>
            </div>
            <div className="gyro-prompt-actions">
              <button className="gyro-btn-allow" onClick={handleAllow} type="button">
                Allow Motion
              </button>
              <button className="gyro-btn-skip" onClick={handleSkip} type="button">
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gyroscopic mode indicator */}
      {phase === 'granted' && indicatorVisible && (
        <div
          className="gyro-indicator"
          aria-label="Tilt mode active — gyroscopic parallax enabled"
          title="Tilt your phone for depth effects"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="18.5" r="1.3" fill="currentColor" />
            <path d="M3 9 L1 12 L3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 9 L23 12 L21 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="gyro-indicator-label">TILT</span>
          <span className="gyro-indicator-dot" />
        </div>
      )}
    </>
  )
}
