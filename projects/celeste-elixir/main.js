/**
 * celeste · Marine Glacier & Blue Tansy Elixir
 * Skyish-Blue Daylight WebGL Showcase (Reference Choreography + SUPRA-Tex Surface-Aligned PBR)
 *
 * Built with Asura v3.1 Engine (three.js 0.187.0, GSAP 3.15.1, Lenis 1.3.27).
 * Test switches: ?qa=1&shot=0..1 | ?tier=low|mid|high | ?fallback=1
 */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { createEngine } from './js/engine/core.js';
import { createScroll } from './js/engine/scroll.js';
import { createRig } from './js/engine/rig.js';
import { installQA } from './js/engine/qa.js';
import { setupReveals, setupHeader } from './js/engine/motion.js';
import { createPicker } from './js/engine/interact.js';
import { lathe } from './js/recipes/objects.js';
import { materials, surface } from './js/recipes/materials.js';
import { createContactShadow } from './js/recipes/terrain.js';

gsap.registerPlugin(ScrollTrigger);

const params = new URLSearchParams(location.search);

const VARIANTS = {
  '30ml': { name: 'The travel ritual (30 ml)', spec: 'Ø 33 mm × 98 mm · Batch No. 042', price: '€68' },
  '50ml': { name: 'The daily ritual (50 ml)', spec: 'Ø 38 mm × 110 mm · Batch No. 042', price: '€94' },
  'duo': { name: 'The sanctuary duo (50 + 30 ml)', spec: 'Paired Travel & Daily Flacons · Batch No. 042', price: '€148' },
};

// Camera choreography strictly matched to Refrence.mp4 @ 30fps beats
const KEYFRAMES = [
  {
    at: '#intro',
    pos: [0.0, 0.084, 0.42],
    target: [0.0, 0.056, 0.0],
    fov: 27,
    shift: [0.075, -0.055],
    hold: 0.05,
    state: { capLift: 0, bottleDrop: 0, bottleTilt: 0, dropFall: 0, ripple: 0, swirl: 0, studioMix: 0, darkInk: 0, trio: 0 },
    portrait: { pos: [0.0, 0.086, 0.48], target: [0.0, 0.054, 0.0], fov: 36, shift: [0.0, 0.09] },
  },
  {
    at: '#distilled',
    pos: [0.0, 0.106, 0.24],
    target: [0.0, 0.092, 0.0],
    fov: 25,
    shift: [0.055, -0.015],
    hold: 0.04,
    state: { capLift: 0.65, bottleDrop: 0, bottleTilt: 0, dropFall: 0, ripple: 0, swirl: 0, studioMix: 0.04, darkInk: 0.15, trio: 0 },
    portrait: { pos: [0.0, 0.105, 0.28], target: [0.0, 0.092, 0.0], fov: 33, shift: [0.0, 0.06] },
  },
  {
    at: '#dropper',
    pos: [0.0, 0.132, 0.25],
    target: [0.0, 0.178, 0.0],
    fov: 25,
    shift: [0.045, 0.0],
    hold: 0.07,
    state: { capLift: 1.0, bottleDrop: 1.0, bottleTilt: 0, dropFall: 0.15, ripple: 0, swirl: 0, studioMix: 0.14, darkInk: 1.0, trio: 0 },
    portrait: { pos: [0.0, 0.130, 0.30], target: [0.0, 0.174, 0.0], fov: 34, shift: [0.0, 0.05] },
  },
  {
    at: '#origin',
    pos: [0.0, 0.30, 0.21],
    target: [0.0, 0.020, 0.0],
    fov: 28,
    shift: [0.0, 0.02],
    hold: 0.07,
    state: { capLift: 1.0, bottleDrop: 0.0, bottleTilt: 1.0, dropFall: 0.58, ripple: 0.45, swirl: 0, studioMix: 0.34, darkInk: 1.0, trio: 0 },
    portrait: { pos: [0.0, 0.35, 0.23], target: [0.0, 0.020, 0.0], fov: 38, shift: [0.0, 0.08] },
  },
  {
    at: '#daily',
    pos: [0.0, 0.38, 0.012],
    target: [0.0, 0.020, 0.0],
    fov: 28,
    shift: [0.0, 0.0],
    hold: 0.06,
    state: { capLift: 1.25, bottleDrop: 0.0, bottleTilt: 0.85, dropFall: 1.0, ripple: 1.0, swirl: 0.20, studioMix: 0.58, darkInk: 1.0, trio: 0 },
    portrait: { pos: [0.0, 0.43, 0.012], target: [0.0, 0.020, 0.0], fov: 38, shift: [0.0, 0.05] },
  },
  {
    at: '#clarity',
    pos: [0.0, 0.39, 0.008],
    target: [0.0, 0.020, 0.0],
    fov: 29,
    shift: [0.0, 0.0],
    hold: 0.08,
    state: { capLift: 1.4, bottleDrop: 0.0, bottleTilt: 0.85, dropFall: 1.0, ripple: 1.0, swirl: 1.0, studioMix: 0.96, darkInk: 1.0, trio: 0 },
    portrait: { pos: [0.0, 0.44, 0.008], target: [0.0, 0.020, 0.0], fov: 39, shift: [0.0, 0.04] },
  },
  {
    at: '#ritual',
    pos: [0.0, 0.064, 0.56],
    target: [0.0, 0.056, 0.0],
    fov: 26,
    shift: [0.0, 0.024],
    hold: 0.08,
    state: { capLift: 0, bottleDrop: 1.4, bottleTilt: 0, dropFall: 0, ripple: 0, swirl: 0, studioMix: 1.0, darkInk: 1.0, trio: 1.0 },
    portrait: { pos: [0.0, 0.068, 0.82], target: [0.0, 0.036, 0.0], fov: 37, shift: [0.0, 0.04] },
  },
];

