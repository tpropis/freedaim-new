import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'
import HeroScene from '../scenes/HeroScene.jsx'
import CapabilitiesScene from '../scenes/CapabilitiesScene.jsx'
import WorkScene from '../scenes/WorkScene.jsx'
import { useStore } from '../lib/store.js'
import { CAMERA_KEYS, SECTION_ANCHOR } from '../lib/layout.js'
import { sampleKeys, lerp } from '../lib/range.js'

// Camera Rig — the scroll-driven dolly. Camera travels down the world column
// past each scene anchor (that vertical travel is the cinematic path). Reduced
// motion snaps to the active section's anchor instead of scrubbing.
function Rig() {
  const { camera } = useThree()
  const smooth = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    const s = useStore.getState()
    const targetY = s.reducedMotion
      ? SECTION_ANCHOR[s.active] ?? 0
      : sampleKeys(CAMERA_KEYS, s.scroll)

    const px = s.pointer.x
    const py = s.pointer.y
    smooth.current.x += (px - smooth.current.x) * Math.min(1, delta * 2.5)
    smooth.current.y += (py - smooth.current.y) * Math.min(1, delta * 2.5)

    const k = Math.min(1, delta * (s.reducedMotion ? 6 : 3))
    camera.position.y = lerp(camera.position.y, targetY + smooth.current.y * 0.5, k)
    camera.position.x = lerp(camera.position.x, smooth.current.x * 0.8, k)
    camera.position.z = lerp(camera.position.z, 6.4, k)
    camera.lookAt(smooth.current.x * 0.3, camera.position.y - smooth.current.y * 0.2, 0)
  })
  return null
}

// Studio-ish environment generated in-scene (no HDR fetch — offline safe),
// graded in the brand palette so chrome/glass reflect red·white·blue.
function StageEnvironment() {
  const tier = useStore.getState().tier
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={0.7} position={[0, 3, 4]} scale={[5, 5, 1]} color="#ffffff" />
      <Lightformer intensity={0.45} position={[-5, 1, 2]} scale={[3, 6, 1]} color="#3b6fd4" />
      <Lightformer intensity={0.4} position={[5, -1, 1]} scale={[3, 6, 1]} color="#c8102e" />
      <Lightformer intensity={0.2} position={[0, -4, -3]} scale={[6, 3, 1]} color="#0a3161" />
    </Environment>
  )
}

// Mount a scene only when scroll is within a buffered range (lazy WebGL init).
function useNearScroll(min, max) {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const check = (scroll) => {
      if (scroll >= min && scroll <= max) setNear(true)
    }
    check(useStore.getState().scroll)
    return useStore.subscribe((s) => check(s.scroll))
  }, [min, max])
  return near
}

export default function CinematicStage() {
  const tier = useStore.getState().tier
  const setReady = useStore((s) => s.setReady)

  // Hero is always present; capabilities + work mount as they approach view.
  const mountCaps = useNearScroll(0.1, 0.6)
  const mountWork = useNearScroll(0.38, 0.84)

  // Canvas fully fades out for the DOM Process/Contact break.
  const fadeRef = useRef()
  useEffect(() => {
    return useStore.subscribe((s) => {
      if (!fadeRef.current) return
      const o = s.scroll > 0.8 ? Math.max(0, 1 - (s.scroll - 0.8) / 0.08) : 1
      fadeRef.current.style.opacity = String(o)
    })
  }, [])

  return (
    <div ref={fadeRef} className="stage-canvas" style={{ transition: 'opacity 0.2s' }}>
      <Canvas
        gl={{
          antialias: tier.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, tier.dpr]}
        camera={{ position: [0, 0, 6.4], fov: 42, near: 0.1, far: 200 }}
        onCreated={() => setReady(true)}
      >
        <color attach="background" args={['#050814']} />
        <fog attach="fog" args={['#050814', 6, 17]} />

        <Suspense fallback={null}>
          <StageEnvironment />
          <Rig />
          <HeroScene />
          {mountCaps && <CapabilitiesScene />}
          {mountWork && <WorkScene />}
          <Preload all />
        </Suspense>

        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
