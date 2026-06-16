import { useStore } from '../lib/store.js'
import { WHY } from '../lib/layout.js'
import Reveal from './Reveal.jsx'

// Sticky overlay for the "Why freedaim" section. Each sub-state (Structure /
// Execution / Systems) fades in as whyProgress scrubs, paired with the real
// "reasons people stay stuck" copy and a closing line.
export default function WhyLabels() {
  const whyProgress = useStore((s) => s.whyProgress)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const phase = whyProgress < 0.34 ? 0 : whyProgress < 0.66 ? 1 : 2
  const p = WHY.phases[phase]

  return (
    <div className="sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-36">
      <p className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone/45">
        <span className="h-px w-7 bg-rust" />
        {WHY.eyebrow}
      </p>
      <p className="mb-9 max-w-xl text-2xl font-medium leading-snug text-bone/80 md:text-3xl">
        {WHY.heading}
      </p>

      {reducedMotion ? (
        <div className="space-y-6">
          {WHY.phases.map((ph) => (
            <div key={ph.key}>
              <h3 className="text-3xl font-semibold tracking-tight text-bone md:text-4xl">
                {ph.label}
              </h3>
              <p className="mt-1 max-w-sm text-bone/55">{ph.problem}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-bone/30">
            {p.n} / 03
          </p>
          <Reveal
            key={p.key}
            as="h3"
            className="text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-bone"
          >
            {p.label}
          </Reveal>
          <Reveal key={p.key + '-b'} as="p" delay={80} className="mt-5 max-w-md text-lg leading-relaxed text-bone/55">
            {p.problem}
          </Reveal>
        </>
      )}

      {/* phase rail */}
      <div className="mt-12 flex gap-2.5">
        {WHY.phases.map((ph, i) => (
          <span
            key={ph.key}
            className={`h-px w-12 transition-colors duration-300 ${
              i === phase ? 'bg-rust' : 'bg-bone/15'
            }`}
          />
        ))}
      </div>

      <p className="mt-10 max-w-lg text-lg text-bone/65">
        {WHY.closer[0]}
        <span className="text-rust">{WHY.closer[1]}</span>
        {WHY.closer[2]}
        <span className="text-rust">{WHY.closer[3]}</span>
        {WHY.closer[4]}
      </p>
    </div>
  )
}
