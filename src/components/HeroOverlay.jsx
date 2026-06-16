import { useStore } from '../lib/store.js'
import { HERO } from '../lib/layout.js'
import GlitchText from './GlitchText.jsx'

// Hero DOM overlay — the real headline resolves via GlitchText on load (not on
// scroll), plus the two primary CTAs and a minimal scroll indicator. Lives in
// the document so type stays crisp and the hero reads as interactive before
// WebGL finishes booting.
function scrollTo(id) {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroOverlay() {
  const reducedMotion = useStore((s) => s.reducedMotion)

  return (
    <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-6 rounded-full border border-bone/15 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/70 md:text-xs">
        {HERO.eyebrow}
      </p>

      <h1 className="font-display text-[clamp(2.6rem,9vw,8rem)] uppercase leading-[0.86] text-bone">
        {HERO.lines.map((line) => (
          <GlitchText
            key={line}
            as="span"
            className="block"
            text={line}
            autoStart
            reducedMotion={reducedMotion}
            speed={1.1}
          />
        ))}
        <GlitchText
          as="span"
          className="block text-rust"
          text={HERO.accentWord}
          autoStart
          reducedMotion={reducedMotion}
          speed={0.85}
        />
      </h1>

      <p className="mt-8 max-w-xl font-body text-base leading-relaxed text-bone/65 md:text-lg">
        {HERO.subtext}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={() => scrollTo('contact')}
          className="inline-flex items-center gap-3 rounded-md bg-rust px-7 py-3.5 font-mono text-sm uppercase tracking-[0.15em] text-bone transition-transform hover:scale-[1.03]"
        >
          Build My Idea <span aria-hidden="true">→</span>
        </button>
        <button
          onClick={() => scrollTo('services')}
          className="inline-flex items-center gap-3 rounded-md border border-bone/25 px-7 py-3.5 font-mono text-sm uppercase tracking-[0.15em] text-bone transition-colors hover:border-bone/60"
        >
          See What We Can Build
        </button>
      </div>

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
