import * as THREE from 'three';

/* ============================================================================
   ANYSCENE-WEBGL2 // SINGLE-IMAGE INTERACTIVE 3D ARCHITECTURAL HERO ENGINE
   Adapted from apekshik/anyscene (dials.json + depth relief + practical light
   + real-time GLSL water caustics + volumetric 3D rainforest mist + clay mode)
============================================================================ */

const DIAL_PRESETS = {
  morning_mist: {
    atmosphere: 0.74,
    wetness: 0.86,
    power: 0.98,
    warmth: 0.62,
    clayMix: 0.0,
    tint: new THREE.Vector3(0.97, 1.0, 1.02),
    mistColor: new THREE.Color(0xd7e4e6),
  },
  golden_dawn: {
    atmosphere: 0.56,
    wetness: 0.78,
    power: 1.32,
    warmth: 1.0,
    clayMix: 0.0,
    tint: new THREE.Vector3(1.1, 0.99, 0.86),
    mistColor: new THREE.Color(0xf7dec0),
  },
  twilight_glow: {
    atmosphere: 0.66,
    wetness: 0.96,
    power: 1.85,
    warmth: 1.18,
    clayMix: 0.0,
    tint: new THREE.Vector3(0.68, 0.78, 0.97),
    mistColor: new THREE.Color(0x6b8ab8),
  },
  clay_blockout: {
    atmosphere: 0.24,
    wetness: 0.2,
    power: 0.35,
    warmth: 0.2,
    clayMix: 1.0,
    tint: new THREE.Vector3(0.93, 0.94, 0.96),
    mistColor: new THREE.Color(0xc2c6cc),
  },
};

