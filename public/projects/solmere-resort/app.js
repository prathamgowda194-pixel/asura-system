import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initSolmereWalkthrough } from './walkthrough3d.js';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   SOLMERE // CONTINUOUS 6-STAGE WALKTHROUGH + LAPTOP PORTAL ZOOM CONTROLLER
   Matches bbb.mp4 (00:00 -> 00:30) Frame-for-Frame
============================================================================ */

const STAGE_META = [
  { stage: 0, tag: '00 // TWILIGHT LAKEFRONT', kicker: 'ALPINE SANCTUARY', title: 'SOLMERE\nESTATE', stopIdx: 0 },
  { stage: 1, tag: '00 // THE LANTERN TERRACE', kicker: 'EXTERIOR APPROACH', title: 'INFINITY\nTERRACE', stopIdx: 0 },
  { stage: 2, tag: '01 // THE FRONT DOOR', kicker: 'LEVEL 01 · ENTRY PAVILION', title: 'THE FRONT\nDOOR', stopIdx: 1 },
  { stage: 3, tag: '02 // THE GREAT ROOM', kicker: 'LEVEL 01 · HEARTH SALON', title: 'THE GREAT\nROOM', stopIdx: 2 },
  { stage: 4, tag: '03 // KITCHEN & DINING', kicker: 'LEVEL 01 · CULINARY HALL', title: 'THE KITCHEN\n& DINING', stopIdx: 3 },
  { stage: 5, tag: '04 // THE STUDY', kicker: 'LEVEL 02 · ALPINE LIBRARY', title: 'THE\nSTUDY', stopIdx: 4 },
];

// Normalized scroll timeline segments along #walkthrough [0..1]:
// [0.00..0.15]: Stage 0 Lake Hero + SOLMERE Depth Sandwich
// [0.15..0.28]: Stage 1 Exterior Approach -> Front Glass Portal
// [0.28..0.44]: Stage 2 THE FRONT DOOR
// [0.44..0.60]: Stage 3 THE GREAT ROOM
// [0.60..0.76]: Stage 4 THE KITCHEN & DINING
// [0.76..1.00]: Stage 5 THE STUDY -> 3D Laptop Screen Zoom to Fullscreen Dossier!
const SEGMENTS = [
  { start: 0.00, end: 0.15 },
  { start: 0.15, end: 0.28 },
  { start: 0.28, end: 0.44 },
  { start: 0.44, end: 0.60 },
  { start: 0.60, end: 0.76 },
  { start: 0.76, end: 1.00 },
];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ============================================================================
   LENIS MOMENTUM SMOOTHING + GSAP TICKER
============================================================================ */

