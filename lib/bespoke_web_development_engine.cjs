/**
 * ══════════════════════════════════════════════════════════════════════════════
 * BESPOKE IRIS ETHANOS — WEB DEVELOPMENT & ALL PROJECTS SHOWCASE ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * Replicates the dedicated Services & All Projects showcase layout from reference
 * image media_1792521618888_fc6c8904.jpg with:
 *   - Dark Blue & White Typography & Color System (#05070A, #0B0F17, #4E85BF, #89AACC)
 *   - Back link breadcrumb (← All services / Return to main portfolio)
 *   - "Web Development" Hero Headline + Subtitle
 *   - "All projects" section with 3D fanned perspective stage + 8-card responsive matrix
 *   - 8 live website connections with one-click redirection:
 *       1. KTM Duke 1290 Flagship Showroom (/projects/ktm-showroom/index.html)
 *       2. Harley-Davidson Legend Cinema (/projects/harley-davidson/index.html)
 *       3. Nüve Skincare Luxury Studio (/projects/nuve-skincare/index.html)
 *       4. Era Spatial Residence Monolith (/projects/era-residence/index.html)
 *       5. L'Opfait Michelin-Star Gastronomy (/projects/lopfait-restaurant/index.html)
 *       6. Smile Sculpt Dental Clinic (/projects/dental-clinic/index.html)
 *       7. Unmapped Wild Expeditions (/projects/unmapped-travel/index.html)
 *       8. Logio Autonomous Freight Matrix (/projects/logio-logistics/index.html)
 *   - Conversion Banner ("Love this web development? Let's make it yours.")
 *   - Iris Ethos comprehensive corporate footer + direct Gmail connect
 */

