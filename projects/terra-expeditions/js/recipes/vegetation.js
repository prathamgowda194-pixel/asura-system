/**
 * Vegetation from code: instanced, wind-animated trees and shrubs.
 * Each canopy is a cluster of noisy blobs (darker low, lighter high = fake self-shadowing) with
 * leaf-clump shading and ragged outlines in the shader, which reads as foliage at architectural
 * viewing distances. Far trees get fewer blobs and the detail fades out before it can shimmer.
 *
 *   const trees = createTrees([
 *     { kind: 'umbrellaPine', x: -20, z: -18 },
 *     { kind: 'cypress', x: -30, z: 4, scale: 1.1 },
 *     { kind: 'olive', x: 12, z: 14 },
 *     { kind: 'shrub', x: 4, z: 9 },
 *   ], { heightAt: land.heightAt, palette: { cypress: '#2c3a26' } });
 *   scene.add(trees.group); trees.update(dt) every frame.
 *
 * kinds: cypress, umbrellaPine, olive, round, shrub
 *
 *   scatter({ count: 40, area: [minX, minZ, maxX, maxZ], minDist: 6, seed: 3, avoid: (x, z) => ... })
 *     -> [{ x, z }] positions for createTrees. Use clusters (several scatters with small areas)
 *        rather than one uniform field: real planting is grouped.
 */
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { noise3D, rng, NOISE_GLSL } from './noise.js';

const DEFAULT_PALETTE = {
  cypress: '#33442b',
  umbrellaPine: '#3f4d2d',
  olive: '#7a8763',
  round: '#4d5f37',
  shrub: '#5a6a40',
  trunk: '#4a3a2e',
};

// Canopy builders. Each pushes blobs [x, y, z, rx, ry, rz] relative to the tree base, in metres.
const KINDS = {
  cypress: {
    // One tall flame, not a stack: stacked blobs read as a caterpillar.
    // Foliage almost to the ground, so only a hint of trunk shows.
    trunk: (r) => [0.5, 0.12],
    canopy(r, out) {
      const h = 8 + r() * 3;
      const R = 0.85 + r() * 0.25;
      out.push([0, 0.3 + (h - 0.3) * 0.46, 0, R, (h - 0.3) * 0.5, R]);
      out.push([(r() - 0.5) * 0.15, h - 0.6, (r() - 0.5) * 0.15, R * 0.42, 1.3, R * 0.42]);
    },
  },
  umbrellaPine: {
    trunk: (r) => [7 + r() * 2.5, 0.3],
    lean: 0.14,
    canopy(r, out, simple) {
      const top = 7.4 + r() * 2.2;
      const n = simple ? 3 : 7;
      out.push([0, top, 0, 3.2 + r() * 0.8, 1.05 + r() * 0.25, 3.0 + r() * 0.8]);
      for (let i = 1; i < n; i++) {
        const a = (i / (n - 1)) * Math.PI * 2 + r() * 0.6;
        const d = 2.2 + r() * 1.3;
        out.push([Math.cos(a) * d, top + (r() - 0.6) * 0.8, Math.sin(a) * d, 1.6 + r() * 0.9, 0.75 + r() * 0.3, 1.5 + r() * 0.9]);
      }
    },
  },
  olive: {
    trunk: (r) => [1.3 + r() * 0.4, 0.2],
    lean: 0.2,
    canopy(r, out, simple) {
      const n = simple ? 2 : 5;
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2;
        const d = i === 0 ? 0 : 0.9 + r() * 0.7;
        out.push([Math.cos(a) * d, 2.5 + r() * 0.8, Math.sin(a) * d, 1.2 + r() * 0.5, 0.85 + r() * 0.3, 1.1 + r() * 0.5]);
      }
    },
  },
  round: {
    trunk: (r) => [2.2 + r() * 1, 0.2],
    canopy(r, out, simple) {
      const n = simple ? 2 : 5;
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2;
        const d = i === 0 ? 0 : 1.1 + r() * 0.8;
        out.push([Math.cos(a) * d, 4.2 + r() * 1.4, Math.sin(a) * d, 1.6 + r() * 0.7, 1.4 + r() * 0.5, 1.6 + r() * 0.7]);
      }
    },
  },
  shrub: {
    trunk: null,
    canopy(r, out, simple) {
      const n = simple ? 1 : 3;
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2;
        const d = i === 0 ? 0 : 0.5 + r() * 0.5;
        out.push([Math.cos(a) * d, 0.35 + r() * 0.2, Math.sin(a) * d, 0.7 + r() * 0.5, 0.45 + r() * 0.25, 0.65 + r() * 0.5]);
      }
    },
  },
};

