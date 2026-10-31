import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: -60 })
      }
    }

    document.addEventListener('click', handleAnchorClick)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 800)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('load', onLoad)
      clearTimeout(timer)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

export default useSmoothScroll
