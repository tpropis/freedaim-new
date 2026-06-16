import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import ParticleField from '../components/ParticleField.jsx'
import { useStore } from '../lib/store.js'
import { ANCHOR, WINDOW, PROJECTS } from '../lib/layout.js'
import { presence, mapRange, clamp } from '../lib/range.js'

// WorkScene — one reveal per project. Each project gets a DISTINCT particle
// form + single-color accent (no shared glass-panel look), so the five reads
// stay visually separate. workProgress (0..1) scrubs through the five slices.

const SLICE = 1 / PROJECTS.length

// Form generators — each returns [x,y,z] for point i of n.
const FORMS = {
  // Vault: tight cubic lattice.
  lattice(i, n) {
    const side = Math.max(2, Math.round(Math.cbrt(n)))
    const x = i % side
    const y = Math.floor(i / side) % side
    const z = Math.floor(i / (side * side)) % side
    const span = 3
    return [
      (x / (side - 1) - 0.5) * span,
      (y / (side - 1) - 0.5) * span,
      (z / (side - 1) - 0.5) * span,
    ]
  },
  // Edge: sharp horizontal lines.
  edge(i, n) {
    const lines = 3
    const line = i % lines
    const t = Math.random()
    return [
      (t - 0.5) * 5.2,
      (line - (lines - 1) / 2) * 0.6 + (Math.random() - 0.5) * 0.06,
      (Math.random() - 0.5) * 0.4,
    ]
  },
  // Ring: torus.
  ring(i) {
    const R = 2.0
    const tube = 0.32
    const a = Math.random() * Math.PI * 2
    const p = Math.random() * Math.PI * 2
    return [
      (R + tube * Math.cos(p)) * Math.cos(a),
      (R + tube * Math.cos(p)) * Math.sin(a),
      tube * Math.sin(p),
    ]
  },
  // Column: rising helix.
  column(i, n) {
    const t = i / n
    const a = t * Math.PI * 14
    const r = 0.9 + Math.random() * 0.12
    return [Math.cos(a) * r, (t - 0.5) * 4.4, Math.sin(a) * r]
  },
  // Network: clustered nodes + radiating spokes.
  network(i) {
    const r = Math.random() < 0.7 ? 0.4 + Math.random() * 1.0 : 1.6 + Math.random() * 1.2
    const phi = Math.acos(2 * Math.random() - 1)
    const theta = Math.random() * Math.PI * 2
    return [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ]
  },
}

function scatter() {
  return [
    (Math.random() - 0.5) * 9,
    (Math.random() - 0.5) * 9,
    (Math.random() - 0.5) * 9,
  ]
}

function ProjectReveal({ project, index, perField }) {
  const sliceStart = index * SLICE
  const sliceCenter = (index + 0.5) * SLICE
  const gen = FORMS[project.form]

  const getWork = () => {
    const s = useStore.getState()
    return s.reducedMotion ? sliceCenter : s.workProgress
  }

  return (
    <ParticleField
      count={perField}
      genStart={scatter}
      genTarget={gen}
      color={project.accent}
      size={project.form === 'edge' ? 5 : 6}
      drift={0.05}
      parallax={0.16}
      rotationSpeed={index % 2 === 0 ? 0.05 : -0.04}
      getProgress={() => mapRange(getWork(), sliceStart - 0.03, sliceStart + 0.09)}
      getOpacity={() => {
        const s = useStore.getState()
        const work = getWork()
        const pres = presence(s.scroll, WINDOW.work[0], WINDOW.work[1], 0.07)
        // triangular focus around this project's slice
        const focus = clamp(1 - Math.abs(work - sliceCenter) / (SLICE * 0.85))
        return focus * pres * 0.95
      }}
    />
  )
}

export default function WorkScene() {
  const groupRef = useRef()
  const tier = useStore.getState().tier
  const perField = useMemo(
    () => Math.max(120, Math.floor(tier.particles.work / PROJECTS.length)),
    [tier]
  )

  useFrame(() => {
    const s = useStore.getState()
    const pres = presence(s.scroll, WINDOW.work[0], WINDOW.work[1], 0.07)
    const g = groupRef.current
    if (g) {
      g.visible = pres > 0.01
      g.scale.setScalar(0.85 + pres * 0.15)
    }
  })

  return (
    <group ref={groupRef} position={[0, ANCHOR.work, 0]}>
      {PROJECTS.map((p, i) => (
        <ProjectReveal key={p.slug} project={p} index={i} perField={perField} />
      ))}
      <ambientLight intensity={0.5} />
    </group>
  )
}
