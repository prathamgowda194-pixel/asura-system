import * as THREE from 'three';

/* ============================================================================
   ANYSCENE-WEBGL2 // MULTI-ROOM 60FPS ARCHITECTURAL WALKTHROUGH ENGINE
   Continuous 3D Portal Dive & Yaw-Pan Room Transitions (Zero Lag Mobile + PC)
============================================================================ */

const ROOM_MANIFEST = [
  { id: 0, photo: 'assets/estate_hero.jpg', maps: 'assets/maps_estate.png', panNext: [0.0, -0.02], zoomNext: 0.42 },
  { id: 1, photo: 'assets/lantern_hero.jpg', maps: 'assets/maps_lantern.png', panNext: [-0.03, 0.02], zoomNext: 0.48 },
  { id: 2, photo: 'assets/room_foyer.jpg', maps: 'assets/maps_foyer.png', panNext: [0.24, 0.0], zoomNext: 0.24 },
  { id: 3, photo: 'assets/room_great.jpg', maps: 'assets/maps_great.png', panNext: [-0.26, 0.0], zoomNext: 0.24 },
  { id: 4, photo: 'assets/room_kitchen.jpg', maps: 'assets/maps_kitchen.png', panNext: [0.08, 0.01], zoomNext: 0.34 },
  { id: 5, photo: 'assets/room_study.jpg', maps: 'assets/maps_study.png', panNext: [0.0, 0.0], zoomNext: 0.52 },
];

