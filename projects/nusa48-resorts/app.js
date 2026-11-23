import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initAnySceneHero } from './hero3d.js';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   NUSA 48 RESORTS — 3D SCROLL CHOREOGRAPHY & INTERACTION ENGINE
   Exact Motion Parity with aa.mp4 (00:00 -> 00:39)
============================================================================ */

const SHOWCASE_SLIDES = [
  {
    title: 'RAINFOREST VILLA, UBUD',
    pills: ['Private Villa', 'From $1,250 / Night', '480 m² · 4 Suites'],
  },
  {
    title: 'CLIFFSIDE SANCTUARY, ULUWATU',
    pills: ['Ocean Estate', 'From $1,680 / Night', '620 m² · 5 Suites'],
  },
  {
    title: 'COASTAL PAVILION, SUMBA',
    pills: ['Beachfront Villa', 'From $1,420 / Night', '540 m² · 4 Suites'],
  },
];

const EXPERIENCE_PILLARS = [
  ['/ Monolithic Volcanic Stone', '/ Private Infinity Pools', '/ Complete Privacy'],
  ['/ Thermal Jungle Baths', '/ Sound Healing Pavilion', '/ Resident Wellness Masters'],
  ['/ Wood-Fired Coastal Table', '/ Organic Estate Orchards', '/ Private Sommelier Cellar'],
  ['/ 24/7 Estate Butler', '/ Private Helicopter Transfers', '/ Tailored Island Itineraries'],
];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ============================================================================
   1. LENIS MOMENTUM SMOOTHING SYNCED TO GSAP SCROLLTRIGGER
============================================================================ */

const lenis = new Lenis({
  lerp: 0.085,
  smoothWheel: true,
  wheelMultiplier: 0.92,
  touchMultiplier: 1.3,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ============================================================================
   2. ANYSCENE-WEBGL2 INTERACTIVE 3D HERO ENGINE (FROM SINGLE REFERENCE IMAGE)
============================================================================ */

const hero3d = initAnySceneHero(
  document.getElementById('hero-3d-canvas'),
  document.getElementById('hero')
);

const dialButtons = Array.from(document.querySelectorAll('.anyscene-dial'));
dialButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.dial;
    dialButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    if (hero3d) hero3d.setDial(key);
  });
});

/* ============================================================================
   3. ADAPTIVE GLASS-TO-SOLID / DARK-TO-LIGHT NAVIGATION STATE MACHINE
============================================================================ */

const siteNav = document.getElementById('site-nav');
const lightSections = ['#experience', '#residences', '#portfolio', '#manifesto']
  .map((sel) => document.querySelector(sel))
  .filter(Boolean);

ScrollTrigger.create({
  start: 'top -70',
  end: 999999,
  onUpdate: (self) => {
    siteNav.classList.toggle('is-scrolled', self.scroll() > 70);
    const navMid = 34;
    let onLight = false;
    for (const sec of lightSections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= navMid && r.bottom >= navMid) {
        onLight = true;
        break;
      }
    }
    siteNav.classList.toggle('is-light-bar', onLight);
  },
});

/* ============================================================================
   4. HERO 3D SCROLL DOLLY-IN + KINETIC SPLIT-LINE TEXT REVEALS (00:01-00:03)
============================================================================ */

ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    if (hero3d) hero3d.setScrollProgress(self.progress);
  },
});

