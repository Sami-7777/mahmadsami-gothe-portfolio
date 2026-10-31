import { useState, useEffect } from 'react'
import { personalInfo, navLinks, heroContent } from '../data/portfolioData'

export default function Hud() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const [timeString, setTimeString] = useState('')

  // 1. Scroll listener for header background and border
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. Status line rotation every 3.5s
  useEffect(() => {
    const lines = heroContent.statusLines || []
    if (lines.length <= 1) return

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % lines.length)
    }, 3500)

    return () => clearInterval(statusInterval)
  }, [])

  // 3. Live 24-hour clock for user's IANA timezone
  useEffect(() => {
    const timeZone = personalInfo.timezone || 'Asia/Kolkata'
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const updateClock = () => {
      setTimeString(formatter.format(new Date()))
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)

    return () => clearInterval(clockInterval)
  }, [])

  // Derive brand initials
  const initials = (personalInfo.brandName || personalInfo.name || 'SG')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const currentStatus =
    heroContent.statusLines && heroContent.statusLines.length > 0
      ? heroContent.statusLines[statusIndex]
      : 'Active'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 h-full flex items-center justify-between">
        {/* Left: Brand & Initials */}
        <a
          href="#home"
          className="flex items-center gap-3 group focus:outline-none"
          aria-label={`${personalInfo.brandName} Home`}
        >
          <div className="w-8 h-8 flex items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-transform group-hover:scale-105">
            {initials}
          </div>
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.2em] text-bone group-hover:text-signal transition-colors">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre: Rotating status indicator (lg and up) */}
        <div
          className="hidden lg:flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim"
          aria-live="polite"
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal"></span>
          </span>
          <span className="truncate max-w-[340px]">{currentStatus}</span>
        </div>

        {/* Right (md and up): Nav links & live clock */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="h-3.5 w-px bg-bone/20" aria-hidden="true" />
          <span
            className="tabular-nums font-mono text-xs text-dim tracking-wider"
            title={`Timezone: ${personalInfo.timezone}`}
          >
            {timeString}
          </span>
        </div>

        {/* Mobile menu trigger (below md) */}
        <button
          type="button"
          className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-signal transition-colors px-2 py-1"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden absolute top-16 inset-x-0 bg-ink/95 backdrop-blur-xl border-b border-bone/10 px-6 py-6 transition-all duration-300"
        >
          <nav className="flex flex-col" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold text-bone hover:text-signal border-b border-bone/10 py-4 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-1.5 font-mono text-xs text-dim">
            <span className="uppercase tracking-widest text-bone/50 text-[10px]">Location</span>
            <span className="text-bone/80">{personalInfo.city}</span>
            <div className="mt-2 flex items-center justify-between text-bone/60">
              <span className="text-[10px] uppercase tracking-wider">{personalInfo.timezone}</span>
              <span className="tabular-nums font-semibold text-signal">{timeString}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
