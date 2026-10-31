import { useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  const heroRef = useRef(null)
  const dividerRef = useRef(null)

  const nameParts = (personalInfo.name || '').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Mahmadsami'
  const restName = nameParts.slice(1).join(' ') || 'Gothe'

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Animate divider scaling from left
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut', delay: 0.2 }
        )
      }

      // Animate fade-in elements
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
        }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      {/* Main two-column content */}
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 lg:gap-14">
        {/* LEFT COLUMN: Typography & Actions */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div data-hero="fade" className="mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold">
              {heroContent.eyebrow}
            </span>
          </div>

          {/* Heading with solid first word and outlined rest */}
          <h1 className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] flex flex-col my-3">
            <span className="text-bone">
              <ScrambleText text={firstName} trigger="mount" delay={200} />
            </span>
            <span className="text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
              <ScrambleText text={restName} trigger="mount" delay={500} />
            </span>
          </h1>

          {/* Divider line drawing from left */}
          <div
            ref={dividerRef}
            className="h-px w-full max-w-xl bg-bone/25 origin-left my-4"
          />

          {/* Role & Intro paragraph */}
          <div data-hero="fade" className="flex flex-col gap-3 max-w-xl mt-2 mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim font-medium">
              {personalInfo.role}
            </span>
            <p className="text-lg md:text-xl text-bone/85 font-normal leading-relaxed">
              {heroContent.intro}
            </p>
          </div>

          {/* Square-cornered CTA buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4">
            <a
              href={heroContent.ctaPrimary?.href || '#projects'}
              className="group flex items-center gap-3 bg-signal text-ink hover:bg-bone transition-all duration-200 font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 focus:outline-none"
            >
              <span>{heroContent.ctaPrimary?.label || 'View projects'}</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href={heroContent.ctaSecondary?.href || '#contact'}
              className="border border-bone/30 text-bone hover:border-signal hover:text-signal transition-all duration-200 font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 focus:outline-none"
            >
              {heroContent.ctaSecondary?.label || 'Get in touch'}
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Frame */}
        <div
          data-hero="fade"
          className="hud-frame border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh] relative flex items-center justify-center"
        >
          {/* Corner HUD labels */}
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
            core.view — drag to rotate
          </span>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none z-10">
            {personalInfo.city}
          </span>

          {/* Lazy Three.js Scene */}
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      </div>

      {/* Bottom technical strip */}
      <div
        data-hero="fade"
        className="w-full max-w-[1440px] mx-auto mt-10 border-t border-bone/10 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-dim flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal" aria-hidden="true" />
          <span className="text-bone/80">{personalInfo.availability}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-bone/60">
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  )
}
