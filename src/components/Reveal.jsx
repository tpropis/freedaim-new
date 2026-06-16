import { useEffect, useState } from 'react'

// Reveal — a calm fade + rise on mount. Replaces the glitch-scramble effect.
// Re-keyed elements (e.g. scroll-switched labels) re-mount and re-animate.
export default function Reveal({
  as: Tag = 'span',
  className = '',
  style,
  delay = 0,
  children,
  ...rest
}) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <Tag
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
