import { personalInfo, socialLinks, navLinks, footerContent, academy } from '../data/portfolioData'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const activeSocials = Object.entries(socialLinks || {}).filter(([, url]) => Boolean(url))

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8 bg-ink">
      <div className="max-w-[1440px] mx-auto">
        {/* Three Columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Column 1: Navigate */}
          <div className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-4">
              Navigate
            </span>
            <nav className="flex flex-col gap-2.5" aria-label="Footer Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-bone/75 hover:text-signal transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Elsewhere */}
          <div className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-4">
              Elsewhere
            </span>
            <div className="flex flex-col gap-2.5">
              {activeSocials.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-bone/75 hover:text-signal transition-colors"
                >
                  {platform} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Say hello */}
          <div className="flex flex-col md:items-end md:text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-4">
              Say hello
            </span>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-sm text-bone/75 hover:text-signal transition-colors break-all mb-1"
            >
              {personalInfo.email}
            </a>
            <span className="font-mono text-xs text-dim tracking-wider">
              {personalInfo.city}
            </span>
          </div>
        </div>

        {/* Huge faint brand watermark */}
        <div
          aria-hidden="true"
          className="w-full overflow-hidden py-4 text-center select-none"
        >
          <span className="block text-[13.5vw] font-bold leading-none uppercase tracking-[-0.05em] whitespace-nowrap text-bone/[0.07]">
            {personalInfo.brandName || personalInfo.name}
          </span>
        </div>

        {/* Bottom row */}
        <div className="border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {currentYear} {personalInfo.name} · {footerContent.tagline}
          </div>
          <div>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone hover:text-signal underline decoration-signal/50 underline-offset-4 transition-colors"
            >
              {academy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
