'use client'

import { gsap } from './gsap'
import { ScrollTrigger } from './gsap'

// Module-level refs — avoids React context, safe for singleton pattern
let _panel: HTMLElement | null    = null
let _monogram: HTMLElement | null = null
let _isAnimating  = false
let _manualNav    = false  // true = TransitionLink triggered sweepIn already

// Durations in seconds — total in+out ≤ 0.72s for fast pages
const T_IN  = 0.32
const T_OUT = 0.38
const EASE  = 'cubic-bezier(0.76, 0, 0.24, 1)'  // smooth symmetrical s-curve

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
}

function resetScroll(): void {
  // Works with Lenis (Lenis overrides window.scroll but not scrollTop assignment)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** Called once by PageTransition on mount. */
export function registerPanel(
  panel: HTMLElement | null,
  monogram: HTMLElement | null
): void {
  _panel    = panel
  _monogram = monogram
  if (!panel) return
  // Park off-screen left, invisible to pointer events
  gsap.set(panel, { x: '-100%', autoAlpha: 1, pointerEvents: 'none' })
}

/**
 * Sweep the panel in from the left (desktop) / fade to black (mobile).
 * Called by TransitionLink BEFORE router.push().
 * Resolves when the panel fully covers the screen.
 */
export function sweepIn(): Promise<void> {
  if (!_panel) return Promise.resolve()
  _isAnimating = true
  _manualNav   = true

  return new Promise((resolve) => {
    const mobile = isMobile()
    const tl = gsap.timeline({ onComplete: resolve })

    gsap.set(_panel!, { pointerEvents: 'all' })

    if (mobile) {
      gsap.set(_panel!, { x: '0%', autoAlpha: 0 })
      tl.to(_panel!, { autoAlpha: 1, duration: T_IN, ease: 'power2.inOut' })
    } else {
      gsap.set(_panel!, { x: '-100%', autoAlpha: 1 })
      tl.to(_panel!, { x: '0%', duration: T_IN, ease: EASE })
    }

    // Monogram rises in during the tail of the sweep
    if (_monogram) {
      gsap.set(_monogram, { opacity: 0, y: 18, scale: 0.88 })
      tl.to(
        _monogram,
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' },
        `-=${T_IN * 0.35}`
      )
    }
  })
}

/**
 * Sweep the panel out to the right, revealing the new page.
 * Called by PageTransition after the pathname changes (manual nav path).
 */
export function sweepOut(): Promise<void> {
  if (!_panel) return Promise.resolve()

  return new Promise((resolve) => {
    const mobile = isMobile()
    const tl = gsap.timeline({
      onComplete: () => {
        if (_panel) gsap.set(_panel, { pointerEvents: 'none' })
        _isAnimating = false
        ScrollTrigger.refresh()
        resolve()
      },
    })

    // Monogram exits first
    if (_monogram) {
      tl.to(_monogram, { opacity: 0, y: -12, duration: 0.16, ease: 'power2.in' })
    }

    if (mobile) {
      tl.to(_panel!, { autoAlpha: 0, duration: T_OUT, ease: 'power2.inOut' }, '-=0.06')
    } else {
      tl.to(_panel!, { x: '100%', duration: T_OUT, ease: EASE }, '-=0.06')
    }
  })
}

/**
 * Back / forward browser navigation: the panel is parked off-screen,
 * so we run a quick full sweep-in → sweep-out cycle.
 * The new page is already rendered underneath — the panel just adds the visual ritual.
 */
export function quickTransition(): Promise<void> {
  if (!_panel || _isAnimating) return Promise.resolve()
  _isAnimating = true

  return new Promise((resolve) => {
    const mobile = isMobile()
    const tl = gsap.timeline({
      onComplete: () => {
        if (_panel) gsap.set(_panel, { pointerEvents: 'none' })
        _isAnimating = false
        ScrollTrigger.refresh()
        resolve()
      },
    })

    gsap.set(_panel!, { pointerEvents: 'all' })

    if (mobile) {
      gsap.set(_panel!, { x: '0%', autoAlpha: 0 })
      tl.to(_panel!, { autoAlpha: 1, duration: 0.20, ease: 'power2.in' })
      if (_monogram) {
        gsap.set(_monogram, { opacity: 0, scale: 0.88 })
        tl.to(_monogram, { opacity: 0.8, scale: 1, duration: 0.14, ease: 'power2.out' }, '-=0.1')
        tl.to(_monogram, { opacity: 0, duration: 0.12, ease: 'power2.in' }, '+=0.06')
      }
      tl.to(_panel!, { autoAlpha: 0, duration: 0.26, ease: 'power2.out' }, '-=0.06')
    } else {
      gsap.set(_panel!, { x: '-100%', autoAlpha: 1 })
      tl.to(_panel!, { x: '0%', duration: 0.22, ease: 'power3.in' })
      if (_monogram) {
        gsap.set(_monogram, { opacity: 0, y: 12, scale: 0.88 })
        tl.to(_monogram, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: 'power2.out' }, '-=0.06')
        tl.to(_monogram, { opacity: 0, y: -8, duration: 0.12, ease: 'power2.in' }, '+=0.08')
      }
      tl.to(_panel!, { x: '100%', duration: 0.26, ease: 'power3.out' }, '-=0.08')
    }
  })
}

export function isTransitioning(): boolean { return _isAnimating  }
export function wasManualNav():    boolean { return _manualNav     }
export function clearManualNav():  void    { _manualNav = false    }
