'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GOLD = 0xc4973d

export default function EcosystemOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer (pass existing canvas element — no appendChild) ────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 7.5

    // Single pivot so mouse-tilt affects everything uniformly
    const pivot = new THREE.Group()
    scene.add(pivot)

    // ── Central hub ──────────────────────────────────────────────────
    const hubGeo = new THREE.SphereGeometry(0.28, 32, 32)
    const hubMat = new THREE.MeshBasicMaterial({ color: GOLD })
    const hub = new THREE.Mesh(hubGeo, hubMat)
    pivot.add(hub)

    const mkTorus = (r: number, tube: number, opacity: number) => {
      const geo = new THREE.TorusGeometry(r, tube, 16, 100)
      const mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity })
      return new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat)
    }
    const hubRing = mkTorus(0.48, 0.009, 0.5)
    pivot.add(hubRing)
    const hubRing2 = mkTorus(0.66, 0.006, 0.2)
    pivot.add(hubRing2)

    // ── Orbit ring ───────────────────────────────────────────────────
    const orbitRing = mkTorus(2.5, 0.006, 0.12)
    pivot.add(orbitRing)

    // ── 5 nodes (pentagon) ───────────────────────────────────────────
    const R = 2.5
    const nodePositions: THREE.Vector3[] = []
    const nodeMeshes: THREE.Mesh[] = []
    const haloMeshes: THREE.LineSegments[] = []
    const nodeScales = new Float32Array(5).fill(1)

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(angle) * R
      const y = Math.sin(angle) * R
      nodePositions.push(new THREE.Vector3(x, y, 0))

      const nGeo = new THREE.SphereGeometry(0.15, 24, 24)
      const nMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(x, y, 0)
      pivot.add(nMesh)
      nodeMeshes.push(nMesh)

      const halo = mkTorus(0.25, 0.007, 0.35)
      halo.position.set(x, y, 0)
      pivot.add(halo)
      haloMeshes.push(halo)
    }

    // Pentagon outline
    const pentagonGeo = new THREE.BufferGeometry().setFromPoints([...nodePositions, nodePositions[0]])
    pivot.add(new THREE.Line(pentagonGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.18 })))

    // Spokes: center → each node at 82%
    for (const pos of nodePositions) {
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        pos.clone().multiplyScalar(0.82),
      ])
      pivot.add(new THREE.Line(spokeGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.14 })))
    }

    // ── Particle field ────────────────────────────────────────────────
    const pCount = 220
    const pBuf = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.7 + Math.random() * 3.2
      pBuf[i * 3] = Math.cos(a) * r
      pBuf[i * 3 + 1] = Math.sin(a) * r
      pBuf[i * 3 + 2] = (Math.random() - 0.5) * 0.9
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pBuf, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: GOLD, size: 0.022, transparent: true, opacity: 0.28 }))
    pivot.add(particles)

    // ── Mouse interaction ─────────────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const mouse2D = new THREE.Vector2()
    let targetTiltX = 0
    let targetTiltY = 0
    let hoveredIdx = -1

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
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
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // ── Animate ───────────────────────────────────────────────────────
    let rafId: number
    let t = 0
    let lastTs = performance.now()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - lastTs) * 0.001, 0.05)
      t += dt
      lastTs = now

      const easeF = 1 - Math.exp(-8 * dt)
      pivot.rotation.x += (targetTiltX - pivot.rotation.x) * easeF
      pivot.rotation.y += (targetTiltY - pivot.rotation.y) * easeF

      const pulse = 1 + Math.sin(t * 2.4) * 0.055
      hub.scale.setScalar(pulse)
      hubRing.rotation.z = t * 0.5
      hubRing2.rotation.z = -t * 0.3
      orbitRing.rotation.z = t * 0.09

      for (let i = 0; i < 5; i++) {
        const target = i === hoveredIdx ? 1.85 : 1 + Math.sin(t * 1.6 + i * 1.26) * 0.07
        nodeScales[i] += (target - nodeScales[i]) * easeF
        nodeMeshes[i].scale.setScalar(nodeScales[i])
        haloMeshes[i].scale.setScalar(nodeScales[i]);
        (nodeMeshes[i].material as THREE.MeshBasicMaterial).opacity = i === hoveredIdx ? 1 : 0.82
      }

      particles.rotation.z = t * 0.04
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
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
