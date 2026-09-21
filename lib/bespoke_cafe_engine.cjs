/**
 * ASURA SUPREME CINEMA ENGINE: BESPOKE REAL 3D ARTISANAL ROASTERY & DEGREE COFFEE
 * Brand: Rameshwaram Roastery // Heritage South Indian Artisanal Gastronomy
 * Niche: Pure Ghee Roast, Single-Origin Chikmagalur Peaberry & Brass Davarah Brew
 * Anti-Slop Directive: NO abstract particle clouds! REAL 3D Brass Davarah & Tumbler brewing showcase, interactive Roast Curve telemetry, and brewing acoustics.
 */

function generateCafeShowcaseHtml(brand, colors) {
  brand = brand || "Rameshwaram Roastery // Artisanal Gastronomy";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} // Pure Ghee Heritage & Artisanal Filter Coffee</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Marcellus&family=Space+Grotesk:wght@400;500;600&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <style>
    :root {
      --dark-roast: #0C0806;
      --espresso-surface: #140E0A;
      --terracotta: #C05621;
      --brass-gold: #D4AF37;
      --warm-amber: #F59E0B;
      --oat-cream: #FDFBF7;
      --glass-border: rgba(255, 255, 255, 0.08);
      --font-display: 'Syne', sans-serif;
      --font-serif: 'Marcellus', Georgia, serif;
      --font-mono: 'Space Grotesk', monospace;
      --font-sans: 'Manrope', sans-serif;
    }

    * { box-sizing: border-box; }
    body {
      background-color: var(--dark-roast);
      color: #FDFBF7;
      font-family: var(--font-sans);
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .font-serif-heritage { font-family: var(--font-serif); }
    .font-display-modern { font-family: var(--font-display); }
    .font-mono-hud { font-family: var(--font-mono); }

    /* Awesome Design Warm Precision Cursor */
    .cafe-cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--brass-gold);
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.08s ease-out;
    }
    .cafe-cursor-ring {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1.5px solid rgba(212, 175, 55, 0.6);
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.12s ease-out, border-color 0.3s ease;
    }
    .cursor-hover .cafe-cursor-ring {
      width: 65px;
      height: 65px;
      background-color: rgba(212, 175, 55, 0.1);
      border-color: #FFFFFF;
    }

    /* Tactile warm lighting gradient */
    .glow-hearth {
      background: radial-gradient(circle at 50% 35%, rgba(192, 86, 33, 0.18) 0%, rgba(20, 14, 10, 0.85) 60%, rgba(12, 8, 6, 1) 100%);
    }

    /* 3D Glass Bento Cards */
    .glass-bento {
      background: rgba(20, 14, 10, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
      transform-style: preserve-3d;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
      will-change: transform;
    }
    .glass-bento:hover {
      border-color: rgba(212, 175, 55, 0.35);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(192, 86, 33, 0.2);
    }
  </style>
</head>
<body class="selection:bg-amber-500 selection:text-black">

  <!-- Custom Cursor -->
  <div id="cursorDot" class="cafe-cursor-dot hidden sm:block"></div>
  <div id="cursorRing" class="cafe-cursor-ring hidden sm:block"></div>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 1. BESPOKE SOUTH INDIAN HERITAGE GASTRONOMY HEADER -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <header class="border-b border-white/10 bg-[#0C0806]/85 backdrop-blur-2xl sticky top-0 z-50 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Heritage Identity -->
      <div class="flex items-center space-x-3.5">
        <div class="w-10 h-10 rounded-full border border-amber-500/40 bg-amber-600/10 flex items-center justify-center font-serif-heritage text-sm text-amber-400 shadow-inner">
          &#x0950;
        </div>
        <div>
          <span class="font-serif-heritage text-base font-bold tracking-wider text-white block">RAMESHWARAM ROASTERY</span>
          <span class="text-[9px] font-mono-hud text-amber-400/80 tracking-[0.2em] block uppercase">PURE GHEE &bull; CHIKMAGALUR PEABERRY &bull; 1954</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center space-x-8 text-xs font-mono-hud uppercase tracking-wider text-zinc-400">
        <a href="#davarah3d" class="hover:text-amber-300 transition">3D Brass Davarah</a>
        <a href="#roastcurve" class="hover:text-amber-300 transition">Roast Telemetry</a>
        <a href="#menu" class="hover:text-amber-300 transition">Heritage Gastronomy</a>
        <a href="#terroir" class="hover:text-amber-300 transition">Estate Terroir</a>
      </nav>

      <!-- Brew Acoustic Toggle & Order -->
      <div class="flex items-center space-x-3 text-xs font-mono-hud">
        <button id="brewToggleBtn" onclick="toggleBrewAudio()" class="px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-2 hover:bg-amber-500/20 transition active:scale-95">
          <span id="brewIndicator" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span id="brewLabel">BREWING ACOUSTICS</span>
        </button>

        <a href="#menu" class="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-amber-400 text-black font-serif-heritage font-bold text-xs hover:bg-amber-300 transition shadow-lg active:scale-95">
          ORDER TASTING &rarr;
        </a>
      </div>
    </div>
  </header>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 2. REAL 3D BRASS DAVARAH & DEGREE COFFEE BREWING VIEWPORT -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <section id="davarah3d" class="glow-hearth relative min-h-screen flex flex-col items-center justify-center pt-8 pb-16 px-6 overflow-hidden">
    
    <!-- Title & Heritage Badge -->
    <div class="text-center space-y-3 z-20 max-w-4xl mx-auto">
      <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-black/60 backdrop-blur-md text-xs font-mono-hud text-amber-300 shadow-lg">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        <span>REAL 3D BRASS DAVARAH &amp; TUMBLER FILTER BREW &bull; DRAG TO ROTATE 360&deg;</span>
      </div>

      <h1 class="text-4xl sm:text-7xl font-serif-heritage font-bold text-white tracking-tight leading-[1.05]">
        The Sovereign Degree Brew.
      </h1>

      <p class="text-sm sm:text-base text-amber-200/80 font-sans max-w-2xl mx-auto leading-relaxed">
        Slow decoction dripped through virgin brass filters over single-origin Chikmagalur Arabica and 15% roasted chicory. Served scalding hot in a hand-hammered brass Davarah tumbler with bubbling A2 malai foam.
      </p>
    </div>

    <!-- 3D Three.js Interactive Davarah Canvas -->
    <div class="relative w-full max-w-5xl h-[560px] sm:h-[620px] mt-8 rounded-3xl border border-white/10 bg-black/70 shadow-2xl overflow-hidden group">
      <canvas id="cafeCanvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>

      <!-- Interactive Pour Action Button -->
      <button onclick="triggerDecoctionPour()" id="pourBtn" class="absolute top-6 left-6 z-20 px-4 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/30 text-xs font-mono-hud text-amber-300 hover:text-white hover:border-amber-400 transition flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span id="pourLabel">POUR HOT DECOCTION METRIC</span>
      </button>

      <!-- Live Brew Temperature HUD -->
      <div class="absolute top-6 right-6 z-20 bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-xs font-mono-hud text-amber-300 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>SERVING TEMP: <span id="brewTempDisplay">92.4&deg;C OPTIMAL</span></span>
      </div>

      <!-- Terroir Selection Bar -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/85 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/15 flex items-center space-x-3 text-xs font-mono-hud">
        <span class="text-zinc-400 text-[10px] uppercase tracking-wider font-bold pr-1">ESTATE TERROIR:</span>
        <button onclick="setCoffeeProfile('peaberry', this)" class="roast-btn active px-3.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/20 text-amber-300 font-bold transition">
          CHIKMAGALUR PEABERRY
        </button>
        <button onclick="setCoffeeProfile('coorg', this)" class="roast-btn px-3.5 py-1.5 rounded-xl border border-white/15 text-zinc-400 hover:text-white transition">
          COORG SHADE-GROWN
        </button>
        <button onclick="setCoffeeProfile('shevaroys', this)" class="roast-btn px-3.5 py-1.5 rounded-xl border border-white/15 text-zinc-400 hover:text-white transition">
          SHEVAROYS ELEVATION
        </button>
      </div>
    </div>

    <!-- Gastronomy Telemetry Grid -->
    <div id="roastcurve" class="max-w-6xl w-full mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left z-20">
      <div class="glass-bento p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// ROAST PROFILE</div>
        <div class="text-2xl sm:text-3xl font-serif-heritage font-bold text-white mt-1">218&deg;C <span class="text-sm text-amber-200/60 font-normal">MEDIUM-DARK</span></div>
        <p class="text-xs text-zinc-400 mt-1">Slow Drum Roasted Over Tamarind Wood Charcoal</p>
      </div>

      <div class="glass-bento p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// DECOCTION EXTRACT</div>
        <div class="text-2xl sm:text-3xl font-serif-heritage font-bold text-amber-300 mt-1">18.5 <span class="text-sm text-amber-200/60 font-normal">TDS %</span></div>
        <p class="text-xs text-zinc-400 mt-1">Double Gravity Drop Through Perforated Virgin Brass</p>
      </div>

      <div class="glass-bento p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// DAIRY SOURCE</div>
        <div class="text-2xl sm:text-3xl font-serif-heritage font-bold text-white mt-1">100% <span class="text-sm text-amber-200/60 font-normal">PURE A2 GHEE</span></div>
        <p class="text-xs text-zinc-400 mt-1">Single-Herd Hallikar &amp; Malnad Gidda Cow Milk</p>
      </div>

      <div class="glass-bento p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// BLEND RATIO</div>
        <div class="text-2xl sm:text-3xl font-serif-heritage font-bold text-amber-400 mt-1">85 : 15 <span class="text-sm text-amber-200/60 font-normal">RATIO</span></div>
        <p class="text-xs text-zinc-400 mt-1">85% Plantation Arabica + 15% French Jamnagar Chicory</p>
      </div>
    </div>

  </section>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 3. HERITAGE GASTRONOMY BENTO (IDLI, DOSA, FILTER BREW) -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <section id="menu" class="max-w-7xl mx-auto px-6 py-24 border-t border-white/10 space-y-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span class="text-xs font-mono-hud font-bold text-amber-400 uppercase tracking-widest">// HERITAGE CULINARY CODEX</span>
        <h2 class="text-3xl sm:text-5xl font-serif-heritage font-bold text-white mt-2">Artisanal Morning Rituals</h2>
      </div>
      <p class="text-sm text-zinc-400 max-w-md">
        Fermented for 18 hours in stone grinders. Cooked exclusively in pure clarified A2 butter over cast-iron tawas.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-bento p-8 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif-heritage text-xl">
          01
        </div>
        <h3 class="text-2xl font-serif-heritage font-bold text-white">Ghee Podi Button Idli</h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          14 miniature steamed rice cakes submerged in bubbling hot drumstick sambar, drowned in boiling A2 ghee and roasted gun-powder podi.
        </p>
        <div class="text-xs font-mono-hud text-amber-300 font-bold pt-2">&#x20B9; 140 &bull; SIGNATURE SPECIALITY</div>
      </div>

      <div class="glass-bento p-8 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif-heritage text-xl">
          02
        </div>
        <h3 class="text-2xl font-serif-heritage font-bold text-white">Open Butter Masala Dosa</h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Crisped over cast iron till golden honeycomb perfection. Layered with fiery garlic red chutney, potato mash, and a slab of white country butter.
        </p>
        <div class="text-xs font-mono-hud text-amber-300 font-bold pt-2">&#x20B9; 180 &bull; WOOD-FIRED CRISP</div>
      </div>

      <div class="glass-bento p-8 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif-heritage text-xl">
          03
        </div>
        <h3 class="text-2xl font-serif-heritage font-bold text-white">Davarah Degree Coffee</h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Frothy high-pour aeration between brass tumbler and davarah creating dense microfoam that holds its temperature for 20 minutes.
        </p>
        <div class="text-xs font-mono-hud text-amber-300 font-bold pt-2">&#x20B9; 60 &bull; HERITAGE CUP</div>
      </div>
    </div>
  </section>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 4. BESPOKE HERITAGE ROASTERY FOOTER -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <footer class="border-t border-white/10 bg-[#0C0806] py-14 px-6 font-mono-hud text-xs text-zinc-500">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center space-x-3">
        <span class="font-serif-heritage text-sm text-white font-bold tracking-wider">RAMESHWARAM ROASTERY &bull; BENGALURU</span>
        <span>&bull;</span>
        <span>KARNATAKA HERITAGE GASTROMONY</span>
      </div>
      <div class="flex items-center space-x-6 text-[11px]">
        <span>INDIRANAGAR &bull; JP NAGAR &bull; WHITEFIELD</span>
        <span>SERVED HOT AT 92&deg;C DAILY</span>
      </div>
    </div>
  </footer>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 5. THREE.JS REAL 3D BRASS DAVARAH & TUMBLER SCULPT ENGINE -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <script>
    var cafeScene, cafeCamera, cafeRenderer;
    var cafeMeshGroup, tumblerMesh, davarahMesh, coffeeLiquidMesh, foamMesh;
    var isPouring = false;

    function initCafe3D() {
      var canvas = document.getElementById('cafeCanvas');
      if (!canvas) return;

      cafeScene = new THREE.Scene();
      cafeCamera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      cafeCamera.position.set(0, 1.8, 6.5);

      cafeRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      cafeRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
      cafeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      cafeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      cafeRenderer.toneMappingExposure = 1.3;

      // Studio Warm Lighting
      var ambient = new THREE.AmbientLight(0xFFF7ED, 1.2);
      cafeScene.add(ambient);

      var hearthLight = new THREE.DirectionalLight(0xF59E0B, 2.5);
      hearthLight.position.set(4, 6, 5);
      cafeScene.add(hearthLight);

      var rimLight = new THREE.DirectionalLight(0xC05621, 1.8);
      rimLight.position.set(-5, 2, -3);
      cafeScene.add(rimLight);

      var topGlow = new THREE.PointLight(0xFFE4C4, 1.6, 15);
      topGlow.position.set(0, 5, 2);
      cafeScene.add(topGlow);

      // Main Group
      cafeMeshGroup = new THREE.Group();
      cafeScene.add(cafeMeshGroup);

      // Brass Material (Traditional South Indian Virgin Brass PBR)
      var brassMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.88,
        roughness: 0.22
      });

      // 1. THE DAVARAH (Wide flared rim basin base)
      var davarahGeo = new THREE.CylinderGeometry(1.85, 1.15, 0.9, 48, 1, true);
      davarahMesh = new THREE.Mesh(davarahGeo, brassMat);
      davarahMesh.position.y = -0.45;
      cafeMeshGroup.add(davarahMesh);

      // Davarah Base Plate
      var davarahBaseGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.1, 48);
      var davarahBase = new THREE.Mesh(davarahBaseGeo, brassMat);
      davarahBase.position.y = -0.9;
      cafeMeshGroup.add(davarahBase);

      // Davarah Flared Rim Lip
      var rimTorusGeo = new THREE.TorusGeometry(1.85, 0.08, 16, 48);
      rimTorusGeo.rotateX(Math.PI / 2);
      var davarahRim = new THREE.Mesh(rimTorusGeo, brassMat);
      davarahRim.position.y = 0.0;
      cafeMeshGroup.add(davarahRim);

      // 2. THE TUMBLER (Tapered Brass Coffee Glass)
      var tumblerGeo = new THREE.CylinderGeometry(1.05, 0.8, 1.65, 48, 1, true);
      tumblerMesh = new THREE.Mesh(tumblerGeo, brassMat);
      tumblerMesh.position.y = 0.45;
      cafeMeshGroup.add(tumblerMesh);

      // Tumbler Base
      var tumblerBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.08, 48);
      var tumblerBase = new THREE.Mesh(tumblerBaseGeo, brassMat);
      tumblerBase.position.y = -0.375;
      cafeMeshGroup.add(tumblerBase);

      // Tumbler Top Rolled Lip
      var tLipGeo = new THREE.TorusGeometry(1.05, 0.06, 16, 48);
      tLipGeo.rotateX(Math.PI / 2);
      var tLip = new THREE.Mesh(tLipGeo, brassMat);
      tLip.position.y = 1.275;
      cafeMeshGroup.add(tLip);

      // 3. HOT COFFEE DECOCTION & VELVET FOAM SURFACE
      var liquidGeo = new THREE.CircleGeometry(1.02, 48);
      liquidGeo.rotateX(-Math.PI / 2);
      var liquidMat = new THREE.MeshStandardMaterial({
        color: 0x3D2012, // Dark aromatic coffee decoction
        roughness: 0.15,
        metalness: 0.2
      });
      coffeeLiquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      coffeeLiquidMesh.position.y = 1.2;
      cafeMeshGroup.add(coffeeLiquidMesh);

      // Golden A2 Milk Froth Bubble Center
      var foamGeo = new THREE.CircleGeometry(0.85, 48);
      foamGeo.rotateX(-Math.PI / 2);
      var foamMat = new THREE.MeshStandardMaterial({
        color: 0xEAD8B1, // Creamy golden foam
        roughness: 0.6,
        metalness: 0.05
      });
      foamMesh = new THREE.Mesh(foamGeo, foamMat);
      foamMesh.position.y = 1.21;
      cafeMeshGroup.add(foamMesh);

      // Subtle initial tilt to admire the foam & brass reflection
      cafeMeshGroup.rotation.x = 0.35;
      cafeMeshGroup.rotation.y = -0.4;

      setupCafeMouseInteraction(canvas);
      animateCafe();
    }

    // Mouse Drag Rotation
    var isDragging = false;
    var prevX = 0, prevY = 0;
    var targetRotY = -0.4, targetRotX = 0.35;

    function setupCafeMouseInteraction(canvas) {
      canvas.addEventListener('mousedown', function(e) {
        isDragging = true;
        prevX = e.clientX; prevY = e.clientY;
      });
      window.addEventListener('mouseup', function() { isDragging = false; });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging || !cafeMeshGroup) return;
        var dx = e.clientX - prevX;
        var dy = e.clientY - prevY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
        prevX = e.clientX; prevY = e.clientY;
      });

      canvas.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
          isDragging = true;
          prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
        }
      }, { passive: true });
      window.addEventListener('touchend', function() { isDragging = false; });
      window.addEventListener('touchmove', function(e) {
        if (!isDragging || !cafeMeshGroup || e.touches.length !== 1) return;
        var dx = e.touches[0].clientX - prevX;
        var dy = e.touches[0].clientY - prevY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
        prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
      }, { passive: true });
    }

    function triggerDecoctionPour() {
      var btn = document.getElementById('pourBtn');
      if (btn) btn.innerText = '☕ AERATING HIGH-POUR...';
      playBrewAudioPulse();
      
      // Animated vibration & foam expansion
      var startTime = Date.now();
      var interval = setInterval(function() {
        var elapsed = (Date.now() - startTime) / 1000;
        if (elapsed > 1.8) {
          clearInterval(interval);
          if (btn) btn.innerText = '✓ OPTIMAL FOAM CROWN ACHIEVED';
          setTimeout(function() { if (btn) btn.innerText = 'POUR HOT DECOCTION METRIC'; }, 2500);
        } else {
          if (foamMesh) {
            foamMesh.scale.setScalar(1.0 + Math.sin(elapsed * 12) * 0.08);
          }
        }
      }, 30);
    }

    function setCoffeeProfile(profile, btn) {
      document.querySelectorAll('.roast-btn').forEach(function(b) {
        b.className = 'roast-btn px-3.5 py-1.5 rounded-xl border border-white/15 text-zinc-400 hover:text-white transition';
      });
      if (btn) {
        btn.className = 'roast-btn active px-3.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/20 text-amber-300 font-bold transition';
      }
    }

    function animateCafe() {
      requestAnimationFrame(animateCafe);
      if (!cafeScene || !cafeCamera) return;

      if (cafeMeshGroup) {
        cafeMeshGroup.rotation.y += (targetRotY - cafeMeshGroup.rotation.y) * 0.08;
        cafeMeshGroup.rotation.x += (targetRotX - cafeMeshGroup.rotation.x) * 0.08;
      }

      // Gentle warm breathing shimmer on foam
      var t = Date.now() * 0.002;
      if (foamMesh) foamMesh.position.y = 1.21 + Math.sin(t) * 0.004;

      cafeRenderer.render(cafeScene, cafeCamera);
    }

    // Web Audio API Coffee Brewing Synthesizer
    var audioCtx = null;
    var brewAudioRunning = false;

    function toggleBrewAudio() {
      brewAudioRunning = !brewAudioRunning;
      var ind = document.getElementById('brewIndicator');
      var lbl = document.getElementById('brewLabel');
      if (brewAudioRunning) {
        if (ind) ind.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
        if (lbl) lbl.innerText = 'BREWING ACOUSTICS: ON';
        playBrewAudioPulse();
      } else {
        if (ind) ind.className = 'w-2 h-2 rounded-full bg-zinc-600';
        if (lbl) lbl.innerText = 'ACOUSTICS MUTED';
      }
    }

    function playBrewAudioPulse() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      // Synthesize soothing simmering decoction & water percolation noise
      var bufSize = audioCtx.sampleRate * 1.5;
      var buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      var src = audioCtx.createBufferSource();
      src.buffer = buf;
      var filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, audioCtx.currentTime);
      filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

      var gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      src.start();
    }

    // Awesome Design Cursor & 3D Card Tilt
    var cDot = document.getElementById('cursorDot');
    var cRing = document.getElementById('cursorRing');
    var mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      if (cDot) { cDot.style.left = mouseX + 'px'; cDot.style.top = mouseY + 'px'; }
    });
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cRing) { cRing.style.left = ringX + 'px'; cRing.style.top = ringY + 'px'; }
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, input, .roast-btn').forEach(function(el) {
      el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
    });

    document.querySelectorAll('.glass-bento').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left - (rect.width / 2);
        var y = e.clientY - rect.top - (rect.height / 2);
        var rotX = (y / (rect.height / 2)) * -8;
        var rotY = (x / (rect.width / 2)) * 10;
        card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale3d(1.02, 1.02, 1.02)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    window.addEventListener('DOMContentLoaded', initCafe3D);
  </script>
</body>
</html>`;
}

module.exports = { generateCafeShowcaseHtml };
