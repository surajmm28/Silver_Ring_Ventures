'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GOLD = 0xc4973d

const UNITS = [
  'Silverring Ventures',
  'Citex',
  'Alkins Constructions',
  'Rhythmscape Media',
  'Studio Nabi',
]

export default function EcosystemOrb() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let W = mount.clientWidth
    let H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100)
    camera.position.z = 7.5

    // Root pivot so mouse tilt applies uniformly
    const pivot = new THREE.Group()
    scene.add(pivot)

    // ── Central hub ──────────────────────────────────────────
    const hubGeo = new THREE.SphereGeometry(0.28, 32, 32)
    const hubMat = new THREE.MeshBasicMaterial({ color: GOLD })
    const hub = new THREE.Mesh(hubGeo, hubMat)
    pivot.add(hub)

    const hubRingGeo = new THREE.TorusGeometry(0.48, 0.009, 16, 80)
    const hubRingMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 })
    const hubRing = new THREE.LineSegments(new THREE.EdgesGeometry(hubRingGeo), hubRingMat)
    pivot.add(hubRing)

    const hubRing2Geo = new THREE.TorusGeometry(0.65, 0.006, 16, 80)
    const hubRing2Mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.2 })
    const hubRing2 = new THREE.LineSegments(new THREE.EdgesGeometry(hubRing2Geo), hubRing2Mat)
    pivot.add(hubRing2)

    // ── Orbit circle ─────────────────────────────────────────
    const orbitGeo = new THREE.TorusGeometry(2.5, 0.006, 16, 120)
    const orbitMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.12 })
    const orbitRing = new THREE.LineSegments(new THREE.EdgesGeometry(orbitGeo), orbitMat)
    pivot.add(orbitRing)

    // ── 5 nodes in pentagon ───────────────────────────────────
    const R = 2.5
    const nodePositions: THREE.Vector3[] = []
    const nodeMeshes: THREE.Mesh[] = []
    const nodeScales = new Float32Array(5).fill(1)
    const haloMeshes: THREE.LineSegments[] = []

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(angle) * R
      const y = Math.sin(angle) * R
      nodePositions.push(new THREE.Vector3(x, y, 0))

      // Node sphere
      const nGeo = new THREE.SphereGeometry(0.15, 24, 24)
      const nMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(x, y, 0)
      pivot.add(nMesh)
      nodeMeshes.push(nMesh)

      // Node halo
      const hGeo = new THREE.TorusGeometry(0.25, 0.007, 12, 48)
      const hMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.35 })
      const hMesh = new THREE.LineSegments(new THREE.EdgesGeometry(hGeo), hMat)
      hMesh.position.set(x, y, 0)
      pivot.add(hMesh)
      haloMeshes.push(hMesh)
    }

    // Pentagon outline
    const pentagonPts = [...nodePositions, nodePositions[0]]
    const pentagonGeo = new THREE.BufferGeometry().setFromPoints(pentagonPts)
    const pentagonMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.18 })
    pivot.add(new THREE.Line(pentagonGeo, pentagonMat))

    // Spoke lines: center → each node (80% length)
    for (const pos of nodePositions) {
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        pos.clone().multiplyScalar(0.82),
      ])
      const spokeMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.15 })
      pivot.add(new THREE.Line(spokeGeo, spokeMat))
    }

    // ── Particle field ────────────────────────────────────────
    const pCount = 220
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.7 + Math.random() * 3.2
      pPos[i * 3] = Math.cos(a) * r
      pPos[i * 3 + 1] = Math.sin(a) * r
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.9
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: GOLD, size: 0.022, transparent: true, opacity: 0.28 })
    const particles = new THREE.Points(pGeo, pMat)
    pivot.add(particles)

    // ── Interaction ───────────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()
    let targetTiltX = 0
    let targetTiltY = 0
    let hoveredIdx = -1

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = -((e.clientY - rect.top) / rect.height - 0.5) * 2
      targetTiltY = nx * 0.4
      targetTiltX = ny * 0.4
      mouse2D.set(nx, ny)
      raycaster.setFromCamera(mouse2D, camera)
      const hits = raycaster.intersectObjects(nodeMeshes)
      hoveredIdx = hits.length > 0 ? nodeMeshes.indexOf(hits[0].object as THREE.Mesh) : -1
    }

    const onMouseLeave = () => {
      targetTiltX = 0
      targetTiltY = 0
      hoveredIdx = -1
    }

    mount.addEventListener('mousemove', onMouseMove)
    mount.addEventListener('mouseleave', onMouseLeave)

    // ── Animate ───────────────────────────────────────────────
    let rafId: number
    let t = 0
    let lastTs = performance.now()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - lastTs) * 0.001, 0.05)
      t += dt
      lastTs = now

      // Smooth tilt (exponential ease)
      const easeF = 1 - Math.exp(-8 * dt)
      pivot.rotation.x += (targetTiltX - pivot.rotation.x) * easeF
      pivot.rotation.y += (targetTiltY - pivot.rotation.y) * easeF

      // Hub pulse
      const pulse = 1 + Math.sin(t * 2.4) * 0.055
      hub.scale.setScalar(pulse)
      hubRing.rotation.z = t * 0.5
      hubRing2.rotation.z = -t * 0.3

      orbitRing.rotation.z = t * 0.09

      // Nodes: scale toward target
      for (let i = 0; i < 5; i++) {
        const targetScale = i === hoveredIdx
          ? 1.85
          : 1 + Math.sin(t * 1.6 + i * 1.26) * 0.07
        nodeScales[i] += (targetScale - nodeScales[i]) * easeF
        nodeMeshes[i].scale.setScalar(nodeScales[i])
        haloMeshes[i].scale.setScalar(nodeScales[i]);
        (nodeMeshes[i].material as THREE.MeshBasicMaterial).opacity =
          i === hoveredIdx ? 1 : 0.82
      }

      particles.rotation.z = t * 0.04

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
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%' }}>
      {/* HTML labels overlay — positioned via CSS */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'grid',
        placeItems: 'center',
      }}>
        {UNITS.map((name, i) => {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
          // Approximate 2D position (50% offset from center, in %)
          const pct = 38
          const lx = 50 + Math.cos(angle) * pct
          const ly = 50 - Math.sin(angle) * pct
          return (
            <div
              key={name}
              style={{
                position: 'absolute',
                left: `${lx}%`,
                top: `${ly}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                opacity: 0.75,
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
