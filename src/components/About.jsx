import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Load portrait dynamically with import.meta.glob
const portraitFiles = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
})
const portraitSrc = Object.values(portraitFiles)[0] || null

export default function About() {
  const sectionRef = useRef(null)
  const statsContainerRef = useRef(null)
  const statValRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // If reduced motion is requested, set values immediately and skip animations
    if (prefersReducedMotion) {
      aboutContent.stats?.forEach((stat, i) => {
        if (statValRefs.current[i]) {
          statValRefs.current[i].textContent = stat.value
        }
      })
      return
    }

    const ctx = gsap.context(() => {
      // 1. Reveal animation for text, portrait, and skill module elements
      gsap.fromTo(
        '[data-about="reveal"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )

      // 2. Count-up animation for stats numbers
      if (statsContainerRef.current && aboutContent.stats) {
        aboutContent.stats.forEach((stat, i) => {
          const el = statValRefs.current[i]
          if (!el) return

          const counter = { val: 0 }
          gsap.to(counter, {
            val: stat.value,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsContainerRef.current,
              start: 'top 85%',
              once: true,
            },
            onUpdate: () => {
              el.textContent = Math.round(counter.val)
            },
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section HUD label */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />
        </div>

        {/* Two-column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Portrait container with .hud-frame */}
          <div data-about="reveal" className="flex justify-center lg:justify-start">
            <div className="hud-frame aspect-[4/5] w-full max-w-[420px] border border-bone/10 bg-panel relative overflow-hidden group">
              {portraitSrc ? (
                <>
                  <img
                    src={portraitSrc}
                    alt="Mahmadsami Gothe — AI Engineer with Python Full Stack Developer, TAP Academy student"
                    className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Orange tint layer on top */}
                  <div
                    className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-dim p-4 text-center">
                  <span>PORTRAIT PLACEHOLDER</span>
                  <span className="text-[10px] mt-2 text-dim/60">src/assets/about/about-portrait.*</span>
                </div>
              )}

              {/* Bottom-left ID watermark */}
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/70 z-10 pointer-events-none select-none">
                ID · {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* RIGHT: Heading, Bio, Stats & Skill modules */}
          <div className="flex flex-col">
            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone mb-6"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph with natural TAP Academy mention */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl mb-10"
            >
              {aboutContent.paragraph}
            </p>

            {/* Stats list with count-up animation */}
            {aboutContent.stats && aboutContent.stats.length > 0 && (
              <dl
                ref={statsContainerRef}
                data-about="reveal"
                className="border-y border-bone/10 py-8 my-4 grid grid-cols-3 gap-4 md:gap-8"
              >
                {aboutContent.stats.map((stat, i) => (
                  <div key={stat.label} className="flex flex-col">
                    <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim order-2 mt-2">
                      {stat.label}
                    </dt>
                    <dd className="text-4xl md:text-6xl font-bold text-bone order-1 tracking-tight flex items-baseline">
                      <span
                        ref={(el) => {
                          statValRefs.current[i] = el
                        }}
                      >
                        0
                      </span>
                      {stat.suffix && <span className="text-signal ml-0.5">{stat.suffix}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Technical Skill modules grid */}
            {skillGroups && skillGroups.length > 0 && (
              <div
                data-about="reveal"
                className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10 mt-10"
              >
                {skillGroups.map((group, idx) => (
                  <div
                    key={group.title}
                    className="bg-ink p-6 hover:bg-panel transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                        {group.title}
                      </span>
                      <span className="font-mono text-[11px] text-dim">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/90 hover:border-signal/60 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
