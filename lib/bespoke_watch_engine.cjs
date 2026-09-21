/**
 * ASURA SUPREME CINEMA ENGINE: BESPOKE REAL 3D HAUTE HORLOGERIE & FLYING TOURBILLON
 * Brand: Chronos Atelier // Geneva Haute Horlogerie
 * Niche: Ultra-Luxury Mechanical Timepieces & Grand Complications
 * Anti-Slop Directive: NO abstract particle dots! REAL sculpted 3D mechanical watch model with moving hands, oscillating balance wheel, sapphire reflection, and high-frequency ticking.
 */

function generateWatchShowcaseHtml(brand, colors) {
  brand = brand || "Chronos Atelier // Geneva Haute Horlogerie";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} // Calibre 9801 Flying Tourbillon</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <style>
    :root {
      --sapphire-dark: #04060A;
      --sapphire-surface: #090D15;
      --gold-alloy: #E5A97C; /* 24K Rose Gold */
      --platinum-alloy: #D1D5DB; /* 950 Platinum */
      --titanium-alloy: #64748B; /* Grade 5 Titanium */
      --blued-steel: #2563EB;
      --ruby-jewel: #E11D48;
      --glass-border: rgba(255, 255, 255, 0.1);
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-crest: 'Cinzel', serif;
      --font-mono: 'Space Grotesk', monospace;
      --font-sans: 'Outfit', sans-serif;
    }

    * { box-sizing: border-box; }
    body {
      background-color: var(--sapphire-dark);
      color: #F8FAFC;
      font-family: var(--font-sans);
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .font-serif-luxury { font-family: var(--font-serif); }
    .font-crest { font-family: var(--font-crest); }
    .font-mono-hud { font-family: var(--font-mono); }

    /* Awesome Design Horological Precision Cursor */
    .watch-cursor-dot {
      position: fixed;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #E5A97C;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.08s ease-out;
    }
    .watch-cursor-ring {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(229, 169, 124, 0.6);
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.12s ease-out, border-color 0.3s ease;
    }
    .cursor-hover .watch-cursor-ring {
      width: 65px;
      height: 65px;
      background-color: rgba(229, 169, 124, 0.08);
      border-color: #FFFFFF;
    }

    /* Radial Horological Ambiance */
    .calibre-glow {
      background: radial-gradient(circle at 50% 38%, rgba(229, 169, 124, 0.12) 0%, rgba(9, 13, 21, 0.85) 60%, rgba(4, 6, 10, 1) 100%);
    }

    /* 3D Glass Cards & Specular Tilt */
    .glass-horology-card {
      background: rgba(12, 17, 26, 0.7);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
      transform-style: preserve-3d;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
      will-change: transform;
    }
    .glass-horology-card:hover {
      border-color: rgba(229, 169, 124, 0.35);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 169, 124, 0.15);
    }

    /* Guilloché Pattern Texture */
    .bg-guilloche-dial {
      background-image: radial-gradient(rgba(229, 169, 124, 0.08) 1px, transparent 0);
      background-size: 20px 20px;
    }

    /* Active Alloy Button Styling */
    .alloy-btn.active {
      background: rgba(229, 169, 124, 0.2);
      border-color: #E5A97C;
      color: #E5A97C;
      box-shadow: 0 0 15px rgba(229, 169, 124, 0.25);
    }
  </style>
