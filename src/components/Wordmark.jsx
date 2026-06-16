// Brand lockup — the emblem + the "freed·ai·m" wordmark with the AI in red.
// `mark` shows the disc emblem; `size` controls the emblem px size.
export default function Wordmark({ showText = true, size = 28, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo-mark.svg"
        alt="freedaim"
        width={size}
        height={size}
        className="shrink-0"
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className="text-[1.05em] font-semibold tracking-tight text-bone">
          freed<span className="text-rust">ai</span>m
        </span>
      )}
    </span>
  )
}
