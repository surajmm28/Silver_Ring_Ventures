'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GOLD = 0xc4973d

// Hub (Silverring Ventures) at center; four units at organic depths
const NODES: [number, number, number][] = [
  [ 0.0,  0.0,  0.0],   // 0 Silverring Ventures — hub
  [-2.5,  1.3,  0.6],   // 1 Citex
  [ 2.3,  1.6, -0.3],   // 2 Alkins Constructions
  [ 2.7, -0.9,  0.5],   // 3 Rhythmscape Media
  [-1.9, -1.9, -0.4],   // 4 Studio Nabi
]

const NODE_RADII = [0.20, 0.11, 0.11, 0.11, 0.11]

// Which pairs of nodes are connected
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], // hub spokes
  [1, 2], [3, 4], [2, 3],          // cross-links
]

const FLOW_PER_EDGE = 7   // flowing particles per edge
const FLOW_SPEED    = 0.2 // fraction of edge length per second

export default function EcosystemNet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 7.5

    // Everything lives inside a single pivot so mouse tilt is uniform
    const pivot = new THREE.Group()
    scene.add(pivot)

    // ── Node vectors ──────────────────────────────────────────────────
    const nodeVecs = NODES.map(([x, y, z]) => new THREE.Vector3(x, y, z))

    // ── Node spheres + glow ───────────────────────────────────────────
    const nodeMeshes: THREE.Mesh[] = []

    NODES.forEach(([x, y, z], i) => {
      const r = NODE_RADII[i]

      // Solid inner sphere
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 24, 24),
        new THREE.MeshBasicMaterial({ color: GOLD })
      )
      mesh.position.set(x, y, z)
      pivot.add(mesh)
      nodeMeshes.push(mesh)

      // Transparent glow shell — no rings, just a larger faint sphere
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(r * 2.2, 20, 20),
        new THREE.MeshBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: i === 0 ? 0.10 : 0.07,
          wireframe: false,
        })
      )
      glow.position.set(x, y, z)
      pivot.add(glow)
    })

    // ── Edges (thin gold lines) ───────────────────────────────────────
    EDGES.forEach(([a, b]) => {
      const pts = [nodeVecs[a], nodeVecs[b]]
      pivot.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.13 })
      ))
    })

    // ── Flowing particles along each edge ─────────────────────────────
    type FlowEdge = {
      buf: Float32Array
      geo: THREE.BufferGeometry
      phases: Float32Array
      from: THREE.Vector3
      to:   THREE.Vector3
    }
    const flowEdges: FlowEdge[] = []

    EDGES.forEach(([a, b]) => {
      const buf    = new Float32Array(FLOW_PER_EDGE * 3)
      const phases = new Float32Array(FLOW_PER_EDGE)
      for (let i = 0; i < FLOW_PER_EDGE; i++) phases[i] = i / FLOW_PER_EDGE

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(buf, 3))

      const pts = new THREE.Points(
        geo,
        new THREE.PointsMaterial({ color: GOLD, size: 0.042, transparent: true, opacity: 0.8 })
      )
      pivot.add(pts)
      flowEdges.push({ buf, geo, phases, from: nodeVecs[a], to: nodeVecs[b] })
    })

    // ── Ambient particle cloud (scattered, non-orbital) ───────────────
    const CLOUD_N = 160
    const cloudBuf = new Float32Array(CLOUD_N * 3)
    for (let i = 0; i < CLOUD_N; i++) {
      // Box distribution — very different from the disk distribution in RingModel/EcosystemOrb
      cloudBuf[i * 3]     = (Math.random() - 0.5) * 9
      cloudBuf[i * 3 + 1] = (Math.random() - 0.5) * 7
      cloudBuf[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    const cloudGeo = new THREE.BufferGeometry()
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudBuf, 3))
    const cloud = new THREE.Points(
      cloudGeo,
      new THREE.PointsMaterial({ color: GOLD, size: 0.016, transparent: true, opacity: 0.18 })
    )
    pivot.add(cloud)

    // ── Mouse interaction ─────────────────────────────────────────────
    let tiltX = 0, tiltY = 0
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      tiltY =  ((e.clientX - rect.left) / rect.width  - 0.5) * 0.55
      tiltX = -((e.clientY - rect.top)  / rect.height - 0.5) * 0.40
    }
    const onMouseLeave = () => { tiltX = 0; tiltY = 0 }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // ── Animate ───────────────────────────────────────────────────────
    let rafId: number
    let t = 0
    let lastTs = performance.now()
    let stopped = false

    const animate = () => {
      if (stopped) return
      rafId = requestAnimationFrame(animate)
      try {
        const now = performance.now()
        const dt  = Math.min((now - lastTs) * 0.001, 0.05)
        t    += dt
        lastTs = now

        // Ease pivot toward mouse tilt
        const ease = 1 - Math.exp(-6 * dt)
        pivot.rotation.x += (tiltX - pivot.rotation.x) * ease
        pivot.rotation.y += (tiltY - pivot.rotation.y) * ease
        // Slow ambient Y drift — gives the network a living feel
        pivot.rotation.y += dt * 0.055

        // Pulse node spheres
        nodeMeshes.forEach((m, i) => {
          const s = 1 + Math.sin(t * 1.6 + i * 1.45) * 0.12
          m.scale.setScalar(s)
        })

        // Advance flow particles along each edge
        flowEdges.forEach(({ buf, geo, phases, from, to }) => {
          for (let i = 0; i < FLOW_PER_EDGE; i++) {
            phases[i] = (phases[i] + dt * FLOW_SPEED) % 1
            const p = phases[i]
            buf[i * 3]     = from.x + (to.x - from.x) * p
            buf[i * 3 + 1] = from.y + (to.y - from.y) * p
            buf[i * 3 + 2] = from.z + (to.z - from.z) * p
          }
          geo.attributes.position.needsUpdate = true
        })

        // Slow cloud drift
        cloud.rotation.y = t * 0.018
        cloud.rotation.x = t * 0.009

        renderer.render(scene, camera)
      } catch {
        stopped = true
      }
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
      stopped = true
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      try { renderer.dispose() } catch { /* ignore */ }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
