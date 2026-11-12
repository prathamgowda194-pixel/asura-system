/**
 * Noise for both sides of the GPU boundary.
 *
 * JS (CPU, for geometry and canvas textures):
 *   const rand = rng(seed)            deterministic 0..1 generator (mulberry32)
 *   const n2 = noise2D(seed)          n2(x, y) -> 0..1 smooth value noise
 *   fbm2(n2, x, y, octaves, gain)     fractal sum, 0..1
 *   const n3 = noise3D(seed)          n3(x, y, z) -> 0..1
 *
 * GLSL (paste with ${NOISE_GLSL} into a shader string):
 *   asuraHash12(vec2) asuraHash13(vec3) asuraNoise2(vec2) asuraNoise3(vec3) asuraFbm2(vec2) asuraFbm3(vec3)
 */

export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fade = (t) => t * t * (3 - 2 * t);

function hashInt(seed) {
  return (x, y, z = 0) => {
    let h = seed ^ Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
}

export function noise2D(seed = 1) {
  const h = hashInt(seed * 9973 + 17);
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const a = h(xi, yi);
    const b = h(xi + 1, yi);
    const c = h(xi, yi + 1);
    const d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

export function noise3D(seed = 1) {
  const h = hashInt(seed * 7919 + 31);
  return (x, y, z) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const u = fade(x - xi);
    const v = fade(y - yi);
    const w = fade(z - zi);
    const l = (a, b, t) => a + (b - a) * t;
    const x00 = l(h(xi, yi, zi), h(xi + 1, yi, zi), u);
    const x10 = l(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u);
    const x01 = l(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u);
    const x11 = l(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u);
    return l(l(x00, x10, v), l(x01, x11, v), w);
  };
}

export function fbm2(n2, x, y, octaves = 5, gain = 0.5, lacunarity = 2.03) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * n2(x, y);
    norm += amp;
    x = x * lacunarity + 13.7;
    y = y * lacunarity + 7.3;
    amp *= gain;
  }
  return sum / norm;
}

export const NOISE_GLSL = /* glsl */ `
float asuraHash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float asuraHash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float asuraNoise2(vec2 x) {
  vec2 i = floor(x); vec2 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  float a = asuraHash12(i), b = asuraHash12(i + vec2(1, 0)), c = asuraHash12(i + vec2(0, 1)), d = asuraHash12(i + vec2(1, 1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float asuraNoise3(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(asuraHash13(i), asuraHash13(i + vec3(1, 0, 0)), f.x), mix(asuraHash13(i + vec3(0, 1, 0)), asuraHash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(asuraHash13(i + vec3(0, 0, 1)), asuraHash13(i + vec3(1, 0, 1)), f.x), mix(asuraHash13(i + vec3(0, 1, 1)), asuraHash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float asuraFbm2(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * asuraNoise2(p); p = p * 2.03 + 13.7; a *= 0.5; }
  return s / 0.96875;
}
float asuraFbm3(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * asuraNoise3(p); p = p * 2.03 + 13.7; a *= 0.5; }
  return s / 0.96875;
}
`;
