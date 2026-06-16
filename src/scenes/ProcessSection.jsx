// ProcessSection — deliberate non-WebGL break. After the dense 3D scenes, the
// page exhales: calm editorial typography, generous space, no canvas activity.
// This pacing is intentional, not a placeholder.

const STEPS = [
  {
    n: '01',
    key: 'Idea',
    title: 'Idea',
    body: 'We pressure-test the thesis before a pixel is drawn — positioning, audience, the unfair advantage. Strategy first, decoration never.',
  },
  {
    n: '02',
    key: 'Infra',
    title: 'Infrastructure',
    body: 'Brand, product and the AI/automation systems underneath get built as one stack — the things people see and the engines they don’t.',
  },
  {
    n: '03',
    key: 'Launch',
    title: 'Launch',
    body: 'We ship, measure and hand you something that compounds. Founders leave with infrastructure, not just a website.',
  },
]

export default function ProcessSection() {
  return (
    <div className="relative mx-auto max-w-5xl px-6 py-32 md:py-44">
      <p className="mb-4 font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ The Process
      </p>
      <h2 className="font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
        Idea&nbsp;→&nbsp;Infra&nbsp;→&nbsp;Launch
      </h2>
      <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-bone/70">
        Three moves, run in order. No theatrics here — just the working method
        behind everything above.
      </p>

      <div className="mt-20 grid gap-px overflow-hidden rounded-lg border border-bone/10 bg-bone/10 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.key}
            className="group flex flex-col bg-ink p-8 transition-colors duration-500 hover:bg-steel md:p-10"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs text-rust">{s.n}</span>
              <span className="h-px w-10 bg-bone/20 transition-all duration-500 group-hover:w-16 group-hover:bg-rust" />
            </div>
            <h3 className="mt-10 font-display text-3xl uppercase text-bone md:text-4xl">
              {s.title}
            </h3>
            <p className="mt-4 font-body text-base leading-relaxed text-bone/60">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
