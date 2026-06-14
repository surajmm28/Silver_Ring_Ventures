'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface BuildingFallbackProps {
  scrollContainer?: string
}

export default function BuildingFallback({ scrollContainer }: BuildingFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Low-end device fallback
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4

    // Scene setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isLowEnd,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 6)

    // Gold material
    const goldMat = new THREE.LineBasicMaterial({
      color: 0xc4973d,
      transparent: true,
      opacity: 0.7,
    })
    const goldMatDim = new THREE.LineBasicMaterial({
      color: 0xc4973d,
      transparent: true,
      opacity: 0.35,
    })

    const group = new THREE.Group()
    scene.add(group)

    // Main building volume
    const mainGeo = new THREE.BoxGeometry(2, 3.5, 1.5)
    const mainEdges = new THREE.EdgesGeometry(mainGeo)
    const mainLines = new THREE.LineSegments(mainEdges, goldMat)
    group.add(mainLines)

    // Floor plates
    const floorPositions = [0, 1.1, 2.2]
    floorPositions.forEach((y) => {
      const floorGeo = new THREE.BoxGeometry(2, 0.04, 1.5)
      const floorEdges = new THREE.EdgesGeometry(floorGeo)
      const floorLines = new THREE.LineSegments(
        floorEdges,
        new THREE.LineBasicMaterial({ color: 0xc4973d, transparent: true, opacity: 0.45 })
      )
      floorLines.position.y = y - 0.9
      group.add(floorLines)
    })

    // Window grid (4x3 on front facade)
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        const wGeo = new THREE.BoxGeometry(0.28, 0.32, 0.05)
        const wEdges = new THREE.EdgesGeometry(wGeo)
        const opacity = 0.3 + Math.random() * 0.35
        const wMat = new THREE.LineBasicMaterial({
          color: 0xc4973d,
          transparent: true,
          opacity,
        })
        const wLines = new THREE.LineSegments(wEdges, wMat)
        wLines.position.set(
          -0.65 + col * 0.43,
          -0.9 + row * 1.1,
          0.76
        )
        group.add(wLines)
      }
    }

    // Surrounding abstract structure lines
    const surroundPositions = [
      [-3, -0.5, -1],
      [3, 0.5, -1],
      [-2.5, 1.5, -0.5],
    ]
    surroundPositions.forEach(([x, y, z]) => {
      const sGeo = new THREE.BoxGeometry(0.8, 2, 0.8)
      const sEdges = new THREE.EdgesGeometry(sGeo)
      const sLines = new THREE.LineSegments(sEdges, goldMatDim)
      sLines.position.set(x, y, z)
      group.add(sLines)
    })

    // Particle field
    const particleCount = isLowEnd ? 30 : 80
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 2.5 + Math.random() * 2
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xc4973d,
      size: 0.03,
      transparent: true,
      opacity: 0.85,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0
    let targetRotY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // GSAP ScrollTrigger on hero sticky section
    const trigger = ScrollTrigger.create({
      trigger: scrollContainer || '#hero-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        // 0-30%: draw in (opacity build)
        const buildOpacity = Math.min(p / 0.3, 1)
        group.children.forEach((child) => {
          if (child instanceof THREE.LineSegments) {
            const mat = child.material as THREE.LineBasicMaterial
            mat.opacity = buildOpacity * (mat === goldMatDim ? 0.35 : 0.7)
          }
        })
        // 30-70%: normal
        // 70-90%: camera pull back
        if (p > 0.7) {
          const t = (p - 0.7) / 0.2
          camera.position.z = 6 + t * 3
        } else {
          camera.position.z = 6
        }
        // 90-100%: fade out
        if (p > 0.9) {
          const t = (p - 0.9) / 0.1
          group.children.forEach((child) => {
            if (child instanceof THREE.LineSegments) {
              const mat = child.material as THREE.LineBasicMaterial
              mat.opacity *= 1 - t
            }
          })
          particleMat.opacity = 0.85 * (1 - t)
          // scatter particles
          const pos = particleGeo.attributes.position as THREE.BufferAttribute
          for (let i = 0; i < particleCount; i++) {
            pos.setX(i, pos.getX(i) * (1 + t * 0.1))
            pos.setY(i, pos.getY(i) * (1 + t * 0.1))
          }
          pos.needsUpdate = true
        }
      },
    })

    const timer = new THREE.Timer()
    let rafId: number

    const animate = (timestamp: number = 0) => {
      rafId = requestAnimationFrame(animate)
      timer.update(timestamp)
      const delta = timer.getDelta()

      // Base rotation
      group.rotation.y += 0.003

      // Mouse parallax (max 5 degrees)
      targetRotX += (mouseY * 0.087 - targetRotX) * 0.05
      targetRotY += (mouseX * 0.087 - targetRotY) * 0.05
      group.rotation.x = targetRotX
      group.rotation.y += targetRotY * delta

      // Particle drift
      particles.rotation.y += 0.001

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
      trigger.kill()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mainGeo.dispose()
      mainEdges.dispose()
      particleGeo.dispose()
      particleMat.dispose()
    }
  }, [scrollContainer])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
