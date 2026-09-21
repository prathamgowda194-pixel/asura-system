/**
 * ==============================================================================
 * ASURA SUPREME MECHANICS ENGINE // "CINEMA FIRST, WEB SECOND"
 * ==============================================================================
 * Role: Chief Technical Director & Motion Architect for ASURA
 * Reference Doctrine: /ASURA_CORE_MECHANICS.md
 * 
 * Strict Mandatory Mechanics:
 * - MECHANIC 1: PIN-PARALLAX SHEETS (Cocoon Pattern)
 * - MECHANIC 2: FULL-VIEWPORT PHOTO CHAPTERS (FLOWERS/SIM Pattern)
 * - MECHANIC 3: GRADIENT SEAM FADES (No Hard Edges)
 * - MECHANIC 4: BRAND-HUE WASHES (Atmospheric Depth)
 * - MECHANIC 5: SCROLL-SCRUB HERO ZONE (Interactive Film with Lerp Smoothing)
 * - MECHANIC 6: HORIZONTAL RIDE (Down -> Right -> Down)
 * - MECHANIC 7: REVEAL SYSTEM (Cinematic Entrances with .rv, .in, .rt)
 * - MECHANIC 8: EDITORIAL HEADERS & FOOTERS (Difference Blend & Giant Wordmark)
 */

const fs = require('fs');
const path = require('path');

/**
 * Higgsfield Video Prompt Generator (Hook-First Formula)
 */
function generateHiggsfieldVideoPrompt(niche, brandName) {
  const normalized = (niche || '').toLowerCase();
  if (normalized.includes('watch') || normalized.includes('horology') || normalized.includes('timepiece')) {
    return `<!-- HIGGSFIELD AI VIDEO SIMULATION PROMPT:
SCENE CONTEXT: Cinematic extreme macro shot of the openworked tourbillon carriage and escapement wheel in 18K rose gold for ${brandName}. MAXIMUM ENERGY FROM FRAME ONE with 4Hz escapement pulsing and balance spring breathing. CAMERA: Continuous slow 360-degree helical push-in. LIGHTING: Volumetric cold rim light against warm champagne specular reflections.
-->`;
  }
  if (normalized.includes('coffee') || normalized.includes('cafe') || normalized.includes('dining') || normalized.includes('restaurant')) {
    return `<!-- HIGGSFIELD AI VIDEO SIMULATION PROMPT:
SCENE CONTEXT: Cinematic macro shot of single-estate peaberry coffee beans roasting and tumbling over glowing copper drums for ${brandName}... MAXIMUM ENERGY FROM FRAME ONE with bursting bean oils and buoyant micro-smoke... CAMERA: Continuous slow push-in at 120fps... LIGHTING: Volumetric warm backlight and amber embers glowing...
-->`;
  }
  if (normalized.includes('auto') || normalized.includes('car') || normalized.includes('motor')) {
    return `<!-- HIGGSFIELD AI VIDEO SIMULATION PROMPT:
SCENE CONTEXT: Aerodynamic air current flow visualization over the carbon-fiber monocoque and aero-diffuser of a hypercar for ${brandName}... MAXIMUM ENERGY FROM FRAME ONE with glowing neon aerodynamic streamlines... CAMERA: Low-angle tracking push-in with anamorphic lens flare... LIGHTING: High-contrast moody studio lighting with caustic reflections...
-->`;
  }
  return `<!-- HIGGSFIELD AI VIDEO SIMULATION PROMPT:
SCENE CONTEXT: Ultra-high-end editorial design atelier and tactile material textures for ${brandName}... MAXIMUM ENERGY FROM FRAME ONE with dynamic light refraction through fluted architectural glass... CAMERA: Slow continuous cinematic tracking shot... LIGHTING: Diffused golden-hour studio lighting with soft volumetric shadows...
-->`;
}

/**
 * Generate a Luxury Single-File Brand Website Adhering 100% to Supreme Mechanics
 */
