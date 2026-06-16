import { HERO } from '../lib/layout.js'
import Reveal from './Reveal.jsx'

// Hero DOM overlay — calm fade-in headline, the real subtext and the two
// primary CTAs. Lives in the document so type stays crisp and the hero reads as
// interactive before WebGL finishes booting.
function scrollTo(id) {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroOverlay() {
  return (
    <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      <Reveal className="mb-8 block text-[11px] font-medium uppercase tracking-[0.28em] text-bone/45">
        {HERO.eyebrow}
      </Reveal>

      <h1 className="max-w-4xl text-[clamp(2.6rem,7.5vw,6.5rem)] font-semibold leading-[0.98] tracking-tight text-bone">
        {HERO.lines.map((line, i) => (
          <Reveal key={line} as="span" className="block" delay={120 + i * 90}>
            {line}
          </Reveal>
        ))}
        <Reveal as="span" className="block text-rust" delay={120 + HERO.lines.length * 90}>
          {HERO.accentWord}
        </Reveal>
      </h1>

      <Reveal
        as="p"
        delay={420}
        className="mt-8 max-w-xl text-base leading-relaxed text-bone/55 md:text-lg"
      >
        {HERO.subtext}
      </Reveal>

      <Reveal delay={520} className="mt-11 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={() => scrollTo('contact')}
          className="rounded-full bg-rust px-7 py-3 text-sm font-medium text-white transition-all hover:bg-rust/90"
        >
          Build My Idea
        </button>
        <button
          onClick={() => scrollTo('services')}
          className="rounded-full px-7 py-3 text-sm font-medium text-bone/70 transition-colors hover:text-bone"
        >
          See what we can build →
        </button>
      </Reveal>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-bone/30">Scroll</span>
        <span className="relative block h-9 w-px overflow-hidden bg-bone/15">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollLine_1.8s_ease-in-out_infinite] bg-rust/80" />
        </span>
      </div>
    </div>
  )
}
