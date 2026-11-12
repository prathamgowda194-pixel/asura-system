/**
 * Materials from code: tileable procedural textures (colour, roughness, bump) and PBR presets.
 * No image files needed. Textures are generated once per parameter set and cached.
 *
 *   surface('concrete', { color: '#b9b3a9', tile: 2.4, boards: 24 })   board-formed concrete, 2.4 m per repeat
 *   surface('stone',    { color: '#d9cfbf', tile: 1.6, travertine: true })
 *   surface('wood',     { color: '#8f6a4a', tile: 1.2 })
 *   surface('plaster',  { color: '#ebe5da', tile: 2 })
 *   surface('terrazzo', { color: '#e4ded3', tile: 1, chips: ['#a99880', '#5f5b55', '#d6c7b3'] })
 *   surface('brushed',  { color: '#8a8a8a', tile: 0.5 })
 *   `tile` (metres per repeat) is for kit parts with metric UVs; plain 0..1 UVs use `repeat: [u, v]`.
 *   Shared options: bump (relief strength), roughness (multiplier on the map), seed (new pattern).
 *   materials.clay('#e9e4dc')            single-colour model look
 *   materials.metal({ color: '#7d6c58' }) brushed bronze/steel
 *   materials.glass({ tint: '#a8bfc1' }) physical glass (transmission); { cheap: true } on low tier
 *   materials.emissive('#ffcf9a', 4)     HDR light source (windows, lamps); >1 blooms
 *   materials.ceramic / plastic / liquid / frosted / fabric / iridescent   object materials (see below)
 *   Transmission (glass, liquid, frosted) costs an extra render pass: pass { cheap: true } on the low tier.
 *
 * Rules: albedo never pure white or black, roughness rarely below 0.05 or exactly 1,
 * metalness 0 or 1. Every surface gets some roughness variation; uniform roughness reads as CG.
 */
import * as THREE from 'three';
import { rng } from './noise.js';

const cache = new Map();

function lattice(fx, fy, seed) {
  const r = rng(seed);
  const a = new Float32Array(fx * fy);
  for (let i = 0; i < a.length; i++) a[i] = r();
  return a;
}

function sampleLattice(a, fx, fy, x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = x - xi;
  const ty = y - yi;
  const u = tx * tx * (3 - 2 * tx);
  const v = ty * ty * (3 - 2 * ty);
  const x0 = xi % fx;
  const y0 = yi % fy;
  const x1 = (x0 + 1) % fx;
  const y1 = (y0 + 1) % fy;
  const a00 = a[y0 * fx + x0];
  const a10 = a[y0 * fx + x1];
  const a01 = a[y1 * fx + x0];
  const a11 = a[y1 * fx + x1];
  return a00 + (a10 - a00) * u + (a01 - a00) * v + (a00 - a10 - a01 + a11) * u * v;
}

/** Seamless fbm field in 0..1. stretch [sx, sy] makes streaks (wood grain, brushed metal). */
export function tileField(size, { scale = 4, octaves = 5, gain = 0.5, seed = 1, stretch = [1, 1] } = {}) {
  const out = new Float32Array(size * size);
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    const fx = Math.max(1, Math.round(scale * stretch[0] * 2 ** o));
    const fy = Math.max(1, Math.round(scale * stretch[1] * 2 ** o));
    const lat = lattice(fx, fy, seed * 131 + o * 101);
    for (let y = 0; y < size; y++) {
      const v = (y / size) * fy;
      for (let x = 0; x < size; x++) out[y * size + x] += amp * sampleLattice(lat, fx, fy, (x / size) * fx, v);
    }
    norm += amp;
    amp *= gain;
  }
  for (let i = 0; i < out.length; i++) out[i] /= norm;
  return out;
}

function rgb255(css) {
  const c = new THREE.Color(css);
  const o = { r: 0, g: 0, b: 0 };
  c.getRGB(o, THREE.SRGBColorSpace);
  return [o.r * 255, o.g * 255, o.b * 255];
}

function makeCanvas(size) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  return canvas;
}

