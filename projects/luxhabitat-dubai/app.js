/**
 * LUXHABITAT DUBAI // LUXURY REAL ESTATE LANDING EXPERIENCE
 * 100% Full-Bleed 4K Video Scrub, 3D Mediterranean Window & Cards
 * Replicated with Zero-Slop Precision from @dxasad_grapicdesigner
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. LENIS MOMENTUM INERTIA & GSAP SCROLLTRIGGER SYNC
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
  const interactiveElements = 'a, button, input, select, .property-3d-card, .bento-card';
  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorFollower && cursorFollower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorFollower && cursorFollower.classList.remove('hovering'));
  });

  // ===================================================================
  // 3. HEADER GLASS STATE MACHINE ON SCROLL
  // ===================================================================
  const siteHeader = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      siteHeader && siteHeader.classList.add('scrolled');
      document.body.classList.add('light-theme');
    } else {
      siteHeader && siteHeader.classList.remove('scrolled');
      document.body.classList.remove('light-theme');
    }
  }, { passive: true });

  // ===================================================================
  // 4. 3D CARD PERSPECTIVE TILT & SPECULAR GLARE PHYSICS
  // ===================================================================
  const propertyCards = document.querySelectorAll('.property-3d-card');

  propertyCards.forEach(card => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      const baseTranslate = card.classList.contains('featured-pink-active') ? -10 : -8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${baseTranslate}px)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const baseTranslate = card.classList.contains('featured-pink-active') ? -10 : 0;
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(${baseTranslate}px)`;
      if (glare) {
        glare.style.background = 'transparent';
      }
    });
  });

  // ===================================================================
  // 5. GSAP SCROLLTRIGGER MASTER SEQUENCE & 60FPS FULLSCREEN VIDEO SCRUB
  // ===================================================================
  const heroVideo = document.getElementById('hero-fullscreen-video');
  const telemetryClock = document.getElementById('telemetry-clock');

  if (heroVideo) {
    heroVideo.pause();
    heroVideo.currentTime = 0;

    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.pause();
      heroVideo.currentTime = 0;
    });
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const shutterLeft = document.getElementById('shutter-left');
    const shutterRight = document.getElementById('shutter-right');
    const flankLeft = document.getElementById('flank-left');
    const flankRight = document.getElementById('flank-right');
    const portalRig = document.getElementById('arched-window-portal-rig');
    const knockoutTitle = document.getElementById('dubai-knockout-title');
    const manifestoWrapper = document.getElementById('editorial-manifesto-wrapper');
    const showcaseCards = document.getElementById('showcase-cards-container');

    // 1. Hero Pinned Fullscreen Video Scrubbing Timeline
    ScrollTrigger.create({
      trigger: '#hero-stage',
      start: 'top top',
      end: '+=160%',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;

        // Smooth video currentTime scrubbing
        if (heroVideo && heroVideo.duration) {
          const targetTime = p * (heroVideo.duration - 0.08);
          if (!isNaN(targetTime) && isFinite(targetTime)) {
            heroVideo.currentTime = targetTime;
          }
        }

        // Real-time telemetry readout
        if (telemetryClock) {
          telemetryClock.textContent = (p * 10).toFixed(2) + 's';
        }

        // Knockout Title subtle upward drift & opacity fade
        if (knockoutTitle) {
          const translateY = -p * 60;
          const opacity = Math.max(0, 1 - p * 2.4);
          knockoutTitle.style.transform = `translate(-50%, calc(-50% + ${translateY.toFixed(1)}px))`;
          knockoutTitle.style.opacity = opacity.toFixed(3);
        }
      }
    });

    // 2. Mediterranean Portal & Manifesto Pinned Scroll Sequence
    const portalTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#portal-manifesto-stage',
        start: 'top top',
        end: '+=200%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1
      }
    });

    // Phase 1: Blue Shutters Swing Open & Flanking Didone Reveals (0% -> 35%)
    portalTl
      .fromTo(shutterLeft, 
        { rotateY: 0 }, 
        { rotateY: -115, duration: 1.2, ease: 'power3.out' }, 
        0
      )
      .fromTo(shutterRight, 
        { rotateY: 0 }, 
        { rotateY: 115, duration: 1.2, ease: 'power3.out' }, 
        0
      )
      .fromTo(flankLeft, 
        { opacity: 0, x: -50 }, 
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, 
        0.1
      )
      .fromTo(flankRight, 
        { opacity: 0, x: 50 }, 
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, 
        0.1
      );

    // Phase 2: Window Shrinks into Top Architectural Crest & Manifesto Rises (35% -> 65%)
    portalTl
      .to(portalRig, {
        y: -120,
        scale: 0.52,
        duration: 1.2,
        ease: 'power2.inOut'
      }, 1.2)
      .to([flankLeft, flankRight], {
        opacity: 0.25,
        duration: 0.8,
        ease: 'power2.out'
      }, 1.2)
      .fromTo(manifestoWrapper, 
        { opacity: 0, y: 70 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 
        1.4
      );

    // Phase 3: 3D Property Cards Cascade In (65% -> 100%)
    portalTl
      .fromTo(showcaseCards, 
        { opacity: 0, y: 90, rotateX: 16 }, 
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power3.out' }, 
        2.2
      );
  }

  // ===================================================================
  // 6. CINEMATIC VIDEO MODAL HANDLER
  // ===================================================================
  const playBtn = document.getElementById('btn-neon-play');
  const modalBackdrop = document.getElementById('video-modal-backdrop');
  const modalSheet = document.getElementById('video-modal-sheet');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalVideo = document.getElementById('modal-video-player');

  function openModal() {
    modalBackdrop && modalBackdrop.classList.add('open');
    modalSheet && modalSheet.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (modalVideo) {
      modalVideo.currentTime = 0;
      modalVideo.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }

  function closeModal() {
    modalBackdrop && modalBackdrop.classList.remove('open');
    modalSheet && modalSheet.classList.remove('open');
    document.body.style.overflow = '';
    if (modalVideo) {
      modalVideo.pause();
    }
  }

  if (playBtn) playBtn.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Keyboard Escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Apartment Select CTA alert/modal
  const btnSelectApt = document.getElementById('btn-select-apartment');
  if (btnSelectApt) {
    btnSelectApt.addEventListener('click', () => {
      openModal();
    });
  }

  // Initialize smooth momentum scrolling
  window.addEventListener('DOMContentLoaded', () => {
    initLenis();
  });

  console.log('Luxhabitat Dubai Fullscreen Engine initialized.');
})();
