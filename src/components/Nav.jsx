import { useStore } from '../lib/store.js'

// Persistent minimal sidebar — clean rail, no flourishes. Active item is driven
// by the shared store (set by ScrollTrigger section toggles).
const ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'why', label: 'Why' },
  { id: 'audience', label: 'Who' },
  { id: 'process', label: 'Process' },
  { id: 'whiteboard', label: 'Idea' },
  { id: 'contact', label: 'Build' },
]

function scrollToSection(id) {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Nav() {
  const active = useStore((s) => s.active)

  return (
    <nav className="pointer-events-none fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center justify-between py-7 md:w-20">
      {/* Wordmark */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="pointer-events-auto text-sm font-semibold tracking-tight text-bone [writing-mode:vertical-rl] rotate-180"
        aria-label="freedaim — back to top"
      >
        freedaim
      </button>

      {/* Section rail */}
      <ul className="pointer-events-auto flex flex-col items-center gap-6">
        {ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="group flex items-center justify-center"
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`text-[11px] font-medium uppercase tracking-[0.15em] [writing-mode:vertical-rl] rotate-180 transition-colors duration-300 ${
                    isActive
                      ? 'text-bone'
                      : 'text-bone/30 group-hover:text-bone/70'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Active marker dot */}
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
          active === 'hero' ? 'bg-bone/20' : 'bg-rust'
        }`}
      />
    </nav>
  )
}
