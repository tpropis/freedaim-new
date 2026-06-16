import { HERO } from '../lib/layout.js'
import Reveal from './Reveal.jsx'

// Hero DOM overlay — the emblem, a calm fade-in headline, the real subtext and
// the two primary CTAs. Sized to sit comfortably within the viewport.
function scrollTo(id) {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroOverlay() {
  return (
    <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      <Reveal className="mb-7">
        <img
          src="/logo-mark.svg"
          alt="freedaim"
          width={64}
          height={64}
          className="animate-[floatY_6s_ease-in-out_infinite] drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        />
      </Reveal>

      <Reveal
        delay={80}
        className="mb-6 block text-[11px] font-medium uppercase tracking-[0.28em] text-bone/45"
      >
        {HERO.eyebrow}
      </Reveal>

      <h1 className="max-w-3xl text-[clamp(2.1rem,5.6vw,4.6rem)] font-semibold leading-[1.02] tracking-tight text-bone">
        {HERO.lines.map((line, i) => (
          <Reveal key={line} as="span" className="block" delay={140 + i * 90}>
            {line}
          </Reveal>
        ))}
        <Reveal as="span" className="block text-rust" delay={140 + HERO.lines.length * 90}>
          {HERO.accentWord}
        </Reveal>
      </h1>

      <Reveal
        as="p"
        delay={420}
        className="mt-6 max-w-lg text-sm leading-relaxed text-bone/55 md:text-base"
      >
        {HERO.subtext}
      </Reveal>

      <Reveal delay={520} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
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
      <div className="absolute bottom-8 flex flex-col items-center gap-2.5">
        <span className="text-[10px] uppercase tracking-[0.25em] text-bone/30">Scroll</span>
        <span className="relative block h-8 w-px overflow-hidden bg-bone/15">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scrollLine_1.8s_ease-in-out_infinite] bg-rust/80" />
        </span>
      </div>
    </div>
  )
}
