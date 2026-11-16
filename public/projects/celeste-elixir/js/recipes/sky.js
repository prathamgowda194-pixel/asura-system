/**
 * Procedural sky + matching image-based lighting + sun light + fog, from one set of values.
 *
 * Why: lighting looks "real" when the sky you see, the reflections on every material, the sun
 * direction and the fog colour all agree. This recipe derives all four from one preset.
 *
 *   const sky = createSky(engine, { preset: 'golden', focus: [0, 0, 0], shadowSize: 40 });
 *   sky.set('dusk');                                // jump to a preset
 *   sky.set('golden', { elevation: 6 });           // preset with overrides
 *   const tod = sky.sequence(['golden', 'sunset', 'dusk', 'night']);
 *   tod(0.4);                                       // blend along a sequence (drive with scroll)
 *   sky.update(dt);                                 // every frame (follows camera, refreshes env map)
 *
 * Presets: dawn, morning, noon, golden, sunset, dusk, night, overcast. Values are art-directed,
 * not physical. Copy one into SKY_PRESETS-style object and tune it to the concept palette.
 */
import * as THREE from 'three';
import { NOISE_GLSL } from './noise.js';

// fog: colour of distant haze. Defaults to the horizon pulled 22% toward the zenith, which gives
// aerial perspective (far things go slightly cooler than the horizon behind them).
// Key/fill: sunIntensity is the key, envIntensity the fill. Keep the ratio high (4:1 or more) for form.
export const SKY_PRESETS = {
  dawn: { zenith: '#41618f', horizon: '#e7b8a2', ground: '#39343a', sun: '#ffc79c', elevation: 3, azimuth: 95, sunIntensity: 2.0, envIntensity: 0.6, exposure: 1.05, fogDensity: 0.0035, haze: 0.9, clouds: 0.25, stars: 0 },
  morning: { zenith: '#3b77c2', horizon: '#c9dff0', ground: '#5d5950', sun: '#fff0db', elevation: 24, azimuth: 115, sunIntensity: 3.6, envIntensity: 0.8, exposure: 1.0, fogDensity: 0.0022, haze: 0.6, clouds: 0.3, stars: 0 },
  noon: { zenith: '#2e69b0', horizon: '#b9d5ec', ground: '#6a655b', sun: '#fffaf0', elevation: 62, azimuth: 165, sunIntensity: 4.0, envIntensity: 0.85, exposure: 0.92, fogDensity: 0.0016, haze: 0.5, clouds: 0.25, stars: 0 },
  golden: { zenith: '#4a6ea6', horizon: '#f2c79a', ground: '#3e3833', sun: '#ffb571', elevation: 9, azimuth: 250, sunIntensity: 3.4, envIntensity: 0.65, exposure: 1.0, fogDensity: 0.0028, haze: 0.9, clouds: 0.18, stars: 0 },
  sunset: { zenith: '#3c4b75', horizon: '#ec9b6f', ground: '#3a2e2c', sun: '#ff8b4f', elevation: 2.5, azimuth: 255, sunIntensity: 2.2, envIntensity: 0.55, exposure: 1.1, fogDensity: 0.003, haze: 1.0, clouds: 0.22, stars: 0 },
  dusk: { zenith: '#1d2648', horizon: '#b4756d', fog: '#5b5566', ground: '#211b22', sun: '#ff7048', elevation: -2, azimuth: 262, sunIntensity: 0, envIntensity: 0.6, exposure: 1.3, fogDensity: 0.0032, haze: 0.8, clouds: 0.15, stars: 0.15 },
  night: { zenith: '#05080f', horizon: '#151d34', ground: '#07080b', sun: '#a9bcff', elevation: 38, azimuth: 140, sunIntensity: 0.3, envIntensity: 0.35, exposure: 1.4, fogDensity: 0.0025, haze: 0.5, clouds: 0.08, stars: 1 },
  overcast: { zenith: '#8a949c', horizon: '#c3c7c6', ground: '#5b5a55', sun: '#e8e6e0', elevation: 40, azimuth: 200, sunIntensity: 0.8, envIntensity: 1.2, exposure: 1.0, fogDensity: 0.005, haze: 1.0, clouds: 0.85, stars: 0 },
};

