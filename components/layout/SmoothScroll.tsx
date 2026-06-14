'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from '@/lib/gsap'
import { createLenisConfig } from '@/lib/lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis(createLenisConfig())

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