// Near canopies: 320 triangles per blob. Far canopies: 180. The ragged-outline shader hides the facets.
const blobGeos = new Map();
function blobGeometry(detail = 3) {
  if (blobGeos.has(detail)) return blobGeos.get(detail);
  const ico = new THREE.IcosahedronGeometry(1, detail);
  ico.deleteAttribute('normal');
  ico.deleteAttribute('uv');
  const g = mergeVertices(ico); // indexed, so normals come out smooth instead of faceted
  const n3 = noise3D(5);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = 0.8 + n3(v.x * 1.9 + 3, v.y * 1.9, v.z * 1.9) * 0.3 + n3(v.x * 4.7, v.y * 4.7 + 1, v.z * 4.7) * 0.14 + n3(v.x * 9.1, v.y * 9.1, v.z * 9.1 + 2) * 0.06;
    v.multiplyScalar(k);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  blobGeos.set(detail, g);
  return g;
}

/**
 * Foliage shading on top of MeshStandardMaterial:
 *  - wind sway per instance
 *  - leaf-clump detail in world space: darker gaps, lighter clumps, bumped normals
 *  - ragged silhouettes (fragments near the outline are cut by the same noise), which is what
 *    stops a smooth blob from reading as rubber
 * Detail fades out where it would alias (far trees), using the pixel footprint of the noise.
 */
function foliageShader(material, uniforms, { wind = true } = {}) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWind;\nvarying vec3 vLeafPos;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  #ifdef USE_INSTANCING
    vLeafPos = ( modelMatrix * instanceMatrix * vec4( position, 1.0 ) ).xyz;
    ${wind ? `float phase = instanceMatrix[3].x * 0.21 + instanceMatrix[3].z * 0.17;
    float sway = sin(uWind * 1.1 + phase) * 0.6 + sin(uWind * 2.3 + phase * 1.7) * 0.4;
    transformed.x += sway * 0.03 * max(position.y + 1.0, 0.0);
    transformed.z += cos(uWind * 0.9 + phase) * 0.018 * max(position.y + 1.0, 0.0);` : ''}
  #else
    vLeafPos = ( modelMatrix * vec4( position, 1.0 ) ).xyz;
  #endif`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vLeafPos;
uniform float uLeafScale, uLeafBump, uLeafCut;
${NOISE_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  vec3 leafP = vLeafPos * uLeafScale;
  float leafN = asuraNoise3( leafP ) * 0.62 + asuraNoise3( leafP * 2.9 + 7.1 ) * 0.38;
  float leafDetail = 1.0 - smoothstep( 0.25, 0.8, length( fwidth( leafP ) ) );
  diffuseColor.rgb *= mix( 1.0, 0.5 + 0.8 * leafN, leafDetail );`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
  {
    float facing = abs( dot( normal, normalize( vViewPosition ) ) );
    if ( leafN < ( 1.0 - smoothstep( 0.0, 0.45, facing ) ) * uLeafCut * leafDetail ) discard;
    vec3 sx = dFdx( - vViewPosition );
    vec3 sy = dFdy( - vViewPosition );
    vec3 r1 = cross( sy, normal );
    vec3 r2 = cross( normal, sx );
    float det = dot( sx, r1 );
    vec2 dh = vec2( dFdx( leafN ), dFdy( leafN ) ) * uLeafBump * leafDetail;
    normal = normalize( abs( det ) * normal - sign( det ) * ( dh.x * r1 + dh.y * r2 ) );
  }`);
  };
  material.customProgramCacheKey = () => `asura-foliage:${wind}`;
}

