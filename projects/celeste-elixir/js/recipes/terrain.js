/**
 * Ground from code: displaced terrain with slope/height colouring, flattened building pads,
 * contour-line shading, model plinths and soft contact shadows.
 *
 *   const land = createTerrain({
 *     size: 700, segments: 220, height: 14, scale: 0.012, seed: 4,
 *     shape: (x, z) => -22 * smoothstep(30, 70, z),          // base landform (cliff toward +z)
 *     pads: [{ x: 0, z: 0, radius: 34, feather: 30, y: 0 }],  // flat build areas
 *     colors: { low: '#6e7150', high: '#958a71', rock: '#8a8173', sand: '#cdbb98' },
 *   });
 *   scene.add(land.mesh);  land.heightAt(x, z) -> ground y for placing trees and buildings
 *
 *   applyContours(material, { spacing: 2, color: '#2c2a26', opacity: 0.55 })   topographic look
 *   createPlinth({ w: 30, d: 20, h: 1.2, material })                          model base
 *   createContactShadow({ w: 26, d: 12, opacity: 0.45 })                      grounding blob
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { noise2D, fbm2 } from './noise.js';
import { tileField } from './materials.js';

let detailCache = null;
/** Mottled near-white texture multiplied over vertex colours: breaks up flat ground at close range. */
function groundDetail(seed = 31) {
  if (detailCache) return detailCache;
  const size = 512;
  const big = tileField(size, { scale: 3, octaves: 4, seed });
  const mid = tileField(size, { scale: 12, octaves: 3, seed: seed + 1 });
  const fine = tileField(size, { scale: 64, octaves: 2, seed: seed + 2 });
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 0.78 + (big[i] - 0.5) * 0.35 + (mid[i] - 0.5) * 0.3 + (fine[i] - 0.5) * 0.25;
    const g = Math.max(0, Math.min(1, v)) * 255;
    img.data[i * 4] = g * 0.98;
    img.data[i * 4 + 1] = g;
    img.data[i * 4 + 2] = g * 0.94;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  detailCache = new THREE.CanvasTexture(canvas);
  detailCache.wrapS = detailCache.wrapT = THREE.RepeatWrapping;
  detailCache.colorSpace = THREE.NoColorSpace; // a brightness modulation, not a colour: keep values linear
  detailCache.anisotropy = 8;
  return detailCache;
}

export const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function createTerrain({
  size = 600,
  segments = 200,
  height = 12,
  scale = 0.012,
  octaves = 5,
  seed = 1,
  shape = () => 0,
  pads = [],
  sandLevel = null,
  colors = { low: '#6e7150', high: '#958a71', rock: '#8a8173', sand: '#cdbb98' },
  roughness = 0.95,
  detailTile = 7, // metres per repeat of the ground detail texture; 0 disables it
  fadeEdge = 0.3, // outer share of the terrain that melts into the fog colour, so its edge never shows; 0 disables
} = {}) {
  const n2 = noise2D(seed);
  const n2b = noise2D(seed + 1);

  function heightAt(x, z) {
    const wx = x + (n2b(x * scale * 0.5, z * scale * 0.5) - 0.5) * 40; // domain warp: less grid-like
    const wz = z + (n2b(z * scale * 0.5 + 9, x * scale * 0.5) - 0.5) * 40;
    let h = (fbm2(n2, wx * scale, wz * scale, octaves) - 0.5) * 2 * height + shape(x, z);
    for (const p of pads) {
      const d = Math.hypot(x - p.x, z - p.z);
      const k = 1 - smoothstep(p.radius, p.radius + (p.feather ?? 20), d);
      h = h + ((p.y ?? 0) - h) * k;
    }
    return h;
  }

  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  geometry.computeVertexNormals();

  const c = {
    low: new THREE.Color(colors.low),
    high: new THREE.Color(colors.high),
    rock: new THREE.Color(colors.rock),
    sand: new THREE.Color(colors.sand ?? colors.high),
  };
  const nrm = geometry.attributes.normal;
  const col = new Float32Array(pos.count * 3);
  const tmp = new THREE.Color();
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) { minY = Math.min(minY, pos.getY(i)); maxY = Math.max(maxY, pos.getY(i)); }
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const slope = 1 - nrm.getY(i);
    const t = (y - minY) / Math.max(1e-6, maxY - minY);
    tmp.copy(c.low).lerp(c.high, smoothstep(0.35, 0.9, t + (n2(x * 0.05, z * 0.05) - 0.5) * 0.3));
    tmp.lerp(c.rock, smoothstep(0.18, 0.42, slope));
    if (sandLevel !== null) tmp.lerp(c.sand, 1 - smoothstep(sandLevel, sandLevel + 1.5, y));
    const v = 0.92 + n2(x * 0.3, z * 0.3) * 0.16; // patchiness
    col[i * 3] = tmp.r * v;
    col[i * 3 + 1] = tmp.g * v;
    col[i * 3 + 2] = tmp.b * v;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const material = new THREE.MeshStandardMaterial({ name: 'terrain', vertexColors: true, roughness, metalness: 0 });
  if (detailTile > 0) {
    const map = groundDetail(seed + 30).clone();
    map.repeat.set(size / detailTile, size / detailTile);
    map.needsUpdate = true;
    material.map = map;
    // Lift vertex colours so the mottled map (mean ~0.8) does not darken the ground overall.
    for (let i = 0; i < col.length; i++) col[i] = Math.min(1, col[i] * 1.35);
  }
  if (fadeEdge > 0) applyEdgeFade(material, { half: size / 2, width: (size / 2) * fadeEdge });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'terrain';
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return { mesh, material, heightAt };
}

