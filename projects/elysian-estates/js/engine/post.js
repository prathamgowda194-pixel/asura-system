/**
 * Display-space post passes. All of these run AFTER OutputPass (tone mapping + sRGB),
 * so colours here are what the viewer sees.
 *
 *   createFinishPass(opts)   always last: grade, vignette, chromatic aberration, film grain, anti-banding dither
 *   createLookPasses(name)   optional stylisation inserted before the finish pass:
 *       'cinematic'  -> no extra pass (finish only)
 *       'print'      -> ordered Bayer dither or halftone dots in two inks   (uMix animatable 0..1)
 *       'paper'      -> duotone ink-on-paper with Sobel edge lines           (uMix animatable 0..1)
 *       'miniature'  -> tilt-shift blur bands (pairs well with a high camera and a small scene)
 *
 * Use displayColor('#hex') for colour uniforms in these shaders (no linear conversion).
 */
import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const HASH = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }`;

/** sRGB components of a CSS colour, for display-space shaders. */
export function displayColor(css) {
  const out = { r: 0, g: 0, b: 0 };
  new THREE.Color(css).getRGB(out, THREE.SRGBColorSpace);
  return new THREE.Vector3(out.r, out.g, out.b);
}

const v3 = (a) => (a instanceof THREE.Vector3 ? a : new THREE.Vector3(...a));

// ---------------------------------------------------------------------------------------------
// Finish pass
// ---------------------------------------------------------------------------------------------
const FinishShader = {
  name: 'AsuraFinish',
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uContrast: { value: 1.04 },
    uSaturation: { value: 1.0 },
    uLift: { value: new THREE.Vector3(0, 0, 0) },
    uGain: { value: new THREE.Vector3(1, 1, 1) },
    uShadowTint: { value: new THREE.Vector3(0, 0, 0) },
    uHighlightTint: { value: new THREE.Vector3(0, 0, 0) },
    uVignette: { value: 0.22 },
    uGrain: { value: 0.035 },
    uAberration: { value: 1.2 },
  },
  vertexShader: VERT,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime, uContrast, uSaturation, uVignette, uGrain, uAberration;
uniform vec3 uLift, uGain, uShadowTint, uHighlightTint;
varying vec2 vUv;
${HASH}
void main() {
  vec2 d = vUv - 0.5;
  float r = length(d) * 1.41421356;              // 0 at centre, 1 at the corners
  vec2 dir = d / max(length(d), 1e-5);
  vec2 off = dir * r * r * uAberration / uResolution;
  vec3 col;
  col.r = texture2D(tDiffuse, vUv - off).r;
  col.g = texture2D(tDiffuse, vUv).g;
  col.b = texture2D(tDiffuse, vUv + off).b;

  col = col * uGain + uLift * (1.0 - col);       // lift / gain
  col = (col - 0.5) * uContrast + 0.5;            // contrast around mid grey
  float l = luma(col);
  col = mix(vec3(l), col, uSaturation);
  col += uShadowTint * (1.0 - smoothstep(0.0, 0.55, l));     // split toning
  col += uHighlightTint * smoothstep(0.45, 1.0, l);

  col *= 1.0 - uVignette * smoothstep(0.35, 1.05, r);

  float frame = floor(uTime * 24.0);                         // grain changes at 24 fps, like film
  float g = hash12(gl_FragCoord.xy + frame * 37.0) - 0.5;
  col += g * uGrain * (0.25 + 3.0 * l * (1.0 - l));          // strongest in mid tones
  col += (hash12(gl_FragCoord.xy * 1.7 + 11.0) - 0.5) / 255.0; // kills gradient banding
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`,
};

export function createFinishPass(opts = {}) {
  const pass = new ShaderPass(FinishShader);
  pass.name = 'finish';
  setFinish(pass, opts);
  return pass;
}

