// Shared spatial + scroll layout + real site content (transcribed from the live
// freedaim.com). The camera Rig and scenes agree on where each scene lives in 3D
// space and which slice of page-scroll owns it.

// Vertical world position of each scene group. The camera dollies down this
// column as you scroll — that vertical travel IS the cinematic camera path.
export const ANCHOR = {
  hero: 0,
  services: -24,
  why: -50,
  outro: -74, // Who It's For / Process / Contact are DOM; canvas fades here
}

// Camera Y keyframes against global scroll (0..1).
export const CAMERA_KEYS = [
  { s: 0.0, y: ANCHOR.hero },
  { s: 0.08, y: ANCHOR.hero },
  { s: 0.22, y: ANCHOR.services },
  { s: 0.38, y: ANCHOR.services },
  { s: 0.5, y: ANCHOR.why },
  { s: 0.68, y: ANCHOR.why },
  { s: 0.78, y: ANCHOR.outro },
  { s: 1.0, y: ANCHOR.outro },
]

// Global-scroll windows that own each WebGL scene (for cross-fade presence).
export const WINDOW = {
  hero: [0.0, 0.13],
  services: [0.1, 0.43],
  why: [0.4, 0.72],
}

// Scroll past this and the canvas fades for the DOM break.
export const CANVAS_FADE_START = 0.72

// Section list (drives Nav highlight + reduced-motion camera snapping).
export const SECTIONS = [
  'hero',
  'services',
  'why',
  'audience',
  'process',
  'whiteboard',
  'contact',
]

export const SECTION_ANCHOR = {
  hero: ANCHOR.hero,
  services: ANCHOR.services,
  why: ANCHOR.why,
  audience: ANCHOR.outro,
  process: ANCHOR.outro,
  whiteboard: ANCHOR.outro,
  contact: ANCHOR.outro,
}

// --- Real content -----------------------------------------------------------

export const HERO = {
  eyebrow: 'Strategy · Branding · AI · Execution',
  lines: ['Stop Working on', "Someone Else's"],
  accentWord: 'Dream.',
  subtext:
    'freedaim helps founders, entrepreneurs, and ambitious operators turn raw ideas into real businesses through strategy, branding, AI systems, automation, and execution.',
}

// The four services — each gets a distinct accent + particle form so no two
// reveals read alike.
export const SERVICES = [
  {
    slug: 'launch-strategy',
    name: 'Business Launch Strategy',
    form: 'column',
    accent: '#d8404a', // quiet red
    blurb:
      'Turn scattered ideas into clear business concepts, offers, positioning, and launch plans.',
  },
  {
    slug: 'branding-websites',
    name: 'Branding & Websites',
    form: 'ring',
    accent: '#3b82f6', // blue
    blurb:
      'Build premium brands, websites, landing pages, and digital presence that actually look credible.',
  },
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    form: 'lattice',
    accent: '#5fa8ff', // cyan-blue
    blurb:
      'Create systems that eliminate repetitive work, improve operations, and help businesses move faster.',
  },
  {
    slug: 'sales-growth',
    name: 'Sales & Growth Tools',
    form: 'network',
    accent: '#d8a32f', // amber
    blurb:
      'Pitch decks, lead systems, CRM workflows, outbound strategy, and tools that help businesses win.',
  },
]

// "Why freedaim" — the three reasons people stay stuck, mapped onto the 3D
// assembly's three sub-states (chaos → structure → systems).
export const WHY = {
  eyebrow: 'Why freedaim',
  heading: 'Most People Stay Stuck for the Same Reasons.',
  closer: ['freedaim exists to close the gap between ', 'ambition', ' and ', 'action', '.'],
  phases: [
    {
      key: 'structure',
      label: 'Structure',
      problem: 'Too many ideas, no structure.',
      n: '01',
    },
    {
      key: 'execution',
      label: 'Execution',
      problem: 'Too much hesitation, no execution.',
      n: '02',
    },
    {
      key: 'systems',
      label: 'Systems',
      problem: 'Too much manual work, no systems.',
      n: '03',
    },
  ],
}

// "Who It's For"
export const AUDIENCE = {
  eyebrow: "Who It's For",
  heading: 'Built for People Ready to Move.',
  items: [
    'Entrepreneurs with real ideas but no execution plan',
    'Small businesses ready to modernize and automate',
    'Founders launching a new service, brand, or SaaS concept',
    "Operators who are tired of being stuck in someone else's system",
  ],
}

// "The Whiteboard" — interactive idea capture.
export const WHITEBOARD = {
  heading: 'The Whiteboard',
  lines: ['Got an idea?', 'Write it down.', "Let's see if it can become reality."],
  sub: 'Most people never build because they never start. Start here.',
  placeholder: 'Write your idea here...',
}

// Process — the deliberate non-WebGL break.
export const PROCESS = {
  eyebrow: 'Process',
  heading: 'From Idea to Reality.',
  steps: [
    { n: '01', title: 'Clarify', body: 'We refine the idea, the offer, and the opportunity.' },
    { n: '02', title: 'Build', body: 'We create the brand, website, systems, and assets.' },
    { n: '03', title: 'Automate', body: 'We use AI and smart workflows to remove friction.' },
    { n: '04', title: 'Launch', body: 'We help turn momentum into something real and usable.' },
  ],
}
