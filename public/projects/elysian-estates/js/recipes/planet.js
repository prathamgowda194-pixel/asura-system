/**
 * A planet from code, for orbital and scale-journey concepts: procedural continents and oceans,
 * ice caps, a drifting cloud shell, city lights on the night side, and an atmosphere rim that is
 * brightest on the sunlit limb. Lit by its own sun direction, so the terminator is always crisp.
 *
 *   const planet = createPlanet({ radius: 60, seed: 4, sunDir: [1, 0.25, 0.4] });
 *   scene.add(planet.group);
 *   planet.update(dt);                 // clouds drift, surface turns
 *   planet.setSun([x, y, z]);          // world-space direction toward the sun
 *
 * Palette options: ocean, shallow, land: [low, mid, high], ice, clouds, atmosphere, lights.
 * Earth-like by default. Mars, ice moons or invented worlds: change the palette and seaLevel
 * (seaLevel 0 = no oceans). Use real physical facts only if the concept needs them.
 *
 * Scale: depth precision cannot hold a 6,000 km planet and a 10 m satellite in one frustum.
 * Fake it like film: a planet of radius 50-200 units well behind a satellite of a few units near the
 * camera, and set camera.near / far per shot (the rig state can drive them).
 * Pair with sky.js stars (createSky preset 'night') or a dark studio background for space.
 */
import * as THREE from 'three';
import { NOISE_GLSL } from './noise.js';

const v3 = (a) => (Array.isArray(a) ? new THREE.Vector3(...a) : a.clone()).normalize();
const col = (c) => new THREE.Color(c);
const ATMO_SHELL = 1.07; // atmosphere shell radius / planet radius. Keep the camera outside it.

