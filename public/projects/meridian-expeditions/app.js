import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   MERIDIAN // 4-WORLD OVERLAND DATA CONTRACT
============================================================================ */

const WORLDS = [
  {
    id: 0,
    slug: 'caldera',
    titleLines: ['CALDERA', 'DRIFT'],
    summary: 'CALDERA DRIFT · 34.2 KM · €3,850',
    location: 'HIGHLANDS, IS',
    hlLight: 'Chasing the',
    hlBold: 'Volcano',
    theme: 'dark',
    distance: 34.2,
    distanceDecimals: 1,
    distanceLabel: 'CALDERA CIRCUIT ROUTE',
    elevation: 1180,
    elevationLabel: 'TOTAL ELEVATION GAIN',
    biomeHtml: 'BASALT CALDERA · +4°C<br><span>VISIBILITY 14 KM</span>',
    orb: 'assets/orb_caldera.jpg',
    orbFallback: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=240&q=80',
    routePath: 'M8 38 L24 26 L40 31 L56 14 L74 19 L98 8',
    routeEnd: [98, 8],
    elevPath: 'M6 39 C20 38, 28 24, 42 26 C56 28, 68 10, 84 14 C96 17, 104 26, 114 22',
    elevPeak: [84, 14],
    particleHex: 0xf4c7b8,
    particleSpeed: 0.24,
  },
  {
    id: 1,
    slug: 'borealis',
    titleLines: ['BOREALIS', 'PASS'],
    summary: 'BOREALIS PASS · 45.5 KM · €4,400',
    location: 'LOFOTEN, NO',
    hlLight: 'Traverse the',
    hlBold: 'Aurora',
    theme: 'dark',
    distance: 45.5,
    distanceDecimals: 1,
    distanceLabel: 'POLAR RIDGE CORRIDOR',
    elevation: 620,
    elevationLabel: 'COASTAL PASS GAIN',
    biomeHtml: 'POLAR RIDGE · -14°C<br><span>KP-6 AURORA ACTIVE</span>',
    orb: 'assets/orb_borealis.jpg',
    orbFallback: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=240&q=80',
    routePath: 'M6 34 C22 14, 38 38, 56 22 C72 8, 86 24, 102 10',
    routeEnd: [102, 10],
    elevPath: 'M6 36 C24 34, 34 18, 52 20 C70 22, 82 14, 98 18 C106 20, 110 26, 114 24',
    elevPeak: [52, 20],
    particleHex: 0xff8fa3,
    particleSpeed: 0.19,
  },
  {
    id: 2,
    slug: 'glacier',
    titleLines: ['GLACIER', 'CORRIDOR'],
    summary: 'GLACIER CORRIDOR · 58.4 KM · €4,950',
    location: 'YUKON, CA',
    hlLight: 'Crossing the',
    hlBold: 'Permafrost',
    theme: 'light',
    distance: 58.4,
    distanceDecimals: 1,
    distanceLabel: 'DEMPSTER ICE HIGHWAY',
    elevation: 410,
    elevationLabel: 'TUNDRA SHELF GAIN',
    biomeHtml: 'ICE HIGHWAY · -21°C<br><span>HARDPACK PERMAFROST</span>',
    orb: 'assets/orb_glacier.jpg',
    orbFallback: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=240&q=80',
    routePath: 'M6 36 L30 28 L52 24 L76 16 L102 12',
    routeEnd: [102, 12],
    elevPath: 'M6 38 C28 36, 46 31, 66 28 C84 25, 98 22, 114 20',
    elevPeak: [114, 20],
    particleHex: 0xdbeafe,
    particleSpeed: 0.34,
  },
  {
    id: 3,
    slug: 'andes',
    titleLines: ['ANDES', 'HORIZON'],
    summary: 'ANDES HORIZON · 28.5 KM · €4,200',
    location: 'PATAGONIA, CL',
    hlLight: 'Hiking the',
    hlBold: 'Glaciers',
    theme: 'dark',
    distance: 28.5,
    distanceDecimals: 1,
    distanceLabel: 'FITZ ROY MASSIF APPROACH',
    elevation: 950,
    elevationLabel: 'GRANITE SPINE GAIN',
    biomeHtml: 'GRANITE MASSIF · -3°C<br><span>KATABATIC 38 KM/H</span>',
    orb: 'assets/orb_andes.jpg',
    orbFallback: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=240&q=80',
    routePath: 'M8 38 L22 30 L38 34 L58 18 L78 22 L98 9',
    routeEnd: [98, 9],
    elevPath: 'M6 40 C18 39, 30 30, 44 26 C58 22, 68 8, 80 12 C94 16, 102 28, 114 19',
    elevPeak: [80, 12],
    particleHex: 0xe2e8f0,
    particleSpeed: 0.28,
  },
];

