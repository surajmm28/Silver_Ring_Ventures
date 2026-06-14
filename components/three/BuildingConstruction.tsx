'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const STAGES = [
  { label: 'Empty Plot',      desc: 'Bare earth, staked and cleared — the canvas.' },
  { label: 'RCC Foundation',  desc: 'Reinforced concrete sunk deep. The anchor.' },
  { label: 'Ground Floor',    desc: 'Walls and columns rise from the plinth.' },
  { label: 'First Floor',     desc: 'Structure climbs. Form follows function.' },
  { label: 'Terrace & Roof',  desc: 'Complete. A duplex built to endure.' },
]

function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v }

// Group whose bottom face sits at y=0; scale.y 0→1 makes it grow upward.
function buildFloor(w: number, h: number, d: number, color: number): THREE.Group {
  const group = new THREE.Group()
  const geo = new THREE.BoxGeometry(w, h, d)
  geo.translate(0, h / 2, 0)
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.03 }))
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)
  const eGeo = new THREE.BoxGeometry(w + 0.05, h + 0.05, d + 0.05)
  eGeo.translate(0, h / 2, 0)
  group.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(eGeo),
    new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.3 })
  ))
  group.scale.y = 0
  return group
}

export default function BuildingConstruction() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const labelRef     = useRef<HTMLDivElement>(null)
  const descRef      = useRef<HTMLDivElement>(null)
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([])
  const progressRef  = useRef(0)
  const lastStage    = useRef(-1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas  = canvasRef.current
    if (!wrapper || !canvas) return

    // ── Renderer — pass false so Three.js doesn't override the CSS dimensions
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(12, 8, 12)
    camera.lookAt(0, 2.5, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const sun = new THREE.DirectionalLight(0xfff8ee, 1.8)
    sun.position.set(12, 22, 10)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.near   = 0.5
    sun.shadow.camera.far    = 60
    sun.shadow.camera.left   = -14
    sun.shadow.camera.right  = 14
    sun.shadow.camera.top    = 16
    sun.shadow.camera.bottom = -8
    scene.add(sun)
    const rim = new THREE.DirectionalLight(0xc4973d, 0.25)
    rim.position.set(-10, 5, -8)
    scene.add(rim)

    // Ground
    scene.add(Object.assign(
      new THREE.Mesh(
        new THREE.PlaneGeometry(32, 24),
        new THREE.MeshStandardMaterial({ color: 0x1a1a12, roughness: 0.98 })
      ),
      { rotation: new THREE.Euler(-Math.PI / 2, 0, 0), receiveShadow: true }
    ))

    // Plot boundary
    const corners: [number, number, number][] = [
      [-6, 0.01, -4], [6, 0.01, -4], [6, 0.01, 4], [-6, 0.01, 4], [-6, 0.01, -4],
    ]
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(corners.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
      new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.7 })
    ))
    for (const [x, , z] of corners.slice(0, 4)) {
      const stake = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8),
        new THREE.MeshBasicMaterial({ color: 0xc4973d })
      )
      stake.position.set(x, 0.25, z)
      scene.add(stake)
    }

    // Building
    const BW = 9.6, BD = 6.8, HF = 0.55, HG = 3.0, H1 = 3.0, H2 = 2.6, HR = 0.4

    const foundation = buildFloor(BW, HF, BD, 0x636058)
    scene.add(foundation)

    const gFloor = buildFloor(BW, HG, BD, 0x8c8a82)
    gFloor.position.y = HF
    scene.add(gFloor)

    const gDivGeo = new THREE.BoxGeometry(0.28, HG, BD + 0.1)
    gDivGeo.translate(0, HG / 2, 0)
    const gDiv = new THREE.Mesh(gDivGeo, new THREE.MeshStandardMaterial({ color: 0x706e68 }))
    gDiv.position.y = HF
    gDiv.scale.y = 0
    scene.add(gDiv)

    const floor1 = buildFloor(BW, H1, BD, 0xa0a098)
    floor1.position.y = HF + HG
    scene.add(floor1)

    const f1DivGeo = new THREE.BoxGeometry(0.28, H1, BD + 0.1)
    f1DivGeo.translate(0, H1 / 2, 0)
    const f1Div = new THREE.Mesh(f1DivGeo, new THREE.MeshStandardMaterial({ color: 0x807e78 }))
    f1Div.position.y = HF + HG
    f1Div.scale.y = 0
    scene.add(f1Div)

    const floor2 = buildFloor(BW, H2, BD, 0xb4b2aa)
    floor2.position.y = HF + HG + H1
    scene.add(floor2)

    const roof = buildFloor(BW + 0.8, HR, BD + 0.8, 0x4a4844)
    roof.position.y = HF + HG + H1 + H2
    scene.add(roof)

    // ── ScrollTrigger (gsap.context for scoped cleanup) ───────────────
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { progressRef.current = self.progress },
      })
    })

    // ── Stage indicator (DOM-direct) ──────────────────────────────────
    const setStage = (idx: number) => {
      if (idx === lastStage.current) return
      lastStage.current = idx
      if (labelRef.current) labelRef.current.textContent = STAGES[idx].label
      if (descRef.current)  descRef.current.textContent  = STAGES[idx].desc
      dotRefs.current.forEach((d, i) => {
        if (!d) return
        d.style.background = i <= idx ? 'var(--gold)' : 'rgba(196,151,61,0.22)'
        d.style.transform  = i === idx ? 'scale(1.6)' : 'scale(1)'
      })
    }

    // ── Animate ───────────────────────────────────────────────────────
    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const p = progressRef.current

      foundation.scale.y = clamp01((p - 0.12) / 0.18)

      const gfP = clamp01((p - 0.30) / 0.22)
      gFloor.scale.y = gfP
      gDiv.scale.y   = gfP

      const f1P = clamp01((p - 0.52) / 0.22)
      floor1.scale.y = f1P
      f1Div.scale.y  = f1P

      floor2.scale.y = clamp01((p - 0.74) / 0.16)
      roof.scale.y   = clamp01((p - 0.90) / 0.10)

      setStage(
        p < 0.12 ? 0 :
        p < 0.30 ? 1 :
        p < 0.52 ? 2 :
        p < 0.74 ? 3 : 4
      )

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      ctx.revert()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '380vh', position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        background: 'var(--black)',
        overflow: 'hidden',
      }}>
        {/* Canvas fills the sticky panel — no inset conflict with setSize */}
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Header */}
        <div style={{
          position: 'absolute',
          top: 48,
          left: 56,
          right: '50%',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(22px, 3vw, 44px)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--white)',
            lineHeight: 1,
          }}>
            FROM GROUND UP —{' '}
            <span style={{ color: 'var(--gold)' }}>[BUILT TO LAST.]</span>
          </div>
          <p style={{
            marginTop: 12,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.7,
          }}>
            Scroll to watch a duplex take shape — from bare earth to built legacy.
          </p>
        </div>

        {/* Stage label */}
        <div style={{ position: 'absolute', bottom: 56, left: 56, zIndex: 10, pointerEvents: 'none' }}>
          <div ref={labelRef} style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(18px, 2.2vw, 30px)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--gold)',
          }}>
            Empty Plot
          </div>
          <div ref={descRef} style={{
            marginTop: 6,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: 'var(--muted)',
            maxWidth: 280,
          }}>
            Bare earth, staked and cleared — the canvas.
          </div>
        </div>

        {/* Progress dots */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          right: 56,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'flex-end',
        }}>
          {STAGES.map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                opacity: 0.5,
              }}>
                {s.label}
              </span>
              <div
                ref={(el) => { dotRefs.current[i] = el }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--gold)' : 'rgba(196,151,61,0.22)',
                  transition: 'background 0.3s, transform 0.3s',
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
