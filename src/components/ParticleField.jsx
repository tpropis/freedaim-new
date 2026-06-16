import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../lib/store.js'

// ParticleField
// One reusable GPU particle system. Each point carries a START position and a
// TARGET position; uProgress morphs between them in the vertex shader, so the
// same component drives "drifting field", "assembling blueprint", and
// "receding constellation" with zero per-frame CPU work on the points.
//
// progress is read every frame from getProgress() (usually the scroll store)
// so scenes stay reactive without re-rendering the R3F tree.

const vert = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uDrift;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 pos = mix(position, aTarget, uProgress);
    float t = uTime * 0.25 + aSeed * 6.2831;
    pos.x += sin(t) * uDrift;
    pos.y += cos(t * 1.3) * uDrift;
    pos.z += sin(t * 0.7) * uDrift;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const frag = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    // per-point brightness + faint flicker = restrained "signal" energy
    float f = 0.45 + 0.25 * sin(vSeed * 100.0);
    gl_FragColor = vec4(uColor * f, a * uOpacity);
  }
`

export default function ParticleField({
  count = 1000,
  genStart,
  genTarget,
  color = '#3b6fd4',
  size = 6,
  drift = 0.06,
  opacity = 0.9,
  parallax = 0.12,
  getProgress,
  getOpacity,
  rotationSpeed = 0.02,
}) {
  const pointsRef = useRef()
  const matRef = useRef()
  const groupRef = useRef()
  const smoothPointer = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const start = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const sphere = (i, n) => {
      // default: loose drifting shell
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r = 2.4 + Math.random() * 1.6
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]
    }
    for (let i = 0; i < count; i++) {
      const s = (genStart || sphere)(i, count)
      const t = (genTarget || genStart || sphere)(i, count)
      start.set(s, i * 3)
      target.set(t, i * 3)
      seeds[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(start, 3))
    g.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return g
  }, [count, genStart, genTarget])

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: size },
      uDrift: { value: drift },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    // color/size baked at creation; updated imperatively below if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFrame((state, delta) => {
    const u = matRef.current?.uniforms
    if (u) {
      u.uTime.value += delta
      if (getProgress) {
        // ease toward the target progress for a less mechanical feel
        u.uProgress.value += (getProgress() - u.uProgress.value) * Math.min(1, delta * 4)
      }
      u.uColor.value.set(color)
      u.uSize.value = size
      u.uOpacity.value = getOpacity ? getOpacity() : opacity
    }

    // Cursor parallax applied to the whole group (cheap, no physics).
    const p = useStore.getState().pointer
    smoothPointer.current.x += (p.x - smoothPointer.current.x) * Math.min(1, delta * 3)
    smoothPointer.current.y += (p.y - smoothPointer.current.y) * Math.min(1, delta * 3)
    if (groupRef.current) {
      groupRef.current.rotation.y =
        smoothPointer.current.x * parallax + state.clock.elapsedTime * rotationSpeed
      groupRef.current.rotation.x = -smoothPointer.current.y * parallax
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={vert}
          fragmentShader={frag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
