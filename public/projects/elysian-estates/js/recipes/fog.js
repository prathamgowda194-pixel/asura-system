/**
 * Height fog for every built-in material: mist that pools low and thins with altitude.
 * Patches three's fog shader chunks, so call it ONCE before the first render.
 *
 *   installHeightFog({ base: 0, falloff: 0.12, floor: 0.25 });   // base = world Y where fog is densest
 *   scene.fog = new THREE.FogExp2(color, 0.01);                  // createSky() already sets this up
 *
 * falloff: higher = thinner layer (0.05 tall haze, 0.3 low ground mist).
 * floor:   share of distance haze kept at any altitude (0 = only low mist, 1 = plain FogExp2).
 * Density stays animatable through scene.fog.density.
 * Custom ShaderMaterials with fog: true must declare `mvPosition` before #include <fog_vertex>.
 */
import * as THREE from 'three';

let installed = false;

export function installHeightFog({ base = 0, falloff = 0.12, floor = 0.25 } = {}) {
  if (installed) return;
  installed = true;
  const b = Number(base).toFixed(4);
  const f = Number(falloff).toFixed(5);
  const fl = Number(floor).toFixed(4);

  THREE.ShaderChunk.fog_pars_vertex = /* glsl */ `
#ifdef USE_FOG
  varying float vFogDepth;
  varying float vFogHeight;
#endif`;

  THREE.ShaderChunk.fog_vertex = /* glsl */ `
#ifdef USE_FOG
  vFogDepth = - mvPosition.z;
  vFogHeight = ( inverse( viewMatrix ) * mvPosition ).y;
#endif`;

  THREE.ShaderChunk.fog_pars_fragment = /* glsl */ `
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying float vFogHeight;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif`;

  THREE.ShaderChunk.fog_fragment = /* glsl */ `
#ifdef USE_FOG
  float fogH = mix( ${fl}, 1.0, exp( - max( vFogHeight - ( ${b} ), 0.0 ) * ${f} ) );
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth * fogH );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, vFogDepth ) * fogH;
  #endif
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`;
}
