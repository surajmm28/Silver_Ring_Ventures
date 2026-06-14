import type Lenis from 'lenis'

export function createLenisConfig(): ConstructorParameters<typeof Lenis>[0] {
  return {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  }
}