const WALK_VERT = /* glsl */ `
  uniform sampler2D uMapsA;
  uniform sampler2D uMapsB;
  uniform float uMix;
  uniform float uDepthScale;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    float dA = texture2D(uMapsA, uv).r;
    float dB = texture2D(uMapsB, uv).r;
    float depth = mix(dA, dB, uMix);

    vec3 pos = position;
    pos.z += (depth - 0.42) * uDepthScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const WALK_FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uPhotoA;
  uniform sampler2D uMapsA;
  uniform sampler2D uPhotoB;
  uniform sampler2D uMapsB;

  uniform float uMix;
  uniform float uLocalHold;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uPanDir;
  uniform float uZoomAmt;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  vec3 sampleRoom(sampler2D photo, sampler2D maps, vec2 uv) {
    vec2 cUv = clamp(uv, 0.003, 0.997);
    vec4 m = texture2D(maps, cUv);
    float depth = m.r;
    float waterMask = m.g;
    float glowMask = m.b;

    // 3D sub-pixel mouse look-around parallax
    vec2 ptrShift = uPointer * (depth - 0.45) * 0.012;

    // Real-time animated lake & infinity pool water ripples
    vec2 waterOff = vec2(0.0);
    float spec = 0.0;
    if (waterMask > 0.01) {
      float persp = mix(0.75, 2.3, smoothstep(0.0, 0.45, cUv.y));
      vec2 wp = vec2(cUv.x * 28.0, (1.0 - cUv.y) * 54.0 * persp);
      float w1 = sin(wp.y * 1.35 - uTime * 1.9 + sin(wp.x * 0.85 + uTime * 0.5));
      float w2 = cos(wp.x * 1.7 + wp.y * 0.65 + uTime * 1.3);
      float n = noise(wp * 0.35 + vec2(uTime * 0.2, -uTime * 0.35)) * 2.0 - 1.0;
      waterOff = vec2(w1 * 0.42 + w2 * 0.3 + n * 0.35, (w1 - w2) * 0.22) * 0.0034 * waterMask;
      spec = pow(max(0.0, (w1 * 0.5 + n * 0.5) * 0.5 + 0.5), 3.8) * waterMask;
    }

    vec2 finalUv = clamp(cUv + ptrShift + waterOff, 0.002, 0.998);
    vec3 col = texture2D(photo, finalUv).rgb;

    // Warm practical architectural light & linear hearth flame breathing
    float fireFlicker = 0.94 + 0.06 * sin(uTime * 3.1 + cUv.x * 12.0) + 0.04 * cos(uTime * 5.7);
    vec3 warmGlow = vec3(1.0, 0.72, 0.38) * glowMask * fireFlicker * 0.22;
    col += warmGlow;

    if (waterMask > 0.01) {
      col += mix(vec3(0.55, 0.78, 0.95), vec3(1.0, 0.78, 0.46), glowMask) * spec * 0.16;
    }

    return col;
  }

  void main() {
    vec2 center = vec2(0.5, 0.5);

    // Gentle forward walk drift even during room hold + spatial portal transition into next room
    float walkPush = uLocalHold * 0.055;

    // Outgoing Room A pushes forward & pans cleanly along architectural turn vector
    float scaleA = 1.0 / (1.0 + walkPush + uMix * uZoomAmt);
    vec2 uvA = (vUv - center) * scaleA + center - uPanDir * uMix;

    // Incoming Room B emerges smoothly from depth along matching counter-vector
    float invMix = 1.0 - uMix;
    float scaleB = 1.0 + invMix * (uZoomAmt * 0.34);
    vec2 uvB = (vUv - center) * scaleB + center + uPanDir * invMix * 0.72;

    vec3 colA = sampleRoom(uPhotoA, uMapsA, uvA);
    vec3 colB = sampleRoom(uPhotoB, uMapsB, uvB);

    // Smooth center-portal weighted blend so doorway transitions feel physically spatial
    float distCenter = length((vUv - center) * vec2(1.1, 0.9));
    float portalBlend = smoothstep(0.0, 1.0, clamp(uMix * 1.18 - distCenter * 0.16 * invMix, 0.0, 1.0));
    vec3 col = mix(colA, colB, portalBlend);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initSolmereWalkthrough(canvas, viewportEl) {
  if (!canvas || !viewportEl) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x081221, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 50);
  camera.position.set(0, 0, 11.65);

  const isMobile = window.innerWidth < 760;
  const segX = isMobile ? 96 : 144;
  const segY = isMobile ? 54 : 82;
  const planeW = 16.0;
  const planeH = 9.0;
  const geo = new THREE.PlaneGeometry(planeW, planeH, segX, segY);

  const loader = new THREE.TextureLoader();
  const rooms = ROOM_MANIFEST.map((rm, idx) => {
    const pTex = loader.load(rm.photo, () => {
      try { renderer.initTexture(pTex); } catch {}
      if (idx === 0) canvas.classList.add('is-ready');
    });
    pTex.colorSpace = THREE.SRGBColorSpace;
    pTex.minFilter = THREE.LinearFilter;
    pTex.magFilter = THREE.LinearFilter;

    const mTex = loader.load(rm.maps, () => {
      try { renderer.initTexture(mTex); } catch {}
    });
    mTex.colorSpace = THREE.NoColorSpace;
    mTex.minFilter = THREE.LinearFilter;
    mTex.magFilter = THREE.LinearFilter;

    return { ...rm, pTex, mTex };
  });

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uPhotoA: { value: rooms[0].pTex },
      uMapsA: { value: rooms[0].mTex },
      uPhotoB: { value: rooms[1].pTex },
      uMapsB: { value: rooms[1].mTex },
      uMix: { value: 0 },
      uLocalHold: { value: 0 },
      uTime: { value: 0 },
      uDepthScale: { value: 1.55 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPanDir: { value: new THREE.Vector2(0, 0) },
      uZoomAmt: { value: 0.42 },
    },
    vertexShader: WALK_VERT,
    fragmentShader: WALK_FRAG,
  });

  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  function resize() {
    const w = viewportEl.clientWidth || window.innerWidth;
    const h = viewportEl.clientHeight || window.innerHeight;
    const maxDpr = w < 760 ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(w, h, false);

    const aspect = w / Math.max(1, h);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const targetAspect = planeW / planeH;
    const scaleBoost = aspect > targetAspect ? (aspect / targetAspect) * 1.09 : 1.09;
    mesh.scale.set(scaleBoost, scaleBoost, 1);
  }
  resize();
  window.addEventListener('resize', resize);

  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener(
    'pointermove',
    (e) => {
      ptr.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      ptr.y = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    },
    { passive: true }
  );

  let visible = true;
  const obs = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.01 }
  );
  obs.observe(viewportEl);

  let state = { idxA: 0, idxB: 1, mix: 0, hold: 0, camPush: 0 };

  function setWalkState(idxA, idxB, mix, hold, camPush = 0) {
    state.idxA = idxA;
    state.idxB = idxB;
    state.mix = mix;
    state.hold = hold;
    state.camPush = camPush;
  }

  let rafId = 0;
  function animate(now) {
    rafId = requestAnimationFrame(animate);
    if (!visible) return;

    const t = now * 0.001;
    ptr.sx += (ptr.x - ptr.sx) * 0.06;
    ptr.sy += (ptr.y - ptr.sy) * 0.06;

    const rmA = rooms[state.idxA] || rooms[0];
    const rmB = rooms[state.idxB] || rooms[0];

    mat.uniforms.uPhotoA.value = rmA.pTex;
    mat.uniforms.uMapsA.value = rmA.mTex;
    mat.uniforms.uPhotoB.value = rmB.pTex;
    mat.uniforms.uMapsB.value = rmB.mTex;
    mat.uniforms.uMix.value = state.mix;
    mat.uniforms.uLocalHold.value = state.hold;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uPointer.value.set(ptr.sx, ptr.sy);
    mat.uniforms.uPanDir.value.set(rmA.panNext[0], rmA.panNext[1]);
    mat.uniforms.uZoomAmt.value = rmA.zoomNext;

    // Subtle breathing handheld architectural camera + mouse orbit + final study desk push
    const breathX = Math.sin(t * 0.55) * 0.05;
    const breathY = Math.cos(t * 0.42) * 0.03;
    camera.position.set(
      ptr.sx * 0.36 + breathX,
      ptr.sy * 0.18 + breathY - state.camPush * 0.22,
      11.65 - state.camPush * 2.1
    );
    camera.lookAt(ptr.sx * 0.1, ptr.sy * 0.06 - state.camPush * 0.12, 0);

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  return { setWalkState };
}
