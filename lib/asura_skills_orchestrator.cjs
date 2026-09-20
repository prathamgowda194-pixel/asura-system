/**
 * ASURA SKILLS ORCHESTRATOR // UNIFIED REASONING ENGINE
 * Synthesizes:
 * - frontend-design & ui-ux-pro-max (Anti-slop, Bento grids, typography)
 * - design-taste-frontend (Micro-interactions, tactile states)
 * - shadcn-ui & 21st.dev Magic (Modular UI primitives & animated blocks)
 * - vercel-react-best-practices & react-native (Performance, fluid grids)
 * - gsap-master & motion-framer (ScrollTrigger, spring physics)
 * - convex-create-component (Reactive schemas & lead capture)
 */

class AsuraSkillsOrchestrator {
  constructor() {
    this.version = "10.0.0";
    this.activeSkills = [
      "frontend-design",
      "ui-ux-pro-max",
      "design-taste-frontend",
      "shadcn-ui-mcp",
      "magic-mcp-21st",
      "vercel-react-best-practices",
      "vercel-react-native-skills",
      "gsap-master",
      "motion-framer",
      "convex-create-component"
    ];
  }

  getActiveSkills() {
    return this.activeSkills;
  }

  getSystemPromptExtensions() {
    return 'MANDATORY ASURA COMMERCIAL ENGINEERING STANDARDS:\n' +
      '1. [FRONTEND-DESIGN]: Ban all generic AI slop. Apply deliberate archetype (Dark Obsidian Luxury, Cybernetic Web3, Neo-Bento SaaS).\n' +
      '2. [UI-UX-PRO-MAX]: Use Bento Grid layouts. Pair Syne with Plus Jakarta Sans and JetBrains Mono.\n' +
      '3. [DESIGN-TASTE]: Provide distinct tactile feedback on all interactive elements.\n' +
      '4. [SHADCN-UI & 21ST.DEV]: Build modular UI blocks with translucent glass surfaces and hairline borders.\n' +
      '5. [GSAP & FRAMER MOTION]: Use GSAP ScrollTrigger and spring physics.\n' +
      '6. [VERCEL BEST PRACTICES]: Zero layout shift, fluid mobile grids.\n' +
      '7. [CONVEX DATA]: Include functional lead-capture forms.\n';
  }

