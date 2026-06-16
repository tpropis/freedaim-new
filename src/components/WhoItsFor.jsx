import { AUDIENCE } from '../lib/layout.js'

// "Who It's For" — calm DOM section. Four audience types, no WebGL.
const ICONS = ['◇', '▤', '▦', '⚙']

export default function WhoItsFor() {
  return (
    <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-40">
      <p className="mb-4 text-center font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ {AUDIENCE.eyebrow}
      </p>
      <h2 className="text-center font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
        {AUDIENCE.heading}
      </h2>

      <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE.items.map((item, i) => (
          <div
            key={i}
            className="group flex flex-col gap-6 rounded-xl border border-bone/10 bg-steel/40 p-8 transition-colors duration-500 hover:border-rust/40"
          >
            <span className="text-2xl text-bone/40 transition-colors group-hover:text-rust">
              {ICONS[i]}
            </span>
            <p className="font-body text-lg leading-relaxed text-bone/75">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
