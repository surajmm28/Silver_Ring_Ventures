'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Evenly distributed points on a sphere via the Fibonacci / golden-angle spiral
function fibonacciSphere(n: number, radius: number): Float32Array {
  const buf = new Float32Array(n * 3)
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y     = 1 - (i / (n - 1)) * 2
    const r     = Math.sqrt(1 - y * y)
    const theta = phi * i
    buf[i * 3]     = Math.cos(theta) * r * radius
    buf[i * 3 + 1] = y * radius
    buf[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return buf
}

// ── Shaders (GLSL1 syntax — Three.js ShaderMaterial auto-provides builtins) ──

const VERT = /* glsl */`
  uniform float uDPR;
  uniform vec2  uMouseNDC;    // cursor in WebGL NDC space (-1..1)
  uniform float uMouseActive; // 0 = no hover, 1 = hovering

  varying float vFacing;
  varying float vHighlight;

  void main() {
    // World-space outward normal: tells us how directly this dot faces the camera
    vec3 wNorm  = normalize((modelMatrix * vec4(normalize(position), 0.0)).xyz);
    vFacing     = clamp(wNorm.z * 0.5 + 0.5, 0.0, 1.0);

    vec4 mv     = modelViewMatrix * vec4(position, 1.0);
    vec4 clip   = projectionMatrix * mv;

    // Screen-space distance between this dot and the cursor
    vec2  ndc   = clip.xy / clip.w;
    float dist  = length(ndc - uMouseNDC);
    // Only front-facing dots glow; smoothstep creates a soft radius of ~0.22 NDC units
    vHighlight  = vFacing * smoothstep(0.22, 0.0, dist) * uMouseActive;

    // Front dots bigger, back dots smaller; cursor-near dots get an extra boost
    gl_PointSize = (mix(1.2, 4.8, vFacing) + vHighlight * 5.0) * uDPR;
    gl_Position  = clip;
  }
`

const FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uMaxAlpha;

  varying float vFacing;
  varying float vHighlight;

  void main() {
    // Circular dot — discard square corners
    float d      = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float circle = 1.0 - smoothstep(0.38, 0.5, d);
    // Highlighted dots are fully opaque; back dots are nearly invisible
    float alpha  = min(1.0, mix(0.04, uMaxAlpha, vFacing) + vHighlight * 0.6) * circle;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export default function EcosystemSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Device detection ──────────────────────────────────────────────
    const isMobile  = window.innerWidth < 768
    const hasTouch  = 'ontouchstart' in window
    const outerN    = isMobile ? 520  : 900
    const innerN    = isMobile ? 150  : 260
    const cloudN    = isMobile ? 60   : 110

    // ── Renderer ──────────────────────────────────────────────────────
    const dpr      = Math.min(window.devicePixelRatio, 2)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 7.5

    // ── Shared mouse uniforms (both layers reference the same objects) ─
    // Updating .value here updates both materials simultaneously.
    const uMouseNDC    = { value: new THREE.Vector2(99, 99) } // 99 = off-screen
    const uMouseActive = { value: 0.0 }

    const makeLayer = (n: number, radius: number, maxAlpha: number): THREE.Points => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(fibonacciSphere(n, radius), 3))
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor:       { value: new THREE.Color(0xc4973d) },
          uDPR:         { value: dpr },
          uMaxAlpha:    { value: maxAlpha },
          uMouseNDC,
          uMouseActive,
        },
        vertexShader:   VERT,
        fragmentShader: FRAG,
        transparent:    true,
        depthWrite:     false,
        blending:       THREE.AdditiveBlending,
      })
      return new THREE.Points(geo, mat)
    }

    const pivot = new THREE.Group()
    scene.add(pivot)
    const outer = makeLayer(outerN, 2.0, 0.92)
    const inner = makeLayer(innerN, 1.3, 0.28)
    pivot.add(outer)
    pivot.add(inner)

    // ── Ambient floating cloud ────────────────────────────────────────
    const cloudBuf = new Float32Array(cloudN * 3)
    for (let i = 0; i < cloudN; i++) {
      const r     = 2.5 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      cloudBuf[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      cloudBuf[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      cloudBuf[i * 3 + 2] = r * Math.cos(phi)
    }
    const cloudGeo = new THREE.BufferGeometry()
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudBuf, 3))
    const cloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({
      color: 0xc4973d, size: 0.022,
      transparent: true, opacity: 0.22,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    scene.add(cloud)

    // ── Rotation state ────────────────────────────────────────────────
    // baseAngle: always-incrementing auto-rotation Y
    // hoverTiltX/Y: additional lean when hovering
    // dragX/Y: extra rotation applied via drag
    let baseAngle  = 0
    let hoverTiltX = 0, hoverAddY = 0    // hover offsets (ease toward mouse)
    let dragRotX   = 0                    // drag-applied X tilt
    let velX       = 0, velY = 0          // drag inertia
    let isDragging = false
    let isHovering = false
    let prevX = 0, prevY = 0
    // CSS-space cursor position (0–1 each axis)
    let mouseCSSX = 0.5, mouseCSSY = 0.5

    if (!hasTouch) canvas.style.cursor = 'grab'

    // ── Mouse events ──────────────────────────────────────────────────
    const onMouseEnter = () => {
      isHovering = true
      uMouseActive.value = 1
      if (!hasTouch) canvas.style.cursor = 'grab'
    }
    const onMouseLeave = () => {
      isHovering = false
      isDragging = false
      uMouseActive.value = 0
      uMouseNDC.value.set(99, 99)
      if (!hasTouch) canvas.style.cursor = 'default'
    }
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseCSSX = (e.clientX - rect.left) / rect.width
      mouseCSSY = (e.clientY - rect.top)  / rect.height

      // Convert to WebGL NDC for the highlight shader
      uMouseNDC.value.set(
        mouseCSSX * 2 - 1,
        -(mouseCSSY * 2 - 1)   // flip Y: CSS top=0 → NDC top=+1
      )

      if (isDragging) {
        velY = (e.clientX - prevX) * 0.006
        velX = (e.clientY - prevY) * 0.006
        dragRotX  = Math.max(-1.1, Math.min(1.1, dragRotX + velX))
        baseAngle += velY
        prevX = e.clientX; prevY = e.clientY
      }
    }
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevX = e.clientX; prevY = e.clientY
      velX = velY = 0
      if (!hasTouch) canvas.style.cursor = 'grabbing'
    }
    const onMouseUp = () => {
      isDragging = false
      if (!hasTouch) canvas.style.cursor = isHovering ? 'grab' : 'default'
    }

    canvas.addEventListener('mouseenter', onMouseEnter)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mouseup',    onMouseUp)

    // ── Touch events (drag only — no hover on touch) ──────────────────
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      prevX = t.clientX; prevY = t.clientY
      isDragging = true; velX = velY = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return
      e.preventDefault()
      const t = e.touches[0]
      velY = (t.clientX - prevX) * 0.006
      velX = (t.clientY - prevY) * 0.006
      dragRotX   = Math.max(-1.1, Math.min(1.1, dragRotX + velX))
      baseAngle += velY
      prevX = t.clientX; prevY = t.clientY
    }
    const onTouchEnd = () => { isDragging = false }

    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false })
    canvas.addEventListener('touchend',   onTouchEnd)

    // ── Animate ───────────────────────────────────────────────────────
    let rafId: number
    let lastTs  = performance.now()
    let stopped = false

    const animate = () => {
      if (stopped) return
      rafId = requestAnimationFrame(animate)
      try {
        const now = performance.now()
        const dt  = Math.min((now - lastTs) * 0.001, 0.05)
        lastTs = now

        if (isDragging) {
          // Friction while dragging so inertia is fresh on release
          velX *= 0.6; velY *= 0.6
        } else {
          // Inertia after drag release
          baseAngle += velY; velY *= 0.94
          dragRotX  += velX; velX *= 0.94
          // Auto Y rotation (slows while hovering for a focus feel)
          baseAngle += dt * (isHovering ? 0.025 : 0.08)
          // X drifts back to 0 when not dragging
          dragRotX  *= 0.97
        }

        // Hover tilt: sphere leans toward the cursor position
        if (isHovering && !isDragging) {
          const targetX =  (mouseCSSY - 0.5) * 0.7  // up/down lean
          const targetY = -(mouseCSSX - 0.5) * 0.6  // left/right lean (offset from base)
          hoverTiltX += (targetX - hoverTiltX) * 0.055
          hoverAddY  += (targetY - hoverAddY)  * 0.055
        } else {
          // Ease hover offsets back to neutral
          hoverTiltX *= 0.93
          hoverAddY  *= 0.93
        }

        pivot.rotation.x = Math.max(-1.1, Math.min(1.1, dragRotX + hoverTiltX))
        pivot.rotation.y = baseAngle + hoverAddY
        inner.rotation.y = -baseAngle * 0.38  // counter-drift for parallax depth

        cloud.rotation.y += dt * 0.015
        cloud.rotation.x += dt * 0.007

        renderer.render(scene, camera)
      } catch {
        stopped = true
      }
    }
    animate()

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mouseenter', onMouseEnter)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mouseup',    onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove',  onTouchMove)
      canvas.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('resize', onResize)
      try { renderer.dispose() } catch { /* ignore */ }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
    />
  )
}
