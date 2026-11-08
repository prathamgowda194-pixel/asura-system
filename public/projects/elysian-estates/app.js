/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ELYSIAN // CONTEMPORARY MEDITERRANEAN RESIDENCES & SANCTUARY
 * Award-Winning Awwwards SOTD Interactive Motion & Video Scrub Engine
 * Synthesized from Opus 5.5 + blendi-remade/dioramas + juliobsz/skills + wheresryan22/anatomy
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ─── 1. LENIS MOMENTUM SCROLL ENGINE ────────────────────────────────────────
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2.0,
    });

    if (typeof gsap !== 'undefined' && gsap.ticker) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ─── 2. 60FPS CINEMA VIDEO SCROLL-SCRUB ENGINE ──────────────────────────────
  const video = document.getElementById('hero-scrub-video');
  const heroSection = document.getElementById('hero');
  const chapterBlocks = document.querySelectorAll('.hero-chapter-block');
  const chapterPills = document.querySelectorAll('.chapter-pill-btn');

  let videoDuration = 10.1;
  let targetTime = 0;
  let currentTime = 0;
  let isVideoReady = false;

  if (video) {
    const onMeta = () => {
      if (video.duration && !isNaN(video.duration)) {
        videoDuration = video.duration;
      }
      isVideoReady = true;
      video.pause();
    };

    if (video.readyState >= 1) {
      onMeta();
    } else {
      video.addEventListener('loadedmetadata', onMeta);
    }

    // Force unlock for scrubbing
    video.pause();
    video.currentTime = 0.001;
  }

  // Butter-Smooth Lerp Animation Loop for Video Scrubbing
  function updateVideoScrub() {
    if (video && isVideoReady) {
      currentTime += (targetTime - currentTime) * 0.12;
      if (Math.abs(currentTime - video.currentTime) > 0.015) {
        video.currentTime = Math.max(0, Math.min(videoDuration - 0.05, currentTime));
      }
    }
    requestAnimationFrame(updateVideoScrub);
  }
  requestAnimationFrame(updateVideoScrub);

  // Synchronize with GSAP ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined' && heroSection) {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        targetTime = progress * videoDuration;

        // Dynamic Chapter Switching
        let activeIdx = 0;
        if (progress < 0.25) activeIdx = 0;
        else if (progress < 0.55) activeIdx = 1;
        else if (progress < 0.80) activeIdx = 2;
        else activeIdx = 3;

        chapterBlocks.forEach((block, idx) => {
          block.classList.toggle('active', idx === activeIdx);
        });

        chapterPills.forEach((pill, idx) => {
          pill.classList.toggle('active', idx === activeIdx);
        });
      }
    });
  }

  // Chapter Pill Click Jumps
  chapterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const chapterIdx = parseInt(pill.getAttribute('data-chapter'), 10);
      const targetProgress = [0.05, 0.38, 0.68, 0.92][chapterIdx] || 0;

      if (heroSection) {
        const scrollRange = heroSection.offsetHeight - window.innerHeight;
        const targetScrollY = heroSection.offsetTop + scrollRange * targetProgress;

        if (lenis) {
          lenis.scrollTo(targetScrollY, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        }
      }
    });
  });

  // ─── 3. TACTILE TIME OF DAY LIGHTING STATE MACHINE ──────────────────────────
  const timeButtons = document.querySelectorAll('.time-btn');
  const ambientWash = document.getElementById('ambient-wash');
  const solarTag = document.getElementById('telemetry-solar-tag');

  const LIGHT_MODES = {
    noon: {
      filterClass: 'lighting-noon',
      solarText: 'SOLAR HARVEST: 52.4 kW // LUX: 112,000 // PEAK NOON',
      washStyle: 'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)'
    },
    golden: {
      filterClass: 'lighting-golden',
      solarText: 'SOLAR HARVEST: 48.6 kW // LUX: 84,200 // 17:30 AZIMUTH',
      washStyle: 'radial-gradient(circle at 10% 15%, rgba(245, 158, 11, 0.08) 0%, transparent 50%), radial-gradient(circle at 90% 85%, rgba(212, 175, 55, 0.06) 0%, transparent 50%)'
    },
    twilight: {
      filterClass: 'lighting-twilight',
      solarText: 'BATTERY LFP DISCHARGE // LUX: 140 // CELESTIAL TWILIGHT',
      washStyle: 'radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.07) 0%, transparent 65%)'
    }
  };

  function setLightingState(modeKey) {
    const mode = LIGHT_MODES[modeKey];
    if (!mode) return;

    timeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-time') === modeKey);
    });

    if (video) {
      video.className = `hero-video-media ${mode.filterClass}`;
    }

    if (ambientWash) {
      ambientWash.style.background = mode.washStyle;
    }

    if (solarTag) {
      solarTag.textContent = mode.solarText;
    }
  }

  timeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modeKey = btn.getAttribute('data-time');
      setLightingState(modeKey);
    });
  });

  // ─── 4. AUTHENTIC CAD BLUEPRINT & STRUCTURAL ANATOMY ENGINE ─────────────────
  const CAD_SPECS = {
    5: {
      tag: 'STRATUM 05 // SOLAR MICROGRID & POOLS',
      title: 'Solar Microgrid & Infinity Hydraulics',
      specs: [
        { name: 'Energy Generation', val: '48.6 kW / Daily Yield' },
        { name: 'Battery Storage', val: '120 kWh LFP Bank' },
        { name: 'Pool Cantilever Span', val: '6.5m Glass Bottom' },
        { name: 'Water Filtration', val: 'Titanium UV-Ozone' }
      ],
      note: 'Dual infinity basins operate via silent magnetic levitation pumps, recovering 98% of thermal backwash into the radiant flooring circuit.'
    },
    4: {
      tag: 'STRATUM 04 // FAÇADE & ACOUSTIC SHIELD',
      title: 'Acoustic Curtain Glazing',
      specs: [
        { name: 'Glazing Type', val: 'Starphire Triple-Pane' },
        { name: 'Sound Attenuation', val: '48 dB Ambient Cut' },
        { name: 'U-Value Rating', val: '0.64 W/m²K' },
        { name: 'UV Protection', val: '99.8% Solar Block' }
      ],
      note: 'Custom extruded bronze mullions contain internal thermal breaks, completely isolating Mediterranean coastal wind resonance.'
    },
    3: {
      tag: 'STRATUM 03 // SANCTUARY LIVING QUARTERS',
      title: 'Double-Height Sanctuary Interiors',
      specs: [
        { name: 'Interior Volume', val: '8,400 Heated Sq.Ft' },
        { name: 'Ceiling Clearance', val: '6.8 Meters Monolithic' },
        { name: 'Acoustic Cladding', val: 'Roman Fluted Travertine' },
        { name: 'Air Exchange', val: 'Medical HEPA-14 Clean' }
      ],
      note: 'Continuous open sightlines unite living gallery, sunken hearth, and marine horizons without internal load-bearing partitions.'
    },
    2: {
      tag: 'STRATUM 02 // CANTILEVER ENGINEERING',
      title: 'Post-Tensioned Monolith Slab',
      specs: [
        { name: 'Cantilever Span', val: '14.2 Meters Overhang' },
        { name: 'Rebar Specification', val: 'Grade 75 High-Tensile' },
        { name: 'Concrete Mix', val: 'Carbon-Cured Ultra-Dense' },
        { name: 'Safety Factor', val: '3.8x Above Seismic Code' }
      ],
      note: 'Internally tensioned steel tendons balance the 14-meter overhang, allowing the primary master wing to float effortlessly over the promontory.'
    },
    1: {
      tag: 'STRATUM 01 // SUB-STRUCTURE & BEDROCK',
      title: 'Granite Bedrock Caissons',
      specs: [
        { name: 'Bedrock Embedment', val: '18.5 Meters Deep' },
        { name: 'Foundation Plinth', val: 'Obsidian Basalt Slab' },
        { name: 'Seismic Dampening', val: 'Base Elastomeric Bearings' },
        { name: 'Geothermal Bores', val: '8 Closed-Loop Wells' }
      ],
      note: 'Anchored directly into monolithic granodiorite rock, eliminating soil settlement risks and supplying 100% of subterranean thermal heating.'
    }
  };

  const layerButtons = document.querySelectorAll('.layer-select-btn');
  const inspectorTag = document.getElementById('inspector-tag');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorSpecs = document.getElementById('inspector-specs');
  const inspectorNote = document.getElementById('inspector-note');

  function setCadLayer(layerNum) {
    layerButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-layer') === String(layerNum));
    });

    // Highlight SVG Layer
    document.querySelectorAll('.cad-layer-group').forEach((g) => {
      g.classList.remove('highlighted');
    });
    const activeSvg = document.getElementById(`cad-layer-${layerNum}`);
    if (activeSvg) activeSvg.classList.add('highlighted');

    // Update Inspector Data Card
    const data = CAD_SPECS[layerNum];
    if (data && inspectorTag && inspectorTitle && inspectorSpecs && inspectorNote) {
      inspectorTag.textContent = data.tag;
      inspectorTitle.textContent = data.title;
      inspectorNote.textContent = data.note;

      inspectorSpecs.innerHTML = data.specs
        .map(
          (s) => `
        <div class="inspector-spec-row">
          <span class="inspector-spec-name">${s.name}</span>
          <span class="inspector-spec-value">${s.val}</span>
        </div>
      `
        )
        .join('');
    }
  }

  layerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const num = parseInt(btn.getAttribute('data-layer'), 10);
      setCadLayer(num);
    });
  });

  for (let l = 1; l <= 5; l++) {
    const el = document.getElementById(`cad-layer-${l}`);
    if (el) el.addEventListener('click', () => setCadLayer(l));
  }

  // ─── 5. PORTA STUDIO EXPANDING MACRO SPACES STRIPS ──────────────────────────
  const spaceRows = document.querySelectorAll('.space-expand-row');
  spaceRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      spaceRows.forEach((r) => r.classList.remove('expanded'));
      row.classList.add('expanded');
    });
  });

  // ─── 6. 3D PERSPECTIVE CARD TILT & SPECULAR GLARE ───────────────────────────
  const tiltCards = document.querySelectorAll('.residence-tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ─── 7. NAVIGATION BAR SCROLL STATE ─────────────────────────────────────────
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // ─── 8. PRIVATE TREATY MODAL DISPATCH ───────────────────────────────────────
  const treatyForm = document.getElementById('treaty-form');
  const treatyModal = document.getElementById('treaty-modal');
  const btnCloseModal = document.getElementById('btn-close-treaty-modal');
  const txCodeEl = document.getElementById('treaty-tx-code');

  if (treatyForm && treatyModal && btnCloseModal) {
    treatyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = 'TX-ELYSIAN-' + Math.floor(1000 + Math.random() * 9000) + '-VERIFIED';
      if (txCodeEl) txCodeEl.textContent = code;
      treatyModal.classList.add('open');
    });

    btnCloseModal.addEventListener('click', () => {
      treatyModal.classList.remove('open');
      treatyForm.reset();
    });

    treatyModal.addEventListener('click', (e) => {
      if (e.target === treatyModal) {
        treatyModal.classList.remove('open');
      }
    });
  }

  console.log('ELYSIAN 60FPS Cinema Scrub & Architectural SOTD Engine Operational');
})();
