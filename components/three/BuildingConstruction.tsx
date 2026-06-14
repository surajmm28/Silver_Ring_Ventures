'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const STAGES = [
  { label: 'Empty Plot', desc: 'Bare earth, staked and cleared — the canvas.' },
  { label: 'RCC Foundation', desc: 'Reinforced concrete sunk deep. The anchor.' },
  { label: 'Ground Floor', desc: 'Walls and columns rise from the plinth.' },
  { label: 'First Floor', desc: 'Structure climbs. Form follows function.' },
  { label: 'Terrace & Roof', desc: 'Complete. A duplex built to endure.' },
]

function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v }

// Returns a Group whose bottom face sits at y=0; scale.y 0→1 grows it upward.
function buildFloor(w: number, h: number, d: number, color: number) {
  const group = new THREE.Group()

  const geo = new THREE.BoxGeometry(w, h, d)
  geo.translate(0, h / 2, 0)
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0.02 }))
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)

  const eGeo = new THREE.BoxGeometry(w + 0.04, h + 0.04, d + 0.04)
  eGeo.translate(0, h / 2, 0)
  group.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(eGeo),
    new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.28 })
  ))

  group.scale.y = 0
  return group
}

export default function BuildingConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageLabelRef = useRef<HTMLDivElement>(null)
  const stageDescRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef(0)
  const lastStageRef = useRef(-1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    // ── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(14, 9, 14)
    camera.lookAt(0, 3, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55))

    const sun = new THREE.DirectionalLight(0xfff8ee, 1.6)
    sun.position.set(14, 24, 12)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 60
    sun.shadow.camera.left = -14
    sun.shadow.camera.right = 14
    sun.shadow.camera.top = 16
    sun.shadow.camera.bottom = -8
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0xc4973d, 0.18)
    fill.position.set(-10, 6, -8)
    scene.add(fill)

    // Ground plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 28),
      new THREE.MeshStandardMaterial({ color: 0x111108, roughness: 1 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Plot boundary
    const plotPts = [
      [-6.2, 0.01, -4.5], [6.2, 0.01, -4.5],
      [6.2, 0.01, 4.5], [-6.2, 0.01, 4.5],
      [-6.2, 0.01, -4.5],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z))
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(plotPts),
      new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.55 })
    ))

    // Corner stakes
    for (let i = 0; i < 4; i++) {
      const pt = plotPts[i]
      const stake = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.35, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xc4973d })
      )
      stake.position.set(pt.x, 0.18, pt.z)
      scene.add(stake)
    }

    // Building dimensions
    const BW = 10.0
    const BD = 7.0
    const HF = 0.55
    const HG = 3.0
    const H1 = 3.0
    const H2 = 2.6
    const HR = 0.38

    const foundation = buildFloor(BW, HF, BD, 0x5a5850)
    foundation.position.y = 0
    scene.add(foundation)

    const gFloor = buildFloor(BW, HG, BD, 0x8a8880)
    gFloor.position.y = HF
    scene.add(gFloor)

    // Center beam (ground floor) — grows in sync with gFloor
    const gDivGeo = new THREE.BoxGeometry(0.28, HG, BD + 0.1)
    gDivGeo.translate(0, HG / 2, 0)
    const gDiv = new THREE.Mesh(gDivGeo, new THREE.MeshStandardMaterial({ color: 0x6a6860 }))
    gDiv.position.y = HF
    gDiv.scale.y = 0
    scene.add(gDiv)

    const floor1 = buildFloor(BW, H1, BD, 0x9e9c94)
    floor1.position.y = HF + HG
    scene.add(floor1)

    const f1DivGeo = new THREE.BoxGeometry(0.28, H1, BD + 0.1)
    f1DivGeo.translate(0, H1 / 2, 0)
    const f1Div = new THREE.Mesh(f1DivGeo, new THREE.MeshStandardMaterial({ color: 0x7a7870 }))
    f1Div.position.y = HF + HG
    f1Div.scale.y = 0
    scene.add(f1Div)

    const floor2 = buildFloor(BW, H2, BD, 0xb2b0a8)
    floor2.position.y = HF + HG + H1
    scene.add(floor2)

    const roof = buildFloor(BW + 0.7, HR, BD + 0.7, 0x454440)
    roof.position.y = HF + HG + H1 + H2
    scene.add(roof)

    // ── ScrollTrigger via gsap.context for scoped cleanup ────────────
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { progressRef.current = self.progress },
      })
    })

    // ── Update stage indicator (DOM-direct, no React state) ──────────
    const updateStage = (idx: number) => {
      if (idx === lastStageRef.current) return
      lastStageRef.current = idx
      if (stageLabelRef.current) stageLabelRef.current.textContent = STAGES[idx].label
      if (stageDescRef.current) stageDescRef.current.textContent = STAGES[idx].desc
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return
        dot.style.background = i <= idx ? 'var(--gold)' : 'rgba(196,151,61,0.2)'
        dot.style.transform = i === idx ? 'scale(1.5)' : 'scale(1)'
      })
    }

    // ── RAF ──────────────────────────────────────────────────────────
    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const p = progressRef.current

      foundation.scale.y = clamp01((p - 0.12) / 0.18)

      const gfP = clamp01((p - 0.30) / 0.22)
      gFloor.scale.y = gfP
      gDiv.scale.y = gfP

      const f1P = clamp01((p - 0.52) / 0.22)
      floor1.scale.y = f1P
      f1Div.scale.y = f1P

      floor2.scale.y = clamp01((p - 0.74) / 0.16)
      roof.scale.y = clamp01((p - 0.90) / 0.10)

      const stageIdx =
        p < 0.12 ? 0 :
        p < 0.30 ? 1 :
        p < 0.52 ? 2 :
        p < 0.74 ? 3 : 4

      updateStage(stageIdx)
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      ctx.revert()    // kills the ScrollTrigger cleanly
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '420vh', position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        background: 'var(--black)',
        overflow: 'hidden',
      }}>
        {/* canvas fills the sticky panel */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Header overlay */}
        <div style={{
          position: 'absolute',
          top: 60,
          left: 60,
          right: '52%',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(24px, 3vw, 46px)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--white)',
            lineHeight: 1,
          }}>
            FROM GROUND UP —{' '}
            <span style={{ color: 'var(--gold)' }}>[BUILT TO LAST.]</span>
          </div>
          <div style={{
            marginTop: 14,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.7,
          }}>
            Scroll to watch a duplex take shape — from bare earth to built legacy.
          </div>
        </div>

        {/* Stage label — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: 60,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div
            ref={stageLabelRef}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.5vw, 32px)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--gold)',
            }}
          >
            Empty Plot
          </div>
          <div
            ref={stageDescRef}
            style={{
              marginTop: 6,
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: 13,
              color: 'var(--muted)',
              maxWidth: 300,
            }}
          >
            Bare earth, staked and cleared — the canvas.
          </div>
        </div>

        {/* Progress dots — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 64,
          right: 60,
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
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                opacity: 0.55,
              }}>
                {s.label}
              </span>
              <div
                ref={(el) => { dotRefs.current[i] = el }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--gold)' : 'rgba(196,151,61,0.2)',
                  transition: 'background 0.35s, transform 0.35s',
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