/* ============================================================================
   DOM REFERENCES
============================================================================ */

const dom = {
  body: document.body,
  preloader: document.getElementById('preloader'),
  preloaderPct: document.getElementById('preloader-pct'),
  cinemaTrack: document.getElementById('cinema-track'),
  cinemaViewport: document.getElementById('cinema-viewport'),
  worldSlides: Array.from(document.querySelectorAll('.world-slide')),
  atmosCanvas: document.getElementById('atmos-canvas'),
  portalTrack: document.getElementById('portal-track'),
  portalCards: Array.from(document.querySelectorAll('.portal-card')),
  headlineLayer: document.getElementById('immersion-headline-layer'),
  hlLight: document.getElementById('hl-light'),
  hlBold: document.getElementById('hl-bold'),
  explorerLayer: document.getElementById('explorer-layer'),
  hudTitle: document.getElementById('hud-world-title'),
  hudModeBtn: document.getElementById('hud-mode-btn'),
  stepButtons: Array.from(document.querySelectorAll('.step-num')),
  dotButtons: Array.from(document.querySelectorAll('.hud-dot')),
  routePathBg: document.getElementById('route-path-bg'),
  routePathFg: document.getElementById('route-path-fg'),
  routeDot: document.getElementById('route-dot'),
  elevPathBg: document.getElementById('elev-path-bg'),
  elevPathFg: document.getElementById('elev-path-fg'),
  elevDot: document.getElementById('elev-dot'),
  hudDist: document.getElementById('hud-dist'),
  hudDistLabel: document.getElementById('hud-dist-label'),
  hudElev: document.getElementById('hud-elev'),
  hudElevLabel: document.getElementById('hud-elev-label'),
  hudOrbImg: document.getElementById('hud-orb-img'),
  hudBiomeLabel: document.getElementById('hud-biome-label'),
  hudNextBtn: document.getElementById('hud-next-btn'),
  hudScrollLabel: document.getElementById('hud-scroll-label'),
  dossierCards: Array.from(document.querySelectorAll('.dossier-card')),
  previewBtns: Array.from(document.querySelectorAll('[data-preview-world]')),
  bookBtns: Array.from(document.querySelectorAll('[data-book-world]')),
  reserveRouteName: document.getElementById('reserve-route-name'),
  reserveRouteSelect: document.getElementById('reserve-route-select'),
  reserveForm: document.getElementById('reserve-form'),
  reserveStatus: document.getElementById('reserve-status'),
};

/* ============================================================================
   STATE & GEOMETRY METRICS
============================================================================ */

