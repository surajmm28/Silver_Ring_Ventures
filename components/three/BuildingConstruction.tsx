'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ScrollTrigger } from '@/lib/gsap'

// ── Stage metadata ─────────────────────────────────────────────────
const STAGES = [
  { label: 'Empty Plot', desc: 'Bare earth, staked and cleared — the canvas.' },
  { label: 'RCC Foundation', desc: 'Reinforced concrete sunk deep. The anchor.' },
  { label: 'Ground Floor', desc: 'Walls and columns rise from the plinth.' },
  { label: 'First Floor', desc: 'Structure climbs. Form follows function.' },
  { label: 'Terrace & Roof', desc: 'Complete. A duplex built to endure.' },
]

// Map scroll progress to each stage
const THRESHOLDS = [0, 0.12, 0.30, 0.52, 0.74, 1.01]

function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v }

// Create a floor element: geometry anchored at bottom face (y=0), scale-y from 0→1
function buildFloor(w: number, h: number, d: number, fillColor: number) {
  const group = new THREE.Group()

  const geo = new THREE.BoxGeometry(w, h, d)
  geo.translate(0, h / 2, 0)
  const mat = new THREE.MeshStandardMaterial({ color: fillColor, roughness: 0.88, metalness: 0.02 })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)

  // Gold edge outline
  const eGeo = new THREE.BoxGeometry(w + 0.04, h + 0.04, d + 0.04)
  eGeo.translate(0, h / 2, 0)
  const eMat = new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.28 })
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(eGeo), eMat))

  group.scale.y = 0
  return group
}

export default function BuildingConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const stageLabelRef = useRef<HTMLDivElement>(null)
  const stageDescRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef(0)
  const lastStageRef = useRef(-1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const mount = mountRef.current
    if (!wrapper || !mount) return

    let W = mount.clientWidth
    let H = mount.clientHeight

    // ── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100)
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

    // ── Ground ────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 28),
      new THREE.MeshStandardMaterial({ color: 0x111108, roughness: 1 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Plot boundary (gold dashed-style rectangle)
    const plotCorners = [
      [-6.2, 0.01, -4.5],
      [6.2, 0.01, -4.5],
      [6.2, 0.01, 4.5],
      [-6.2, 0.01, 4.5],
      [-6.2, 0.01, -4.5],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z))

    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(plotCorners),
      new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.55 })
    ))

    // Corner markers
    for (const pt of plotCorners.slice(0, 4)) {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.4, 0.12),
        new THREE.MeshBasicMaterial({ color: 0xc4973d })
      )
      marker.position.set(pt.x, 0.2, pt.z)
      scene.add(marker)
    }

    // ── Building dimensions ────────────────────────────────────
    const BW = 10.0    // total width (both units)
    const BD = 7.0     // depth
    const HF = 0.55    // foundation height
    const HG = 3.0     // ground floor height
    const H1 = 3.0     // 1st floor height
    const H2 = 2.6     // 2nd floor height
    const HR = 0.38    // roof slab thickness

    const C_FOUND = 0x5a5850
    const C_GFLOOR = 0x8a8880
    const C_1FLOOR = 0x9e9c94
    const C_2FLOOR = 0xb2b0a8
    const C_ROOF = 0x454440

    const foundation = buildFloor(BW, HF, BD, C_FOUND)
    foundation.position.y = 0
    scene.add(foundation)

    const gFloor = buildFloor(BW, HG, BD, C_GFLOOR)
    gFloor.position.y = HF
    scene.add(gFloor)

    // Center dividing beam (ground floor) — sits on top of floor, no overlap
    const gDiv = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, HG + 0.06, BD),
      new THREE.MeshStandardMaterial({ color: 0x6a6860 })
    )
    gDiv.geometry.translate(0, (HG + 0.06) / 2, 0)
    gDiv.position.y = HF
    gDiv.scale.y = 0
    scene.add(gDiv)

    const floor1 = buildFloor(BW, H1, BD, C_1FLOOR)
    floor1.position.y = HF + HG
    scene.add(floor1)

    const f1Div = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, H1 + 0.06, BD),
      new THREE.MeshStandardMaterial({ color: 0x7a7870 })
    )
    f1Div.geometry.translate(0, (H1 + 0.06) / 2, 0)
    f1Div.position.y = HF + HG
    f1Div.scale.y = 0
    scene.add(f1Div)

    const floor2 = buildFloor(BW, H2, BD, C_2FLOOR)
    floor2.position.y = HF + HG + H1
    scene.add(floor2)

    const roof = buildFloor(BW + 0.7, HR, BD + 0.7, C_ROOF)
    roof.position.y = HF + HG + H1 + H2
    scene.add(roof)

    // ── ScrollTrigger ─────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    // ── RAF ───────────────────────────────────────────────────
    let rafId: number

    const updateStageLabel = (idx: number) => {
      if (idx === lastStageRef.current) return
      lastStageRef.current = idx
      if (stageLabelRef.current) stageLabelRef.current.textContent = STAGES[idx].label
      if (stageDescRef.current) stageDescRef.current.textContent = STAGES[idx].desc
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return
        dot.style.background = i <= idx ? 'var(--gold)' : 'rgba(196,151,61,0.25)'
        dot.style.transform = i === idx ? 'scale(1.4)' : 'scale(1)'
      })
    }

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const p = progressRef.current

      // Foundation: progress 0.12 → 0.30
      foundation.scale.y = clamp01((p - 0.12) / 0.18)

      // Ground floor: 0.30 → 0.52
      const gfP = clamp01((p - 0.30) / 0.22)
      gFloor.scale.y = gfP
      gDiv.scale.y = gfP

      // 1st floor: 0.52 → 0.74
      const f1P = clamp01((p - 0.52) / 0.22)
      floor1.scale.y = f1P
      f1Div.scale.y = f1P

      // 2nd floor: 0.74 → 0.90
      floor2.scale.y = clamp01((p - 0.74) / 0.16)

      // Roof: 0.90 → 1.00
      roof.scale.y = clamp01((p - 0.90) / 0.10)

      // Stage label
      let stageIdx = 0
      for (let i = 1; i < THRESHOLDS.length - 1; i++) {
        if (p >= THRESHOLDS[i]) stageIdx = i
      }
      updateStageLabel(stageIdx)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      W = mount.clientWidth
      H = mount.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      st.kill()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    /* Outer wrapper provides scroll space — CSS sticky handles pin */
    <div ref={wrapperRef} style={{ height: '420vh', position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        background: 'var(--black)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          position: 'absolute',
          top: 60,
          left: 60,
          right: '50%',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(26px, 3.5vw, 48px)',
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

        {/* Three.js canvas */}
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

        {/* Stage info — bottom left */}
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
              fontSize: 'clamp(22px, 2.5vw, 34px)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--gold)',
              transition: 'opacity 0.3s',
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
              fontSize: 14,
              color: 'var(--muted)',
              maxWidth: 320,
              transition: 'opacity 0.3s',
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
                opacity: 0.6,
              }}>
                {s.label}
              </span>
              <div
                ref={(el) => { dotRefs.current[i] = el }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--gold)' : 'rgba(196,151,61,0.25)',
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