/** Update grade values: { contrast, saturation, lift:[r,g,b], gain:[r,g,b], shadowTint, highlightTint, vignette, grain, aberration } */
export function setFinish(pass, o = {}) {
  const u = pass.uniforms;
  if (o.contrast !== undefined) u.uContrast.value = o.contrast;
  if (o.saturation !== undefined) u.uSaturation.value = o.saturation;
  if (o.lift) u.uLift.value.copy(v3(o.lift));
  if (o.gain) u.uGain.value.copy(v3(o.gain));
  if (o.shadowTint) u.uShadowTint.value.copy(v3(o.shadowTint));
  if (o.highlightTint) u.uHighlightTint.value.copy(v3(o.highlightTint));
  if (o.vignette !== undefined) u.uVignette.value = o.vignette;
  if (o.grain !== undefined) u.uGrain.value = o.grain;
  if (o.aberration !== undefined) u.uAberration.value = o.aberration;
}

// ---------------------------------------------------------------------------------------------
// Look: print (ordered dither / halftone)
// ---------------------------------------------------------------------------------------------
const PrintShader = {
  name: 'AsuraPrint',
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uCell: { value: 3.0 },
    uMode: { value: 0 },
    uLevels: { value: 2 },
    uMix: { value: 1 },
    uInk: { value: new THREE.Vector3(0.08, 0.08, 0.09) },
    uPaper: { value: new THREE.Vector3(0.93, 0.91, 0.86) },
  },
  vertexShader: VERT,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uCell, uMode, uLevels, uMix;
uniform vec3 uInk, uPaper;
varying vec2 vUv;
${HASH}
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
void main() {
  vec3 src = texture2D(tDiffuse, vUv).rgb;
  vec3 outc;
  if (uMode < 0.5) {
    vec2 cell = floor(gl_FragCoord.xy / uCell);
    vec2 uv = (cell + 0.5) * uCell / uResolution;
    float l = luma(texture2D(tDiffuse, uv).rgb);
    float q = floor(l * uLevels + bayer8(cell)) / uLevels;
    outc = mix(uInk, uPaper, clamp(q, 0.0, 1.0));
  } else {
    const float s = 0.70710678;
    mat2 rot = mat2(s, -s, s, s);
    vec2 p = rot * gl_FragCoord.xy / uCell;
    vec2 centre = transpose(rot) * ((floor(p) + 0.5) * uCell);
    float l = luma(texture2D(tDiffuse, centre / uResolution).rgb);
    float radius = sqrt(max(1.0 - l, 0.0)) * 0.62;
    float dist = length(fract(p) - 0.5);
    float aa = fwidth(dist);
    float ink = 1.0 - smoothstep(radius - aa, radius + aa, dist);
    outc = mix(uPaper, uInk, ink);
  }
  gl_FragColor = vec4(mix(src, outc, uMix), 1.0);
}`,
};

// ---------------------------------------------------------------------------------------------
// Look: paper (duotone + edge lines)
// ---------------------------------------------------------------------------------------------
const PaperShader = {
  name: 'AsuraPaper',
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uInk: { value: new THREE.Vector3(0.12, 0.12, 0.13) },
    uPaper: { value: new THREE.Vector3(0.94, 0.92, 0.87) },
    uEdges: { value: 2.5 },
    uMix: { value: 1 },
  },
  vertexShader: VERT,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec3 uInk, uPaper;
uniform float uEdges, uMix;
varying vec2 vUv;
${HASH}
float L(vec2 o) { return luma(texture2D(tDiffuse, vUv + o / uResolution).rgb); }
void main() {
  float tl = L(vec2(-1, 1)), t = L(vec2(0, 1)), tr = L(vec2(1, 1));
  float ml = L(vec2(-1, 0)),                     mr = L(vec2(1, 0));
  float bl = L(vec2(-1, -1)), b = L(vec2(0, -1)), br = L(vec2(1, -1));
  float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
  float gy = (tl + 2.0 * t + tr) - (bl + 2.0 * b + br);
  float edge = length(vec2(gx, gy));
  vec3 src = texture2D(tDiffuse, vUv).rgb;
  float tone = smoothstep(0.06, 0.94, luma(src));
  vec3 col = mix(uInk, uPaper, tone);
  col = mix(col, uInk, clamp(edge * uEdges, 0.0, 1.0));
  col += hash12(floor(gl_FragCoord.xy * 0.5)) * 0.05 - 0.025;   // paper fibre
  gl_FragColor = vec4(mix(src, col, uMix), 1.0);
}`,
};

