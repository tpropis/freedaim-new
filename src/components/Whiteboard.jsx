import { useState } from 'react'
import { WHITEBOARD } from '../lib/layout.js'

// "The Whiteboard" — interactive idea capture. Submits to a Netlify Form
// (name="idea", detected from the static form in index.html) via a urlencoded
// POST, so ideas land in the Netlify dashboard with no backend.
function encode(data) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')
}

export default function Whiteboard() {
  const [idea, setIdea] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const submit = async (e) => {
    e.preventDefault()
    if (!idea.trim()) return
    setStatus('sending')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'idea', email, idea, 'bot-field': '' }),
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
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

      {status === 'done' ? (
        <div className="mt-12 rounded-2xl border border-rust/30 bg-steel/40 p-12 text-center">
          <p className="font-hand text-3xl text-bone">Got it.</p>
          <p className="mt-3 text-bone/55">
            Your idea is on our whiteboard — we’ll be in touch shortly.
          </p>
        </div>
      ) : (
        <form
          name="idea"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={submit}
          className="mt-12"
        >
          <input type="hidden" name="form-name" value="idea" />
          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="rounded-2xl border border-bone/10 bg-steel/40 transition-colors focus-within:border-rust/40">
            <textarea
              name="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={WHITEBOARD.placeholder}
              rows={6}
              required
              className="w-full resize-none rounded-t-2xl bg-transparent p-7 font-hand text-2xl text-bone placeholder:text-bone/25 focus:outline-none md:text-3xl"
            />
            <div className="border-t border-bone/10 px-7 py-4">
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (so we can reach you)"
                className="w-full bg-transparent text-base text-bone placeholder:text-bone/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-rust px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-rust/90 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Make it real'}
            </button>
            {status === 'error' && (
              <span className="text-sm text-rust">Something went wrong — try again.</span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