const RELIEF_VERT = /* glsl */ `
  uniform sampler2D uMaps;
  uniform float uTime;
  uniform float uDepthScale;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 m = texture2D(uMaps, uv);
    float depth = m.r;
    float swayMask = m.a;
    vDepth = depth;

    vec3 pos = position;
    // True 3D architectural relief extrusion toward PerspectiveCamera
    pos.z += (depth - 0.35) * uDepthScale;

    // Gentle organic wind breeze strictly on canopy fronds & cascading hanging vines
    float wind = sin(uTime * 1.15 + uv.x * 11.0 + uv.y * 7.0) * 0.032
               + cos(uTime * 0.72 + uv.y * 15.0) * 0.018;
    pos.x += wind * swayMask;
    pos.y += wind * 0.35 * swayMask;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const RELIEF_FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uPhoto;
  uniform sampler2D uMaps;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAtmosphere;
  uniform float uWetness;
  uniform float uPower;
  uniform float uWarmth;
  uniform float uClayMix;
  uniform vec3 uTint;
  uniform vec3 uMistColor;

  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vWorldPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.04 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec4 m = texture2D(uMaps, vUv);
    float depth = m.r;
    float waterMask = m.g;
    float glowMask = m.b;
    float swayMask = m.a;

    // 1. Sub-pixel Parallax Depth Refinement (enhances foreground stone vs distant mist separation)
    vec2 parallaxOffset = uPointer * (depth - 0.45) * 0.0115;

    // 2. Real-time Animated Multi-Octave Infinity Pool Water Ripples & Shimmer
    vec2 waterUvOffset = vec2(0.0);
    float causticSheen = 0.0;
    if (waterMask > 0.01) {
      float t = uTime * 0.85;
      // Perspective-foreshortened ripple frequency (vUv.y=0 is foreground bottom, vUv.y=0.45 is far pool horizon)
      float persp = mix(0.72, 2.25, smoothstep(0.0, 0.46, vUv.y));
      vec2 wp = vec2(vUv.x * 26.0, (1.0 - vUv.y) * 52.0 * persp);

      float w1 = sin(wp.y * 1.4 - t * 2.2 + sin(wp.x * 0.9 + t * 0.6));
      float w2 = cos(wp.x * 1.8 + wp.y * 0.7 + t * 1.5);
      float w3 = fbm(wp * 0.32 + vec2(t * 0.25, -t * 0.42)) * 2.0 - 1.0;

      float ripX = (w1 * 0.42 + w2 * 0.28 + w3 * 0.45);
      float ripY = (w1 * 0.25 - w2 * 0.35 + w3 * 0.35);

      waterUvOffset = vec2(ripX, ripY * 0.58) * 0.0036 * waterMask * uWetness;
      causticSheen = pow(max(0.0, (w1 * 0.5 + w3 * 0.5) * 0.5 + 0.5), 3.6) * waterMask * uWetness;
    }

    // Subtle UV breeze ripple on foliage edges
    vec2 swayUv = vec2(
      sin(uTime * 1.3 + vUv.y * 24.0 + vUv.x * 14.0),
      cos(uTime * 0.9 + vUv.x * 18.0) * 0.45
    ) * 0.0014 * swayMask;

    vec2 sampleUv = clamp(vUv + parallaxOffset + waterUvOffset + swayUv, 0.002, 0.998);
    vec3 col = texture2D(uPhoto, sampleUv).rgb;

    // 3. Apply AnyScene Time-of-Day & Practical Lighting Dials
    // Sky & ambient colour grading
    col *= uTint;

    // Warm practical architectural interior light breathing + rippling water light reflection bloom
    float flicker = 0.94 + 0.06 * sin(uTime * 1.9 + vUv.x * 9.0) + 0.03 * cos(uTime * 3.4);
    float practicalBoost = glowMask * uPower * flicker;
    vec3 warmLamp = mix(vec3(1.0, 0.76, 0.44), vec3(1.0, 0.56, 0.22), clamp(uWarmth - 0.3, 0.0, 1.0));
    col += warmLamp * practicalBoost * 0.34;

    // Crisp Fresnel specular sheen & shimmering reflected light ripples on curved infinity pool
    if (waterMask > 0.01) {
      vec3 rippleSpec = mix(uMistColor, warmLamp, clamp(glowMask * 1.4 + 0.12, 0.0, 1.0));
      col += rippleSpec * causticSheen * (0.14 + glowMask * 0.28);
      // Subtle horizon glass-water depth contrast along far infinity edge (vUv.y ~ 0.32..0.46)
      float fresnelBand = smoothstep(0.14, 0.36, vUv.y) * (1.0 - smoothstep(0.39, 0.47, vUv.y));
      col = mix(col, col * 0.92 + uMistColor * 0.11, fresnelBand * waterMask * 0.45);
    }

    // 4. Drifting Atmospheric Morning Mist across Left Rainforest Ravine
    float ravineZone = (1.0 - smoothstep(0.18, 0.62, vUv.x)) * (1.0 - smoothstep(0.12, 0.74, depth));
    float mistDrift = fbm(vec2(vUv.x * 3.4 - uTime * 0.038, vUv.y * 2.6 + uTime * 0.015));
    float mistAmt = ravineZone * smoothstep(0.28, 0.82, mistDrift) * uAtmosphere * 0.46;
    col = mix(col, uMistColor, mistAmt);

    // 5. AnyScene 3D Clay Blockout + Architectural Topographic Wireframe Inspector Mode
    if (uClayMix > 0.001) {
      vec3 dx = dFdx(vWorldPos);
      vec3 dy = dFdy(vWorldPos);
      vec3 n = normalize(cross(dx, dy) + vec3(0.0, 0.0, 0.0001));

      vec3 keyDir = normalize(vec3(-0.45, 0.65, 0.82));
      vec3 rimDir = normalize(vec3(0.75, 0.35, 0.45));
      float diff = max(dot(n, keyDir), 0.0);
      float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);

      // Soft sculptural grey clay shading + architectural luminance hint
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 clay = vec3(0.16, 0.175, 0.19) + vec3(0.58, 0.59, 0.60) * (diff * 0.62 + depth * 0.28 + luma * 0.18);
      clay += vec3(0.28, 0.32, 0.36) * rim;

      // Subtle architectural wireframe grid & depth elevation contours
      vec2 grid = abs(fract(vUv * vec2(38.0, 22.0) - 0.5) - 0.5) / fwidth(vUv * vec2(38.0, 22.0));
      float gridLine = 1.0 - min(min(grid.x, grid.y), 1.0);
      float contour = smoothstep(0.92, 0.99, abs(sin(depth * 42.0)));

      clay = mix(clay, vec3(0.84, 0.88, 0.92), gridLine * 0.16 + contour * 0.12);
      // Highlight animated water plane & warm practical light emitters in blockout mode
      clay = mix(clay, vec3(0.32, 0.58, 0.64), waterMask * 0.24);
      clay += vec3(1.0, 0.72, 0.34) * glowMask * 0.42;

      col = mix(col, clay, uClayMix);
    }

    // Filmic gentle contrast & edge vignette
    col = col / (col + vec3(0.12)) * 1.11;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const MIST_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MIST_FRAG = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    float n = fbm(vec2(vUv.x * 3.2 - uTime * 0.045, vUv.y * 2.2 + uTime * 0.012));
    // Softly concentrated in the upper-left emerald rainforest ravine (vUv.y ~ 0.32..0.88)
    float maskX = smoothstep(0.0, 0.14, vUv.x) * (1.0 - smoothstep(0.32, 0.66, vUv.x));
    float maskY = smoothstep(0.24, 0.52, vUv.y) * (1.0 - smoothstep(0.80, 0.98, vUv.y));
    float alpha = smoothstep(0.34, 0.80, n) * maskX * maskY * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function initAnySceneHero(canvas, heroSection) {
  if (!canvas || !heroSection) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 60);
  camera.position.set(0, 0.04, 11.75);

  // Load single reference photo + packed 4-channel AnyScene architectural map
  const loader = new THREE.TextureLoader();
  let readyCount = 0;
  const onAssetReady = () => {
    readyCount += 1;
    if (readyCount >= 2) {
      canvas.classList.add('is-ready');
    }
  };

  const photoTex = loader.load('assets/hero_start.jpg', onAssetReady);
  photoTex.colorSpace = THREE.SRGBColorSpace;
  photoTex.minFilter = THREE.LinearFilter;
  photoTex.magFilter = THREE.LinearFilter;

  const mapsTex = loader.load('assets/hero_anyscene_maps.png', onAssetReady);
  mapsTex.colorSpace = THREE.NoColorSpace;
  mapsTex.minFilter = THREE.LinearFilter;
  mapsTex.magFilter = THREE.LinearFilter;

  // High-density vertex-displaced 3D architectural relief mesh
  const planeW = 16.0;
  const planeH = 9.0;
  const reliefGeo = new THREE.PlaneGeometry(planeW, planeH, 176, 100);

  const cur = {
    atmosphere: DIAL_PRESETS.morning_mist.atmosphere,
    wetness: DIAL_PRESETS.morning_mist.wetness,
    power: DIAL_PRESETS.morning_mist.power,
    warmth: DIAL_PRESETS.morning_mist.warmth,
    clayMix: 0.0,
    tint: DIAL_PRESETS.morning_mist.tint.clone(),
    mistColor: DIAL_PRESETS.morning_mist.mistColor.clone(),
  };
  let targetDial = DIAL_PRESETS.morning_mist;

  const reliefMat = new THREE.ShaderMaterial({
    uniforms: {
      uPhoto: { value: photoTex },
      uMaps: { value: mapsTex },
      uTime: { value: 0 },
      uDepthScale: { value: 2.05 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAtmosphere: { value: cur.atmosphere },
      uWetness: { value: cur.wetness },
      uPower: { value: cur.power },
      uWarmth: { value: cur.warmth },
      uClayMix: { value: cur.clayMix },
      uTint: { value: cur.tint },
      uMistColor: { value: new THREE.Vector3(cur.mistColor.r, cur.mistColor.g, cur.mistColor.b) },
    },
    vertexShader: RELIEF_VERT,
    fragmentShader: RELIEF_FRAG,
  });

  const reliefMesh = new THREE.Mesh(reliefGeo, reliefMat);
  scene.add(reliefMesh);

  // Volumetric 3D rainforest mist plane hovering forward of the ravine
  const mistMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.34 },
      uColor: { value: cur.mistColor.clone() },
    },
    vertexShader: MIST_VERT,
    fragmentShader: MIST_FRAG,
    transparent: true,
    depthWrite: false,
  });
  const mistMesh = new THREE.Mesh(new THREE.PlaneGeometry(planeW * 1.04, planeH * 1.04, 1, 1), mistMat);
  mistMesh.position.set(0, 0.08, 1.35);
  scene.add(mistMesh);

  // True 3D depth-sorted sunlit morning mist motes
  const pCount = window.innerWidth < 760 ? 90 : 165;
  const pPos = new Float32Array(pCount * 3);
  const pSpd = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3 + 0] = (Math.random() - 0.5) * 14.5;
    pPos[i * 3 + 1] = (Math.random() - 0.45) * 7.6;
    pPos[i * 3 + 2] = 0.9 + Math.random() * 4.4;
    pSpd[i] = 0.35 + Math.random() * 0.85;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 32;
  spriteCanvas.height = 32;
  const sCtx = spriteCanvas.getContext('2d');
  const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,252,244,0.9)');
  grad.addColorStop(0.45, 'rgba(255,248,236,0.32)');
  grad.addColorStop(1, 'rgba(255,248,236,0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 32, 32);

  const pMat = new THREE.PointsMaterial({
    size: 0.11,
    map: new THREE.CanvasTexture(spriteCanvas),
    color: 0xfff8ec,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Cover-fit responsive camera framing so the 16:9 3D relief fills ANY viewport cleanly with zero edge bleed
  function resize() {
    const w = heroSection.clientWidth || window.innerWidth;
    const h = heroSection.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h, false);

    const aspect = w / Math.max(1, h);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // Exact cover-fit scaling: 16:9 & portrait mobile preserve full vertical composition; ultrawide scales up horizontally
    const targetAspect = planeW / planeH;
    const scaleBoost = aspect > targetAspect ? (aspect / targetAspect) * 1.1 : 1.1;
    reliefMesh.scale.set(scaleBoost, scaleBoost, 1);
    mistMesh.scale.set(scaleBoost, scaleBoost, 1);
  }
  resize();
  window.addEventListener('resize', resize);

  // Interactive mouse / touch 3D orbit + scroll-coupled dolly
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  let scrollProgress = 0;
  let visible = true;

  window.addEventListener(
    'pointermove',
    (e) => {
      ptr.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      ptr.y = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    },
    { passive: true }
  );

  const obs = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.01 }
  );
  obs.observe(heroSection);

  let rafId = 0;
  let prevTime = performance.now();

  function animate(now) {
    rafId = requestAnimationFrame(animate);
    if (!visible) {
      prevTime = now;
      return;
    }

    const dt = Math.min((now - prevTime) / 1000, 0.05);
    prevTime = now;
    const t = now * 0.001;

    // Smooth pointer lerp
    ptr.sx += (ptr.x - ptr.sx) * 0.055;
    ptr.sy += (ptr.y - ptr.sy) * 0.055;

    // Smoothly interpolate AnyScene dials
    const k = Math.min(1, dt * 3.4);
    cur.atmosphere += (targetDial.atmosphere - cur.atmosphere) * k;
    cur.wetness += (targetDial.wetness - cur.wetness) * k;
    cur.power += (targetDial.power - cur.power) * k;
    cur.warmth += (targetDial.warmth - cur.warmth) * k;
    cur.clayMix += (targetDial.clayMix - cur.clayMix) * k;
    cur.tint.lerp(targetDial.tint, k);
    cur.mistColor.lerp(targetDial.mistColor, k);

    reliefMat.uniforms.uTime.value = t;
    reliefMat.uniforms.uPointer.value.set(ptr.sx, ptr.sy);
    reliefMat.uniforms.uAtmosphere.value = cur.atmosphere;
    reliefMat.uniforms.uWetness.value = cur.wetness;
    reliefMat.uniforms.uPower.value = cur.power;
    reliefMat.uniforms.uWarmth.value = cur.warmth;
    reliefMat.uniforms.uClayMix.value = cur.clayMix;
    reliefMat.uniforms.uTint.value.copy(cur.tint);
    reliefMat.uniforms.uMistColor.value.set(cur.mistColor.r, cur.mistColor.g, cur.mistColor.b);

    mistMat.uniforms.uTime.value = t;
    mistMat.uniforms.uOpacity.value = cur.atmosphere * 0.42;
    mistMat.uniforms.uColor.value.copy(cur.mistColor);

    // Continuous 14-second slow architectural drone dolly-in over infinity pool + mouse orbit + scroll fly-in
    const loopPhase = (Math.sin(t * ((Math.PI * 2) / 14.0) - Math.PI * 0.5) + 1.0) * 0.5;
    const camZ = 11.75 - loopPhase * 1.05 - scrollProgress * 1.75;
    const camX = -0.14 + loopPhase * 0.28 + ptr.sx * 0.52;
    const camY = -0.05 + loopPhase * 0.14 + ptr.sy * 0.24 - scrollProgress * 0.32;

    camera.position.set(camX, camY, camZ);
    camera.lookAt(ptr.sx * 0.14 + 0.08 * loopPhase, ptr.sy * 0.08 + 0.02, 0.2);

    // Drift 3D sunlit jungle spores gently across the ravine
    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      arr[i3 + 0] += dt * 0.14 * pSpd[i];
      arr[i3 + 1] += dt * 0.06 * pSpd[i];
      if (arr[i3 + 0] > 7.5) arr[i3 + 0] = -7.5;
      if (arr[i3 + 1] > 4.0) arr[i3 + 1] = -3.8;
    }
    pGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  return {
    setDial(key) {
      if (DIAL_PRESETS[key]) targetDial = DIAL_PRESETS[key];
    },
    setScrollProgress(p) {
      scrollProgress = Math.max(0, Math.min(1, p));
    },
    dispose() {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      renderer.dispose();
    },
  };
}
