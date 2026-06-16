import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import ParticleField from '../components/ParticleField.jsx'
import GlassPanel from '../components/GlassPanel.jsx'
import { useStore } from '../lib/store.js'
import { ANCHOR, WINDOW } from '../lib/layout.js'
import { presence } from '../lib/range.js'

// Five-point star geometry (extruded) — the American mark, rendered in chrome
// and floated in front of a glass slab. Deliberately not a particle-sphere hero.
function useStarGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    const spikes = 5
    const outer = 0.62
    const inner = 0.26
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
    }
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    })
    geo.center()
    return geo
  }, [])
}

export default function HeroScene() {
  const groupRef = useRef()
  const markRef = useRef()
  const starGeo = useStarGeometry()
  const tier = useStore.getState().tier

  // Loose drifting shell — low density, sits behind the mark.
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

  useFrame((state) => {
    const s = useStore.getState().scroll
    const p = presence(s, WINDOW.hero[0], WINDOW.hero[1], 0.07)
    const g = groupRef.current
    if (g) {
      g.visible = p > 0.01
      const sc = 0.85 + p * 0.15
      g.scale.setScalar(sc)
    }
    if (markRef.current) {
      markRef.current.rotation.y += 0.0035 // slow idle rotation
    }
  })

  return (
    <group ref={groupRef} position={[0, ANCHOR.hero, 0]}>
      <ParticleField
        count={tier.particles.hero}
        genStart={genStart}
        color="#3b6fd4"
        size={tier.name === 'high' ? 7 : 5}
        drift={0.05}
        opacity={0.75}
        parallax={0.18}
        rotationSpeed={0.015}
        getProgress={() => 0}
      />

      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6}>
        <group ref={markRef}>
          {/* Glass slab backing */}
          <GlassPanel
            args={[1.9, 2.5, 0.12]}
            radius={0.1}
            color="#e8eefb"
            tint="#0a3161"
            thickness={0.5}
            position={[0, 0, -0.25]}
          />
          {/* Chrome star, floated in front */}
          <mesh geometry={starGeo} position={[0, 0, 0.35]}>
            <meshStandardMaterial
              color="#dfe4ec"
              metalness={1}
              roughness={0.18}
              envMapIntensity={1.2}
            />
          </mesh>
          {/* Red rim accent behind */}
          <mesh position={[0, 0, -0.4]}>
            <ringGeometry args={[1.45, 1.55, 48]} />
            <meshBasicMaterial color="#c8102e" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}
