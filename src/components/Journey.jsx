import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const fillLineRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      if (fillLineRef.current) {
        gsap.set(fillLineRef.current, { scaleY: 1 })
      }
      itemRefs.current.forEach((item) => {
        if (item) {
          item.classList.add('is-on')
          gsap.set(item, { opacity: 1, x: 0 })
        }
      })
      return
    }

    const ctx = gsap.context(() => {
      const list = listRef.current
      const fillLine = fillLineRef.current
      if (!list || !fillLine) return

      // 1. Scroll-driven timeline fill line
      gsap.fromTo(
        fillLine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      )

      // 2. Individual waypoint activation and entrance fade
      itemRefs.current.forEach((el) => {
        if (!el) return

        // Activation waypoint: node turns solid signal orange
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          onEnter: () => el.classList.add('is-on'),
          onLeaveBack: () => el.classList.remove('is-on'),
        })

        // Entrance fade from x: 30 (once)
        gsap.fromTo(
          el,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="px-5 md:px-10 py-28 md:py-40"
    >
      <div className="grid max-w-[1440px] mx-auto grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
        {/* LEFT: Sticky Heading */}
        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
          <ScrambleText
            text="03 / Journey"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I've been learning and building.
          </h2>
        </div>

        {/* RIGHT: Animated Timeline List */}
        <div className="relative">
          <ol
            ref={listRef}
            className="relative pl-10 flex flex-col gap-14 list-none"
          >
            {/* Base grey line */}
            <div
              className="absolute left-[7px] top-3 bottom-3 w-px bg-bone/15 pointer-events-none"
              aria-hidden="true"
            />

            {/* Signal orange fill line */}
            <div
              ref={fillLineRef}
              className="absolute left-[7px] top-3 bottom-3 w-px bg-signal origin-top scale-y-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Experience items */}
            {experience &&
              experience.map((item, idx) => (
                <li
                  key={item.period + item.role}
                  ref={(el) => {
                    itemRefs.current[idx] = el
                  }}
                  className="relative group transition-all duration-300 [&.is-on_.node]:bg-signal [&.is-on_.node]:scale-100"
                >
                  {/* Square waypoint node */}
                  <span
                    className="node absolute -left-10 top-1.5 w-[15px] h-[15px] border border-signal bg-ink scale-75 transition-all duration-300 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim mb-2 block">
                    {item.period}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-bone mb-1">
                    {item.role}
                  </h3>
                  <span className="font-mono text-sm text-signal mb-3 font-semibold block">
                    {item.org}
                  </span>
                  <p className="text-bone/70 leading-relaxed text-sm md:text-base max-w-xl">
                    {item.description}
                  </p>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
