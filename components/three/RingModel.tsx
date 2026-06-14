'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function RingModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 5

    // Outer ring
    const outerGeo = new THREE.TorusGeometry(1.4, 0.018, 16, 100)
    const outerEdges = new THREE.EdgesGeometry(outerGeo)
    const outerMat = new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.75 })
    const outerRing = new THREE.LineSegments(outerEdges, outerMat)
    scene.add(outerRing)

    // Inner ring
    const innerGeo = new THREE.TorusGeometry(1.0, 0.010, 16, 100)
    const innerEdges = new THREE.EdgesGeometry(innerGeo)
    const innerMat = new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.45 })
    const innerRing = new THREE.LineSegments(innerEdges, innerMat)
    scene.add(innerRing)

    // Particle orbit ring
    const orbitCount = 60
    const orbitPositions = new Float32Array(orbitCount * 3)
    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2
      const r = 1.6
      orbitPositions[i * 3] = r * Math.cos(angle)
      orbitPositions[i * 3 + 1] = r * Math.sin(angle)
      orbitPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2
    }
    const orbitGeo = new THREE.BufferGeometry()
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3))
    const orbitMat = new THREE.PointsMaterial({ color: 0xc4973d, size: 0.028, transparent: true, opacity: 0.6 })
    const orbitPoints = new THREE.Points(orbitGeo, orbitMat)
    scene.add(orbitPoints)

    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let rafId: number
    const timer = new THREE.Timer()

    const animate = (timestamp: number = 0) => {
      rafId = requestAnimationFrame(animate)
      timer.update(timestamp)
      const elapsed = timer.getElapsed()

      outerRing.rotation.z = elapsed * 0.2
      outerRing.rotation.x = elapsed * 0.05 + mouseY * 0.15
      outerRing.rotation.y = mouseX * 0.15

      innerRing.rotation.z = -elapsed * 0.35
      innerRing.rotation.x = -elapsed * 0.08 + mouseY * 0.1
      innerRing.rotation.y = -mouseX * 0.1

      orbitPoints.rotation.z = elapsed * 0.15
      orbitPoints.rotation.x = mouseY * 0.1
      orbitPoints.rotation.y = mouseX * 0.1

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      outerGeo.dispose()
      outerEdges.dispose()
      innerGeo.dispose()
      innerEdges.dispose()
      orbitGeo.dispose()
      orbitMat.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', minHeight: 400 }}
    />
  )
}
