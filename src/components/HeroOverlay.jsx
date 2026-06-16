import { useStore } from '../lib/store.js'
import GlitchText from './GlitchText.jsx'

// Hero DOM overlay — tagline resolves via GlitchText on load (not on scroll),
// plus a minimal scroll-down indicator. Lives in the document so the type stays
// crisp and the hero reads as interactive before WebGL finishes booting.
export default function HeroOverlay() {
  const reducedMotion = useStore((s) => s.reducedMotion)

  return (
    <div className="pointer-events-none relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-6 font-mono text-xs uppercase tracking-ultra text-rust md:text-sm">
        ★ Strategy · Brand · AI Systems
      </p>

      <h1 className="font-display text-[clamp(2.6rem,9vw,8rem)] uppercase leading-[0.86] text-bone">
        <GlitchText
          as="span"
          className="block"
          text="Turn Ideas"
          autoStart
          reducedMotion={reducedMotion}
          speed={1.2}
        />
        <GlitchText
          as="span"
          className="block text-bone/90"
          text="Into Reality"
          autoStart
          reducedMotion={reducedMotion}
          speed={0.9}
        />
      </h1>

      <p className="mt-8 max-w-md font-body text-base leading-relaxed text-bone/60 md:text-lg">
        An American studio building brands, websites and AI infrastructure for
        founders who move first.
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollLine_1.8s_ease-in-out_infinite] bg-rust" />
        </span>
      </div>
    </div>
  )
}
