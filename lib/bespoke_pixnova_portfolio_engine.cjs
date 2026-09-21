/**
 * BESPOKE PIXNOVA DARK PORTFOLIO ENGINE
 * ==============================================================================
 * Stack: React + Vite + Tailwind CSS + TypeScript + GSAP + Framer Motion + hls.js
 * Architecture:
 * - HSL Design System Tokens (--bg, --surface, --text, --muted, --stroke, --accent)
 * - Typography: Inter (300-700) and Instrument Serif (italic 400)
 * - Accent Gradient: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)
 * - Full HLS Stream Integration (Mux live stream + hls.js)
 * - Keyframes: scroll-down, role-fade-in, gradient-shift
 * - Sections: Loading Screen (000-100 rAF), Hero, Selected Works (7/5/5/7 Bento),
 *             Journal (4 pills), Explorations (300vh GSAP Parallax), Stats,
 *             Contact / Footer (Flipped HLS + GSAP Marquee)
 */

function generatePixnovaPortfolioHtml(brand = "Pixnova Studio", options = {}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brand} — Custom Agency Portfolio</title>

  <!-- Google Fonts: Inter (300-700) & Instrument Serif (italic 400) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- GSAP & ScrollTrigger -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

  <!-- hls.js -->
  <script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.15/dist/hls.min.js"></script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            body: ['Inter', 'sans-serif'],
            display: ['"Instrument Serif"', 'serif'],
          },
          colors: {
            bg: "hsl(var(--bg))",
            surface: "hsl(var(--surface))",
            "text-primary": "hsl(var(--text))",
            muted: "hsl(var(--muted))",
            stroke: "hsl(var(--stroke))",
            accent: "hsl(var(--accent))",
          },
        },
      },
    }
  </script>

  <style>
    :root {
      --font-body: 'Inter', sans-serif;
      --font-display: 'Instrument Serif', serif;

      /* HSL values without hsl() wrapper */
      --bg: 0 0% 4%;
      --surface: 0 0% 8%;
      --text: 0 0% 96%;
      --muted: 0 0% 53%;
      --stroke: 0 0% 12%;
      --accent: 0 0% 96%;
    }

    body {
      font-family: var(--font-body);
      background-color: hsl(var(--bg));
      color: hsl(var(--text));
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }

    /* Accent Gradient */
    .accent-gradient {
      background: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
    }

    .accent-gradient-text {
      background: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Keyframes */
    @keyframes scroll-down {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(200%); }
    }

    @keyframes role-fade-in {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .animate-scroll-down {
      animation: scroll-down 1.5s ease-in-out infinite;
    }

    .animate-role-fade-in {
      animation: role-fade-in 0.4s ease-out forwards;
    }

    .animate-gradient-shift {
      background-size: 200% 200%;
      animation: gradient-shift 6s ease infinite;
    }

    .halftone-overlay {
      background-image: radial-gradient(circle, #000 1px, transparent 1px);
      background-size: 4px 4px;
    }
  </style>
</head>
<body class="bg-bg text-text-primary selection:bg-[#4E85BF] selection:text-white">

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 1: LOADING SCREEN
  ════════════════════════════════════════════════════════════════════════ -->
  <div id="loadingScreen" class="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-8 md:p-14 select-none transition-opacity duration-700">
    <!-- Top-left: Portfolio label -->
    <div class="flex justify-between items-start">
      <span id="loadingPortfolioLabel" class="text-xs text-muted uppercase tracking-[0.3em] font-body transform -translate-y-5 opacity-0 transition-all duration-600">
        Portfolio
      </span>
      <span class="text-xs text-muted/60 uppercase tracking-widest font-mono">
        ${brand} © 2026
      </span>
    </div>

    <!-- Center: Rotating words ["Design", "Create", "Inspire"] cycling every 900ms -->
    <div class="flex justify-center items-center h-40 overflow-hidden">
      <span id="loadingWord" class="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80 transition-all duration-450 transform translate-y-5 opacity-0">
        Design
      </span>
    </div>

    <!-- Bottom-right: Counter display (000 -> 100 over 2700ms) & progress bar -->
    <div class="flex flex-col gap-6">
      <div class="flex justify-end items-baseline">
        <span id="loadingCounter" class="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
          000
        </span>
      </div>
      <div class="w-full h-[3px] bg-stroke/50 relative overflow-hidden rounded-full">
        <div id="loadingProgressBar" class="h-full accent-gradient transition-transform duration-75 origin-left scale-x-0" style="box-shadow: 0 0 8px rgba(137, 170, 204, 0.35);"></div>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 2: NAVBAR (Floating pill at top center)
  ════════════════════════════════════════════════════════════════════════ -->
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
    <nav id="navbarPill" class="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-all duration-300 pointer-events-auto">
      <!-- 1. Logo: 9x9 circle with accent gradient border, inner bg-bg with PX -->
      <a href="#hero" class="group relative w-9 h-9 rounded-full p-[1.5px] transition-transform duration-300 hover:scale-110 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full accent-gradient group-hover:bg-gradient-to-l transition-all duration-500"></div>
        <div class="relative w-full h-full rounded-full bg-bg flex items-center justify-center">
          <span class="font-display italic text-[13px] text-text-primary tracking-tight">PX</span>
        </div>
      </a>

      <!-- 2. Divider (hidden on mobile) -->
      <div class="hidden sm:block w-px h-5 bg-stroke mx-2"></div>

      <!-- 3. Nav Links -->
      <div class="flex items-center gap-1">
        <a href="#hero" class="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-text-primary bg-stroke/50 transition-all duration-200">Home</a>
        <a href="#works" class="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">Work</a>
        <a href="#journal" class="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">Journal</a>
        <a href="#explorations" class="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">About</a>
      </div>

      <!-- 4. Divider -->
      <div class="w-px h-5 bg-stroke mx-2"></div>

      <!-- 5. "Say hi" button with gradient hover border -->
      <a href="#contact" class="group relative text-xs sm:text-sm rounded-full p-[1.5px] transition-all duration-300">
        <span class="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <div class="relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface backdrop-blur-md text-text-primary font-medium">
          <span>Say hi</span>
          <span class="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </div>
      </a>
    </nav>
  </header>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 2: HERO
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="hero" class="relative w-full h-screen min-h-[680px] overflow-hidden flex flex-col justify-center items-center text-center px-4">
    <!-- Background Video: HLS Stream via hls.js -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <video id="heroVideo" class="absolute left-1/2 top-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2" autoPlay muted loop playsInline></video>
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent"></div>
    </div>

    <!-- Centered Hero Content -->
    <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center pt-16">
      <!-- Eyebrow -->
      <p class="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8 font-body opacity-0">
        COLLECTION &apos;26
      </p>

      <!-- Name -->
      <h1 class="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6 opacity-0">
        ${brand}
      </h1>

      <!-- Role line: A {role} agency partner -->
      <div class="blur-in text-lg md:text-2xl text-text-primary/90 font-light mb-4 opacity-0">
        <span>A </span>
        <span id="roleText" class="font-display italic text-text-primary animate-role-fade-in inline-block text-2xl md:text-3xl mx-1">
          Creative
        </span>
        <span> agency partner for world-class brands.</span>
      </div>

      <!-- Description -->
      <p class="blur-in text-sm md:text-base text-muted max-w-md mb-10 leading-relaxed opacity-0">
        Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
      </p>

      <!-- CTA Buttons -->
      <div class="blur-in inline-flex items-center gap-4 flex-wrap justify-center opacity-0">
        <a href="#works" class="group relative rounded-full text-sm px-7 py-3.5 font-medium transition-all duration-300 hover:scale-105 overflow-hidden">
          <span class="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1.5px]">
            <span class="block w-full h-full rounded-full bg-bg"></span>
          </span>
          <span class="relative z-10 bg-text-primary text-bg group-hover:bg-transparent group-hover:text-text-primary block px-7 py-3.5 -mx-7 -my-3.5 rounded-full transition-colors duration-300">
            See Works
          </span>
        </a>

        <a href="#contact" class="group relative rounded-full text-sm px-7 py-3.5 font-medium border-2 border-stroke bg-bg text-text-primary transition-all duration-300 hover:scale-105 hover:border-transparent">
          <span class="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span class="relative z-10">Reach out...</span>
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
      <span class="text-[10px] text-muted uppercase tracking-[0.2em] font-body">SCROLL</span>
      <div class="w-px h-10 bg-stroke relative overflow-hidden">
        <div class="w-full h-1/2 accent-gradient animate-scroll-down"></div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 3: SELECTED WORKS (Bento 7/5/5/7)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="works" class="bg-bg py-16 md:py-24">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <!-- Header -->
      <div class="flex items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-stroke"></div>
            <span class="text-xs text-muted uppercase tracking-[0.3em] font-body">Selected Work</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-normal text-text-primary tracking-tight mb-3">
            Featured <span class="font-display italic text-text-primary font-normal">projects</span>
          </h2>
          <p class="text-sm md:text-base text-muted max-w-lg">
            A curated selection of bespoke digital systems engineered for custom agencies worldwide.
          </p>
        </div>

        <a href="#contact" class="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium py-3 px-6 rounded-full border border-stroke bg-surface hover:border-transparent group relative transition-all duration-300">
          <span class="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span>View all work</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <!-- Bento Grid (7 / 5 / 5 / 7) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        <!-- 1. Automotive Motion (span 7) -->
        <div class="group relative overflow-hidden rounded-3xl bg-surface border border-stroke md:col-span-7 aspect-[16/10]">
          <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85" alt="Automotive Motion" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end transition-opacity duration-300 group-hover:opacity-30">
            <div>
              <span class="text-xs text-muted font-mono uppercase tracking-widest block mb-1">01 — Real-time WebGL Experience</span>
              <h3 class="text-xl md:text-2xl font-medium text-text-primary">Automotive Motion</h3>
            </div>
          </div>
          <div class="absolute inset-0 bg-bg/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center p-6 z-20">
            <div class="relative rounded-full p-[1.5px] overflow-hidden transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
              <div class="absolute inset-0 accent-gradient animate-gradient-shift"></div>
              <div class="relative px-6 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 shadow-2xl">
                <span>View —</span><span class="font-display italic text-base">Automotive Motion</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Urban Architecture (span 5) -->
        <div class="group relative overflow-hidden rounded-3xl bg-surface border border-stroke md:col-span-5 aspect-[16/10]">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" alt="Urban Architecture" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end transition-opacity duration-300 group-hover:opacity-30">
            <div>
              <span class="text-xs text-muted font-mono uppercase tracking-widest block mb-1">02 — Spatial Living Monolith</span>
              <h3 class="text-xl md:text-2xl font-medium text-text-primary">Urban Architecture</h3>
            </div>
          </div>
          <div class="absolute inset-0 bg-bg/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center p-6 z-20">
            <div class="relative rounded-full p-[1.5px] overflow-hidden transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
              <div class="absolute inset-0 accent-gradient animate-gradient-shift"></div>
              <div class="relative px-6 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 shadow-2xl">
                <span>View —</span><span class="font-display italic text-base">Urban Architecture</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Human Perspective (span 5) -->
        <div class="group relative overflow-hidden rounded-3xl bg-surface border border-stroke md:col-span-5 aspect-[16/10]">
          <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85" alt="Human Perspective" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end transition-opacity duration-300 group-hover:opacity-30">
            <div>
              <span class="text-xs text-muted font-mono uppercase tracking-widest block mb-1">03 — Editorial & Haute Horlogerie</span>
              <h3 class="text-xl md:text-2xl font-medium text-text-primary">Human Perspective</h3>
            </div>
          </div>
          <div class="absolute inset-0 bg-bg/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center p-6 z-20">
            <div class="relative rounded-full p-[1.5px] overflow-hidden transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
              <div class="absolute inset-0 accent-gradient animate-gradient-shift"></div>
              <div class="relative px-6 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 shadow-2xl">
                <span>View —</span><span class="font-display italic text-base">Human Perspective</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Brand Identity (span 7) -->
        <div class="group relative overflow-hidden rounded-3xl bg-surface border border-stroke md:col-span-7 aspect-[16/10]">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85" alt="Brand Identity" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end transition-opacity duration-300 group-hover:opacity-30">
            <div>
              <span class="text-xs text-muted font-mono uppercase tracking-widest block mb-1">04 — Design System & Interaction</span>
              <h3 class="text-xl md:text-2xl font-medium text-text-primary">Brand Identity</h3>
            </div>
          </div>
          <div class="absolute inset-0 bg-bg/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center p-6 z-20">
            <div class="relative rounded-full p-[1.5px] overflow-hidden transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
              <div class="absolute inset-0 accent-gradient animate-gradient-shift"></div>
              <div class="relative px-6 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 shadow-2xl">
                <span>View —</span><span class="font-display italic text-base">Brand Identity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 4: JOURNAL (4 Horizontal Pills)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="journal" class="bg-bg py-16 md:py-24 border-t border-stroke/40">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <div class="flex items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-stroke"></div>
            <span class="text-xs text-muted uppercase tracking-[0.3em] font-body">Journal</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-normal text-text-primary tracking-tight mb-3">
            Recent <span class="font-display italic text-text-primary font-normal">thoughts</span>
          </h2>
          <p class="text-sm md:text-base text-muted max-w-lg">
            Notes on bespoke digital architecture, interaction engineering, and modern creative agency craft.
          </p>
        </div>

        <a href="#contact" class="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium py-3 px-6 rounded-full border border-stroke bg-surface hover:border-transparent group relative transition-all duration-300">
          <span class="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span>View all</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <!-- 4 Entries -->
      <div class="flex flex-col gap-4">
        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[32px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" alt="Kinetic Spaces" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Motion Systems</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">The Architecture of Kinetic Digital Spaces</h3>
            </div>
          </div>
          <div class="flex items-center gap-6 sm:pr-4 text-xs text-muted font-mono pl-18 sm:pl-0">
            <span>4 min read</span><span class="hidden sm:inline">•</span><span>Sep 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>

        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[32px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80" alt="Agency Portfolios" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Strategy</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">Why Agency Portfolios Fail at Conversion</h3>
            </div>
          </div>
          <div class="flex items-center gap-6 sm:pr-4 text-xs text-muted font-mono pl-18 sm:pl-0">
            <span>6 min read</span><span class="hidden sm:inline">•</span><span>Aug 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>

        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[32px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80" alt="Precision WebGL" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Engineering</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">Precision WebGL: Sculpted Realities on the Edge</h3>
            </div>
          </div>
          <div class="flex items-center gap-6 sm:pr-4 text-xs text-muted font-mono pl-18 sm:pl-0">
            <span>5 min read</span><span class="hidden sm:inline">•</span><span>Jul 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>

        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[32px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=300&q=80" alt="Editorial Web" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Typography</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">Instrument Serif &amp; The New Editorial Web</h3>
            </div>
          </div>
          <div class="flex items-center gap-6 sm:pr-4 text-xs text-muted font-mono pl-18 sm:pl-0">
            <span>3 min read</span><span class="hidden sm:inline">•</span><span>Jun 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 5: EXPLORATIONS (300vh Scroll-Driven Parallax Gallery)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="explorations" class="relative min-h-[300vh] bg-bg overflow-hidden border-t border-stroke/40">
    <!-- Layer 1: Pinned Center -->
    <div id="explorationsPin" class="h-screen w-full flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10 sticky top-0">
      <div class="max-w-md pointer-events-auto bg-bg/60 backdrop-blur-md p-8 rounded-3xl border border-stroke/50 shadow-2xl">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-8 h-px bg-stroke"></div>
          <span class="text-xs text-muted uppercase tracking-[0.3em] font-body">Explorations</span>
          <div class="w-8 h-px bg-stroke"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-normal text-text-primary tracking-tight mb-3">
          Visual <span class="font-display italic text-text-primary font-normal">playground</span>
        </h2>
        <p class="text-xs md:text-sm text-muted mb-6 leading-relaxed">
          Experimental 3D shaders, generative tokens, and interface prototypes designed in the Pixnova research lab.
        </p>
        <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium py-2.5 px-5 rounded-full border border-stroke bg-surface hover:border-transparent group relative transition-all duration-300">
          <span class="absolute -inset-[1px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span>Follow on Dribbble</span>
          <span class="text-xs">↗</span>
        </a>
      </div>
    </div>

    <!-- Layer 2: Parallax Columns -->
    <div class="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pointer-events-none -mt-[100vh]">
      <div class="grid grid-cols-2 gap-8 md:gap-40 pt-24 pb-48">
        <!-- Col 1 -->
        <div id="colLeft" class="flex flex-col gap-32 md:gap-48 items-center pointer-events-auto">
          <div onclick="openLightbox('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85', 'Kinetic Liquid Surface')" class="group cursor-pointer aspect-square w-full max-w-[280px] md:max-w-[340px] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-105 -rotate-3 hover:rotate-0 hover:border-white/30">
            <div class="w-full h-full rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="Kinetic Liquid Surface" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-xs text-white font-medium">Kinetic Liquid Surface</span>
              </div>
            </div>
          </div>

          <div onclick="openLightbox('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', 'Monolithic Structure')" class="group cursor-pointer aspect-square w-full max-w-[280px] md:max-w-[340px] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-105 rotate-4 hover:rotate-0 hover:border-white/30">
            <div class="w-full h-full rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" alt="Monolithic Structure" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-xs text-white font-medium">Monolithic Titanium Structure</span>
              </div>
            </div>
          </div>

          <div onclick="openLightbox('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85', 'Spatial Audio Waveforms')" class="group cursor-pointer aspect-square w-full max-w-[280px] md:max-w-[340px] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-105 -rotate-2 hover:rotate-0 hover:border-white/30">
            <div class="w-full h-full rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80" alt="Spatial Audio Waveforms" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-xs text-white font-medium">Spatial Audio Waveforms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Col 2 -->
        <div id="colRight" class="flex flex-col gap-32 md:gap-48 items-center pointer-events-auto mt-24">
          <div onclick="openLightbox('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85', 'Holographic Typography')" class="group cursor-pointer aspect-square w-full max-w-[280px] md:max-w-[340px] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-105 rotate-5 hover:rotate-0 hover:border-white/30">
            <div class="w-full h-full rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80" alt="Holographic Typography" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-xs text-white font-medium">Holographic Typography</span>
              </div>
            </div>
          </div>

          <div onclick="openLightbox('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85', 'Zero-G Particles')" class="group cursor-pointer aspect-square w-full max-w-[280px] md:max-w-[340px] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-105 -rotate-4 hover:rotate-0 hover:border-white/30">
            <div class="w-full h-full rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80" alt="Zero-G Particles" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-xs text-white font-medium">Zero-G Particles Simulation</span>
              </div>
            </div>
          </div>

          <div onclick="openLightbox('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85', 'Dark Neomorphic')" class="group cursor-pointer aspect-square w-full max-w-[280px] md:max-w-[340px] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-105 rotate-3 hover:rotate-0 hover:border-white/30">
            <div class="w-full h-full rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" alt="Dark Neomorphic" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-xs text-white font-medium">Dark Neomorphic Interfaces</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div id="lightboxModal" class="hidden fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer" onclick="closeLightbox()">
      <div onclick="event.stopPropagation()" class="max-w-2xl w-full bg-surface border border-stroke rounded-3xl p-4 overflow-hidden shadow-2xl">
        <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
          <img id="lightboxImg" src="" alt="Exploration View" class="w-full h-full object-cover" />
        </div>
        <div class="flex items-center justify-between px-2">
          <h3 id="lightboxTitle" class="text-lg font-medium text-text-primary"></h3>
          <button onclick="closeLightbox()" class="text-xs text-muted uppercase tracking-widest px-3 py-1.5 rounded-full border border-stroke hover:text-white">
            Close ✕
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 6: STATS
  ════════════════════════════════════════════════════════════════════════ -->
  <section class="bg-bg py-16 md:py-24 border-t border-stroke/40">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div class="flex flex-col p-8 rounded-3xl bg-surface/40 border border-stroke relative overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full accent-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <span class="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-3 leading-none">20+</span>
          <h3 class="text-base md:text-lg font-medium text-text-primary mb-2">Years Experience</h3>
          <p class="text-xs md:text-sm text-muted leading-relaxed">Mastering digital craft, spatial interfaces, and agency production.</p>
        </div>

        <div class="flex flex-col p-8 rounded-3xl bg-surface/40 border border-stroke relative overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full accent-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <span class="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-3 leading-none">95+</span>
          <h3 class="text-base md:text-lg font-medium text-text-primary mb-2">Projects Done</h3>
          <p class="text-xs md:text-sm text-muted leading-relaxed">Bespoke high-conversion platforms built for global partners.</p>
        </div>

        <div class="flex flex-col p-8 rounded-3xl bg-surface/40 border border-stroke relative overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full accent-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <span class="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-3 leading-none">200%</span>
          <h3 class="text-base md:text-lg font-medium text-text-primary mb-2">Satisfied Clients</h3>
          <p class="text-xs md:text-sm text-muted leading-relaxed">Average conversion lift and engagement surge post-launch.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 7: CONTACT / FOOTER (Flipped HLS + GSAP Marquee)
  ════════════════════════════════════════════════════════════════════════ -->
  <footer id="contact" class="relative bg-bg pt-20 md:pt-28 pb-8 md:pb-12 overflow-hidden">
    <!-- Background Video: Flipped vertically scale-y-[-1] with bg-black/60 overlay -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <video id="footerVideo" class="absolute left-1/2 top-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]" autoPlay muted loop playsInline></video>
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"></div>
    </div>

    <!-- GSAP Infinite Marquee: "BUILDING THE FUTURE • " repeated 10x -->
    <div class="relative z-10 w-full overflow-hidden whitespace-nowrap mb-16 md:mb-24 pointer-events-none opacity-40">
      <div id="marqueeInner" class="inline-block text-5xl md:text-8xl font-display uppercase tracking-widest text-text-primary/70">
        BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • BUILDING THE FUTURE • 
      </div>
    </div>

    <!-- Main CTA Area -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
      <span class="text-xs text-muted uppercase tracking-[0.3em] font-body mb-4">Start a Conversation</span>
      <h2 class="text-4xl md:text-7xl lg:text-8xl font-display italic text-text-primary mb-8 leading-tight">
        Let’s craft something iconic.
      </h2>
      <p class="text-sm md:text-base text-muted max-w-md mb-10">
        Partner with ${brand} to engineer custom web architectures, WebGL interactions, and high-impact agency products.
      </p>

      <!-- Email Button with gradient hover border ring -->
      <a href="mailto:hello@pixnova.agency" class="group relative rounded-full text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 font-medium border border-stroke bg-surface text-text-primary transition-all duration-300 hover:scale-105 hover:border-transparent mb-20 shadow-2xl">
        <span class="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
        <span class="flex items-center gap-3">
          <span>hello@pixnova.agency</span>
          <span class="text-sm transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </span>
      </a>
    </div>

    <!-- Footer Bar -->
    <div class="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-8 border-t border-stroke/40 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted font-body">
      <div class="flex items-center gap-2.5">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="text-text-primary/90 font-medium">Available for new client projects</span>
      </div>

      <div class="flex items-center gap-6">
        <a href="#" class="hover:text-text-primary transition-colors duration-200">Twitter</a>
        <a href="#" class="hover:text-text-primary transition-colors duration-200">LinkedIn</a>
        <a href="#" class="hover:text-text-primary transition-colors duration-200">Dribbble</a>
        <a href="#" class="hover:text-text-primary transition-colors duration-200">GitHub</a>
      </div>

      <div class="text-muted/60">
        © 2026 ${brand}. All rights reserved.
      </div>
    </div>
  </footer>

  <!-- ════════════════════════════════════════════════════════════════════════
       SCRIPTS: HLS, GSAP PARALLAX, MARQUEE & LOADING SEQUENCE
  ════════════════════════════════════════════════════════════════════════ -->
  <script>
    const HLS_STREAM = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    // 1. Loading Screen Sequence
    (function initLoading() {
      const screen = document.getElementById('loadingScreen');
      const counter = document.getElementById('loadingCounter');
      const bar = document.getElementById('loadingProgressBar');
      const label = document.getElementById('loadingPortfolioLabel');
      const word = document.getElementById('loadingWord');

      // Animate top-left label
      setTimeout(() => {
        label.classList.remove('opacity-0', '-translate-y-5');
        label.classList.add('opacity-100', 'translate-y-0');
      }, 100);

      // Rotating words: ["Design", "Create", "Inspire"]
      const words = ['Design', 'Create', 'Inspire'];
      let wordIdx = 0;
      setTimeout(() => {
        word.classList.remove('opacity-0', 'translate-y-5');
        word.classList.add('opacity-100', 'translate-y-0');
      }, 200);

      const wordTimer = setInterval(() => {
        word.classList.add('opacity-0', '-translate-y-5');
        word.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => {
          wordIdx = (wordIdx + 1) % words.length;
          word.textContent = words[wordIdx];
          word.classList.remove('-translate-y-5');
          word.classList.add('translate-y-5');
          setTimeout(() => {
            word.classList.remove('opacity-0', 'translate-y-5');
            word.classList.add('opacity-100', 'translate-y-0');
          }, 50);
        }, 300);
      }, 900);

      // Counter: 000 -> 100 over 2700ms using rAF
      const duration = 2700;
      let start = null;

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const count = Math.floor(progress * 100);
        counter.textContent = String(count).padStart(3, '0');
        bar.style.transform = 'scaleX(' + (count / 100) + ')';

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          clearInterval(wordTimer);
          setTimeout(() => {
            screen.classList.add('opacity-0');
            setTimeout(() => {
              screen.style.display = 'none';
              triggerHeroGSAP();
            }, 700);
          }, 400);
        }
      }
      requestAnimationFrame(step);
    })();

    // 2. Setup HLS Video Streams (Hero & Footer)
    function setupHlsVideo(videoEl, url) {
      if (!videoEl) return;
      if (Hls.isSupported()) {
        const hls = new Hls({ autoStartLoad: true, startLevel: -1 });
        hls.loadSource(url);
        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(() => {});
        });
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = url;
        videoEl.addEventListener('loadedmetadata', () => {
          videoEl.play().catch(() => {});
        });
      }
    }

    setupHlsVideo(document.getElementById('heroVideo'), HLS_STREAM);
    setupHlsVideo(document.getElementById('footerVideo'), HLS_STREAM);

    // 3. GSAP Hero Entrance Animations
    function triggerHeroGSAP() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // .name-reveal: opacity 0->1, y 50->0, duration 1.2s, delay 0.1s
      tl.fromTo('.name-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 });

      // .blur-in: opacity 0->1, filter blur(10px)->blur(0px), y 20->0, duration 1s, stagger 0.1, delay 0.3s
      tl.fromTo('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 }, 0.3);
    }

    // 4. Hero Role Switcher (2s interval)
    const roles = ['Creative', 'Fullstack', 'High-End', 'Bespoke'];
    let rIdx = 0;
    setInterval(() => {
      rIdx = (rIdx + 1) % roles.length;
      const el = document.getElementById('roleText');
      if (el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.textContent = roles[rIdx];
        el.style.animation = 'role-fade-in 0.4s ease-out forwards';
      }
    }, 2000);

    // 5. Navbar scroll listener
    window.addEventListener('scroll', () => {
      const pill = document.getElementById('navbarPill');
      if (pill) {
        if (window.scrollY > 100) {
          pill.classList.add('shadow-md', 'shadow-black/30', 'border-white/20');
        } else {
          pill.classList.remove('shadow-md', 'shadow-black/30', 'border-white/20');
        }
      }
    }, { passive: true });

    // 6. GSAP Marquee (Footer)
    gsap.to('#marqueeInner', {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1
    });

    // 7. Lightbox Handlers
    function openLightbox(imgUrl, title) {
      const modal = document.getElementById('lightboxModal');
      document.getElementById('lightboxImg').src = imgUrl;
      document.getElementById('lightboxTitle').textContent = title;
      modal.classList.remove('hidden');
    }

    function closeLightbox() {
      document.getElementById('lightboxModal').classList.add('hidden');
    }
  </script>
</body>
</html>`;
}

module.exports = { generatePixnovaPortfolioHtml };
