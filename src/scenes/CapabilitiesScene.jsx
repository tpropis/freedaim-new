import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from '../components/ParticleField.jsx'
import GlassPanel from '../components/GlassPanel.jsx'
import { useStore } from '../lib/store.js'
import { ANCHOR, WINDOW } from '../lib/layout.js'
import { presence, mapRange, lerp, clamp } from '../lib/range.js'

// CapabilitiesScene — three scroll-bound sub-states inside one scene:
//   Strategy : line/wireframe particles assemble into a loose blueprint box
//   Build    : flat glass panels fly into a locked stacked arrangement
//   Scale    : panels recede + shrink, a constellation grid takes over
//
// All driven by capProgress (0..1), the scrubbed value for this section.

const PANEL_COUNT = 5

// Loose wireframe-box target: points scattered along the 12 edges of a cube.
function blueprintTargets(i) {
  const S = 2.6
  const corners = [
    [-S, -S, -S], [S, -S, -S], [S, S, -S], [-S, S, -S],
    [-S, -S, S], [S, -S, S], [S, S, S], [-S, S, S],
  ]
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ]
  const e = edges[i % edges.length]
  const a = corners[e[0]]
  const b = corners[e[1]]
  const t = Math.random()
  const j = 0.12
  return [
    lerp(a[0], b[0], t) + (Math.random() - 0.5) * j,
    lerp(a[1], b[1], t) + (Math.random() - 0.5) * j,
    lerp(a[2], b[2], t) + (Math.random() - 0.5) * j,
  ]
}

function scatter() {
  return [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  ]
}

// Constellation grid the panels "recede" into during Scale.
function constellation(i, n) {
  const cols = Math.ceil(Math.sqrt(n))
  const x = (i % cols) - cols / 2
  const y = Math.floor(i / cols) - cols / 2
  return [x * 0.5, y * 0.5, -2 + (Math.random() - 0.5) * 0.6]
}

export default function CapabilitiesScene() {
  const groupRef = useRef()
  const panelRefs = useRef([])
  const tier = useStore.getState().tier

  // Per-panel scattered start + locked stacked slot.
  const panels = useMemo(() => {
    const arr = []
    for (let i = 0; i < PANEL_COUNT; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 6
      )
      // Locked stack: fanned slightly, descending z.
      const stacked = new THREE.Vector3(
        (i - (PANEL_COUNT - 1) / 2) * 0.22,
        (i - (PANEL_COUNT - 1) / 2) * 0.16,
        (i - (PANEL_COUNT - 1) / 2) * -0.55
      )
      // Receded grid slot for Scale.
      const grid = new THREE.Vector3(
        ((i % 3) - 1) * 1.1,
        (Math.floor(i / 3) - 0.5) * 1.1,
        -7
      )
      const rot = (Math.random() - 0.5) * 0.4
      arr.push({ start, stacked, grid, rot })
    }
    return arr
  }, [])

  useFrame(() => {
    const state = useStore.getState()
    const cap = state.reducedMotion ? 0.7 : state.capProgress
    const pres = presence(state.scroll, WINDOW.capabilities[0], WINDOW.capabilities[1], 0.07)

    const buildT = mapRange(cap, 0.3, 0.62)
    const scaleT = mapRange(cap, 0.62, 0.96)

    const g = groupRef.current
    if (g) {
      g.visible = pres > 0.01
      // Camera "pull back" feel during Scale: whole scene recedes + shrinks.
      const sc = (0.8 + pres * 0.2) * lerp(1, 0.7, scaleT)
      g.scale.setScalar(sc)
      g.position.z = lerp(0, -3, scaleT)
    }

    // Panels: scattered → stacked → receded grid.
    for (let i = 0; i < PANEL_COUNT; i++) {
      const ref = panelRefs.current[i]
      if (!ref) continue
      const p = panels[i]
      const a = p.start.clone().lerp(p.stacked, buildT)
      a.lerp(p.grid, scaleT)
      ref.position.copy(a)
      ref.rotation.z = p.rot * (1 - buildT) // straighten as they lock
      const panelScale = lerp(1, 0.5, scaleT)
      ref.scale.setScalar(panelScale)
      ref.visible = pres > 0.01 && buildT > 0.001
    }
  })

  const blueprintCount = Math.floor(tier.particles.capabilities * 0.6)
  const constCount = Math.floor(tier.particles.capabilities * 0.4)

  return (
    <group ref={groupRef} position={[0, ANCHOR.capabilities, 0]}>
      {/* Strategy: blueprint assembly */}
      <ParticleField
        count={blueprintCount}
        genStart={scatter}
        genTarget={blueprintTargets}
        color="#5fa8ff"
        size={tier.name === 'high' ? 5 : 4}
        drift={0.04}
        parallax={0.14}
        rotationSpeed={0.01}
        getProgress={() => {
          const s = useStore.getState()
          const cap = s.reducedMotion ? 0.2 : s.capProgress
          return mapRange(cap, 0.02, 0.32) // assemble during Strategy
        }}
        getOpacity={() => {
          const s = useStore.getState()
          const cap = s.reducedMotion ? 0.2 : s.capProgress
          const pres = presence(s.scroll, WINDOW.capabilities[0], WINDOW.capabilities[1], 0.07)
          // bright in Strategy, fade as Build takes over
          return clamp(1 - mapRange(cap, 0.34, 0.6)) * 0.9 * pres
        }}
      />

      {/* Scale: constellation grid the panels recede into */}
      <ParticleField
        count={constCount}
        genStart={constellation}
        genTarget={constellation}
        color="#f3efe4"
        size={tier.name === 'high' ? 4 : 3}
        drift={0.02}
        parallax={0.2}
        rotationSpeed={0.006}
        getProgress={() => 1}
        getOpacity={() => {
          const s = useStore.getState()
          const cap = s.reducedMotion ? 0.85 : s.capProgress
          const pres = presence(s.scroll, WINDOW.capabilities[0], WINDOW.capabilities[1], 0.07)
          return mapRange(cap, 0.66, 0.92) * 0.8 * pres
        }}
      />

      {/* Build: glass panels */}
      {panels.map((_, i) => (
        <GlassPanel
          key={i}
          ref={(el) => (panelRefs.current[i] = el)}
          args={[1.5, 2.0, 0.07]}
          radius={0.05}
          color="#e3ebf7"
          tint={i % 2 === 0 ? '#0a3161' : '#c8102e'}
          thickness={0.4}
        />
      ))}

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#3b6fd4" />
    </group>
  )
}
