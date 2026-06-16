# freedaim — cinematic scroll/3D front end

A scroll-driven WebGL experience for freedaim.com (strategy · brand · AI systems
for founders). Full-bleed React Three Fiber scenes bound to scroll via GSAP
ScrollTrigger, with a deliberate non-WebGL pacing break and a tuned American
color grade.

## Stack

- React + Vite
- React Three Fiber + drei (WebGL scenes, transmission/chrome materials)
- GSAP + ScrollTrigger (scroll → scene/camera state)
- Tailwind (nav, copy, type)
- Zustand (shared scroll/perf store read transiently by scenes)

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build → dist/
npm run preview  # serve the build
```

Deploys as-is via the existing GitHub → Netlify pipeline (`netlify.toml`).

## Architecture

A single fixed `<Canvas>` (`CinematicStage`) sits behind a tall scrolling
document. Section heights provide scroll length; `scrollController.js` publishes
normalized progress to the store; each scene reads it in its own `useFrame`
loop. The camera dollies down a vertical world column past each scene anchor —
that travel is the cinematic path.

```
src/
  scenes/      HeroScene, CapabilitiesScene, WorkScene, ProcessSection (DOM)
  components/  Nav, GlitchText, ParticleField, GlassPanel, CinematicStage, overlays
  lib/         scrollController (GSAP), perfTier (device tiering), store, layout, range
```

## Scenes

- **Hero** — chrome star on a glass slab, low-density drifting particle field
  with cursor parallax; tagline resolves via GlitchText on load.
- **Capabilities** — scrubbed Strategy → Build → Scale: blueprint particle
  assembly → locked glass-panel stack → recede into a constellation grid.
- **Work** — five projects, each a distinct particle form + single-color accent
  (lattice / edge / ring / column / network). Clicking a name opens the stubbed
  case-study modal.
- **Process** — intentional non-WebGL break: calm editorial typography
  (idea → infra → launch).

## Performance & accessibility

- `perfTier.js` probes GPU/mobile/memory and picks `high | mid | low | static`,
  scaling particle counts, DPR, antialias, and transmission-blur samples. The
  lowest tier renders a static graded hero (no WebGL).
- `prefers-reduced-motion` disables scrubbed camera work and shows static scene
  states (camera snaps to section anchors).
- WorkScene's WebGL only mounts as it nears the viewport (lazy).
- The WebGL bundle is code-split so the DOM hero is interactive before
  three/drei finish streaming in.

## Out of scope (this pass)

- CMS for Work (five projects hardcoded in `lib/layout.js`)
- Real case-study pages (click target stubbed to a modal)
- Mobile-specific camera paths (reduced-motion static fallback instead)
