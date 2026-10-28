// The freedaim mark, inline so its three parts can be animated individually.
// Geometry matches public/brand/logo-mark.svg exactly.
const TRAIL = "M8.52,114.54 L69.82,61.96 L62.18,54.04 L7.48,113.46Z";
const TRAIL_BLUE = "M22.35,116.36 L74.77,70.89 L69.23,65.11 L21.65,115.64Z";
const STAR =
  "M85.56,10.49L89.35,32.97L111.69,37.55L91.48,48.1L94.03,70.76L77.74,54.8L56.98,64.23L67.13,43.81L51.75,26.98L74.3,30.32Z";

export function Mark({
  size = 32,
  stripe = "#F2F4F8",
  className = "",
  title = "freedaim",
}: {
  size?: number;
  stripe?: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="4 8 112 112" width={size} height={size} className={className} role="img" aria-label={title}>
      <path className="mk-trail" d={TRAIL} fill={stripe} />
      <path className="mk-trail2" d={TRAIL_BLUE} fill="#4C8DFF" />
      <path className="mk-star" d={STAR} fill="#E5303E" />
    </svg>
  );
}

// Full lockup: mark + vector wordmark (the "ai" in red, a star for the i's dot).
export function Lockup({ height = 28, light = false, className = "" }: { height?: number; light?: boolean; className?: string }) {
  return (
    <img
      src={light ? "/brand/logo-lockup-light.svg" : "/brand/logo-lockup.svg"}
      alt="freedaim"
      style={{ height }}
      className={`w-auto ${className}`}
      draggable={false}
    />
  );
}

// Small red star used as a typographic separator.
export function StarGlyph({ size = 10, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} aria-hidden="true">
      <path d="M10 0l2.35 6.76 7.16.15-5.71 4.33 2.08 6.85L10 14.06l-5.88 4.03 2.08-6.85L.49 6.91l7.16-.15z" fill="#E5303E" />
    </svg>
  );
}
