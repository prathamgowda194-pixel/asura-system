/**
 * TERRA NOVA // SOVEREIGN EXPEDITIONS
 * Svalbard 78°N · Arctic Circle · Extreme Earth Traverses
 * Powered by Asura v3.1 WebGL Sovereign Engine
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { createEngine } from './js/engine/core.js';
import { createScroll } from './js/engine/scroll.js';
import { createRig } from './js/engine/rig.js';
import { installQA } from './js/engine/qa.js';
import { setupReveals, setupHeader } from './js/engine/motion.js';
import { createSky, SKY_PRESETS } from './js/recipes/sky.js';
import { installHeightFog } from './js/recipes/fog.js';
import { createTerrain, smoothstep } from './js/recipes/terrain.js';
import { createWater } from './js/recipes/water.js';
import { block, deck, glazing, fins, pool, panel } from './js/recipes/architecture.js';
import { surface, materials, setEmissive } from './js/recipes/materials.js';
import { createTrees, clusters } from './js/recipes/vegetation.js';
import { createDust } from './js/recipes/particles.js';
import { createAmbience } from './js/moves/sound.js';

const params = new URLSearchParams(location.search);
const SEA_LEVEL = -18;

// Arctic sky presets calibrated for 78° North Svalbard horizons
const PRESETS = {
  ...SKY_PRESETS,
  golden: { ...SKY_PRESETS.golden, azimuth: 340, elevation: 9, sunIntensity: 2.9, envIntensity: 0.95 },
  sunset: { ...SKY_PRESETS.sunset, azimuth: 300, elevation: 5, sunIntensity: 2.3, envIntensity: 0.85 },
  dusk: { ...SKY_PRESETS.dusk, azimuth: 280, elevation: -2, sunIntensity: 1.0, envIntensity: 0.65 },
  night: { ...SKY_PRESETS.night, azimuth: 115, elevation: 28, sunIntensity: 0.62, envIntensity: 0.48 },
};

// Five cinematic architectural camera shots
const KEYFRAMES = [
  { at: '#intro', pos: [132, 35, 74], target: [-16, -2, 16], fov: 28, hold: 0.04, state: { tod: 0 } },
  { at: '#basecamp', pos: [-54, 2.0, -11.2], target: [4, 3.6, -7.2], fov: 32, hold: 0.04, state: { tod: 0.14 } },
  // Level camera at human eye height with vertical shift: prevents wall keystoning
  { at: '#cantilever', pos: [42, 1.8, 18.0], target: [16, 1.8, 1.4], fov: 35, shift: [0, -0.12], hold: 0.06, state: { tod: 0.38 } },
  // Intimate waterline shot looking across the geothermal basin into the polar twilight
  { at: '#geothermal', pos: [10.2, 0.8, 12.2], target: [-20, 1.2, 9.4], fov: 32, hold: 0.06, state: { tod: 0.65 } },
  // High-altitude twilight panorama as polar ribbons illuminate the mountains and basecamp
  { at: '#aurora', pos: [-32, 38, 80], target: [2, 1, -7], fov: 28, state: { tod: 1.0 } },
];

boot().catch((err) => {
  if (err?.name === 'AsuraFallback') console.info('[asura]', err.message);
  else console.error('[asura] WebGL scene fallback activated', err);
  document.documentElement.classList.add('no-webgl', 'is-ready');
  setupHeader();
});

async function boot() {
  // Low-lying glacial fjord mist
  installHeightFog({ base: SEA_LEVEL, falloff: 0.045, floor: 0.30 });

  const engine = createEngine({
    canvas: document.getElementById('stage'),
    fov: 28,
    toneMapping: params.get('tone') ?? 'aces',
    bloom: { strength: 0.42, radius: 0.70, threshold: 1.0 },
    finish: {
      contrast: 1.12,
      saturation: 1.06,
      vignette: 0.22,
      grain: 0.028,
      shadowTint: [-0.005, 0.001, 0.015],
      highlightTint: [0.012, 0.008, -0.004],
    },
  });
  const { scene, camera, tier } = engine;
  const sky = createSky(engine, {
    presets: PRESETS,
    preset: 'golden',
    focus: [2, 0, 0],
    shadowSize: 56,
    shadowDistance: 240,
  });

  if (params.get('look')) engine.setLook(params.get('look'), { ink: '#0c0f12', paper: '#eef2f6' });

  // ------------------------------------------------------------------ Terrain and Glacial Fjord
  const land = createTerrain({
    size: 1300,
    segments: Math.round(260 * Math.sqrt(tier.density)),
    height: 9,
    scale: 0.006,
    seed: 23,
    shape: (x, z) => {
      // Fjord cliff edge jutting into the icy waters
      const edge = 46 + Math.sin(x * 0.026) * 9 + Math.sin(x * 0.012 + 1.4) * 16;
      const cliff = -36 * smoothstep(edge, edge + 24, z);
      const peaks = 36 * smoothstep(-80, -360, z) + 16 * smoothstep(140, 420, Math.abs(x)) * smoothstep(30, -120, z);
      return cliff + peaks;
    },
    pads: [{ x: 0, z: 0, radius: 38, feather: 32, y: -0.4 }],
    sandLevel: SEA_LEVEL + 0.8,
    colors: { low: '#3d464f', high: '#e2e8f0', rock: '#2a3138', sand: '#828c96' },
  });
  scene.add(land.mesh);

  const fjord = createWater({
    size: 8000,
    color: '#081a26',
    repeat: 340,
    normalScale: 0.44,
    speed: 0.011,
    roughness: 0.05,
  });
  fjord.mesh.position.y = SEA_LEVEL;
  scene.add(fjord.mesh);

  // ------------------------------------------------------------------ Procedural PBR Materials
  const charredLarch = surface('wood', { color: '#25282b', tile: 1.5, bump: 0.75, seed: 9 });
  const zincDeck = surface('concrete', { color: '#383e44', tile: 2.2, bump: 0.40, seed: 14, pores: 1 });
  const obsidianStone = surface('stone', { color: '#2b3036', tile: 2.0, bump: 0.50, seed: 6, strata: 0.28, roughness: 1.35 });
  const gravelPath = surface('concrete', { color: '#525b63', tile: 1.6, bump: 0.85, seed: 15, pores: 3 });
  const cedar = surface('wood', { color: '#865e3f', tile: 1.2, bump: 0.35, seed: 4 });
  const titaniumFrame = materials.metal({ color: '#22262a', roughness: 0.40 });
  const starphireGlass = materials.glass({ tint: '#a2cad2', cheap: tier.name === 'low' });
  const warmInterior = materials.emissive('#ffba75', 0.70);
  const ribbonGlow = materials.emissive('#38bdf8', 0.22);
  const poolTile = new THREE.MeshStandardMaterial({ color: '#26919a', roughness: 0.20 });

  // ------------------------------------------------------------------ Expedition Basecamp Architecture
  const basecamp = new THREE.Group();
  basecamp.name = 'terra-basecamp';
  scene.add(basecamp);

  // Main obsidian terrace slab with opening for geothermal pool
  basecamp.add(deck({
    w: 52,
    d: 28,
    h: 0.6,
    hole: { x: -4, z: 9.0, w: 24, d: 5.0 },
    material: obsidianStone,
    at: [0, -0.4, 1.8],
  }));

  // Geothermal Mineral Pool (24m long, 5m wide, facing the polar horizon)
  const poolWater = createWater({
    width: 24,
    depth: 5.0,
    color: '#1a7e88',
    repeat: 3.5,
    normalScale: 0.08,
    speed: 0.007,
    roughness: 0.03,
    glowColor: '#38bdf8',
  });
  basecamp.add(pool({ w: 24, d: 5.0, depth: 1.6, water: poolWater, tile: poolTile, at: [-4, 0.2, 10.5] }));

  // The 48m Charred Larch Spinal Hangar anchoring into permafrost
  basecamp.add(block({ w: 48, h: 4.0, d: 0.85, material: charredLarch, at: [-2, 0.2, -6.6] }));
  // Arctic approach boardwalk
  basecamp.add(block({ w: 60, h: 0.08, d: 2.8, r: 0, material: gravelPath, at: [-44, -0.4, -10.2] }));

  // Ground Floor: Panoramic Glacial Observation Pavilion
  basecamp.add(glazing({ w: 24, h: 3.6, glass: starphireGlass, frame: titaniumFrame, spacing: 2.8, at: [-4, 0.2, 3.4] }));
  basecamp.add(glazing({ w: 9.8, h: 3.6, glass: starphireGlass, frame: titaniumFrame, spacing: 2.8, at: [-16, 0.2, -1.6], rotY: Math.PI / 2 }));
  basecamp.add(glazing({ w: 9.8, h: 3.6, glass: starphireGlass, frame: titaniumFrame, spacing: 2.8, at: [8, 0.2, -1.6], rotY: Math.PI / 2 }));
  basecamp.add(panel({ w: 23.6, h: 3.4, material: warmInterior, at: [-4, 0.25, -6.1] }));

  // Ground Floor Exploration Gear & Command Modules
  basecamp.add(block({ w: 5.0, h: 0.95, d: 1.2, material: zincDeck, at: [-10.8, 0.2, -3.0] }));
  basecamp.add(block({ w: 3.8, h: 0.44, d: 1.1, r: 0.08, material: charredLarch, at: [2.0, 0.2, -0.6] }));
  basecamp.add(block({ w: 3.8, h: 0.80, d: 0.28, r: 0.06, material: charredLarch, at: [2.0, 0.2, -1.22] }));
  basecamp.add(block({ w: 3.0, h: 0.06, d: 1.1, material: cedar, at: [-5.0, 0.96, 0.6] }));
  basecamp.add(block({ w: 0.12, h: 0.76, d: 0.9, material: titaniumFrame, at: [-6.4, 0.2, 0.6] }));
  basecamp.add(block({ w: 0.12, h: 0.76, d: 0.9, material: titaniumFrame, at: [-3.6, 0.2, 0.6] }));

  // Upper Floor: 18m Cantilever Observation Wing
  basecamp.add(block({ w: 24.6, h: 0.35, d: 10.4, material: zincDeck, at: [-4, 3.8, -1.4] }));
  basecamp.add(block({ w: 30, h: 3.8, d: 11.0, material: zincDeck, at: [7, 4.15, 0.2] }));
  basecamp.add(panel({ w: 25.4, h: 1.9, material: ribbonGlow, at: [7, 5.10, 5.68] }));
  basecamp.add(glazing({ w: 25.8, h: 2.1, glass: starphireGlass, frame: titaniumFrame, spacing: 2.8, at: [7, 5.00, 5.72] }));
  basecamp.add(panel({ w: 9.8, h: 3.3, material: ribbonGlow, at: [21.81, 4.40, 0.2], rotY: Math.PI / 2 }));
  basecamp.add(glazing({ w: 10.2, h: 3.5, glass: starphireGlass, frame: titaniumFrame, spacing: 2.4, at: [21.83, 4.30, 0.2], rotY: Math.PI / 2 }));
  // Western polar wind shielding cedar fins
  basecamp.add(fins({ count: 20, spacing: 0.58, w: 0.08, h: 3.8, d: 0.44, material: cedar, at: [22.14, 4.15, 0.2], rotY: Math.PI / 2 }));
  basecamp.add(block({ w: 30.8, h: 0.32, d: 11.8, r: 0.02, material: zincDeck, at: [7, 7.95, 0.2] }));

  // Interior exploration night illumination lamps
  const lamps = [[-10.0, 3.0, 0.2], [1.0, 3.0, 0.2]].map(([x, y, z]) => {
    const l = new THREE.PointLight('#ffba75', 0, 18, 2);
    l.position.set(x, y, z);
    basecamp.add(l);
    return l;
  });

  // ------------------------------------------------------------------ Arctic Flora & Pine Clusters
  const clearOfBasecamp = (x, z) =>
    (x > -38 && x < 34 && z > -19 && z < 22) || z > 34 || (x < -24 && x > -86 && z > -28 && z < -3);

  const plants = [
    // Hardy wind-breaking arctic pines framing the approach axis
    ...Array.from({ length: 12 }, (_, i) => ({ kind: 'cypress', x: -46 + i * 4.4, z: -15.0, scale: 1.0, keep: true })),
    // Ancient weathered pines on the ridge
    { kind: 'umbrellaPine', x: 38, z: -30, scale: 1.15, keep: true },
    { kind: 'umbrellaPine', x: -5, z: -42, scale: 1.20, keep: true },
    // Dwarf alpine birch and scrub along the rocks
    { kind: 'round', x: 28, z: -12, scale: 0.9, keep: true },
    { kind: 'round', x: 34, z: -17, scale: 0.95, keep: true },
    { kind: 'shrub', x: -34, z: 14, scale: 1.0, keep: true },
    ...clusters({ groups: 16, perGroup: 7, area: [-340, -340, 340, -50], spread: 28, minDist: 9, seed: 8, avoid: clearOfBasecamp }).map((p) => ({ ...p, kind: 'umbrellaPine' })),
    ...clusters({ groups: 8, perGroup: 5, area: [-160, -85, 160, -28], spread: 15, minDist: 7, seed: 10, avoid: clearOfBasecamp }).map((p) => ({ ...p, kind: 'round' })),
    ...clusters({ groups: 14, perGroup: 6, area: [-190, -34, 190, 38], spread: 9, minDist: 3.5, seed: 14, avoid: clearOfBasecamp }).map((p) => ({ ...p, kind: 'shrub' })),
  ];
  const trees = createTrees(plants, { heightAt: land.heightAt, density: Math.max(0.5, tier.density) });
  scene.add(trees.group);

  // Drifting ice crystal / snow flurry dust motes
  const dust = createDust({ count: 1000, box: [80, 16, 60], center: [0, 5, 4], density: tier.density, size: 2.6, opacity: 0.55 });
  scene.add(dust.points);

  // ------------------------------------------------------------------ Web Audio Arctic Ambience
  const soundBtn = document.querySelector('.sound-toggle');
  if (soundBtn) {
    createAmbience({ kind: 'wind', volume: 0.18, button: soundBtn });
  }

  // ------------------------------------------------------------------ Story & Camera Rig
  const scroll = createScroll();
  const rig = createRig(camera, { keyframes: KEYFRAMES, reducedMotion: scroll.reduced });
  const layout = () => rig.layout((sel, align) => scroll.progressOf(sel, align));
  layout();
  window.addEventListener('resize', layout);
  document.fonts?.ready.then(layout);

  const timeOfDay = sky.sequence(['golden', 'sunset', 'dusk', 'night']);
  const fixedTod = params.has('tod') ? Number(params.get('tod')) : null;

  function applyState(state) {
    const t = fixedTod ?? state.tod ?? 0;
    timeOfDay(t);
    const evening = smoothstep(0.40, 0.88, t);
    const dark = smoothstep(0.70, 1.0, t);
    setEmissive(warmInterior, 0.70 + evening * 5.5);
    setEmissive(ribbonGlow, 0.15 + evening * 3.8);
    poolWater.setGlow(dark * 0.95);
    for (const l of lamps) l.intensity = dark * 40;
    dust.uniforms.uOpacity.value = 0.55 * (1 - evening) + 0.08;
  }

  // Charter form submission handling
  const form = document.getElementById('charter-form');
  const feedback = document.getElementById('form-feedback');
  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.style.display = 'block';
      form.querySelector('button[type="submit"]').style.display = 'none';
    });
  }

  const qa = installQA({
    engine,
    scroll,
    rig,
    onJump: () => {
      applyState(rig.current.state);
      sky.update(0, { force: true });
    },
  });

  applyState({ tod: 0 });
  await engine.renderer.compileAsync(scene, camera);
  setupReveals({ reduced: scroll.reduced });
  setupHeader();

  let frameCount = 0;
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add((time, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 1 / 20);
    const s = scroll.raf(time * 1000);
    const { state } = rig.update(dt, s.progress);
    applyState(state);
    sky.update(dt);
    fjord.update(dt);
    poolWater.update(dt);
    trees.update(dt);
    dust.update(dt, { sunDir: sky.sunDir });
    engine.render(dt);
    if (++frameCount === 3) qa.markReady();
  });
}
