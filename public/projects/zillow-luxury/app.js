/**
 * ZILLOW LUXURY // MODERN ARCHITECTURAL REAL ESTATE
 * Interactive 3D Spatial Engine & Smart HUD Telemetry
 * Video-Scrubbed 60fps Drone & Sunset Time-lapse System
 * Crafted for Iris Ethos // Asura System Production
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. LENIS SMOOTH MOMENTUM INERTIA & GSAP SCROLLTRIGGER SYNC
  // ===================================================================
  let lenisInstance = null;

  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      try {
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 1.5
        });

        function lenisRaf(time) {
          if (lenisInstance) lenisInstance.raf(time);
          requestAnimationFrame(lenisRaf);
        }
        requestAnimationFrame(lenisRaf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
          lenisInstance.on('scroll', ScrollTrigger.update);
          gsap.ticker.add((time) => {
            if (lenisInstance) lenisInstance.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(0);
        }
      } catch (err) {
        console.warn('Lenis momentum engine fallback to native scroll:', err);
      }
    }
  }

  // ===================================================================
  // 2. CUSTOM GLOWING CURSOR FOLLOWER
  // ===================================================================
  const cursorFollower = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    if (cursorFollower) {
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Expand cursor on interactive triggers
  const interactiveElements = 'a, button, input, select, .property-3d-card, .accordion-row-header, .hud-beacon-node';
  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorFollower && cursorFollower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorFollower && cursorFollower.classList.remove('hovering'));
  });

  // ===================================================================
  // 3. HEADER GLASS STATE MACHINE ON SCROLL
  // ===================================================================
  const siteHeader = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader && siteHeader.classList.add('scrolled');
    } else {
      siteHeader && siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===================================================================
  // 4. SECTION 1: HERO PINNED 3D VILLA VIDEO SCRUB & KNOCKOUT TEXT
  // ===================================================================
  const heroSection = document.getElementById('hero-section');
  const heroVideo = document.getElementById('hero-scrub-video');
  const heroKnockout = document.getElementById('hero-knockout-text');
  const heroCutout = document.getElementById('hero-cutout-layer');
  const heroTimeCounter = document.getElementById('hero-time-counter');

  if (heroVideo && heroSection) {
    // Prohibit autoplay: strictly pause on frame 0
    heroVideo.pause();
    heroVideo.currentTime = 0;

    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.pause();
      heroVideo.currentTime = 0;
    });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#hero-section',
        start: 'top top',
        end: '+=130%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Deterministic 60fps frame scrubbing
          if (heroVideo.duration) {
            heroVideo.currentTime = p * (heroVideo.duration - 0.04);
          }

          // Refined subtle parallax and atmospheric fade on scroll
          if (heroKnockout) {
            const translateY = -p * 60;
            const opacity = Math.max(0, 1 - p * 2.2);
            heroKnockout.style.transform = `translateX(-50%) translateY(${translateY.toFixed(1)}px)`;
            heroKnockout.style.opacity = opacity.toFixed(3);
          }

          // Cutout layer maintains 100% solid occlusion of the building
          if (heroCutout) {
            heroCutout.style.opacity = '1';
          }

          // Update telemetry time counter
          if (heroTimeCounter) {
            heroTimeCounter.textContent = (p * 10).toFixed(2) + 's';
          }
        }
      });
    }
  }

  // ===================================================================
  // 5. SECTION 2: 3D CARD STACK SCROLL FAN-OUT & ZERO-GLITCH HOVER
  // ===================================================================
  const recomSection = document.getElementById('recommendations-section');
  const propertyCards = document.querySelectorAll('.property-3d-card');
  const recomTitleLines = document.querySelectorAll('.recom-line');

  if (typeof ScrollTrigger !== 'undefined' && recomSection) {
    ScrollTrigger.create({
      trigger: '#recommendations-section',
      start: 'top 85%',
      end: 'top 20%',
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        // Fan out the 4 property cards in 3D perspective smoothly
        const fanFactor = Math.min(1, Math.max(0, p * 1.25));
        propertyCards.forEach((card, idx) => {
          if (idx === 0) {
            card.style.setProperty('--base-x', '0px');
            card.style.setProperty('--base-y', '0px');
            card.style.setProperty('--base-z', `${(80 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-rot-z', `${(-2 * fanFactor).toFixed(1)}deg`);
            card.style.setProperty('--base-rot-y', `${(-4 * fanFactor).toFixed(1)}deg`);
          } else if (idx === 1) {
            card.style.setProperty('--base-x', `${(80 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-y', `${(-50 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-z', `${(20 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-rot-z', `${(6 * fanFactor).toFixed(1)}deg`);
            card.style.setProperty('--base-rot-y', `${(8 * fanFactor).toFixed(1)}deg`);
          } else if (idx === 2) {
            card.style.setProperty('--base-x', `${(40 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-y', `${(-100 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-z', `${(-40 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-rot-z', `${(-8 * fanFactor).toFixed(1)}deg`);
            card.style.setProperty('--base-rot-y', `${(-10 * fanFactor).toFixed(1)}deg`);
          } else if (idx === 3) {
            card.style.setProperty('--base-x', `${(120 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-y', `${(-150 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-z', `${(-90 * fanFactor).toFixed(1)}px`);
            card.style.setProperty('--base-rot-z', `${(12 * fanFactor).toFixed(1)}deg`);
            card.style.setProperty('--base-rot-y', `${(14 * fanFactor).toFixed(1)}deg`);
          }
        });

        // Kinetic line reveal
        recomTitleLines.forEach((line, index) => {
          const threshold = 0.06 + index * 0.12;
          if (p >= threshold) {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          } else {
            line.style.opacity = '0.35';
            line.style.transform = 'translateY(8px)';
          }
        });
      }
    });
  }

  // Card click elevates clicked card to front
  propertyCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-heart-btn')) return;

      propertyCards.forEach((c) => c.classList.remove('active-top'));
      card.classList.add('active-top');

      propertyCards.forEach((c) => {
        c.style.zIndex = '1';
      });
      card.style.zIndex = '10';
    });
  });

  // Favorite Heart Button Toggle
  document.querySelectorAll('.card-heart-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');
    });
  });

  // Location Search & Filter Chips
  const searchInput = document.getElementById('recom-search-input');
  const filterChips = document.querySelectorAll('.quick-chip');

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.getAttribute('data-chip');
      if (searchInput && val !== 'all') {
        searchInput.value = chip.textContent;
      } else if (searchInput) {
        searchInput.value = '';
      }
    });
  });

  // ===================================================================
  // 6. SECTION 3: DARK EDITORIAL KINETIC TYPOGRAPHY ROWS
  // ===================================================================
  const kineticRows = document.querySelectorAll('.kinetic-row');

  kineticRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      kineticRows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });

    row.addEventListener('click', (e) => {
      if (e.target.closest('.kinetic-cta-btn') || e.target.closest('.kinetic-action-tag')) {
        openTourModal();
      }
    });
  });

  // ===================================================================
  // 7. SECTION 4: SUNSET A-FRAME PINNED VIDEO SCRUB & SMART HUD
  // ===================================================================
  const hudSection = document.getElementById('hud-section');
  const hudVideo = document.getElementById('hud-scrub-video');
  const hudTimePhase = document.getElementById('hud-time-phase');
  const hudSkyDot = document.getElementById('hud-sky-dot');
  const hudTimeProgress = document.getElementById('hud-time-progress');

  const hudCards = [
    document.getElementById('card-hvac'),
    document.getElementById('card-solar'),
    document.getElementById('card-lighting')
  ];

  // SVG Connector Lines
  const hudSvgCanvas = document.getElementById('hud-svg-canvas');
  const hudLine1 = document.getElementById('hud-line-1');
  const hudLine2 = document.getElementById('hud-line-2');
  const hudLine3 = document.getElementById('hud-line-3');
  const beacon1 = document.getElementById('beacon-1');
  const beacon2 = document.getElementById('beacon-2');
  const beacon3 = document.getElementById('beacon-3');

  function updateSvgConnectors() {
    if (!hudSvgCanvas) return;
    const canvasRect = hudSvgCanvas.getBoundingClientRect();

    function connect(line, beacon, card) {
      if (!line || !beacon || !card) return;
      const bRect = beacon.getBoundingClientRect();
      const cRect = card.getBoundingClientRect();

      const x1 = bRect.left + bRect.width / 2 - canvasRect.left;
      const y1 = bRect.top + bRect.height / 2 - canvasRect.top;
      const x2 = cRect.left + cRect.width / 2 - canvasRect.left;
      const y2 = cRect.top + cRect.height / 2 - canvasRect.top;

      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
    }

    connect(hudLine1, beacon1, hudCards[0]);
    connect(hudLine2, beacon2, hudCards[1]);
    connect(hudLine3, beacon3, hudCards[2]);
  }

  window.addEventListener('resize', updateSvgConnectors);

  if (hudVideo && hudSection) {
    // Prohibit autoplay: strictly pause on frame 0
    hudVideo.pause();
    hudVideo.currentTime = 0;

    hudVideo.addEventListener('loadedmetadata', () => {
      hudVideo.pause();
      hudVideo.currentTime = 0;
    });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#hud-section',
        start: 'top top',
        end: '+=130%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Deterministic frame scrubbing
          if (hudVideo.duration) {
            hudVideo.currentTime = p * (hudVideo.duration - 0.04);
          }

          // Architectural time telemetry update
          if (hudTimePhase && hudSkyDot) {
            if (p < 0.35) {
              hudTimePhase.textContent = 'DAYLIGHT 16:30';
              hudSkyDot.style.background = '#f59e0b';
              hudSkyDot.style.boxShadow = '0 0 10px #f59e0b';
            } else if (p < 0.70) {
              hudTimePhase.textContent = 'GOLDEN HOUR 18:45';
              hudSkyDot.style.background = '#f97316';
              hudSkyDot.style.boxShadow = '0 0 10px #f97316';
            } else {
              hudTimePhase.textContent = 'ALPINE TWILIGHT 21:15';
              hudSkyDot.style.background = '#38bdf8';
              hudSkyDot.style.boxShadow = '0 0 10px #38bdf8';
            }
          }

          if (hudTimeProgress) {
            hudTimeProgress.textContent = `${(p * 10).toFixed(2)}s / 10.0s`;
          }

          // Staggered HUD Card reveals with smooth zoom & fade
          if (hudCards[0]) {
            if (p >= 0.10) {
              hudCards[0].style.opacity = '1';
              hudCards[0].style.transform = 'scale(1) translateY(0)';
              hudCards[0].style.pointerEvents = 'auto';
            } else {
              hudCards[0].style.opacity = '0';
              hudCards[0].style.transform = 'scale(0.85) translateY(15px)';
              hudCards[0].style.pointerEvents = 'none';
            }
          }

          if (hudCards[1]) {
            if (p >= 0.32) {
              hudCards[1].style.opacity = '1';
              hudCards[1].style.transform = 'scale(1) translateY(0)';
              hudCards[1].style.pointerEvents = 'auto';
            } else {
              hudCards[1].style.opacity = '0';
              hudCards[1].style.transform = 'scale(0.85) translateY(15px)';
              hudCards[1].style.pointerEvents = 'none';
            }
          }

          if (hudCards[2]) {
            if (p >= 0.55) {
              hudCards[2].style.opacity = '1';
              hudCards[2].style.transform = 'scale(1) translateY(0)';
              hudCards[2].style.pointerEvents = 'auto';
            } else {
              hudCards[2].style.opacity = '0';
              hudCards[2].style.transform = 'scale(0.85) translateY(15px)';
              hudCards[2].style.pointerEvents = 'none';
            }
          }

          updateSvgConnectors();
        }
      });
    }
  }

  // Interactive HUD Sliders
  const tempSlider = document.getElementById('temp-slider');
  const tempDisplay = document.getElementById('hud-temp-display');
  if (tempSlider && tempDisplay) {
    tempSlider.addEventListener('input', (e) => {
      tempDisplay.textContent = `${e.target.value}.0°C`;
    });
  }

  const lumensSlider = document.getElementById('lumens-slider');
  const lumensDisplay = document.getElementById('hud-lumens-display');
  if (lumensSlider && lumensDisplay) {
    lumensSlider.addEventListener('input', (e) => {
      const val = Math.round((e.target.value / 100) * 1000);
      lumensDisplay.textContent = `${val} lm`;
    });
  }

  // ===================================================================
  // 8. PRIVATE TOUR BOOKING MODAL
  // ===================================================================
  const modalBackdrop = document.getElementById('tour-modal-backdrop');
  const modalSheet = document.getElementById('tour-modal-sheet');
  const modalClose = document.getElementById('modal-close-btn');
  const headerCta = document.getElementById('header-cta-btn');

  function openTourModal() {
    modalBackdrop && modalBackdrop.classList.add('open');
    modalSheet && modalSheet.classList.add('open');
  }

  function closeTourModal() {
    modalBackdrop && modalBackdrop.classList.remove('open');
    modalSheet && modalSheet.classList.remove('open');
  }

  if (headerCta) headerCta.addEventListener('click', openTourModal);
  if (modalClose) modalClose.addEventListener('click', closeTourModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeTourModal);

  // Initialize smooth momentum engine on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    initLenis();
    updateSvgConnectors();
  });

})();
