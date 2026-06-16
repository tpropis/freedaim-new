import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import ParticleField from '../components/ParticleField.jsx'
import { useStore } from '../lib/store.js'
import { ANCHOR, WINDOW } from '../lib/layout.js'
import { presence } from '../lib/range.js'

// HeroScene — a quiet graded backdrop only. The brand mark (emblem) and the
// headline live in the crisp DOM overlay (HeroOverlay); the WebGL layer is just
// a faint drifting field so the hero reads as depth, not clipart.
export default function HeroScene() {
  const groupRef = useRef()
  const tier = useStore.getState().tier

  const genStart = useMemo(
    () => () => {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r = 3.0 + Math.random() * 2.4
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) - 1.5,
      ]
    },
    []
  )

  useFrame(() => {
    const s = useStore.getState().scroll
    const p = presence(s, WINDOW.hero[0], WINDOW.hero[1], 0.07)
    const g = groupRef.current
    if (g) {
      g.visible = p > 0.01
      g.scale.setScalar(0.85 + p * 0.15)
    }
  })

  return (
    <group ref={groupRef} position={[0, ANCHOR.hero, 0]}>
      <ParticleField
        count={tier.particles.hero}
        genStart={genStart}
        color="#3b6fd4"
        size={tier.name === 'high' ? 2.2 : 1.8}
        drift={0.035}
        opacity={0.14}
        blend="normal"
        parallax={0.16}
        rotationSpeed={0.01}
        getProgress={() => 0}
      />
      <ambientLight intensity={0.25} />
    </group>
  )
}