const state = {
  scrollProgress: 0,      // [0..1] along #cinema-track
  activeWorld: 0,         // discrete active world [0..3]
  worldPos: 0,            // continuous world index [0..3]
  morph: 0,               // [0 = carousel, 1 = full-bleed immersion]
  mode: 'carousel',       // 'carousel' | 'immersion'
  scrollVelocity: 0,
  pointerX: 0,            // [-1..1]
  pointerY: 0,            // [-1..1]
  smoothPtrX: 0,
  smoothPtrY: 0,
  vw: window.innerWidth,
  vh: window.innerHeight,
  cardW: 320,
  cardGap: 32,
  cinemaVisible: true,
  distValue: WORLDS[0].distance,
  elevValue: WORLDS[0].elevation,
  lastVisualHash: '',
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

function measureLayout() {
  state.vw = window.innerWidth;
  state.vh = window.innerHeight;
  if (dom.portalCards[0]) {
    state.cardW = dom.portalCards[0].getBoundingClientRect().width || 300;
  }
  const cs = getComputedStyle(dom.portalTrack);
  state.cardGap = parseFloat(cs.columnGap || cs.gap) || 28;
}

/* ============================================================================
   8-BEAT SCROLL TIMELINE MAPPING (4 WORLDS x [CAROUSEL -> PORTAL IMMERSION])
   Normalized scrollProgress p in [0, 1]:
   World i occupies segment s = p * 4 in [i, i + 1]:
     f = frac(s) in [0, 1]:
       [0.00 .. 0.24]: Carousel centered cleanly behind explorer (morph = 0)
       [0.24 .. 0.44]: Portal Expansion Morph (morph 0 -> 1)
       [0.44 .. 0.78]: Full-bleed Immersion + right-edge peek card (morph = 1)
       [0.78 .. 0.92]: Pull-back into next card Carousel (morph 1 -> 0) & glide
       [0.92 .. 1.00]: Slide worldPos smoothly i -> i + 1
   On final world (i = 3), stays open in Immersion cleanly through p = 1.0!
============================================================================ */

function evaluateScrollBeats(p) {
  const scaled = clamp(p, 0, 0.999999) * 4;
  const idx = Math.min(3, Math.floor(scaled));
  const f = scaled - idx;

  let morph = 0;
  let worldPos = idx;

  if (idx < 3) {
    if (f < 0.20) {
      // Beat A: Carousel centered cleanly behind explorer
      morph = 0;
      worldPos = idx;
    } else if (f < 0.38) {
      // Beat B: Portal Expansion Morph (active card opens into full-bleed world)
      morph = smoothstep(0.20, 0.38, f);
      worldPos = idx;
    } else if (f < 0.68) {
      // Beat C: Full-bleed Immersion + next card peeking ~11% from right edge
      morph = 1;
      worldPos = idx;
    } else if (f < 0.82) {
      // Beat D: Smooth pull-back to carousel before horizontal slide (zero jump!)
      morph = 1 - smoothstep(0.68, 0.82, f);
      worldPos = idx;
    } else {
      // Beat E: Pure horizontal carousel glide to next world (morph === 0 strictly)
      morph = 0;
      worldPos = idx + smoothstep(0.82, 0.99, f);
    }
  } else {
    // Final World 3 (Andes Horizon): carousel -> full immersion hold to dossier
    if (f < 0.22) {
      morph = 0;
    } else if (f < 0.44) {
      morph = smoothstep(0.22, 0.44, f);
    } else {
      morph = 1;
    }
    worldPos = 3;
  }

  const discreteWorld = clamp(Math.round(worldPos), 0, 3);
  return { worldPos, discreteWorld, morph };
}

/** Compute exact scrollY in #cinema-track for a target (worldIdx, targetMode) */
function getScrollTargetForWorld(worldIdx, targetMode = 'carousel') {
  const trackTop = dom.cinemaTrack.offsetTop;
  const maxTrackScroll = Math.max(1, dom.cinemaTrack.offsetHeight - state.vh);
  // Pick dead-center of each hold zone so visual state locks squarely
  const localFrac = targetMode === 'immersion' ? 0.53 : 0.08;
  const targetP = clamp((worldIdx + localFrac) / 4, 0, 0.985);
  return trackTop + targetP * maxTrackScroll;
}

/* ============================================================================
   HUD TELEMETRY & WORLD METADATA SYNC
============================================================================ */

let distTween = null;
let elevTween = null;

function animateSvgPath(fgEl, bgEl, dotEl, d, endPt) {
  bgEl.setAttribute('d', d);
  fgEl.setAttribute('d', d);
  dotEl.setAttribute('cx', String(endPt[0]));
  dotEl.setAttribute('cy', String(endPt[1]));

  try {
    const len = fgEl.getTotalLength();
    gsap.killTweensOf(fgEl);
    gsap.killTweensOf(dotEl);
    gsap.set(fgEl, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(fgEl, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
    gsap.fromTo(
      dotEl,
      { attr: { r: 0.5 }, opacity: 0 },
      { attr: { r: 3.2 }, opacity: 1, duration: 0.45, delay: 0.45, ease: 'back.out(2)' }
    );
  } catch {
    // Fallback if element hidden
  }
}

function applyActiveWorld(worldIdx, immediate = false) {
  const world = WORLDS[worldIdx];
  if (!world) return;

  state.activeWorld = worldIdx;
  dom.body.dataset.world = String(worldIdx);
  dom.body.dataset.theme = world.theme;

  // Crossfade 16:9 background worlds
  dom.worldSlides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === worldIdx);
  });

  // Update step buttons, progress dots, and dossier highlight
  dom.stepButtons.forEach((btn, i) => {
    btn.classList.toggle('is-active', i === worldIdx);
    btn.setAttribute('aria-current', i === worldIdx ? 'step' : 'false');
  });
  dom.dotButtons.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === worldIdx);
    dot.setAttribute('aria-selected', i === worldIdx ? 'true' : 'false');
  });
  dom.dossierCards.forEach((card, i) => {
    card.classList.toggle('is-selected', i === worldIdx);
  });

  // Top-left condensed world title swap
  const nextTitleHtml = `${world.titleLines[0]}<br>${world.titleLines[1]}`;
  if (immediate) {
    dom.hudTitle.innerHTML = nextTitleHtml;
  } else {
    dom.hudTitle.classList.add('is-swapping');
    window.setTimeout(() => {
      dom.hudTitle.innerHTML = nextTitleHtml;
      dom.hudTitle.classList.remove('is-swapping');
    }, 150);
  }

  // Immersion headline copy
  dom.hlLight.textContent = world.hlLight;
  dom.hlBold.textContent = world.hlBold;

  // Next CTA label
  dom.hudScrollLabel.textContent = worldIdx === 3 ? 'FIELD DOSSIER' : 'SCROLL / NEXT';

  // Labels & Biome Orb
  dom.hudDistLabel.textContent = world.distanceLabel;
  dom.hudElevLabel.textContent = world.elevationLabel;
  dom.hudBiomeLabel.innerHTML = world.biomeHtml;

  if (immediate) {
    dom.hudOrbImg.src = world.orb;
  } else {
    dom.hudOrbImg.classList.add('is-swapping');
    window.setTimeout(() => {
      dom.hudOrbImg.onerror = () => {
        dom.hudOrbImg.onerror = null;
        dom.hudOrbImg.src = world.orbFallback;
      };
      dom.hudOrbImg.src = world.orb;
      dom.hudOrbImg.classList.remove('is-swapping');
    }, 140);
  }

  // Numeric telemetry count-up
  if (immediate) {
    state.distValue = world.distance;
    state.elevValue = world.elevation;
    dom.hudDist.textContent = world.distance.toFixed(world.distanceDecimals);
    dom.hudElev.textContent = String(Math.round(world.elevation));
  } else {
    if (distTween) distTween.kill();
    if (elevTween) elevTween.kill();

    const counter = { d: state.distValue, e: state.elevValue };
    distTween = gsap.to(counter, {
      d: world.distance,
      duration: 0.72,
      ease: 'power2.out',
      onUpdate: () => {
        state.distValue = counter.d;
        dom.hudDist.textContent = counter.d.toFixed(world.distanceDecimals);
      },
    });
    elevTween = gsap.to(counter, {
      e: world.elevation,
      duration: 0.78,
      ease: 'power2.out',
      onUpdate: () => {
        state.elevValue = counter.e;
        dom.hudElev.textContent = String(Math.round(counter.e));
      },
    });
  }

  // Animate route map & elevation profile SVG strokes
  animateSvgPath(dom.routePathFg, dom.routePathBg, dom.routeDot, world.routePath, world.routeEnd);
  animateSvgPath(dom.elevPathFg, dom.elevPathBg, dom.elevDot, world.elevPath, world.elevPeak);

  // Sync Three.js atmospheric particle tint
  if (atmosEngine) {
    atmosEngine.setWorldTint(world.particleHex, world.particleSpeed);
  }
}

