/**
 * ══════════════════════════════════════════════════════════════════════════════
 * LUXHABITAT DUBAI // RUNTIME ENGINE
 * Replicated from @dxasad_grapicdesigner Luxury Real Estate Concept
 * ══════════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. LENIS MOMENTUM SMOOTH SCROLL INITIALIZATION
  // ===================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ===================================================================
  // 2. VIEW MODE TOGGLE (MOCKUP FRAMING VS FULLSCREEN WEB)
  // ===================================================================
  const viewToggleBtn = document.getElementById('view-mode-toggle');
  const viewModeLabel = document.getElementById('view-mode-label');

  if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', () => {
      const isFullscreen = document.body.classList.toggle('fullscreen-mode');
      if (viewModeLabel) {
        viewModeLabel.textContent = isFullscreen ? 'Mockup Frame' : 'Fullscreen Web';
      }
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 300);
      }
    });
  }

  // Outer Pills Interactivity
  const outerPills = document.querySelectorAll('.outer-pill');
  outerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      outerPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // ===================================================================
  // 3. 3D CARD PERSPECTIVE TILT & SPECULAR GLARE PHYSICS
  // ===================================================================
  const propertyCards = document.querySelectorAll('.property-card');

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

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      if (glare) {
        glare.style.background = 'transparent';
      }
    });
  });

  // ===================================================================
  // 4. GSAP SCROLLTRIGGER MASTER TIMELINE & 60FPS VIDEO SCRUBBING
  // ===================================================================
  const heroVideo = document.getElementById('dubai-coast-video');
  const telemetryTime = document.getElementById('telemetry-time');

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

    const stage = document.getElementById('hero-stage');
    const shutterLeft = document.getElementById('shutter-left');
    const shutterRight = document.getElementById('shutter-right');
    const flankLeft = document.getElementById('flank-left');
    const flankRight = document.getElementById('flank-right');
    const archedFrame = document.getElementById('arched-window-frame');
    const windowRig = document.getElementById('window-portal-rig');
    const panorama = document.getElementById('dubai-panorama');
    const knockoutTitle = document.getElementById('dubai-knockout-title');
    const manifesto = document.getElementById('editorial-manifesto-stage');
    const cardsTrio = document.getElementById('property-cards-trio');

    // Master Scroll Sequence Timeline
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-stage',
        start: 'top top',
        end: '+=220%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // 1. Deterministic 60fps frame scrubbing over the first 58% of scroll
          if (heroVideo && heroVideo.duration) {
            const videoProgress = Math.min(1, Math.max(0, p / 0.58));
            const targetTime = videoProgress * (heroVideo.duration - 0.08);
            if (!isNaN(targetTime) && isFinite(targetTime)) {
              heroVideo.currentTime = targetTime;
            }
          }

          // 2. Telemetry time readout
          if (telemetryTime) {
            const t = p <= 0.58 ? (p / 0.58) * 10 : 10;
            telemetryTime.textContent = t.toFixed(2) + 's';
          }
        }
      }
    });

    // Phase 1: Drone forward push -> Knockout Title fade -> Blue Window shutter reveal (0% -> 38%)
    masterTl
      .to(knockoutTitle, {
        opacity: 0,
        y: -35,
        duration: 0.8,
        ease: 'power2.out'
      }, 0)
      // Open the royal cobalt-blue wooden shutters as the drone arrives at the window
      .fromTo(shutterLeft, 
        { rotateY: 0 }, 
        { rotateY: -115, duration: 1.2, ease: 'power3.out' }, 
        0.3
      )
      .fromTo(shutterRight, 
        { rotateY: 0 }, 
        { rotateY: 115, duration: 1.2, ease: 'power3.out' }, 
        0.3
      )
      // Flank Typography reveals
      .fromTo(flankLeft, 
        { opacity: 0, x: -40 }, 
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 
        0.4
      )
      .fromTo(flankRight, 
        { opacity: 0, x: 40 }, 
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 
        0.4
      );

    // Phase 2: Window Shrinks & Floats Upwards into Top Center framing Burj Khalifa (38% -> 72%)
    masterTl
      .to(windowRig, {
        y: -140,
        scale: 0.48,
        duration: 1.2,
        ease: 'power2.inOut'
      }, 1.3)
      .to([flankLeft, flankRight], {
        opacity: 0.2,
        duration: 0.8,
        ease: 'power2.out'
      }, 1.3)
      .to(panorama, {
        opacity: 0.18,
        scale: 0.94,
        duration: 1.0,
        ease: 'power2.out'
      }, 1.3)
      // Headline and Manifesto text glide upwards into clear view
      .fromTo(manifesto, 
        { opacity: 0, y: 80 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 
        1.5
      );

    // Phase 3: 3D Property Showcase Cards Cascade In (72% -> 100%)
    masterTl
      .fromTo(cardsTrio, 
        { opacity: 0, y: 90, rotateX: 18 }, 
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power3.out' }, 
        2.4
      );
  }

  // ===================================================================
  // 5. CINEMATIC VIDEO MODAL HANDLER
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

  console.log('Luxhabitat Dubai runtime initialized successfully.');
});
