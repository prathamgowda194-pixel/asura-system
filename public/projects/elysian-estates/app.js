/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ELYSIAN // 3D WEBGL DIORAMA & INTERACTIVE REAL ESTATE ENGINE
 * Reverse-Engineered from blendi-remade/dioramas + juliobsz/skills + wheresryan22/anatomy
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ─── 1. LENIS MOMENTUM SCROLL INITIALIZATION ────────────────────────────────
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    if (typeof gsap !== 'undefined' && gsap.ticker) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ─── 2. THREE.JS SCENE, CAMERA & RENDERER SETUP ──────────────────────────────
  const canvas = document.getElementById('diorama-canvas');
  const container = document.getElementById('diorama-container');

  if (!canvas || !container || typeof THREE === 'undefined') {
    console.error('Three.js or Canvas container missing');
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a101b, 0.018);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(24, 18, 24);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // OrbitControls
  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Never clip underneath plinth
    controls.minPolarAngle = 0.2;
    controls.minDistance = 14;
    controls.maxDistance = 55;
    controls.target.set(0, 3.5, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;

    // Pause auto-rotate when user drags
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
    });
  }

  // ─── 3. LIGHTING RIG & DYNAMIC STATE MACHINE ────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xff7733, 0x1c151e, 0.6);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xff933b, 2.4);
  sunLight.position.set(28, 14, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 80;
  const shadowRange = 22;
  sunLight.shadow.camera.left = -shadowRange;
  sunLight.shadow.camera.right = shadowRange;
  sunLight.shadow.camera.top = shadowRange;
  sunLight.shadow.camera.bottom = -shadowRange;
  sunLight.shadow.bias = -0.0004;
  scene.add(sunLight);

  // Interior Ambient Glow Lights
  const interiorLight1 = new THREE.PointLight(0xffb86c, 2.2, 18);
  interiorLight1.position.set(1, 3.8, 1);
  scene.add(interiorLight1);

  const interiorLight2 = new THREE.PointLight(0xffc58a, 2.0, 16);
  interiorLight2.position.set(4, 7.2, 2);
  scene.add(interiorLight2);

  // Infinity Pool Turquoise Underwater Caustic Light
  const poolLight = new THREE.PointLight(0x38bdf8, 2.2, 14);
  poolLight.position.set(-5, 0.8, 6);
  scene.add(poolLight);

  // Fire Pit Warm Hearth Light
  const hearthLight = new THREE.PointLight(0xff6622, 1.8, 8);
  hearthLight.position.set(7, 1.6, -5);
  scene.add(hearthLight);

  // Lighting State Definitions
  const LIGHTING_MODES = {
    noon: {
      sunPos: { x: 16, y: 36, z: 12 },
      sunColor: 0xfff8ee,
      sunIntensity: 2.2,
      hemiSky: 0xa6c8e0,
      hemiGround: 0x222b35,
      hemiIntensity: 0.7,
      interiorIntensity: 0.4,
      poolColor: 0x22d3ee,
      poolIntensity: 1.4,
      fogColor: 0x0f172a,
      bgGradient: 'radial-gradient(circle at 50% 40%, #152238 0%, #090e17 100%)'
    },
    golden: {
      sunPos: { x: 28, y: 14, z: 8 },
      sunColor: 0xff933b,
      sunIntensity: 2.5,
      hemiSky: 0xff7733,
      hemiGround: 0x1c151e,
      hemiIntensity: 0.6,
      interiorIntensity: 2.2,
      poolColor: 0x38bdf8,
      poolIntensity: 2.2,
      fogColor: 0x1a101b,
      bgGradient: 'radial-gradient(circle at 50% 40%, #2a1728 0%, #0a0810 100%)'
    },
    twilight: {
      sunPos: { x: -20, y: 22, z: -16 },
      sunColor: 0x3b5b8c,
      sunIntensity: 0.8,
      hemiSky: 0x1e293b,
      hemiGround: 0x050811,
      hemiIntensity: 0.35,
      interiorIntensity: 3.6,
      poolColor: 0x06b6d4,
      poolIntensity: 3.5,
      fogColor: 0x050811,
      bgGradient: 'radial-gradient(circle at 50% 40%, #0b1324 0%, #04060a 100%)'
    }
  };

  function applyLightingMode(modeKey) {
    const mode = LIGHTING_MODES[modeKey];
    if (!mode) return;

    if (typeof gsap !== 'undefined') {
      gsap.to(sunLight.position, {
        x: mode.sunPos.x,
        y: mode.sunPos.y,
        z: mode.sunPos.z,
        duration: 1.2,
        ease: 'power2.inOut'
      });

      gsap.to(sunLight, {
        intensity: mode.sunIntensity,
        duration: 1.2,
        onUpdate: () => {
          sunLight.color.lerp(new THREE.Color(mode.sunColor), 0.1);
        }
      });

      gsap.to(hemiLight, {
        intensity: mode.hemiIntensity,
        duration: 1.2,
        onUpdate: () => {
          hemiLight.color.lerp(new THREE.Color(mode.hemiSky), 0.1);
          hemiLight.groundColor.lerp(new THREE.Color(mode.hemiGround), 0.1);
        }
      });

      gsap.to(interiorLight1, { intensity: mode.interiorIntensity, duration: 1.2 });
      gsap.to(interiorLight2, { intensity: mode.interiorIntensity * 0.9, duration: 1.2 });
      gsap.to(poolLight, {
        intensity: mode.poolIntensity,
        duration: 1.2,
        onUpdate: () => {
          poolLight.color.lerp(new THREE.Color(mode.poolColor), 0.1);
        }
      });

      // Fog & Background interpolation
      const targetFogColor = new THREE.Color(mode.fogColor);
      gsap.to(scene.fog.color, {
        r: targetFogColor.r,
        g: targetFogColor.g,
        b: targetFogColor.b,
        duration: 1.2
      });

      if (container) {
        container.style.background = mode.bgGradient;
      }
    } else {
      sunLight.position.set(mode.sunPos.x, mode.sunPos.y, mode.sunPos.z);
      sunLight.color.setHex(mode.sunColor);
      sunLight.intensity = mode.sunIntensity;
      hemiLight.color.setHex(mode.hemiSky);
      hemiLight.groundColor.setHex(mode.hemiGround);
      hemiLight.intensity = mode.hemiIntensity;
      interiorLight1.intensity = mode.interiorIntensity;
      interiorLight2.intensity = mode.interiorIntensity * 0.9;
      poolLight.color.setHex(mode.poolColor);
      poolLight.intensity = mode.poolIntensity;
      scene.fog.color.setHex(mode.fogColor);
      if (container) container.style.background = mode.bgGradient;
    }
  }

  // ─── 4. PROCEDURAL 3D ARCHITECTURAL DIORAMA ASSEMBLY ────────────────────────
  const dioramaGroup = new THREE.Group();
  scene.add(dioramaGroup);

  // Exploded anatomy animated groups
  const groupPlinth = new THREE.Group();
  const groupGroundLiving = new THREE.Group();
  const groupCantileverOverhang = new THREE.Group();
  const groupRoofSolar = new THREE.Group();
  dioramaGroup.add(groupPlinth);
  dioramaGroup.add(groupGroundLiving);
  dioramaGroup.add(groupCantileverOverhang);
  dioramaGroup.add(groupRoofSolar);

  // Materials Library
  const matTravertine = new THREE.MeshStandardMaterial({
    color: 0xded6c8,
    roughness: 0.55,
    metalness: 0.05
  });

  const matDarkConcrete = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.85,
    metalness: 0.1
  });

  const matBedrockPlinth = new THREE.MeshStandardMaterial({
    color: 0x111622,
    roughness: 0.9,
    metalness: 0.15
  });

  const matBronze = new THREE.MeshStandardMaterial({
    color: 0xc89e48,
    roughness: 0.28,
    metalness: 0.82
  });

  const matGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 0.04,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.52,
    thickness: 0.5
  });

  const matWoodSoffit = new THREE.MeshStandardMaterial({
    color: 0x5a3d28,
    roughness: 0.65,
    metalness: 0.05
  });

  const matWater = new THREE.MeshStandardMaterial({
    color: 0x14b8a6,
    roughness: 0.08,
    metalness: 0.35,
    transparent: true,
    opacity: 0.88
  });

  // 4.1 THE OBSIDIAN ARCHITECTURAL BEDROCK PLINTH
  const plinthGeo = new THREE.CylinderGeometry(18, 19.5, 2.2, 8);
  const plinthMesh = new THREE.Mesh(plinthGeo, matBedrockPlinth);
  plinthMesh.position.y = -1.1;
  plinthMesh.receiveShadow = true;
  groupPlinth.add(plinthMesh);

  // Plinth Chamfered Step Accent
  const plinthStepGeo = new THREE.CylinderGeometry(19.6, 20.2, 0.4, 8);
  const plinthStepMesh = new THREE.Mesh(plinthStepGeo, matBronze);
  plinthStepMesh.position.y = -2.1;
  groupPlinth.add(plinthStepMesh);

  // 4.2 GROUND TIER PODIUM & LIVING GALLERY
  // Ground floor base slab
  const groundSlabGeo = new THREE.BoxGeometry(20, 0.6, 16);
  const groundSlabMesh = new THREE.Mesh(groundSlabGeo, matTravertine);
  groundSlabMesh.position.set(0, 0.3, 0);
  groundSlabMesh.receiveShadow = true;
  groupGroundLiving.add(groundSlabMesh);

  // Ground Floor Structural Travertine Columns & Feature Walls
  const wallLeftGeo = new THREE.BoxGeometry(0.8, 4.2, 14);
  const wallLeftMesh = new THREE.Mesh(wallLeftGeo, matTravertine);
  wallLeftMesh.position.set(-6.5, 2.4, 0);
  wallLeftMesh.castShadow = true;
  wallLeftMesh.receiveShadow = true;
  groupGroundLiving.add(wallLeftMesh);

  const wallBackGeo = new THREE.BoxGeometry(14, 4.2, 0.8);
  const wallBackMesh = new THREE.Mesh(wallBackGeo, matTravertine);
  wallBackMesh.position.set(0, 2.4, -6.5);
  wallBackMesh.castShadow = true;
  wallBackMesh.receiveShadow = true;
  groupGroundLiving.add(wallBackMesh);

  // Double-Height Great Room Glass Facade
  const glassFrontGeo = new THREE.BoxGeometry(13.6, 4.0, 0.1);
  const glassFrontMesh = new THREE.Mesh(glassFrontGeo, matGlass);
  glassFrontMesh.position.set(0.2, 2.4, 6.2);
  groupGroundLiving.add(glassFrontMesh);

  const glassSideGeo = new THREE.BoxGeometry(0.1, 4.0, 12.6);
  const glassSideMesh = new THREE.Mesh(glassSideGeo, matGlass);
  glassSideMesh.position.set(6.8, 2.4, 0);
  groupGroundLiving.add(glassSideMesh);

  // Interior Minimalist Travertine Sculpture / Fireplace Core
  const fireCoreGeo = new THREE.BoxGeometry(1.6, 4.0, 2.8);
  const fireCoreMesh = new THREE.Mesh(fireCoreGeo, matDarkConcrete);
  fireCoreMesh.position.set(0, 2.3, 0.5);
  groupGroundLiving.add(fireCoreMesh);

  // Fluted Bronze Mullions
  for (let i = -5.5; i <= 5.5; i += 2.2) {
    const mullionGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.1, 6);
    const mullionMesh = new THREE.Mesh(mullionGeo, matBronze);
    mullionMesh.position.set(i, 2.4, 6.25);
    groupGroundLiving.add(mullionMesh);
  }

  // 4.3 CANTILEVERED INFINITY POOL
  const poolBasinGeo = new THREE.BoxGeometry(7, 1.2, 10);
  const poolBasinMesh = new THREE.Mesh(poolBasinGeo, matDarkConcrete);
  poolBasinMesh.position.set(-9.5, 0.6, 2);
  poolBasinMesh.castShadow = true;
  groupGroundLiving.add(poolBasinMesh);

  const poolWaterGeo = new THREE.BoxGeometry(6.6, 0.3, 9.6);
  const poolWaterMesh = new THREE.Mesh(poolWaterGeo, matWater);
  poolWaterMesh.position.set(-9.5, 1.1, 2);
  groupGroundLiving.add(poolWaterMesh);

  // Glass Infinity Edge Barrier
  const poolGlassGeo = new THREE.BoxGeometry(0.08, 0.9, 9.6);
  const poolGlassMesh = new THREE.Mesh(poolGlassGeo, matGlass);
  poolGlassMesh.position.set(-12.95, 1.45, 2);
  groupGroundLiving.add(poolGlassMesh);

  // 4.4 SECOND TIER 14.2M CANTILEVERED VOLUME
  // The dramatic cantilever slab jutting out 6 units past ground volume
  const cantileverGeo = new THREE.BoxGeometry(15, 3.8, 10);
  const cantileverMesh = new THREE.Mesh(cantileverGeo, matTravertine);
  cantileverMesh.position.set(4.5, 6.4, 1.5);
  cantileverMesh.castShadow = true;
  cantileverMesh.receiveShadow = true;
  groupCantileverOverhang.add(cantileverMesh);

  // Wood Soffit Underneath Cantilever
  const soffitGeo = new THREE.BoxGeometry(14.8, 0.06, 9.8);
  const soffitMesh = new THREE.Mesh(soffitGeo, matWoodSoffit);
  soffitMesh.position.set(4.5, 4.48, 1.5);
  groupCantileverOverhang.add(soffitMesh);

  // Upper Panoramic Bedroom Glass Ribbon
  const upperGlassGeo = new THREE.BoxGeometry(14.2, 2.2, 0.1);
  const upperGlassMesh = new THREE.Mesh(upperGlassGeo, matGlass);
  upperGlassMesh.position.set(4.5, 6.8, 6.52);
  groupCantileverOverhang.add(upperGlassMesh);

  // Upper Balcony Glass Railing
  const railingGeo = new THREE.BoxGeometry(14.6, 1.0, 0.06);
  const railingMesh = new THREE.Mesh(railingGeo, matGlass);
  railingMesh.position.set(4.5, 8.8, 6.55);
  groupCantileverOverhang.add(railingMesh);

  // Bronze Cantilever Accent Fascia
  const fasciaGeo = new THREE.BoxGeometry(15.2, 0.3, 10.2);
  const fasciaMesh = new THREE.Mesh(fasciaGeo, matBronze);
  fasciaMesh.position.set(4.5, 8.35, 1.5);
  groupCantileverOverhang.add(fasciaMesh);

  // 4.5 ROOF SOLAR PHOTOVOLTAIC DECK
  const roofDeckGeo = new THREE.BoxGeometry(14.8, 0.2, 9.8);
  const roofDeckMesh = new THREE.Mesh(roofDeckGeo, matDarkConcrete);
  roofDeckMesh.position.set(4.5, 8.45, 1.5);
  groupRoofSolar.add(roofDeckMesh);

  // Solar PV Cells Grid
  for (let rx = -5; rx <= 5; rx += 2.4) {
    for (let rz = -3; rz <= 3; rz += 2.2) {
      const panelGeo = new THREE.BoxGeometry(2.0, 0.04, 1.8);
      const matSolar = new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        roughness: 0.15,
        metalness: 0.9
      });
      const panelMesh = new THREE.Mesh(panelGeo, matSolar);
      panelMesh.position.set(4.5 + rx, 8.6, 1.5 + rz);
      groupRoofSolar.add(panelMesh);
    }
  }

  // 4.6 SCULPTURAL ARCHITECTURAL VEGETATION & BONSAI TREE
  const treeTrunkGeo = new THREE.CylinderGeometry(0.18, 0.35, 3.2, 7);
  const matTrunk = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.9 });
  const treeTrunk = new THREE.Mesh(treeTrunkGeo, matTrunk);
  treeTrunk.position.set(8.5, 2.1, -4.5);
  treeTrunk.rotation.z = -0.15;
  treeTrunk.castShadow = true;
  groupGroundLiving.add(treeTrunk);

  const foliageGeo1 = new THREE.SphereGeometry(1.2, 7, 7);
  const matFoliage = new THREE.MeshStandardMaterial({ color: 0x243b2a, roughness: 0.8 });
  const foliage1 = new THREE.Mesh(foliageGeo1, matFoliage);
  foliage1.position.set(8.2, 3.5, -4.5);
  foliage1.scale.set(1.4, 0.6, 1.2);
  groupGroundLiving.add(foliage1);

  // 4.7 FLOATING DUST PARTICLES (ATMOSPHERE)
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 36;
    particlePositions[i + 1] = Math.random() * 18;
    particlePositions[i + 2] = (Math.random() - 0.5) * 36;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xffe6a3,
    size: 0.12,
    transparent: true,
    opacity: 0.5
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // ─── 5. TIME OF DAY TACTILE SWITCH CONTROLS ─────────────────────────────────
  const timeButtons = document.querySelectorAll('.time-btn');
  timeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      timeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const modeKey = btn.getAttribute('data-time');
      applyLightingMode(modeKey);
    });
  });

  // Initial lighting set to golden hour
  applyLightingMode('golden');

  // ─── 6. CAMERA PRESETS & INTERACTION ─────────────────────────────────────────
  const CAMERA_PRESETS = {
    iso: { pos: { x: 24, y: 18, z: 24 }, target: { x: 0, y: 3.5, z: 0 } },
    cantilever: { pos: { x: 14, y: 7, z: 12 }, target: { x: 4.5, y: 5.5, z: 1.5 } },
    pool: { pos: { x: -16, y: 4.5, z: 14 }, target: { x: -4, y: 2, z: 2 } }
  };

  const camButtons = document.querySelectorAll('.cam-btn');
  camButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      camButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.getAttribute('data-cam');
      const preset = CAMERA_PRESETS[presetKey];
      if (preset && controls && typeof gsap !== 'undefined') {
        gsap.to(camera.position, {
          x: preset.pos.x,
          y: preset.pos.y,
          z: preset.pos.z,
          duration: 1.4,
          ease: 'power2.inOut'
        });
        gsap.to(controls.target, {
          x: preset.target.x,
          y: preset.target.y,
          z: preset.target.z,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate: () => controls.update()
        });
      }
    });
  });

  // ─── 7. EXPLODED STRUCTURAL ANATOMY ENGINE (wheresryan22/anatomy) ───────────
  const ANATOMY_SPECS = {
    5: {
      tag: 'LAYER 05 // SOLAR MICROGRID & POOLS',
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
      tag: 'LAYER 04 // FAÇADE & ACOUSTIC SHIELD',
      title: 'Acoustic Curtain Glazing',
      specs: [
        { name: 'Glazing Type', val: 'Starphire Triple-Pane' },
        { name: 'Sound Attenuation', val: '48 dB Ambient Cut' },
        { name: 'U-Value Rating', val: '0.64 W/m²K' },
        { name: 'UV Protection', val: '99.8% Solar Block' }
      ],
      note: 'Custom extruded bronze mullions contain internal thermal breaks, completely isolating Pacific coastal wind load vibrations.'
    },
    3: {
      tag: 'LAYER 03 // SANCTUARY LIVING QUARTERS',
      title: 'Double-Height Sanctuary Interiors',
      specs: [
        { name: 'Interior Volume', val: '8,400 Heated Sq.Ft' },
        { name: 'Ceiling Clearance', val: '6.8 Meters Monolithic' },
        { name: 'Acoustic Wall Cladding', val: 'Roman Fluted Travertine' },
        { name: 'Air Exchange', val: 'Medical HEPA-14 Clean' }
      ],
      note: 'Open continuous sightlines unite living gallery, sunken hearth, and ocean horizons without structural interior load-bearing partitions.'
    },
    2: {
      tag: 'LAYER 02 // CANTILEVER ENGINEERING',
      title: 'Post-Tensioned Monolith Slab',
      specs: [
        { name: 'Cantilever Span', val: '14.2 Meters Overhang' },
        { name: 'Rebar Specification', val: 'Grade 75 High-Tensile' },
        { name: 'Concrete Mix', val: 'Carbon-Cured Ultra-Dense' },
        { name: 'Deflection Safety Factor', val: '3.8x Above Seismic Code' }
      ],
      note: 'Internally tensioned steel tendons balance the 14-meter overhang, allowing the primary master wing to float effortlessly over the promontory.'
    },
    1: {
      tag: 'LAYER 01 // SUB-STRUCTURE & BEDROCK',
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

  function setAnatomyLayer(layerNum) {
    layerButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-layer') === String(layerNum));
    });

    // Update SVG highlights
    document.querySelectorAll('.exploded-layer-group').forEach((g) => {
      g.classList.remove('highlighted');
    });
    const activeSvg = document.getElementById(`svg-layer-${layerNum}`);
    if (activeSvg) activeSvg.classList.add('highlighted');

    // Update Inspector Data
    const data = ANATOMY_SPECS[layerNum];
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

    // Explode 3D meshes in Three.js diorama
    if (typeof gsap !== 'undefined') {
      if (layerNum === 5) {
        gsap.to(groupRoofSolar.position, { y: 3.5, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupCantileverOverhang.position, { y: 1.8, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupGroundLiving.position, { y: 0.8, duration: 0.8, ease: 'power2.out' });
      } else if (layerNum === 2) {
        gsap.to(groupRoofSolar.position, { y: 2.5, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupCantileverOverhang.position, { y: 2.2, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupGroundLiving.position, { y: 0, duration: 0.8, ease: 'power2.out' });
      } else if (layerNum === 1) {
        gsap.to(groupRoofSolar.position, { y: 1.5, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupCantileverOverhang.position, { y: 1.0, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupGroundLiving.position, { y: 0.5, duration: 0.8, ease: 'power2.out' });
      } else {
        gsap.to(groupRoofSolar.position, { y: 1.2, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupCantileverOverhang.position, { y: 0.6, duration: 0.8, ease: 'power2.out' });
        gsap.to(groupGroundLiving.position, { y: 0, duration: 0.8, ease: 'power2.out' });
      }
    }
  }

  layerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const num = parseInt(btn.getAttribute('data-layer'), 10);
      setAnatomyLayer(num);
    });
  });

  // Also hook SVG clicks
  for (let l = 1; l <= 5; l++) {
    const svgEl = document.getElementById(`svg-layer-${l}`);
    if (svgEl) {
      svgEl.addEventListener('click', () => setAnatomyLayer(l));
    }
  }

  // ─── 8. 3D PERSPECTIVE CARD TILT & SPECULAR GLARE ───────────────────────────
  const tiltCards = document.querySelectorAll('.residence-tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ─── 9. SCROLLTRIGGER CAMERA TRACKING & NAV SCROLL STATE ─────────────────────
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Scroll section triggers
    ScrollTrigger.create({
      trigger: '#philosophy',
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        if (controls) {
          gsap.to(camera.position, { x: 26, y: 14, z: 20, duration: 1.5 });
          gsap.to(controls.target, { x: 2, y: 3, z: 0, duration: 1.5, onUpdate: () => controls.update() });
        }
      }
    });

    ScrollTrigger.create({
      trigger: '#anatomy',
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        setAnatomyLayer(5);
        if (controls) {
          gsap.to(camera.position, { x: 20, y: 22, z: 22, duration: 1.5 });
          gsap.to(controls.target, { x: 0, y: 4, z: 0, duration: 1.5, onUpdate: () => controls.update() });
        }
      }
    });

    ScrollTrigger.create({
      trigger: '#residences',
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        // Reset exploded meshes
        if (typeof gsap !== 'undefined') {
          gsap.to(groupRoofSolar.position, { y: 0, duration: 0.8 });
          gsap.to(groupCantileverOverhang.position, { y: 0, duration: 0.8 });
          gsap.to(groupGroundLiving.position, { y: 0, duration: 0.8 });
        }
      }
    });
  }

  // ─── 10. PRIVATE TREATY INQUIRY MODAL LOGIC ─────────────────────────────────
  const treatyForm = document.getElementById('treaty-form');
  const treatyModal = document.getElementById('treaty-modal');
  const btnCloseModal = document.getElementById('btn-close-treaty-modal');
  const txCodeEl = document.getElementById('treaty-tx-code');

  if (treatyForm && treatyModal && btnCloseModal) {
    treatyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomCode = 'TX-ELYSIAN-' + Math.floor(1000 + Math.random() * 9000) + '-VERIFIED';
      if (txCodeEl) txCodeEl.textContent = randomCode;
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

  // ─── 11. RENDER ANIMATION LOOP ──────────────────────────────────────────────
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Subtle water normal animation simulation
    if (poolWaterMesh) {
      poolWaterMesh.position.y = 1.1 + Math.sin(elapsedTime * 2.0) * 0.02;
    }

    // Drifting atmospheric particles
    const positions = particleGeo.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      positions[i] -= 0.012;
      if (positions[i] < 0) positions[i] = 18;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Controls update
    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  animate();

  // ─── 12. WINDOW RESIZE HANDLING ─────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  console.log('ELYSIAN 3D WebGL Diorama & Architectural Sanctuary Engine Operational');
})();
