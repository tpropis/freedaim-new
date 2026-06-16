import { useStore } from '../lib/store.js'
import { SERVICES } from '../lib/layout.js'
import Reveal from './Reveal.jsx'

// Sticky overlay for the Services section. The active service name + blurb fade
// in as servicesProgress scrubs through the four slices.
function scrollToContact() {
  document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' })
}

export default function ServicesLabels() {
  const servicesProgress = useStore((s) => s.servicesProgress)

  const index = Math.min(
    SERVICES.length - 1,
    Math.max(0, Math.floor(servicesProgress * SERVICES.length))
  )
  const svc = SERVICES[index]

  return (
    <div className="sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-36">
      <p className="mb-7 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone/45">
        <span className="h-px w-7 bg-rust" />
        Services
        <span className="text-bone/30">
          {String(index + 1).padStart(2, '0')} / 0{SERVICES.length}
        </span>
      </p>

      <Reveal
        key={svc.slug}
        as="h3"
        className="max-w-2xl text-[clamp(2.2rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight text-bone"
      >
        {svc.name}
      </Reveal>

      <Reveal key={svc.slug + '-b'} as="p" delay={80} className="mt-6 max-w-md text-lg leading-relaxed text-bone/55">
        {svc.blurb}
      </Reveal>

      <button
        onClick={scrollToContact}
        className="group mt-9 inline-flex w-fit items-center gap-2 text-sm font-medium text-bone/55 transition-colors hover:text-bone"
      >
        Build this with us
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>

      {/* service rail */}
      <div className="mt-12 flex gap-2.5">
        {SERVICES.map((s, i) => (
          <span
            key={s.slug}
            className={`h-px w-12 transition-colors duration-300 ${
              i === index ? 'bg-rust' : 'bg-bone/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
