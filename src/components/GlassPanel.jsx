import { forwardRef } from 'react'
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei'
import { useStore } from '../lib/store.js'

// GlassPanel
// Shared transmission-material slab used by the Build sub-scene and the Hero
// mark. On low tiers we drop MeshTransmissionMaterial (its blur sampling is the
// single most expensive thing on the page) and fall back to a cheap, still
// glassy MeshStandardMaterial so the silhouette and motion survive.

const GlassPanel = forwardRef(function GlassPanel(
  {
    args = [1.6, 2.2, 0.08],
    radius = 0.06,
    color = '#dfe6f2',
    tint = '#0a3161',
    thickness = 0.6,
    roughness = 0.08,
    children,
    ...props
  },
  ref
) {
  const tier = useStore((s) => s.tier)
  const useTransmission = tier.transmission

  return (
    <RoundedBox ref={ref} args={args} radius={radius} smoothness={4} {...props}>
      {useTransmission ? (
        <MeshTransmissionMaterial
          samples={tier.transmissionSamples}
          resolution={tier.name === 'high' ? 512 : 256}
          transmission={1}
          thickness={thickness}
          roughness={roughness}
          ior={1.25}
          chromaticAberration={0.06}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color={color}
          attenuationColor={tint}
          attenuationDistance={1.4}
          backside
        />
      ) : (
        <meshStandardMaterial
          color={color}
          emissive={tint}
          emissiveIntensity={0.12}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.55}
        />
      )}
      {children}
    </RoundedBox>
  )
})

export default GlassPanel
