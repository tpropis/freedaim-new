import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore, SECTIONS } from './store.js'

gsap.registerPlugin(ScrollTrigger)

// scrollController
// Wires native page scroll to the shared store. We do NOT animate the camera
// here directly — instead we publish normalized progress values that each scene
// reads in its own useFrame loop. This keeps scene logic colocated and lets the
// reduced-motion path simply ignore the scrubbed values and snap to states.

let ctx = null

export function initScrollController() {
  const { setScroll, setServicesProgress, setWhyProgress, setActive, reducedMotion } =
    useStore.getState()

  // Reduced motion: no scrubbed camera work. Sections still update the active
  // Nav item via simple visibility triggers, but scenes render fixed states.
  ctx = gsap.context(() => {
    // Global scroll progress.
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setScroll(self.progress),
    })

    // Per-section active highlight + lazy-mount hints.
    SECTIONS.forEach((id) => {
      const el = document.getElementById(`section-${id}`)
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActive(id)
        },
      })
    })

    if (reducedMotion) return

    // Services: scrub through the four service reveals.
    const servicesEl = document.getElementById('section-services')
    if (servicesEl) {
      ScrollTrigger.create({
        trigger: servicesEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => setServicesProgress(self.progress),
      })
    }

    // Why freedaim: scrub through Structure → Execution → Systems.
    const whyEl = document.getElementById('section-why')
    if (whyEl) {
      ScrollTrigger.create({
        trigger: whyEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => setWhyProgress(self.progress),
      })
    }
  })

  // After fonts/layout settle, recompute trigger positions.
  requestAnimationFrame(() => ScrollTrigger.refresh())
  return ctx
}

export function destroyScrollController() {
  if (ctx) {
    ctx.revert()
    ctx = null
  }
  ScrollTrigger.getAll().forEach((t) => t.kill())
}
