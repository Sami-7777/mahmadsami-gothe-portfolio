import { useState, useRef } from 'react'
import { personalInfo, socialLinks, contactContent, emailjsConfig } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'

  const firstName = (personalInfo.name || '').trim().split(/\s+/)[0]?.toLowerCase() || 'user'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    const form = formRef.current
    if (!form) return

    const formData = new FormData(form)
    const name = formData.get('user_name') || ''
    const email = formData.get('user_email') || ''
    const message = formData.get('message') || ''

    const { serviceId, templateId, publicKey } = emailjsConfig
    const isConfigured =
      serviceId &&
      serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      templateId &&
      templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      publicKey &&
      publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'

    if (!isConfigured) {
      // Direct mailto fallback when EmailJS keys are not provided
      const subject = encodeURIComponent('Portfolio contact')
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`
      window.open(mailtoUrl, '_blank')
      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 4000)
      return
    }

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.sendForm(serviceId, templateId, form, publicKey)
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    } finally {
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  // Filter non-empty social entries
  const activeSocials = Object.entries(socialLinks || {}).filter(([, url]) => Boolean(url))

  return (
    <section
      id="contact"
      className="hud-grid px-5 md:px-10 py-28 md:py-40"
    >
      <div className="grid max-w-[1440px] mx-auto grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* LEFT COLUMN: Headings & Direct Contact info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <ScrambleText
              text={contactContent.label || '04 / Contact'}
              className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
            />
          </div>

          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone mb-6">
            {contactContent.heading}
          </h2>

          <p className="text-lg text-bone/70 max-w-md leading-relaxed mb-10">
            {contactContent.note}
          </p>

          {/* Mailto link with signal underline */}
          <div className="mb-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-mono text-lg md:text-2xl text-bone hover:text-signal underline decoration-signal decoration-2 underline-offset-8 transition-colors break-all"
            >
              {personalInfo.email}
            </a>
          </div>

          {/* Phone if available */}
          {personalInfo.phone && (
            <div className="mb-10">
              <span className="font-mono text-sm text-dim tracking-wider">
                {personalInfo.phone}
              </span>
            </div>
          )}

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 mt-4 pt-6 border-t border-bone/10">
              {activeSocials.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 hover:text-signal transition-colors"
                >
                  {platform} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Terminal HUD Form */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur-md p-6 md:p-10">
          {/* Terminal prompt bar */}
          <div className="font-mono text-xs text-dim mb-8 flex items-center gap-2 select-none">
            <span className="text-signal font-semibold">$</span>
            <span>new message --to {firstName}</span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name Field */}
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                &gt; name
              </span>
              <input
                type="text"
                name="user_name"
                required
                placeholder="Your full name"
                className="bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone font-mono text-sm py-2 px-0 focus:outline-none focus:ring-0 placeholder:text-dim/50 rounded-none transition-colors"
              />
            </label>

            {/* Email Field */}
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                &gt; email
              </span>
              <input
                type="email"
                name="user_email"
                required
                placeholder="you@example.com"
                className="bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone font-mono text-sm py-2 px-0 focus:outline-none focus:ring-0 placeholder:text-dim/50 rounded-none transition-colors"
              />
            </label>

            {/* Message Field */}
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                &gt; message
              </span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                className="bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone font-mono text-sm py-2 px-0 focus:outline-none focus:ring-0 placeholder:text-dim/50 rounded-none resize-none transition-colors"
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-signal text-ink hover:bg-bone transition-all font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 flex items-center justify-between mt-4 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none"
            >
              <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* Accessible Status Message */}
            {status !== 'idle' && (
              <p
                role="status"
                className={`font-mono text-xs mt-2 transition-opacity duration-300 ${
                  status === 'success'
                    ? 'text-emerald-400'
                    : status === 'error'
                      ? 'text-red-400'
                      : 'text-dim'
                }`}
              >
                {status === 'success' && '✓ Message sent. Talk soon.'}
                {status === 'error' && '✕ Something went wrong. Please try again.'}
                {status === 'sending' && 'Sending message…'}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