boot().catch((err) => {
  if (err?.name === 'AsuraFallback') console.info('[asura]', err.message);
  else console.error('[asura] scene failed to start, showing fallback', err);
  document.documentElement.classList.add('no-webgl', 'is-ready');
  setupHeader();
});

async function loadPBRTextures() {
  const loader = new THREE.TextureLoader();
  const loadTex = (url, srgb = false) =>
    new Promise((resolve) => {
      loader.load(
        url,
        (t) => {
          t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          t.anisotropy = 8;
          t.needsUpdate = true;
          resolve(t);
        },
        undefined,
        () => resolve(null)
      );
    });

  const [albedo, roughness, bump] = await Promise.all([
    loadTex('assets/pbr/label_albedo.png', true),
    loadTex('assets/pbr/label_roughness.png', false),
    loadTex('assets/pbr/label_bump.png', false),
  ]);
  return { albedo, roughness, bump };
}

function makeVariantLabelTexture(volumeText) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#edefed';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 3200; i++) {
    const x = ((i * 7919) % 768);
    const y = ((i * 6271) % 900);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(200,210,220,0.22)' : 'rgba(255,255,255,0.35)';
    ctx.fillRect(x, y, 2, 1);
  }

  ctx.fillStyle = '#1d2730';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 132px "Cormorant Infant", Georgia, serif';
  ctx.fillText('celeste', canvas.width / 2, canvas.height * 0.44);

  ctx.font = '500 22px "Bespoke Sans", system-ui, sans-serif';
  ctx.fillStyle = '#33414f';
  ctx.fillText(`MARINE GLACIER ELIXIR · ${volumeText}`, canvas.width / 2, canvas.height * 0.62);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createSkyAndStudioEnvironment(engine) {
  const { scene, renderer } = engine;

  const skyUniforms = {
    uStudioMix: { value: 0.0 },
    uTime: { value: 0.0 },
  };
  const skyGeo = new THREE.SphereGeometry(28, 48, 32);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: skyUniforms,
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform float uStudioMix;
      uniform float uTime;
      varying vec3 vWorldPos;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
                   mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
      }

      void main() {
        vec3 d = normalize(vWorldPos);
        float elev = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);

        // Skyish blue daylight dome: #5ca6e6 zenith -> #8cc2ef mid -> #d4ecfb horizon
        vec3 horizon = vec3(0.83, 0.92, 0.985);
        vec3 midSky = vec3(0.55, 0.77, 0.95);
        vec3 zenith = vec3(0.32, 0.62, 0.89);
        vec3 skyCol = mix(horizon, midSky, smoothstep(0.49, 0.66, elev));
        skyCol = mix(skyCol, zenith, smoothstep(0.66, 0.94, elev));

        // Soft wispy morning cirrus clouds across open skyish-blue horizon
        vec2 cuv = d.xz / max(0.14, abs(d.y) + 0.14);
        float c1 = noise(cuv * 1.4 + vec2(uTime * 0.008, 0.0));
        float c2 = noise(cuv * 3.1 - vec2(uTime * 0.005, 0.4));
        float cloud = smoothstep(0.52, 0.82, c1 * 0.65 + c2 * 0.35) * smoothstep(0.49, 0.74, elev) * 0.34;
        skyCol = mix(skyCol, vec3(0.96, 0.985, 1.0), cloud);

        // Luminous pastel frost studio backdrop (#e9f4fc) for Beat 6-7
        vec3 studioCol = mix(vec3(0.85, 0.92, 0.98), vec3(0.92, 0.96, 0.995), smoothstep(0.3, 0.9, elev));
        vec3 col = mix(skyCol, studioCol, uStudioMix);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  skyDome.name = 'sky-dome';
  scene.add(skyDome);

  // Calibrated Studio Softbox PMREM Environment for crisp crystal flint glass specular strips
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(
    new THREE.SphereGeometry(18, 24, 16),
    new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: '#9ac4eb' })
  ));
  const addSoftbox = (pos, size, color, intensity) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size[0], size[1]),
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: new THREE.Color(color).multiplyScalar(intensity) })
    );
    m.position.set(...pos);
    m.lookAt(0, 0.06, 0);
    envScene.add(m);
  };
  addSoftbox([-1.8, 1.3, 1.6], [0.45, 2.2], '#ffffff', 3.6);   // crisp vertical left bottle highlight
  addSoftbox([1.9, 1.1, 1.3], [0.35, 1.8], '#eef7ff', 2.4);    // thin right edge glass rim highlight
  addSoftbox([0.0, 2.4, -1.6], [3.0, 0.45], '#e4f2fc', 2.8);   // overhead daylight skylight strip
  addSoftbox([0.0, -1.5, 0.2], [4.0, 4.0], '#9ec4e2', 0.65);   // cool ground bounce

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(envScene, 0.02, 0.1, 45);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.92;

  const sun = new THREE.DirectionalLight('#fffdf8', 1.75);
  sun.position.set(-2.6, 2.3, 1.6);
  sun.castShadow = engine.tier.shadows;
  sun.shadow.mapSize.set(engine.tier.shadowMapSize, engine.tier.shadowMapSize);
  Object.assign(sun.shadow.camera, { left: -0.42, right: 0.42, top: 0.42, bottom: -0.42, near: 0.2, far: 12 });
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.0014;
  sun.shadow.radius = 5;
  scene.add(sun);

  const hemi = new THREE.HemisphereLight('#bfe0fb', '#425222', 0.85);
  scene.add(hemi);

  scene.fog = new THREE.Fog('#c2e0f6', 3.8, 18.0);

  return { skyUniforms, sun, hemi };
}

function makeRearApothecaryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#edefed';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 1800; i++) {
    const x = ((i * 7919) % 512);
    const y = ((i * 6271) % 768);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(200,210,220,0.20)' : 'rgba(255,255,255,0.32)';
    ctx.fillRect(x, y, 2, 1);
  }

  ctx.fillStyle = '#2b3d4d';
  ctx.textAlign = 'center';
  ctx.font = '500 28px "Cormorant Infant", Georgia, serif';
  ctx.fillText('Active Botanical Composition', 256, 150);

  ctx.strokeStyle = 'rgba(43, 61, 77, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, 185);
  ctx.lineTo(416, 185);
  ctx.stroke();

  ctx.font = '500 18px "Bespoke Sans", system-ui, sans-serif';
  ctx.fillStyle = '#3f5162';
  const lines = [
    '0.30% Tanacetum Annuum',
    '1.30% Tri-Weight Hyaluron',
    'Isotonic Alpine Glacial Water',
    'pH 5.4 · Cold-Filtered',
    '',
    'Three drops onto damp skin',
    'morning and evening.',
    '',
    'Geneva · Batch No. 042',
  ];
  lines.forEach((line, idx) => ctx.fillText(line, 256, 250 + idx * 44));

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createCurvedBladeGeometry() {
  const geo = new THREE.BufferGeometry();
  const segs = 4;
  const verts = [];
  const indices = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const h = t * 0.155;
    const bendZ = t * t * 0.032;
    const halfW = 0.0042 * (1 - t * 0.92);
    verts.push(-halfW, h, bendZ, halfW, h, bendZ);
  }
  for (let i = 0; i < segs; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createFivePetalBlossomGeometry() {
  const geo = new THREE.BufferGeometry();
  const verts = [];
  const indices = [];
  const petals = 5;
  for (let p = 0; p < petals; p++) {
    const ang = (p / petals) * Math.PI * 2;
    const nx = Math.cos(ang);
    const nz = Math.sin(ang);
    const px = -nz;
    const pz = nx;
    const baseIdx = verts.length / 3;
    const rOuter = 0.0082;
    const wMid = 0.0034;
    verts.push(
      nx * 0.0012, 0.0, nz * 0.0012,
      nx * rOuter * 0.58 + px * wMid, 0.0016, nz * rOuter * 0.58 + pz * wMid,
      nx * rOuter, 0.0022, nz * rOuter,
      nx * rOuter * 0.58 - px * wMid, 0.0016, nz * rOuter * 0.58 - pz * wMid
    );
    indices.push(baseIdx, baseIdx + 1, baseIdx + 2, baseIdx, baseIdx + 2, baseIdx + 3);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildBotanicalMeadow(scene, tier) {
  const group = new THREE.Group();
  group.name = 'sky-meadow';

  // Deep undulating alpine turf terrain stretching well below camera frustum
  const groundGeo = new THREE.PlaneGeometry(46, 46, 64, 64);
  groundGeo.rotateX(-Math.PI / 2);
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const radial = Math.hypot(x, z);
    const hill = Math.max(0, radial - 0.55) * 0.025 + Math.sin(x * 0.55) * Math.cos(z * 0.45) * 0.09 * Math.min(1, radial / 3);
    const pathDip = Math.exp(-Math.pow(x / 0.65, 2)) * -0.04;
    pos.setY(i, -0.05 + hill + pathDip);
  }
  groundGeo.computeVertexNormals();
  const groundMat = new THREE.MeshStandardMaterial({ color: '#455722', roughness: 0.92, metalness: 0 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  group.add(ground);

  const uTime = { value: 0 };

  // Layer 1: Natural wind-curved grass ribbon blades with warm olive sheen
  const grassCount = Math.round(3200 * Math.max(0.45, tier.density));
  const bladeGeo = createCurvedBladeGeometry();
  const bladeMat = new THREE.MeshStandardMaterial({
    color: '#6d823b',
    roughness: 0.72,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  bladeMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 wp = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        transformed.x += position.y * 0.22 * sin(uTime * 1.4 + wp.x * 1.7 + wp.z * 1.3);`);
  };
  const bladesInst = new THREE.InstancedMesh(bladeGeo, bladeMat, grassCount);

  // Layer 2: Delicate 5-petal blue tansy / forget-me-not blossoms (zero chunky spheres)
  const floretCount = Math.round(3600 * Math.max(0.45, tier.density));
  const petalGeo = createFivePetalBlossomGeometry();
  const floretMat = new THREE.MeshStandardMaterial({
    roughness: 0.52,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  floretMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 wp = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        transformed.x += 0.022 * sin(uTime * 1.4 + wp.x * 1.7 + wp.z * 1.3);`);
  };
  const floretsInst = new THREE.InstancedMesh(petalGeo, floretMat, floretCount);

  const dummy = new THREE.Object3D();
  const petalPalette = ['#8ac3f5', '#a9d7fa', '#69abe8', '#d4ebfc', '#5b9cd8'];
  const stemPalette = ['#4b5e25', '#5d7330', '#70873d'];
  const c = new THREE.Color();

  let seed = 918273;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

  let bPlaced = 0;
  let fPlaced = 0;
  let attempts = 0;
  while (bPlaced < grassCount && attempts < grassCount * 5) {
    attempts++;
    const angle = rnd() * Math.PI * 2;
    const radius = 0.36 + Math.pow(rnd(), 0.72) * 8.4;
    const x = Math.cos(angle) * radius * 1.45;
    const z = Math.sin(angle) * radius * 1.25 - 2.2;
    if (Math.hypot(x, z) < 0.36) continue;
    if (z < 0.30 && z > -2.5 && Math.abs(x) < 0.14 * (1 + Math.abs(z) * 0.35)) continue;

    const gy = -0.05 + Math.max(0, Math.hypot(x, z) - 0.55) * 0.025;
    const s = (0.72 + rnd() * 0.82) * (1 + Math.min(1.6, Math.hypot(x, z) * 0.18));

    dummy.position.set(x, gy, z);
    dummy.rotation.set((rnd() - 0.5) * 0.35, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.35);
    dummy.scale.set(s * 0.95, s * (0.8 + rnd() * 0.48), s * 0.95);
    dummy.updateMatrix();
    bladesInst.setMatrixAt(bPlaced, dummy.matrix);
    c.set(stemPalette[bPlaced % stemPalette.length]).offsetHSL(0, 0, (rnd() - 0.5) * 0.06);
    bladesInst.setColorAt(bPlaced, c);
    bPlaced++;

    // Cluster 1-2 delicate facing 5-petal florets atop natural ribbon blade bend
    const blossoms = rnd() < 0.65 ? 2 : 1;
    for (let k = 0; k < blossoms && fPlaced < floretCount; k++) {
      const fx = x + (rnd() - 0.5) * 0.025 * s;
      const fy = gy + (0.115 + rnd() * 0.032) * s;
      const fz = z + (rnd() - 0.5) * 0.025 * s;
      const fs = s * (0.75 + rnd() * 0.60);
      dummy.position.set(fx, fy, fz);
      // Tilt slightly forward toward camera (+X rotation ~0.55..1.05 rad) so star blossoms face viewer organically
      dummy.rotation.set(0.55 + (rnd() - 0.5) * 0.55, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.35);
      dummy.scale.set(fs, fs, fs);
      dummy.updateMatrix();
      floretsInst.setMatrixAt(fPlaced, dummy.matrix);
      c.set(petalPalette[fPlaced % petalPalette.length]).offsetHSL((rnd() - 0.5) * 0.02, 0, (rnd() - 0.5) * 0.05);
      floretsInst.setColorAt(fPlaced, c);
      fPlaced++;
    }
  }
  bladesInst.count = bPlaced;
  bladesInst.instanceMatrix.needsUpdate = true;
  if (bladesInst.instanceColor) bladesInst.instanceColor.needsUpdate = true;

  floretsInst.count = fPlaced;
  floretsInst.instanceMatrix.needsUpdate = true;
  if (floretsInst.instanceColor) floretsInst.instanceColor.needsUpdate = true;

  group.add(bladesInst, floretsInst);
  scene.add(group);
  return { group, uTime, groundMat };
}

function buildWaterBasin(scene, tier) {
  const basinGroup = new THREE.Group();
  basinGroup.name = 'water-basin';

  // Seamless warm chalk travertine stone basin (rotateY(PI) moves UV seam behind camera!)
  const stoneMat = surface('plaster', { color: '#ded8ce', repeat: [4, 2], bump: 0.25, roughness: 0.84, seed: 19 });

  const dishGeo = lathe({
    profile: [
      [0.0, 0.0],
      [0.145, 0.0],
      [0.165, 0.014],
      [0.168, 0.028],
      [0.160, 0.035],
      [0.146, 0.036],
      [0.136, 0.032],
      [0.132, 0.015],
      [0.0, 0.014],
    ],
    segments: 96,
    smooth: 2,
  });
  dishGeo.rotateY(Math.PI);
  const dishMesh = new THREE.Mesh(dishGeo, stoneMat);
  dishMesh.castShadow = true;
  dishMesh.receiveShadow = true;
  basinGroup.add(dishMesh);

  // Rippling spring water plane inside dish
  const waterUniforms = {
    uTime: { value: 0 },
    uRipple: { value: 0 },
    uOrigin: { value: new THREE.Vector2(0.032, 0.004) },
  };
  const waterGeo = new THREE.CircleGeometry(0.138, 88);
  waterGeo.rotateX(-Math.PI / 2);

  const waterMat = new THREE.MeshPhysicalMaterial({
    color: '#c8e4f9',
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    transparent: true,
    opacity: 0.90,
    transmission: tier.name === 'low' ? 0 : 0.38,
    ior: 1.333,
  });
  waterMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = waterUniforms.uTime;
    shader.uniforms.uRipple = waterUniforms.uRipple;
    shader.uniforms.uOrigin = waterUniforms.uOrigin;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime;
        uniform float uRipple;
        uniform vec2 uOrigin;
        varying vec3 vWaterPos;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vWaterPos = position;
        float dist = distance(position.xz, uOrigin);
        float wave = sin(dist * 155.0 - uRipple * 18.0 - uTime * 2.2) * exp(-dist * 11.5) * smoothstep(0.0, 0.35, uRipple);
        transformed.y += wave * 0.0028;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uTime;
        uniform float uRipple;
        uniform vec2 uOrigin;
        varying vec3 vWaterPos;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float d = distance(vWaterPos.xz, uOrigin);
        float ring = sin(d * 170.0 - uRipple * 18.0 - uTime * 2.0) * exp(-d * 10.0) * smoothstep(0.05, 0.45, uRipple);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.72, 0.94), max(0.0, ring) * 0.75);`);
  };

  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = 0.022;
  waterMesh.receiveShadow = true;
  basinGroup.add(waterMesh);

  // Seamless Viscous S-Curve Sky-Blue Serum Swirl Ribbon (matched radius meniscus caps)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.026, 0.024, 0.006),
    new THREE.Vector3(0.052, 0.025, 0.022),
    new THREE.Vector3(0.036, 0.026, 0.054),
    new THREE.Vector3(-0.005, 0.026, 0.032),
    new THREE.Vector3(-0.018, 0.025, -0.016),
    new THREE.Vector3(0.012, 0.025, -0.052),
    new THREE.Vector3(0.048, 0.025, -0.032),
  ]);
  const rSwirl = 0.0046;
  const swirlGeo = new THREE.TubeGeometry(curve, 128, rSwirl, 16, false);
  const swirlMat = new THREE.MeshPhysicalMaterial({
    color: '#6bb8ed',
    roughness: 0.04,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transparent: true,
    opacity: 0.0,
    transmission: tier.name === 'low' ? 0 : 0.65,
    ior: 1.42,
  });
  const swirlGroup = new THREE.Group();
  swirlGroup.name = 'serum-swirl';
  const swirlTube = new THREE.Mesh(swirlGeo, swirlMat);
  const headBulge = new THREE.Mesh(new THREE.SphereGeometry(rSwirl, 18, 18), swirlMat);
  headBulge.position.copy(curve.getPoint(1));
  const tailCap = new THREE.Mesh(new THREE.SphereGeometry(rSwirl, 18, 18), swirlMat);
  tailCap.position.copy(curve.getPoint(0));
  swirlGroup.add(swirlTube, headBulge, tailCap);
  swirlGroup.scale.y = 0.72;
  basinGroup.add(swirlGroup);

  scene.add(basinGroup);
  return { basinGroup, dishMesh, waterMesh, waterUniforms, swirlMesh: swirlGroup, swirlMat, stoneMat };
}

function createBottleRig({ scale = 1.0, labelMaps = null, customLabelTex = null, cheap = false }) {
  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const glassMat = materials.glass({
    tint: '#e9f5fd',
    roughness: 0.025,
    ior: 1.52,
    thickness: 0.006,
    specular: 1.0,
    cheap,
  });
  const serumMat = new THREE.MeshPhysicalMaterial({
    color: '#6ebae8',
    roughness: 0.05,
    metalness: 0,
    transmission: cheap ? 0 : 0.78,
    transparent: true,
    opacity: cheap ? 0.88 : 1.0,
    ior: 1.36,
    thickness: 0.028,
    attenuationColor: new THREE.Color('#4295d6'),
    attenuationDistance: 0.035,
  });
  const collarMat = new THREE.MeshStandardMaterial({
    color: '#dce3ea',
    metalness: 0.92,
    roughness: 0.24,
  });
  const bulbMat = new THREE.MeshStandardMaterial({
    color: '#82bce4',
    roughness: 0.72,
    metalness: 0.0,
  });

  // 1. Bottle Body Group
  const bottleGroup = new THREE.Group();
  bottleGroup.name = 'bottle-body';

  const outerGlassGeo = lathe({
    profile: [
      [0.0, 0.0],
      [0.0175, 0.0],
      [0.0195, 0.002],
      [0.0195, 0.065],
      [0.0172, 0.072],
      [0.0102, 0.077],
      [0.0092, 0.080],
      [0.0092, 0.090],
      [0.0076, 0.090],
      [0.0076, 0.076],
      [0.0168, 0.064],
      [0.0168, 0.009],
      [0.0, 0.009],
    ],
    segments: 68,
    smooth: 2,
  });
  const outerGlass = new THREE.Mesh(outerGlassGeo, glassMat);
  outerGlass.castShadow = true;
  outerGlass.receiveShadow = true;
  bottleGroup.add(outerGlass);

  for (let i = 0; i < 2; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.0094, 0.00055, 8, 40), glassMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.0825 + i * 0.0038;
    bottleGroup.add(ring);
  }

  const innerLiquidGeo = lathe({
    profile: [
      [0.0, 0.0095],
      [0.0165, 0.0095],
      [0.0165, 0.059],
      [0.0155, 0.0585],
      [0.0, 0.0582],
    ],
    segments: 48,
  });
  const innerLiquid = new THREE.Mesh(innerLiquidGeo, serumMat);
  bottleGroup.add(innerLiquid);

  // SUPRA-Tex Front Cotton Label + Matte Apothecary Back Composition Strip
  const lblMap = customLabelTex || labelMaps?.albedo || makeVariantLabelTexture('50 ML');
  const labelArc = Math.PI * 0.64;
  const labelGeo = new THREE.CylinderGeometry(0.0199, 0.0199, 0.044, 48, 1, true, -labelArc / 2, labelArc);
  labelGeo.translate(0, 0.036, 0);
  const labelMat = new THREE.MeshPhysicalMaterial({
    map: lblMap,
    roughnessMap: customLabelTex ? null : (labelMaps?.roughness ?? null),
    bumpMap: customLabelTex ? null : (labelMaps?.bump ?? null),
    bumpScale: 0.0008,
    roughness: 0.85,
    metalness: 0.0,
    clearcoat: 0.06,
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.castShadow = true;
  bottleGroup.add(labelMesh);

  const rearArc = Math.PI * 0.56;
  const rearGeo = new THREE.CylinderGeometry(0.0198, 0.0198, 0.044, 40, 1, true, Math.PI - rearArc / 2, rearArc);
  rearGeo.translate(0, 0.036, 0);
  const rearMat = new THREE.MeshPhysicalMaterial({
    map: makeRearApothecaryTexture(),
    roughness: 0.86,
    metalness: 0.0,
    clearcoat: 0.05,
  });
  bottleGroup.add(new THREE.Mesh(rearGeo, rearMat));
  root.add(bottleGroup);

  // 2. Dropper Cap + Glass Pipette + Serum Column + Pendant Drop
  const capGroup = new THREE.Group();
  capGroup.name = 'dropper-cap';

  const collarGeo = lathe({
    profile: [
      [0.0078, 0.0755],
      [0.0112, 0.0755],
      [0.0114, 0.077],
      [0.0114, 0.0915],
      [0.0102, 0.0932],
      [0.0068, 0.0932],
    ],
    segments: 56,
  });
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.castShadow = true;
  capGroup.add(collarMesh);

  const bulbGeo = lathe({
    profile: [
      [0.0068, 0.093],
      [0.0072, 0.096],
      [0.0066, 0.105],
      [0.0056, 0.111],
      [0.0028, 0.1145],
      [0.0, 0.1155],
    ],
    segments: 48,
    smooth: 2,
  });
  const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
  bulbMesh.castShadow = true;
  capGroup.add(bulbMesh);

  const stemGeo = lathe({
    profile: [
      [0.0012, 0.018],
      [0.0019, 0.022],
      [0.0031, 0.029],
      [0.0031, 0.076],
    ],
    segments: 36,
  });
  const stemMesh = new THREE.Mesh(stemGeo, glassMat);
  capGroup.add(stemMesh);

  const stemSerumGeo = lathe({
    profile: [
      [0.0, 0.0195],
      [0.0014, 0.0225],
      [0.0023, 0.0295],
      [0.0023, 0.056],
      [0.0, 0.055],
    ],
    segments: 32,
  });
  const stemSerumMesh = new THREE.Mesh(stemSerumGeo, serumMat);
  capGroup.add(stemSerumMesh);

  const dropGeo = new THREE.SphereGeometry(0.0029, 20, 20);
  dropGeo.scale(0.88, 1.25, 0.88);
  const dropMesh = new THREE.Mesh(dropGeo, serumMat);
  dropMesh.position.set(0, 0.0165, 0);
  capGroup.add(dropMesh);

  root.add(capGroup);
  return { root, bottleGroup, capGroup, dropMesh };
}

async function boot() {
  const engine = createEngine({
    canvas: document.getElementById('stage'),
    fov: 27,
    near: 0.008,
    far: 60,
    toneMapping: params.get('tone') ?? 'neutral',
    bloom: { strength: 0.14, radius: 0.40, threshold: 1.0 },
    ao: null, // Pure PMREM + crisp contact shadow preserves transparent flint glass luminance
    finish: { contrast: 1.05, saturation: 1.04, vignette: 0.12, grain: 0.018, aberration: 0.40 },
    dof: { aperture: 0.042, maxblur: 0.007 },
  });
  const { scene, camera, tier } = engine;
  const cheap = tier.name === 'low';

  const env = createSkyAndStudioEnvironment(engine);
  const meadow = buildBotanicalMeadow(scene, tier);
  const basin = buildWaterBasin(scene, tier);
  const pbrMaps = await loadPBRTextures();

  // Primary articulated hero 50 ml bottle
  const hero = createBottleRig({ scale: 1.0, labelMaps: pbrMaps, cheap });
  hero.root.position.set(0, 0.013, 0);
  hero.root.add(createContactShadow({ w: 0.09, d: 0.09, opacity: 0.45, y: 0.0004 }));
  scene.add(hero.root);

  // Trio Retail Lineup (Beat 7: "Make it your ritual.")
  const trioGroup = new THREE.Group();
  trioGroup.name = 'trio-showcase';
  const label30 = makeVariantLabelTexture('30 ML');

  const slot30 = createBottleRig({ scale: 0.84, customLabelTex: label30, cheap });
  slot30.root.position.set(-0.096, 0, 0);
  slot30.root.add(createContactShadow({ w: 0.075, d: 0.075, opacity: 0.4, y: 0.0004 }));

  const slot50 = createBottleRig({ scale: 1.02, labelMaps: pbrMaps, cheap });
  slot50.root.position.set(0.0, 0, 0.005);
  slot50.root.add(createContactShadow({ w: 0.09, d: 0.09, opacity: 0.45, y: 0.0004 }));

  const slotDuo = new THREE.Group();
  slotDuo.position.set(0.098, 0, 0);
  const duoA = createBottleRig({ scale: 0.96, labelMaps: pbrMaps, cheap });
  duoA.root.position.set(-0.020, 0, -0.004);
  duoA.root.rotation.y = 0.14;
  duoA.root.add(createContactShadow({ w: 0.08, d: 0.08, opacity: 0.4, y: 0.0004 }));
  const duoB = createBottleRig({ scale: 0.80, customLabelTex: label30, cheap });
  duoB.root.position.set(0.022, 0, 0.012);
  duoB.root.rotation.y = -0.18;
  duoB.root.add(createContactShadow({ w: 0.07, d: 0.07, opacity: 0.4, y: 0.0004 }));
  slotDuo.add(duoA.root, duoB.root);

  trioGroup.add(slot30.root, slot50.root, slotDuo);
  trioGroup.visible = false;
  scene.add(trioGroup);

  let selectedVariant = '50ml';
  const spinTargets = { '30ml': 0, '50ml': 0, 'duo': 0 };
  const spinCurrent = { '30ml': 0, '50ml': 0, 'duo': 0 };

  function selectVariant(key, spinBoost = true) {
    if (!VARIANTS[key]) return;
    selectedVariant = key;
    if (spinBoost) spinTargets[key] += Math.PI * 2;
    document.querySelectorAll('.trio-card').forEach((c) => {
      c.classList.toggle('is-selected', c.dataset.variant === key);
    });
    const sel = document.getElementById('variant-select');
    if (sel) sel.value = key;
    const info = VARIANTS[key];
    const nameEl = document.getElementById('selected-name');
    const specEl = document.getElementById('selected-spec');
    const priceEl = document.getElementById('selected-price');
    const bagEl = document.getElementById('header-bag');
    if (nameEl) nameEl.textContent = info.name;
    if (specEl) specEl.textContent = info.spec;
    if (priceEl) priceEl.textContent = info.price;
    if (bagEl) bagEl.textContent = `Buy · ${info.price}`;
  }

  document.querySelectorAll('.trio-card').forEach((card) => {
    card.addEventListener('click', () => selectVariant(card.dataset.variant, true));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectVariant(card.dataset.variant, true);
      }
    });
  });

  document.getElementById('variant-select')?.addEventListener('change', (e) => selectVariant(e.target.value, false));

  const picker = createPicker(engine, {
    targets: [slot30.root, slot50.root, slotDuo],
    onSelect: (target) => {
      if (target === slot30.root) selectVariant('30ml', true);
      else if (target === slot50.root) selectVariant('50ml', true);
      else if (target === slotDuo) selectVariant('duo', true);
    },
  });

  const resForm = document.getElementById('reserve-form');
  const resConf = document.getElementById('order-confirmed');
  if (resForm && resConf) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('conf-variant').textContent = VARIANTS[selectedVariant].name;
      resConf.style.display = 'block';
    });
  }

  const scroll = createScroll();
  const rig = createRig(camera, { keyframes: KEYFRAMES, reducedMotion: scroll.reduced, parallax: 0.007, sway: 0.0008 });
  const layout = () => rig.layout((sel, align) => scroll.progressOf(sel, align));
  layout();
  window.addEventListener('resize', layout);
  document.fonts?.ready.then(layout);

  const headerEl = document.getElementById('header');

  function applyState(state, dt = 0) {
    const capLift = state.capLift ?? 0;
    const bottleDrop = state.bottleDrop ?? 0;
    const bottleTilt = state.bottleTilt ?? 0;
    const dropFall = state.dropFall ?? 0;
    const ripple = state.ripple ?? 0;
    const swirl = state.swirl ?? 0;
    const studioMix = state.studioMix ?? 0;
    const darkInk = state.darkInk ?? 0;
    const trioAmt = state.trio ?? 0;

    // 1. Articulate dropper cap unscrew + vertical hover + clean exit above overhead Beat 5-6 cam
    hero.capGroup.position.set(
      bottleTilt * 0.032,
      capLift * 0.068 - (bottleTilt * 0.015) + swirl * 0.28,
      0.004 * bottleTilt
    );
    hero.capGroup.rotation.y = capLift * Math.PI * 2.0;
    hero.capGroup.visible = swirl < 0.08 && trioAmt < 0.2;

    // 2. Articulate bottle body (keeps "celeste" cotton label upright toward viewer when settled in dish)
    const leftX = -0.066 * bottleTilt;
    const leftZ = 0.005 * bottleTilt;
    hero.bottleGroup.position.set(leftX, -bottleDrop * 0.16, leftZ);
    hero.bottleGroup.rotation.set(0.10 * bottleTilt, -0.18 * bottleTilt, 0.04 * bottleTilt);

    // 3. Pendant serum drop fall & hide inside water ripple
    hero.dropMesh.position.y = 0.0165 - dropFall * 0.082;
    hero.dropMesh.visible = dropFall < 0.96 && capLift > 0.25 && swirl < 0.08 && trioAmt < 0.2;

    // 4. Environment, Meadow & Water Basin crossfade
    env.skyUniforms.uStudioMix.value = studioMix;
    meadow.group.visible = studioMix < 0.96;
    meadow.group.position.y = -studioMix * 0.35;
    basin.waterUniforms.uRipple.value = ripple;
    basin.swirlMesh.visible = swirl > 0.02;
    basin.swirlMat.opacity = Math.min(0.90, swirl * 0.90);
    basin.swirlMesh.scale.set(0.55 + swirl * 0.50, 0.72, 0.55 + swirl * 0.50);
    basin.swirlMesh.rotation.y = (1 - swirl) * -0.4;

    const dishFade = Math.max(0, 1 - Math.max(0, (trioAmt - 0.05) * 3.5));
    basin.basinGroup.visible = dishFade > 0.02;
    basin.basinGroup.position.y = -(1 - dishFade) * 0.25;
    hero.root.visible = trioAmt < 0.45;

    // 5. Trio studio showcase rise & interactive spin
    trioGroup.visible = trioAmt > 0.02;
    trioGroup.position.y = -0.14 * (1 - trioAmt) - 0.006;
    const spinRate = 1 - Math.exp(-8.5 * Math.max(dt, 0.016));
    for (const k of Object.keys(spinTargets)) {
      spinCurrent[k] += (spinTargets[k] - spinCurrent[k]) * spinRate;
    }
    slot30.root.rotation.y = spinCurrent['30ml'];
    slot50.root.rotation.y = spinCurrent['50ml'];
    slotDuo.rotation.y = spinCurrent['duo'];

    headerEl?.classList.toggle('is-dark-ink', darkInk > 0.5);
  }

  const qa = installQA({
    engine,
    scroll,
    rig,
    onJump: () => {
      applyState(rig.current.state, 0.016);
      engine.setFocus(camera.position.distanceTo(rig.current.target));
    },
  });

  applyState(KEYFRAMES[0].state, 0.016);
  await engine.renderer.compileAsync(scene, camera);
  setupReveals({ reduced: scroll.reduced });
  setupHeader();

  if (!scroll.reduced) {
    gsap.fromTo('#clarity-title',
      { autoAlpha: 0, scale: 0.88, y: 20 },
      {
        autoAlpha: 1,
        scale: 1.0,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#clarity',
          start: 'top 65%',
          end: 'center center',
          scrub: true,
        },
      }
    );
  }

  let frameCount = 0;
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add((time, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 1 / 20);
    const s = scroll.raf(time * 1000);
    const { state } = rig.update(dt, s.progress);
    env.skyUniforms.uTime.value += dt;
    meadow.uTime.value += dt;
    basin.waterUniforms.uTime.value += dt;
    applyState(state, dt);
    picker.update();
    engine.setFocus(camera.position.distanceTo(rig.current.target));
    engine.render(dt);
    if (++frameCount === 3) qa.markReady();
  });
}