/* ============================================================================
   5-LAYER COMPOSITOR FRAME RENDER (60FPS GPU TRANSFORMS)
============================================================================ */

function renderSceneFrame(timeSec) {
  // Smooth mouse parallax interpolation
  state.smoothPtrX = lerp(state.smoothPtrX, state.pointerX, 0.08);
  state.smoothPtrY = lerp(state.smoothPtrY, state.pointerY, 0.08);

  const { worldPos, discreteWorld, morph } = evaluateScrollBeats(state.scrollProgress);
  state.worldPos = worldPos;
  state.morph = morph;

  // Update body mode for top-right X / 3-card icon swap
  const nextMode = morph > 0.48 ? 'immersion' : 'carousel';
  if (nextMode !== state.mode) {
    state.mode = nextMode;
    dom.body.dataset.mode = nextMode;
  }

  if (discreteWorld !== state.activeWorld) {
    applyActiveWorld(discreteWorld, false);
  }

  // 1. Subtle 1-point perspective parallax on active background world
  const bgPx = (-state.smoothPtrX * 14).toFixed(2);
  const bgPy = (-state.smoothPtrY * 8).toFixed(2);
  const activeSlide = dom.worldSlides[state.activeWorld];
  if (activeSlide) {
    activeSlide.style.setProperty('--bg-px', `${bgPx}px`);
    activeSlide.style.setProperty('--bg-py', `${bgPy}px`);
  }

  // 2. Portal Track Horizontal Centering + Signature Portal Expansion Morph
  const stride = state.cardW + state.cardGap;
  const centerX = state.vw * 0.5 - state.cardW * 0.5;
  const trackX = centerX - worldPos * stride - state.smoothPtrX * 18;
  dom.portalTrack.style.transform = `translate3d(${trackX.toFixed(2)}px, 0, 0)`;

  const isMobile = state.vw <= 760;
  // Exact right-edge peek target so ~11% of the next world's card invites from the right edge (just like 222.mp4)
  const peekVisiblePx = isMobile ? Math.min(46, state.vw * 0.12) : clamp(state.vw * 0.112, 110, 178);

  dom.portalCards.forEach((card, i) => {
    const delta = i - worldPos; // 0 = centered active card, +1 = next card, -1 = previous card
    const absDelta = Math.abs(delta);

    let extraX = 0;
    let extraY = 0;
    let scale = 1 - Math.min(absDelta, 2) * 0.055;
    let rotY = clamp(-delta * 6.5, -14, 14);
    let opacity = clamp(1 - absDelta * 0.16, 0.4, 1);
    let zOrder = 10 - Math.round(absDelta * 2);

    if (morph > 0.001) {
      if (i === discreteWorld) {
        // Active card expands smoothly outward into the full-bleed landscape world
        scale = lerp(1.02, 2.38, morph);
        extraY = -morph * state.vh * 0.04;
        opacity = clamp(1 - morph * 1.42, 0, 1);
        rotY = 0;
        zOrder = 2;
      } else if (i < discreteWorld) {
        // Past cards sweep cleanly off-screen left
        extraX = -morph * (state.vw * 0.44);
        scale = lerp(scale, 0.88, morph);
        opacity = clamp(opacity * (1 - morph * 1.35), 0, 1);
      } else if (i === discreteWorld + 1) {
        // Next world's card glides cleanly to right-edge peek (00:02, 00:03, 00:07 of 222.mp4)
        const baseScreenLeft = trackX + i * stride;
        const desiredScreenLeft = state.vw - peekVisiblePx;
        const targetOffset = desiredScreenLeft - baseScreenLeft;
        extraX = morph * targetOffset;
        scale = lerp(scale, 0.96, morph);
        rotY = lerp(rotY, -4, morph);
        opacity = lerp(opacity, 0.95, morph);
        zOrder = 14;
      } else {
        // Cards beyond next stay tucked cleanly off-screen right
        extraX = morph * (state.vw * 0.45);
        opacity = clamp(opacity * (1 - morph * 1.3), 0, 1);
      }
    }

    card.style.zIndex = String(zOrder);
    card.style.opacity = opacity.toFixed(3);
    card.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
    card.style.transform = `translate3d(${extraX.toFixed(2)}px, ${extraY.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateY(${rotY.toFixed(2)}deg)`;
  });

  // 3. Immersion Display Headline (Centered Behind Explorer Head & Shoulders)
  const hlOpacity = smoothstep(0.28, 0.84, morph);
  const hlY = (1 - hlOpacity) * 28;
  const hlScale = 0.965 + hlOpacity * 0.035;
  dom.headlineLayer.style.opacity = hlOpacity.toFixed(3);
  dom.headlineLayer.style.transform = `translate3d(${(-state.smoothPtrX * 8).toFixed(2)}px, ${hlY.toFixed(2)}px, 0) scale(${hlScale.toFixed(4)})`;

  // 4. Constant Foreground Explorer Cutout (Grounded Stride Breath + Subtle Depth Scale)
  const stridePhase = state.scrollProgress * 72 + timeSec * 0.45;
  const strideAmplitude = 1.4 + Math.min(Math.abs(state.scrollVelocity) * 0.14, 3.2);
  const walkBobY = Math.sin(stridePhase) * strideAmplitude;
  const walkSwayX = Math.cos(stridePhase * 0.5) * 1.1 + state.smoothPtrX * 9;
  const explorerScale = 1 + morph * 0.032;

  dom.explorerLayer.style.transform = `translate3d(calc(-50% + ${walkSwayX.toFixed(2)}px), ${walkBobY.toFixed(2)}px, 0) scale(${explorerScale.toFixed(4)})`;
}

