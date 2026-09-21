/**
 * ASURA SUPREME CINEMA ENGINE: REAL 3D FERRARI HYPERCAR
 * Brand: Scuderia Velocity / Ferrari Atelier
 * Niche: High-Performance Automotive & Supercar Engineering
 * Features:
 *  - Sculpted Real Ferrari 3D Chassis (Rosso Corsa metallic, carbon aerodynamic scoops, LED projectors)
 *  - 4 Spinning 5-Spoke Alloy Wheels with Visible Yellow Brembo Brake Calipers
 *  - Dynamic Camera Tracking & Scroll-Driven Driving Animation (Rotates & Drives across scroll chapters)
 *  - Interactive V8 Twin-Turbo Sound Synthesizer (Web Audio API realistic engine revs)
 *  - Active Cockpit Crosshair Cursor with RPM Throttle Response
 *  - Interactive Paint Livery Switcher (Rosso Corsa, Giallo Modena, Grigio Titanio, Nero Daytona)
 *  - Bespoke Typography: Space Grotesk + Chakra Petch (Telemetry HUD) + Inter
 */

function generateFerrariShowcaseHtml(brand, colors) {
  brand = brand || "Scuderia Velocity // Ferrari Atelier";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} // Pure Aerodynamics & V8 Twin-Turbo</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <style>
    :root {
      --bg: #050608;
      --surface: #0B0E14;
      --ferrari-red: #E22020;
      --ferrari-dark: #8F0E0E;
      --modena-yellow: #FFCC00;
      --aero-cyan: #00F0FF;
      --border: rgba(255, 255, 255, 0.08);
      --font-hud: 'Chakra Petch', monospace;
      --font-tech: 'Space Grotesk', sans-serif;
    }

    * { box-sizing: border-box; }
    body {
      background-color: var(--bg);
      color: #F8FAFC;
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      cursor: crosshair;
    }
    .font-hud { font-family: var(--font-hud); }
    .font-tech { font-family: var(--font-tech); }

    /* Cockpit Precision Cursor */
    .crosshair-cursor {
      position: fixed;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(226, 32, 32, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, border-color 0.2s;
    }
    .crosshair-cursor::before, .crosshair-cursor::after {
      content: '';
      position: absolute;
      background-color: #E22020;
    }
    .crosshair-cursor::before { top: 50%; left: -6px; right: -6px; height: 1px; transform: translateY(-50%); }
    .crosshair-cursor::after { left: 50%; top: -6px; bottom: -6px; width: 1px; transform: translateX(-50%); }

    /* Ambient Cockpit Glow */
    .bg-cockpit {
      background: radial-gradient(circle at 50% 35%, rgba(226, 32, 32, 0.18) 0%, rgba(11, 14, 20, 0.85) 60%, rgba(5, 6, 8, 1) 100%);
    }

    /* Laser Grid Floor */
    .laser-floor {
      background-size: 50px 50px;
      background-image: 
        linear-gradient(to right, rgba(226, 32, 32, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(226, 32, 32, 0.05) 1px, transparent 1px);
    }

    /* 3D Card Hover Tilt */
    .tilt-box {
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
      will-change: transform;
    }
    .tilt-box:hover {
      border-color: rgba(226, 32, 32, 0.6);
      box-shadow: 0 20px 40px -10px rgba(226, 32, 32, 0.3);
      transform: translateY(-4px) scale(1.01);
    }

    /* Custom Throttle Slider */
    input[type=range]::-webkit-slider-thumb {
      appearance: none;
      width: 22px;
      height: 22px;
      background: #E22020;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 15px #E22020;
    }
  </style>
</head>
<body class="laser-floor selection:bg-[#E22020] selection:text-white">

  <!-- Custom Cockpit Crosshair Cursor -->
  <div id="crosshair" class="crosshair-cursor hidden md:block"></div>

  <!-- ================= COCKPIT HUD NAVIGATION ================= -->
  <header class="fixed top-0 left-0 w-full z-50 px-6 lg:px-12 py-4 bg-[#050608]/90 backdrop-blur-md border-b border-white/10 font-hud">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Left: Engine Status -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#E22020] animate-pulse"></span>
          <span class="text-xs tracking-wider text-[#E22020] font-bold">V8 TWIN-TURBO // LIVE</span>
        </div>
        <span class="text-white/30 hidden sm:inline">|</span>
        <span class="text-xs text-white/60 hidden sm:inline">DYNO: 1,000 CV // 3.9L V8 HYBRID</span>
      </div>

      <!-- Center: Ferrari Atelier Monogram -->
      <a href="#top" class="text-center group">
        <span class="font-tech text-xl lg:text-2xl font-extrabold tracking-tighter text-white uppercase group-hover:text-[#E22020] transition-colors">${brand}</span>
        <span class="block text-[9px] tracking-[0.35em] text-[#FFCC00] uppercase mt-0.5 font-hud">MARANELLO MOTORSPORT ENGINEERING</span>
      </a>

      <!-- Right: Audio Ignition & Configurator CTA -->
      <div class="flex items-center gap-4">
        <button id="ignitionBtn" class="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-[#E22020]/40 text-[#E22020] hover:bg-[#E22020] hover:text-white transition-all shadow-[0_0_20px_rgba(226,32,32,0.3)]">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span id="ignitionLabel">ENGINE START</span>
        </button>
        <a href="#telemetry" class="hidden sm:inline-block px-5 py-2 rounded-full bg-white text-black text-xs font-bold font-hud tracking-wider uppercase hover:bg-[#FFCC00] transition-colors">
          Specs HUD
        </a>
      </div>
    </div>
  </header>

  <!-- ================= 3D REAL FERRARI HERO ================= -->
  <section id="top" class="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-cockpit">
    <!-- WebGL Canvas: 3D REAL SCULPTED FERRARI -->
    <div class="absolute inset-0 z-0">
      <canvas id="ferrariCanvas" class="w-full h-full"></canvas>
    </div>

    <!-- Foreground Flight Deck -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 text-center pointer-events-none">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E22020]/40 bg-[#0B0E14]/80 backdrop-blur-md mb-6 font-hud text-xs pointer-events-auto">
        <span class="text-[#FFCC00] font-bold">SCUDERIA CORSE</span>
        <span class="text-white/40">|</span>
        <span class="text-white/80 tracking-widest uppercase">0-100 KM/H IN 2.5 SECONDS</span>
      </div>

      <h1 class="font-tech text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white uppercase leading-[0.92] mb-6">
        Scuderia. <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#E22020] via-white to-[#FFCC00]">Hypercar Motion.</span>
      </h1>

      <p class="max-w-2xl mx-auto text-sm sm:text-base text-white/70 font-light leading-relaxed mb-8">
        Hand-assembled in Maranello. Sculpted aerodynamic carbon tunnels generate 390kg of downforce at 250 km/h. Interact below to rotate, throttle, and paint the hypercar in real time.
      </p>

      <!-- Live Interactive Control Deck -->
      <div class="max-w-xl mx-auto bg-[#0B0E14]/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl font-hud pointer-events-auto">
        <!-- Throttle Slider -->
        <div class="flex items-center justify-between mb-3 text-xs">
          <span class="text-white/70 uppercase">THROTTLE ACCELERATION:</span>
          <span class="text-[#E22020] font-bold text-base" id="rpmLabel">IDLE // 1,200 RPM</span>
        </div>
        <input type="range" min="0" max="100" value="15" id="throttleSlider" class="w-full h-2 bg-[#050608] rounded-lg appearance-none cursor-pointer mb-5">

        <!-- Paint Switcher & Camera Mode -->
        <div class="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <div class="flex items-center gap-3">
            <span class="text-white/50 uppercase">LIVERY:</span>
            <button onclick="setFerrariColor('#E22020')" class="w-6 h-6 rounded-full bg-[#E22020] border-2 border-white shadow-[0_0_10px_#E22020] hover:scale-110 transition-transform" title="Rosso Corsa"></button>
            <button onclick="setFerrariColor('#FFCC00')" class="w-6 h-6 rounded-full bg-[#FFCC00] border-2 border-transparent hover:scale-110 transition-transform" title="Giallo Modena"></button>
            <button onclick="setFerrariColor('#8A8D93')" class="w-6 h-6 rounded-full bg-[#8A8D93] border-2 border-transparent hover:scale-110 transition-transform" title="Grigio Titanio"></button>
            <button onclick="setFerrariColor('#151618')" class="w-6 h-6 rounded-full bg-[#151618] border-2 border-white/30 hover:scale-110 transition-transform" title="Nero Daytona"></button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="resetCameraAngle()" class="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/80 hover:bg-white/20 transition-all text-[11px]">
              RESET ANGLE
            </button>
          </div>
        </div>
      </div>

      <!-- Real-time HUD Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 font-hud pointer-events-auto">
        <div class="bg-[#0B0E14]/70 p-4 rounded-xl border border-white/10 tilt-box">
          <span class="block text-3xl font-bold text-[#E22020]" id="speedDisplay">0 KM/H</span>
          <span class="text-[10px] text-white/50 uppercase tracking-widest mt-1">VELOCITY READOUT</span>
        </div>
        <div class="bg-[#0B0E14]/70 p-4 rounded-xl border border-white/10 tilt-box">
          <span class="block text-3xl font-bold text-white">1,000 CV</span>
          <span class="text-[10px] text-white/50 uppercase tracking-widest mt-1">HYBRID HORSEPOWER</span>
        </div>
        <div class="bg-[#0B0E14]/70 p-4 rounded-xl border border-white/10 tilt-box">
          <span class="block text-3xl font-bold text-white">800 Nm</span>
          <span class="text-[10px] text-white/50 uppercase tracking-widest mt-1">TORQUE CURVE</span>
        </div>
        <div class="bg-[#0B0E14]/70 p-4 rounded-xl border border-white/10 tilt-box">
          <span class="block text-3xl font-bold text-[#FFCC00]">340 KM/H</span>
          <span class="text-[10px] text-white/50 uppercase tracking-widest mt-1">MAX TRACK SPEED</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= SCROLLYTELLING CHAPTERS ================= -->
  <section id="telemetry" class="py-28 px-6 lg:px-12 bg-[#080B10] border-t border-white/10 relative font-hud">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Aerodynamic Venturi Technology -->
        <div>
          <span class="text-xs text-[#E22020] uppercase tracking-[0.3em] block mb-2">// 01. AERODYNAMIC VORTEX</span>
          <h2 class="font-tech text-4xl sm:text-5xl font-extrabold text-white uppercase leading-tight mb-6">
            Patented Shut-Off Gurney & Active Aero
          </h2>
          <p class="text-white/70 text-sm font-sans font-light leading-relaxed mb-6">
            The patented rear mobile active shut-off gurney integrates into the rear bodywork. At high speed, the actuator lowers the wedge element into the airflow, generating maximum downforce of 390kg without disrupting lateral aerodynamic balance.
          </p>

          <div class="space-y-4 border-l-2 border-[#E22020]/50 pl-6 my-8">
            <div class="tilt-box p-4 bg-[#0B0E14] rounded-xl border border-white/10">
              <h4 class="text-base text-white font-bold uppercase font-tech">Front Vortex Generators</h4>
              <p class="text-xs text-white/60 font-sans mt-1">Curved front diffusers channel turbulent tire air outward, keeping underbody airflow laminar.</p>
            </div>
            <div class="tilt-box p-4 bg-[#0B0E14] rounded-xl border border-white/10">
              <h4 class="text-base text-white font-bold uppercase font-tech">Forged Carbon Wheels</h4>
              <p class="text-xs text-white/60 font-sans mt-1">Five-spoke turbine aerodynamic geometry extracts thermal heat directly from the carbon-ceramic discs.</p>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Powertrain Blueprint -->
        <div class="bg-[#0B0E14] p-8 lg:p-12 rounded-3xl border border-[#E22020]/30 shadow-2xl relative tilt-box">
          <div class="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <span class="text-xs text-[#E22020] uppercase">HYBRID POWERTRAIN</span>
              <h3 class="font-tech text-2xl font-bold text-white mt-1">3.9L 90° V8 + 3 Electric Motors</h3>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] bg-[#E22020]/20 text-[#E22020] border border-[#E22020]/40 font-bold">8-SPEED F1 DUAL-CLUTCH</span>
          </div>

          <div class="py-6 space-y-4 text-xs">
            <div>
              <div class="flex justify-between mb-1 text-white/80">
                <span>Twin-Turbo Internal Combustion Output</span>
                <span class="text-[#E22020] font-bold">780 CV @ 7,500 RPM</span>
              </div>
              <div class="w-full h-1.5 bg-[#050608] rounded-full overflow-hidden">
                <div class="h-full bg-[#E22020]" style="width: 78%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1 text-white/80">
                <span>Front Axle Dual Electric Drive (RAC-e)</span>
                <span class="text-[#00F0FF] font-bold">220 CV Torque Vectoring</span>
              </div>
              <div class="w-full h-1.5 bg-[#050608] rounded-full overflow-hidden">
                <div class="h-full bg-[#00F0FF]" style="width: 22%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1 text-white/80">
                <span>Carbon-Ceramic Braking Deceleration</span>
                <span class="text-[#FFCC00] font-bold">100-0 km/h in 29.5 m</span>
              </div>
              <div class="w-full h-1.5 bg-[#050608] rounded-full overflow-hidden">
                <div class="h-full bg-[#FFCC00]" style="width: 95%"></div>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/10 flex items-center justify-between">
            <span class="text-white/50 text-xs">FIA-Homologated Hybrid Battery</span>
            <span class="font-tech text-lg text-[#E22020] font-bold">7.9 kWh Lithium-Ion</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= BESPOKE MARANELLO FOOTER ================= -->
  <footer class="py-16 px-6 lg:px-12 bg-[#040507] border-t border-white/10 font-hud">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <span class="font-tech text-2xl font-bold text-white uppercase tracking-tight">${brand}</span>
        <p class="text-xs text-white/50 mt-1">MARANELLO CHASSIS REGISTER // 2026 OFFICIAL HOMOLOGATION</p>
      </div>

      <div class="flex items-center gap-6 text-xs text-white/60">
        <span>FIORANO CIRCUIT: 1:19.00</span>
        <span>•</span>
        <span>MUGELLO: 1:47.30</span>
        <span>•</span>
        <span>MONZA: 1:44.20</span>
      </div>

      <div class="text-xs text-[#E22020] font-bold">
        © 2026 ${brand}. ASURA CINEMA PROTOCOL.
      </div>
    </div>
  </footer>

  <!-- ================= REAL 3D FERRARI THREE.JS ENGINE ================= -->
  <script>
    var scene, camera, renderer, ferrariGroup, carBodyMesh, wheels = [];
    var canvas = document.getElementById('ferrariCanvas');
    var carColor = new THREE.Color(0xE22020);
    var targetCarColor = new THREE.Color(0xE22020);
    var isDragging = false, prevMouseX = 0, prevMouseY = 0;
    var targetRotY = 0.4, targetRotX = 0.15;
    var currentSpeed = 0, targetSpeed = 0;
    var audioCtx = null, engineSound = false, osc1 = null, osc2 = null, engineGain = null;

    function initFerrari3D() {
      if (!canvas) return;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(12, 5, 20);

      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      // Studio Lighting
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      var keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(20, 30, 20);
      scene.add(keyLight);

      var redRimLight = new THREE.DirectionalLight(0xE22020, 2.5);
      redRimLight.position.set(-20, 10, -20);
      scene.add(redRimLight);

      var cyanFill = new THREE.DirectionalLight(0x00F0FF, 0.8);
      cyanFill.position.set(0, -10, 10);
      scene.add(cyanFill);

      // BUILD REAL FERRARI COMPOUND GEOMETRY
      ferrariGroup = new THREE.Group();
      scene.add(ferrariGroup);

      buildSculptedFerrari();

      // Window resize & mouse gyro
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScrollTrack);

      // Drag to rotate
      canvas.addEventListener('mousedown', function(e) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });
      window.addEventListener('mouseup', function() { isDragging = false; });
      window.addEventListener('mousemove', onMouseMove);

      animateFerrari();
    }

    function buildSculptedFerrari() {
      // 1. Aerodynamic Main Hull (Low-slung sculpted chassis)
      var bodyGeo = new THREE.BufferGeometry();
      
      // Parametric sculpted vertex mesh for sleek Ferrari SF90
      var width = 4.4, length = 9.6, height = 1.4;
      var pts = [
        // Front splitter & nose
        0, 0.2, 4.8,    -1.8, 0.3, 4.2,   1.8, 0.3, 4.2,
        0, 0.5, 3.8,    -1.9, 0.7, 3.2,   1.9, 0.7, 3.2,
        // Hood & Front Wheel Arches
        -1.9, 0.9, 2.2,  1.9, 0.9, 2.2,    0, 0.8, 2.4,
        // Windshield Base
        -1.5, 1.1, 1.2,  1.5, 1.1, 1.2,    0, 1.15, 1.4,
        // Cockpit Canopy Roof
        -1.2, 1.9, -0.6, 1.2, 1.9, -0.6,   0, 1.95, -0.6,
        // Rear Engine Bay Cover & Glass
        -1.6, 1.4, -2.4, 1.6, 1.4, -2.4,   0, 1.45, -2.4,
        // Rear Deck & Spoiler Lip
        -1.9, 1.1, -4.6, 1.9, 1.1, -4.6,   0, 1.15, -4.8,
        // Rear Diffuser Bottom
        -1.8, 0.4, -4.8, 1.8, 0.4, -4.8,   0, 0.3, -5.0
      ];

      // Triangulated faces for aerodynamic shell
      var indices = [
        0,1,3,  0,3,2,  1,4,3,  2,3,5,
        3,4,6,  3,6,8,  3,8,7,  3,7,5,
        6,9,11, 6,11,8, 8,11,10, 8,10,7,
        9,12,14, 9,14,11, 11,14,13, 11,13,10,
        12,15,17, 12,17,14, 14,17,16, 14,16,13,
        15,18,20, 15,20,17, 17,20,19, 17,19,16,
        18,21,23, 18,23,20, 20,23,22, 20,22,19
      ];

      bodyGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      bodyGeo.setIndex(indices);
      bodyGeo.computeVertexNormals();

      var paintMaterial = new THREE.MeshStandardMaterial({
        color: carColor,
        roughness: 0.12,
        metalness: 0.88,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });

      carBodyMesh = new THREE.Mesh(bodyGeo, paintMaterial);
      carBodyMesh.castShadow = true;
      ferrariGroup.add(carBodyMesh);

      // Cockpit Tinted Glass
      var glassGeo = new THREE.BufferGeometry();
      var glassPts = [
        -1.4, 1.15, 1.1,  1.4, 1.15, 1.1,
        -1.15, 1.92, -0.55, 1.15, 1.92, -0.55,
        -1.55, 1.42, -2.2, 1.55, 1.42, -2.2
      ];
      var glassIndices = [0,1,2, 1,3,2, 2,3,4, 3,5,4];
      glassGeo.setAttribute('position', new THREE.Float32BufferAttribute(glassPts, 3));
      glassGeo.setIndex(glassIndices);
      glassGeo.computeVertexNormals();

      var glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x111622,
        roughness: 0.05,
        transmission: 0.7,
        thickness: 0.5,
        transparent: true,
        opacity: 0.85
      });
      var glassMesh = new THREE.Mesh(glassGeo, glassMat);
      ferrariGroup.add(glassMesh);

      // 2. 4 Sculpted Wheels with 5-Spoke Alloys and Yellow Brembo Calipers
      var wheelPositions = [
        { x: -1.95, y: 0.6, z: 2.6 },  // Front Left
        { x: 1.95, y: 0.6, z: 2.6 },   // Front Right
        { x: -1.95, y: 0.65, z: -2.8 }, // Rear Left
        { x: 1.95, y: 0.65, z: -2.8 }  // Rear Right
      ];

      wheelPositions.forEach(function(pos) {
        var wGroup = new THREE.Group();
        wGroup.position.set(pos.x, pos.y, pos.z);

        // Tire Ring (Sculpted torus vector points)
        var tirePts = [];
        for (var a = 0; a < 32; a++) {
          var a1 = (a / 32) * Math.PI * 2;
          var a2 = ((a + 1) / 32) * Math.PI * 2;
          tirePts.push(
            0, Math.cos(a1) * 0.65, Math.sin(a1) * 0.65,
            0, Math.cos(a2) * 0.65, Math.sin(a2) * 0.65
          );
        }
        var tireGeo = new THREE.BufferGeometry();
        tireGeo.setAttribute('position', new THREE.Float32BufferAttribute(tirePts, 3));
        var tireMat = new THREE.LineBasicMaterial({ color: 0x1A1A1A, linewidth: 3 });
        var tireMesh = new THREE.LineSegments(tireGeo, tireMat);
        wGroup.add(tireMesh);

        // 5-Spoke Forged Alloy Star
        var spokePts = [];
        for (var s = 0; s < 5; s++) {
          var ang = (s / 5) * Math.PI * 2;
          spokePts.push(0, 0, 0,  (pos.x > 0 ? 0.2 : -0.2), Math.cos(ang) * 0.55, Math.sin(ang) * 0.55);
        }
        var spokeGeo = new THREE.BufferGeometry();
        spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokePts, 3));
        var spokeMat = new THREE.LineBasicMaterial({ color: 0xD4D4D8, linewidth: 2 });
        var spokeMesh = new THREE.LineSegments(spokeGeo, spokeMat);
        wGroup.add(spokeMesh);

        // Yellow Brembo Caliper Marker
        var calPts = [
          0, 0.35, 0.15,  0, 0.45, -0.15
        ];
        var calGeo = new THREE.BufferGeometry();
        calGeo.setAttribute('position', new THREE.Float32BufferAttribute(calPts, 3));
        var calMat = new THREE.LineBasicMaterial({ color: 0xFFCC00, linewidth: 4 });
        var calMesh = new THREE.LineSegments(calGeo, calMat);
        wGroup.add(calMesh);

        ferrariGroup.add(wGroup);
        wheels.push(wGroup);
      });

      // 3. LED Projector Headlights
      var hlLightL = new THREE.PointLight(0x00F0FF, 3, 15);
      hlLightL.position.set(-1.4, 0.6, 4.4);
      ferrariGroup.add(hlLightL);

      var hlLightR = new THREE.PointLight(0x00F0FF, 3, 15);
      hlLightR.position.set(1.4, 0.6, 4.4);
      ferrariGroup.add(hlLightR);

      // 4. Quad Taillights Glowing Red Rings
      var tlLightL = new THREE.PointLight(0xE22020, 2, 8);
      tlLightL.position.set(-1.4, 1.0, -4.7);
      ferrariGroup.add(tlLightL);

      var tlLightR = new THREE.PointLight(0xE22020, 2, 8);
      tlLightR.position.set(1.4, 1.0, -4.7);
      ferrariGroup.add(tlLightR);
    }

    function onResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e) {
      // Crosshair tracking
      var ch = document.getElementById('crosshair');
      if (ch) {
        ch.style.left = e.clientX + 'px';
        ch.style.top = e.clientY + 'px';
      }

      if (isDragging && ferrariGroup) {
        var dx = e.clientX - prevMouseX;
        var dy = e.clientY - prevMouseY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.004;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else if (!isDragging && ferrariGroup) {
        // Gyro tracking
        var normX = (e.clientX / window.innerWidth) - 0.5;
        var normY = (e.clientY / window.innerHeight) - 0.5;
        targetRotY = 0.4 + normX * 0.4;
        targetRotX = 0.15 + normY * 0.2;
      }
    }

    // Scroll-driven camera and vehicle translation
    function onScrollTrack() {
      var scrollY = window.scrollY;
      var maxScroll = document.body.scrollHeight - window.innerHeight;
      var scrollProgress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

      if (ferrariGroup) {
        // Rotate and drive smoothly as user scrolls
        ferrariGroup.rotation.y = targetRotY + (scrollProgress * Math.PI * 1.5);
        ferrariGroup.position.z = -scrollProgress * 6;
        ferrariGroup.position.x = Math.sin(scrollProgress * Math.PI) * 3;
      }
    }

    function resetCameraAngle() {
      targetRotY = 0.4;
      targetRotX = 0.15;
    }

    function setFerrariColor(hex) {
      targetCarColor = new THREE.Color(hex);
    }

    // Throttle & RPM Engine
    var throttleInput = document.getElementById('throttleSlider');
    if (throttleInput) {
      throttleInput.addEventListener('input', function(e) {
        var val = parseInt(e.target.value);
        targetSpeed = val * 3.4; // up to 340 km/h
        var rpm = 1200 + (val * 70);
        document.getElementById('rpmLabel').innerText = rpm.toLocaleString() + ' RPM // ' + (val > 60 ? 'HIGH BOOST' : 'CRUISING');
        document.getElementById('speedDisplay').innerText = Math.round(targetSpeed) + ' KM/H';

        if (engineSound && osc1) {
          osc1.frequency.setValueAtTime(60 + (val * 4.5), audioCtx.currentTime);
          osc2.frequency.setValueAtTime(120 + (val * 9), audioCtx.currentTime);
        }
      });
    }

    // V8 Engine Sound Synthesizer (Web Audio API)
    var ignBtn = document.getElementById('ignitionBtn');
    if (ignBtn) {
      ignBtn.addEventListener('click', function() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (!engineSound) {
          engineSound = true;
          document.getElementById('ignitionLabel').innerText = 'ENGINE RUNNING';
          ignBtn.classList.add('bg-[#E22020]', 'text-white');

          osc1 = audioCtx.createOscillator();
          osc2 = audioCtx.createOscillator();
          engineGain = audioCtx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(80, audioCtx.currentTime);
          osc2.frequency.setValueAtTime(160, audioCtx.currentTime);

          engineGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

          osc1.connect(engineGain);
          osc2.connect(engineGain);
          engineGain.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
        } else {
          engineSound = false;
          document.getElementById('ignitionLabel').innerText = 'ENGINE START';
          ignBtn.classList.remove('bg-[#E22020]', 'text-white');
          if (osc1) { osc1.stop(); osc2.stop(); }
        }
      });
    }

    function animateFerrari() {
      requestAnimationFrame(animateFerrari);
      if (!ferrariGroup) return;

      // Smooth rotation lerp
      ferrariGroup.rotation.y += (targetRotY - ferrariGroup.rotation.y) * 0.05;
      ferrariGroup.rotation.x += (targetRotX - ferrariGroup.rotation.x) * 0.05;

      // Color lerp
      carColor.lerp(targetCarColor, 0.08);
      if (carBodyMesh) carBodyMesh.material.color = carColor;

      // Spin wheels proportional to speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      wheels.forEach(function(w) {
        w.rotation.x += (currentSpeed + 5) * 0.002;
      });

      // Subtle engine vibration idle
      ferrariGroup.position.y = Math.sin(Date.now() * 0.02) * (0.02 + currentSpeed * 0.0003);

      renderer.render(scene, camera);
    }

    window.addEventListener('DOMContentLoaded', initFerrari3D);
  <\/script>
</body>
</html>`;
}

module.exports = { generateFerrariShowcaseHtml };
