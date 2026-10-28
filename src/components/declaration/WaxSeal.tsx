// The freedaim mark pressed into red sealing wax.
export default function WaxSeal({ size = 132, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="fd-wax" cx="38%" cy="32%">
          <stop offset="0" stopColor="#D2404A" />
          <stop offset=".7" stopColor="#A11D27" />
          <stop offset="1" stopColor="#7C121B" />
        </radialGradient>
        <filter id="fd-wax-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#5A0D13" floodOpacity=".35" />
        </filter>
      </defs>
      <path
        filter="url(#fd-wax-shadow)"
        d="M70 4c10 2 14 9 24 10s16 8 18 18 9 15 8 25 5 17 0 26-2 18-11 23-12 13-23 14-17 7-27 3-19-1-25-9-15-10-17-20-9-14-6-24-4-19 3-26 7-17 16-21S60 2 70 4z"
        fill="url(#fd-wax)"
      />
      <circle cx="70" cy="70" r="42" fill="none" stroke="#7C121B" strokeWidth="2" opacity=".7" />
      <circle cx="70" cy="70" r="38" fill="none" stroke="#E86A72" strokeWidth="1" opacity=".5" />
      <g transform="translate(36 34) scale(.6)" opacity=".92">
        <path d="M8.52,114.54 L69.82,61.96 L62.18,54.04 L7.48,113.46Z" fill="#F6D9D2" />
        <path d="M22.35,116.36 L74.77,70.89 L69.23,65.11 L21.65,115.64Z" fill="#F0B9B9" />
        <path d="M85.56,10.49L89.35,32.97L111.69,37.55L91.48,48.1L94.03,70.76L77.74,54.8L56.98,64.23L67.13,43.81L51.75,26.98L74.3,30.32Z" fill="#FBE7E2" />
      </g>
    </svg>
  );
}