/* ============================================================================
   FEATHERWEIGHT 60FPS THREE.JS ATMOSPHERIC DEPTH PARTICLES
============================================================================ */

function createAtmosEngine(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0.6, 12);

  const count = window.innerWidth < 760 ? 180 : 340;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.35) * 15;
    positions[i * 3 + 2] = Math.random() * 64 - 50;
    speeds[i] = 0.45 + Math.random() * 0.95;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Crisp procedural radial glow sprite (no external texture HTTP call needed)
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 32;
  spriteCanvas.height = 32;
  const ctx = spriteCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.38)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(spriteCanvas);
  const material = new THREE.PointsMaterial({
    size: 0.24,
    map: texture,
    color: new THREE.Color(WORLDS[0].particleHex),
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const targetColor = new THREE.Color(WORLDS[0].particleHex);
  let baseSpeed = WORLDS[0].particleSpeed;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  resize();

  function setWorldTint(hex, speed) {
    targetColor.setHex(hex);
    baseSpeed = speed;
  }

  function tick(dt) {
    if (!state.cinemaVisible) return;
    material.color.lerp(targetColor, 0.045);

    const posAttr = geometry.attributes.position;
    const arr = posAttr.array;
    const velBoost = 1 + Math.min(Math.abs(state.scrollVelocity) * 0.22, 6);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 2] += dt * (4.2 * baseSpeed * speeds[i] * velBoost);
      arr[i3 + 1] -= dt * (0.28 * speeds[i]);

      if (arr[i3 + 2] > 12) {
        arr[i3 + 2] = -50;
        arr[i3 + 0] = (Math.random() - 0.5) * 28;
        arr[i3 + 1] = (Math.random() - 0.25) * 15;
      } else if (arr[i3 + 1] < -7.5) {
        arr[i3 + 1] = 8.5;
      }
    }
    posAttr.needsUpdate = true;

    camera.position.x = lerp(camera.position.x, state.smoothPtrX * 0.85, 0.06);
    camera.position.y = lerp(camera.position.y, 0.6 - state.smoothPtrY * 0.45, 0.06);
    camera.lookAt(0, 0.2, -24);

    renderer.render(scene, camera);
  }

  return { resize, setWorldTint, tick };
}

