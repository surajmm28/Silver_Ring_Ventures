'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

export default function Preloader() {
  const bgRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Only show on first visit per session
    if (sessionStorage.getItem('sr_visited')) {
      setDone(true)
      return
    }

    const bg = bgRef.current
    const logoWrap = logoWrapRef.current
    const shine = shineRef.current
    if (!bg || !logoWrap || !shine) return

    // Hide the real navbar logo — we hand off to it at the end
    const navLogo = document.getElementById('nav-logo')
    if (navLogo) gsap.set(navLogo, { opacity: 0 })

    const tl = gsap.timeline()

    // 1 — Logo rises and fades in
    tl.fromTo(logoWrap,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }
    )

    // 2 — Gold shimmer sweeps left → right (starts while logo is still arriving)
    tl.fromTo(shine,
      { left: '-90%' },
      { left: '150%', duration: 0.7, ease: 'power2.inOut' },
      '<0.25'
    )

    // 3 — Short hold so user registers the logo
    tl.to({}, { duration: 0.35 })

    // 4 — Logo flies to navbar; bg fades to reveal page independently
    tl.add(() => {
      if (!navLogo || !logoWrap) return

      const navRect = navLogo.getBoundingClientRect()
      const logoRect = logoWrap.getBoundingClientRect()

      const dx = (navRect.left + navRect.width / 2) - (logoRect.left + logoRect.width / 2)
      const dy = (navRect.top + navRect.height / 2) - (logoRect.top + logoRect.height / 2)
      const scale = navRect.width / logoRect.width

      // Logo flies to its navbar home
      gsap.to(logoWrap, {
        x: dx,
        y: dy,
        scale,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          // Handoff: real logo fades in as preloader logo disappears
          gsap.to(navLogo, { opacity: 1, duration: 0.25, ease: 'power2.out' })
          gsap.to(logoWrap, { opacity: 0, duration: 0.2, ease: 'power2.in' })
        },
      })

      // Black background fades out slightly after logo starts moving,
      // revealing the page beneath while the logo is still in flight
      gsap.to(bg, {
        opacity: 0,
        duration: 0.6,
        delay: 0.25,
        ease: 'power2.inOut',
      })
    })

    // 5 — Wait for all independent animations to finish, then remove from DOM
    tl.to({}, {
      duration: 1.4,
      onComplete: () => {
        if (navLogo) gsap.set(navLogo, { clearProps: 'opacity' })
        sessionStorage.setItem('sr_visited', '1')
        setDone(true)
      },
    })

    return () => {
      tl.kill()
      gsap.killTweensOf([bg, logoWrap, shine])
      if (navLogo) {
        gsap.killTweensOf(navLogo)
        gsap.set(navLogo, { clearProps: 'opacity' })
      }
    }
  }, [])

  if (done) return null

  return (
    <>
      {/* Black overlay — fades independently of the logo */}
      <div
        ref={bgRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--black)',
          zIndex: 9000,
        }}
      />

      {/* Logo — sits above bg as a sibling so opacity is not inherited */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={logoWrapRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            opacity: 0,
          }}
        >
          <Image
            src="/logo-white.png"
            alt="Silverring Ventures"
            width={320}
            height={107}
            priority
            style={{ objectFit: 'contain', width: 320, height: 'auto', display: 'block' }}
          />

          {/* Gold shimmer strip */}
          <div
            ref={shineRef}
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-90%',
              width: '45%',
              height: '120%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(196,151,61,0.12) 20%, rgba(255,252,230,0.7) 50%, rgba(196,151,61,0.12) 80%, transparent 100%)',
              pointerEvents: 'none',
              transform: 'skewX(-14deg)',
            }}
          />
        </div>
      </div>
    </>
  )
}