const lenis = new Lenis({
  lerp: 0.088,
  smoothWheel: true,
  wheelMultiplier: 0.94,
  touchMultiplier: 1.3,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ============================================================================
   DOM REFERENCES & 3D WALKTHROUGH INITIALIZATION
============================================================================ */

const dom = {
  body: document.body,
  track: document.getElementById('walkthrough'),
  viewport: document.getElementById('walkthrough-viewport'),
  canvas: document.getElementById('solmere-3d-canvas'),
  heroSandwich: document.getElementById('hero-title-sandwich'),
  wordSky: document.getElementById('solmere-wordmark-sky'),
  wordLake: document.getElementById('solmere-wordmark-lake'),
  chaletsFg: document.getElementById('hero-chalets-fg'),
  laptopStage: document.getElementById('study-laptop-stage'),
  laptopRig: document.getElementById('study-laptop-rig'),
  roomTag: document.getElementById('hud-room-tag'),
  calloutKicker: document.getElementById('room-callout-kicker'),
  calloutTitle: document.getElementById('room-callout-title'),
  scrubberFill: document.getElementById('scrubber-fill'),
  stopBtns: Array.from(document.querySelectorAll('.stop-btn')),
  dossier: document.getElementById('dossier'),
};

const walkEngine = initSolmereWalkthrough(dom.canvas, dom.viewport);

let activeStage = -1;

function syncRoomLabels(stageIdx) {
  if (stageIdx === activeStage) return;
  activeStage = stageIdx;
  dom.body.dataset.stage = String(stageIdx);

  const meta = STAGE_META[stageIdx] || STAGE_META[0];
  dom.roomTag.textContent = meta.tag;
  dom.calloutKicker.textContent = meta.kicker;

  dom.calloutTitle.classList.add('is-swapping');
  window.setTimeout(() => {
    dom.calloutTitle.innerHTML = meta.title.replace('\n', '<br>');
    dom.calloutTitle.classList.remove('is-swapping');
  }, 120);

  dom.stopBtns.forEach((btn, i) => {
    btn.classList.toggle('is-active', i === meta.stopIdx);
  });
}

function updateWalkthroughProgress(rawP) {
  const p = clamp(rawP, 0, 1);
  dom.scrubberFill.style.width = `${(p * 100).toFixed(1)}%`;

  // Determine current room segment & smooth cross-room portal blend
  let segIdx = 0;
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (p >= SEGMENTS[i].start && p <= SEGMENTS[i].end) {
      segIdx = i;
      break;
    }
  }

  const seg = SEGMENTS[segIdx];
  const localT = clamp((p - seg.start) / Math.max(0.001, seg.end - seg.start), 0, 1);

  let idxA = segIdx;
  let idxB = Math.min(5, segIdx + 1);
  let mix = 0;
  let hold = 0;
  let camPush = 0;

  if (segIdx < 5) {
    // First 58% of segment holds & drifts forward inside room; final 42% portals cleanly into next room
    hold = smoothstep(0.0, 0.58, localT);
    mix = smoothstep(0.56, 1.0, localT);
  } else {
    // Final Segment 5 (THE STUDY):
    // [0.00..0.38]: Settle inside The Study facing the mountain window & walnut desk
    // [0.38..1.00]: Push 3D camera into desk while Study Laptop zooms seamlessly to 100vw x 100vh!
    idxA = 5;
    idxB = 5;
    mix = 0;
    hold = smoothstep(0.0, 0.45, localT);
    camPush = smoothstep(0.32, 1.0, localT);
  }

  if (walkEngine) {
    walkEngine.setWalkState(idxA, idxB, mix, hold, camPush);
  }

  const displayStage = mix > 0.52 ? idxB : idxA;
  syncRoomLabels(displayStage);

  // 1. Act 1 SOLMERE 3-Layer Depth Sandwich & Foreground Chalet Cutout Fade (p in [0.00..0.15])
  const heroFade = 1 - smoothstep(0.07, 0.145, p);
  if (heroFade > 0.002) {
    const pushScale = 1 + p * 2.1;
    const wordLift = -p * 220;
    dom.heroSandwich.style.opacity = heroFade.toFixed(3);
    dom.chaletsFg.style.opacity = heroFade.toFixed(3);
    dom.wordSky.style.transform = `translate3d(-50%, ${wordLift.toFixed(1)}px, 0) scale(${(1 + p * 0.9).toFixed(3)})`;
    dom.wordLake.style.transform = `translate3d(-50%, ${(-wordLift * 0.55).toFixed(1)}px, 0) scale(${(1 + p * 0.9).toFixed(3)}) scaleY(-0.88)`;
    dom.chaletsFg.style.transform = `scale(${pushScale.toFixed(4)})`;
    dom.heroSandwich.style.visibility = 'visible';
    dom.chaletsFg.style.visibility = 'visible';
  } else {
    dom.heroSandwich.style.opacity = '0';
    dom.chaletsFg.style.opacity = '0';
    dom.heroSandwich.style.visibility = 'hidden';
    dom.chaletsFg.style.visibility = 'hidden';
  }

  // 2. Act 2 Stage 5: Glowing Study Laptop Portal Zoom (p in [0.74..1.00])
  if (p > 0.72) {
    const appear = smoothstep(0.72, 0.80, p);
    const zoomT = smoothstep(0.82, 0.992, p);
    // Exponential optical zoom from walnut study tabletop (0.74x at +9.6vh) to full-viewport takeover (6.2x)
    const scale = 0.74 + Math.pow(zoomT, 2.05) * 5.65;
    const yVh = (1 - zoomT) * 9.6;

    dom.laptopStage.style.opacity = appear.toFixed(3);
    dom.laptopStage.style.visibility = 'visible';
    dom.laptopRig.style.transform = `translate3d(0, ${yVh.toFixed(2)}vh, 0) scale(${scale.toFixed(4)})`;
  } else {
    dom.laptopStage.style.opacity = '0';
    dom.laptopStage.style.visibility = 'hidden';
  }
}

ScrollTrigger.create({
  trigger: dom.track,
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => updateWalkthroughProgress(self.progress),
});
syncRoomLabels(0);
updateWalkthroughProgress(0);

/* ============================================================================
   DIRECT ROOM JUMP NAVIGATION & BLUEPRINT SCROLL REVEALS
============================================================================ */

function jumpToStage(stageIdx) {
  const seg = SEGMENTS[clamp(stageIdx, 0, 5)];
  const targetP = stageIdx === 0 ? 0 : seg.start + (seg.end - seg.start) * 0.24;
  const maxScroll = Math.max(1, dom.track.offsetHeight - window.innerHeight);
  const y = dom.track.offsetTop + targetP * maxScroll;
  lenis.scrollTo(y, { duration: 1.2 });
}

document.querySelectorAll('[data-jump-stage]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    jumpToStage(Number(el.dataset.jumpStage || 0));
  });
});

document.querySelectorAll('[data-jump-dossier]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo(dom.dossier, { duration: 1.2 });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    if (anchor.hasAttribute('data-jump-stage')) return;
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.15 });
  });
});

// Subtle staggered reveal on Blueprint Sheet modules
document.querySelectorAll('.bp-row').forEach((row) => {
  gsap.fromTo(
    row.children,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 84%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

/* ============================================================================
   RESERVATION CONCIERGE MODAL
============================================================================ */

const modal = document.getElementById('reserve-modal');
const rmTitle = document.getElementById('rm-title');
const rmClose = document.getElementById('rm-close');
const rmForm = document.getElementById('reserve-form');
const rmStatus = document.getElementById('rm-status');

function openModal(label) {
  rmTitle.textContent = label || 'Request Private Stay';
  rmStatus.textContent = '';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  lenis.stop();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  lenis.start();
}

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.openModal);
  });
});

rmClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

rmForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(rmForm);
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').trim();
  const chalet = String(fd.get('chalet') || 'The Lantern');
  if (!name || !email) {
    rmStatus.textContent = 'Please provide your full name and email address.';
    return;
  }
  rmStatus.textContent = `CONFIRMED // Private dossier & dates for ${chalet} sent to ${name} (${email}).`;
  rmForm.reset();
});

window.addEventListener('load', () => ScrollTrigger.refresh());
