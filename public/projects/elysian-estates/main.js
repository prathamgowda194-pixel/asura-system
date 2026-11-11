/**
 * Elysian Estates · Haute-Couture Architectural Estate
 * Cap Martin, Côte d'Azur, France
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
const SEA_LEVEL = -16;

// Sky presets calibrated for the Cap Martin Mediterranean horizon
const PRESETS = {
  ...SKY_PRESETS,
  golden: { ...SKY_PRESETS.golden, azimuth: 335, elevation: 13, sunIntensity: 2.8, envIntensity: 0.95 },
  sunset: { ...SKY_PRESETS.sunset, azimuth: 305, elevation: 6, sunIntensity: 2.2, envIntensity: 0.85 },
  dusk: { ...SKY_PRESETS.dusk, azimuth: 290, elevation: 1, sunIntensity: 1.1, envIntensity: 0.65 },
  night: { ...SKY_PRESETS.night, azimuth: 110, elevation: 30, sunIntensity: 0.58, envIntensity: 0.45 },
};

// Five cinematic architectural camera shots
const KEYFRAMES = [
  { at: '#intro', pos: [126, 32, 70], target: [-15, -2, 15], fov: 29, hold: 0.04, state: { tod: 0 } },
  { at: '#arrival', pos: [-50, 1.8, -10.5], target: [3, 3.4, -7.0], fov: 33, hold: 0.04, state: { tod: 0.14 } },
  // Level camera at human eye height with vertical shift: prevents wall keystoning
  { at: '#cantilever', pos: [38, 1.6, 16.5], target: [14, 1.6, 1.2], fov: 36, shift: [0, -0.12], hold: 0.06, state: { tod: 0.38 } },
  // Intimate waterline shot looking across the infinity edge straight into the dusk gradient
  { at: '#water', pos: [9.5, 0.75, 11.5], target: [-18, 1.1, 9.2], fov: 33, hold: 0.06, state: { tod: 0.65 } },
  // Twilight aerial panorama looking back at the glowing glass pavilions against the starlit Mediterranean
  { at: '#night', pos: [-28, 36, 76], target: [2, 1, -7], fov: 29, state: { tod: 1.0 } },
];

boot().catch((err) => {
  if (err?.name === 'AsuraFallback') console.info('[asura]', err.message);
  else console.error('[asura] WebGL scene fallback activated', err);
  document.documentElement.classList.add('no-webgl', 'is-ready');
  setupHeader();
});

async function boot() {
  // Low-lying Mediterranean coastal mist
  installHeightFog({ base: SEA_LEVEL, falloff: 0.05, floor: 0.32 });

  const engine = createEngine({
    canvas: document.getElementById('stage'),
    fov: 28,
    toneMapping: params.get('tone') ?? 'aces',
    bloom: { strength: 0.38, radius: 0.65, threshold: 1.0 },
    finish: {
      contrast: 1.10,
      saturation: 1.08,
      vignette: 0.24,
      grain: 0.030,
      shadowTint: [-0.003, 0.002, 0.012],
      highlightTint: [0.015, 0.006, -0.005],
    },
  });
  const { scene, camera, tier } = engine;
  const sky = createSky(engine, {
    presets: PRESETS,
    preset: 'golden',
    focus: [2, 0, 0],
    shadowSize: 52,
    shadowDistance: 220,
  });

  if (params.get('look')) engine.setLook(params.get('look'), { ink: '#141719', paper: '#f1ede6' });

  // ------------------------------------------------------------------ Terrain and Mediterranean Sea
  const land = createTerrain({
    size: 1200,
    segments: Math.round(250 * Math.sqrt(tier.density)),
    height: 7,
    scale: 0.0065,
    seed: 17,
    shape: (x, z) => {
      // Promontory edge jutting into the sea
      const edge = 42 + Math.sin(x * 0.028) * 8 + Math.sin(x * 0.011 + 1.2) * 14;
      const cliff = -32 * smoothstep(edge, edge + 22, z);
      const hills = 28 * smoothstep(-80, -340, z) + 12 * smoothstep(130, 400, Math.abs(x)) * smoothstep(25, -110, z);
      return cliff + hills;
    },
    pads: [{ x: 0, z: 0, radius: 36, feather: 30, y: -0.4 }],
    sandLevel: SEA_LEVEL + 0.8,
    colors: { low: '#54633b', high: '#9e8d5e', rock: '#9c9285', sand: '#d4c29c' },
  });
  scene.add(land.mesh);

  const sea = createWater({
    size: 7500,
    color: '#0a3240',
    repeat: 320,
    normalScale: 0.48,
    speed: 0.013,
    roughness: 0.06,
  });
  sea.mesh.position.y = SEA_LEVEL;
  scene.add(sea.mesh);

  // ------------------------------------------------------------------ Procedural PBR Materials
  const travertine = surface('stone', { color: '#e0d4c1', tile: 1.8, travertine: true, bump: 0.85, seed: 7 });
  const terraceStone = surface('stone', { color: '#dbd0bd', tile: 2.2, bump: 0.42, seed: 12, strata: 0.22, roughness: 1.3 });
  const concrete = surface('concrete', { color: '#b6aea2', tile: 2.4, boards: 22, bump: 0.55, seed: 5 });
  const gravel = surface('concrete', { color: '#cdc2ad', tile: 1.6, bump: 0.85, seed: 11, pores: 2 });
  const cedar = surface('wood', { color: '#886244', tile: 1.2, bump: 0.35, seed: 3 });
  const oak = surface('wood', { color: '#9e7b57', tile: 1.1, seed: 8 });
  const plaster = surface('plaster', { color: '#eae3d6', tile: 2 });
  const fabric = materials.clay('#74685b', 0.94);
  const bronzeFrame = materials.metal({ color: '#38322c', roughness: 0.44 });
  const starphireGlass = materials.glass({ tint: '#b8d6d8', cheap: tier.name === 'low' });
  const warmInterior = materials.emissive('#ffcf9e', 0.65);
  const ribbonGlow = materials.emissive('#ffd09b', 0.20);
  const poolTile = new THREE.MeshStandardMaterial({ color: '#4ebfc4', roughness: 0.25 });

  // ------------------------------------------------------------------ Architectural Compound
  const house = new THREE.Group();
  house.name = 'elysian-residence';
  scene.add(house);

  // Main terrace slab with opening for the cantilever pool (0.4m above ground)
  house.add(deck({
    w: 50,
    d: 26,
    h: 0.6,
    hole: { x: -4, z: 8.5, w: 24, d: 4.8 },
    material: terraceStone,
    at: [0, -0.4, 1.5],
  }));

  // Cantilever Infinity Pool (24m long, 4.8m wide, facing west)
  const poolWater = createWater({
    width: 24,
    depth: 4.8,
    color: '#26919a',
    repeat: 3.5,
    normalScale: 0.08,
    speed: 0.008,
    roughness: 0.03,
    glowColor: '#4fd0cc',
  });
  house.add(pool({ w: 24, d: 4.8, depth: 1.6, water: poolWater, tile: poolTile, at: [-4, 0.2, 10] }));

  // The 44m Fluted Travertine Spinal Wall anchoring into bedrock
  house.add(block({ w: 44, h: 3.6, d: 0.75, material: travertine, at: [-2, 0.2, -6.2] }));
  // Private gravel arrival walkway flanked by cypress trees
  house.add(block({ w: 56, h: 0.08, d: 2.6, r: 0, material: gravel, at: [-42, -0.4, -9.8] }));

  // Ground Floor: Oceanfront Glass Pavilion
  house.add(glazing({ w: 22, h: 3.4, glass: starphireGlass, frame: bronzeFrame, spacing: 2.6, at: [-4, 0.2, 3.2] }));
  house.add(glazing({ w: 9.4, h: 3.4, glass: starphireGlass, frame: bronzeFrame, spacing: 2.8, at: [-15, 0.2, -1.5], rotY: Math.PI / 2 }));
  house.add(glazing({ w: 9.4, h: 3.4, glass: starphireGlass, frame: bronzeFrame, spacing: 2.8, at: [7, 0.2, -1.5], rotY: Math.PI / 2 }));
  house.add(panel({ w: 21.6, h: 3.2, material: warmInterior, at: [-4, 0.25, -5.8] }));

  // Ground Floor Interior Furnishings
  house.add(block({ w: 4.6, h: 0.95, d: 1.1, material: plaster, at: [-10.2, 0.2, -2.8] }));
  house.add(block({ w: 3.6, h: 0.44, d: 1.05, r: 0.08, material: fabric, at: [1.8, 0.2, -0.6] }));
  house.add(block({ w: 3.6, h: 0.78, d: 0.26, r: 0.06, material: fabric, at: [1.8, 0.2, -1.18] }));
  house.add(block({ w: 2.8, h: 0.06, d: 1.05, material: oak, at: [-4.8, 0.94, 0.5] }));
  house.add(block({ w: 0.12, h: 0.74, d: 0.85, material: bronzeFrame, at: [-6.1, 0.2, 0.5] }));
  house.add(block({ w: 0.12, h: 0.74, d: 0.85, material: bronzeFrame, at: [-3.5, 0.2, 0.5] }));

  // Upper Floor: 16m Concrete Cantilever Master Wing
  house.add(block({ w: 22.8, h: 0.32, d: 9.8, material: concrete, at: [-4, 3.6, -1.3] }));
  house.add(block({ w: 28, h: 3.6, d: 10.4, material: concrete, at: [6, 3.92, 0.2] }));
  house.add(panel({ w: 23.4, h: 1.8, material: ribbonGlow, at: [6, 4.82, 5.38] }));
  house.add(glazing({ w: 23.8, h: 2.0, glass: starphireGlass, frame: bronzeFrame, spacing: 2.8, at: [6, 4.72, 5.42] }));
  house.add(panel({ w: 9.2, h: 3.1, material: ribbonGlow, at: [20.01, 4.18, 0.2], rotY: Math.PI / 2 }));
  house.add(glazing({ w: 9.6, h: 3.3, glass: starphireGlass, frame: bronzeFrame, spacing: 2.4, at: [20.03, 4.08, 0.2], rotY: Math.PI / 2 }));
  // Western solar shading cedar fins
  house.add(fins({ count: 18, spacing: 0.60, w: 0.08, h: 3.6, d: 0.42, material: cedar, at: [20.32, 3.92, 0.2], rotY: Math.PI / 2 }));
  house.add(block({ w: 28.8, h: 0.30, d: 11.2, r: 0.02, material: concrete, at: [6, 7.52, 0.2] }));

  // Interior night illumination lamps
  const lamps = [[-9.5, 2.8, 0.2], [0.5, 2.8, 0.2]].map(([x, y, z]) => {
    const l = new THREE.PointLight('#ffc893', 0, 16, 2);
    l.position.set(x, y, z);
    house.add(l);
    return l;
  });

  // ------------------------------------------------------------------ Mediterranean Botanical Landscaping
  const clearOfHouse = (x, z) =>
    (x > -36 && x < 32 && z > -18 && z < 20) || z > 32 || (x < -22 && x > -84 && z > -26 && z < -3);

  const plants = [
    // Cypress allée framing the private arrival axis
    ...Array.from({ length: 11 }, (_, i) => ({ kind: 'cypress', x: -44 + i * 4.4, z: -14.5, scale: 1.05, keep: true })),
    // Ancient umbrella pines framing the promontory
    { kind: 'umbrellaPine', x: 36, z: -28, scale: 1.2, keep: true },
    { kind: 'umbrellaPine', x: -4, z: -40, scale: 1.25, keep: true },
    // Gnarled olive trees anchored into courtyard gravel
    { kind: 'olive', x: 27, z: -11, scale: 1.1, keep: true },
    { kind: 'olive', x: 33, z: -16, scale: 1.15, keep: true },
    { kind: 'olive', x: -32, z: 13, scale: 1.05, keep: true },
    // Surrounding Mediterranean cliff pine clusters and aromatic shrubs
    ...clusters({ groups: 16, perGroup: 7, area: [-320, -320, 320, -45], spread: 28, minDist: 9, seed: 7, avoid: clearOfHouse }).map((p) => ({ ...p, kind: 'umbrellaPine' })),
    ...clusters({ groups: 8, perGroup: 5, area: [-150, -80, 150, -26], spread: 15, minDist: 7, seed: 9, avoid: clearOfHouse }).map((p) => ({ ...p, kind: 'round' })),
    ...clusters({ groups: 14, perGroup: 6, area: [-180, -32, 180, 36], spread: 9, minDist: 3.5, seed: 13, avoid: clearOfHouse }).map((p) => ({ ...p, kind: 'shrub' })),
  ];
  const trees = createTrees(plants, { heightAt: land.heightAt, density: Math.max(0.5, tier.density) });
  scene.add(trees.group);

  // Atmospheric sun dust motes
  const dust = createDust({ count: 950, box: [75, 15, 55], center: [0, 5, 4], density: tier.density, size: 2.5, opacity: 0.52 });
  scene.add(dust.points);

  // ------------------------------------------------------------------ Web Audio Ambience
  const soundBtn = document.querySelector('.sound-toggle');
  if (soundBtn) {
    createAmbience({ kind: 'sea', volume: 0.16, button: soundBtn });
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
    setEmissive(warmInterior, 0.6 + evening * 5.2);
    setEmissive(ribbonGlow, 0.12 + evening * 3.6);
    poolWater.setGlow(dark * 0.92);
    for (const l of lamps) l.intensity = dark * 38;
    dust.uniforms.uOpacity.value = 0.52 * (1 - evening) + 0.05;
  }

  // Form submission handling with receipt feedback
  const form = document.getElementById('concierge-form');
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
    sea.update(dt);
    poolWater.update(dt);
    trees.update(dt);
    dust.update(dt, { sunDir: sky.sunDir });
    engine.render(dt);
    if (++frameCount === 3) qa.markReady();
  });
}
