/**
 * Water from code: a physical material (correct fresnel, sky reflections from the environment
 * map, sun glints, shadows, fog) with two scrolling layers of a procedural normal map.
 *
 *   const sea = createWater({ size: 5000, color: '#0f3946', repeat: 160 });
 *   sea.mesh.position.y = -9; scene.add(sea.mesh);
 *   const pool = createWater({ width: 18, depth: 4, color: '#2a8a8f', repeat: 3, normalScale: 0.12, speed: 0.012 });
 *   sea.update(dt) every frame.
 *
 * Calm water: low normalScale (0.08..0.2). Open sea: 0.3..0.6 and a larger repeat.
 * At night raise `glow` (underwater light for pools) with water.setGlow(0..1).
 */
import * as THREE from 'three';
import { tileField } from './materials.js';

const normalCache = new Map();

function waterNormalMap(size = 256, seed = 21) {
  const key = `${size}:${seed}`;
  if (normalCache.has(key)) return normalCache.get(key);
  const hA = tileField(size, { scale: 4, octaves: 5, gain: 0.55, seed });
  const hB = tileField(size, { scale: 9, octaves: 3, gain: 0.5, seed: seed + 1, stretch: [1, 0.6] });
  const h = new Float32Array(size * size);
  for (let i = 0; i < h.length; i++) h[i] = hA[i] * 0.7 + hB[i] * 0.3;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  const strength = 6;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const o = (y * size + x) * 4;
      img.data[o] = (-dx / len * 0.5 + 0.5) * 255;
      img.data[o + 1] = (-dy / len * 0.5 + 0.5) * 255;
      img.data[o + 2] = (1 / len * 0.5 + 0.5) * 255;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  normalCache.set(key, tex);
  return tex;
}

export function createWater({
  size,
  width = size ?? 100,
  depth = size ?? 100,
  color = '#0f3946',
  roughness = 0.06,
  normalScale = 0.35,
  repeat = 40,
  speed = 0.02,
  glowColor = '#5fd3d0',
  seed = 21,
} = {}) {
  const normalMap = waterNormalMap(256, seed).clone();
  normalMap.repeat.set(repeat, repeat * (depth / width));
  normalMap.needsUpdate = true;

  const material = new THREE.MeshPhysicalMaterial({
    name: 'water',
    color,
    roughness,
    metalness: 0,
    ior: 1.333,
    normalMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    envMapIntensity: 1.0,
    emissive: new THREE.Color(glowColor),
    emissiveIntensity: 0,
  });

  const uTime = { value: 0 };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWaterTime = uTime;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uWaterTime;')
      .replace(
        '#include <normal_fragment_maps>',
        /* glsl */ `
float caustic = 1.0;
#ifdef USE_NORMALMAP_TANGENTSPACE
  vec3 n1 = texture2D( normalMap, vNormalMapUv + vec2( uWaterTime * 0.61, uWaterTime * 0.23 ) ).xyz * 2.0 - 1.0;
  vec3 n2 = texture2D( normalMap, vNormalMapUv * 0.37 + vec2( -uWaterTime * 0.27, uWaterTime * 0.41 ) ).xyz * 2.0 - 1.0;
  vec3 mapN = normalize( vec3( n1.xy + n2.xy, n1.z * n2.z ) );
  // A web of bright lines where the combined slope crosses zero: a cheap stand-in for caustics.
  vec2 slope = abs( n1.xy + n2.xy );
  caustic = max( 1.0 - smoothstep( 0.0, 0.22, slope.x ), 1.0 - smoothstep( 0.0, 0.22, slope.y ) );
  mapN.xy *= normalScale;
  normal = normalize( tbn * mapN );
#endif`,
      )
      // Underwater light (setGlow) is seen through the surface, so it fades where the surface
      // reflects (grazing angles, Schlick fresnel for water) and ripples with the caustic web.
      .replace(
        '#include <emissivemap_fragment>',
        /* glsl */ `#include <emissivemap_fragment>
  {
    float nv = clamp( dot( normal, normalize( vViewPosition ) ), 0.0, 1.0 );
    float fres = 0.02 + 0.98 * pow( 1.0 - nv, 5.0 );
    totalEmissiveRadiance *= ( 1.0 - fres ) * ( 0.7 + 0.6 * caustic );
  }`,
      );
  };
  material.customProgramCacheKey = () => 'asura-water';

  const geometry = new THREE.PlaneGeometry(width, depth, 1, 1);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'water';
  mesh.receiveShadow = true;

  return {
    mesh,
    material,
    update(dt) { uTime.value += dt * speed; },
    setGlow(v) { material.emissiveIntensity = v; },
  };
}