const atmosEngine = createAtmosEngine(dom.atmosCanvas);

/* ============================================================================
   LENIS MOMENTUM SCROLLING + GSAP SCROLLTRIGGER SYNCHRONIZATION
============================================================================ */

const lenis = new Lenis({
  lerp: 0.088,
  smoothWheel: true,
  wheelMultiplier: 0.95,
  touchMultiplier: 1.35,
});

lenis.on('scroll', (e) => {
  state.scrollVelocity = e.velocity || 0;
  ScrollTrigger.update();
});

const cinemaTrigger = ScrollTrigger.create({
  trigger: dom.cinemaTrack,
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    state.scrollProgress = self.progress;
  },
});

// Automatically pause Three.js particle pass when user scrolls down into #dossier
const cinemaObserver = new IntersectionObserver(
  (entries) => {
    state.cinemaVisible = entries[0]?.isIntersecting ?? true;
  },
  { threshold: 0.01 }
);
cinemaObserver.observe(dom.cinemaTrack);

let lastTime = performance.now();
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (state.cinemaVisible) {
    renderSceneFrame(time);
    if (atmosEngine) atmosEngine.tick(dt);
  }
});
gsap.ticker.lagSmoothing(0);

function scrollToWorld(worldIdx, targetMode = 'carousel') {
  const idx = clamp(worldIdx, 0, 3);
  const y = getScrollTargetForWorld(idx, targetMode);
  lenis.scrollTo(y, { duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.5) });
}

