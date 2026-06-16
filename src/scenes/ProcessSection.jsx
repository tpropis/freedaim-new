import { PROCESS } from '../lib/layout.js'

// ProcessSection — deliberate non-WebGL break. Calm editorial typography,
// generous space. Content: Clarify → Build → Automate → Launch.
export default function ProcessSection() {
  return (
    <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44">
      <p className="mb-5 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone/45">
        <span className="h-px w-7 bg-rust" />
        {PROCESS.eyebrow}
      </p>
      <h2 className="text-center text-4xl font-semibold leading-tight tracking-tight text-bone md:text-6xl">
        {PROCESS.heading}
      </h2>

      <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS.steps.map((s) => (
          <div key={s.n} className="flex flex-col">
            <span className="text-sm font-medium text-rust">{s.n}</span>
            <span className="mt-5 h-px w-full bg-bone/10" />
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-bone">
              {s.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-bone/55">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
