// Small math helpers shared by the scroll-bound scenes.

export const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))

export const lerp = (a, b, t) => a + (b - a) * t

// Map x from [inMin,inMax] to [outMin,outMax], clamped.
export const mapRange = (x, inMin, inMax, outMin = 0, outMax = 1) => {
  if (inMax === inMin) return outMin
  return clamp((x - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

// "Presence" of a scene given global scroll: ramps 0→1 over [start, start+fade],
// holds at 1, then ramps 1→0 over [end-fade, end]. Used to cross-fade scenes.
export const presence = (scroll, start, end, fade = 0.06) => {
  const up = mapRange(scroll, start, start + fade)
  const down = 1 - mapRange(scroll, end - fade, end)
  return clamp(Math.min(up, down))
}

// Piecewise-linear keyframe sampler: keys = [{s, y}, ...] sorted by s.
export const sampleKeys = (keys, s) => {
  if (s <= keys[0].s) return keys[0].y
  if (s >= keys[keys.length - 1].s) return keys[keys.length - 1].y
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (s >= a.s && s <= b.s) {
      const t = (s - a.s) / (b.s - a.s)
      return lerp(a.y, b.y, t)
    }
  }
  return keys[keys.length - 1].y
}