function generateSupremeMechanicsWebsite(options) {
  const {
    brandName = "Chronos Atelier",
    tagline = "Haute Horlogerie & Gyro-Tourbillon Movements",
    niche = "watch",
    city = "Geneva / Paris",
    accentColor = "#D4AF37",
    darkColor = "#09090b",
    lightAccent = "#fde68a",
    videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-watch-mechanism-working-41130-large.mp4",
    posterSrc = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop",
    chapters = [
      {
        no: "01",
        title: "The Escapement",
        subtitle: "Mechanical Purity",
        desc: "Hand-beveled bridges, mirror-polished screws, and a free-sprung titanium balance wheel oscillating at 28,800 vibrations per hour.",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop"
      },
      {
        no: "02",
        title: "The Architecture",
        subtitle: "Monolithic Calibre",
        desc: "Every component is sculpted from Grade 5 Titanium and coated in micro-blasted anthracite PVD for extreme torsional stability.",
        img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop"
      }
    ],
    collection = [
      { id: "01", name: "Tourbillon Saphir", spec: "Twin-Axis 60s Cage", val: "Limited to 12 Units", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop" },
      { id: "02", name: "Chrono Monopoussoir", spec: "Column-Wheel Calibre", val: "Bespoke Rose Gold", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop" },
      { id: "03", name: "Astronomia Perpetual", spec: "Astronomical Celestial Disk", val: "Piece Unique", img: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1200&auto=format&fit=crop" },
      { id: "04", name: "Perpetuel Squelette", spec: "Openworked Architectural Bridges", val: "Titanium Grade 5", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop" }
    ]
  } = options;

  const higgsfieldPrompt = generateHiggsfieldVideoPrompt(niche, brandName);

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} // ${tagline}</title>
  
  <!-- MANDATORY SUPREME MECHANICS: GOOGLE FONTS CDN (EDITORIAL TYPOGRAPHY) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    :root {
      --brand-dark: ${darkColor};
      --brand-accent: ${accentColor};
      --brand-accent-light: ${lightAccent};
      --border-color: rgba(255, 255, 255, 0.12);
      --surface-wash: rgba(18, 18, 22, 0.85);
      --font-heading: 'Playfair Display', Georgia, serif;
      --font-body: 'Inter Tight', -apple-system, sans-serif;
      --font-mono: 'Space Grotesk', monospace;
    }

    body {
      background-color: var(--brand-dark);
      color: #f4f4f5;
      font-family: var(--font-body);
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, .font-heading {
      font-family: var(--font-heading);
      letter-spacing: -0.025em;
    }

    /* GLOBAL SVG NOISE OVERLAY (NO FLAT HEX BACKGROUNDS) */
    .bg-noise {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999;
      opacity: 0.038;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* <!-- USING MECHANIC 8: EDITORIAL HEADERS & FOOTERS (DIFFERENCE BLEND) --> */
    .editorial-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 60;
      mix-blend-mode: difference;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.75rem 3vw;
      pointer-events: none;
    }
    .editorial-header a, .editorial-header button {
      pointer-events: auto;
    }

    /* <!-- USING MECHANIC 5: SCROLL-SCRUB HERO ZONE (INTERACTIVE FILM) --> */
    .hero-zone {
      position: relative;
      height: 230vh;
    }
    .hero-sticky {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.72) contrast(1.08);
      transform: scale(1.03);
    }
    .hero-scrim {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(9,9,11,0.75) 85%);
      z-index: 1;
    }

    /* <!-- USING MECHANIC 1: PIN-PARALLAX SHEETS (COCOON PATTERN) --> */
    .pinwrap {
      position: relative;
      z-index: 20;
    }
    .pin {
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 0;
      overflow: hidden;
    }
    .spacer {
      height: 26vh; /* Breathing room before sheet */
    }
    .sheet {
      position: relative;
      z-index: 2;
      background: var(--brand-dark);
      border-top: 1px solid var(--border-color);
      box-shadow: 0 -25px 50px rgba(0, 0, 0, 0.7);
    }

    /* <!-- USING MECHANIC 2: FULL-VIEWPORT PHOTO CHAPTERS (FLOWERS/SIM PATTERN) --> */
    .ch {
      position: relative;
    }
    .ch .bg {
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 0;
      overflow: hidden;
    }
    .ch .bg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.05);
    }
    .ch .fl {
      position: relative;
      z-index: 2;
      margin-top: -100vh; /* Pulls content over bg */
    }
    .scene {
      min-height: 100vh;
      padding: 0 5vw;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    }
    .catplate {
      position: relative;
      margin-bottom: 12vh;
      width: min(460px, 92vw);
      background: var(--surface-wash);
      border: 1px solid var(--border-color);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      padding: 2.25rem;
      border-radius: 1.25rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.75);
    }

    /* <!-- USING MECHANIC 3: GRADIENT SEAM FADES (NO HARD EDGES) --> */
    .ch .bg::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 26vh;
      background: linear-gradient(to top, var(--brand-dark), transparent);
      z-index: 1;
      pointer-events: none;
    }
    .seam-top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 22vh;
      background: linear-gradient(to bottom, var(--brand-dark), transparent);
      z-index: 1;
      pointer-events: none;
    }

    /* <!-- USING MECHANIC 4: BRAND-HUE WASHES (ATMOSPHERIC DEPTH) --> */
    .winewrap {
      position: relative;
      overflow: hidden;
      background: var(--brand-dark);
    }
    .winewrap > .wb {
      position: absolute;
      inset: -20%;
      z-index: 0;
      pointer-events: none;
    }
    .winewrap > .wb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(56px) saturate(1.35);
      opacity: 0.38;
      transform: scale(1.25);
    }
    .winewrap > *:not(.wb) {
      position: relative;
      z-index: 2;
    }

    /* <!-- USING MECHANIC 6: HORIZONTAL RIDE (DOWN -> RIGHT -> DOWN) --> */
    .hs {
      position: relative;
      height: 320vh;
    }
    .hs-sticky {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .track {
      display: flex;
      gap: 3vw;
      padding: 0 6vw;
      will-change: transform;
    }
    .product-card {
      flex: 0 0 min(380px, 80vw);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: 1.25rem;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
    }
    .product-card:hover {
      transform: translateY(-8px);
      border-color: var(--brand-accent);
    }

    /* <!-- USING MECHANIC 7: REVEAL SYSTEM (CINEMATIC ENTRANCES) --> */
    .rv img, .rv video {
      transform: scale(1.12);
      opacity: 0;
      transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rv.in img, .rv.in video {
      transform: scale(1);
      opacity: 1;
    }
    .rt > * {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: calc(var(--i, 0) * 0.08s);
    }
    .rt.in > * {
      opacity: 1;
      transform: translateY(0);
    }

    /* <!-- USING MECHANIC 8: GIANT WORDMARK FOOTER --> */
    .giant-word {
      font-family: var(--font-heading);
      text-transform: uppercase;
      text-align: center;
      font-size: clamp(3rem, 13vw, 13rem);
      line-height: 0.85;
      letter-spacing: -0.03em;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.45);
      user-select: none;
      opacity: 0.85;
    }

    /* ACCESSIBILITY: PREFERS-REDUCED-MOTION */
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      .hero-zone { height: 100vh !important; }
      .hs { height: auto !important; }
      .hs-sticky { position: relative !important; overflow-x: auto !important; height: auto !important; padding: 4rem 0 !important; }
      .track { transform: none !important; }
    }
  </style>