/**
 * Blend the outer ring of a ground mesh into the fog colour. Wide lenses (phones, aerials) and thin
 * night fog otherwise show the terrain's square edge as a hard line under the sky.
 */
function applyEdgeFade(material, { half, width }) {
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prev?.(shader, renderer);
    shader.uniforms.uEdgeHalf = { value: half };
    shader.uniforms.uEdgeWidth = { value: width };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vEdgeXZ;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vEdgeXZ = position.xz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vEdgeXZ;\nuniform float uEdgeHalf, uEdgeWidth;')
      .replace('#include <fog_fragment>', `#include <fog_fragment>
  #ifdef USE_FOG
    float edgeD = max( abs( vEdgeXZ.x ), abs( vEdgeXZ.y ) );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, smoothstep( uEdgeHalf - uEdgeWidth, uEdgeHalf * 0.98, edgeD ) );
  #endif`);
  };
  material.customProgramCacheKey = () => `terrain-edge:${material.uuid}`;
}

/** Topographic contour lines on any MeshStandard/Physical material (world-space Y). */
export function applyContours(material, { spacing = 2, color = '#2c2a26', opacity = 0.55, width = 1.0 } = {}) {
  const uniforms = {
    uContourSpacing: { value: spacing },
    uContourColor: { value: new THREE.Color(color) },
    uContourOpacity: { value: opacity },
    uContourWidth: { value: width },
  };
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prev?.(shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vContourY;')
      .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
  {
    vec4 cp = vec4( transformed, 1.0 );
    #ifdef USE_INSTANCING
      cp = instanceMatrix * cp;
    #endif
    vContourY = ( modelMatrix * cp ).y;
  }`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vContourY;
uniform float uContourSpacing, uContourOpacity, uContourWidth;
uniform vec3 uContourColor;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  {
    float cy = vContourY / uContourSpacing;
    float w = fwidth( cy ) * uContourWidth;
    float line = 1.0 - smoothstep( 0.0, w, abs( fract( cy - 0.5 ) - 0.5 ) );
    float major = 1.0 - step( 0.5, mod( floor( cy + 0.5 ), 5.0 ) );   // every 5th line is heavier
    diffuseColor.rgb = mix( diffuseColor.rgb, uContourColor, line * uContourOpacity * ( 0.6 + 0.4 * major ) );
  }`);
  };
  material.customProgramCacheKey = () => `contours:${material.uuid}`;
  material.needsUpdate = true;
  return uniforms;
}

export function createPlinth({ w = 30, d = 20, h = 1.2, radius = 0.06, material, y = 0 } = {}) {
  const geometry = new RoundedBoxGeometry(w, h, d, 3, radius);
  const mesh = new THREE.Mesh(geometry, material ?? new THREE.MeshStandardMaterial({ color: '#d8d2c8', roughness: 0.85 }));
  mesh.position.y = y - h / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = 'plinth';
  return mesh;
}

let blobTexture = null;
function getBlobTexture() {
  if (blobTexture) return blobTexture;
  const s = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext('2d');
  // alphaMap reads the GREEN channel, so draw opaque grey levels. A white gradient with fading alpha
  // uploads as solid white wherever alpha > 0 and renders as a hard-edged disc.
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, s, s);
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  // Roughly exponential falloff: dark right at the contact, fading long before the edge.
  [[0, 255], [0.15, 215], [0.35, 140], [0.6, 60], [0.82, 16], [1, 0]].forEach(([at, v]) => g.addColorStop(at, `rgb(${v},${v},${v})`));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  blobTexture = new THREE.CanvasTexture(canvas);
  blobTexture.colorSpace = THREE.NoColorSpace;
  return blobTexture;
}

/** Soft dark ellipse under an object. Cheap, always-on grounding even where shadow maps are blurry. */
export function createContactShadow({ w = 10, d = 10, opacity = 0.45, color = '#000000', y = 0.01 } = {}) {
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, alphaMap: getBlobTexture(), depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const geometry = new THREE.PlaneGeometry(w, d);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = y;
  mesh.renderOrder = 1;
  mesh.name = 'contact-shadow';
  return mesh;
}