gsap.to('#hero-wordmark', {
  yPercent: -24,
  opacity: 0.15,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

document.querySelectorAll('.js-split-reveal').forEach((heading) => {
  const lines = heading.querySelectorAll('.line-inner');
  gsap.fromTo(
    lines,
    { yPercent: 112, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.95,
      stagger: 0.11,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 84%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

document.querySelectorAll('.js-fade-up').forEach((el) => {
  gsap.fromTo(
    el,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

/* ============================================================================
   5. SECTION 2: 3-IMAGE STAGGERED 3D DEPTH PARALLAX GALLERY (00:04-00:06)
============================================================================ */

document.querySelectorAll('[data-parallax-speed]').forEach((col) => {
  const speed = Number(col.dataset.parallaxSpeed || 0);
  gsap.fromTo(
    col,
    { y: speed },
    {
      y: -speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '#editorial-trio',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
});

/* ============================================================================
   6. SECTION 3: PINNED 3D SPLIT-DEPTH SHOWCASE CAROUSEL (00:07-00:10)
   Full-bleed curtain wipes + independent floating 3D inset cards!
============================================================================ */

const scTrack = document.getElementById('showcase');
const scBgs = Array.from(document.querySelectorAll('[data-sc-bg]'));
const scInsets = Array.from(document.querySelectorAll('[data-sc-inset]'));
const scTitle = document.getElementById('sc-title');
const scPills = document.getElementById('sc-pills');
const scIdx = document.getElementById('sc-idx');

let activeShowcaseIdx = 0;

function setShowcaseMeta(idx) {
  if (idx === activeShowcaseIdx) return;
  activeShowcaseIdx = idx;
  const item = SHOWCASE_SLIDES[idx];
  if (!item) return;

  scTitle.classList.add('is-swapping');
  window.setTimeout(() => {
    scTitle.textContent = item.title;
    scPills.innerHTML = item.pills.map((p) => `<span class="sc-pill">${p}</span>`).join('');
    scIdx.textContent = `0${idx + 1}`;
    scTitle.classList.remove('is-swapping');
  }, 140);
}

function updateShowcase(progress) {
  const p = clamp(progress, 0, 1);

  // Full-bleed vertical curtain reveals:
  // Slide 1 wipes up across p in [0.22..0.46]
  // Slide 2 wipes up across p in [0.58..0.82]
  const wipe1 = smoothstep(0.22, 0.46, p);
  const wipe2 = smoothstep(0.58, 0.82, p);

  if (scBgs[0]) {
    const s0 = 1.02 + p * 0.06;
    scBgs[0].querySelector('img').style.transform = `scale(${s0.toFixed(4)})`;
  }
  if (scBgs[1]) {
    const topPct = (1 - wipe1) * 100;
    scBgs[1].style.clipPath = `inset(${topPct.toFixed(2)}% 0% 0% 0%)`;
    const s1 = 1.12 - wipe1 * 0.08;
    scBgs[1].querySelector('img').style.transform = `scale(${s1.toFixed(4)})`;
  }
  if (scBgs[2]) {
    const topPct = (1 - wipe2) * 100;
    scBgs[2].style.clipPath = `inset(${topPct.toFixed(2)}% 0% 0% 0%)`;
    const s2 = 1.12 - wipe2 * 0.08;
    scBgs[2].querySelector('img').style.transform = `scale(${s2.toFixed(4)})`;
  }

  // Independent floating 3D inset cards gliding cleanly upward through center!
  const windows = [
    { enter: -0.05, hold0: 0.04, hold1: 0.24, exit: 0.40 },
    { enter: 0.24, hold0: 0.38, hold1: 0.60, exit: 0.74 },
    { enter: 0.60, hold0: 0.74, hold1: 0.96, exit: 1.08 },
  ];

  scInsets.forEach((card, i) => {
    const w = windows[i];
    let yPct = 110;
    let opacity = 0;
    let scale = 0.92;
    let rotX = 6;

    if (p < w.hold0) {
      const t = smoothstep(w.enter, w.hold0, p);
      yPct = (1 - t) * 95;
      opacity = t;
      scale = 0.93 + t * 0.07;
      rotX = (1 - t) * 6;
    } else if (p <= w.hold1) {
      const drift = (p - w.hold0) / Math.max(0.01, w.hold1 - w.hold0);
      yPct = -drift * 14;
      opacity = 1;
      scale = 1;
      rotX = 0;
    } else {
      const t = smoothstep(w.hold1, w.exit, p);
      yPct = -14 - t * 96;
      opacity = 1 - t;
      scale = 1 - t * 0.06;
      rotX = -t * 5;
    }

    card.style.opacity = clamp(opacity, 0, 1).toFixed(3);
    card.style.transform = `translate3d(0, ${yPct.toFixed(2)}%, 0) scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg)`;
  });

  const nextIdx = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
  setShowcaseMeta(nextIdx);
}

ScrollTrigger.create({
  trigger: scTrack,
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => updateShowcase(self.progress),
});
updateShowcase(0);

/* ============================================================================
   7. SECTION 4: WHITE DAYLIGHT + PALM SHADOWS + 4-STEP KINETIC ROLLER (00:11-00:18)
============================================================================ */

const expTrack = document.getElementById('experience');
const expSteps = Array.from(document.querySelectorAll('.exp-step'));
const expSlides = Array.from(document.querySelectorAll('.exp-slide'));
const expBullets = document.getElementById('exp-bullets');
let activeExpIdx = 0;

function setExperienceStep(idx) {
  if (idx === activeExpIdx && expSlides[idx]?.classList.contains('is-active')) return;
  activeExpIdx = idx;

  expSteps.forEach((btn, i) => {
    btn.classList.toggle('is-active', i === idx);
    btn.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });

  expSlides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === idx);
    slide.classList.toggle('is-past', i < idx);
  });

  const bullets = EXPERIENCE_PILLARS[idx] || EXPERIENCE_PILLARS[0];
  expBullets.style.opacity = '0.25';
  window.setTimeout(() => {
    expBullets.innerHTML = bullets.map((b) => `<span>${b}</span>`).join('');
    expBullets.style.opacity = '1';
  }, 120);
}

ScrollTrigger.create({
  trigger: expTrack,
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    const idx = clamp(Math.floor(self.progress * 4), 0, 3);
    setExperienceStep(idx);
  },
});

// Direct click jump on 01. 02. 03. 04. step indicators
expSteps.forEach((btn) => {
  btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.expStep);
    const maxS = Math.max(1, expTrack.offsetHeight - window.innerHeight);
    const targetY = expTrack.offsetTop + ((idx + 0.35) / 4) * maxS;
    lenis.scrollTo(targetY, { duration: 0.9 });
  });
});

/* ============================================================================
   8. SECTION 5: 3D HOVER TILT ON FROSTED-GLASS RESIDENCE CARDS
============================================================================ */

document.querySelectorAll('[data-tilt-card]').forEach((card) => {
  const media = card.querySelector('.res-media');
  if (!media) return;

  card.addEventListener('pointermove', (e) => {
    const rect = media.getBoundingClientRect();
    const nx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const ny = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    const rx = (0.5 - ny) * 8;
    const ry = (nx - 0.5) * 10;
    media.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    media.style.setProperty('--mx', `${(nx * 100).toFixed(1)}%`);
    media.style.setProperty('--my', `${(ny * 100).toFixed(1)}%`);
  });

  card.addEventListener('pointerleave', () => {
    media.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

// 3D Container-Scroll entrance on Section 6 Split Architectural Dossier Cards
document.querySelectorAll('.split-dossier-card').forEach((card) => {
  gsap.fromTo(
    card,
    { rotateX: 9, y: 48, scale: 0.96, opacity: 0.72 },
    {
      rotateX: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        end: 'top 38%',
        scrub: true,
      },
    }
  );
});

/* ============================================================================
   9. SECTION 9: CONSULTATION ATRIUM PARALLAX
============================================================================ */

gsap.fromTo(
  '#consult-bg-img',
  { yPercent: -6, scale: 1.08 },
  {
    yPercent: 6,
    scale: 1.02,
    ease: 'none',
    scrollTrigger: {
      trigger: '#consultation',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  }
);

gsap.fromTo(
  '#consult-card',
  { y: 34, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#consultation',
      start: 'top 76%',
      toggleActions: 'play none none reverse',
    },
  }
);

/* ============================================================================
   10. FAQ ACCORDION + SMOOTH ANCHORS + CONCIERGE MODAL
============================================================================ */

document.querySelectorAll('.faq-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

document.querySelectorAll('a[href^="#"], [data-scroll-to]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const sel = el.dataset.scrollTo || el.getAttribute('href');
    if (!sel || sel === '#' || el.hasAttribute('data-open-modal')) return;
    const target = document.querySelector(sel);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.15 });
  });
});

// Concierge Modal Logic
const modal = document.getElementById('concierge-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalForm = document.getElementById('concierge-form');
const modalProperty = document.getElementById('modal-property');
const modalStatus = document.getElementById('modal-status');

function openModal(headingText) {
  modalTitle.textContent = headingText || 'Request Private Access';
  modalStatus.textContent = '';

  // Auto-match sanctuary dropdown if heading names a property
  const lower = (headingText || '').toLowerCase();
  if (lower.includes('ubud')) modalProperty.selectedIndex = 0;
  else if (lower.includes('uluwatu')) modalProperty.selectedIndex = 1;
  else if (lower.includes('sumba')) modalProperty.selectedIndex = 2;

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

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(modalForm);
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').trim();
  const property = String(fd.get('property') || 'Nusa48 Sanctuary');
  if (!name || !email) {
    modalStatus.textContent = 'Please enter your full name and email address.';
    return;
  }
  modalStatus.textContent = `CONFIRMED // Private concierge dossier for ${property} queued for ${name} (${email}).`;
  modalForm.reset();
});

window.addEventListener('load', () => ScrollTrigger.refresh());
