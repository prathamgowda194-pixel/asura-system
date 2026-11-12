/**
 * Atmospheric particles: dust in sunlight, pollen, embers, fireflies, snow.
 * Soft round sprites with drift and twinkle. Brighter when backlit by the sun (forward scatter).
 *
 *   const dust = createDust({ count: 700, box: [60, 14, 50], center: [0, 6, 0], color: '#fff1d6' });
 *   scene.add(dust.points);
 *   dust.update(dt, { sunDir: sky.sunDir, opacity: 0.6 }) every frame
 *
 * Keep it subtle: if a viewer notices the particles before the subject, there are too many.
 */
import * as THREE from 'three';
import { rng } from './noise.js';

export function createDust({ count = 600, box = [60, 16, 60], center = [0, 6, 0], color = '#fff3dc', size = 2.2, opacity = 0.5, drift = 0.6, seed = 7, density = 1 } = {}) {
  const n = Math.max(1, Math.floor(count * density));
  const r = rng(seed);
  const pos = new Float32Array(n * 3);
  const seeds = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = center[0] + (r() - 0.5) * box[0];
    pos[i * 3 + 1] = center[1] + (r() - 0.5) * box[1];
    pos[i * 3 + 2] = center[2] + (r() - 0.5) * box[2];
    seeds[i] = r();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: size },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
    uDrift: { value: drift },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
  };

  const material = new THREE.ShaderMaterial({
    name: 'AsuraDust',
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime, uSize, uPixelRatio, uDrift;
      uniform vec3 uSunDir;
      varying float vAlpha;
      varying float vScatter;
      void main() {
        vec3 p = position;
        float t = uTime * (0.15 + aSeed * 0.2);
        p.x += sin(t + aSeed * 31.0) * uDrift;
        p.y += sin(t * 0.7 + aSeed * 17.0) * uDrift * 0.6;
        p.z += cos(t * 0.9 + aSeed * 11.0) * uDrift;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = -mv.z;
        gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed * 0.8) * (12.0 / max(dist, 0.5));
        vec3 viewDir = normalize((modelMatrix * vec4(p, 1.0)).xyz - cameraPosition);
        vScatter = pow(max(dot(viewDir, normalize(uSunDir)), 0.0), 6.0);
        vAlpha = smoothstep(0.3, 2.0, dist) * (1.0 - smoothstep(60.0, 140.0, dist)) * (0.55 + 0.45 * sin(uTime * (0.8 + aSeed) + aSeed * 40.0));
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      varying float vScatter;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        a *= a * vAlpha * uOpacity * (0.35 + 1.65 * vScatter);
        gl_FragColor = vec4(uColor * a, a);
      }`,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.name = 'dust';

  return {
    points,
    uniforms,
    update(dt, { sunDir, opacity } = {}) {
      uniforms.uTime.value += dt;
      if (sunDir) uniforms.uSunDir.value.copy(sunDir);
      if (opacity !== undefined) uniforms.uOpacity.value = opacity;
    },
  };
}
