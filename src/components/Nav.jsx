import { useStore } from '../lib/store.js'

// Persistent minimal sidebar — present from Hero onward. Active item is driven
// by the shared store (set by ScrollTrigger section toggles). Order follows the
// brief: Work / Capabilities / Process / Contact.

const ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'why', label: 'Why' },
  { id: 'audience', label: 'Who' },
  { id: 'process', label: 'Process' },
  { id: 'whiteboard', label: 'Idea' },
  { id: 'contact', label: 'Build' },
]

function scrollToSection(id) {
  const el = document.getElementById(`section-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Nav() {
  const active = useStore((s) => s.active)

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center justify-between py-6 md:w-20 pointer-events-none">
      {/* Wordmark */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="pointer-events-auto font-display text-bone tracking-tight leading-none text-center"
        aria-label="freedaim — back to top"
      >
        <span className="block text-[10px] tracking-ultra text-rust">★</span>
        <span className="mt-2 block text-xs [writing-mode:vertical-rl] rotate-180">
          FREEDAIM
        </span>
      </button>

      {/* Section rail */}
      <ul className="pointer-events-auto flex flex-col gap-5">
        {ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id} className="flex items-center justify-center">
              <button
                onClick={() => scrollToSection(item.id)}
                className="group relative flex flex-col items-center gap-2"
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`h-px transition-all duration-300 ${
                    isActive ? 'w-6 bg-rust' : 'w-3 bg-chrome/30 group-hover:bg-chrome/60'
                  }`}
                />
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 transition-colors duration-300 ${
                    isActive ? 'text-bone' : 'text-chrome/40 group-hover:text-chrome/80'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Status dot */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rust opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-rust" />
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-chrome/40 [writing-mode:vertical-rl] rotate-180">
          USA · Open
        </span>
      </div>
    </nav>
  )
}
