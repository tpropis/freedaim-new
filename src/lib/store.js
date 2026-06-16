import { create } from 'zustand'
import { detectTier, prefersReducedMotion } from './perfTier.js'

// Single source of truth shared between the scrolling DOM, the GSAP controller
// and the WebGL scenes. Scene useFrame loops read transient values via
// useStore.getState() (no re-render); React UI (Nav, labels) subscribes with
// selectors so only the bits that change re-render.

const tier = detectTier()
const reducedMotion = prefersReducedMotion()

export const SECTIONS = ['hero', 'capabilities', 'work', 'process', 'contact']

export const useStore = create((set) => ({
  tier,
  reducedMotion,
  ready: false, // hero interactive
  started: false, // intro/glitch played

  // Global scroll progress 0..1 across the whole document.
  scroll: 0,
  // Section-local progress (0..1) for the scrubbed scenes.
  capProgress: 0,
  workProgress: 0,
  // Active section for Nav highlighting.
  active: 'hero',

  // Cursor parallax, normalized -1..1, smoothed in scenes.
  pointer: { x: 0, y: 0 },

  setReady: (v) => set({ ready: v }),
  setStarted: (v) => set({ started: v }),
  setScroll: (scroll) => set({ scroll }),
  setCapProgress: (capProgress) => set({ capProgress }),
  setWorkProgress: (workProgress) => set({ workProgress }),
  setActive: (active) => set({ active }),
  setPointer: (pointer) => set({ pointer }),
}))
