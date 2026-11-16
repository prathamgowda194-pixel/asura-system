/**
 * Reveal effects for "assembly", "materialise" and "cutaway" concepts.
 *
 *   const d = applyDissolve(material, { color: '#ffb36b', scale: 0.4, width: 0.08 });
 *   d.uniforms.uReveal.value = 0..1          0 = invisible, 1 = solid. Glowing noisy edge in between.
 *
 *   const cut = createSection(engine, { normal: [0, -1, 0], constant: 6 });
 *   cut.apply(houseGroup, { fill: '#2b2622' }) clips every mesh under houseGroup, cut faces filled
 *   cut.plane.constant = 2.5                 move the cut (drive it with scroll or a drag handle)
 *
 * Shared materials are affected everywhere they are used. Clone a material first if needed.
 */
import * as THREE from 'three';
import { NOISE_GLSL } from './noise.js';

function worldPosVarying(shader, name) {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\nvarying vec3 ${name};`)
    .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
  {
    vec4 wp = vec4( transformed, 1.0 );
    #ifdef USE_INSTANCING
      wp = instanceMatrix * wp;
    #endif
    ${name} = ( modelMatrix * wp ).xyz;
  }`);
}

export function applyDissolve(material, { color = '#ffb36b', glow = 4, width = 0.08, scale = 0.35, direction = null } = {}) {
  const uniforms = {
    uReveal: { value: 1 },
    uDissolveColor: { value: new THREE.Color(color) },
    uDissolveGlow: { value: glow },
    uDissolveWidth: { value: width },
    uDissolveScale: { value: scale },
    uDissolveDir: { value: new THREE.Vector4(...(direction ?? [0, 0, 0]), direction ? 1 : 0) },
  };
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prev?.(shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    worldPosVarying(shader, 'vDissolvePos');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vDissolvePos;
uniform float uReveal, uDissolveGlow, uDissolveWidth, uDissolveScale;
uniform vec3 uDissolveColor;
uniform vec4 uDissolveDir;
${NOISE_GLSL}
float dissolveField() {
  float n = asuraFbm3( vDissolvePos * uDissolveScale );
  // optional directional sweep: dir.xyz in world space, dir.w = 1 enables it
  if ( uDissolveDir.w > 0.5 ) n = n * 0.35 + clamp( dot( vDissolvePos, normalize( uDissolveDir.xyz ) ) * 0.02 + 0.5, 0.0, 1.0 ) * 0.65;
  return n;
}`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
  float dField = dissolveField();
  float dEdge = uReveal * ( 1.0 + uDissolveWidth ) - uDissolveWidth;
  if ( dField > uReveal * ( 1.0 + uDissolveWidth ) ) discard;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  totalEmissiveRadiance += uDissolveColor * uDissolveGlow * smoothstep( dEdge, dEdge + uDissolveWidth, dField ) * step( uReveal, 0.999 );`);
  };
  material.customProgramCacheKey = () => `dissolve:${material.uuid}`;
  material.needsUpdate = true;
  return { uniforms };
}

export function createSection(engine, { normal = [0, -1, 0], constant = 5 } = {}) {
  engine.renderer.localClippingEnabled = true;
  const plane = new THREE.Plane(new THREE.Vector3(...normal).normalize(), constant);
  const patched = new WeakSet();

  function apply(root, { fill = '#2a2622' } = {}) {
    const fillColor = new THREE.Color(fill);
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        m.clippingPlanes = [plane];
        if (patched.has(m) || m.isShaderMaterial) continue;
        patched.add(m);
        m.side = THREE.DoubleSide;
        const prev = m.onBeforeCompile;
        m.onBeforeCompile = (shader, renderer) => {
          prev?.(shader, renderer);
          shader.uniforms.uSectionFill = { value: fillColor };
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uSectionFill;')
            .replace('#include <dithering_fragment>', `#include <dithering_fragment>
  if ( ! gl_FrontFacing ) gl_FragColor = vec4( uSectionFill, 1.0 );`);
        };
        m.customProgramCacheKey = () => `section:${m.uuid}`;
        m.needsUpdate = true;
      }
    });
  }

  return { plane, apply };
}
