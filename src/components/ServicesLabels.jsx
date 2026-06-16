import { useStore } from '../lib/store.js'
import { SERVICES } from '../lib/layout.js'
import GlitchText from './GlitchText.jsx'

// Sticky overlay for the Services section. The active service name + blurb
// reveals via GlitchText as servicesProgress scrubs through the four slices.
function scrollToContact() {
  document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' })
}

export default function ServicesLabels() {
  const servicesProgress = useStore((s) => s.servicesProgress)
  const reducedMotion = useStore((s) => s.reducedMotion)

  const index = Math.min(
    SERVICES.length - 1,
    Math.max(0, Math.floor(servicesProgress * SERVICES.length))
  )
  const svc = SERVICES[index]

  return (
    <div className="sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-32">
      <p className="mb-6 font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ Services — {String(index + 1).padStart(2, '0')} / 0{SERVICES.length}
      </p>

      <GlitchText
        key={reducedMotion ? 'rm' : svc.slug}
        as="h3"
        autoStart={!reducedMotion}
        text={svc.name}
        speed={1.3}
        reducedMotion={reducedMotion}
        className="max-w-3xl font-display text-[clamp(2.2rem,7vw,5.5rem)] uppercase leading-[0.92] text-bone"
        style={{ fontFamily: 'Anton, sans-serif' }}
      />

      <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-bone/65">
        {svc.blurb}
      </p>

      <button
        onClick={scrollToContact}
        className="group mt-7 inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone/60 transition-colors hover:text-rust"
      >
        Build this with us
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>

      {/* service rail */}
      <div className="mt-12 flex gap-2">
        {SERVICES.map((s, i) => (
          <span
            key={s.slug}
            className="h-1 w-12 rounded-full transition-all duration-300"
            style={{ background: i === index ? s.accent : 'rgba(243,239,228,0.15)' }}
          />
        ))}
      </div>
    </div>
  )
}