function toTexture(canvas, color) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Paint three canvases (albedo, roughness, bump) from a per-pixel function, then optional vector marks. */
function paint(size, pixel, marks) {
  const cMap = makeCanvas(size);
  const cRough = makeCanvas(size);
  const cBump = makeCanvas(size);
  const ctxs = [cMap, cRough, cBump].map((c) => c.getContext('2d'));
  const imgs = ctxs.map((ctx) => ctx.createImageData(size, size));
  const px = [0, 0, 0, 0, 0];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      pixel(i, x, y, px); // px = [r, g, b, roughness 0..1, bump 0..1]
      const o = i * 4;
      imgs[0].data[o] = px[0]; imgs[0].data[o + 1] = px[1]; imgs[0].data[o + 2] = px[2]; imgs[0].data[o + 3] = 255;
      const r = Math.min(255, Math.max(0, px[3] * 255));
      imgs[1].data[o] = imgs[1].data[o + 1] = imgs[1].data[o + 2] = r; imgs[1].data[o + 3] = 255;
      const b = Math.min(255, Math.max(0, px[4] * 255));
      imgs[2].data[o] = imgs[2].data[o + 1] = imgs[2].data[o + 2] = b; imgs[2].data[o + 3] = 255;
    }
  }
  ctxs.forEach((ctx, k) => ctx.putImageData(imgs[k], 0, 0));
  marks?.(...ctxs);
  return { map: toTexture(cMap, true), roughness: toTexture(cRough, false), bump: toTexture(cBump, false) };
}

/** Draw a mark on all three canvases at the same place, wrapping across edges so tiling stays seamless. */
function wrapDraw(size, ctx, x, y, r, draw) {
  for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
    const cx = x + dx;
    const cy = y + dy;
    if (cx + r < 0 || cy + r < 0 || cx - r > size || cy - r > size) continue;
    draw(ctx, cx, cy);
  }
}

