import { useStore } from '../lib/store.js'
import { WHY } from '../lib/layout.js'
import GlitchText from './GlitchText.jsx'

// Sticky overlay for the "Why freedaim" section. Each sub-state (Structure /
// Execution / Systems) gets its own GlitchText label switched by the scrubbed
// whyProgress, paired with the real "reasons people stay stuck" copy. A closing
// banner resolves the section.

export default function WhyLabels() {
  const whyProgress = useStore((s) => s.whyProgress)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const phase = whyProgress < 0.34 ? 0 : whyProgress < 0.66 ? 1 : 2
  const p = WHY.phases[phase]

  return (
    <div className="sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-32">
      <p className="mb-3 font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ {WHY.eyebrow}
      </p>
      <p className="mb-8 max-w-xl font-display text-2xl uppercase leading-tight text-bone/80 md:text-3xl">
        {WHY.heading}
      </p>

      {reducedMotion ? (
        <div className="space-y-6">
          {WHY.phases.map((ph) => (
            <div key={ph.key}>
              <h3 className="font-display text-3xl uppercase text-bone md:text-4xl">
                {ph.label}
              </h3>
              <p className="mt-1 max-w-sm font-body text-bone/60">{ph.problem}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-bone/40">
            {p.n} / 03
          </p>
          <GlitchText
            key={p.key}
            as="h3"
            autoStart
            text={p.label}
            speed={1.3}
            className="font-display text-[clamp(3rem,10vw,7rem)] uppercase leading-none text-bone"
            style={{ fontFamily: 'Anton, sans-serif' }}
          />
          <p className="mt-5 max-w-md font-body text-lg leading-relaxed text-bone/60">
            {p.problem}
          </p>
        </>
      )}

      {/* phase rail */}
      <div className="mt-12 flex gap-3">
        {WHY.phases.map((ph, i) => (
          <span
            key={ph.key}
            className={`h-1 w-12 rounded-full transition-colors duration-300 ${
              i === phase ? 'bg-rust' : 'bg-bone/15'
            }`}
          />
        ))}
      </div>

      <p className="mt-10 max-w-lg font-body text-lg text-bone/70">
        {WHY.closer[0]}
        <span className="text-rust">{WHY.closer[1]}</span>
        {WHY.closer[2]}
        <span className="text-rust">{WHY.closer[3]}</span>
        {WHY.closer[4]}
      </p>
    </div>
  )
}
