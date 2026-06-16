// Contact / "Let's Build" — closing DOM section. Restrained, generous space.
export default function ContactSection() {
  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6 py-32">
      <p className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone/45">
        <span className="h-px w-7 bg-rust" />
        Let’s Build
      </p>
      <h2 className="text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.98] tracking-tight text-bone">
        Stop dreaming.
        <br />
        <span className="text-rust">Start building.</span>
      </h2>
      <p className="mt-7 max-w-xl text-lg leading-relaxed text-bone/55">
        Bring the raw idea. We’ll turn it into a real business — strategy, brand,
        systems, and the execution to launch it.
      </p>

      <div className="mt-11 flex flex-col gap-5 sm:flex-row sm:items-center">
        <a
          href="mailto:hello@freedaim.com"
          className="rounded-full bg-rust px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-rust/90"
        >
          Build My Idea
        </a>
        <a
          href="mailto:hello@freedaim.com"
          className="text-sm font-medium text-bone/55 transition-colors hover:text-bone"
        >
          hello@freedaim.com
        </a>
      </div>

      <footer className="mt-24 flex flex-col gap-2 border-t border-bone/10 pt-8 text-xs uppercase tracking-[0.18em] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
        <span>freedaim © {new Date().getFullYear()}</span>
        <span>Strategy · Branding · AI · Execution</span>
      </footer>
    </div>
  )
}