const BUILDERS = {
  concrete({ color = '#b8b2a8', size = 512, seed = 1, boards = 0, pores = 0.6 }) {
    const base = rgb255(color);
    const blot = tileField(size, { scale: 3, octaves: 4, seed });
    const speck = tileField(size, { scale: 48, octaves: 2, seed: seed + 7 });
    const board = rng(seed + 3);
    const boardTone = Array.from({ length: 64 }, () => (board() - 0.5) * 0.06);
    return paint(size, (i, x, y, px) => {
      let v = 1 + (blot[i] - 0.5) * 0.24 + (speck[i] - 0.5) * 0.14;
      let bump = speck[i] * 0.6 + blot[i] * 0.4;
      if (boards > 0) {
        const row = Math.floor(y / boards);
        const fy = y % boards;
        const seam = Math.exp(-((fy / 1.4) ** 2));
        v += boardTone[row % 64] - seam * 0.1;
        bump -= seam * 0.35;
      }
      px[0] = base[0] * v; px[1] = base[1] * v; px[2] = base[2] * v;
      px[3] = 0.8 + (blot[i] - 0.5) * 0.25 + (speck[i] - 0.5) * 0.1;
      px[4] = bump;
    }, (cm, cr, cb) => {
      const r = rng(seed + 11);
      const n = Math.floor(size * size * 0.0009 * pores);
      for (let k = 0; k < n; k++) {
        const x = r() * size;
        const y = r() * size;
        const rad = 0.5 + r() * 1.6;
        wrapDraw(size, cm, x, y, rad, (c, cx, cy) => { c.fillStyle = 'rgba(40,36,32,0.35)'; c.beginPath(); c.arc(cx, cy, rad, 0, 6.283); c.fill(); });
        wrapDraw(size, cb, x, y, rad, (c, cx, cy) => { c.fillStyle = 'rgba(0,0,0,0.8)'; c.beginPath(); c.arc(cx, cy, rad, 0, 6.283); c.fill(); });
        wrapDraw(size, cr, x, y, rad, (c, cx, cy) => { c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(cx, cy, rad, 0, 6.283); c.fill(); });
      }
    });
  },

  stone({ color = '#d8cfbf', size = 512, seed = 2, strata = 0.5, travertine = false }) {
    const base = rgb255(color);
    const warp = tileField(size, { scale: 2, octaves: 4, seed });
    const fine = tileField(size, { scale: 24, octaves: 3, seed: seed + 5 });
    return paint(size, (i, x, y, px) => {
      const band = Math.sin(((y / size) * 9 + (warp[i] - 0.5) * 2.2) * Math.PI * 2);
      let v = 1 + band * 0.035 * strata + (warp[i] - 0.5) * 0.16 + (fine[i] - 0.5) * 0.08;
      px[0] = base[0] * v; px[1] = base[1] * (v * 0.995); px[2] = base[2] * (v * 0.985);
      px[3] = 0.62 + (fine[i] - 0.5) * 0.25 + band * 0.04;
      px[4] = fine[i] * 0.7 + warp[i] * 0.3;
    }, (cm, cr, cb) => {
      if (!travertine) return;
      const r = rng(seed + 13);
      const n = Math.floor(size * 0.6);
      for (let k = 0; k < n; k++) {
        const x = r() * size;
        const y = r() * size;
        const w = 1 + r() ** 2 * 5;
        const h = 0.4 + r() * 0.8;
        const draw = (fill) => (c, cx, cy) => { c.fillStyle = fill; c.beginPath(); c.ellipse(cx, cy, w, h, 0, 0, 6.283); c.fill(); };
        wrapDraw(size, cm, x, y, w, draw('rgba(120,104,84,0.22)'));
        wrapDraw(size, cb, x, y, w, draw('rgba(0,0,0,0.7)'));
        wrapDraw(size, cr, x, y, w, draw('rgba(255,255,255,0.5)'));
      }
    });
  },

  wood({ color = '#8f6a4a', size = 512, seed = 3, rings = 14 }) {
    const base = rgb255(color);
    const warp = tileField(size, { scale: 2, octaves: 3, seed, stretch: [1, 3] });
    const fiber = tileField(size, { scale: 4, octaves: 3, seed: seed + 9, stretch: [0.25, 24] });
    return paint(size, (i, x, y, px) => {
      const g = ((y / size) * rings + (warp[i] - 0.5) * 2.5) % 1;
      const line = Math.exp(-((Math.min(g, 1 - g) / 0.06) ** 2));
      const v = 0.94 + (fiber[i] - 0.5) * 0.22 - line * 0.18 + (warp[i] - 0.5) * 0.1;
      px[0] = base[0] * v; px[1] = base[1] * v; px[2] = base[2] * (v * 0.97);
      px[3] = 0.62 + line * 0.15 + (fiber[i] - 0.5) * 0.2;
      px[4] = fiber[i] * 0.8 - line * 0.3;
    });
  },

  plaster({ color = '#e9e3d8', size = 512, seed = 4 }) {
    const base = rgb255(color);
    const low = tileField(size, { scale: 2, octaves: 4, seed });
    const fine = tileField(size, { scale: 64, octaves: 2, seed: seed + 3 });
    return paint(size, (i, x, y, px) => {
      const v = 1 + (low[i] - 0.5) * 0.07 + (fine[i] - 0.5) * 0.05;
      px[0] = base[0] * v; px[1] = base[1] * v; px[2] = base[2] * v;
      px[3] = 0.88 + (fine[i] - 0.5) * 0.08;
      px[4] = fine[i] * 0.5 + low[i] * 0.5;
    });
  },

  terrazzo({ color = '#e4ded3', size = 512, seed = 5, chips = ['#a99880', '#5f5b55', '#d6c7b3', '#8c968a'], density = 1 }) {
    const base = rgb255(color);
    const fine = tileField(size, { scale: 40, octaves: 2, seed });
    return paint(size, (i, x, y, px) => {
      const v = 1 + (fine[i] - 0.5) * 0.06;
      px[0] = base[0] * v; px[1] = base[1] * v; px[2] = base[2] * v;
      px[3] = 0.35 + (fine[i] - 0.5) * 0.1;
      px[4] = 0.5;
    }, (cm, cr, cb) => {
      const r = rng(seed + 17);
      const n = Math.floor(size * 1.2 * density);
      for (let k = 0; k < n; k++) {
        const x = r() * size;
        const y = r() * size;
        const rad = 1.5 + r() ** 2 * 9;
        const sides = 4 + Math.floor(r() * 4);
        const rot = r() * 6.283;
        const fill = chips[Math.floor(r() * chips.length)];
        const poly = (style) => (c, cx, cy) => {
          c.fillStyle = style;
          c.beginPath();
          for (let s = 0; s < sides; s++) {
            const a = rot + (s / sides) * 6.283;
            const rr = rad * (0.7 + 0.3 * Math.sin(a * 3 + k));
            c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
          }
          c.closePath();
          c.fill();
        };
        wrapDraw(size, cm, x, y, rad, poly(fill));
        wrapDraw(size, cr, x, y, rad, poly('rgba(60,60,60,1)'));
      }
    });
  },

  brushed({ color = '#8a8a8a', size = 512, seed = 6 }) {
    const base = rgb255(color);
    const streak = tileField(size, { scale: 2, octaves: 4, seed, stretch: [0.25, 48] });
    return paint(size, (i, x, y, px) => {
      const v = 1 + (streak[i] - 0.5) * 0.12;
      px[0] = base[0] * v; px[1] = base[1] * v; px[2] = base[2] * v;
      px[3] = 0.3 + (streak[i] - 0.5) * 0.35;
      px[4] = streak[i];
    });
  },
};

