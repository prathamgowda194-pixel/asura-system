/**
 * ZILLOW LUXURY // MODERN ARCHITECTURAL REAL ESTATE
 * Interactive 3D Spatial Engine & Smart HUD Telemetry
 * Crafted for Iris Ethos // Asura System
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
          duration: 1.25,
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
  // 4. HERO SECTION 3D VILLA PERSPECTIVE TILT
  // ===================================================================
  const heroStage = document.getElementById('hero-villa-stage');
  const heroCard = document.getElementById('hero-villa-card');
  const heroKnockout = document.getElementById('hero-knockout-text');

  if (heroStage && heroCard) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotY = x * 14;
      const rotX = -y * 10;
      heroCard.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translateZ(20px)`;
      if (heroKnockout) {
        heroKnockout.style.transform = `translateX(calc(-50% + ${(-x * 25).toFixed(1)}px)) translateY(${(-y * 15).toFixed(1)}px)`;
      }
    });

    heroStage.addEventListener('mouseleave', () => {
      heroCard.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0px)`;
      if (heroKnockout) {
        heroKnockout.style.transform = `translateX(-50%) translateY(0px)`;
      }
    });
  }

  // ===================================================================
  // 5. SECTION 2: 3D CARD STACK INTERACTION & FILTERS
  // ===================================================================
  const cardStackRig = document.getElementById('cards-3d-stack-rig');
  const propertyCards = document.querySelectorAll('.property-3d-card');

  // Mouse tilt over 3D card stack
  if (cardStackRig) {
    cardStackRig.addEventListener('mousemove', (e) => {
      const rect = cardStackRig.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      propertyCards.forEach((card, idx) => {
        const factor = (4 - idx) * 0.4;
        const currentRotZ = idx === 0 ? -2 : idx === 1 ? 6 : idx === 2 ? -8 : 12;
        card.style.transform = `rotateZ(${currentRotZ}deg) rotateY(${(x * 16 * factor).toFixed(1)}deg) rotateX(${(-y * 14 * factor).toFixed(1)}deg)`;
      });
    });

    cardStackRig.addEventListener('mouseleave', () => {
      propertyCards.forEach((card, idx) => {
        card.style.transform = '';
      });
    });
  }

  // Card click elevates clicked card to front
  propertyCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-heart-btn')) return; // don't reorder if clicking heart

      propertyCards.forEach((c) => c.classList.remove('active-top'));
      card.classList.add('active-top');

      // Elevate clicked card
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
  // 6. SECTION 3: EDITORIAL EXPANDING ACCORDION
  // ===================================================================
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-row-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      accordionItems.forEach((other) => {
        other.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Check Availability Buttons open Tour Modal
  const modalBackdrop = document.getElementById('tour-modal-backdrop');
  const modalSheet = document.getElementById('tour-modal-sheet');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const propSelectInput = document.getElementById('tour-prop-select');

  function openTourModal(propertyName) {
    if (propSelectInput && propertyName) {
      propSelectInput.value = propertyName;
    }
    if (modalBackdrop) modalBackdrop.classList.add('open');
    if (modalSheet) modalSheet.classList.add('open');
  }

  function closeTourModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    if (modalSheet) modalSheet.classList.remove('open');
  }

  document.querySelectorAll('.btn-check-availability').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-target') || 'Luxury Villa';
      openTourModal(target);
    });
  });

  const getStartedBtn = document.getElementById('btn-get-started');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      openTourModal('Private Client Architectural Consultation');
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeTourModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeTourModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTourModal();
  });

  // ===================================================================
  // 7. SECTION 4: SMART HUD TELEMETRY & SVG DYNAMIC LINES
  // ===================================================================
  const hudSvgCanvas = document.getElementById('hud-svg-canvas');
  const hudSection = document.getElementById('hud-section');

  const beacon1 = document.getElementById('beacon-1');
  const card1 = document.getElementById('card-hvac');
  const line1 = document.getElementById('hud-line-1');

  const beacon2 = document.getElementById('beacon-2');
  const card2 = document.getElementById('card-solar');
  const line2 = document.getElementById('hud-line-2');

  const beacon3 = document.getElementById('beacon-3');
  const card3 = document.getElementById('card-light');
  const line3 = document.getElementById('hud-line-3');

  function updateHudSvgLines() {
    if (!hudSection || !hudSvgCanvas) return;
    const secRect = hudSection.getBoundingClientRect();

    function connect(beacon, card, line) {
      if (!beacon || !card || !line) return;
      const bRect = beacon.getBoundingClientRect();
      const cRect = card.getBoundingClientRect();

      const bx = (bRect.left + bRect.width / 2) - secRect.left;
      const by = (bRect.top + bRect.height / 2) - secRect.top;

      // Connect to closest edge of card
      let cx = (cRect.left + cRect.width / 2) - secRect.left;
      let cy = (cRect.top + cRect.height / 2) - secRect.top;

      if (bx < cx) {
        cx = cRect.left - secRect.left;
      } else {
        cx = cRect.right - secRect.left;
      }

      line.setAttribute('x1', bx);
      line.setAttribute('y1', by);
      line.setAttribute('x2', cx);
      line.setAttribute('y2', cy);
    }

    connect(beacon1, card1, line1);
    connect(beacon2, card2, line2);
    connect(beacon3, card3, line3);
  }

  window.addEventListener('resize', updateHudSvgLines);
  window.addEventListener('scroll', updateHudSvgLines, { passive: true });
  setTimeout(updateHudSvgLines, 300);

  // Interactive Sliders in HUD Cards
  const tempSlider = document.getElementById('temp-slider');
  const tempDisplay = document.getElementById('hud-temp-display');
  if (tempSlider && tempDisplay) {
    tempSlider.addEventListener('input', (e) => {
      tempDisplay.textContent = `${e.target.value}.5°C`;
    });
  }

  const lumensSlider = document.getElementById('lumens-slider');
  const lumensDisplay = document.getElementById('hud-lumens-display');
  const bulbSvg = document.getElementById('hud-bulb-svg');
  if (lumensSlider && lumensDisplay) {
    lumensSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      lumensDisplay.textContent = `${Math.round(val * 10)} lm`;
      if (bulbSvg) {
        bulbSvg.style.opacity = Math.max(0.3, val / 100).toString();
        bulbSvg.style.filter = `drop-shadow(0 0 ${val / 8}px #fbbf24)`;
      }
    });
  }

  // Beacon hover pulses card
  [
    { b: beacon1, c: card1 },
    { b: beacon2, c: card2 },
    { b: beacon3, c: card3 }
  ].forEach(({ b, c }) => {
    if (b && c) {
      b.addEventListener('mouseenter', () => {
        c.style.transform = 'translateY(-6px) scale(1.05)';
        c.style.borderColor = 'var(--accent-cyan)';
      });
      b.addEventListener('mouseleave', () => {
        c.style.transform = '';
        c.style.borderColor = '';
      });
    }
  });

  // ===================================================================
  // 8. BOOT SEQUENCE
  // ===================================================================
  initLenis();
  updateHudSvgLines();
  console.log('Zillow Luxury // Architectural Spatial Real Estate Engine Booted.');

})();
