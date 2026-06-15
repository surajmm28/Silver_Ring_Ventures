'use client'

import { gsap } from './gsap'

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Stagger-in `.anim-word` spans inside a container. */
export function animateWords(
  container: Element | null,
  opts: { delay?: number; scrollTrigger?: object } = {}
) {
  if (!container || reduced()) return
  const els = container.querySelectorAll<Element>('.anim-word')
  if (!els.length) return
  return gsap.fromTo(
    els,
    { opacity: 0, y: 36, scale: 0.88 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.85,
      stagger: 0.07,
      ease: 'power4.out',
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scrollTrigger,
    }
  )
}

/** Stagger-in `.anim-line` div/spans inside a container (line-mask style). */
export function animateLines(
  container: Element | null,
  opts: { delay?: number; scrollTrigger?: object } = {}
) {
  if (!container || reduced()) return
  const els = container.querySelectorAll<Element>('.anim-line')
  if (!els.length) return
  return gsap.fromTo(
    els,
    { opacity: 0, y: 44 },
    {
      opacity: 1, y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power4.out',
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scrollTrigger,
    }
  )
}

/** Character-by-character stagger for `.anim-char` spans. */
export function animateChars(
  container: Element | null,
  opts: { delay?: number; scrollTrigger?: object } = {}
) {
  if (!container || reduced()) return
  const els = container.querySelectorAll<Element>('.anim-char')
  if (!els.length) return
  return gsap.fromTo(
    els,
    { opacity: 0, y: 28, scale: 0.82 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.65,
      stagger: 0.022,
      ease: 'power4.out',
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scrollTrigger,
    }
  )
}

/** Elegant reveal for image/3D/media containers. Pass scrollTrigger for scroll-driven, omit for page-load. */
export function animateMedia(
  el: Element | null,
  scrollTrigger?: object,
  opts: { delay?: number } = {}
) {
  if (!el || reduced()) return
  return gsap.fromTo(
    el,
    { opacity: 0, y: 56, scale: 0.94 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 1.4,
      ease: 'power3.out',
      delay: opts.delay ?? 0,
      scrollTrigger: scrollTrigger ?? undefined,
    }
  )
}