function generateWebDevelopmentHtml(brand = "Iris Ethos", options = {}) {
  const supportEmail = "irisethos7@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supportEmail)}`;
  const homeUrl = options.homeUrl || (options.isStandalone ? "/" : "/projects/pixnova/index.html");
  const liveBase = options.isStandalone ? "https://asura-system.vercel.app" : "";
  const linkTarget = options.isStandalone ? 'target="_blank" rel="noopener noreferrer"' : '';

  const projects = [
    {
      id: "ktm",
      no: "01",
      title: "KTM Super Duke 1290 Flagship",
      category: "Automotive & 3D Interactive Showroom",
      tag: "60fps Drone Scrub",
      desc: "Ultra-high performance motorcycle showroom featuring cinematic 60fps canvas drone flight, interactive exploded parts levitation, and dynamic technical HUD telemetry.",
      url: `${liveBase}/projects/ktm-showroom/index.html`,
      img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85",
      badge: "LIVE FLAGSHIP"
    },
    {
      id: "harley",
      no: "02",
      title: "Harley-Davidson Legend Cinema",
      category: "Luxury Cruiser & Soundstage",
      tag: "3-Stage Lerp Scrubber",
      desc: "Heritage cinema scroll experience with real-time video scrubber, V-Twin engine acoustic soundstage, custom gloss paint reflection shaders, and purchase customizer.",
      url: `${liveBase}/projects/harley-davidson/index.html`,
      img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85",
      badge: "CINEMA SCRUB"
    },
    {
      id: "nuve",
      no: "03",
      title: "Nüve Skincare Luxury Atelier",
      category: "DTC Luxury E-Commerce & Cosmetics",
      tag: "WebGL Viscosity & Cart",
      desc: "High-end skincare digital flagship featuring WebGL fluid viscosity physics, editorial seasonal lookbook, and micro-animated product bag checkout flow.",
      url: `${liveBase}/projects/nuve-skincare/index.html`,
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
      badge: "ECOMMERCE"
    },
    {
      id: "era",
      no: "04",
      title: "Era Spatial Residence Monolith",
      category: "Ultra-Luxury Real Estate & Villa",
      tag: "3D Spatial Explorer",
      desc: "Architectural monolith website with 360-degree drone flyovers, interactive floorplan matrix, lighting atmosphere switches, and VIP private consultation scheduler.",
      url: `${liveBase}/projects/era-residence/index.html`,
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      badge: "ARCHITECTURE"
    },
    {
      id: "lopfait",
      no: "05",
      title: "L’Opfait Haute Cuisine Atelier",
      category: "Michelin-Star Gastronomy & Hospitality",
      tag: "Interactive Tasting Menu",
      desc: "Sensory dining portal with synchronized dish reveal videos, sommelier wine pairing catalog, vintage cellar temperature telemetry, and table reservation protocol.",
      url: `${liveBase}/projects/lopfait-restaurant/index.html`,
      img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
      badge: "GASTRONOMY"
    },
    {
      id: "dental",
      no: "06",
      title: "Smile Sculpt Aesthetic Clinic",
      category: "Medical & Cosmetic Dentistry",
      tag: "3D Enamel Scrub",
      desc: "Futuristic medical clinic experience with 3D interactive enamel layer reconstruction, smile makeover simulation preview, and automated patient booking queue.",
      url: `${liveBase}/projects/dental-clinic/index.html`,
      img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
      badge: "CLINICAL 3D"
    },
    {
      id: "unmapped",
      no: "07",
      title: "Unmapped Wild Expeditions",
      category: "Luxury Adventure & Travel Editorial",
      tag: "Topographic Route Scrub",
      desc: "Global expedition booking platform with interactive vector topographic route scrubbers, high-altitude drone video chapters, and extreme climate gear guides.",
      url: `${liveBase}/projects/unmapped-travel/index.html`,
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      badge: "EXPEDITIONS"
    },
    {
      id: "logio",
      no: "08",
      title: "Logio Freight & Supply Intelligence",
      category: "Enterprise Logistics & Supply Chain",
      tag: "Live Fleet Telemetry",
      desc: "Autonomous freight platform featuring real-time orbital cargo vessel tracking, multi-modal cost optimization calculator, and automated bill-of-lading engine.",
      url: `${liveBase}/projects/logio-logistics/index.html`,
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
      badge: "ENTERPRISE"
    }
  ];

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Primary SEO & Search Engine Optimization Tags -->
  <title>Web Development &amp; Interactive 3D Portfolio — ${brand}</title>
  <meta name="title" content="Web Development &amp; Interactive 3D Portfolio — ${brand}" />
  <meta name="description" content="Explore the bespoke web development and interactive 3D website showcase by ${brand}. Featuring 60fps canvas drone showrooms, luxury DTC storefronts, WebGL viscosity simulations, and architectural monoliths." />
  <meta name="keywords" content="${brand} projects, web development showcase, custom websites, interactive 3D showrooms, luxury ecommerce, WebGL websites, responsive web apps, digital design portfolio, ${brand}" />
  <meta name="author" content="${brand}" />
  <meta name="publisher" content="${brand}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="https://irisethos.com/web-development.html" />

  <!-- Open Graph / Social Media Meta Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://irisethos.com/web-development.html" />
  <meta property="og:title" content="Web Development &amp; Interactive 3D Portfolio — ${brand}" />
  <meta property="og:description" content="Interactive 3D web development, 60fps canvas drone showrooms, and high-conversion agency websites by ${brand}." />
  <meta property="og:image" content="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${brand}" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Web Development &amp; Interactive 3D Portfolio — ${brand}" />
  <meta name="twitter:description" content="Interactive 3D web development, 60fps canvas drone showrooms, and high-conversion agency websites by ${brand}." />
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85" />

  <!-- Schema.org Structured Data (CollectionPage & CreativeWork for Search Engines & LLM Citation Discovery) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Web Development & Interactive 3D Portfolio — ${brand}",
    "description": "Showcase of bespoke digital architectures, 3D interactive showrooms, and conversion systems by ${brand}.",
    "url": "https://irisethos.com/web-development.html",
    "publisher": {
      "@type": "Organization",
      "name": "${brand}",
      "email": "${supportEmail}"
    },
    "hasPart": [
      ${projects.map(p => `{
        "@type": "CreativeWork",
        "name": "${p.title}",
        "description": "${p.desc}",
        "genre": "${p.category}",
        "url": "${p.url}",
        "image": "${p.img}"
      }`).join(',\n      ')}
    ]
  }
  </script>

  <!-- Google Fonts: Inter (300-700) & Instrument Serif (italic 400) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            bg: '#05070A',
            surface: '#0B0F17',
            stroke: 'rgba(255, 255, 255, 0.08)',
            'stroke-hover': 'rgba(255, 255, 255, 0.22)',
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

    /* Accent Gradients */
    .accent-gradient {
      background: linear-gradient(135deg, #89AACC 0%, #4E85BF 50%, #1D4ED8 100%);
    }

    .accent-gradient-text {
      background: linear-gradient(135deg, #89AACC 0%, #4E85BF 50%, #1D4ED8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* 3D Perspective Card Hover Physics */
    .perspective-stage {
      perspective: 1400px;
    }

    .tilt-card {
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease;
      transform-style: preserve-3d;
    }

    .tilt-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 24px 60px -15px rgba(78, 133, 191, 0.35);
      border-color: rgba(78, 133, 191, 0.5);
    }

    /* Fanned Mockup Physics (Exact match to Image 2 header cluster) */
    .fanned-item {
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), z-index 0.2s ease, filter 0.3s ease;
    }
    .fanned-item:hover {
      transform: translateY(-16px) scale(1.06) rotate(0deg) !important;
      z-index: 40 !important;
      filter: drop-shadow(0 20px 40px rgba(78, 133, 191, 0.4));
    }
  </style>
</head>
<body class="bg-bg text-text-primary selection:bg-[#4E85BF] selection:text-white relative min-h-screen">

  <!-- ════════════════════════════════════════════════════════════════════════
       TOP NAVIGATION BAR (Connected directly to Main Portfolio)
  ════════════════════════════════════════════════════════════════════════ -->
  <header class="sticky top-0 left-0 right-0 z-50 backdrop-blur-md bg-surface/85 border-b border-stroke/40 px-4 sm:px-8 py-3.5 transition-all duration-300">
    <div class="max-w-[1280px] mx-auto flex items-center justify-between">
      <!-- Left: Brand Logo & Back to Main Portfolio Link -->
      <div class="flex items-center gap-4 sm:gap-6">
        <a href="${homeUrl}" class="flex items-center gap-3 group">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[1.5px] accent-gradient flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <div class="w-full h-full rounded-full bg-bg flex items-center justify-center">
              <span class="font-display italic text-xs sm:text-[13px] text-text-primary tracking-tight">IE</span>
            </div>
          </div>
          <span class="font-medium text-sm sm:text-base text-text-primary tracking-tight hidden xs:inline">${brand}</span>
        </a>

        <!-- Return pill -->
        <a href="${homeUrl}" class="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors bg-white/5 border border-white/10 rounded-full px-3 py-1 font-mono">
          <span>←</span>
          <span>Main Portfolio</span>
        </a>
      </div>

      <!-- Center: Navigation Links -->
      <nav class="hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium text-muted">
        <a href="${homeUrl}#hero" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">Home</a>
        <a href="${homeUrl}#works" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">Selected Works</a>
        <a href="#all-projects" class="px-3 py-1.5 rounded-full text-white bg-white/10 transition-all">All Projects</a>
        <a href="${homeUrl}#advantage" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">Advantage</a>
        <a href="${homeUrl}#faq" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all">FAQ</a>
      </nav>

      <!-- Right: Action CTA -->
      <div class="flex items-center gap-3">
        <a href="${gmailComposeUrl}" 
           onclick="window.open('${gmailComposeUrl}', '_blank');" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-white/10">
          <span>Get started</span>
          <span class="text-xs">→</span>
        </a>
      </div>
    </div>
  </header>

  <main class="relative z-10 pt-8 sm:pt-12 pb-20 md:pb-28">
    <div class="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">

      <!-- Breadcrumb Link: ← All services -->
      <div class="mb-8">
        <a href="${homeUrl}" class="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-blue-300 transition-colors group">
          <span class="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>All services</span>
        </a>
      </div>

      <!-- ════════════════════════════════════════════════════════════════════════
           HEADER: "Web Development" (Matching Image 2 with Dark Blue & White)
      ════════════════════════════════════════════════════════════════════════ -->
      <div class="text-center max-w-3xl mx-auto mb-14 md:mb-20">
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-normal text-text-primary tracking-tight mb-4">
          Web <span class="font-display italic text-transparent bg-clip-text bg-gradient-to-r from-[#89AACC] via-[#93C5FD] to-[#3B82F6]">Development</span>
        </h1>
        <p class="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
          Custom websites, web apps, and storefronts engineered for speed and conversions. Hover any project to preview it, click to open the live site.
        </p>
      </div>

      <!-- ════════════════════════════════════════════════════════════════════════
           SECTION: "All projects" (Signature 3D Fanned Display Cluster from Image 2)
      ════════════════════════════════════════════════════════════════════════ -->
      <div id="all-projects" class="text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-medium text-text-primary tracking-tight mb-1.5">
          All projects
        </h2>
        <p class="text-xs sm:text-sm text-muted font-mono">
          Hover to preview · click to open the live site
        </p>
      </div>

      <!-- Fanned 3D Perspective Browser Showcase (Exact Match to Image 2 Stage) -->
      <div class="perspective-stage relative w-full py-8 md:py-12 mb-16 overflow-hidden">
        <!-- Ambient radial glow under cards -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full bg-[#4E85BF]/10 blur-[130px] pointer-events-none"></div>

        <!-- Row 1: 4 Top Floating Browser Cards -->
        <div class="flex items-center justify-center gap-3 sm:gap-6 flex-wrap relative z-20 mb-6 sm:mb-8">
          ${projects.slice(0, 4).map((p, idx) => {
            const rot = idx === 0 ? '-rotate-6' : idx === 1 ? '-rotate-2' : idx === 2 ? 'rotate-3' : 'rotate-6';
            return `
            <a href="${p.url}" ${linkTarget} class="fanned-item block w-[260px] sm:w-[280px] md:w-[290px] rounded-2xl bg-surface border border-stroke overflow-hidden shadow-2xl ${rot} hover:scale-105 cursor-pointer group">
              <!-- Browser Title Bar -->
              <div class="bg-[#10141e] px-3.5 py-2.5 border-b border-stroke flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-rose-500/80"></span>
                  <span class="w-2 h-2 rounded-full bg-amber-500/80"></span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                </div>
                <span class="text-[9px] font-mono text-muted truncate max-w-[140px]">${p.title}</span>
                <span class="text-[10px] text-blue-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <!-- Preview Thumbnail -->
              <div class="aspect-[16/10] overflow-hidden relative">
                <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85';" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span class="text-xs font-medium text-white truncate">${p.title}</span>
                </div>
              </div>
            </a>
            `;
          }).join('')}
        </div>

        <!-- Row 2: 4 Bottom Floating Browser Cards -->
        <div class="flex items-center justify-center gap-3 sm:gap-6 flex-wrap relative z-10 -mt-4 sm:-mt-8">
          ${projects.slice(4, 8).map((p, idx) => {
            const rot = idx === 0 ? 'rotate-3' : idx === 1 ? '-rotate-2' : idx === 2 ? 'rotate-4' : '-rotate-4';
            return `
            <a href="${p.url}" ${linkTarget} class="fanned-item block w-[260px] sm:w-[280px] md:w-[290px] rounded-2xl bg-surface border border-stroke overflow-hidden shadow-2xl ${rot} hover:scale-105 cursor-pointer group">
              <!-- Browser Title Bar -->
              <div class="bg-[#10141e] px-3.5 py-2.5 border-b border-stroke flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-rose-500/80"></span>
                  <span class="w-2 h-2 rounded-full bg-amber-500/80"></span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                </div>
                <span class="text-[9px] font-mono text-muted truncate max-w-[140px]">${p.title}</span>
                <span class="text-[10px] text-blue-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <!-- Preview Thumbnail -->
              <div class="aspect-[16/10] overflow-hidden relative">
                <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85';" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span class="text-xs font-medium text-white truncate">${p.title}</span>
                </div>
              </div>
            </a>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════════════════════
           DETAILED 8-PROJECT RESPONSIVE BENTO GRID (One-Click Live Launch)
      ════════════════════════════════════════════════════════════════════════ -->
      <div class="mb-20">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-stroke/40">
          <div>
            <h3 class="text-xl sm:text-2xl font-medium text-text-primary tracking-tight">Interactive Directory</h3>
            <p class="text-xs sm:text-sm text-muted">Click any website to experience the live build.</p>
          </div>
          <span class="text-xs font-mono uppercase tracking-widest text-[#89AACC] px-3 py-1 rounded-full bg-[#4E85BF]/10 border border-[#4E85BF]/30">
            8 Websites Live
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${projects.map(p => `
          <div class="tilt-card group rounded-3xl bg-surface/70 border border-stroke overflow-hidden flex flex-col justify-between p-3.5 backdrop-blur-md">
            <!-- Top Preview Window -->
            <div class="aspect-[16/10] rounded-2xl overflow-hidden relative bg-black/50 mb-4 border border-stroke/50">
              <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85';" />
              <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-blue-300">
                ${p.badge}
              </div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <a href="${p.url}" ${linkTarget} class="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs flex items-center gap-1.5 shadow-xl hover:scale-105 transition-transform">
                  <span>Launch Site</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            <!-- Card Content -->
            <div class="px-2 pb-2 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-widest text-muted block mb-1">
                  ${p.no} — ${p.tag}
                </span>
                <h4 class="text-base font-medium text-text-primary mb-2 group-hover:text-blue-300 transition-colors">
                  ${p.title}
                </h4>
                <p class="text-xs text-muted leading-relaxed line-clamp-3 mb-4">
                  ${p.desc}
                </p>
              </div>

              <div class="pt-3 border-t border-stroke/30 flex items-center justify-between text-xs">
                <span class="text-muted font-mono text-[11px]">${p.category}</span>
                <a href="${p.url}" ${linkTarget} class="text-blue-400 group-hover:text-blue-300 font-medium flex items-center gap-1">
                  <span>Open</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════════════════════
           CONVERSION BANNER (Exact Match from Image 2 Bottom)
      ════════════════════════════════════════════════════════════════════════ -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070b16] via-[#0d162b] to-[#142347] border border-[#4E85BF]/35 p-8 sm:p-12 md:p-14 shadow-[0_20px_60px_-15px_rgba(78,133,191,0.25)] flex flex-col sm:flex-row items-center justify-between gap-8 mb-20">
        <!-- Ambient Diffuser -->
        <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>

        <div class="max-w-xl relative z-10 text-center sm:text-left">
          <h3 class="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight mb-2">
            Love this web development? Let’s make it yours.
          </h3>
          <p class="text-sm sm:text-base text-muted leading-relaxed">
            Fast, conversion-focused sites built to scale.
          </p>
        </div>

        <div class="relative z-10 flex-shrink-0">
          <a href="${gmailComposeUrl}" 
             onclick="window.open('${gmailComposeUrl}', '_blank');" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-white/10">
            <span>Enquire</span>
            <span>→</span>
          </a>
        </div>
      </div>

    </div>
  </main>

  <!-- ════════════════════════════════════════════════════════════════════════
       COMPREHENSIVE CORPORATE FOOTER (Exact Match from Image 2 Design)
  ════════════════════════════════════════════════════════════════════════ -->
  <footer class="bg-surface/50 border-t border-stroke/40 pt-16 pb-12 text-muted text-xs">
    <div class="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
        <!-- Brand Summary Column -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-full p-[1.5px] accent-gradient flex items-center justify-center">
              <div class="w-full h-full rounded-full bg-bg flex items-center justify-center">
                <span class="font-display italic text-xs text-text-primary tracking-tight">IE</span>
              </div>
            </div>
            <span class="font-medium text-base text-white tracking-tight">${brand}</span>
          </div>
          <p class="text-xs text-muted max-w-sm leading-relaxed mb-6">
            ${brand} builds high-conversion bespoke digital systems, WebGL architectures, and modern brand experiences. Engineered for speed, aesthetic prestige, and verified performance.
          </p>
          <div class="flex items-center gap-4 text-muted">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </div>

        <!-- Column 1: Product -->
        <div>
          <h4 class="font-mono uppercase tracking-widest text-white text-[11px] mb-4">Product</h4>
          <ul class="space-y-2.5">
            <li><a href="${homeUrl}#hero" class="hover:text-white transition-colors">Overview</a></li>
            <li><a href="${homeUrl}#advantage" class="hover:text-white transition-colors">Solutions</a></li>
            <li><a href="${homeUrl}#works" class="hover:text-white transition-colors">Industries</a></li>
            <li><a href="#all-projects" class="hover:text-white transition-colors">All Projects</a></li>
          </ul>
        </div>

        <!-- Column 2: Company -->
        <div>
          <h4 class="font-mono uppercase tracking-widest text-white text-[11px] mb-4">Company</h4>
          <ul class="space-y-2.5">
            <li><a href="${homeUrl}#journal" class="hover:text-white transition-colors">Team</a></li>
            <li><a href="${homeUrl}#journal" class="hover:text-white transition-colors">Blog</a></li>
            <li><a href="${homeUrl}#works" class="hover:text-white transition-colors">Stories</a></li>
            <li><a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <!-- Column 3: Resources -->
        <div>
          <h4 class="font-mono uppercase tracking-widest text-white text-[11px] mb-4">Resources</h4>
          <ul class="space-y-2.5">
            <li><a href="#all-projects" class="hover:text-white transition-colors">Guides</a></li>
            <li><a href="${homeUrl}#advantage" class="hover:text-white transition-colors">What is GEO?</a></li>
            <li><a href="${homeUrl}#faq" class="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="hover:text-white transition-colors">Customer Consultation</a></li>
          </ul>
        </div>
      </div>

      <!-- Contact Directory Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-stroke/40 mb-10">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-muted block mb-1">Sales &amp; Consultations</span>
          <a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="text-text-primary hover:text-blue-300 font-mono text-xs transition-colors">${supportEmail}</a>
          <p class="text-[11px] text-muted mt-0.5">Quotes, demos and plans</p>
        </div>

        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-muted block mb-1">General Inquiries</span>
          <a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="text-text-primary hover:text-blue-300 font-mono text-xs transition-colors">${supportEmail}</a>
          <p class="text-[11px] text-muted mt-0.5">Support and studio inquiries</p>
        </div>

        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-muted block mb-1">Creative Careers</span>
          <a href="${gmailComposeUrl}" onclick="window.open('${gmailComposeUrl}', '_blank');" class="text-text-primary hover:text-blue-300 font-mono text-xs transition-colors">${supportEmail}</a>
          <p class="text-[11px] text-muted mt-0.5">Jobs and internships</p>
        </div>
      </div>

      <!-- Bottom Bar: Newsletter & Copyright -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
        <div>
          <span class="text-white block font-medium mb-1">Stay ahead of AI search</span>
          <p class="text-[11px] text-muted">GEO tactics, product updates and playbooks, once a month, no spam.</p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto max-w-sm">
          <input type="email" placeholder="you@company.com" class="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-muted focus:outline-none focus:border-blue-500" />
          <button onclick="window.open('${gmailComposeUrl}', '_blank');" class="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center flex-shrink-0 transition-colors">
            →
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-stroke/20 text-[11px] text-muted/60">
        <div>© 2026 ${brand}. All rights reserved.</div>
        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-white transition-colors">Terms</a>
          <a href="#" class="hover:text-white transition-colors">Cookies</a>
          <a href="#" class="hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </div>
  </footer>

</body>
</html>`;
}

module.exports = { generateWebDevelopmentHtml };
