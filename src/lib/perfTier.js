// perfTier.js
// Cheap, synchronous device-capability probe run once at boot. We deliberately
// avoid benchmarking (jank on load); a few coarse signals are enough to pick a
// quality tier that the scenes read to size particle counts and material cost.
//
// Tiers:
//   'high'   — desktop / capable GPU: full particle counts + transmission blur
//   'mid'    — mid mobile / integrated GPU: reduced particles, no blur
//   'low'    — weak GPU or small mobile: minimal particles, flat materials
//   'static' — no WebGL / reduced-motion-forced: render the static gradient hero

function detectGPU() {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl) return { ok: false, renderer: '' }

    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)).toLowerCase()
      : ''
    return { ok: true, renderer }
  } catch (e) {
    return { ok: false, renderer: '' }
  }
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function detectTier() {
  if (typeof window === 'undefined') return makeTier('static')

  const { ok, renderer } = detectGPU()
  if (!ok) return makeTier('static') // no WebGL at all → static fallback

  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const dpr = window.devicePixelRatio || 1
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 480

  // Known weak / software renderers.
  const weakGPU =
    /swiftshader|llvmpipe|software|mali-4|adreno 3|powervr sgx/i.test(renderer)

  if (weakGPU || (isMobile && (cores <= 4 || mem <= 2)) || smallScreen) {
    return makeTier('low', { dpr: Math.min(dpr, 1.5) })
  }
  if (isMobile || cores <= 4 || mem <= 4) {
    return makeTier('mid', { dpr: Math.min(dpr, 2) })
  }
  return makeTier('high', { dpr: Math.min(dpr, 2) })
}

function makeTier(name, overrides = {}) {
  const presets = {
    high: {
      name: 'high',
      webgl: true,
      transmission: true, // MeshTransmissionMaterial blur samples on
      transmissionSamples: 10,
      particles: { hero: 2600, capabilities: 4200, work: 1800 },
      dpr: 2,
      antialias: true,
    },
    mid: {
      name: 'mid',
      webgl: true,
      transmission: true,
      transmissionSamples: 4,
      particles: { hero: 1200, capabilities: 1800, work: 900 },
      dpr: 1.5,
      antialias: true,
    },
    low: {
      name: 'low',
      webgl: true,
      transmission: false, // flat materials, no blur sampling
      transmissionSamples: 0,
      particles: { hero: 500, capabilities: 700, work: 380 },
      dpr: 1,
      antialias: false,
    },
    static: {
      name: 'static',
      webgl: false,
      transmission: false,
      transmissionSamples: 0,
      particles: { hero: 0, capabilities: 0, work: 0 },
      dpr: 1,
      antialias: false,
    },
  }
  return { ...presets[name], ...overrides }
}
