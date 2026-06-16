import { useState } from 'react'
import { WHITEBOARD } from '../lib/layout.js'

// "The Whiteboard" — interactive idea capture. Calm DOM section (no WebGL). The
// textarea hands the written idea off to freedaim via a prefilled email, so the
// CTA actually does something for this pass.
export default function Whiteboard() {
  const [idea, setIdea] = useState('')

  const submit = () => {
    const body = encodeURIComponent(idea.trim() || '(no idea written yet)')
    window.location.href = `mailto:hello@freedaim.com?subject=${encodeURIComponent(
      'My idea — via the Whiteboard'
    )}&body=${body}`
  }

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-32 md:py-40">
      <h2 className="text-center font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
        {WHITEBOARD.heading}
      </h2>

      <div className="mt-8 text-center font-body text-xl leading-relaxed text-bone/80 md:text-2xl">
        {WHITEBOARD.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone/40">
        {WHITEBOARD.sub}
      </p>

      <div className="mt-12 rounded-2xl border border-bone/10 bg-steel/40 p-2 transition-colors focus-within:border-rust/40">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={WHITEBOARD.placeholder}
          rows={8}
          className="w-full resize-none rounded-xl bg-transparent p-6 font-hand text-2xl text-bone placeholder:text-bone/30 focus:outline-none md:text-3xl"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={submit}
          className="inline-flex items-center gap-3 rounded-md bg-rust px-8 py-4 font-mono text-sm uppercase tracking-[0.2em] text-bone transition-transform hover:scale-[1.03]"
        >
          Make It Real →
        </button>
      </div>
    </div>
  )
}
