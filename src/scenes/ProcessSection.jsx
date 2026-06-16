import { PROCESS } from '../lib/layout.js'

// ProcessSection — deliberate non-WebGL break. After the dense 3D scenes, the
// page exhales: calm editorial typography, generous space, no canvas activity.
// Content is the real freedaim process: Clarify → Build → Automate → Launch.
export default function ProcessSection() {
  return (
    <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44">
      <p className="mb-4 text-center font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ {PROCESS.eyebrow}
      </p>
      <h2 className="text-center font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
        {PROCESS.heading}
      </h2>

      <div className="mt-20 grid gap-px overflow-hidden rounded-lg border border-bone/10 bg-bone/10 md:grid-cols-4">
        {PROCESS.steps.map((s) => (
          <div
            key={s.n}
            className="group flex flex-col bg-ink p-8 transition-colors duration-500 hover:bg-steel"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl text-rust/80">{s.n}</span>
              <span className="h-px w-8 bg-bone/20 transition-all duration-500 group-hover:w-14 group-hover:bg-rust" />
            </div>
            <h3 className="mt-10 font-display text-2xl uppercase text-bone md:text-3xl">
              {s.title}
            </h3>
            <p className="mt-3 font-body text-base leading-relaxed text-bone/60">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
