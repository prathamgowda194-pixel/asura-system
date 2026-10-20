/**
 * ══════════════════════════════════════════════════════════════════════════════
 * BESPOKE IRIS ETHANOS DARK PORTFOLIO ENGINE (V2 // ZERO-EMPTY-SPACE ARCHITECTURE)
 * ══════════════════════════════════════════════════════════════════════════════
 * Pure luxury agency portfolio with:
 *   1. Full Responsive Spacing Architecture (Zero Blank Spaces on Mobile & Desktop)
 *   2. Iris Ethanos Company Branding throughout the entire ecosystem
 *   3. 2700ms Curated Loading Screen (000 -> 100 counter + rotating words + bar)
 *   4. Dynamic Island Floating Header (IE Logo + Nav Links + Say Hi Direct Gmail)
 *   5. Hero with HLS ambient video + 2s Rotating Role Switcher + CTA buttons
 *   6. Selected Works Bento Grid (Automotive, Urban, Perspective, Brand)
 *   7. Journal (4 horizontal animated editorial pills)
 *   8. Explorations (Responsive 6-Item Visual Playground Showcase with Lightbox)
 *   9. The Unfair Advantage ("Don't just rank on Google. Get recommended by AI.")
 *   10. Stats (20+ Years, 95+ Projects, 200% Satisfied)
 *   11. Iris Ethanos FAQs (8 precise Q&As with smooth accordions)
 *   12. Contact / Footer (Flipped HLS + GSAP Marquee + irisethos7@gmail.com direct connect)
 */

