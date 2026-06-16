import { create } from 'zustand'
import { detectTier, prefersReducedMotion } from './perfTier.js'
import { SECTIONS } from './layout.js'

// Single source of truth shared between the scrolling DOM, the GSAP controller
// and the WebGL scenes. Scene useFrame loops read transient values via
// useStore.getState() (no re-render); React UI (Nav, labels) subscribes with
// selectors so only the bits that change re-render.

const tier = detectTier()
const reducedMotion = prefersReducedMotion()

export { SECTIONS }

export const useStore = create((set) => ({
  tier,
  reducedMotion,
  ready: false, // hero interactive

  // Global scroll progress 0..1 across the whole document.
  scroll: 0,
  // Section-local progress (0..1) for the scrubbed scenes.
  servicesProgress: 0,
  whyProgress: 0,
  // Active section for Nav highlighting.
  active: 'hero',

  // Cursor parallax, normalized -1..1, smoothed in scenes.
  pointer: { x: 0, y: 0 },

  setReady: (v) => set({ ready: v }),
  setScroll: (scroll) => set({ scroll }),
  setServicesProgress: (servicesProgress) => set({ servicesProgress }),
  setWhyProgress: (whyProgress) => set({ whyProgress }),
  setActive: (active) => set({ active }),
}))
