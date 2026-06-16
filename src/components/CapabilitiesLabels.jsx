import { useStore } from '../lib/store.js'
import GlitchText from './GlitchText.jsx'

// Sticky overlay for the Capabilities section. Each sub-state (Strategy / Build
// / Scale) gets its own GlitchText label, switched by the scrubbed capProgress.
// Re-keying the label on phase change retriggers the scramble = scene-cut feel.

const PHASES = [
  { key: 'strategy', label: 'Strategy', line: 'Find the unfair advantage.', n: '01' },
  { key: 'build', label: 'Build', line: 'Make the thing — and the engine beneath it.', n: '02' },
  { key: 'scale', label: 'Scale', line: 'Turn it into infrastructure that compounds.', n: '03' },
]

export default function CapabilitiesLabels() {
  const capProgress = useStore((s) => s.capProgress)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const phase = capProgress < 0.34 ? 0 : capProgress < 0.66 ? 1 : 2

  if (reducedMotion) {
    // Static states — no scrub. Show all three.
    return (
      <div className="sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-32">
        <p className="mb-8 font-mono text-xs uppercase tracking-ultra text-rust">
          ✦ Capabilities
        </p>
        <div className="space-y-8">
          {PHASES.map((p) => (
            <div key={p.key}>
              <h3 className="font-display text-4xl uppercase text-bone md:text-5xl">
                {p.label}
              </h3>
              <p className="mt-1 max-w-sm font-body text-bone/60">{p.line}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const p = PHASES[phase]
  return (
    <div className="pointer-events-none sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-32">
      <p className="mb-6 font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ Capabilities — {p.n} / 03
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
      <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-bone/60">
        {p.line}
      </p>

      {/* phase rail */}
      <div className="mt-12 flex gap-3">
        {PHASES.map((ph, i) => (
          <span
            key={ph.key}
            className={`h-1 w-12 rounded-full transition-colors duration-300 ${
              i === phase ? 'bg-rust' : 'bg-bone/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
