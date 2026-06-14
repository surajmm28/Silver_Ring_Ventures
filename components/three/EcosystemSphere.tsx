'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Uniform distribution of points on a sphere via the Fibonacci / golden-angle spiral
function fibonacciSphere(n: number, radius: number): Float32Array {
  const buf = new Float32Array(n * 3)
  const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle ≈ 2.399 rad
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

// ── ShaderMaterial shaders (GLSL1 syntax) ────────────────────────────────────
// ShaderMaterial (NOT RawShaderMaterial) — Three.js automatically prepends all
// built-in uniforms (modelMatrix, modelViewMatrix, projectionMatrix, etc.) and
// handles the WebGL1/2 GLSL conversion. Do NOT declare those builtins here.

const VERT = /* glsl */`
  uniform float uDPR;
  varying float vFacing;

  void main() {
    // World-space outward normal → how directly this point faces the camera (+Z)
    vec3 wNorm   = normalize((modelMatrix * vec4(normalize(position), 0.0)).xyz);
    vFacing      = clamp(wNorm.z * 0.5 + 0.5, 0.0, 1.0);

    vec4 mv      = modelViewMatrix * vec4(position, 1.0);
    // Front dots are bigger; back dots are smaller — gives the sphere 3D depth
    gl_PointSize = mix(1.2, 4.8, vFacing) * uDPR;
    gl_Position  = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */`
  uniform vec3  uColor;
  uniform float uMaxAlpha;
  varying float vFacing;

  void main() {
    // Discard the square corners → circular dot
    float d      = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float circle = 1.0 - smoothstep(0.38, 0.5, d);
    float alpha  = mix(0.04, uMaxAlpha, vFacing) * circle;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function makeLayer(n: number, radius: number, maxAlpha: number, dpr: number): THREE.Points {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(fibonacciSphere(n, radius), 3))

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:    { value: new THREE.Color(0xc4973d) },
      uDPR:      { value: dpr },
      uMaxAlpha: { value: maxAlpha },
    },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
  })
  return new THREE.Points(geo, mat)
}

export default function EcosystemSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────────────
    const dpr      = Math.min(window.devicePixelRatio, 2)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 7.5

    // ── Sphere layers inside a single pivot ───────────────────────────
    const pivot = new THREE.Group()
    scene.add(pivot)

    // Outer shell: 900 dots at full brightness when facing camera
    const outer = makeLayer(900, 2.0, 0.92, dpr)
    // Inner core: 260 dimmer dots visible through the surface → depth
    const inner = makeLayer(260, 1.3, 0.28, dpr)
    pivot.add(outer)
    pivot.add(inner)

    // ── Floating cloud outside the pivot (moves independently) ────────
    const CLOUD_N  = 110
    const cloudBuf = new Float32Array(CLOUD_N * 3)
    for (let i = 0; i < CLOUD_N; i++) {
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

    // ── Mouse / touch drag ────────────────────────────────────────────
    let isDragging = false
    let prevX = 0, prevY = 0
    let velX  = 0, velY  = 0

    canvas.style.cursor = 'grab'

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevX = e.clientX; prevY = e.clientY
      velX = velY = 0
      canvas.style.cursor = 'grabbing'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      velY = (e.clientX - prevX) * 0.006
      velX = (e.clientY - prevY) * 0.006
      pivot.rotation.y += velY
      pivot.rotation.x  = Math.max(-1.1, Math.min(1.1, pivot.rotation.x + velX))
      prevX = e.clientX; prevY = e.clientY
    }
    const onMouseUp = () => { isDragging = false; canvas.style.cursor = 'grab' }

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
      pivot.rotation.y += velY
      pivot.rotation.x  = Math.max(-1.1, Math.min(1.1, pivot.rotation.x + velX))
      prevX = t.clientX; prevY = t.clientY
    }
    const onTouchEnd = () => { isDragging = false }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
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

        if (!isDragging) {
          velX *= 0.94; velY *= 0.94
          pivot.rotation.x  = Math.max(-1.1, Math.min(1.1, pivot.rotation.x + velX))
          pivot.rotation.y += velY + dt * 0.08
          // Inner core counter-drifts for a subtle parallax through the surface
          inner.rotation.y -= dt * 0.038
        }

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
    // Call once immediately in case dimensions settled after mount
    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
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
