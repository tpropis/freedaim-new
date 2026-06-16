import { Suspense, lazy, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import HeroOverlay from './components/HeroOverlay.jsx'
import ServicesLabels from './components/ServicesLabels.jsx'
import WhyLabels from './components/WhyLabels.jsx'
import WhoItsFor from './components/WhoItsFor.jsx'
import ProcessSection from './scenes/ProcessSection.jsx'
import Whiteboard from './components/Whiteboard.jsx'
import ContactSection from './components/ContactSection.jsx'
import { useStore } from './lib/store.js'
import { initScrollController, destroyScrollController } from './lib/scrollController.js'

// The WebGL stage is code-split so the DOM hero (tagline, nav) paints and is
// interactive immediately while three/drei stream in.
const CinematicStage = lazy(() => import('./components/CinematicStage.jsx'))

export default function App() {
  const tier = useStore((s) => s.tier)
  const webgl = tier.webgl

  // Cursor parallax — mutate the store's pointer in place (no re-render churn);
  // scenes read it transiently each frame.
  useEffect(() => {
    const onMove = (e) => {
      const p = useStore.getState().pointer
      p.x = (e.clientX / window.innerWidth) * 2 - 1
      p.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // GSAP ScrollTrigger wiring. Run after first paint so section heights exist.
  useEffect(() => {
    const id = requestAnimationFrame(() => initScrollController())
    return () => {
      cancelAnimationFrame(id)
      destroyScrollController()
    }
  }, [])

  return (
    <div className="grain relative">
      <Nav />

      {/* Persistent WebGL stage (or static gradient on the lowest tier). */}
      {webgl ? (
        <Suspense fallback={<div className="static-hero" />}>
          <CinematicStage />
        </Suspense>
      ) : (
        <div className="static-hero" aria-hidden="true" />
      )}

      {/* Scrolling document. Sections provide scroll length + carry the DOM
          copy; the fixed stage reads scroll progress behind them. */}
      <main className="relative z-10">
        <section id="section-hero">
          <HeroOverlay />
        </section>

        {/* Services — tall to scrub the four reveals. */}
        <section id="section-services" className="relative h-[300vh]">
          <ServicesLabels />
        </section>

        {/* Why freedaim — tall to scrub Structure → Execution → Systems. */}
        <section id="section-why" className="relative h-[300vh]">
          <WhyLabels />
        </section>

        {/* Who It's For — calmer DOM section, canvas fading out. */}
        <section id="section-audience" className="relative z-10 bg-ink">
          <WhoItsFor />
        </section>

        {/* Process — deliberate non-WebGL break. */}
        <section id="section-process" className="relative z-10 bg-ink">
          <ProcessSection />
        </section>

        {/* The Whiteboard — interactive idea capture. */}
        <section id="section-whiteboard" className="relative z-10 bg-ink">
          <Whiteboard />
        </section>

        {/* Let's Build / Contact. */}
        <section id="section-contact" className="relative z-10 bg-ink">
          <ContactSection />
        </section>
      </main>
    </div>
  )
}