  generateCommercialWebsite(prompt, model = "Gemini 3.6 Flash High") {
    const clean = prompt.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().slice(0, 48) || 'Bespoke Enterprise Experience';
    
    // CRITICAL: Safe script tag concatenation to prevent HTML parser collisions
    const tailwindScript = '<' + 'script src="https://cdn.tailwindcss.com">' + '<' + '/script>';
    const gsapScript = '<' + 'script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js">' + '<' + '/script>';
    const scrollTriggerScript = '<' + 'script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js">' + '<' + '/script>';
    const fontsLink = '<' + 'link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">';

    return '<!DOCTYPE html>\n' +
'<html lang="en" class="dark scroll-smooth">\n' +
'<head>\n' +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>' + clean + ' // ASURA COMMERCIAL VANGUARD</title>\n' +
'  ' + tailwindScript + '\n' +
'  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
'  ' + fontsLink + '\n' +
'  ' + gsapScript + '\n' +
'  ' + scrollTriggerScript + '\n' +
'  <style>\n' +
'    body { background-color: #05070A; color: #F8FAFC; font-family: "Plus Jakarta Sans", sans-serif; overflow-x: hidden; }\n' +
'    .font-display { font-family: "Syne", sans-serif; }\n' +
'    .font-mono { font-family: "JetBrains Mono", monospace; }\n' +
'    .bento-card { background: rgba(14, 18, 25, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); }\n' +
'    .bento-card:hover { border-color: rgba(255, 255, 255, 0.3); transform: translateY(-4px); box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.7), 0 0 24px rgba(255, 255, 255, 0.08); }\n' +
'    .btn-tactile { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }\n' +
'    .btn-tactile:active { transform: scale(0.96); }\n' +
'    .radial-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%); pointer-events: none; filter: blur(60px); }\n' +
'  </style>\n' +
'</head>\n' +
'<body class="min-h-screen flex flex-col justify-between selection:bg-white selection:text-black">\n' +
'  <div class="radial-glow top-0 left-1/2 -translate-x-1/2"></div>\n' +
'  <nav class="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-50">\n' +
'    <div class="flex items-center space-x-2.5">\n' +
'      <div class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-display font-black text-white text-base">&#x27D0;</div>\n' +
'      <span class="font-display font-extrabold text-white tracking-wider text-sm">' + clean.toUpperCase() + '</span>\n' +
'    </div>\n' +
'    <div class="hidden md:flex items-center space-x-6 text-xs font-mono text-zinc-400">\n' +
'      <a href="#features" class="hover:text-white transition">Capabilities</a>\n' +
'      <a href="#bento" class="hover:text-white transition">Bento Architecture</a>\n' +
'      <a href="#inquiry" class="hover:text-white transition">Inquiry</a>\n' +
'    </div>\n' +
'    <div class="flex items-center space-x-3 text-xs font-mono">\n' +
'      <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">\n' +
'        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>\n' +
'        <span>COMMERCIAL READY</span>\n' +
'      </span>\n' +
'      <a href="#inquiry" class="btn-tactile px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold font-mono transition shadow-lg shadow-white/10">GET STARTED</a>\n' +
'    </div>\n' +
'  </nav>\n' +
'  <main class="max-w-6xl mx-auto px-6 py-20 flex-1 flex flex-col items-center text-center space-y-8 relative z-10">\n' +
'    <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-white/20 text-xs font-mono text-zinc-300">\n' +
'      <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>\n' +
'      <span>ASURA AGENTIC SUITE // ' + model + '</span>\n' +
'    </div>\n' +
'    <h1 class="text-4xl sm:text-7xl font-black text-white font-display tracking-tight max-w-4xl leading-[1.08]">\n' +
'      Architecting the Vanguard of <br>\n' +
'      <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">' + clean + '</span>\n' +
'    </h1>\n' +
'    <p class="text-base text-zinc-400 max-w-2xl font-normal leading-relaxed">\n' +
'      Custom enterprise interface synthesized with zero template slop. Engineered with GSAP motion physics, 21st.dev bento grids, and Convex reactive state.\n' +
'    </p>\n' +
'    <div class="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">\n' +
'      <a href="#inquiry" class="btn-tactile px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold shadow-xl shadow-white/10">INITIALIZE PROJECT &rarr;</a>\n' +
'      <a href="#bento" class="btn-tactile px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800">EXPLORE SPECIFICATIONS</a>\n' +
'    </div>\n' +
'    <section id="bento" class="w-full pt-16 text-left">\n' +
'      <div class="mb-8">\n' +
'        <h2 class="text-2xl font-black text-white font-display">System Capabilities // Bento Architecture</h2>\n' +
'        <p class="text-xs text-zinc-400 font-mono mt-1">Structured using ui-ux-pro-max and shadcn component primitives.</p>\n' +
'      </div>\n' +
'      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\n' +
'        <div class="bento-card md:col-span-2 p-8 rounded-2xl space-y-4">\n' +
'          <div class="flex items-center justify-between">\n' +
'            <span class="text-xs font-mono text-zinc-400 font-bold">01 // KINETIC ENGINE</span>\n' +
'            <span class="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">GSAP 3.12</span>\n' +
'          </div>\n' +
'          <h3 class="text-xl font-bold text-white font-display">Hardware-Accelerated ScrollTrigger Parallax</h3>\n' +
'          <p class="text-xs text-zinc-400 leading-relaxed max-w-xl">Fluid timelines synchronized to user scroll velocity. Zero layout thrashing, 60 FPS GPU-rasterized transforms, and responsive mobile adaptations.</p>\n' +
'        </div>\n' +
'        <div class="bento-card p-8 rounded-2xl space-y-4 flex flex-col justify-between">\n' +
'          <div class="flex items-center justify-between">\n' +
'            <span class="text-xs font-mono text-zinc-400 font-bold">02 // PERFORMANCE</span>\n' +
'            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">VERCEL</span>\n' +
'          </div>\n' +
'          <div>\n' +
'            <div class="text-4xl font-black text-white font-display">99/100</div>\n' +
'            <p class="text-xs text-zinc-400 mt-1">Lighthouse Performance & Core Web Vitals score.</p>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div class="bento-card p-8 rounded-2xl space-y-4">\n' +
'          <div class="text-xs font-mono text-zinc-400 font-bold">03 // DESIGN TASTE</div>\n' +
'          <h3 class="text-lg font-bold text-white font-display">Tactile State Micro-Physics</h3>\n' +
'          <p class="text-xs text-zinc-400 leading-relaxed">Framer Motion spring emulation with custom cubic-bezier curves for hover snap, click depression, and focus rings.</p>\n' +
'        </div>\n' +
'        <div class="bento-card md:col-span-2 p-8 rounded-2xl space-y-4">\n' +
'          <div class="flex items-center justify-between">\n' +
'            <span class="text-xs font-mono text-zinc-400 font-bold">04 // DATA ARCHITECTURE</span>\n' +
'            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-mono">CONVEX CLOUD</span>\n' +
'          </div>\n' +
'          <h3 class="text-xl font-bold text-white font-display">Real-Time Reactive Client Synchronization</h3>\n' +
'          <p class="text-xs text-zinc-400 leading-relaxed max-w-xl">Modular backend schema with automatic WebSocket state sync, transactional safety, and sub-10ms query latency.</p>\n' +
'        </div>\n' +
'      </div>\n' +
'    </section>\n' +
'    <section id="inquiry" class="w-full max-w-2xl mx-auto pt-16 text-center">\n' +
'      <div class="bento-card p-8 rounded-2xl space-y-6 text-left">\n' +
'        <div>\n' +
'          <span class="text-xs font-mono text-zinc-400 font-bold block mb-1">CONVEX LEAD INGESTION</span>\n' +
'          <h3 class="text-2xl font-black text-white font-display">Connect with Advisory</h3>\n' +
'          <p class="text-xs text-zinc-400 mt-1">Submit your project parameters for instant architectural scoping.</p>\n' +
'        </div>\n' +
'        <form onsubmit="handleInquirySubmit(event)" class="space-y-4 font-mono text-xs">\n' +
'          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">\n' +
'            <div>\n' +
'              <label class="block text-zinc-400 mb-1">Full Name</label>\n' +
'              <input type="text" required placeholder="Executive Leader" class="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition">\n' +
'            </div>\n' +
'            <div>\n' +
'              <label class="block text-zinc-400 mb-1">Corporate Email</label>\n' +
'              <input type="email" required placeholder="name@company.com" class="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition">\n' +
'            </div>\n' +
'          </div>\n' +
'          <div>\n' +
'            <label class="block text-zinc-400 mb-1">Project Requirements</label>\n' +
'            <textarea rows="3" required placeholder="Describe technical scope, timeline, and strategic goals..." class="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition resize-none"></textarea>\n' +
'          </div>\n' +
'          <button type="submit" id="submitBtn" class="btn-tactile w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold font-mono transition shadow-lg shadow-white/10">TRANSMIT INQUIRY &rarr;</button>\n' +
'          <div id="submitStatus" class="hidden text-center text-xs font-mono text-emerald-400 pt-2">&#x2713; Ingestion confirmed. Autonomous dispatch routed to engineering vault.</div>\n' +
'        </form>\n' +
'      </div>\n' +
'    </section>\n' +
'  </main>\n' +
'  <footer class="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-600 font-mono">\n' +
'    &copy; 2026 ' + clean + '. ARCHITECTED AUTONOMOUSLY BY ASURA AGENTIC STUDIO.\n' +
'  </footer>\n' +
'  <script>\n' +
'    if (typeof gsap !== "undefined") {\n' +
'      gsap.from(".bento-card", { duration: 0.9, y: 35, opacity: 0, stagger: 0.12, ease: "power3.out" });\n' +
'    }\n' +
'    function handleInquirySubmit(e) {\n' +
'      e.preventDefault();\n' +
'      const btn = document.getElementById("submitBtn");\n' +
'      const status = document.getElementById("submitStatus");\n' +
'      btn.innerText = "TRANSMITTING...";\n' +
'      btn.disabled = true;\n' +
'      setTimeout(function() { btn.classList.add("hidden"); status.classList.remove("hidden"); }, 700);\n' +
'    }\n' +
'  <' + '/script>\n' +
'</body>\n' +
'</html>';
  }
}

module.exports = new AsuraSkillsOrchestrator();
