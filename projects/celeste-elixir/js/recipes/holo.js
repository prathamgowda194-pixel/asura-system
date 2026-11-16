/**
 * Holographic foil card in WebGL: a rounded card with real thickness, the art on the front, and a
 * foil layer whose colour shifts with the viewing angle, like a trading card tilted under a lamp.
 * Lighting, reflections, shadows and tone mapping stay those of the scene (it extends
 * MeshPhysicalMaterial), so the card sits in the world instead of floating over it.
 *
 *   const card = createHoloCard({ art: artTexture, foil: 'prism', width: 0.63, height: 0.88 });
 *   scene.add(card.group);
 *   card.setPointer(nx, ny);      // -1..1, e.g. pointer over the card; the card tilts toward it
 *   card.update(dt);              // every frame (eases the tilt and moves the glare)
 *
 * foil:      'prism' (rainbow bands) | 'sparkle' (glitter field) | 'metal' (brushed gold or silver)
 * foilMask:  optional texture; white = foil, black = plain art (e.g. foil only on the frame or the name)
 * envIntensity: reflection strength of the whole card (1 = physically based).
 * artGloss:  how much of the environment the printed art reflects, 0..1 (default 0.3). The foil always
 *            reflects fully. Printed card stock is satin and foil is a mirror; at 1 a bright environment
 *            (RoomEnvironment, studio softboxes) lays a grey veil over dark art.
 * Units: metres (a real trading card is 0.063 x 0.088). Scale the group for a hero-sized card.
 * The art is a texture you make in code (canvas, textTexture) or one the user supplies.
 * Technique reference: the CSS holo cards of simeydotme/pokemon-cards-css (GPL-3.0). This file
 * shares no code with it.
 */
import * as THREE from 'three';
import { NOISE_GLSL } from './noise.js';

const FOILS = { prism: 0, sparkle: 1, metal: 2 };

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function createHoloCard({
  width = 0.63,
  height = 0.88,
  radius = 0.035,
  thickness = 0.006,
  art = null,
  back = null,
  foil = 'prism',
  foilMask = null,
  intensity = 1,
  envIntensity = 1,
  artGloss = 0.3,
  edge = '#f2efe8',
  maxTilt = 0.32,
  damping = 7,
} = {}) {
  const geometry = new THREE.ExtrudeGeometry(roundedRect(width, height, radius), { depth: thickness, bevelEnabled: false, curveSegments: 10 });
  geometry.translate(0, 0, -thickness / 2);
  // Normalised UVs across the card (ExtrudeGeometry's default UVs are in shape units).
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + width / 2) / width, (pos.getY(i) + height / 2) / height);
  uv.needsUpdate = true;

  const uniforms = {
    uTime: { value: 0 },
    uGlare: { value: new THREE.Vector2(0.5, 0.5) },
    uFoil: { value: FOILS[foil] ?? 0 },
    uIntensity: { value: intensity },
    uBack: { value: back },
    uHasBack: { value: back ? 1 : 0 },
    uFoilMask: { value: foilMask },
    uHasMask: { value: foilMask ? 1 : 0 },
    uArtGloss: { value: artGloss },
  };

  const face = new THREE.MeshPhysicalMaterial({
    name: 'holo-face',
    map: art,
    roughness: 0.32,
    metalness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: envIntensity,
  });
  face.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjNormal;\nvarying vec2 vHoloUv;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvHoloUv = uv;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvObjNormal = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vObjNormal;
varying vec2 vHoloUv;
uniform float uTime, uFoil, uIntensity, uHasBack, uHasMask, uArtGloss;
uniform vec2 uGlare;
uniform sampler2D uBack, uFoilMask;
${NOISE_GLSL}
vec3 holoSpectrum(float t) { return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }
float holoFoilAmount = 0.0;
vec3 holoFoilColor = vec3(0.0);`)
      // Back side: its own texture (or a plain card back), no foil.
      .replace('#include <map_fragment>', `#include <map_fragment>