</head>
<body class="selection:bg-[var(--brand-accent)] selection:text-black">

  <div class="bg-noise"></div>

  <!-- HIGGSFIELD SIMULATION ASSET PROMPT -->
  ${higgsfieldPrompt}
  <!-- NOTE: For production, replace src with Base64 string to eliminate network lag -->

  <!-- USING MECHANIC 8: EDITORIAL HEADER (MIX-BLEND-MODE DIFFERENCE) -->
  <header class="editorial-header font-mono text-xs uppercase tracking-widest">
    <div class="flex items-center space-x-3">
      <span class="w-2.5 h-2.5 rounded-full" style="background: var(--brand-accent);"></span>
      <span class="font-bold tracking-widest">${brandName}</span>
    </div>
    <nav class="hidden md:flex items-center space-x-8">
      <a href="#collection" class="hover:opacity-70 transition-opacity">Collection</a>
      <a href="#calibre" class="hover:opacity-70 transition-opacity">Calibre</a>
      <a href="#provenance" class="hover:opacity-70 transition-opacity">Provenance</a>
      <a href="#concierge" class="hover:opacity-70 transition-opacity">Concierge</a>
    </nav>
    <a href="#concierge" class="px-4 py-1.5 rounded-full border border-white/30 hover:border-white transition-all">
      VIP Inquire
    </a>
  </header>

  <!-- USING MECHANIC 5: SCROLL-SCRUB HERO ZONE (INTERACTIVE FILM) -->
  <section id="hero-scrub-zone" class="hero-zone">
    <div class="hero-sticky">
      <video id="scrub-video" class="hero-video" playsinline muted loop poster="${posterSrc}">
        <source src="${videoSrc}" type="video/mp4">
      </video>
      <div class="hero-scrim"></div>

      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <div class="inline-flex items-center space-x-2 px-4 py-1 rounded-full border border-white/20 backdrop-blur-md mb-6 font-mono text-[11px] tracking-widest text-[var(--brand-accent-light)] uppercase">
          <i data-lucide="compass" class="w-3.5 h-3.5"></i>
          <span>${city.toUpperCase()} // HAUTE HORLOGERIE</span>
        </div>
        <h1 class="text-4xl sm:text-7xl md:text-8xl font-heading font-bold text-white mb-6 leading-[0.92]">
          ${brandName}
        </h1>
        <p class="text-base sm:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed mb-10">
          ${tagline}
        </p>
        <div class="flex items-center space-x-2 font-mono text-xs text-zinc-400 tracking-widest uppercase">
          <i data-lucide="arrow-down" class="w-4 h-4 animate-bounce text-[var(--brand-accent)]"></i>
          <span>Scroll to scrub movement</span>
        </div>
      </div>
    </div>
  </section>

  <!-- USING MECHANIC 1: PIN-PARALLAX SHEETS (COCOON PATTERN) -->
  <section class="pinwrap">
    <div class="pin">
      <img src="${posterSrc}" alt="${brandName} Focus" class="w-full h-full object-cover filter brightness-[0.55]">
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)] via-transparent to-transparent"></div>
    </div>

    <div class="spacer"></div>

    <div class="sheet px-6 py-28">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[var(--border-color)] mb-20 text-center font-mono">
          <div class="rt in">
            <div class="text-3xl sm:text-5xl font-heading font-bold text-white mb-2" style="color: var(--brand-accent);">28,800</div>
            <div class="text-[11px] uppercase tracking-widest text-zinc-400">Vibrations / Hour</div>
          </div>
          <div class="rt in">
            <div class="text-3xl sm:text-5xl font-heading font-bold text-white mb-2" style="color: var(--brand-accent);">72 HR</div>
            <div class="text-[11px] uppercase tracking-widest text-zinc-400">Power Reserve</div>
          </div>
          <div class="rt in">
            <div class="text-3xl sm:text-5xl font-heading font-bold text-white mb-2" style="color: var(--brand-accent);">0.28 g</div>
            <div class="text-[11px] uppercase tracking-widest text-zinc-400">Tourbillon Cage Weight</div>
          </div>
          <div class="rt in">
            <div class="text-3xl sm:text-5xl font-heading font-bold text-white mb-2" style="color: var(--brand-accent);">01 / 12</div>
            <div class="text-[11px] uppercase tracking-widest text-zinc-400">Numbered Monoblocs</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div class="md:col-span-5 rt">
            <span class="text-xs font-mono tracking-widest text-[var(--brand-accent)] uppercase block mb-3" style="--i:0;">COGNITIVE ATELIER</span>
            <h2 class="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6" style="--i:1;">
              Crafted Beyond Tolerances.
            </h2>
            <p class="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 font-light" style="--i:2;">
              Every movement undergoes 400 hours of continuous hand-finishing. Anglage polished by hand using gentian wood pegs, hand-grained flank wheels, and black-polished tourbillon bridges.
            </p>
          </div>
          <div class="md:col-span-7 rv">
            <div class="rounded-2xl overflow-hidden border border-[var(--border-color)] aspect-[16/10] relative">
              <img src="${chapters[0].img}" alt="Craftsmanship" class="w-full h-full object-cover">
              <div class="seam-top"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- USING MECHANIC 6: HORIZONTAL RIDE (DOWN -> RIGHT -> DOWN) -->
  <section id="collection" class="hs">
    <div class="hs-sticky">
      <div class="w-full">
        <div class="px-8 sm:px-16 mb-8 flex items-baseline justify-between">
          <div>
            <span class="text-xs font-mono tracking-widest text-[var(--brand-accent)] uppercase block mb-2">CURATED EDITIONS</span>
            <h2 class="text-3xl sm:text-5xl font-bold text-white">The Collection</h2>
          </div>
          <div class="font-mono text-xs text-zinc-400 tracking-wider">
            Scroll down to advance horizontally &rarr;
          </div>
        </div>
        <div class="track">
          ${collection.map((item, idx) => `
            <div class="product-card" style="--i:${idx};">
              <div class="aspect-[4/3] overflow-hidden relative rv">
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
                <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] text-zinc-300">
                  REF. ${item.id}
                </div>
              </div>
              <div class="p-6">
                <h3 class="font-heading font-bold text-xl text-white mb-1">${item.name}</h3>
                <p class="font-mono text-xs text-zinc-400 mb-4">${item.spec}</p>
                <div class="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span class="text-xs font-mono text-[var(--brand-accent-light)]">${item.val}</span>
                  <a href="#concierge" class="text-xs font-mono uppercase text-white hover:text-[var(--brand-accent)] flex items-center space-x-1">
                    <span>Acquire</span>
                    <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- USING MECHANIC 2: FULL-VIEWPORT PHOTO CHAPTERS (FLOWERS/SIM PATTERN) & MECHANIC 3: GRADIENT SEAMS -->
  ${chapters.map((ch, idx) => `
    <section class="ch" id="chapter-${ch.no}">
      <!-- USING MECHANIC 3: GRADIENT SEAM FADES -->
      <div class="bg">
        <img src="${ch.img}" alt="${ch.title}">
        <div class="seam-top"></div>
      </div>
      <div class="fl">
        <div class="scene">
          <div class="catplate rt">
            <span class="text-[10px] font-mono uppercase tracking-widest text-[var(--brand-accent)] block mb-2" style="--i:0;">
              CHAPTER ${ch.no} // ${ch.subtitle.toUpperCase()}
            </span>
            <h3 class="font-heading text-2xl sm:text-3xl font-bold text-white mb-3" style="--i:1;">
              ${ch.title}
            </h3>
            <p class="text-xs text-zinc-300 leading-relaxed mb-6 font-light" style="--i:2;">
              ${ch.desc}
            </p>
            <a href="#concierge" class="inline-flex items-center space-x-2 text-xs font-mono uppercase text-[var(--brand-accent-light)] hover:underline" style="--i:3;">
              <span>Technical Specification</span>
              <i data-lucide="chevron-right" class="w-3 h-3"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  `).join('')}

  <!-- USING MECHANIC 4: BRAND-HUE WASHES (ATMOSPHERIC DEPTH) & MECHANIC 8: GIANT WORDMARK -->
  <section id="concierge" class="winewrap py-32 px-6 border-t border-[var(--border-color)]">
    <div class="wb">
      <img src="${posterSrc}" alt="Wash Backdrop">
    </div>

    <div class="max-w-4xl mx-auto text-center relative z-10 mb-24">
      <span class="text-xs font-mono uppercase tracking-widest text-[var(--brand-accent)] block mb-4">DIRECT CONCIERGE</span>
      <h2 class="text-3xl sm:text-6xl font-bold text-white mb-6">
        Reserve Private Allocation
      </h2>
      <p class="text-zinc-300 max-w-xl mx-auto text-sm sm:text-base font-light mb-10">
        Each timepiece is commissioned individually with custom dial finishing, hand-engraved rotor insignia, and bespoke leather strap casing.
      </p>

      <form onsubmit="event.preventDefault(); alert('VIP Consultation Request Registered with ${brandName} Concierge.');" class="max-w-md mx-auto space-y-4 text-left">
        <div>
          <label class="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Patron Full Name</label>
          <input type="text" required placeholder="Lord Alistair Sterling" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--brand-accent)] text-sm">
        </div>
        <div>
          <label class="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Direct Telegram / WhatsApp / Phone</label>
          <input type="text" required placeholder="+41 22 819 9000" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--brand-accent)] text-sm">
        </div>
        <button type="submit" class="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-all hover:scale-[1.02] shadow-2xl mt-4" style="background: var(--brand-accent); color: var(--brand-dark);">
          Request Private Salon Viewing
        </button>
      </form>
    </div>

    <!-- USING MECHANIC 8: GIANT STROKED WORDMARK FOOTER -->
    <div class="giant-word my-16">
      ${brandName}
    </div>

    <footer class="max-w-7xl mx-auto pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-4">
      <div>&copy; 2026 ${brandName}. Haute Horlogerie Provenance. All rights reserved.</div>
      <div class="flex items-center space-x-6">
        <span>Geneva</span>
        <span>Paris</span>
        <span>London</span>
        <span>Tokyo</span>
      </div>
    </footer>
  </section>

  <!-- JAVASCRIPT: LERP SMOOTHING FOR MECHANIC 5 & MECHANIC 6 + REVEAL SYSTEM -->
  <script>
    lucide.createIcons();

    // -------------------------------------------------------------
    // MECHANIC 5: SCROLL-SCRUB LERP SMOOTHING LOOP
    // -------------------------------------------------------------
    (function initScrollScrub() {
      const video = document.getElementById('scrub-video');
      const heroZone = document.getElementById('hero-scrub-zone');
      if (!video || !heroZone) return;

      let currentTime = 0;
      let targetTime = 0;
      let isPlayingFallback = false;

      function scrubLoop() {
        const startOffset = heroZone.offsetTop;
        const zoneHeight = heroZone.offsetHeight - window.innerHeight;
        const scrollY = window.scrollY;

        if (scrollY <= heroZone.offsetTop + heroZone.offsetHeight) {
          const progress = Math.min(1, Math.max(0, (scrollY - startOffset) / zoneHeight));
          
          if (video.duration && !isNaN(video.duration)) {
            targetTime = progress * video.duration;
            currentTime += (targetTime - currentTime) * 0.14; // Lerp easing
            if (Math.abs(targetTime - currentTime) > 0.001) {
              video.currentTime = currentTime;
            }
          }
        }
        requestAnimationFrame(scrubLoop);
      }

      video.addEventListener('loadedmetadata', () => {
        requestAnimationFrame(scrubLoop);
      });

      // Fallback play loop if scrub is prevented or restricted
      video.play().catch(() => {
        isPlayingFallback = true;
      });
      requestAnimationFrame(scrubLoop);
    })();

    // -------------------------------------------------------------
    // MECHANIC 6: HORIZONTAL RIDE (DOWN -> RIGHT -> DOWN)
    // -------------------------------------------------------------
    (function initHorizontalRide() {
      const hs = document.querySelector('.hs');
      const track = document.querySelector('.track');
      if (!hs || !track) return;

      function onScroll() {
        const maxScroll = hs.offsetHeight - window.innerHeight;
        const scrollY = window.scrollY;
        const offset = scrollY - hs.offsetTop;
        
        if (offset >= 0 && offset <= maxScroll) {
          const pct = offset / maxScroll;
          const targetX = -pct * (track.scrollWidth - window.innerWidth + 120);
          track.style.transform = \`translateX(\${targetX}px)\`;
        } else if (offset < 0) {
          track.style.transform = 'translateX(0px)';
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    // -------------------------------------------------------------
    // MECHANIC 7: REVEAL SYSTEM (CINEMATIC ENTRANCES)
    // -------------------------------------------------------------
    (function initRevealSystem() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.rv, .rt').forEach(el => observer.observe(el));
    })();
  </script>
</body>
</html>`;
}

module.exports = {
  generateHiggsfieldVideoPrompt,
  generateSupremeMechanicsWebsite
};