export function createPlanet({
  radius = 50,
  seed = 3,
  segments = 160,
  seaLevel = 0.5,
  ocean = '#06223f',
  shallow = '#145a78',
  land = ['#2f4a24', '#6d6a3c', '#a08a68'],
  ice = '#e9eef2',
  iceLine = 0.78,
  clouds = 0.55,
  cloudColor = '#f4f6f8',
  atmosphere = '#5aa8ff',
  atmosphereStrength = 1,
  lights = '#ffb469',
  lightsAmount = 0.6,
  spin = 0.004,
  cloudSpin = 0.006,
  sunDir = [1, 0.25, 0.4],
} = {}) {
  const sun = { value: v3(sunDir) };
  const seedOffset = new THREE.Vector3(seed * 17.3, seed * 7.1, seed * 3.7);

  const surfaceMat = new THREE.ShaderMaterial({
    name: 'planet-surface',
    uniforms: {
      uSun: sun,
      uSeed: { value: seedOffset },
      uSea: { value: seaLevel },
      uOcean: { value: col(ocean) },
      uShallow: { value: col(shallow) },
      uLand0: { value: col(land[0]) },
      uLand1: { value: col(land[1]) },
      uLand2: { value: col(land[2]) },
      uIce: { value: col(ice) },
      uIceLine: { value: iceLine },
      uLights: { value: col(lights) },
      uLightsAmount: { value: lightsAmount },
      uAtmo: { value: col(atmosphere) },
      uAtmoStrength: { value: atmosphereStrength },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObj;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vObj = normalize(position);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun, uSeed, uOcean, uShallow, uLand0, uLand1, uLand2, uIce, uLights, uAtmo;
      uniform float uSea, uIceLine, uLightsAmount, uAtmoStrength;
      varying vec3 vObj;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      ${NOISE_GLSL}
      void main() {
        vec3 p = vObj;
        // Continents, then coastlines, then one fine octave so close shots are not soft.
        float h = asuraFbm3(p * 1.9 + uSeed);
        h = mix(h, asuraFbm3(p * 6.0 + uSeed * 1.7), 0.22);
        h += (asuraNoise3(p * 28.0 + uSeed) - 0.5) * 0.03;
        float land = smoothstep(uSea - 0.004, uSea + 0.004, h);
        float elev = clamp((h - uSea) / max(0.001, 1.0 - uSea) * 2.2, 0.0, 1.0);
        // Biomes: moisture chooses between the first two land colours, height brings in the third.
        float moist = asuraFbm3(p * 2.7 - uSeed * 0.6);
        vec3 ground = mix(uLand1, uLand0, smoothstep(0.44, 0.58, moist));
        ground = mix(ground, uLand2, smoothstep(0.4, 0.9, elev));
        ground *= 0.88 + 0.24 * asuraNoise3(p * 64.0 + uSeed);
        float depth = clamp((uSea - h) * 6.0, 0.0, 1.0);
        vec3 water = mix(uShallow, uOcean, smoothstep(0.0, 0.6, depth));
        vec3 albedo = mix(water, ground, land);
        float lat = abs(p.y) + (asuraNoise3(p * 9.0 + uSeed) - 0.5) * 0.12;
        float iceMask = smoothstep(uIceLine, uIceLine + 0.06, lat);
        albedo = mix(albedo, uIce, iceMask);

        vec3 n = normalize(vWorldNormal);
        vec3 v = normalize(cameraPosition - vWorldPos);
        float ndl = dot(n, uSun);
        float day = smoothstep(-0.08, 0.12, ndl);
        vec3 col = albedo * max(ndl, 0.0) * 1.15 + albedo * 0.004;
        // Ocean glint: sharp on water, none on land or ice.
        vec3 hlf = normalize(uSun + v);
        float spec = pow(max(dot(n, hlf), 0.0), 120.0) * (1.0 - land) * (1.0 - iceMask) * step(0.0, ndl);
        col += vec3(1.0, 0.92, 0.8) * spec * 2.4;
        // City lights: specks of towns inside populated regions, on low land near coasts, night side only.
        // When a town is smaller than a pixel the specks are replaced by their average, so they never shimmer.
        float region = smoothstep(0.5, 0.7, asuraFbm3(p * 4.0 - uSeed));
        float lowland = 1.0 - smoothstep(0.0, 0.3, elev);
        float towns = smoothstep(0.72, 0.96, asuraNoise3(p * 190.0 + uSeed * 3.0));
        towns = mix(towns, 0.04, smoothstep(0.35, 1.0, length(fwidth(p)) * 190.0));
        float sprawl = 0.4 + 0.6 * smoothstep(0.45, 0.85, asuraNoise3(p * 55.0 + uSeed * 2.0));
        float cities = region * lowland * land * (1.0 - iceMask) * towns * sprawl;
        col += uLights * cities * (1.0 - day) * uLightsAmount * 3.0;
        // Haze on the limb, so the surface melts into the atmosphere instead of meeting it at a line.
        float limb = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
        col += uAtmo * limb * (0.01 + day * 0.55) * uAtmoStrength;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });

  const cloudMat = new THREE.ShaderMaterial({
    name: 'planet-clouds',
    transparent: true,
    depthWrite: false,
    uniforms: { uSun: sun, uSeed: { value: seedOffset.clone().multiplyScalar(1.3) }, uCover: { value: clouds }, uColor: { value: col(cloudColor) }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vObj;
      varying vec3 vWorldNormal;
      void main() {
        vObj = normalize(position);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun, uSeed, uColor;
      uniform float uCover, uTime;
      varying vec3 vObj;
      varying vec3 vWorldNormal;
      ${NOISE_GLSL}
      void main() {
        vec3 p = vObj * 2.4 + uSeed;
        // Stretch along latitude so clouds read as weather bands, not polka dots.
        p.y *= 1.5;
        vec3 drift = vec3(uTime * 0.01, 0.0, 0.0);
        // Domain warp: a slow vector field bends the cloud noise into swirls and fronts.
        vec3 warp = vec3(asuraNoise3(p * 1.1 + drift), asuraNoise3(p * 1.1 + vec3(5.2, 1.3, 2.8)), asuraNoise3(p * 1.1 + vec3(1.7, 9.2, 4.4))) - 0.5;
        vec3 q = p + warp * 1.7 + drift;
        float c = asuraFbm3(q);
        c += (asuraNoise3(q * 9.0) - 0.5) * 0.16;   // ragged edges
        c = smoothstep(1.0 - uCover, 1.0 - uCover * 0.55, c);
        float ndl = dot(normalize(vWorldNormal), uSun);
        float lit = smoothstep(-0.1, 0.25, ndl);
        vec3 col = uColor * (0.004 + lit * max(ndl, 0.0) * 1.1);
        gl_FragColor = vec4(col, c * 0.92);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });

  const atmoMat = new THREE.ShaderMaterial({
    name: 'planet-atmosphere',
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSun: sun,
      uColor: { value: col(atmosphere) },
      uStrength: { value: atmosphereStrength },
      uCenter: { value: new THREE.Vector3() },
      uRadius: { value: radius },
      uHeight: { value: radius * (ATMO_SHELL - 1) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun, uColor, uCenter;
      uniform float uStrength, uRadius, uHeight;
      varying vec3 vWorldPos;
      void main() {
        // How high above the surface does this view ray pass? Glow is densest just above the limb
        // and thins out with altitude, like a real atmosphere seen edge-on.
        vec3 rd = normalize(vWorldPos - cameraPosition);
        float tca = dot(uCenter - cameraPosition, rd);
        vec3 closest = cameraPosition + rd * tca;
        float alt = (length(closest - uCenter) - uRadius) / uHeight;
        float glow = exp(-max(alt, 0.0) * 5.5) * (1.0 - smoothstep(0.75, 1.0, alt));
        float sunSide = smoothstep(-0.35, 0.55, dot(normalize(closest - uCenter), uSun));
        float forward = pow(max(dot(rd, uSun), 0.0), 6.0);   // a backlit limb glows (forward scattering)
        vec3 col = uColor * glow * (0.03 + sunSide * 1.2 + forward * 1.6) * uStrength;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });

  const group = new THREE.Group();
  group.name = 'planet';
  const surface = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments / 2), surfaceMat);
  surface.name = 'planet-surface';
  const cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.012, segments, segments / 2), cloudMat);
  cloudsMesh.name = 'planet-clouds';
  const atmosphereMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * ATMO_SHELL, 96, 48), atmoMat);
  atmosphereMesh.name = 'planet-atmosphere';
  // The glow is computed in world space: keep centre and radius in step with the group's transform.
  const worldScale = new THREE.Vector3();
  atmosphereMesh.onBeforeRender = () => {
    atmosphereMesh.getWorldPosition(atmoMat.uniforms.uCenter.value);
    const s = atmosphereMesh.getWorldScale(worldScale).x;
    atmoMat.uniforms.uRadius.value = radius * s;
    atmoMat.uniforms.uHeight.value = radius * (ATMO_SHELL - 1) * s;
  };
  group.add(surface, cloudsMesh, atmosphereMesh);
  if (clouds <= 0) cloudsMesh.visible = false;

  return {
    group,
    surface,
    cloudsMesh,
    atmosphereMesh,
    radius,
    setSun(dir) { sun.value.copy(v3(dir)); },
    update(dt) {
      surface.rotation.y += spin * dt;
      cloudsMesh.rotation.y += cloudSpin * dt;
      cloudMat.uniforms.uTime.value += dt;
    },
  };
}