/* ============================================================================
   3D CARD MOUSE TILT & SPECULAR GLARE + DIRECT INTERACTIONS
============================================================================ */

dom.portalCards.forEach((card, idx) => {
  const inner = card.querySelector('.portal-card-inner');

  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const nx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const ny = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    const rx = (0.5 - ny) * 11;
    const ry = (nx - 0.5) * 13;

    inner.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    inner.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    inner.style.setProperty('--mx', `${(nx * 100).toFixed(1)}%`);
    inner.style.setProperty('--my', `${(ny * 100).toFixed(1)}%`);
  });

  card.addEventListener('pointerleave', () => {
    inner.style.setProperty('--rx', '0deg');
    inner.style.setProperty('--ry', '0deg');
  });

  const activateCard = () => {
    if (state.mode === 'carousel' && idx === state.activeWorld) {
      // Clicking centered active card morphs directly into full-bleed immersion
      scrollToWorld(idx, 'immersion');
    } else if (state.mode === 'immersion' && idx === state.activeWorld + 1) {
      // Clicking peeking right-edge card enters that world's immersion directly!
      scrollToWorld(idx, 'immersion');
    } else {
      // Clicking side card glides it cleanly to center behind the explorer
      scrollToWorld(idx, 'carousel');
    }
  };

  card.addEventListener('click', activateCard);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateCard();
    }
  });
});

// Top-right X / 3-Card Portal Toggle
dom.hudModeBtn.addEventListener('click', () => {
  const nextMode = state.mode === 'carousel' ? 'immersion' : 'carousel';
  scrollToWorld(state.activeWorld, nextMode);
});

// Mid-left Golden Circle Step Buttons (1 2 3 4)
dom.stepButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.step);
    scrollToWorld(idx, state.mode);
  });
});

// Bottom-right Progress Dots
dom.dotButtons.forEach((dot) => {
  dot.addEventListener('click', () => {
    const idx = Number(dot.dataset.dot);
    scrollToWorld(idx, state.mode);
  });
});

// Bottom-right SCROLL / NEXT Trigger
dom.hudNextBtn.addEventListener('click', () => {
  if (state.activeWorld < 3) {
    if (state.mode === 'carousel') {
      scrollToWorld(state.activeWorld, 'immersion');
    } else {
      scrollToWorld(state.activeWorld + 1, 'carousel');
    }
  } else if (state.mode === 'carousel') {
    scrollToWorld(3, 'immersion');
  } else {
    lenis.scrollTo('#dossier', { duration: 1.25 });
  }
});

// Smooth anchor scrolling for top EXPEDITION BRIEF & brand lockup
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.2 });
  });
});

// Keyboard navigation while inside cinema track
window.addEventListener('keydown', (e) => {
  if (document.activeElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (!state.cinemaVisible) return;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    scrollToWorld(Math.min(3, state.activeWorld + 1), state.mode);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    scrollToWorld(Math.max(0, state.activeWorld - 1), state.mode);
  } else if (e.key === 'Escape' && state.mode === 'immersion') {
    e.preventDefault();
    scrollToWorld(state.activeWorld, 'carousel');
  }
});