bool holoBack = vObjNormal.z < -0.5;
if (holoBack) diffuseColor.rgb = uHasBack > 0.5 ? texture2D(uBack, vec2(1.0 - vHoloUv.x, vHoloUv.y)).rgb : diffuseColor.rgb * 0.35;`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  // Viewing angle drives the foil: tilt the card and the colours slide across it.
  vec3 viewDir = normalize(vViewPosition);
  float facing = dot(normal, viewDir);
  vec2 uvf = vHoloUv;
  float mask = uHasMask > 0.5 ? texture2D(uFoilMask, uvf).g : 1.0;
  if (vObjNormal.z > 0.5 && mask > 0.001) {
    float slide = facing * 2.6 + (uGlare.x - 0.5) * 1.2 + (uGlare.y - 0.5) * 0.8;
    // The foil is a metal layer in bands or specks, never a veil over the whole card: between the
    // bands the art shows untouched, as on a real holo card.
    if (uFoil < 0.5) {
      // prism: diagonal rainbow bands with fine diffraction lines
      float t = dot(uvf, vec2(0.85, 1.35)) * 1.8 + slide;
      float bands = smoothstep(0.35, 1.0, pow(0.5 + 0.5 * sin(t * 6.28318 * 1.5), 2.0));
      float lines = 0.8 + 0.2 * sin((uvf.x + uvf.y) * 420.0);
      holoFoilColor = holoSpectrum(t) * lines;
      holoFoilAmount = mask * bands * 0.8;
    } else if (uFoil < 1.5) {
      // sparkle: glitter cells that flash at different angles
      vec2 cell = floor(uvf * vec2(90.0, 126.0));
      float h = asuraHash12(cell);
      float flash = pow(max(0.0, sin(h * 40.0 + slide * 9.0)), 24.0) * step(0.55, h);
      holoFoilColor = holoSpectrum(h + slide * 0.3);
      holoFoilAmount = mask * min(1.0, flash * 1.5);
    } else {
      // metal: brushed foil, warm or cool depending on the angle
      float brush = asuraNoise2(vec2(uvf.x * 3.0, uvf.y * 260.0)) * 0.5 + 0.5;
      holoFoilColor = mix(vec3(1.0, 0.78, 0.42), vec3(0.95, 0.95, 1.0), 0.5 + 0.5 * sin(slide * 2.0)) * (0.7 + 0.3 * brush);
      holoFoilAmount = mask * 0.9;
    }
    holoFoilAmount = clamp(holoFoilAmount * uIntensity, 0.0, 1.0);
  }
}`)
      // Where there is foil the surface becomes a tinted mirror: it shows its colour only where it
      // reflects something bright (a softbox, the sky, the glare), which is what makes foil read as foil.
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.16, holoFoilAmount);`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
metalnessFactor = mix(metalnessFactor, 1.0, holoFoilAmount);
diffuseColor.rgb = mix(diffuseColor.rgb, holoFoilColor, holoFoilAmount);`)
      .replace('#include <lights_fragment_maps>', `#include <lights_fragment_maps>
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
  radiance *= mix(uArtGloss, 1.0, holoFoilAmount);
  #ifdef USE_CLEARCOAT
    clearcoatRadiance *= mix(uArtGloss, 1.0, holoFoilAmount);
  #endif
#endif`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
if (vObjNormal.z > 0.5) {
  // Glare: a soft hot spot that follows the pointer, strongest on the foil; a faint foil glow keeps
  // the colours readable when the card faces away from every light.
  float d = distance(vHoloUv, uGlare);
  float glare = exp(-d * d * 14.0) * uIntensity;
  totalEmissiveRadiance += vec3(1.0, 0.97, 0.92) * glare * (0.03 + holoFoilAmount * 0.22);
  totalEmissiveRadiance += holoFoilColor * holoFoilAmount * (0.05 + glare * 0.25);
}`);
  };
  face.customProgramCacheKey = () => 'asura-holo-card';

  const edgeMat = new THREE.MeshStandardMaterial({ name: 'holo-edge', color: edge, roughness: 0.6 });
  const mesh = new THREE.Mesh(geometry, [face, edgeMat]);
  mesh.name = 'holo-card';
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const group = new THREE.Group();
  group.name = 'holo-card-group';
  group.add(mesh);

  const target = new THREE.Vector2();
  const current = new THREE.Vector2();
  return {
    group,
    mesh,
    material: face,
    uniforms,
    /** nx, ny in -1..1 (pointer relative to the card or the viewport). */
    setPointer(nx, ny) { target.set(THREE.MathUtils.clamp(nx, -1, 1), THREE.MathUtils.clamp(ny, -1, 1)); },
    setFoil(name) { uniforms.uFoil.value = FOILS[name] ?? 0; },
    setIntensity(v) { uniforms.uIntensity.value = v; },
    update(dt) {
      const k = 1 - Math.exp(-damping * dt);
      current.lerp(target, k);
      mesh.rotation.y = current.x * maxTilt;
      mesh.rotation.x = -current.y * maxTilt;
      uniforms.uGlare.value.set(0.5 + current.x * 0.45, 0.5 - current.y * 0.45);
      uniforms.uTime.value += dt;
    },
  };
}
