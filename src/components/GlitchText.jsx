import { useEffect, useRef, useState } from 'react'

// GlitchText
// Scene-transition text reveal. Characters scramble through a glyph set and
// resolve left-to-right into the final string. Drives two modes:
//   - autoStart: plays once on mount (Hero tagline on load)
//   - play prop: parent toggles; resolves when true, re-scrambles when false
//     (scene labels tied to scroll progress)
//
// Pure DOM/RAF — no per-frame React state thrash; we write textContent directly.

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHJKLMNPQRSTUVWXYZ01'

export default function GlitchText({
  text,
  as: Tag = 'span',
  className = '',
  autoStart = false,
  play,
  speed = 1, // higher = faster resolve
  reducedMotion = false,
  onResolved,
  ...rest
}) {
  const elRef = useRef(null)
  const rafRef = useRef(0)
  const frameRef = useRef(0)
  const queueRef = useRef([])
  const resolvedRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const setText = (newText) => {
    const el = elRef.current
    if (!el) return Promise.resolve()

    // Reduced motion: snap, no scramble.
    if (reducedMotion) {
      el.textContent = newText
      resolvedRef.current = true
      onResolved && onResolved()
      return Promise.resolve()
    }

    const oldText = el.textContent || ''
    const length = Math.max(oldText.length, newText.length)
    const queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 12)
      const end = start + Math.floor(Math.random() * 12) + 6
      queue.push({ from, to, start, end, char: '' })
    }
    queueRef.current = queue
    frameRef.current = 0
    resolvedRef.current = false

    cancelAnimationFrame(rafRef.current)
    return new Promise((resolve) => {
      const update = () => {
        let complete = 0
        let out = ''
        const q = queueRef.current
        for (let i = 0; i < q.length; i++) {
          let { from, to, start, end, char } = q[i]
          if (frameRef.current >= end) {
            complete++
            out += to
          } else if (frameRef.current >= start) {
            if (!char || Math.random() < 0.28) {
              char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              q[i].char = char
            }
            out += `<span class="gt-scramble">${char}</span>`
          } else {
            out += from
          }
        }
        el.innerHTML = out
        if (complete === q.length) {
          el.textContent = newText
          resolvedRef.current = true
          onResolved && onResolved()
          resolve()
          return
        }
        frameRef.current += speed
        rafRef.current = requestAnimationFrame(update)
      }
      update()
    })
  }

  // autoStart on mount
  useEffect(() => {
    if (!mounted) return
    if (autoStart) setText(text)
    else if (play === undefined && !reducedMotion) {
      // static, fully resolved
      if (elRef.current) elRef.current.textContent = text
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // controlled play toggling
  useEffect(() => {
    if (!mounted || play === undefined) return
    if (play) setText(text)
    else if (elRef.current) {
      // re-scramble into emptiness when leaving
      if (reducedMotion) elRef.current.textContent = ''
      else setText(''.padEnd(0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, mounted])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <Tag
      ref={elRef}
      className={`gt ${className}`}
      data-text={text}
      aria-label={text}
      {...rest}
    >
      {/* SSR/first-paint content; replaced by RAF loop */}
      {play === undefined && !autoStart ? text : ''}
    </Tag>
  )
}
