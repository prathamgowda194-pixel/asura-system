/**
 * Asura render engine: renderer, camera, scene and a post stack with good defaults.
 *
 *   RenderPass (HDR, MSAA on capable devices)
 *   -> GTAOPass        ambient occlusion (high tier only)
 *   -> BokehPass       depth of field, only when `dof` is passed (not on the low tier)
 *   -> UnrealBloomPass only pixels brighter than white bloom (threshold 1.0)
 *   -> OutputPass      tone mapping + sRGB
 *   -> look passes     optional stylisation (see post.js)
 *   -> finish pass     grade, vignette, aberration, grain, dither
 *
 * Usage:
 *   const engine = createEngine({ canvas, fov: 32, toneMapping: 'agx', exposure: 1 });
 *   engine.setLook('print', { ink: '#1d1d1b', paper: '#efe9df' });
 *   engine.render(dt) once per frame.
 *   Depth of field: createEngine({ dof: { aperture: 0.02, maxblur: 0.01 } }), then every frame
 *   engine.setFocus(camera.position.distanceTo(rig.current.target)). Blur = (depth - focus) * aperture,
 *   in screen units, so aperture depends on scene scale: about maxblur / (metres behind focus to full blur).
 *
 * Throws if WebGL2 is unavailable. Catch it and show the static fallback.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { detectTier } from './tier.js';
import { createFinishPass, createLookPasses, setFinish } from './post.js';

const TONE = {
  agx: THREE.AgXToneMapping,
  aces: THREE.ACESFilmicToneMapping,
  neutral: THREE.NeutralToneMapping,
  linear: THREE.LinearToneMapping,
};

/** A planned fallback (no WebGL wanted here), not a failure: boot() logs it as info, not as an error. */
function fallbackError(message) {
  const err = new Error(message);
  err.name = 'AsuraFallback';
  return err;
}

