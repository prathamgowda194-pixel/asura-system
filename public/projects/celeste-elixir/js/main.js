/**
 * Project entry. This file is yours: replace the WORLD and KEYFRAMES with the concept.
 * The placeholder world is a clay massing study on purpose. Shipping it is a QA failure.
 *
 * Read first (paths inside .agents/skills/asura-webgl/): SKILL.md, resources/visual-quality.md,
 * and the example closest to the concept: examples/coastal-house (landscape, architecture) or
 * examples/studio-object (products, objects). Study them; do not copy their concept, shots or palette.
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { createEngine } from './engine/core.js';
import { createScroll } from './engine/scroll.js';
import { createRig } from './engine/rig.js';
import { installQA } from './engine/qa.js';
import { setupReveals, setupHeader } from './engine/motion.js';
import { createSky } from './recipes/sky.js';
import { installHeightFog } from './recipes/fog.js';
import { createTerrain, createContactShadow, smoothstep } from './recipes/terrain.js';
import { block } from './recipes/architecture.js';
import { materials } from './recipes/materials.js';
import { createDust } from './recipes/particles.js';

// Shots, anchored to the DOM chapters in index.html. Long lenses (fov 26-40) for architecture and objects.
const KEYFRAMES = [
  { at: '#ch-1', pos: [34, 14, 46], target: [0, 2.5, 0], fov: 30, hold: 0.04, state: { tod: 0 } },
  { at: '#ch-2', pos: [-22, 2.2, 18], target: [1, 3, 0], fov: 34 },
  { at: '#ch-3', pos: [22, 1.7, 20], target: [3, 3.6, 0], fov: 36, hold: 0.12, state: { tod: 0.45 } },
  { at: '#ch-4', pos: [-30, 22, 40], target: [0, 2, 0], fov: 30, state: { tod: 1 } },
];

boot().catch((err) => {
  if (err?.name === 'AsuraFallback') console.info('[asura]', err.message);
  else console.error('[asura] scene failed to start, showing fallback', err);
  document.documentElement.classList.add('no-webgl', 'is-ready');
  setupHeader(); // the document still works without the scene
});

async function boot() {
  installHeightFog({ base: 0, falloff: 0.1, floor: 0.3 });

  const engine = createEngine({
    canvas: document.getElementById('stage'),
    fov: 30,
    toneMapping: 'agx',
    finish: { contrast: 1.05, vignette: 0.22, grain: 0.035 },
  });
  const { scene, camera, tier } = engine;
  const sky = createSky(engine, { preset: 'golden', focus: [0, 0, 0], shadowSize: 30 });

  // ---------------------------------------------------------------- WORLD (replace)
  const land = createTerrain({ size: 700, segments: 180, height: 6, scale: 0.01, seed: 3, pads: [{ x: 0, z: 0, radius: 30, feather: 40 }] });
  scene.add(land.mesh);

  const clay = materials.clay('#e3ddd2');
  const massing = new THREE.Group();
  massing.add(
    block({ w: 14, h: 3.2, d: 8, material: clay, at: [-2, 0, 0] }),
    block({ w: 18, h: 3.2, d: 7, material: clay, at: [3, 3.2, 1.2] }),
    block({ w: 0.6, h: 3.2, d: 14, material: clay, at: [-9.5, 0, 0] }),
  );
  scene.add(massing);
  scene.add(createContactShadow({ w: 26, d: 16, opacity: 0.3 }));

  const dust = createDust({ density: tier.density, box: [50, 12, 40], center: [0, 5, 0] });
  scene.add(dust.points);
  // ---------------------------------------------------------------- END WORLD

  const scroll = createScroll();
  const rig = createRig(camera, { keyframes: KEYFRAMES, reducedMotion: scroll.reduced });
  const layout = () => rig.layout((sel, align) => scroll.progressOf(sel, align));
  layout();
  window.addEventListener('resize', layout);
  document.fonts?.ready.then(layout);

  // Signature interaction placeholder: a real <input type="range"> drives a scene value while its
  // chapter is on screen; scroll takes over again elsewhere. Replace it with the concept's interaction
  // (.agents/skills/asura-webgl/resources/interaction.md has the patterns: control, drag, pick, scrub).
  const control = document.getElementById('ch-3-control');
  const user = { value: Number(control?.value ?? 0.45), touched: false };
  control?.addEventListener('input', () => { user.value = Number(control.value); user.touched = true; });
  const SIGNATURE_SHOT = 2; // index of the #ch-3 keyframe

  const timeOfDay = sky.sequence(['golden', 'sunset', 'dusk']);
  function applyState(state) {
    const near = user.touched ? 1 - smoothstep(0.3, 0.6, Math.abs(rig.current.u - SIGNATURE_SHOT)) : 0;
    timeOfDay((state.tod ?? 0) * (1 - near) + user.value * near);
  }

  const qa = installQA({
    engine, scroll, rig,
    onJump: () => { applyState(rig.current.state); sky.update(0, { force: true }); },
  });

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
    dust.update(dt, { sunDir: sky.sunDir });
    engine.render(dt);
    if (++frameCount === 3) qa.markReady();
  });
}
