import { useState } from 'react'
import { useStore } from '../lib/store.js'
import { PROJECTS } from '../lib/layout.js'
import GlitchText from './GlitchText.jsx'

// Sticky overlay for the Work section. The active project name reveals via
// GlitchText as workProgress scrubs through the five slices. Clicking the name
// is the stubbed case-study route — opens a minimal modal for this pass.

export default function WorkLabels() {
  const workProgress = useStore((s) => s.workProgress)
  const reducedMotion = useStore((s) => s.reducedMotion)
  const [openSlug, setOpenSlug] = useState(null)

  const index = Math.min(
    PROJECTS.length - 1,
    Math.max(0, Math.floor(workProgress * PROJECTS.length))
  )
  const project = PROJECTS[index]
  const open = openSlug ? PROJECTS.find((p) => p.slug === openSlug) : null

  // Stub route target. A real build would navigate to /work/:slug.
  const routeTo = (slug) => {
    window.history.replaceState(null, '', `#/work/${slug}`)
    setOpenSlug(slug)
  }

  return (
    <>
      <div className="sticky top-0 flex h-screen flex-col justify-center pl-24 pr-6 md:pl-32">
        <p className="mb-6 font-mono text-xs uppercase tracking-ultra text-rust">
          ✦ Selected Work — {String(index + 1).padStart(2, '0')} / 05
        </p>

        <button
          onClick={() => routeTo(project.slug)}
          className="group text-left"
          aria-label={`Open ${project.name} case study`}
        >
          <span
            className="mb-3 block font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: project.accent }}
          >
            {project.kind}
          </span>
          <GlitchText
            key={reducedMotion ? 'rm' : project.slug}
            as="h3"
            autoStart={!reducedMotion}
            text={project.name}
            speed={1.3}
            reducedMotion={reducedMotion}
            className="font-display text-[clamp(2.4rem,8vw,6rem)] uppercase leading-[0.92] text-bone transition-colors group-hover:text-bone/70"
            style={{ fontFamily: 'Anton, sans-serif' }}
          />
          <span className="mt-5 flex items-center gap-3 font-body text-bone/60">
            {project.blurb}
          </span>
          <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone/50 transition-colors group-hover:text-rust">
            View case study
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>

        {/* project rail */}
        <div className="mt-12 flex gap-2">
          {PROJECTS.map((p, i) => (
            <span
              key={p.slug}
              className="h-1 w-10 rounded-full transition-all duration-300"
              style={{
                background: i === index ? p.accent : 'rgba(243,239,228,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Stub case-study modal */}
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 px-6 backdrop-blur-sm"
          onClick={() => setOpenSlug(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-xl border border-bone/10 bg-steel p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="font-mono text-xs uppercase tracking-[0.3em]"
              style={{ color: open.accent }}
            >
              {open.kind}
            </span>
            <h4 className="mt-3 font-display text-4xl uppercase text-bone">
              {open.name}
            </h4>
            <p className="mt-4 font-body text-bone/70">{open.blurb}</p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-bone/40">
              Case study — coming soon
            </p>
            <button
              onClick={() => setOpenSlug(null)}
              className="mt-8 rounded-full border border-bone/20 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-rust hover:text-rust"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