function getSet(kind, opts) {
  const key = JSON.stringify([kind, opts]);
  if (!cache.has(key)) {
    const builder = BUILDERS[kind];
    if (!builder) throw new Error(`Unknown surface "${kind}". Use one of: ${Object.keys(BUILDERS).join(', ')}`);
    cache.set(key, builder(opts));
  }
  return cache.get(key);
}

function withRepeat(tex, repeat) {
  const t = tex.clone();
  t.repeat.set(repeat[0], repeat[1]);
  t.needsUpdate = true;
  return t;
}

/**
 * A MeshStandardMaterial with procedural albedo, roughness and bump maps.
 * tile:   metres covered by one texture repeat, for geometry with metric UVs (architecture kit parts).
 * repeat: [u, v] repeats for ordinary 0..1 UVs (planes, imported models). `tile` wins if both are set.
 */
export function surface(kind, { tile = null, repeat = [1, 1], roughness = 1, bump = 1, metalness = 0, ...opts } = {}) {
  if (tile) repeat = [1 / tile, 1 / tile];
  const set = getSet(kind, opts);
  return new THREE.MeshStandardMaterial({
    name: kind,
    map: withRepeat(set.map, repeat),
    roughnessMap: withRepeat(set.roughness, repeat),
    bumpMap: withRepeat(set.bump, repeat),
    bumpScale: bump,
    roughness,
    metalness,
  });
}

/** Raw texture set { map, roughness, bump } if you need it on another material type. */
export function surfaceTextures(kind, opts = {}) {
  return getSet(kind, opts);
}

