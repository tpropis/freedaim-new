import { useState } from 'react'
import { WHITEBOARD } from '../lib/layout.js'

// "The Whiteboard" — interactive idea capture. Calm DOM section. The textarea
// hands the written idea to freedaim via a prefilled email.
export default function Whiteboard() {
  const [idea, setIdea] = useState('')

  const submit = () => {
    const body = encodeURIComponent(idea.trim() || '(no idea written yet)')
    window.location.href = `mailto:hello@freedaim.com?subject=${encodeURIComponent(
      'My idea — via the Whiteboard'
    )}&body=${body}`
  }

  return (
    <div className="relative mx-auto max-w-3xl px-6 py-32 md:py-44">
      <h2 className="text-center text-4xl font-semibold leading-tight tracking-tight text-bone md:text-6xl">
        {WHITEBOARD.heading}
      </h2>

      <div className="mt-7 space-y-1 text-center text-xl leading-relaxed text-bone/70 md:text-2xl">
        {WHITEBOARD.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-bone/40">{WHITEBOARD.sub}</p>

      <div className="mt-12 rounded-2xl border border-bone/10 bg-steel/40 transition-colors focus-within:border-rust/40">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder={WHITEBOARD.placeholder}
          rows={7}
          className="w-full resize-none rounded-2xl bg-transparent p-7 font-hand text-2xl text-bone placeholder:text-bone/25 focus:outline-none md:text-3xl"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={submit}
          className="rounded-full bg-rust px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-rust/90"
        >
          Make it real
        </button>
      </div>
    </div>
  )
}
