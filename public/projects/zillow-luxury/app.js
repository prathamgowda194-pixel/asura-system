/**
 * ZILLOW LUXURY // MODERN ARCHITECTURAL REAL ESTATE
 * Interactive 3D Spatial Engine & Smart HUD Telemetry
 * Video-Scrubbed 60fps Drone & Sunset Time-lapse System
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
  const interactiveElements = 'a, button, input, select, .property-3d-card, .accordion-row-header, .hud-beacon-node, .hero-video-play-btn, .hud-scrub-mode-btn';
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
  // 4. HERO SECTION FULLSCREEN VIDEO SCRUB & 3D PARALLAX
  // ===================================================================
  const heroSection = document.getElementById('hero-section');
  const heroKnockout = document.getElementById('hero-knockout-text');
  const heroCutout = document.getElementById('hero-cutout-layer');
  const heroVideo = document.getElementById('hero-scrub-video');
  const heroTimeCounter = document.getElementById('hero-time-counter');
  const heroPlayToggle = document.getElementById('hero-play-toggle');
  const heroPlayLabel = document.getElementById('hero-play-label');

  let isHeroAutoPlaying = false;

  if (heroVideo) {
    // Scroll-driven Scrubbing with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          if (!isHeroAutoPlaying && heroVideo.duration) {
            heroVideo.currentTime = self.progress * (heroVideo.duration - 0.05);
            if (heroTimeCounter) {
              heroTimeCounter.textContent = `${heroVideo.currentTime.toFixed(2)}s`;
            }
          }
        }
      });
    }

    // Toggle 3D Walkthrough Autoplay vs. Scroll Scrub
    if (heroPlayToggle) {
      heroPlayToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isHeroAutoPlaying) {
          heroVideo.pause();
          isHeroAutoPlaying = false;
          if (heroPlayLabel) heroPlayLabel.textContent = '3D Walkthrough';
          heroPlayToggle.classList.remove('playing');
        } else {
          heroVideo.play().then(() => {
            isHeroAutoPlaying = true;
            if (heroPlayLabel) heroPlayLabel.textContent = 'Pause Walkthrough';
            heroPlayToggle.classList.add('playing');
          }).catch((err) => {
            console.warn('Autoplay restricted by browser:', err);
          });
        }
      });
    }

    heroVideo.addEventListener('ended', () => {
      isHeroAutoPlaying = false;
      if (heroPlayLabel) heroPlayLabel.textContent = '3D Walkthrough';
      if (heroPlayToggle) heroPlayToggle.classList.remove('playing');
    });

    heroVideo.addEventListener('timeupdate', () => {
      if (isHeroAutoPlaying && heroTimeCounter) {
        heroTimeCounter.textContent = `${heroVideo.currentTime.toFixed(2)}s`;
      }
    });
  }

  // 3D Mouse Parallax between Knockout Text (back) and Cutout Building (front)
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (heroKnockout) {
        heroKnockout.style.transform = `translateX(calc(-50% + ${(-x * 24).toFixed(1)}px)) translateY(${(-y * 14).toFixed(1)}px)`;
      }
      if (heroCutout) {
        heroCutout.style.transform = `translateX(${(x * 8).toFixed(1)}px) translateY(${(y * 6).toFixed(1)}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (heroKnockout) heroKnockout.style.transform = 'translateX(-50%) translateY(0px)';
      if (heroCutout) heroCutout.style.transform = 'translateX(0px) translateY(0px)';
    });
  }

  // ===================================================================
  // 5. SECTION 2: 3D CARD STACK INTERACTION & FILTERS (GLITCH-FREE)
  // ===================================================================
  const propertyCards = document.querySelectorAll('.property-3d-card');

  // Elevate clicked card smoothly
  propertyCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-heart-btn')) return;
      propertyCards.forEach((c) => c.classList.remove('active-top'));
      card.classList.add('active-top');
    });
  });

  // Heart toggle
  document.querySelectorAll('.card-heart-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');
    });
  });

  // Search input filter
  const searchInput = document.getElementById('recom-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      propertyCards.forEach((card) => {
        const addr = card.querySelector('.card-address')?.textContent.toLowerCase() || '';
        const price = card.querySelector('.card-price')?.textContent.toLowerCase() || '';
        if (!query || addr.includes(query) || price.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Quick chips filter
  const quickChips = document.querySelectorAll('.quick-chip');
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      quickChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.getAttribute('data-chip').toLowerCase();
      propertyCards.forEach((card) => {
        const addr = card.querySelector('.card-address')?.textContent.toLowerCase() || '';
        if (val === 'all' || addr.includes(val)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
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
    btn.addEventListener('click', () => {
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
  // 7. SECTION 4: SUNSET A-FRAME VIDEO SCRUB & SMART HUD TELEMETRY
  // ===================================================================
  const hudSvgCanvas = document.getElementById('hud-svg-canvas');
  const hudSection = document.getElementById('hud-section');
  const hudContainer = document.getElementById('hud-bg-container');
  const hudVideo = document.getElementById('hud-scrub-video');
  const hudTimeProgress = document.getElementById('hud-time-progress');
  const hudTimePhase = document.getElementById('hud-time-phase');
  const hudTimeTelemetry = document.getElementById('hud-time-telemetry');
  const hudModeToggle = document.getElementById('hud-mode-toggle');
  const hudModeLabel = document.getElementById('hud-mode-label');

  const beacon1 = document.getElementById('beacon-1');
  const card1 = document.getElementById('card-hvac');
  const line1 = document.getElementById('hud-line-1');

  const beacon2 = document.getElementById('beacon-2');
  const card2 = document.getElementById('card-solar');
  const line2 = document.getElementById('hud-line-2');

  const beacon3 = document.getElementById('beacon-3');
  const card3 = document.getElementById('card-light');
  const line3 = document.getElementById('hud-line-3');

  let targetHudTime = 0;
  let currentHudTime = 0;

  if (hudVideo) {
    hudVideo.addEventListener('loadeddata', () => {
      if (hudContainer) hudContainer.classList.add('video-ready');
    });
    hudVideo.addEventListener('canplay', () => {
      if (hudContainer) hudContainer.classList.add('video-ready');
    });

    if (typeof ScrollTrigger !== 'undefined' && hudSection) {
      ScrollTrigger.create({
        trigger: '#hud-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
        onUpdate: (self) => {
          if (hudVideo.duration) {
            targetHudTime = self.progress * (hudVideo.duration - 0.05);
          }
          updateHudSvgLines();
        }
      });
    }

    if (hudModeToggle) {
      let phaseStep = 0;
      const presets = [
        { time: 0.1, label: 'Daylight 16:30' },
        { time: 4.8, label: 'Sunset 18:45' },
        { time: 9.6, label: 'Night Sky 21:15' }
      ];
      hudModeToggle.addEventListener('click', () => {
        phaseStep = (phaseStep + 1) % presets.length;
        targetHudTime = presets[phaseStep].time;
        if (hudModeLabel) hudModeLabel.textContent = presets[phaseStep].label;
      });
    }
  }

  function updateHudPhase(time) {
    if (hudTimeProgress) {
      hudTimeProgress.textContent = `${time.toFixed(2)}s / 10.0s`;
    }

    if (!hudTimePhase || !hudTimeTelemetry) return;

    if (time < 2.5) {
      hudTimePhase.textContent = 'DAYLIGHT 16:30';
      hudTimeTelemetry.classList.remove('night');
    } else if (time >= 2.5 && time < 6.0) {
      hudTimePhase.textContent = 'GOLDEN HOUR 18:45';
      hudTimeTelemetry.classList.remove('night');
    } else if (time >= 6.0 && time < 8.2) {
      hudTimePhase.textContent = 'TWILIGHT DUSK 19:50';
      hudTimeTelemetry.classList.add('night');
    } else {
      hudTimePhase.textContent = 'ALPINE NIGHT 21:15';
      hudTimeTelemetry.classList.add('night');
    }
  }

  function updateHudSvgLines() {
    if (!hudSection || !hudSvgCanvas) return;
    const secRect = hudSection.getBoundingClientRect();

    function connect(beacon, card, line) {
      if (!beacon || !card || !line) return;
      const bRect = beacon.getBoundingClientRect();
      const cRect = card.getBoundingClientRect();

      const bx = (bRect.left + bRect.width / 2) - secRect.left;
      const by = (bRect.top + bRect.height / 2) - secRect.top;

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
  // 8. GSAP TICKER 60FPS FLOATING-POINT LERP VIDEO ENGINE
  // ===================================================================
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add(() => {
      // 1. Hero Villa Video Lerp Seeking
      if (heroVideo && heroVideo.duration && !isHeroAutoPlaying) {
        const diff = targetHeroTime - currentHeroTime;
        if (Math.abs(diff) > 0.002) {
          currentHeroTime += diff * 0.12;
          heroVideo.currentTime = currentHeroTime;
        }
        if (heroTimeCounter) {
          heroTimeCounter.textContent = `${currentHeroTime.toFixed(2)}s / 10.0s`;
        }
      } else if (heroVideo && isHeroAutoPlaying && heroTimeCounter) {
        heroTimeCounter.textContent = `${heroVideo.currentTime.toFixed(2)}s / 10.0s`;
      }

      // 2. Section 4 Sunset A-Frame Video Lerp Seeking
      if (hudVideo && hudVideo.duration) {
        const diff = targetHudTime - currentHudTime;
        if (Math.abs(diff) > 0.002) {
          currentHudTime += diff * 0.10;
          hudVideo.currentTime = currentHudTime;
        }
        updateHudPhase(currentHudTime);
      }
    });
  }

  // ===================================================================
  // 9. BOOT SEQUENCE
  // ===================================================================
  initLenis();
  updateHudSvgLines();
  console.log('Zillow Luxury // 60fps 3D Video Scrubbing Engine Active.');

})();
