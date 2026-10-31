import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene, Camera & Renderer
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // 2. 3D Objects & Group
    const group = new THREE.Group()
    scene.add(group)

    // (1) Outer shell: Icosahedron wireframe in signal orange
    const outerGeo = new THREE.IcosahedronGeometry(1.9, 1)
    const outerEdges = new THREE.EdgesGeometry(outerGeo)
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: reducedMotion ? 0.9 : 0,
    })
    const outerShell = new THREE.LineSegments(outerEdges, outerMat)
    group.add(outerShell)

    // (2) Inner core: Point cloud in bone white
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 4)
    const innerMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    })
    const innerCore = new THREE.Points(innerGeo, innerMat)
    group.add(innerCore)

    // (3) Orbit ring: Tilted ellipse loop
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0)
    const ringPoints = curve.getPoints(128)
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints)
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    })
    const orbitRing = new THREE.LineLoop(ringGeo, ringMat)
    orbitRing.rotation.x = Math.PI / 2.4
    group.add(orbitRing)

    // Initial scale
    if (!reducedMotion) {
      group.scale.set(0.6, 0.6, 0.6)
    }

    // 3. Mouse Tilt & Drag Interaction
    let mouseTargetX = 0
    let mouseTargetY = 0
    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0
    let dragSpinX = 0
    let dragSpinY = 0
    let autoSpinY = 0
    let currentRotX = 0
    let currentRotY = 0

    const handlePointerMoveWindow = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      mouseTargetY = normX * 0.4
      mouseTargetX = normY * 0.25

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX
        const deltaY = e.clientY - prevPointerY
        dragSpinY += deltaX * 0.01
        dragSpinX += deltaY * 0.01
        prevPointerX = e.clientX
        prevPointerY = e.clientY
      }
    }

    const handlePointerDownCanvas = (e) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
    }

    const handlePointerUpWindow = () => {
      isDragging = false
    }

    const canvas = renderer.domElement
    canvas.addEventListener('pointerdown', handlePointerDownCanvas)
    window.addEventListener('pointermove', handlePointerMoveWindow, { passive: true })
    window.addEventListener('pointerup', handlePointerUpWindow)

    // 4. Resize Handling
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    }
    window.addEventListener('resize', handleResize)

    // 5. Off-screen Rendering Pause (IntersectionObserver)
    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // 6. Animation Loop
    let animId = null
    const clock = new THREE.Clock()
    const startTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()

      // Intro materialisation over 1 second
      if (!reducedMotion) {
        const introElapsed = (performance.now() - startTime) / 1000
        const progress = Math.min(introElapsed / 1.0, 1.0)
        // Cubic ease-out
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const scale = 0.6 + 0.4 * easeOut
        group.scale.set(scale, scale, scale)
        outerMat.opacity = 0.9 * easeOut

        // Auto spin
        autoSpinY += 0.0025
      }

      // Inner core reverse rotation
      innerCore.rotation.y = -elapsedTime * 0.15

      // Smooth rotation easing
      const targetY = mouseTargetY + autoSpinY + dragSpinY
      const targetX = mouseTargetX + dragSpinX
      currentRotY += (targetY - currentRotY) * 0.06
      currentRotX += (targetX - currentRotX) * 0.06
      group.rotation.y = currentRotY
      group.rotation.x = currentRotX

      renderer.render(scene, camera)
    }

    animate()

    // 7. Cleanup
    return () => {
      if (animId) cancelAnimationFrame(animId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMoveWindow)
      window.removeEventListener('pointerup', handlePointerUpWindow)
      canvas.removeEventListener('pointerdown', handlePointerDownCanvas)

      // Geometries
      outerGeo.dispose()
      outerEdges.dispose()
      innerGeo.dispose()
      ringGeo.dispose()

      // Materials
      outerMat.dispose()
      innerMat.dispose()
      ringMat.dispose()

      // Renderer
      renderer.dispose()
      renderer.forceContextLoss()
      if (canvas.parentNode === container) {
        container.removeChild(canvas)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  )
}
