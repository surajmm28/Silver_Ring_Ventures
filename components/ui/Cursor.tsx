'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.09)
      ringY = lerp(ringY, mouseY, 0.09)
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      rafId = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('mousemove', onMouseMove)

    // State management
    const onMouseDown = () => {
      ring.style.transform = 'translate(-50%, -50%) scale(0.8)'
    }
    const onMouseUp = () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1)'
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    const setBodyClass = (className: string | null) => {
      document.body.classList.remove(
        'cursor-hover-link',
        'cursor-hover-card',
        'cursor-hover-cta',
        'cursor-drag'
      )
      if (className) document.body.classList.add(className)

      if (ringTextRef.current) {
        ringTextRef.current.textContent =
          className === 'cursor-hover-card'
            ? 'VIEW'
            : className === 'cursor-drag'
            ? 'DRAG'
            : ''
      }
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="drag"]')) {
        setBodyClass('cursor-drag')
      } else if (target.closest('[data-cursor="card"]')) {
        setBodyClass('cursor-hover-card')
      } else if (target.closest('[data-cursor="cta"]')) {
        setBodyClass('cursor-hover-cta')
      } else if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]')
      ) {
        setBodyClass('cursor-hover-link')
      } else {
        setBodyClass(null)
      }
    }

    window.addEventListener('mouseover', handleOver)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [])

  return (
    <>
      <div
        id="cursor-dot"
        ref={dotRef}
        style={{ transition: 'transform 0.15s, opacity 0.2s' }}
      />
      <div
        id="cursor-ring"
        ref={ringRef}
        style={{ transition: 'width 0.3s cubic-bezier(0.19,1,0.22,1), height 0.3s cubic-bezier(0.19,1,0.22,1), border-color 0.3s, background 0.3s, transform 0.15s cubic-bezier(0.19,1,0.22,1)' }}
      >
        <span ref={ringTextRef} className="cursor-text" />
      </div>
    </>
  )
}