let blobTex = null;
function groundBlobTexture() {
  if (blobTex) return blobTex;
  const s = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext('2d');
  // alphaMap reads the GREEN channel, so draw opaque grey levels. A white gradient with fading alpha
  // uploads as solid white wherever alpha > 0 and renders as a hard-edged disc.
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, s, s);
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgb(255,255,255)');
  g.addColorStop(0.5, 'rgb(128,128,128)');
  g.addColorStop(1, 'rgb(0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  blobTex = new THREE.CanvasTexture(canvas);
  blobTex.colorSpace = THREE.NoColorSpace;
  return blobTex;
}

/**
 * groundShadows: soft dark disc under every tree. Shadow maps only cover the area near the subject,
 * so without these, distant trees float above the ground. Set to 0 to disable.
 * leaf: { scale: clumps per metre (2.6), bump: relief strength (0.18), cut: outline raggedness 0..1 (0.7) }.
 *   Stylised looks (clay, paper, miniature) often want smooth canopies: { bump: 0, cut: 0 }.
 */
export function createTrees(list, { heightAt = () => 0, palette = {}, seed = 9, density = 1, wind = true, center = [0, 0], lodDistance = 90, groundShadows = 0.3, leaf = {} } = {}) {
  const colors = { ...DEFAULT_PALETTE, ...palette };
  const rand = rng(seed);
  const items = density < 1 ? list.filter((t) => t.keep || rand() < density) : list;
  const group = new THREE.Group();
  group.name = 'trees';
  const uniforms = {
    uWind: { value: 0 },
    uLeafScale: { value: leaf.scale ?? 2.6 },
    uLeafBump: { value: leaf.bump ?? 0.18 },
    uLeafCut: { value: leaf.cut ?? 0.7 },
  };

  const canopyMat = new THREE.MeshStandardMaterial({ name: 'foliage', roughness: 0.9, metalness: 0, color: '#ffffff' });
  const trunkMat = new THREE.MeshStandardMaterial({ name: 'trunk', color: colors.trunk, roughness: 0.95 });
  foliageShader(canopyMat, uniforms, { wind });

  const blobs = [];
  const trunks = [];
  const dummy = new THREE.Object3D();
  const tmp = [];

  for (const t of items) {
    const def = KINDS[t.kind];
    if (!def) throw new Error(`Unknown tree kind "${t.kind}". Use: ${Object.keys(KINDS).join(', ')}`);
    const r = rng(Math.floor(t.x * 73 + t.z * 131 + seed * 7));
    const s = t.scale ?? 0.85 + r() * 0.3;
    const rot = t.rot ?? r() * Math.PI * 2;
    const y = t.y ?? heightAt(t.x, t.z);
    const lean = (def.lean ?? 0.03) * (r() - 0.5) * 2;
    const simple = Math.hypot(t.x - center[0], t.z - center[1]) > lodDistance;
    const base = new THREE.Color(colors[t.kind]);
    if (def.trunk) {
      const [h, rad] = def.trunk(r);
      trunks.push({ x: t.x, y, z: t.z, h: h * s, r: rad * s, rot, lean });
    }
    tmp.length = 0;
    def.canopy(r, tmp, simple);
    let minY = Infinity;
    let maxY = -Infinity;
    for (const b of tmp) { minY = Math.min(minY, b[1]); maxY = Math.max(maxY, b[1]); }
    const c = Math.cos(rot);
    const sn = Math.sin(rot);
    for (const [bx, by, bz, sx, sy, sz] of tmp) {
      const height01 = maxY > minY ? (by - minY) / (maxY - minY) : 0.5;
      const shade = 0.82 + height01 * 0.26; // lower blobs darker: reads as self-shadowing
      blobs.push({
        x: t.x + (bx * c - bz * sn) * s + lean * by * s,
        y: y + by * s,
        z: t.z + (bx * sn + bz * c) * s,
        sx: sx * s, sy: sy * s, sz: sz * s,
        rot: r() * Math.PI * 2,
        far: simple,
        color: base.clone().offsetHSL((r() - 0.5) * 0.025, (r() - 0.5) * 0.08, (r() - 0.5) * 0.05).multiplyScalar(shade),
      });
    }
  }

  for (const [far, detail, name] of [[false, 3, 'canopies'], [true, 2, 'canopies-far']]) {
    const list = blobs.filter((b) => b.far === far);
    if (!list.length) continue;
    const mesh = new THREE.InstancedMesh(blobGeometry(detail), canopyMat, list.length);
    list.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z);
      dummy.rotation.set(0, b.rot, 0);
      dummy.scale.set(b.sx, b.sy, b.sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, b.color);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name;
    group.add(mesh);
  }

  if (trunks.length) {
    const geo = new THREE.CylinderGeometry(0.55, 1, 1, 7, 1);
    geo.translate(0, 0.5, 0);
    const mesh = new THREE.InstancedMesh(geo, trunkMat, trunks.length);
    trunks.forEach((t, i) => {
      dummy.position.set(t.x, t.y - 0.2, t.z);
      dummy.rotation.set(t.lean, t.rot, t.lean * 0.5);
      dummy.scale.set(t.r, t.h + 0.3, t.r);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = 'trunks';
    group.add(mesh);
  }

  if (groundShadows > 0 && items.length) {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: groundShadows, alphaMap: groundBlobTexture(), depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    const mesh = new THREE.InstancedMesh(geo, mat, items.length);
    items.forEach((t, i) => {
      const size = t.kind === 'shrub' ? 2.4 : t.kind === 'cypress' ? 3 : 7;
      const s = (t.scale ?? 1) * size;
      dummy.position.set(t.x, (t.y ?? heightAt(t.x, t.z)) + 0.04, t.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(s, 1, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.renderOrder = 1;
    mesh.name = 'tree-ground-shadows';
    group.add(mesh);
  }

  return {
    group,
    count: { trees: items.length, blobs: blobs.length },
    update(dt) { uniforms.uWind.value += dt; },
  };
}

/** Rejection-sampled scatter inside a rectangle [minX, minZ, maxX, maxZ]. */
export function scatter({ count = 30, area = [-50, -50, 50, 50], minDist = 4, seed = 1, avoid = () => false, tries = 30 } = {}) {
  const r = rng(seed);
  const out = [];
  for (let n = 0; n < count * tries && out.length < count; n++) {
    const x = area[0] + r() * (area[2] - area[0]);
    const z = area[1] + r() * (area[3] - area[1]);
    if (avoid(x, z)) continue;
    if (out.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < minDist * minDist)) continue;
    out.push({ x, z });
  }
  return out;
}

/** Grouped planting: `groups` clumps of `perGroup` plants scattered around random centres. */
export function clusters({ groups = 8, perGroup = 6, area = [-100, -100, 100, 100], spread = 10, minDist = 4, seed = 1, avoid = () => false } = {}) {
  const r = rng(seed);
  const out = [];
  for (let g = 0; g < groups; g++) {
    const cx = area[0] + r() * (area[2] - area[0]);
    const cz = area[1] + r() * (area[3] - area[1]);
    out.push(...scatter({ count: perGroup, area: [cx - spread, cz - spread, cx + spread, cz + spread], minDist, seed: seed * 31 + g, avoid }));
  }
  return out;
}