const vertexShader = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uZenith, uHorizon, uGround, uFog, uSunColor, uSunDir;
uniform float uDisk, uSunSize, uHaze, uClouds, uStars, uTime, uGroundMix;
varying vec3 vDir;
${NOISE_GLSL}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  float up = clamp(h, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(up, 0.55));
  col = mix(col, uHorizon, pow(1.0 - up, 10.0) * 0.6 * uHaze);

  vec3 s = normalize(uSunDir);
  float mu = max(dot(d, s), 0.0);
  float sunUp = smoothstep(-0.12, 0.05, s.y);
  col += uSunColor * (pow(mu, 6.0) * 0.18 + pow(mu, 48.0) * 0.35) * sunUp * (0.6 + 0.4 * uHaze);

  if (uClouds > 0.001 && h > 0.0) {
    vec2 p = d.xz / (h + 0.18) * 0.9 + vec2(uTime * 0.003, uTime * 0.001);
    float c = asuraFbm2(p * 1.6);
    c = smoothstep(0.55 - uClouds * 0.3, 0.88, c) * smoothstep(0.0, 0.18, h);
    vec3 lit = mix(uHorizon, vec3(1.0), 0.3) + uSunColor * pow(mu, 3.0) * 0.6 * sunUp;
    col = mix(col, lit * 0.9, c * uClouds);
  }

  if (uStars > 0.001 && h > 0.0) {
    // Stars only show where the sky is dark, as in a real dusk; round points, not square cells.
    float skyLum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    vec3 g = d * 380.0;
    vec3 cell = floor(g);
    float star = step(0.9985, asuraHash13(cell)) * asuraHash13(cell + 7.0);
    star *= 1.0 - smoothstep(0.12, 0.38, length(fract(g) - 0.5));
    float tw = 0.7 + 0.3 * sin(uTime * 2.0 + asuraHash13(cell + 3.0) * 6.283);
    col += vec3(star * tw * 4.0 * uStars) * smoothstep(0.02, 0.25, h) * (1.0 - smoothstep(0.015, 0.09, skyLum));
  }

  float disk = smoothstep(uSunSize, uSunSize + 0.00012, mu);
  col += uSunColor * disk * uDisk * smoothstep(-0.01, 0.01, h);
  // Below the horizon: fog colour on screen (so terrain edges melt away), ground colour in the env map (bounce light).
  col = mix(col, mix(uFog, uGround, uGroundMix), smoothstep(0.0, -0.05, h));
  gl_FragColor = vec4(col, 1.0);
}`;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function resolvePreset(p) {
  const zenith = new THREE.Color(p.zenith);
  const horizon = new THREE.Color(p.horizon);
  return {
    zenith,
    horizon,
    fog: p.fog ? new THREE.Color(p.fog) : horizon.clone().lerp(zenith, 0.22),
    ground: new THREE.Color(p.ground),
    sun: new THREE.Color(p.sun),
    elevation: p.elevation,
    azimuth: p.azimuth,
    sunIntensity: p.sunIntensity,
    envIntensity: p.envIntensity,
    exposure: p.exposure,
    fogDensity: p.fogDensity,
    haze: p.haze,
    clouds: p.clouds,
    stars: p.stars,
  };
}

function mixResolved(a, b, t, out) {
  for (const k of ['zenith', 'horizon', 'fog', 'ground', 'sun']) out[k].copy(a[k]).lerp(b[k], t);
  for (const k of ['elevation', 'azimuth', 'sunIntensity', 'envIntensity', 'exposure', 'fogDensity', 'haze', 'clouds', 'stars']) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
}

export function createSky(engine, opts = {}) {
  const { scene, camera, renderer, tier } = engine;
  const {
    preset = 'golden',
    presets = SKY_PRESETS,
    focus = [0, 0, 0],
    shadowSize = 40,
    shadowDistance = 160,
    castShadow = true,
    disk = 14,
    sunSize = 0.99965,
    fog = true,
    fogScale = 1,
    regenInterval = 120,
  } = opts;

  const uniforms = {
    uZenith: { value: new THREE.Color() },
    uHorizon: { value: new THREE.Color() },
    uGround: { value: new THREE.Color() },
    uFog: { value: new THREE.Color() },
    uGroundMix: { value: 0 },
    uSunColor: { value: new THREE.Color() },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uDisk: { value: disk },
    uSunSize: { value: sunSize },
    uHaze: { value: 1 },
    uClouds: { value: 0 },
    uStars: { value: 0 },
    uTime: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({ name: 'AsuraSky', uniforms, vertexShader, fragmentShader, side: THREE.BackSide, depthWrite: false });
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(camera.far * 0.9);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.name = 'sky';
  scene.add(mesh);

  const envScene = new THREE.Scene();
  const envMesh = new THREE.Mesh(geometry, material);
  envMesh.scale.setScalar(50);
  envScene.add(envMesh);
  const pmrem = new THREE.PMREMGenerator(renderer);

  if (fog) scene.fog = new THREE.FogExp2(0xffffff, 0.004);

  const focusV = new THREE.Vector3(...focus);
  const sunDir = new THREE.Vector3();
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.name = 'sun';
  sun.castShadow = castShadow && tier.shadows;
  sun.shadow.mapSize.set(tier.shadowMapSize, tier.shadowMapSize);
  Object.assign(sun.shadow.camera, { left: -shadowSize, right: shadowSize, top: shadowSize, bottom: -shadowSize, near: 1, far: shadowDistance * 2 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 4;
  sun.target.position.copy(focusV);
  scene.add(sun, sun.target);

  const resolved = Object.fromEntries(Object.entries(presets).map(([k, v]) => [k, resolvePreset(v)]));
  const scratch = resolvePreset(presets[preset] ?? SKY_PRESETS.golden);
  const current = resolvePreset(presets[preset] ?? SKY_PRESETS.golden);

  let envRT = null;
  let dirty = true;
  let lastRegen = -Infinity;
  let applied = false;

  const NUMERIC = ['elevation', 'azimuth', 'sunIntensity', 'envIntensity', 'exposure', 'fogDensity', 'haze', 'clouds', 'stars'];
  const COLORS = ['zenith', 'horizon', 'fog', 'ground', 'sun'];
  function same(v) {
    for (const k of NUMERIC) if (Math.abs(v[k] - current[k]) > 1e-4) return false;
    for (const k of COLORS) if (Math.abs(v[k].r - current[k].r) + Math.abs(v[k].g - current[k].g) + Math.abs(v[k].b - current[k].b) > 1e-4) return false;
    return true;
  }

  function apply(v) {
    // Scenes call this every frame with the scroll state. Only real changes cost an env-map rebuild.
    if (applied && same(v)) return;
    applied = true;
    mixResolved(v, v, 0, current);
    uniforms.uZenith.value.copy(v.zenith);
    uniforms.uHorizon.value.copy(v.horizon);
    uniforms.uGround.value.copy(v.ground);
    uniforms.uFog.value.copy(v.fog);
    uniforms.uSunColor.value.copy(v.sun);
    uniforms.uHaze.value = v.haze;
    uniforms.uClouds.value = v.clouds;
    uniforms.uStars.value = v.stars;
    const el = THREE.MathUtils.degToRad(v.elevation);
    const az = THREE.MathUtils.degToRad(v.azimuth);
    sunDir.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    uniforms.uSunDir.value.copy(sunDir);
    sun.color.copy(v.sun);
    sun.intensity = v.sunIntensity * smooth(-0.02, 0.06, sunDir.y);
    sun.position.copy(focusV).addScaledVector(sunDir, shadowDistance);
    scene.environmentIntensity = v.envIntensity;
    renderer.toneMappingExposure = v.exposure;
    if (scene.fog) {
      scene.fog.color.copy(v.fog);
      scene.fog.density = v.fogDensity * fogScale;
    }
    dirty = true;
  }

  function withOverrides(name, overrides) {
    const base = presets[name] ?? SKY_PRESETS[name];
    if (!base) throw new Error(`Unknown sky preset "${name}"`);
    return overrides ? resolvePreset({ ...base, ...overrides }) : resolved[name] ?? resolvePreset(base);
  }

  function set(name, overrides) {
    apply(withOverrides(name, overrides));
  }

  function blend(a, b, t) {
    apply(mixResolved(withOverrides(a), withOverrides(b), Math.min(1, Math.max(0, t)), scratch));
  }

  function sequence(names) {
    return (t) => {
      const x = Math.min(1, Math.max(0, t)) * (names.length - 1);
      const i = Math.min(Math.floor(x), names.length - 2);
      blend(names[i], names[i + 1], x - i);
    };
  }

  function regenerate() {
    const d = uniforms.uDisk.value;
    uniforms.uDisk.value = 0; // the sun light handles direct light; keep the disk out of reflections
    uniforms.uGroundMix.value = 1; // lower hemisphere = ground bounce in the env map
    const rt = pmrem.fromScene(envScene, 0, 0.1, 100);
    uniforms.uDisk.value = d;
    uniforms.uGroundMix.value = 0;
    scene.environment = rt.texture;
    envRT?.dispose();
    envRT = rt;
    dirty = false;
    lastRegen = performance.now();
  }

  function update(dt, { force = false } = {}) {
    mesh.position.copy(camera.position);
    uniforms.uTime.value += dt;
    if (dirty && (force || performance.now() - lastRegen > regenInterval)) regenerate();
  }

  set(preset);
  regenerate();

  return { mesh, material, uniforms, sun, sunDir, current, set, blend, sequence, update, regenerate, presets };
}
