// Contact — closing DOM section. Keeps the American grade: star marks, rust
// accent, federal-blue field. CTA is a simple mailto for this pass.
export default function ContactSection() {
  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-6 py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-2 text-rust opacity-60">
        {'★★★★★★★'.split('').map((s, i) => (
          <span key={i} className="text-xs">
            {s}
          </span>
        ))}
      </div>

      <p className="mb-4 font-mono text-xs uppercase tracking-ultra text-rust">
        ✦ Contact
      </p>
      <h2 className="font-display text-[clamp(2.6rem,9vw,7rem)] uppercase leading-[0.9] text-bone">
        Let’s build
        <br />
        something real.
      </h2>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <a
          href="mailto:hello@freedaim.com"
          className="inline-flex items-center gap-3 rounded-full bg-rust px-8 py-4 font-mono text-sm uppercase tracking-[0.2em] text-bone transition-transform hover:scale-[1.03]"
        >
          Start a project →
        </a>
        <a
          href="mailto:hello@freedaim.com"
          className="font-mono text-sm uppercase tracking-[0.2em] text-bone/60 transition-colors hover:text-bone"
        >
          hello@freedaim.com
        </a>
      </div>

      <footer className="mt-24 flex flex-col gap-2 border-t border-bone/10 pt-8 font-mono text-xs uppercase tracking-[0.2em] text-bone/40 sm:flex-row sm:items-center sm:justify-between">
        <span>freedaim © {new Date().getFullYear()}</span>
        <span>Made in the USA · Turn ideas into reality</span>
      </footer>
    </div>
  )
}
