'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { createLenisConfig } from '@/lib/lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis(createLenisConfig())

    lenis.on('scroll', ScrollTrigger.update)

    // Store ref so we can remove it on cleanup — not doing this causes a new
    // ticker callback to accumulate on every navigation, calling a destroyed
    // Lenis instance and breaking subsequent page loads.
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