export const materials = {
  clay(color = '#e8e2d8', roughness = 0.9) {
    return new THREE.MeshStandardMaterial({ name: 'clay', color, roughness, metalness: 0 });
  },
  metal({ color = '#8c7b66', roughness = 0.4, repeat = [2, 2] } = {}) {
    const set = getSet('brushed', { color: '#ffffff' });
    return new THREE.MeshStandardMaterial({ name: 'metal', color, metalness: 1, roughness: roughness / 0.3, roughnessMap: withRepeat(set.roughness, repeat) });
  },
  /** specular < 1 tames sun glints that otherwise bloom into a flare in the middle of a facade. */
  glass({ tint = '#a8bfc1', roughness = 0.05, thickness = 0.05, specular = 0.6, cheap = false } = {}) {
    if (cheap) {
      return new THREE.MeshPhysicalMaterial({ name: 'glass-cheap', color: tint, roughness, metalness: 0, transparent: true, opacity: 0.38, depthWrite: false, envMapIntensity: 1.4, specularIntensity: specular });
    }
    return new THREE.MeshPhysicalMaterial({ name: 'glass', color: tint, roughness, metalness: 0, transmission: 1, thickness, ior: 1.5, envMapIntensity: 1.2, specularIntensity: specular });
  },
  emissive(color = '#ffcf9a', intensity = 3) {
    const m = new THREE.MeshBasicMaterial({ name: 'emissive', color: new THREE.Color(color).multiplyScalar(intensity) });
    m.userData.baseColor = new THREE.Color(color);
    return m;
  },

  // Object materials. They look expensive only when something bright is there to reflect:
  // use them with createStudio() softboxes or a sky environment.

  /** Glazed ceramic, lacquer, enamel, coated paper: a colour under a thin glossy clear layer. */
  ceramic({ color = '#e9e4da', roughness = 0.5, clearcoat = 1, clearcoatRoughness = 0.07 } = {}) {
    return new THREE.MeshPhysicalMaterial({ name: 'ceramic', color, roughness, metalness: 0, clearcoat, clearcoatRoughness });
  },
  /** Moulded plastic, rubber (roughness 0.7+), soft-touch coatings. */
  plastic({ color = '#d8d2c8', roughness = 0.42, clearcoat = 0.2 } = {}) {
    return new THREE.MeshPhysicalMaterial({ name: 'plastic', color, roughness, metalness: 0, clearcoat, clearcoatRoughness: 0.3 });
  },
  /**
   * Coloured liquid or tinted glass. Colour comes from absorption with depth (attenuation), so thick
   * parts are deeper in tone than thin edges, as in real oil, perfume, honey or coffee.
   * density: how fast light is absorbed (0.2 pale ... 3 nearly opaque), per scene unit.
   */
  liquid({ color = '#c98b4a', density = 0.8, ior = 1.34, thickness = 1, roughness = 0.02, cheap = false } = {}) {
    if (cheap) return new THREE.MeshPhysicalMaterial({ name: 'liquid-cheap', color, roughness, transparent: true, opacity: 0.78, depthWrite: false });
    return new THREE.MeshPhysicalMaterial({
      name: 'liquid', color: '#ffffff', roughness, metalness: 0, transmission: 1, ior, thickness,
      attenuationColor: new THREE.Color(color), attenuationDistance: 1 / Math.max(0.01, density), specularIntensity: 0.9,
    });
  },
  /** Sandblasted or acid-etched glass: light passes through blurred. */
  frosted({ tint = '#eef2f0', roughness = 0.38, thickness = 0.3, cheap = false } = {}) {
    if (cheap) return new THREE.MeshPhysicalMaterial({ name: 'frosted-cheap', color: tint, roughness: 0.6, transparent: true, opacity: 0.6, depthWrite: false });
    return new THREE.MeshPhysicalMaterial({ name: 'frosted', color: tint, roughness, metalness: 0, transmission: 1, thickness, ior: 1.5 });
  },
  /** Textiles, felt, velvet, suede: soft rim highlight (sheen) instead of a specular hotspot. */
  fabric({ color = '#7d6f63', sheenColor = '#ffffff', sheen = 1, sheenRoughness = 0.55, roughness = 0.92 } = {}) {
    return new THREE.MeshPhysicalMaterial({ name: 'fabric', color, roughness, metalness: 0, sheen, sheenColor: new THREE.Color(sheenColor), sheenRoughness });
  },
  /** Thin-film colour shift: anodised metal, soap film, beetle shell, pearl. Use sparingly. */
  iridescent({ color = '#cfd6da', roughness = 0.2, metalness = 1, iridescence = 1, ior = 1.35, range = [120, 420] } = {}) {
    return new THREE.MeshPhysicalMaterial({ name: 'iridescent', color, roughness, metalness, iridescence, iridescenceIOR: ior, iridescenceThicknessRange: range });
  },
};

/** Change the brightness of a materials.emissive() material (keeps hue). */
export function setEmissive(material, intensity) {
  material.color.copy(material.userData.baseColor).multiplyScalar(intensity);
}