// ---------------------------------------------------------------------------------------------
// Look: miniature (tilt-shift, separable 9-tap gaussian)
// ---------------------------------------------------------------------------------------------
const TiltShader = {
  name: 'AsuraTilt',
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uDir: { value: new THREE.Vector2(1, 0) },
    uFocus: { value: 0.5 },
    uBand: { value: 0.12 },
    uBlur: { value: 3.0 },
  },
  vertexShader: VERT,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution, uDir;
uniform float uFocus, uBand, uBlur;
varying vec2 vUv;
void main() {
  float m = smoothstep(uBand, uBand + 0.28, abs(vUv.y - uFocus));
  vec2 st = uDir * m * uBlur / uResolution;
  vec3 c = texture2D(tDiffuse, vUv).rgb * 0.2270270270;
  c += texture2D(tDiffuse, vUv + st * 1.3846153846).rgb * 0.3162162162;
  c += texture2D(tDiffuse, vUv - st * 1.3846153846).rgb * 0.3162162162;
  c += texture2D(tDiffuse, vUv + st * 3.2307692308).rgb * 0.0702702703;
  c += texture2D(tDiffuse, vUv - st * 3.2307692308).rgb * 0.0702702703;
  gl_FragColor = vec4(c, 1.0);
}`,
};

/**
 * Build the passes for a look. Options:
 *   print:     { mode: 'dither'|'halftone', cell: 3, levels: 2, ink: '#hex', paper: '#hex', mix: 1 }
 *   paper:     { ink, paper, edges: 2.5, mix: 1 }
 *   miniature: { focus: 0.5, band: 0.12, blur: 3 }
 */
export function createLookPasses(name = 'cinematic', o = {}) {
  if (name === 'print') {
    const p = new ShaderPass(PrintShader);
    p.name = 'look:print';
    p.uniforms.uMode.value = o.mode === 'halftone' ? 1 : 0;
    p.uniforms.uCell.value = o.cell ?? (o.mode === 'halftone' ? 6 : 3);
    p.uniforms.uLevels.value = o.levels ?? 2;
    p.uniforms.uMix.value = o.mix ?? 1;
    if (o.ink) p.uniforms.uInk.value.copy(displayColor(o.ink));
    if (o.paper) p.uniforms.uPaper.value.copy(displayColor(o.paper));
    return [p];
  }
  if (name === 'paper') {
    const p = new ShaderPass(PaperShader);
    p.name = 'look:paper';
    p.uniforms.uEdges.value = o.edges ?? 2.5;
    p.uniforms.uMix.value = o.mix ?? 1;
    if (o.ink) p.uniforms.uInk.value.copy(displayColor(o.ink));
    if (o.paper) p.uniforms.uPaper.value.copy(displayColor(o.paper));
    return [p];
  }
  if (name === 'miniature') {
    const h = new ShaderPass(TiltShader);
    const v = new ShaderPass(TiltShader);
    h.name = 'look:tilt-h';
    v.name = 'look:tilt-v';
    v.uniforms.uDir.value.set(0, 1);
    for (const p of [h, v]) {
      p.uniforms.uFocus.value = o.focus ?? 0.5;
      p.uniforms.uBand.value = o.band ?? 0.12;
      p.uniforms.uBlur.value = o.blur ?? 3;
    }
    return [h, v];
  }
  return [];
}
