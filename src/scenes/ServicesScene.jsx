import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import ParticleField from '../components/ParticleField.jsx'
import { useStore } from '../lib/store.js'
import { ANCHOR, WINDOW, SERVICES } from '../lib/layout.js'
import { presence, mapRange, clamp } from '../lib/range.js'

// ServicesScene — one reveal per service. Each service gets a DISTINCT particle
// form + single-color accent so the four reads stay visually separate.
// servicesProgress (0..1) scrubs through the four slices.

const SLICE = 1 / SERVICES.length

// Form generators — each returns [x,y,z] for point i of n.
const FORMS = {
  // Rising helix — launch / momentum.
  column(i, n) {
    const t = i / n
    const a = t * Math.PI * 14
    const r = 0.9 + Math.random() * 0.12
    return [Math.cos(a) * r, (t - 0.5) * 4.4, Math.sin(a) * r]
  },
  // Torus — brand orbit.
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
  // Tight cubic lattice — systems / structure.
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
  // Clustered nodes + radiating spokes — growth network.
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

function ServiceReveal({ service, index, perField }) {
  const sliceStart = index * SLICE
  const sliceCenter = (index + 0.5) * SLICE
  const gen = FORMS[service.form]

  const getProg = () => {
    const s = useStore.getState()
    return s.reducedMotion ? sliceCenter : s.servicesProgress
  }

  return (
    <ParticleField
      count={perField}
      genStart={scatter}
      genTarget={gen}
      color={service.accent}
      size={3.2}
      drift={0.05}
      parallax={0.16}
      rotationSpeed={index % 2 === 0 ? 0.05 : -0.04}
      getProgress={() => mapRange(getProg(), sliceStart - 0.03, sliceStart + 0.09)}
      getOpacity={() => {
        const s = useStore.getState()
        const prog = getProg()
        const pres = presence(s.scroll, WINDOW.services[0], WINDOW.services[1], 0.07)
        const focus = clamp(1 - Math.abs(prog - sliceCenter) / (SLICE * 0.85))
        return focus * pres * 0.95
      }}
    />
  )
}

export default function ServicesScene() {
  const groupRef = useRef()
  const tier = useStore.getState().tier
  const perField = useMemo(
    () => Math.max(140, Math.floor(tier.particles.work / SERVICES.length)),
    [tier]
  )

  useFrame(() => {
    const s = useStore.getState()
    const pres = presence(s.scroll, WINDOW.services[0], WINDOW.services[1], 0.07)
    const g = groupRef.current
    if (g) {
      g.visible = pres > 0.01
      g.scale.setScalar(0.85 + pres * 0.15)
    }
  })

  return (
    <group ref={groupRef} position={[0, ANCHOR.services, 0]}>
      {SERVICES.map((svc, i) => (
        <ServiceReveal key={svc.slug} service={svc} index={i} perField={perField} />
      ))}
      <ambientLight intensity={0.5} />
    </group>
  )
}
