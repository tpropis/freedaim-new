// Shared spatial + scroll layout so the camera Rig and the scenes agree on
// where each scene lives in 3D space and which slice of page-scroll owns it.

// Vertical world position of each scene group. The camera dollies down this
// column as you scroll — that vertical travel IS the cinematic camera path.
export const ANCHOR = {
  hero: 0,
  capabilities: -24,
  work: -50,
  outro: -74, // process/contact are DOM; canvas drifts here and fades
}

// Camera Y keyframes against global scroll (0..1).
export const CAMERA_KEYS = [
  { s: 0.0, y: ANCHOR.hero },
  { s: 0.16, y: ANCHOR.hero },
  { s: 0.32, y: ANCHOR.capabilities },
  { s: 0.46, y: ANCHOR.capabilities },
  { s: 0.6, y: ANCHOR.work },
  { s: 0.72, y: ANCHOR.work },
  { s: 0.84, y: ANCHOR.outro },
  { s: 1.0, y: ANCHOR.outro },
]

// Global-scroll windows that own each WebGL scene (for cross-fade presence).
export const WINDOW = {
  hero: [0.0, 0.22],
  capabilities: [0.18, 0.5],
  work: [0.46, 0.78],
}

// Per-section camera anchor used by the reduced-motion path (snaps instead of
// scrubbing).
export const SECTION_ANCHOR = {
  hero: ANCHOR.hero,
  capabilities: ANCHOR.capabilities,
  work: ANCHOR.work,
  process: ANCHOR.outro,
  contact: ANCHOR.outro,
}

// The five Work projects — hardcoded for this pass (no CMS). Each gets a
// distinct accent + form so no two reveals read alike.
export const PROJECTS = [
  {
    slug: 'privilege-vault-ai',
    name: 'Privilege Vault AI',
    kind: 'AI System',
    accent: '#d8a32f', // amber / vault gold
    form: 'lattice',
    blurb: 'Privileged-document review, automated.',
  },
  {
    slug: 'lineedge',
    name: 'LineEdge',
    kind: 'Product',
    accent: '#3b82f6', // electric blue
    form: 'edge',
    blurb: 'Edge-deployed line-of-business tooling.',
  },
  {
    slug: 'thersday',
    name: 'Thersday',
    kind: 'Brand + Web',
    accent: '#a855f7', // violet
    form: 'ring',
    blurb: 'A weekly ritual, designed end to end.',
  },
  {
    slug: 'simple-man-distillery',
    name: 'Simple Man Distillery',
    kind: 'Brand + Web',
    accent: '#c2772f', // copper
    form: 'column',
    blurb: 'Craft spirits, an honest American mark.',
  },
  {
    slug: 'gettmann',
    name: 'Gettmann',
    kind: 'Campaign Infra',
    accent: '#c8102e', // rust red
    form: 'network',
    blurb: 'Campaign infrastructure that scales on demand.',
  },
]
