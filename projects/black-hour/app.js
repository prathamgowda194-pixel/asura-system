/**
 * BLACK HOUR // MAISON D'HORLOGERIE
 * Core Spatial Runtime Engine & Interactive 3D Architecture
 * Crafted for Iris Ethos // Asura System
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. HOROLOGICAL DATA MODEL (5 LUXURY SWISS REFERENCES)
  // ===================================================================
  const WATCH_CATALOG = [
    {
      id: 0,
      kicker: "N°01  OMEGA SEAMASTER",
      title: "Aqua Terra 150M Emerald",
      shortTitle: "Aqua Terra Emerald",
      colorTag: "green",
      priceUSD: 6400,
      priceEUR: 5950,
      priceCHF: 5800,
      image: "assets/watch_1_green.svg",
      description: "A sunburst deep forest emerald green dial with horizontal maritime teak concept grooves, rhodium-plated triangular hour markers, and matching vulcanized rubber strap.",
      specs: {
        dial: "Emerald green, horizontal teak texture",
        strap: "Forest green rubber, grey contrast stitch",
        case: "Polished silver-tone 316L steel",
        caliber: "Omega Co-Axial Master Chronometer 8900",
        powerReserve: "60 Hours (Twin Barrels)",
        waterResistance: "150m / 500ft",
        diameter: "41.0 mm"
      }
    },
    {
      id: 1,
      kicker: "N°02  OMEGA SEAMASTER",
      title: "Aqua Terra Blue",
      shortTitle: "Aqua Terra Blue",
      colorTag: "blue",
      priceUSD: 6900,
      priceEUR: 6400,
      priceCHF: 6250,
      image: "assets/watch_2_blue.svg",
      description: "A deep blue textured dial paired with a blue rubber strap, metallic-toned hands and a date display. Master Chronometer certified by METAS, resistant to 15,000 gauss.",
      specs: {
        dial: "Blue, horizontal texture",
        strap: "Blue rubber, contrast stitch",
        case: "Polished silver-tone steel",
        caliber: "Omega Co-Axial Master Chronometer 8900",
        powerReserve: "60 Hours (Twin Barrels)",
        waterResistance: "150m / 500ft",
        diameter: "41.0 mm"
      }
    },
    {
      id: 2,
      kicker: "N°03  OMEGA SEAMASTER",
      title: "Diver 300M Obsidian Black",
      shortTitle: "Seamaster Black",
      colorTag: "black",
      priceUSD: 5900,
      priceEUR: 5500,
      priceCHF: 5350,
      image: "assets/watch_3_black.svg",
      description: "Polished black ceramic dial with laser-engraved waves, skeleton hands, and unidirectional black ceramic bezel with white enamel diving scale. Built for the deep sea.",
      specs: {
        dial: "Black ceramic, laser-cut waves",
        strap: "Integrated black ribbed rubber",
        case: "Brushed & polished 316L stainless steel",
        caliber: "Omega Co-Axial Master Chronometer 8800",
        powerReserve: "55 Hours",
        waterResistance: "300m / 1000ft",
        diameter: "42.0 mm"
      }
    },
    {
      id: 3,
      kicker: "N°04  OMEGA SEAMASTER",
      title: "Diver 300M Polar White",
      shortTitle: "Seamaster Polar",
      colorTag: "white",
      priceUSD: 6200,
      priceEUR: 5800,
      priceCHF: 5650,
      image: "assets/watch_4_white.svg",
      description: "Brilliant polished white ceramic dial with laser-engraved waves, blackened skeleton hands filled with luminous white Super-LumiNova, and a solid 5-link steel bracelet.",
      specs: {
        dial: "Polished white ceramic, black waves",
        strap: "Stainless steel 5-link bracelet",
        case: "Stainless steel with helium escape valve",
        caliber: "Omega Co-Axial Master Chronometer 8800",
        powerReserve: "55 Hours",
        waterResistance: "300m / 1000ft",
        diameter: "42.0 mm"
      }
    },
    {
      id: 4,
      kicker: "N°05  OMEGA SEAMASTER",
      title: "Planet Ocean 600M Ultra Deep",
      shortTitle: "Planet Ocean Cobalt",
      colorTag: "cobalt",
      priceUSD: 9200,
      priceEUR: 8600,
      priceCHF: 8350,
      image: "assets/watch_5_cobalt.svg",
      description: "Electric cobalt blue sunburst dial with bold orange Arabic numerals, blue ceramic bezel with Liquidmetal diving scale, and robust 600-meter professional ocean rating.",
      specs: {
        dial: "Electric cobalt blue sunburst",
        strap: "Blue vulcanized rubber with orange stitch",
        case: "High-grade 316L steel with helium valve",
        caliber: "Omega Co-Axial Master Chronometer 8900",
        powerReserve: "60 Hours",
        waterResistance: "600m / 2000ft",
        diameter: "43.5 mm"
      }
    }
  ];

  // ===================================================================
  // 2. STATE MACHINE
  // ===================================================================
  const State = {
    viewMode: "WALL", // "WALL" | "FOCUS" | "EXPLODED"
    activeWatchIndex: 1, // Default hero: Aqua Terra Blue (index 1)
    currency: "USD", // "USD" | "EUR" | "CHF"
    soundEnabled: true,
    bagItems: []
  };

  // ===================================================================
  // 3. SYNTHESIZED HOROLOGICAL WEB AUDIO SOUND SYSTEM
  // ===================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Metallic Mechanical Horological Escapement Tick
  function playTickSound() {
    if (!State.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, audioCtx.currentTime);
      filter.Q.setValueAtTime(4, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Deep Spatial Camera Resonant Whoosh
  function playWhooshSound() {
    if (!State.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.38);
    } catch (e) {}
  }

  // Exploded Mechanical Disassembly Ratchet
  function playRatchetSound() {
    if (!State.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        playTickSound();
      }, i * 65);
    }
  }

  // ===================================================================
  // 4. DOM ELEMENTS CACHE
  // ===================================================================
  const DOM = {
    cameraRig: document.getElementById('wall-camera-rig'),
    collectionWall: document.getElementById('collection-wall'),
    alcoveItems: document.querySelectorAll('.alcove-item'),
    heroOverlay: document.getElementById('hero-headline-overlay'),
    statusText: document.getElementById('status-telemetry-text'),
    specPanel: document.getElementById('detail-spec-panel'),
    backToWallBtn: document.getElementById('back-to-wall-btn'),
    specKicker: document.getElementById('spec-kicker'),
    specTitle: document.getElementById('spec-title'),
    specDesc: document.getElementById('spec-desc'),
    specDial: document.getElementById('spec-dial'),
    specStrap: document.getElementById('spec-strap'),
    specCase: document.getElementById('spec-case'),
    specCaliber: document.getElementById('spec-caliber'),
    specReserve: document.getElementById('spec-reserve'),
    specWater: document.getElementById('spec-water'),
    specDiameter: document.getElementById('spec-diameter'),
    specPrice: document.getElementById('spec-price'),
    specCurrencyLabel: document.getElementById('spec-currency-label'),
    btnLookInside: document.getElementById('btn-look-inside'),
    btnAddToBag: document.getElementById('btn-add-to-bag'),
    prevWatchBtn: document.getElementById('prev-watch-btn'),
    nextWatchBtn: document.getElementById('next-watch-btn'),
    sliderCounter: document.getElementById('slider-counter-label'),
    explodedStage: document.getElementById('exploded-3d-stage'),
    explodedRig: document.getElementById('exploded-rig'),
    explodeSlider: document.getElementById('explode-slider-input'),
    navCollectionBtn: document.getElementById('nav-collection-btn'),
    navBagBtn: document.getElementById('nav-bag-btn'),
    bagCountBadge: document.getElementById('bag-count-badge'),
    currencyToggle: document.getElementById('currency-toggle'),
    soundToggle: document.getElementById('sound-toggle-btn'),
    bagDrawer: document.getElementById('bag-drawer'),
    bagOverlay: document.getElementById('bag-drawer-overlay'),
    bagCloseBtn: document.getElementById('bag-close-btn'),
    bagItemsList: document.getElementById('bag-items-list'),
    bagSubtotalAmount: document.getElementById('bag-subtotal-amount'),
    bagCheckoutBtn: document.getElementById('bag-checkout-btn'),
    telemetryContainer: document.getElementById('scroll-scrub-telemetry'),
    scrubNodes: document.querySelectorAll('.scrub-step-node'),
    percentageBadge: document.getElementById('scroll-percentage-badge'),
    scrollTrack: document.getElementById('scroll-track-container')
  };

  // ===================================================================
  // 5. CURRENCY FORMATTER
  // ===================================================================
  function formatPrice(watch) {
    if (State.currency === 'EUR') {
      return `€${watch.priceEUR.toLocaleString('en-US')}`;
    } else if (State.currency === 'CHF') {
      return `CHF ${watch.priceCHF.toLocaleString('en-US')}`;
    }
    return `$${watch.priceUSD.toLocaleString('en-US')}`;
  }

  // ===================================================================
  // 6. SPATIAL CAMERA ENGINE & VIEW TRANSITIONS
  // ===================================================================

  // Mode 1: Transition back to Wall Overview
  function showWallView() {
    State.viewMode = "WALL";
    playWhooshSound();

    // Reset camera transform smoothly
    if (DOM.cameraRig) {
      DOM.cameraRig.style.transform = `scale(1) translate3d(0, 0, 0)`;
    }

    // Reset alcove visual states
    DOM.alcoveItems.forEach(item => {
      item.classList.remove('focused');
      item.style.filter = 'none';
      item.style.opacity = '1';
    });

    // Hide detail panel & exploded stage
    if (DOM.specPanel) DOM.specPanel.classList.remove('visible');
    if (DOM.explodedStage) {
      DOM.explodedStage.classList.remove('active');
      DOM.explodedStage.classList.remove('exploded');
    }

    // Reveal hero headline overlay
    if (DOM.heroOverlay) {
      DOM.heroOverlay.style.opacity = '1';
      DOM.heroOverlay.style.pointerEvents = 'auto';
    }

    // Update status text
    const activeWatch = WATCH_CATALOG[State.activeWatchIndex];
    if (DOM.statusText) {
      DOM.statusText.textContent = `${activeWatch.shortTitle.toUpperCase()} — SELECT TO COME CLOSER`;
    }
  }

  // Mode 2: Camera Zoom into Selected Watch
  function showFocusView(index) {
    State.viewMode = "FOCUS";
    State.activeWatchIndex = index;
    playWhooshSound();

    const watch = WATCH_CATALOG[index];
    const targetAlcove = DOM.alcoveItems[index];

    // Compute camera translation offset based on alcove position
    // Center alcove is index 2. Index 0: -480px, Index 1: -240px, Index 2: 0, Index 3: +240px, Index 4: +480px
    const offsets = [-520, -260, 0, 260, 520];
    const targetX = -offsets[index] + 160; // Push slightly right to accommodate left spec panel!
    const targetY = 30;
    const targetScale = 2.15;

    if (DOM.cameraRig) {
      DOM.cameraRig.style.transform = `scale(${targetScale}) translate3d(${targetX}px, ${targetY}px, 0)`;
    }

    // Highlight active alcove; dim & blur adjacent alcoves
    DOM.alcoveItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('focused');
        item.style.filter = 'none';
        item.style.opacity = '1';
      } else {
        item.classList.remove('focused');
        item.style.filter = 'blur(10px)';
        item.style.opacity = '0.35';
      }
    });

    // Populate Spec Panel Content
    if (DOM.specKicker) DOM.specKicker.textContent = watch.kicker;
    if (DOM.specTitle) DOM.specTitle.textContent = watch.title;
    if (DOM.specDesc) DOM.specDesc.textContent = watch.description;
    if (DOM.specDial) DOM.specDial.textContent = watch.specs.dial;
    if (DOM.specStrap) DOM.specStrap.textContent = watch.specs.strap;
    if (DOM.specCase) DOM.specCase.textContent = watch.specs.case;
    if (DOM.specCaliber) DOM.specCaliber.textContent = watch.specs.caliber;
    if (DOM.specReserve) DOM.specReserve.textContent = watch.specs.powerReserve;
    if (DOM.specWater) DOM.specWater.textContent = watch.specs.waterResistance;
    if (DOM.specDiameter) DOM.specDiameter.textContent = watch.specs.diameter;
    if (DOM.specPrice) DOM.specPrice.textContent = formatPrice(watch);
    if (DOM.sliderCounter) DOM.sliderCounter.textContent = `0${index + 1} / 05`;

    // Slide in Spec Panel
    if (DOM.specPanel) DOM.specPanel.classList.add('visible');

    // Hide hero overlay and exploded stage
    if (DOM.heroOverlay) {
      DOM.heroOverlay.style.opacity = '0';
      DOM.heroOverlay.style.pointerEvents = 'none';
    }
    if (DOM.explodedStage) {
      DOM.explodedStage.classList.remove('active');
      DOM.explodedStage.classList.remove('exploded');
    }
  }

  // Mode 3: 3D Exploded Movement Deconstruction ("LOOK INSIDE")
  function showExplodedView() {
    State.viewMode = "EXPLODED";
    playRatchetSound();

    // Hide the standard watch inside the focused alcove
    const focusedAlcove = DOM.alcoveItems[State.activeWatchIndex];
    const mount = focusedAlcove ? focusedAlcove.querySelector('.watch-mount') : null;
    if (mount) mount.style.opacity = '0';

    // Activate exploded 3D stage
    if (DOM.explodedStage) {
      DOM.explodedStage.classList.add('active');
      setTimeout(() => {
        DOM.explodedStage.classList.add('exploded');
      }, 50);
    }

    // Update spec panel for movement deconstruction
    if (DOM.specKicker) DOM.specKicker.textContent = "INSIDE THE CASE";
    if (DOM.specTitle) DOM.specTitle.textContent = "The movement";
    if (DOM.specDesc) DOM.specDesc.textContent = "Behind the dial: the Omega Co-Axial calibre, the crown, and the exhibition sapphire case back, in polished silver-tone steel.";
    if (DOM.btnLookInside) {
      DOM.btnLookInside.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 12l6-6M3 12l6 6"/>
        </svg>
        REASSEMBLE WATCH
      `;
    }
  }

  function collapseExplodedView() {
    playWhooshSound();
    if (DOM.explodedStage) {
      DOM.explodedStage.classList.remove('exploded');
      setTimeout(() => {
        DOM.explodedStage.classList.remove('active');
        const focusedAlcove = DOM.alcoveItems[State.activeWatchIndex];
        const mount = focusedAlcove ? focusedAlcove.querySelector('.watch-mount') : null;
        if (mount) mount.style.opacity = '1';
        showFocusView(State.activeWatchIndex);
        if (DOM.btnLookInside) {
          DOM.btnLookInside.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="m10 15 5-3-5-3v6z"/>
            </svg>
            LOOK INSIDE &rarr;
          `;
        }
      }, 400);
    }
  }

  // ===================================================================
  // 7. 3D CURSOR INTERACTIVITY & ORBIT PHYSICS
  // ===================================================================
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;

    // Subtle 3D tilt on wall in overview mode
    if (State.viewMode === 'WALL' && DOM.collectionWall) {
      const rotY = mouseX * 8;
      const rotX = -mouseY * 6;
      DOM.collectionWall.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    }

    // 3D Orbit of Exploded Assembly in Mode 3
    if (State.viewMode === 'EXPLODED' && DOM.explodedRig) {
      const rotY = -24 + (mouseX * 36);
      const rotX = 14 + (-mouseY * 26);
      DOM.explodedRig.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    }
  });

  // Explode Distance Slider Handler
  if (DOM.explodeSlider) {
    DOM.explodeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100; // 0 to 1
      const layer1 = document.querySelector('.layer-1-sapphire');
      const layer2 = document.querySelector('.layer-2-bezel');
      const layer3 = document.querySelector('.layer-3-dial');
      const layer4 = document.querySelector('.layer-4-movement');
      const layer5 = document.querySelector('.layer-5-chassis');
      const layer6 = document.querySelector('.layer-6-caseback');

      if (layer1) layer1.style.transform = `translateZ(${val * 240}px)`;
      if (layer2) layer2.style.transform = `translateZ(${val * 150}px)`;
      if (layer3) layer3.style.transform = `translateZ(${val * 60}px)`;
      if (layer4) layer4.style.transform = `translateZ(${val * -30}px)`;
      if (layer5) layer5.style.transform = `translateZ(${val * -120}px)`;
      if (layer6) layer6.style.transform = `translateZ(${val * -210}px)`;
    });
  }

  // ===================================================================
  // 8. ALCOVE CLICK & HOVER EVENTS
  // ===================================================================
  DOM.alcoveItems.forEach((item, index) => {
    // Hover: Tick sound and update status bar
    item.addEventListener('mouseenter', () => {
      if (State.viewMode === 'WALL') {
        playTickSound();
        const watch = WATCH_CATALOG[index];
        if (DOM.statusText) {
          DOM.statusText.textContent = `${watch.shortTitle.toUpperCase()} — SELECT TO COME CLOSER`;
        }
      }
    });

    // Click: Zoom in to that watch
    item.addEventListener('click', () => {
      if (State.viewMode === 'WALL') {
        showFocusView(index);
      }
    });
  });

  // Back to Wall Button
  if (DOM.backToWallBtn) {
    DOM.backToWallBtn.addEventListener('click', () => {
      if (State.viewMode === 'EXPLODED') {
        collapseExplodedView();
        setTimeout(showWallView, 450);
      } else {
        showWallView();
      }
    });
  }

  // Previous & Next Watch Slider Controls
  if (DOM.prevWatchBtn) {
    DOM.prevWatchBtn.addEventListener('click', () => {
      playTickSound();
      let nextIndex = State.activeWatchIndex - 1;
      if (nextIndex < 0) nextIndex = WATCH_CATALOG.length - 1;
      showFocusView(nextIndex);
    });
  }

  if (DOM.nextWatchBtn) {
    DOM.nextWatchBtn.addEventListener('click', () => {
      playTickSound();
      let nextIndex = State.activeWatchIndex + 1;
      if (nextIndex >= WATCH_CATALOG.length) nextIndex = 0;
      showFocusView(nextIndex);
    });
  }

  // Look Inside Button
  if (DOM.btnLookInside) {
    DOM.btnLookInside.addEventListener('click', () => {
      if (State.viewMode === 'EXPLODED') {
        collapseExplodedView();
      } else {
        showExplodedView();
      }
    });
  }

  // ===================================================================
  // 9. LUXURY SHOPPING BAG SYSTEM
  // ===================================================================
  function updateBagUI() {
    if (DOM.bagCountBadge) {
      DOM.bagCountBadge.textContent = State.bagItems.length;
    }

    if (!DOM.bagItemsList) return;

    if (State.bagItems.length === 0) {
      DOM.bagItemsList.innerHTML = `<div class="bag-empty-notice">Your collection bag is currently empty.</div>`;
      if (DOM.bagSubtotalAmount) DOM.bagSubtotalAmount.textContent = "$0.00";
      return;
    }

    let subtotalUSD = 0;
    let html = '';

    State.bagItems.forEach((item, idx) => {
      subtotalUSD += item.priceUSD;
      html += `
        <div class="bag-item-card">
          <img src="${item.image}" alt="${item.title}" class="bag-item-thumb">
          <div class="bag-item-meta">
            <div class="bag-item-name">${item.title}</div>
            <div class="bag-item-ref">${item.kicker}</div>
            <div class="bag-item-price">${formatPrice(item)}</div>
          </div>
          <button class="bag-item-remove-btn" data-index="${idx}" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `;
    });

    DOM.bagItemsList.innerHTML = html;

    if (DOM.bagSubtotalAmount) {
      if (State.currency === 'EUR') {
        DOM.bagSubtotalAmount.textContent = `€${Math.round(subtotalUSD * 0.93).toLocaleString('en-US')}`;
      } else if (State.currency === 'CHF') {
        DOM.bagSubtotalAmount.textContent = `CHF ${Math.round(subtotalUSD * 0.91).toLocaleString('en-US')}`;
      } else {
        DOM.bagSubtotalAmount.textContent = `$${subtotalUSD.toLocaleString('en-US')}.00`;
      }
    }

    // Attach remove listeners
    document.querySelectorAll('.bag-item-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        State.bagItems.splice(idx, 1);
        playTickSound();
        updateBagUI();
      });
    });
  }

  function openBagDrawer() {
    playWhooshSound();
    if (DOM.bagDrawer) DOM.bagDrawer.classList.add('open');
    if (DOM.bagOverlay) DOM.bagOverlay.classList.add('open');
    if (DOM.navBagBtn) DOM.navBagBtn.classList.add('active');
    if (DOM.navCollectionBtn) DOM.navCollectionBtn.classList.remove('active');
  }

  function closeBagDrawer() {
    playWhooshSound();
    if (DOM.bagDrawer) DOM.bagDrawer.classList.remove('open');
    if (DOM.bagOverlay) DOM.bagOverlay.classList.remove('open');
    if (DOM.navBagBtn) DOM.navBagBtn.classList.remove('active');
    if (DOM.navCollectionBtn) DOM.navCollectionBtn.classList.add('active');
  }

  if (DOM.btnAddToBag) {
    DOM.btnAddToBag.addEventListener('click', () => {
      const activeWatch = WATCH_CATALOG[State.activeWatchIndex];
      State.bagItems.push(activeWatch);
      playTickSound();
      updateBagUI();
      openBagDrawer();
    });
  }

  if (DOM.navBagBtn) DOM.navBagBtn.addEventListener('click', openBagDrawer);
  if (DOM.navCollectionBtn) DOM.navCollectionBtn.addEventListener('click', closeBagDrawer);
  if (DOM.bagCloseBtn) DOM.bagCloseBtn.addEventListener('click', closeBagDrawer);
  if (DOM.bagOverlay) DOM.bagOverlay.addEventListener('click', closeBagDrawer);

  if (DOM.bagCheckoutBtn) {
    DOM.bagCheckoutBtn.addEventListener('click', () => {
      if (State.bagItems.length === 0) return;
      playTickSound();
      alert('Thank you for reserving with Iris Ethos // Black Hour Maison D\'Horlogerie. A private concierge will contact your horological representative.');
      State.bagItems = [];
      updateBagUI();
      closeBagDrawer();
    });
  }

  // ===================================================================
  // 10. CURRENCY & SOUND CONTROLS
  // ===================================================================
  if (DOM.currencyToggle) {
    DOM.currencyToggle.addEventListener('click', () => {
      playTickSound();
      if (State.currency === 'USD') State.currency = 'EUR';
      else if (State.currency === 'EUR') State.currency = 'CHF';
      else State.currency = 'USD';

      DOM.currencyToggle.textContent = `${State.currency} ${State.currency === 'USD' ? '$' : State.currency === 'EUR' ? '€' : 'Fr'}`;
      if (State.viewMode !== 'WALL') {
        const watch = WATCH_CATALOG[State.activeWatchIndex];
        if (DOM.specPrice) DOM.specPrice.textContent = formatPrice(watch);
      }
      updateBagUI();
    });
  }

  if (DOM.soundToggle) {
    DOM.soundToggle.addEventListener('click', () => {
      State.soundEnabled = !State.soundEnabled;
      DOM.soundToggle.style.opacity = State.soundEnabled ? '1' : '0.4';
      if (State.soundEnabled) playTickSound();
    });
  }

  // Keyboard Navigation: Escape returns to wall, Left/Right navigates
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (DOM.bagDrawer && DOM.bagDrawer.classList.contains('open')) {
        closeBagDrawer();
      } else if (State.viewMode !== 'WALL') {
        showWallView();
      }
    } else if (e.key === 'ArrowRight' && State.viewMode !== 'WALL') {
      if (DOM.nextWatchBtn) DOM.nextWatchBtn.click();
    } else if (e.key === 'ArrowLeft' && State.viewMode !== 'WALL') {
      if (DOM.prevWatchBtn) DOM.prevWatchBtn.click();
    }
  });

  // ===================================================================
  // 11. LENIS MOMENTUM & GSAP SCROLLTRIGGER 3D CAMERA PIPELINE
  // ===================================================================
  let lenisInstance = null;
  let lastProgressIndex = -1;

  function initScrollEngine() {
    // 1. Initialize Lenis Momentum Smooth Scrolling
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

        // Sync Lenis with GSAP ScrollTrigger if GSAP is available
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

    // 2. Telemetry Click Handlers for Instant Phase Scrubbing
    if (DOM.scrubNodes) {
      DOM.scrubNodes.forEach((node) => {
        node.addEventListener('click', () => {
          const targetProgress = parseFloat(node.getAttribute('data-progress') || '0');
          playTickSound();
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          const targetY = targetProgress * maxScroll;
          if (lenisInstance) {
            lenisInstance.scrollTo(targetY, { duration: 1.2 });
          } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        });
      });
    }

    // 3. Scroll Listener for 3D Camera & Exploded Scrubbing
    let ticking = false;

    function handleScrollScrub() {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

      // Update Percentage Telemetry Badge
      const percentVal = Math.round(progress * 100);
      if (DOM.percentageBadge) {
        DOM.percentageBadge.textContent = `${percentVal.toString().padStart(2, '0')}%`;
      }

      // Audio escapement micro-tick on 5% intervals
      const stepIndex = Math.floor(progress * 20);
      if (stepIndex !== lastProgressIndex) {
        lastProgressIndex = stepIndex;
        playTickSound();
      }

      // Update Active Telemetry Dot
      let activePhase = 0;
      if (progress >= 0.85) activePhase = 3;
      else if (progress >= 0.55) activePhase = 2;
      else if (progress >= 0.20) activePhase = 1;

      if (DOM.scrubNodes) {
        DOM.scrubNodes.forEach((node, idx) => {
          if (idx === activePhase) {
            node.classList.add('active');
          } else {
            node.classList.remove('active');
          }
        });
      }

      // Master 4-Phase Choreography
      if (progress < 0.20) {
        // Phase 1: Mode 1 (Collection Wall Overview)
        State.viewMode = 'WALL';
        const wallT = progress / 0.20;

        if (DOM.cameraRig) {
          DOM.cameraRig.style.transform = `scale(1) translate3d(0, 0, 0)`;
        }

        DOM.alcoveItems.forEach(item => {
          item.classList.remove('focused');
          item.style.filter = 'none';
          item.style.opacity = '1';
        });

        if (DOM.specPanel) {
          DOM.specPanel.classList.remove('visible');
          DOM.specPanel.style.opacity = '0';
          DOM.specPanel.style.transform = 'translateY(-50%) translateX(-40px)';
        }

        if (DOM.heroOverlay) {
          DOM.heroOverlay.style.opacity = (1 - wallT * 0.8).toFixed(2);
          DOM.heroOverlay.style.pointerEvents = wallT > 0.5 ? 'none' : 'auto';
        }

        if (DOM.explodedStage) {
          DOM.explodedStage.classList.remove('active');
          DOM.explodedStage.classList.remove('exploded');
          DOM.explodedStage.style.opacity = '0';
        }

        const focusedAlcove = DOM.alcoveItems[1];
        if (focusedAlcove) {
          const mount = focusedAlcove.querySelector('.watch-mount');
          if (mount) mount.style.opacity = '1';
        }

        if (DOM.bagDrawer && DOM.bagDrawer.classList.contains('open')) {
          closeBagDrawer();
        }

      } else if (progress >= 0.20 && progress < 0.55) {
        // Phase 2: Mode 2 (Cinematic Zoom into Alcove N°02 Aqua Terra Blue)
        State.viewMode = 'FOCUS';
        State.activeWatchIndex = 1;
        const focusT = (progress - 0.20) / 0.35;

        const targetScale = 1 + (focusT * 1.15); // 1.0 -> 2.15
        const targetX = focusT * 420;
        const targetY = focusT * 30;

        if (DOM.cameraRig) {
          DOM.cameraRig.style.transform = `scale(${targetScale.toFixed(3)}) translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0)`;
        }

        DOM.alcoveItems.forEach((item, i) => {
          if (i === 1) {
            item.classList.add('focused');
            item.style.filter = 'none';
            item.style.opacity = '1';
          } else {
            item.classList.remove('focused');
            item.style.filter = `blur(${(focusT * 10).toFixed(1)}px)`;
            item.style.opacity = (1 - focusT * 0.65).toFixed(2);
          }
        });

        if (DOM.specPanel) {
          DOM.specPanel.classList.add('visible');
          DOM.specPanel.style.opacity = focusT.toFixed(2);
          DOM.specPanel.style.transform = `translateY(-50%) translateX(${((1 - focusT) * -40).toFixed(1)}px)`;
        }

        if (DOM.heroOverlay) {
          DOM.heroOverlay.style.opacity = '0';
          DOM.heroOverlay.style.pointerEvents = 'none';
        }

        if (DOM.explodedStage) {
          DOM.explodedStage.classList.remove('active');
          DOM.explodedStage.classList.remove('exploded');
          DOM.explodedStage.style.opacity = '0';
        }

        const focusedAlcove = DOM.alcoveItems[1];
        if (focusedAlcove) {
          const mount = focusedAlcove.querySelector('.watch-mount');
          if (mount) mount.style.opacity = '1';
        }

        if (DOM.bagDrawer && DOM.bagDrawer.classList.contains('open')) {
          closeBagDrawer();
        }

      } else if (progress >= 0.55 && progress < 0.85) {
        // Phase 3: Mode 3 (3D Exploded Movement Deconstruction)
        State.viewMode = 'EXPLODED';
        State.activeWatchIndex = 1;
        const explodeT = (progress - 0.55) / 0.30;

        const focusedAlcove = DOM.alcoveItems[1];
        if (focusedAlcove) {
          const mount = focusedAlcove.querySelector('.watch-mount');
          if (mount) mount.style.opacity = (1 - explodeT * 0.9).toFixed(2);
        }

        if (DOM.explodedStage) {
          DOM.explodedStage.classList.add('active');
          DOM.explodedStage.classList.add('exploded');
          DOM.explodedStage.style.opacity = '1';
        }

        const layer1 = document.querySelector('.layer-1-sapphire');
        const layer2 = document.querySelector('.layer-2-bezel');
        const layer3 = document.querySelector('.layer-3-dial');
        const layer4 = document.querySelector('.layer-4-movement');
        const layer5 = document.querySelector('.layer-5-chassis');
        const layer6 = document.querySelector('.layer-6-caseback');

        if (layer1) layer1.style.transform = `translateZ(${(explodeT * 240).toFixed(1)}px) translateX(${(-explodeT * 20).toFixed(1)}px)`;
        if (layer2) layer2.style.transform = `translateZ(${(explodeT * 150).toFixed(1)}px) translateX(${(-explodeT * 12).toFixed(1)}px)`;
        if (layer3) layer3.style.transform = `translateZ(${(explodeT * 60).toFixed(1)}px) translateX(${(-explodeT * 4).toFixed(1)}px)`;
        if (layer4) layer4.style.transform = `translateZ(${(explodeT * -30).toFixed(1)}px) translateX(${(explodeT * 4).toFixed(1)}px)`;
        if (layer5) layer5.style.transform = `translateZ(${(explodeT * -120).toFixed(1)}px) translateX(${(explodeT * 12).toFixed(1)}px)`;
        if (layer6) layer6.style.transform = `translateZ(${(explodeT * -210).toFixed(1)}px) translateX(${(explodeT * 20).toFixed(1)}px)`;

        if (DOM.explodeSlider) {
          DOM.explodeSlider.value = Math.round(explodeT * 100);
        }

        if (DOM.specPanel) {
          DOM.specPanel.classList.add('visible');
          DOM.specPanel.style.opacity = '1';
          DOM.specPanel.style.transform = 'translateY(-50%) translateX(0px)';
          if (DOM.specKicker) DOM.specKicker.textContent = 'INSIDE THE CASE';
          if (DOM.specTitle) DOM.specTitle.textContent = 'The movement';
          if (DOM.specDesc) DOM.specDesc.textContent = 'Behind the dial: the Omega Co-Axial calibre, the crown, and the exhibition sapphire case back, in polished silver-tone steel.';
        }

        if (DOM.bagDrawer && DOM.bagDrawer.classList.contains('open')) {
          closeBagDrawer();
        }

      } else {
        // Phase 4: Mode 4 (Concierge Reservation & Bag Drawer)
        if (State.bagItems.length === 0) {
          State.bagItems.push(WATCH_CATALOG[1]);
          updateBagUI();
        }
        if (DOM.bagDrawer && !DOM.bagDrawer.classList.contains('open')) {
          openBagDrawer();
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleScrollScrub);
        ticking = true;
      }
    }, { passive: true });
  }

  // Initial Boot
  showWallView();
  updateBagUI();
  initScrollEngine();
  console.log('Black Hour // Maison D\'Horlogerie Engine Initialized.');

})();
