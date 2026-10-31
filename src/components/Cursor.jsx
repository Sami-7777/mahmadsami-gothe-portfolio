import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isFinePointer || prefersReducedMotion) {
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('has-cursor')

    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
    })

    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    const handlePointerMove = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      setRingX(e.clientX)
      setRingY(e.clientY)
    }

    const handlePointerOver = (e) => {
      const target = e.target
      if (
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('[data-cursor="hot"]'))
      ) {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: '#ff5b1f',
          duration: 0.2,
          overwrite: 'auto',
        })
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(232, 230, 223, 0.6)',
          duration: 0.2,
          overwrite: 'auto',
        })
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-signal pointer-events-none z-[999] opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-bone/60 pointer-events-none z-[999] opacity-0"
      />
    </>
  )
}