</head>
<body class="selection:bg-amber-300 selection:text-black">

  <!-- Custom Cursor -->
  <div id="cursorDot" class="watch-cursor-dot hidden sm:block"></div>
  <div id="cursorRing" class="watch-cursor-ring hidden sm:block"></div>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 1. BESPOKE GENEVA HAUTE HORLOGERIE NAVIGATION CREST -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <header class="border-b border-white/10 bg-[#04060A]/85 backdrop-blur-2xl sticky top-0 z-50 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Crest Identity -->
      <div class="flex items-center space-x-3.5">
        <div class="w-10 h-10 rounded-full border border-amber-300/40 bg-amber-400/5 flex items-center justify-center font-crest text-sm text-amber-300 shadow-inner">
          &#x2655;
        </div>
        <div>
          <span class="font-crest text-base font-bold tracking-widest text-white block">CHRONOS ATELIER</span>
          <span class="text-[9px] font-mono-hud text-zinc-400 tracking-[0.25em] block uppercase">GENÈVE &bull; MANUFACTURE HORLOGÈRE 1888</span>
        </div>
      </div>

      <!-- Navigation Complications -->
      <nav class="hidden md:flex items-center space-x-8 text-xs font-mono-hud uppercase tracking-wider text-zinc-400">
        <a href="#viewport3d" class="hover:text-amber-300 transition">3D Flying Tourbillon</a>
        <a href="#calibre" class="hover:text-amber-300 transition">Calibre 9801</a>
        <a href="#finishing" class="hover:text-amber-300 transition">Hand Anglage</a>
        <a href="#bespoke" class="hover:text-amber-300 transition">Private Commission</a>
      </nav>

      <!-- Acoustic Ticking Synth Toggle & Inquire -->
      <div class="flex items-center space-x-3 text-xs font-mono-hud">
        <button id="tickToggleBtn" onclick="toggleWatchTick()" class="px-3.5 py-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 text-amber-300 flex items-center gap-2 hover:bg-amber-300/20 transition active:scale-95">
          <span id="tickIndicator" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span id="tickLabel">28,800 VPH ACOUSTICS</span>
        </button>

        <a href="#bespoke" class="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-white text-black font-crest font-bold text-xs hover:bg-amber-300 transition shadow-lg active:scale-95">
          ALLOCATION &rarr;
        </a>
      </div>
    </div>
  </header>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 2. REAL 3D MECHANICAL WATCH & FLYING TOURBILLON VIEWPORT -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <section id="viewport3d" class="calibre-glow relative min-h-screen flex flex-col items-center justify-center pt-8 pb-16 px-6 overflow-hidden">
    
    <!-- Title & Heritage Badge -->
    <div class="text-center space-y-3 z-20 max-w-4xl mx-auto">
      <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-300/30 bg-black/60 backdrop-blur-md text-xs font-mono-hud text-amber-300 shadow-lg">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        <span>REAL 3D MECHANICAL WATCH WITH OSCILLATING TOURBILLON &bull; DRAG TO ROTATE 360&deg;</span>
      </div>

      <h1 class="text-4xl sm:text-7xl font-crest font-bold text-white tracking-tight leading-[1.05]">
        The Grand Tourbillon.
      </h1>

      <p class="text-sm sm:text-base text-zinc-300 font-sans max-w-2xl mx-auto leading-relaxed">
        Engineered with a titanium flying tourbillon carriage rotating once every 60 seconds. Applied 24K gold Roman numerals, sapphire dome reflection, and hand-finished Côtes de Genève.
      </p>
    </div>

    <!-- 3D Three.js Interactive Watch Canvas -->
    <div class="relative w-full max-w-5xl h-[560px] sm:h-[640px] mt-8 rounded-3xl border border-white/10 bg-black/70 shadow-2xl overflow-hidden group">
      <canvas id="watchCanvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>

      <!-- Macro Loupe Toggle Button -->
      <button onclick="toggleLoupeMode()" id="loupeBtn" class="absolute top-6 left-6 z-20 px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono-hud text-zinc-300 hover:text-white hover:border-amber-300 transition flex items-center gap-2">
        <span class="text-sm">&#x2315;</span>
        <span id="loupeLabel">MACRO LOUPE ZOOM (TOURBILLON)</span>
      </button>

      <!-- Live Swiss Time Display -->
      <div class="absolute top-6 right-6 z-20 bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-xs font-mono-hud text-amber-300 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>GENÈVE TIME: <span id="swissLiveTime">12:00:00</span></span>
      </div>

      <!-- Metallurgy Alloy Switcher Dock -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/85 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/15 flex items-center space-x-3 text-xs font-mono-hud">
        <span class="text-zinc-400 text-[10px] uppercase tracking-wider font-bold pr-1">METALLURGY:</span>
        <button id="alloyRoseGold" onclick="setWatchAlloy('rosegold', this)" class="alloy-btn active px-3.5 py-1.5 rounded-xl border border-white/15 transition">
          24K ROSE GOLD
        </button>
        <button id="alloyPlatinum" onclick="setWatchAlloy('platinum', this)" class="alloy-btn px-3.5 py-1.5 rounded-xl border border-white/15 transition text-zinc-400 hover:text-white">
          950 PLATINUM
        </button>
        <button id="alloyTitanium" onclick="setWatchAlloy('titanium', this)" class="alloy-btn px-3.5 py-1.5 rounded-xl border border-white/15 transition text-zinc-400 hover:text-white">
          GRADE 5 TITANIUM
        </button>
      </div>
    </div>

    <!-- Telemetry Complications Grid -->
    <div id="calibre" class="max-w-6xl w-full mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left z-20">
      <div class="glass-horology-card p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// ESCAPEMENT RATE</div>
        <div class="text-2xl sm:text-3xl font-crest font-bold text-white mt-1">28,800 <span class="text-sm text-zinc-400 font-normal">VPH</span></div>
        <p class="text-xs text-zinc-400 mt-1">4Hz High-Frequency Swiss Lever Escapement</p>
      </div>

      <div class="glass-horology-card p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// FLYING TOURBILLON</div>
        <div class="text-2xl sm:text-3xl font-crest font-bold text-amber-300 mt-1">60 <span class="text-sm text-zinc-400 font-normal">SEC</span></div>
        <p class="text-xs text-zinc-400 mt-1">Full 360&deg; Cage Revolution Defying Gravity</p>
      </div>

      <div class="glass-horology-card p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// POWER RESERVE</div>
        <div class="text-2xl sm:text-3xl font-crest font-bold text-white mt-1">72 <span class="text-sm text-zinc-400 font-normal">HOURS</span></div>
        <p class="text-xs text-zinc-400 mt-1">Twin Series-Coupled Mainspring Barrels</p>
      </div>

      <div class="glass-horology-card p-6">
        <div class="text-[10px] font-mono-hud text-amber-400 uppercase tracking-widest">// JEWEL BEARINGS</div>
        <div class="text-2xl sm:text-3xl font-crest font-bold text-rose-400 mt-1">39 <span class="text-sm text-zinc-400 font-normal">RUBIES</span></div>
        <p class="text-xs text-zinc-400 mt-1">Synthetic Corundum Jewels in Gold Chatons</p>
      </div>
    </div>

  </section>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 3. HAUTE FINISHING & ANGLAGE ATELIER -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <section id="finishing" class="max-w-7xl mx-auto px-6 py-24 border-t border-white/10 space-y-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span class="text-xs font-mono-hud font-bold text-amber-400 uppercase tracking-widest">// GENÈVE POINÇON QUALITY</span>
        <h2 class="text-3xl sm:text-5xl font-crest font-bold text-white mt-2">Finishing to the Half-Micron</h2>
      </div>
      <p class="text-sm text-zinc-400 max-w-md">
        Every internal bridge, wheel flank, and screw head is hand-beveled by master artisans using gentian wood and diamond pastes in our Geneva ateliers.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-horology-card p-8 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-300/30 flex items-center justify-center text-amber-300 font-crest text-xl">
          01
        </div>
        <h3 class="text-xl font-crest font-bold text-white">Côtes de Genève</h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Parallel wave striations meticulously applied across the rhodium-plated nickel silver mainplates with microscopic precision.
        </p>
      </div>

      <div class="glass-horology-card p-8 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-300/30 flex items-center justify-center text-amber-300 font-crest text-xl">
          02
        </div>
        <h3 class="text-xl font-crest font-bold text-white">Mirror Anglage</h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Internal 45-degree chamfers on bridges hand-filed and burnished until specular reflection is completely free of tooling marks.
        </p>
      </div>

      <div class="glass-horology-card p-8 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-300/30 flex items-center justify-center text-amber-300 font-crest text-xl">
          03
        </div>
        <h3 class="text-xl font-crest font-bold text-white">Flame-Blued Screws</h3>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Carbon steel screws heated individually to 290&deg;C over brass shavings, forming an enduring sapphire oxide protective patina.
        </p>
      </div>
    </div>
  </section>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 4. PRIVATE ALLOCATION TERMINAL -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <section id="bespoke" class="max-w-4xl mx-auto px-6 py-24">
    <div class="glass-horology-card p-8 sm:p-12 relative">
      <div class="text-center space-y-3 mb-10">
        <span class="text-xs font-mono-hud font-bold text-amber-400 uppercase tracking-widest">// STRICT LIMITED ATELIER SERIES</span>
        <h3 class="text-3xl sm:text-5xl font-crest font-bold text-white">Commission an Allocation</h3>
        <p class="text-sm text-zinc-400 max-w-md mx-auto">
          Annual production is capped at 18 pieces worldwide. Each timepiece is hand-assembled and tested for 500 hours.
        </p>
      </div>

      <form onsubmit="handleWatchInquiry(event)" class="space-y-6 font-mono-hud text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">Patron Full Name</label>
            <input type="text" required placeholder="Lord Henry Beaumont" class="w-full bg-black/60 border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-300">
          </div>
          <div>
            <label class="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">Private Family Office / Email</label>
            <input type="email" required placeholder="beaumont@patron.ch" class="w-full bg-black/60 border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-300">
          </div>
        </div>

        <div>
          <label class="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">Preferred Metallurgy</label>
          <select class="w-full bg-black/60 border border-white/15 rounded-xl p-3.5 text-white focus:outline-none focus:border-amber-300">
            <option>24K Rose Gold (Ref. CHR-9801-RG)</option>
            <option>950 Platinum Rhodium (Ref. CHR-9801-PT)</option>
            <option>Grade 5 Titanium Monobloc (Ref. CHR-9801-TI)</option>
          </select>
        </div>

        <button type="submit" id="watchSubmitBtn" class="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-crest font-bold tracking-wider transition-all shadow-lg shadow-amber-400/20 active:scale-95 text-xs">
          TRANSMIT ALLOCATION COMMISSION PROTOCOL &rarr;
        </button>

        <div id="watchSuccessMsg" class="hidden text-center p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono-hud">
          &#x2713; COMMISSION REGISTERED: The Master Horologist will contact your family office within 24 hours.
        </div>
      </form>
    </div>
  </section>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 5. BESPOKE HAUTE HORLOGERIE FOOTER -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <footer class="border-t border-white/10 bg-[#04060A] py-14 px-6 font-mono-hud text-xs text-zinc-500">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center space-x-3">
        <span class="font-crest text-sm text-white font-bold tracking-widest">CHRONOS ATELIER GENÈVE</span>
        <span>&bull;</span>
        <span>HALLMARK OF GENEVA CERTIFIED</span>
      </div>
      <div class="flex items-center space-x-6 text-[11px]">
        <span>RUE DU RHÔNE 42, 1204 GENÈVE</span>
        <span>SWISS TIMEKEEPING PRECISION</span>
      </div>
    </div>
  </footer>

  <!-- ─────────────────────────────────────────────────────────────────── -->
  <!-- 6. THREE.JS REAL 3D SCULPTED WATCH & BALANCE WHEEL ENGINE -->
  <!-- ─────────────────────────────────────────────────────────────────── -->
  <script>
    var watchScene, watchCamera, watchRenderer;
    var watchMeshGroup, balanceWheelGroup, hourHand, minuteHand, secondHand;
    var caseMesh, bezelMesh, crownMesh;
    var isLoupeZoomed = false;

    // Alloy Colors
    var alloyMaterials = {
      rosegold: { color: 0xE5A97C, metalness: 0.92, roughness: 0.2 },
      platinum: { color: 0xD1D5DB, metalness: 0.95, roughness: 0.15 },
      titanium: { color: 0x64748B, metalness: 0.88, roughness: 0.32 }
    };
    var currentAlloy = 'rosegold';

    function initWatch3D() {
      var canvas = document.getElementById('watchCanvas');
      if (!canvas) return;

      watchScene = new THREE.Scene();
      watchCamera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      watchCamera.position.set(0, 0, 7.5);

      watchRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      watchRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
      watchRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      watchRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      watchRenderer.toneMappingExposure = 1.35;

      // Studio Lighting
      var ambient = new THREE.AmbientLight(0xFFFFFF, 0.9);
      watchScene.add(ambient);

      var keyLight = new THREE.DirectionalLight(0xFFF1E0, 2.4);
      keyLight.position.set(5, 6, 8);
      watchScene.add(keyLight);

      var rimLight = new THREE.DirectionalLight(0x93C5FD, 1.8);
      rimLight.position.set(-6, -4, 4);
      watchScene.add(rimLight);

      var topHighlight = new THREE.PointLight(0xFFE4C4, 1.5, 20);
      topHighlight.position.set(0, 4, 3);
      watchScene.add(topHighlight);

      // Main Watch Group
      watchMeshGroup = new THREE.Group();
      watchScene.add(watchMeshGroup);

      // 1. WATCH CASE (Outer stepped cylinder)
      var caseMat = new THREE.MeshStandardMaterial({
        color: alloyMaterials[currentAlloy].color,
        metalness: alloyMaterials[currentAlloy].metalness,
        roughness: alloyMaterials[currentAlloy].roughness
      });
      var caseGeo = new THREE.CylinderGeometry(2.4, 2.45, 0.5, 64);
      caseGeo.rotateX(Math.PI / 2);
      caseMesh = new THREE.Mesh(caseGeo, caseMat);
      watchMeshGroup.add(caseMesh);

      // 2. BEZEL (Polished top ring)
      var bezelGeo = new THREE.TorusGeometry(2.35, 0.12, 32, 64);
      bezelMesh = new THREE.Mesh(bezelGeo, caseMat);
      bezelMesh.position.z = 0.26;
      watchMeshGroup.add(bezelMesh);

      // 3. DIAL (High-Res Dynamic Sunburst Texture with Roman Numerals)
      var dialTex = createGuillocheDialTexture();
      var dialMat = new THREE.MeshStandardMaterial({
        map: dialTex,
        metalness: 0.85,
        roughness: 0.35,
        bumpScale: 0.05
      });
      var dialGeo = new THREE.CircleGeometry(2.28, 64);
      var dialMesh = new THREE.Mesh(dialGeo, dialMat);
      dialMesh.position.z = 0.24;
      watchMeshGroup.add(dialMesh);

      // 4. OPEN-HEART TOURBILLON APERTURE (Cut into 6 o'clock position)
      var tourbillonRingGeo = new THREE.RingGeometry(0.55, 0.65, 48);
      var tourbillonRingMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.15 });
      var tourbillonRing = new THREE.Mesh(tourbillonRingGeo, tourbillonRingMat);
      tourbillonRing.position.set(0, -1.0, 0.245);
      watchMeshGroup.add(tourbillonRing);

      // Sub-aperture black depth well
      var wellGeo = new THREE.CircleGeometry(0.55, 48);
      var wellMat = new THREE.MeshStandardMaterial({ color: 0x05070B, roughness: 0.9 });
      var wellMesh = new THREE.Mesh(wellGeo, wellMat);
      wellMesh.position.set(0, -1.0, 0.241);
      watchMeshGroup.add(wellMesh);

      // 5. OSCILLATING BALANCE WHEEL & HAIRSPRING
      balanceWheelGroup = new THREE.Group();
      balanceWheelGroup.position.set(0, -1.0, 0.28);

      var balanceRimGeo = new THREE.TorusGeometry(0.42, 0.025, 16, 48);
      var balanceMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.95, roughness: 0.1 });
      var balanceRim = new THREE.Mesh(balanceRimGeo, balanceMat);
      balanceWheelGroup.add(balanceRim);

      // 3 Balance Arms
      for (var a = 0; a < 3; a++) {
        var armGeo = new THREE.BoxGeometry(0.42, 0.035, 0.02);
        var arm = new THREE.Mesh(armGeo, balanceMat);
        arm.rotation.z = (a * Math.PI * 2) / 3;
        arm.position.x = Math.cos(arm.rotation.z) * 0.21;
        arm.position.y = Math.sin(arm.rotation.z) * 0.21;
        balanceWheelGroup.add(arm);
      }

      // Ruby Jewel Pivot
      var rubyGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 24);
      rubyGeo.rotateX(Math.PI / 2);
      var rubyMat = new THREE.MeshStandardMaterial({ color: 0xE11D48, metalness: 0.4, roughness: 0.1, transparent: true, opacity: 0.9 });
      var ruby = new THREE.Mesh(rubyGeo, rubyMat);
      balanceWheelGroup.add(ruby);

      watchMeshGroup.add(balanceWheelGroup);

      // 6. MECHANICAL WATCH HANDS (Blued Steel & Gold)
      var handMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, metalness: 0.85, roughness: 0.2 }); // Blued Steel

      // Hour Hand
      var hourGeo = new THREE.ConeGeometry(0.09, 1.2, 8);
      hourGeo.translate(0, 0.6, 0);
      hourHand = new THREE.Mesh(hourGeo, handMat);
      hourHand.position.z = 0.29;
      watchMeshGroup.add(hourHand);

      // Minute Hand
      var minuteGeo = new THREE.ConeGeometry(0.07, 1.8, 8);
      minuteGeo.translate(0, 0.9, 0);
      minuteHand = new THREE.Mesh(minuteGeo, handMat);
      minuteHand.position.z = 0.31;
      watchMeshGroup.add(minuteHand);

      // Sub-Seconds Hand (at 6 o'clock inside Tourbillon aperture)
      var secondGeo = new THREE.BoxGeometry(0.02, 0.45, 0.015);
      secondGeo.translate(0, 0.18, 0);
      var secondMat = new THREE.MeshStandardMaterial({ color: 0xE5A97C, metalness: 0.95, roughness: 0.1 });
      secondHand = new THREE.Mesh(secondGeo, secondMat);
      secondHand.position.set(0, -1.0, 0.33);
      watchMeshGroup.add(secondHand);

      // Center Cap Screw
      var capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 24);
      capGeo.rotateX(Math.PI / 2);
      var capMesh = new THREE.Mesh(capGeo, caseMat);
      capMesh.position.z = 0.34;
      watchMeshGroup.add(capMesh);

      // 7. CROWN (At 3 o'clock)
      var crownGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 32);
      crownGeo.rotateZ(Math.PI / 2);
      crownMesh = new THREE.Mesh(crownGeo, caseMat);
      crownMesh.position.set(2.55, 0, 0);
      watchMeshGroup.add(crownMesh);

      // 8. ALLIGATOR STRAP (Top and bottom extensions)
      var strapMat = new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.75, metalness: 0.05 });
      var topStrapGeo = new THREE.BoxGeometry(1.6, 2.2, 0.3);
      topStrapGeo.translate(0, 2.4, -0.1);
      var topStrap = new THREE.Mesh(topStrapGeo, strapMat);
      watchMeshGroup.add(topStrap);

      var btmStrapGeo = new THREE.BoxGeometry(1.6, 2.2, 0.3);
      btmStrapGeo.translate(0, -2.4, -0.1);
      var btmStrap = new THREE.Mesh(btmStrapGeo, strapMat);
      watchMeshGroup.add(btmStrap);

      // 9. SAPPHIRE GLASS DOME (Subtle specular glint)
      var glassGeo = new THREE.CircleGeometry(2.32, 64);
      var glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        transparent: true,
        opacity: 0.32,
        reflectivity: 0.9
      });
      var glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.z = 0.36;
      watchMeshGroup.add(glassMesh);

      // Subtle initial tilt
      watchMeshGroup.rotation.x = 0.25;
      watchMeshGroup.rotation.y = -0.35;

      setupWatchMouseInteraction(canvas);
      animateWatch();
    }

    // Dynamic Canvas Texture for Dial with Roman Numerals and Sunburst
    function createGuillocheDialTexture() {
      var tc = document.createElement('canvas');
      tc.width = 1024;
      tc.height = 1024;
      var ctx = tc.getContext('2d');

      // Radial Deep Sapphire Gradient
      var grad = ctx.createRadialGradient(512, 512, 50, 512, 512, 510);
      grad.addColorStop(0, '#101726');
      grad.addColorStop(0.7, '#070A10');
      grad.addColorStop(1, '#020305');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Sunburst Guilloché Rays
      ctx.strokeStyle = 'rgba(229, 169, 124, 0.08)';
      ctx.lineWidth = 1;
      for (var r = 0; r < 360; r += 1.5) {
        var rad = (r * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(512, 512);
        ctx.lineTo(512 + Math.cos(rad) * 490, 512 + Math.sin(rad) * 490);
        ctx.stroke();
      }

      // Outer Railway Minute Track
      ctx.strokeStyle = '#E5A97C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(512, 512, 470, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(512, 512, 450, 0, Math.PI * 2);
      ctx.stroke();

      for (var m = 0; m < 60; m++) {
        var mRad = (m * Math.PI * 2) / 60;
        var rInner = (m % 5 === 0) ? 440 : 455;
        ctx.lineWidth = (m % 5 === 0) ? 3 : 1;
        ctx.beginPath();
        ctx.moveTo(512 + Math.cos(mRad) * rInner, 512 + Math.sin(mRad) * rInner);
        ctx.lineTo(512 + Math.cos(mRad) * 470, 512 + Math.sin(mRad) * 470);
        ctx.stroke();
      }

      // Applied Roman Numerals
      ctx.font = 'bold 44px "Cinzel", serif';
      ctx.fillStyle = '#E5A97C';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var numerals = [
        { text: 'XII', r: -Math.PI / 2 },
        { text: 'I', r: -Math.PI / 3 },
        { text: 'II', r: -Math.PI / 6 },
        { text: 'III', r: 0 },
        { text: 'IV', r: Math.PI / 6 },
        { text: 'V', r: Math.PI / 3 },
        // VI is omitted for Tourbillon Aperture
        { text: 'VII', r: (Math.PI * 2) / 3 },
        { text: 'VIII', r: (Math.PI * 5) / 6 },
        { text: 'IX', r: Math.PI },
        { text: 'X', r: (Math.PI * 7) / 6 },
        { text: 'XI', r: (Math.PI * 4) / 3 }
      ];

      numerals.forEach(function(n) {
        var x = 512 + Math.cos(n.r) * 385;
        var y = 512 + Math.sin(n.r) * 385;
        ctx.fillText(n.text, x, y);
      });

      // Brand Typography on Dial
      ctx.font = 'bold 24px "Cinzel", serif';
      ctx.fillStyle = '#F8FAFC';
      ctx.fillText('CHRONOS ATELIER', 512, 310);
      ctx.font = '14px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('FLYING TOURBILLON // SWISS MADE', 512, 335);

      var tex = new THREE.CanvasTexture(tc);
      tex.needsUpdate = true;
      return tex;
    }

    // Mouse Drag Rotation
    var isDragging = false;
    var prevMouseX = 0, prevMouseY = 0;
    var targetRotY = -0.35, targetRotX = 0.25;

    function setupWatchMouseInteraction(canvas) {
      canvas.addEventListener('mousedown', function(e) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });
      window.addEventListener('mouseup', function() { isDragging = false; });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging || !watchMeshGroup) return;
        var deltaX = e.clientX - prevMouseX;
        var deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });

      // Touch events for mobile
      canvas.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
          isDragging = true;
          prevMouseX = e.touches[0].clientX;
          prevMouseY = e.touches[0].clientY;
        }
      }, { passive: true });
      window.addEventListener('touchend', function() { isDragging = false; });
      window.addEventListener('touchmove', function(e) {
        if (!isDragging || !watchMeshGroup || e.touches.length !== 1) return;
        var deltaX = e.touches[0].clientX - prevMouseX;
        var deltaY = e.touches[0].clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }, { passive: true });
    }

    // Loupe Toggle Mode
    function toggleLoupeMode() {
      isLoupeZoomed = !isLoupeZoomed;
      var lbl = document.getElementById('loupeLabel');
      if (lbl) lbl.innerText = isLoupeZoomed ? 'RESET MACRO VIEW' : 'MACRO LOUPE ZOOM (TOURBILLON)';
    }

    // Alloy Switcher
    function setWatchAlloy(alloy, btn) {
      currentAlloy = alloy;
      document.querySelectorAll('.alloy-btn').forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');

      var props = alloyMaterials[alloy];
      if (caseMesh) {
        caseMesh.material.color.setHex(props.color);
        caseMesh.material.metalness = props.metalness;
        caseMesh.material.roughness = props.roughness;
      }
      if (bezelMesh) {
        bezelMesh.material.color.setHex(props.color);
        bezelMesh.material.metalness = props.metalness;
        bezelMesh.material.roughness = props.roughness;
      }
      if (crownMesh) {
        crownMesh.material.color.setHex(props.color);
      }
    }

    // Animation Loop
    var tickAngle = 0;
    function animateWatch() {
      requestAnimationFrame(animateWatch);
      if (!watchScene || !watchCamera) return;

      // Smooth camera lerp for Loupe Mode
      var targetCamZ = isLoupeZoomed ? 3.4 : 7.5;
      var targetCamY = isLoupeZoomed ? -0.9 : 0;
      watchCamera.position.z += (targetCamZ - watchCamera.position.z) * 0.08;
      watchCamera.position.y += (targetCamY - watchCamera.position.y) * 0.08;

      // Smooth Drag Rotation Lerp
      if (watchMeshGroup) {
        watchMeshGroup.rotation.y += (targetRotY - watchMeshGroup.rotation.y) * 0.08;
        watchMeshGroup.rotation.x += (targetRotX - watchMeshGroup.rotation.x) * 0.08;
      }

      // Oscillate Balance Wheel with true harmonic sinusoidal physics (4Hz / 28,800 VPH)
      var now = Date.now() * 0.001;
      if (balanceWheelGroup) {
        balanceWheelGroup.rotation.z = Math.sin(now * 25.13) * 1.4; // 4Hz harmonic oscillation
      }

      // Realtime Hands Motion
      var d = new Date();
      var hours = d.getHours() % 12;
      var minutes = d.getMinutes();
      var seconds = d.getSeconds() + (d.getMilliseconds() / 1000);

      if (hourHand) hourHand.rotation.z = -((hours + minutes / 60) / 12) * Math.PI * 2;
      if (minuteHand) minuteHand.rotation.z = -((minutes + seconds / 60) / 60) * Math.PI * 2;
      if (secondHand) secondHand.rotation.z = -(seconds / 60) * Math.PI * 2;

      // Update Swiss Live Time Text
      var timeEl = document.getElementById('swissLiveTime');
      if (timeEl) {
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        var ss = String(d.getSeconds()).padStart(2, '0');
        timeEl.innerText = hh + ':' + mm + ':' + ss;
      }

      watchRenderer.render(watchScene, watchCamera);
    }

    // Acoustic 28,800 VPH Ticking Synthesizer
    var audioCtx = null;
    var tickRunning = true;
    var tickTimer = null;

    function toggleWatchTick() {
      tickRunning = !tickRunning;
      var ind = document.getElementById('tickIndicator');
      var lbl = document.getElementById('tickLabel');
      if (tickRunning) {
        if (ind) ind.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
        if (lbl) lbl.innerText = '28,800 VPH ACOUSTICS';
        playTickPulse();
      } else {
        if (ind) ind.className = 'w-2 h-2 rounded-full bg-zinc-600';
        if (lbl) lbl.innerText = 'ACOUSTICS MUTED';
        clearTimeout(tickTimer);
      }
    }

    function playTickPulse() {
      if (!tickRunning) return;
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(3600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.015);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.015);

      // 4Hz = 250ms interval between escapement ticks
      tickTimer = setTimeout(playTickPulse, 250);
    }
    // Auto-start ticking on first user click anywhere
    window.addEventListener('click', function initAudioOnce() {
      if (tickRunning && !audioCtx) playTickPulse();
      window.removeEventListener('click', initAudioOnce);
    });

    // Awesome Design Cursor Tracking & 3D Card Tilt
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

    document.querySelectorAll('a, button, input, select, .alloy-btn').forEach(function(el) {
      el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
    });

    document.querySelectorAll('.glass-horology-card').forEach(function(card) {
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

    function handleWatchInquiry(e) {
      e.preventDefault();
      var btn = document.getElementById('watchSubmitBtn');
      btn.innerText = '✓ ALLOCATION DISPATCHED';
      btn.disabled = true;
      document.getElementById('watchSuccessMsg').classList.remove('hidden');
    }

    window.addEventListener('DOMContentLoaded', initWatch3D);
  </script>
</body>
</html>`;
}

module.exports = { generateWatchShowcaseHtml };
