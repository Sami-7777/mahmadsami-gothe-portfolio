import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Load all project cover assets dynamically
const projectImages = import.meta.glob('../assets/projects/*.(png|jpg|jpeg|webp|svg)', {
  eager: true,
  import: 'default',
})

function ProjectCard({ project }) {
  // Find matching image by project id
  const imgEntry = Object.entries(projectImages).find(([path]) =>
    path.includes(`/${project.id}.`)
  )
  const coverUrl = imgEntry ? imgEntry[1] : null

  return (
    <article
      data-cursor="hot"
      className="border border-bone/10 bg-panel/60 w-full md:w-[min(560px,42vw)] shrink-0 group transition-colors duration-300 flex flex-col"
    >
      {/* Top Cover Media Area */}
      <div className="aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink relative overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
        ) : (
          <div className="hud-grid w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-dim">
            <span>{project.id}</span>
          </div>
        )}

        {/* Number / Year Badge */}
        <span className="absolute top-0 left-0 z-10 bg-ink/80 backdrop-blur-sm border-r border-b border-bone/10 font-mono text-[10px] uppercase tracking-[0.25em] text-signal px-3 py-1.5 pointer-events-none select-none">
          {project.number} / {project.year}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone mb-3 group-hover:text-signal transition-colors">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-bone/70 leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-signal text-ink hover:bg-bone transition-all font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 focus:outline-none"
              >
                Live ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-bone/30 text-bone hover:border-signal hover:text-signal transition-all font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 focus:outline-none"
              >
                Code ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackRef.current
      const section = sectionRef.current
      const progress = progressRef.current
      if (!track || !section) return

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)
      const distance = getDistance()
      if (distance <= 0) return

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) {
              gsap.set(progress, { scaleX: self.progress })
            }
          },
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center"
    >
      {/* Header Row */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <ScrambleText
            text="02 / Selected work"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>

        <div className="hidden md:block font-mono text-xs uppercase tracking-[0.18em] text-dim">
          <span>{projects.length} projects · scroll →</span>
        </div>
      </div>

      {/* Track: stacked vertically on mobile, single pinned row on desktop */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row md:w-max gap-6 md:gap-8 px-5 md:px-10 will-change-transform"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Progress Line (desktop only) */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mt-8 hidden md:block">
        <div className="bg-bone/10 h-0.5 w-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-signal origin-left w-full scale-x-0"
          />
        </div>
      </div>
    </section>
  )
}
