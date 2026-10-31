import { useState, useEffect, useRef } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const [display, setDisplay] = useState(text)
  const containerRef = useRef(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    let timeoutId = null
    let intervalId = null
    let observer = null

    const play = () => {
      if (hasPlayedRef.current) return
      hasPlayedRef.current = true

      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        setDisplay(text)
        return
      }

      let frame = 0
      intervalId = setInterval(() => {
        frame++
        const lockedChars = Math.floor(frame / 2)

        if (lockedChars >= text.length) {
          setDisplay(text)
          clearInterval(intervalId)
          return
        }

        let scrambled = ''
        for (let i = 0; i < text.length; i++) {
          if (i < lockedChars) {
            scrambled += text[i]
          } else if (text[i] === ' ') {
            scrambled += ' '
          } else {
            scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
        }
        setDisplay(scrambled)
      }, speed)
    }

    if (trigger === 'mount') {
      timeoutId = setTimeout(play, delay)
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry && entry.isIntersecting) {
            if (observer) observer.disconnect()
            timeoutId = setTimeout(play, delay)
          }
        },
        { threshold: 0.4 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
      if (observer) observer.disconnect()
    }
  }, [text, delay, speed, trigger])

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}