export function createEngine(options = {}) {
  const {
    canvas = document.querySelector('canvas'),
    fov = 32,
    near = 0.1,
    far = 3000,
    toneMapping = 'agx',
    exposure = 1,
    bloom = { strength: 0.3, radius: 0.55, threshold: 1.0 },
    ao = { radius: 0.8, intensity: 1.0 },
    finish = {},
    dof = null,
    frameBudgetMs = 18,
  } = options;

  let renderer;
  try {
    // ?fallback simulates a device without WebGL, to check the static fallback and copy legibility.
    if (new URLSearchParams(location.search).has('fallback')) throw fallbackError('WebGL disabled by ?fallback');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  } catch (err) {
    document.documentElement.classList.add('no-webgl');
    throw err;
  }

  const tier = detectTier(renderer.getContext());
  const qa = new URLSearchParams(location.search).has('qa');
  // Software renderers (SwiftShader, llvmpipe) draw on the CPU: Lighthouse and PageSpeed run on them,
  // and a full-screen shader there hangs the page (PAGE_HUNG). Show the static fallback instead.
  // QA captures (?qa) and forced tiers (?tier=...) still render, so the capture scripts keep working.
  // Approach from darkroom.engineering's WebGL profile (MIT), see .agents/stacks/darkroom.
  if (tier.software && !qa && !tier.forced) {
    renderer.dispose();
    renderer.forceContextLoss();
    document.documentElement.classList.add('no-webgl');
    throw fallbackError(`Software WebGL renderer (${tier.gpu}): static fallback`);
  }
  let dpr = Math.min(window.devicePixelRatio || 1, tier.maxDpr);

  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = TONE[toneMapping] ?? THREE.AgXToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = tier.shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap was removed in r18x. Soften with light.shadow.radius.
  renderer.info.autoReset = false; // counted per frame across all passes, reset in render()

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, near, far);

  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: tier.msaa });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));

  let aoPass = null;
  if (ao && tier.ao) {
    aoPass = new GTAOPass(scene, camera, 1, 1);
    aoPass.blendIntensity = ao.intensity ?? 1;
    aoPass.updateGtaoMaterial({ radius: ao.radius ?? 0.8, distanceExponent: 1, thickness: 1, scale: 1, samples: 16 });
    aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    composer.addPass(aoPass);
  }

  let dofPass = null;
  if (dof && tier.name !== 'low') {
    dofPass = new BokehPass(scene, camera, { focus: dof.focus ?? 10, aperture: dof.aperture ?? 0.002, maxblur: dof.maxblur ?? 0.01 });
    composer.addPass(dofPass);
  }

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), bloom?.strength ?? 0.3, bloom?.radius ?? 0.55, bloom?.threshold ?? 1.0);
  bloomPass.enabled = Boolean(bloom) && tier.bloom;
  composer.addPass(bloomPass);

  composer.addPass(new OutputPass());

  const finishPass = createFinishPass(finish);
  composer.addPass(finishPass);

  let lookPasses = [];
  const size = { w: 0, h: 0 };

  function applySize(force = false) {
    const w = Math.max(1, Math.round(canvas.clientWidth || window.innerWidth));
    const h = Math.max(1, Math.round(canvas.clientHeight || window.innerHeight));
    if (!force && w === size.w && h === size.h) return;
    size.w = w;
    size.h = h;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const px = new THREE.Vector2(w * dpr, h * dpr);
    for (const p of [finishPass, ...lookPasses]) p.uniforms.uResolution?.value.copy(px);
  }

  function setDpr(value) {
    const next = Math.max(tier.minDpr, Math.min(value, tier.maxDpr, window.devicePixelRatio || 1));
    if (Math.abs(next - dpr) < 0.01) return;
    dpr = next;
    applySize(true);
  }

  // Adaptive resolution: drop pixel ratio when frames are slow, restore when there is headroom.
  const perf = { avg: 16.7, slow: 0, fast: 0 };
  function adapt(dtMs) {
    if (dtMs > 250) return; // ignore tab switches and stalls
    perf.avg += (dtMs - perf.avg) * 0.05;
    if (qa) return; // QA captures keep a fixed resolution
    if (perf.avg > frameBudgetMs * 1.3) { perf.slow += dtMs; perf.fast = 0; }
    else if (perf.avg < frameBudgetMs * 0.7) { perf.fast += dtMs; perf.slow = 0; }
    else { perf.slow = 0; perf.fast = 0; }
    if (perf.slow > 1500) { setDpr(dpr - 0.25); perf.slow = 0; }
    if (perf.fast > 6000) { setDpr(dpr + 0.25); perf.fast = 0; }
  }

  function setLook(name, opts = {}) {
    for (const p of lookPasses) { composer.removePass(p); p.dispose?.(); }
    lookPasses = createLookPasses(name, opts);
    const index = composer.passes.indexOf(finishPass);
    lookPasses.forEach((p, i) => composer.insertPass(p, index + i));
    applySize(true);
    return lookPasses;
  }

  new ResizeObserver(() => applySize()).observe(canvas);
  applySize(true);

  let last = performance.now();
  const api = { paused: false };
  function render(dt) {
    if (api.paused) return; // QA freezes the last frame for screenshots
    const now = performance.now();
    adapt(now - last);
    last = now;
    renderer.info.reset();
    finishPass.uniforms.uTime.value += dt;
    composer.render(dt);
  }

  // defineProperties (not Object.assign) so the dpr/size getters stay live.
  return Object.defineProperties(api, Object.getOwnPropertyDescriptors({
    THREE,
    renderer,
    scene,
    camera,
    composer,
    tier,
    qa,
    perf,
    passes: { ao: aoPass, dof: dofPass, bloom: bloomPass, finish: finishPass, get look() { return lookPasses; } },
    get dpr() { return dpr; },
    get size() { return size; },
    setDpr,
    setLook,
    setFinish: (o) => setFinish(finishPass, o),
    /** Focus distance (scene units from the camera) and optional aperture. No-op without dof. */
    setFocus(distance, aperture) {
      if (!dofPass) return;
      dofPass.uniforms.focus.value = distance;
      if (aperture !== undefined) dofPass.uniforms.aperture.value = aperture;
    },
    resize: () => applySize(true),
    render,
  }));
}
