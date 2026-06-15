'use client'

export type GyroPoint = { x: number; y: number }
type Listener = (p: GyroPoint) => void

// Lerp factor — lower = buttery smooth but laggier
const LERP = 0.07

// Clamp angles (degrees → ±1 normalized range)
const GAMMA_MAX   = 26  // left/right tilt
const BETA_NEUTRAL = 50  // typical phone hold angle when reading screen
const BETA_MAX    = 22  // deviation from neutral → ±1

class GyroManager {
  private readonly _listeners = new Set<Listener>()
  private _rawX   = 0
  private _rawY   = 0
  private _smoothX = 0
  private _smoothY = 0
  private _rafId: number | null = null

  isActive  = false
  isGranted = false

  /** Subscribe to smoothed gyro data each frame. Returns unsubscribe fn. */
  subscribe(fn: Listener): () => void {
    this._listeners.add(fn)
    return () => this._listeners.delete(fn)
  }

  /** True on phones / tablets (touch device heuristic). */
  isMobile(): boolean {
    if (typeof navigator === 'undefined') return false
    return (
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || (navigator.maxTouchPoints > 1 && 'ontouchstart' in window)
    )
  }

  /** iOS 13+ requires an explicit user-gesture permission request. */
  needsExplicitPermission(): boolean {
    return (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    )
  }

  async requestPermission(): Promise<'granted' | 'denied'> {
    if (this.needsExplicitPermission()) {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission()
        return res === 'granted' ? 'granted' : 'denied'
      } catch {
        return 'denied'
      }
    }
    // Android / non-iOS — permission not required
    return 'granted'
  }

  start(): void {
    if (this.isActive || typeof window === 'undefined') return
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    this.isActive  = true
    this.isGranted = true
    window.addEventListener('deviceorientation', this._onOrientation, true)
    this._rafId = requestAnimationFrame(this._loop)
  }

  stop(): void {
    this.isActive = false
    if (typeof window !== 'undefined') {
      window.removeEventListener('deviceorientation', this._onOrientation, true)
    }
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }
  }

  private _onOrientation = (e: DeviceOrientationEvent): void => {
    const gamma = e.gamma ?? 0   // left/right: −90 to +90°
    const beta  = e.beta  ?? 0   // front/back: −180 to +180°
    this._rawX = Math.max(-1, Math.min(1, gamma / GAMMA_MAX))
    // Offset beta so neutral (phone held at ~50°) maps to 0
    this._rawY = Math.max(-1, Math.min(1, (beta - BETA_NEUTRAL) / BETA_MAX))
  }

  private _loop = (): void => {
    // Lerp toward raw target
    this._smoothX += (this._rawX - this._smoothX) * LERP
    this._smoothY += (this._rawY - this._smoothY) * LERP

    if (this._listeners.size > 0) {
      const p: GyroPoint = { x: this._smoothX, y: this._smoothY }
      this._listeners.forEach(fn => fn(p))
    }
    this._rafId = requestAnimationFrame(this._loop)
  }
}

// Singleton — shared across all component imports
export const gyro = new GyroManager()