// Mobile horizontal swipe on cinema viewport
let touchStartX = 0;
let touchStartY = 0;
dom.cinemaViewport.addEventListener(
  'touchstart',
  (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  },
  { passive: true }
);

dom.cinemaViewport.addEventListener(
  'touchend',
  (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0 && state.activeWorld < 3) {
        scrollToWorld(state.activeWorld + 1, state.mode);
      } else if (dx > 0 && state.activeWorld > 0) {
        scrollToWorld(state.activeWorld - 1, state.mode);
      }
    }
  },
  { passive: true }
);

// Desktop pointer parallax
window.addEventListener(
  'pointermove',
  (e) => {
    state.pointerX = (e.clientX / Math.max(1, state.vw)) * 2 - 1;
    state.pointerY = (e.clientY / Math.max(1, state.vh)) * 2 - 1;
  },
  { passive: true }
);

/* ============================================================================
   FIELD DOSSIER & RESERVATION FORM WIRING
============================================================================ */

function selectReservationRoute(worldIdx) {
  const world = WORLDS[clamp(worldIdx, 0, 3)];
  if (!world) return;
  dom.reserveRouteSelect.value = String(world.id);
  dom.reserveRouteName.textContent = world.summary;
  dom.dossierCards.forEach((card, i) => {
    card.classList.toggle('is-selected', i === world.id);
  });
}

dom.previewBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.previewWorld);
    scrollToWorld(idx, 'carousel');
  });
});

dom.bookBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.bookWorld);
    selectReservationRoute(idx);
  });
});

dom.reserveRouteSelect.addEventListener('change', (e) => {
  selectReservationRoute(Number(e.target.value));
});

dom.reserveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(dom.reserveForm);
  const routeIdx = Number(data.get('route') || 0);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const world = WORLDS[clamp(routeIdx, 0, 3)];

  if (!name || !email) {
    dom.reserveStatus.textContent = 'Please provide your full name and dispatch email.';
    return;
  }

  dom.reserveStatus.textContent = `CONFIRMED // ${world.titleLines.join(' ')} dossier queued for ${name} (${email}). GPX manifest & cohort window sent.`;
  dom.reserveForm.reset();
  selectReservationRoute(routeIdx);
});

/* ============================================================================
   RESIZE & DETERMINISTIC FAST PRELOADER
============================================================================ */

let resizeRaf = 0;
window.addEventListener('resize', () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    measureLayout();
    if (atmosEngine) atmosEngine.resize();
    ScrollTrigger.refresh();
  });
});

function runPreloader() {
  const priorityImgs = [
    document.querySelector('[data-world-bg="0"] img'),
    document.getElementById('explorer-img'),
    document.querySelector('[data-card="0"] .portal-card-img'),
    document.querySelector('[data-card="1"] .portal-card-img'),
  ].filter(Boolean);

  let loaded = 0;
  let dismissed = false;
  const total = Math.max(1, priorityImgs.length);

  const finish = () => {
    if (dismissed) return;
    dismissed = true;
    dom.preloaderPct.textContent = '100%';
    dom.preloader.classList.add('is-done');
    measureLayout();
    applyActiveWorld(0, true);
    renderSceneFrame(0);
    ScrollTrigger.refresh();
  };

  const bump = () => {
    loaded += 1;
    const pct = Math.min(100, Math.round((loaded / total) * 100));
    dom.preloaderPct.textContent = `${String(pct).padStart(2, '0')}%`;
    if (loaded >= total) {
      window.setTimeout(finish, 140);
    }
  };

  priorityImgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      bump();
    } else {
      img.addEventListener('load', bump, { once: true });
      img.addEventListener('error', bump, { once: true });
    }
  });

  // Hard ceiling so preloader never traps or stalls page opening
  window.setTimeout(finish, 780);
}

// Initial deterministic bootstrap
measureLayout();
applyActiveWorld(0, true);
selectReservationRoute(0);
renderSceneFrame(0);
runPreloader();