function generatePixnovaPortfolioHtml(brand = "Iris Ethanos", options = {}) {
  const supportEmail = "irisethos7@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supportEmail)}`;

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
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

  <!-- Tailwind CDN (Modern v3) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            bg: '#05070A',
            surface: '#0B0F17',
            stroke: 'rgba(255, 255, 255, 0.08)',
            'stroke-hover': 'rgba(255, 255, 255, 0.20)',
            'text-primary': '#FFFFFF',
            muted: '#8A99AD',
            accent: {
              start: '#89AACC',
              mid: '#4E85BF',
              end: '#1D4ED8'
            }
          },
          fontFamily: {
            display: ['"Instrument Serif"', 'Georgia', 'serif'],
            body: ['"Inter"', 'sans-serif'],
            mono: ['"SF Mono"', 'Monaco', 'Inconsolata', 'monospace']
          },
          keyframes: {
            'role-fade': {
              '0%': { opacity: '0', transform: 'translateY(12px) rotateX(15deg)' },
              '100%': { opacity: '1', transform: 'translateY(0) rotateX(0deg)' }
            },
            'gradient-shift': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' }
            },
            'scroll-down': {
              '0%': { transform: 'translateY(-100%)', opacity: '0' },
              '50%': { opacity: '1' },
              '100%': { transform: 'translateY(100%)', opacity: '0' }
            }
          },
          animation: {
            'role-fade-in': 'role-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            'gradient-shift': 'gradient-shift 8s ease infinite',
            'scroll-down': 'scroll-down 2s ease-in-out infinite'
          }
        }
      }
    }
  </script>

  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #05070A; }
    ::-webkit-scrollbar-thumb { background: #1C2433; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #4E85BF; }

    /* Halftone Effect */
    .halftone-overlay {
      background-image: radial-gradient(#ffffff 1.2px, transparent 1.2px);
      background-size: 10px 10px;
    }

    /* Accent Linear Gradient */
    .accent-gradient {
      background: linear-gradient(135deg, #89AACC 0%, #4E85BF 50%, #1D4ED8 100%);
    }

    .accent-gradient-text {
      background: linear-gradient(135deg, #89AACC 0%, #4E85BF 50%, #1D4ED8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Hide scrollbar for clean horizontal containers */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-bg text-text-primary selection:bg-[#4E85BF] selection:text-white relative">

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 1: LOADING SCREEN (2700ms Precision Sequence)
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
       SECTION 2: NAVBAR (Floating Pill at top center - Mobile Optimized)
  ════════════════════════════════════════════════════════════════════════ -->
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-6 px-3 pointer-events-none">
    <nav id="navbarPill" class="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/90 px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300 pointer-events-auto shadow-2xl max-w-[96vw] overflow-x-auto no-scrollbar">
      <!-- 1. Logo: IE (Iris Ethanos) -->
      <a href="#hero" class="group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[1.5px] transition-transform duration-300 hover:scale-110 flex items-center justify-center flex-shrink-0">
        <div class="absolute inset-0 rounded-full accent-gradient group-hover:bg-gradient-to-l transition-all duration-500"></div>
        <div class="relative w-full h-full rounded-full bg-bg flex items-center justify-center">
          <span class="font-display italic text-xs sm:text-[13px] text-text-primary tracking-tight">IE</span>
        </div>
      </a>

      <!-- 2. Divider -->
      <div class="w-px h-4 sm:h-5 bg-stroke mx-1.5 sm:mx-2 flex-shrink-0"></div>

      <!-- 3. Nav Links -->
      <div class="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <a href="#hero" class="text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-text-primary bg-stroke/50 transition-all duration-200">Home</a>
        <a href="#works" class="text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">Work</a>
        <a href="#journal" class="text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">Journal</a>
        <a href="#explorations" class="text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">Explore</a>
        <a href="#advantage" class="text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">Advantage</a>
        <a href="#faq" class="text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200">FAQ</a>
      </div>

      <!-- 4. Divider -->
      <div class="w-px h-4 sm:h-5 bg-stroke mx-1.5 sm:mx-2 flex-shrink-0"></div>

      <!-- 5. "Say hi" button directly connects to Gmail -->
      <a href="${gmailComposeUrl}" 
         onclick="window.open('${gmailComposeUrl}', '_blank');" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="group relative text-[11px] sm:text-xs md:text-sm rounded-full p-[1.5px] transition-all duration-300 flex-shrink-0">
        <span class="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <div class="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-surface backdrop-blur-md text-text-primary font-medium">
          <span>Say hi</span>
          <span class="text-[10px] sm:text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </div>
      </a>
    </nav>
  </header>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 3: HERO (Proportionally Spaced — Zero Black Dead Void)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="hero" class="relative w-full min-h-[82vh] md:min-h-screen overflow-hidden flex flex-col justify-center items-center text-center px-4 pt-24 pb-12 md:py-28">
    <!-- Background Video: HLS Stream via hls.js -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <video id="heroVideo" class="absolute left-1/2 top-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2" autoPlay muted loop playsInline></video>
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-bg to-transparent"></div>
    </div>

    <!-- Centered Hero Content -->
    <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
      <!-- Eyebrow -->
      <p class="blur-in text-[11px] sm:text-xs text-muted uppercase tracking-[0.3em] mb-4 sm:mb-6 font-body opacity-0">
        COLLECTION &apos;26
      </p>

      <!-- Name -->
      <h1 class="name-reveal text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display italic leading-[0.95] tracking-tight text-text-primary mb-4 sm:mb-6 opacity-0">
        ${brand}
      </h1>

      <!-- Role line: A {role} agency partner -->
      <div class="blur-in text-base sm:text-xl md:text-2xl text-text-primary/90 font-light mb-3 sm:mb-4 opacity-0">
        <span>A </span>
        <span id="roleText" class="font-display italic text-text-primary animate-role-fade-in inline-block text-xl sm:text-2xl md:text-3xl mx-1">
          Creative
        </span>
        <span> agency partner for world-class brands.</span>
      </div>

      <!-- Description -->
      <p class="blur-in text-xs sm:text-sm md:text-base text-muted max-w-md mb-8 sm:mb-10 leading-relaxed opacity-0">
        Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
      </p>

      <!-- CTA Buttons -->
      <div class="blur-in inline-flex items-center gap-3 sm:gap-4 flex-wrap justify-center opacity-0 mb-8 sm:mb-10">
        <a href="#works" class="group relative rounded-full text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 font-medium transition-all duration-300 hover:scale-105 overflow-hidden">
          <span class="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1.5px]">
            <span class="block w-full h-full rounded-full bg-bg"></span>
          </span>
          <span class="relative z-10 bg-text-primary text-bg group-hover:bg-transparent group-hover:text-text-primary block px-6 sm:px-7 py-3 sm:py-3.5 -mx-6 sm:-mx-7 -my-3 sm:-my-3.5 rounded-full transition-colors duration-300">
            See Works
          </span>
        </a>

        <a href="${gmailComposeUrl}" 
           onclick="window.open('${gmailComposeUrl}', '_blank');" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="group relative rounded-full text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 font-medium border-2 border-stroke bg-bg text-text-primary transition-all duration-300 hover:scale-105 hover:border-transparent">
          <span class="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span class="relative z-10">Reach out...</span>
        </a>
      </div>

      <!-- Integrated Scroll Indicator (flows seamlessly into Selected Work) -->
      <div class="blur-in flex flex-col items-center gap-2 opacity-0 pointer-events-none">
        <span class="text-[9px] sm:text-[10px] text-muted uppercase tracking-[0.25em] font-body">SCROLL</span>
        <div class="w-px h-8 sm:h-10 bg-stroke relative overflow-hidden">
          <div class="w-full h-1/2 accent-gradient animate-scroll-down"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 4: SELECTED WORKS (Bento 7/5/5/7 — Seamless Transition)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="works" class="bg-bg pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <!-- Header -->
      <div class="flex items-end justify-between mb-8 sm:mb-12 md:mb-14 gap-6">
        <div>
          <div class="flex items-center gap-3 mb-3">
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

        <a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium py-3 px-6 rounded-full border border-stroke bg-surface hover:border-transparent group relative transition-all duration-300">
          <span class="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span>View all work</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <!-- Bento Grid (7 / 5 / 5 / 7) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
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
              <span class="text-xs text-muted font-mono uppercase tracking-widest block mb-1">03 — Editorial &amp; Haute Horlogerie</span>
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
              <span class="text-xs text-muted font-mono uppercase tracking-widest block mb-1">04 — Design System &amp; Interaction</span>
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
       SECTION 5: JOURNAL (4 Horizontal Animated Pills)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="journal" class="bg-bg py-12 sm:py-16 md:py-20 border-t border-stroke/40">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <div class="flex items-end justify-between mb-8 sm:mb-12 gap-6">
        <div>
          <div class="flex items-center gap-3 mb-3">
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

        <a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium py-3 px-6 rounded-full border border-stroke bg-surface hover:border-transparent group relative transition-all duration-300">
          <span class="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span>View all</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <!-- 4 Entries -->
      <div class="flex flex-col gap-3.5 sm:gap-4">
        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[28px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" alt="Kinetic Spaces" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Motion Systems</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">The Architecture of Kinetic Digital Spaces</h3>
            </div>
          </div>
          <div class="flex items-center gap-4 sm:gap-6 sm:pr-4 text-xs text-muted font-mono pl-16 sm:pl-0">
            <span>4 min read</span><span class="hidden sm:inline">•</span><span>Sep 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>

        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[28px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80" alt="Agency Portfolios" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Strategy</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">Why Agency Portfolios Fail at Conversion</h3>
            </div>
          </div>
          <div class="flex items-center gap-4 sm:gap-6 sm:pr-4 text-xs text-muted font-mono pl-16 sm:pl-0">
            <span>6 min read</span><span class="hidden sm:inline">•</span><span>Aug 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>

        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[28px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80" alt="Precision WebGL" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Engineering</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">Precision WebGL: Sculpted Realities on the Edge</h3>
            </div>
          </div>
          <div class="flex items-center gap-4 sm:gap-6 sm:pr-4 text-xs text-muted font-mono pl-16 sm:pl-0">
            <span>5 min read</span><span class="hidden sm:inline">•</span><span>Jul 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>

        <a href="#contact" class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[28px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300 hover:border-white/20 hover:scale-[1.01]">
          <div class="flex items-center gap-4 sm:gap-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border border-stroke">
              <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=300&q=80" alt="Editorial Web" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <span class="text-[11px] text-muted font-mono uppercase tracking-widest block mb-1">Typography</span>
              <h3 class="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">Instrument Serif &amp; The New Editorial Web</h3>
            </div>
          </div>
          <div class="flex items-center gap-4 sm:gap-6 sm:pr-4 text-xs text-muted font-mono pl-16 sm:pl-0">
            <span>3 min read</span><span class="hidden sm:inline">•</span><span>Jun 2026</span>
            <span class="text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 6: EXPLORATIONS (Responsive Interactive Showcase — ZERO 300vh VOID)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="explorations" class="relative bg-bg py-12 sm:py-16 md:py-20 border-t border-stroke/40 overflow-hidden">
    <!-- Ambient dark blue backlight wash -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#4E85BF]/5 blur-[120px] pointer-events-none"></div>

    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-px bg-stroke"></div>
            <span class="text-xs text-muted uppercase tracking-[0.3em] font-body">Explorations</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-normal text-text-primary tracking-tight mb-3">
            Visual <span class="font-display italic text-text-primary font-normal">playground</span>
          </h2>
          <p class="text-sm md:text-base text-muted max-w-lg leading-relaxed">
            Experimental 3D shaders, generative tokens, and interface prototypes crafted in the ${brand} research lab.
          </p>
        </div>

        <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" class="self-start md:self-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium py-3 px-6 rounded-full border border-stroke bg-surface hover:border-transparent group relative transition-all duration-300">
          <span class="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          <span>Follow on Dribbble</span>
          <span class="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </a>
      </div>

      <!-- Responsive 6-Item Showcase Grid (Zero Empty Space) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <!-- Item 1 -->
        <div onclick="openLightbox('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85', 'Kinetic Liquid Surface')" class="group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
          <div class="w-full h-full rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="Kinetic Liquid Surface" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-blue-300 block mb-1">01 — WebGL Shader</span>
                <span class="text-sm font-medium text-white block">Kinetic Liquid Surface</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div onclick="openLightbox('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', 'Monolithic Structure')" class="group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
          <div class="w-full h-full rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" alt="Monolithic Structure" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-blue-300 block mb-1">02 — Spatial 3D</span>
                <span class="text-sm font-medium text-white block">Monolithic Titanium Structure</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 3 -->
        <div onclick="openLightbox('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85', 'Spatial Audio Waveforms')" class="group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
          <div class="w-full h-full rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80" alt="Spatial Audio Waveforms" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-blue-300 block mb-1">03 — Audio Reactive</span>
                <span class="text-sm font-medium text-white block">Spatial Audio Waveforms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 4 -->
        <div onclick="openLightbox('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85', 'Holographic Typography')" class="group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
          <div class="w-full h-full rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80" alt="Holographic Typography" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-blue-300 block mb-1">04 — Kinetic Type</span>
                <span class="text-sm font-medium text-white block">Holographic Typography</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 5 -->
        <div onclick="openLightbox('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85', 'Zero-G Particles')" class="group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
          <div class="w-full h-full rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80" alt="Zero-G Particles" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-blue-300 block mb-1">05 — Particle Dynamics</span>
                <span class="text-sm font-medium text-white block">Zero-G Particles Simulation</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 6 -->
        <div onclick="openLightbox('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85', 'Dark Neomorphic')" class="group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-stroke p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
          <div class="w-full h-full rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" alt="Dark Neomorphic" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-blue-300 block mb-1">06 — Interaction Tokens</span>
                <span class="text-sm font-medium text-white block">Dark Neomorphic Interfaces</span>
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
       SECTION 7: THE UNFAIR ADVANTAGE (DARK BLUE & WHITE BRAND HARMONY)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="advantage" class="bg-bg py-12 sm:py-16 md:py-20 border-t border-stroke/40 relative overflow-hidden">
    <!-- Ambient dark blue backlight diffusers -->
    <div class="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 -left-40 w-96 h-96 rounded-full bg-sky-600/10 blur-[130px] pointer-events-none"></div>

    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
      <!-- Section Header -->
      <div class="max-w-3xl mb-8 sm:mb-12">
        <!-- Pill / Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-4 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          <span class="text-xs font-mono uppercase tracking-[0.25em] text-blue-300 font-medium">The Unfair Advantage</span>
        </div>

        <!-- Main Heading -->
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-normal text-text-primary tracking-tight leading-[1.12] mb-4">
          Don't just rank on Google. <span class="font-display italic text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-blue-400">Get recommended by AI.</span>
        </h2>

        <!-- Subtitle Paragraph -->
        <p class="text-sm md:text-base text-muted max-w-2xl leading-relaxed">
          Customers now ask AI assistants for the best brands, studios, and experiences near them. ${brand} automatically optimizes your SEO <span class="italic font-display text-text-primary">and</span> GEO so when AI answers, it names you.
        </p>
      </div>

      <!-- Feature Cards Stack with Left Indicator Timeline -->
      <div class="relative pl-7 sm:pl-9 md:pl-12 space-y-4 md:space-y-5">
        <!-- Vertical Connecting Line -->
        <div class="absolute left-3 sm:left-4 md:left-5 top-7 bottom-7 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent"></div>

        <!-- Card 1: Auto-corrects SEO -->
        <div class="advantage-card relative group">
          <div class="absolute -left-7 sm:-left-9 md:-left-12 top-7 -translate-x-1/2 flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.95)] ring-4 ring-blue-500/20 group-hover:scale-125 transition-transform duration-300"></span>
          </div>
          <div class="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-surface/80 border border-stroke backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-surface hover:translate-x-1.5 hover:shadow-[0_16px_36px_-10px_rgba(59,130,246,0.15)]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-blue-400">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <span class="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">SEO</span>
            </div>
            <h3 class="text-xl md:text-2xl font-medium text-text-primary mb-2">Auto-corrects SEO</h3>
            <p class="text-sm md:text-base text-muted leading-relaxed">
              Continuously reviews on-page issues, keywords, and structure to support your traditional search presence.
            </p>
          </div>
        </div>

        <!-- Card 2: Optimizes GEO -->
        <div class="advantage-card relative group">
          <div class="absolute -left-7 sm:-left-9 md:-left-12 top-7 -translate-x-1/2 flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.95)] ring-4 ring-blue-500/20 group-hover:scale-125 transition-transform duration-300"></span>
          </div>
          <div class="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-surface/80 border border-stroke backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-surface hover:translate-x-1.5 hover:shadow-[0_16px_36px_-10px_rgba(59,130,246,0.15)]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-blue-400">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </span>
              <span class="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">GEO</span>
            </div>
            <h3 class="text-xl md:text-2xl font-medium text-text-primary mb-2">Optimizes GEO</h3>
            <p class="text-sm md:text-base text-muted leading-relaxed">
              Generative Engine Optimization helps AI assistants find clear, accurate information about your brand.
            </p>
          </div>
        </div>

        <!-- Card 3: Builds your brand -->
        <div class="advantage-card relative group">
          <div class="absolute -left-7 sm:-left-9 md:-left-12 top-7 -translate-x-1/2 flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.95)] ring-4 ring-blue-500/20 group-hover:scale-125 transition-transform duration-300"></span>
          </div>
          <div class="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-surface/80 border border-stroke backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-surface hover:translate-x-1.5 hover:shadow-[0_16px_36px_-10px_rgba(59,130,246,0.15)]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-blue-400">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </span>
              <span class="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">BRAND</span>
            </div>
            <h3 class="text-xl md:text-2xl font-medium text-text-primary mb-2">Builds your brand</h3>
            <p class="text-sm md:text-base text-muted leading-relaxed">
              Strengthens your positioning and content so your brand is presented clearly and consistently.
            </p>
          </div>
        </div>

        <!-- Card 4: Weekly SEO reports -->
        <div class="advantage-card relative group">
          <div class="absolute -left-7 sm:-left-9 md:-left-12 top-7 -translate-x-1/2 flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.95)] ring-4 ring-blue-500/20 group-hover:scale-125 transition-transform duration-300"></span>
          </div>
          <div class="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-surface/80 border border-stroke backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-surface hover:translate-x-1.5 hover:shadow-[0_16px_36px_-10px_rgba(59,130,246,0.15)]">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-blue-400">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </span>
              <span class="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">REPORTS</span>
            </div>
            <h3 class="text-xl md:text-2xl font-medium text-text-primary mb-2">Weekly SEO reports</h3>
            <p class="text-sm md:text-base text-muted leading-relaxed">
              A clear weekly report of what changed, what improved, and what's next, no jargon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 8: STATS
  ════════════════════════════════════════════════════════════════════════ -->
  <section class="bg-bg py-10 sm:py-14 md:py-16 border-t border-stroke/40">
    <div class="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div class="flex flex-col p-6 sm:p-8 rounded-3xl bg-surface/40 border border-stroke relative overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full accent-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <span class="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-3 leading-none">20+</span>
          <h3 class="text-base md:text-lg font-medium text-text-primary mb-2">Years Experience</h3>
          <p class="text-xs md:text-sm text-muted leading-relaxed">Mastering digital craft, spatial interfaces, and agency production.</p>
        </div>

        <div class="flex flex-col p-6 sm:p-8 rounded-3xl bg-surface/40 border border-stroke relative overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full accent-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <span class="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-3 leading-none">95+</span>
          <h3 class="text-base md:text-lg font-medium text-text-primary mb-2">Projects Done</h3>
          <p class="text-xs md:text-sm text-muted leading-relaxed">Bespoke high-conversion platforms built for global partners.</p>
        </div>

        <div class="flex flex-col p-6 sm:p-8 rounded-3xl bg-surface/40 border border-stroke relative overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div class="absolute -top-12 -right-12 w-28 h-28 rounded-full accent-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <span class="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-3 leading-none">200%</span>
          <h3 class="text-base md:text-lg font-medium text-text-primary mb-2">Satisfied Clients</h3>
          <p class="text-xs md:text-sm text-muted leading-relaxed">Average conversion lift and engagement surge post-launch.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 9: IRIS ETHANOS FAQ (EXACT Q&A SET WITH DARK BLUE & WHITE ACCENTS)
  ════════════════════════════════════════════════════════════════════════ -->
  <section id="faq" class="bg-bg py-12 sm:py-16 md:py-20 border-t border-stroke/40 relative">
    <div class="max-w-[1000px] mx-auto px-6 md:px-10">
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-4 shadow-sm">
          <span class="text-xs font-mono uppercase tracking-[0.25em] text-blue-300 font-medium">FAQ</span>
        </div>
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-normal text-text-primary tracking-tight mb-4">
          Questions, <span class="font-display italic text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-blue-400">answered</span>
        </h2>
        <p class="text-sm md:text-base text-muted">
          Everything you need to know about partnering with ${brand}.
        </p>
      </div>

      <!-- Accordion Stack -->
      <div class="space-y-3" id="faqAccordionContainer">
        <!-- 1 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>What services does Iris Ethanos offer?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              Custom website design &amp; development, brand identity design (logos, color systems, guidelines), UI/UX design, and ongoing website maintenance/support.
            </div>
          </div>
        </div>

        <!-- 2 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>How long does a typical project take?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              A branding package usually takes 1–2 weeks; a full website build typically takes 3–6 weeks depending on scope and revisions.
            </div>
          </div>
        </div>

        <!-- 3 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>Do you offer branding and web design together as a package?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              Yes — we offer bundled packages that combine brand identity with a matching website, so your visuals stay consistent across every touchpoint.
            </div>
          </div>
        </div>

        <!-- 4 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>What's your design process?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              Discovery call → research &amp; moodboarding → concept design → client feedback/revisions → final delivery (and development, for websites).
            </div>
          </div>
        </div>

        <!-- 5 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>What platforms do you build websites on?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              We work with modern frameworks and CMS platforms (e.g., WordPress, Webflow, Shopify, or custom code) depending on your needs and budget.
            </div>
          </div>
        </div>

        <!-- 6 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>Do you provide website maintenance after launch?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              Yes, we offer ongoing support plans for updates, security, and performance monitoring.
            </div>
          </div>
        </div>

        <!-- 7 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>How much do your services cost?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              Pricing depends on project scope — we provide custom quotes after an initial consultation.
            </div>
          </div>
        </div>

        <!-- 8 -->
        <div class="faq-item border border-stroke rounded-2xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-blue-500/30">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-5 md:p-6 text-left font-medium text-base md:text-lg text-text-primary hover:text-white transition-colors">
            <span>Can you redesign my existing website or rebrand my business?</span>
            <span class="faq-icon text-muted text-xl transition-transform duration-300 ml-4 font-mono">+</span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="px-5 md:px-6 pb-6 text-sm md:text-base text-muted leading-relaxed border-t border-stroke/30 pt-4">
              Absolutely — we specialize in refreshing outdated sites and brands while keeping what already works for your audience.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION 10: CONTACT / FOOTER (Flipped HLS + GSAP Marquee + Direct Gmail)
  ════════════════════════════════════════════════════════════════════════ -->
  <footer id="contact" class="relative bg-bg pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 overflow-hidden border-t border-stroke/40">
    <!-- Background Video: Flipped vertically scale-y-[-1] with bg-black/60 overlay -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <video id="footerVideo" class="absolute left-1/2 top-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]" autoPlay muted loop playsInline></video>
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"></div>
    </div>

    <!-- GSAP Infinite Marquee -->
    <div class="relative z-10 w-full overflow-hidden py-4 sm:py-6 mb-8 sm:mb-12 border-y border-stroke/30 bg-surface/20">
      <div id="marqueeInner" class="flex whitespace-nowrap will-change-transform">
        <span class="font-display italic text-3xl sm:text-5xl md:text-6xl text-text-primary/70 mx-6 tracking-tight">
          ${brand.toUpperCase()} — HIGH END DIGITAL SYSTEMS — BESPOKE INTERACTIONS — WORLD CLASS CRAFT —
        </span>
        <span class="font-display italic text-3xl sm:text-5xl md:text-6xl text-text-primary/70 mx-6 tracking-tight">
          ${brand.toUpperCase()} — HIGH END DIGITAL SYSTEMS — BESPOKE INTERACTIONS — WORLD CLASS CRAFT —
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
      <span class="text-xs text-muted uppercase tracking-[0.3em] font-body mb-3">Start a Conversation</span>
      <h2 class="text-4xl md:text-7xl lg:text-8xl font-display italic text-text-primary mb-6 sm:mb-8 leading-tight">
        Let’s craft something iconic.
      </h2>
      <p class="text-sm md:text-base text-muted max-w-md mb-8 sm:mb-10">
        Partner with ${brand} to engineer custom web architectures, WebGL interactions, and high-impact digital systems.
      </p>

      <!-- Email Button with direct Gmail connect -->
      <a href="${gmailComposeUrl}" 
         onclick="window.open('${gmailComposeUrl}', '_blank');" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="group relative rounded-full text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 font-medium border border-stroke bg-surface text-text-primary transition-all duration-300 hover:scale-105 hover:border-transparent mb-12 sm:mb-16 shadow-2xl">
        <span class="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
        <span class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="font-mono text-sm sm:text-base">${supportEmail}</span>
          <span class="text-sm transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </span>
      </a>
    </div>

    <!-- Footer Bar -->
    <div class="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-6 sm:pt-8 border-t border-stroke/40 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-muted font-body">
      <div class="flex items-center gap-2.5">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="text-text-primary/90 font-medium">Available for new client projects &amp; branding</span>
      </div>

      <div class="flex items-center gap-4 sm:gap-6">
        <a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" target="_blank" rel="noopener noreferrer" class="hover:text-text-primary transition-colors duration-200">Email Us</a>
        <a href="#works" class="hover:text-text-primary transition-colors duration-200">Work</a>
        <a href="#advantage" class="hover:text-text-primary transition-colors duration-200">Advantage</a>
        <a href="#faq" class="hover:text-text-primary transition-colors duration-200">FAQ</a>
        <a href="https://github.com" target="_blank" class="hover:text-text-primary transition-colors duration-200">GitHub</a>
      </div>
    </div>
  </footer>

  <!-- ════════════════════════════════════════════════════════════════════════
       SCRIPTS: LOADING, VIDEO, GSAP, & FAQ ACCORDION LOGIC
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

      tl.fromTo('.name-reveal', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, delay: 0.1 });
      tl.fromTo('.blur-in', { opacity: 0, filter: 'blur(8px)', y: 15 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, stagger: 0.08 }, 0.25);

      // Stagger animate Advantage Cards on scroll
      gsap.from('.advantage-card', {
        scrollTrigger: {
          trigger: '#advantage',
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out'
      });
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
        if (window.scrollY > 80) {
          pill.classList.add('shadow-lg', 'shadow-black/60', 'border-white/20');
        } else {
          pill.classList.remove('shadow-lg', 'shadow-black/60', 'border-white/20');
        }
      }
    }, { passive: true });

    // 6. GSAP Marquee (Footer)
    gsap.to('#marqueeInner', {
      xPercent: -50,
      duration: 35,
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

    // 8. FAQ Accordion Toggle Logic
    function toggleFaq(button) {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const icon = button.querySelector('.faq-icon');
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

      // Close all other items in container
      document.querySelectorAll('#faqAccordionContainer .faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          otherAnswer.style.maxHeight = '0px';
          otherItem.classList.remove('border-blue-500/50', 'bg-surface/90', 'shadow-[0_8px_24px_-4px_rgba(59,130,246,0.15)]');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      if (isOpen) {
        answer.style.maxHeight = '0px';
        icon.textContent = '+';
        item.classList.remove('border-blue-500/50', 'bg-surface/90', 'shadow-[0_8px_24px_-4px_rgba(59,130,246,0.15)]');
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '✕';
        item.classList.add('border-blue-500/50', 'bg-surface/90', 'shadow-[0_8px_24px_-4px_rgba(59,130,246,0.15)]');
      }
    }

    // Pre-open the first FAQ by default
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const items = document.querySelectorAll('#faqAccordionContainer .faq-item');
        if (items.length > 0) {
          const firstAnswer = items[0].querySelector('.faq-answer');
          const firstIcon = items[0].querySelector('.faq-icon');
          firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
          firstIcon.textContent = '✕';
          items[0].classList.add('border-blue-500/50', 'bg-surface/90');
        }
      }, 300);
    });
  </script>
</body>
</html>`;
}

module.exports = { 
  generatePixnovaPortfolioHtml,
  generateIrisEthanosPortfolioHtml: generatePixnovaPortfolioHtml 
};
