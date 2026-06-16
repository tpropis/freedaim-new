import { AUDIENCE } from '../lib/layout.js'

// "Who It's For" — calm DOM section. Four audience types, generous space.
export default function WhoItsFor() {
  return (
    <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44">
      <p className="mb-5 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone/45">
        <span className="h-px w-7 bg-rust" />
        {AUDIENCE.eyebrow}
      </p>
      <h2 className="text-center text-4xl font-semibold leading-tight tracking-tight text-bone md:text-6xl">
        {AUDIENCE.heading}
      </h2>

      <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-bone/8 bg-bone/8 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE.items.map((item, i) => (
          <div
            key={i}
            className="group flex min-h-[15rem] flex-col justify-between bg-ink p-8 transition-colors duration-500 hover:bg-steel"
          >
            <span className="text-sm font-medium text-bone/30">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-lg leading-relaxed text-bone/75">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
