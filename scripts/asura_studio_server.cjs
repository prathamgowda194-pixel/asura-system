/**
 * ==============================================================================
 * ASURA AGENTIC AI WEBSITE DEVELOPER // LOCAL STUDIO SERVER
 * ==============================================================================
 * - Standalone Zero-Dependency Local HTTP Server
 * - Serves Asura Studio Workspace on http://localhost:3000
 * - Inbuilt API Endpoints: /api/generate_website, /api/health_check_sites
 * ==============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.cjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // --- API: HEALTH CHECK SITES FOR VERCEL RADAR ---
  if (pathname === '/api/health_check_sites') {
    const sites = [
      { slug: 'crypto-lottery', name: 'Asura Crypto Lottery Protocol', url: 'https://asura-system.vercel.app/projects/crypto-lottery/index.html' },
      { slug: 'bhoomiputra-real-estate', name: 'Bhoomiputra Luxury Real Estate', url: 'https://asura-system.vercel.app/api/serve_project?slug=bhoomiputra-real-estate-developers-bangalore' },
      { slug: 'skin-secrets-cochin', name: 'Skin Secrets Aesthetic Dermatology', url: 'https://asura-system.vercel.app/api/serve_project?slug=skin-secrets-in-edappally-cochin-kochi' },
      { slug: 'impact-fitness-bangalore', name: 'Impact Fitness & CrossFit Studio', url: 'https://asura-system.vercel.app/api/serve_project?slug=impact-fitness-center-bangalore' },
      { slug: 's-m-corporation-interiors', name: 'S M Corporation Modular Interiors', url: 'https://asura-system.vercel.app/api/serve_project?slug=s-m-corporation-interiors-bangalore' },
      { slug: 'byob-restaurant', name: 'BYOB Culinary & Craft Lounge', url: 'https://asura-system.vercel.app/api/serve_project?slug=byob-restaurant' }
    ];

    const results = await Promise.all(sites.map(async (s) => {
      try {
        const start = Date.now();
        const r = await fetch(s.url, { method: 'HEAD', signal: AbortSignal.timeout(4000) });
        const latency = Date.now() - start;
        return {
          ...s,
          status: r.status,
          online: r.status >= 200 && r.status < 400,
          latency: latency + 'ms'
        };
      } catch (e) {
        return {
          ...s,
          status: 504,
          online: false,
          error: e.message,
          latency: 'Timeout'
        };
      }
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, timestamp: new Date().toISOString(), sites: results }));
  }

  // --- API: AGENTIC WEBSITE GENERATOR ---
  if (pathname === '/api/generate_website' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const prompt = payload.prompt || 'Modern Luxury Agency Website';
        const model = payload.model || 'Asura 3.5 Flash High';
        const attachments = payload.attachments || [];

        // Synthesize agentic plan & code
        const responseData = {
          ok: true,
          modelUsed: model,
          executionId: 'ASURA-' + Date.now().toString(36).toUpperCase(),
          agentSteps: [
            { step: 'Requirement Decomposition', detail: 'Analyzed prompt: "' + prompt.slice(0, 80) + '..." with ' + attachments.length + ' attached reference(s).' },
            { step: 'Aesthetic & Architectural Blueprint', detail: 'Synthesized high-converting design layout, typography hierarchy, and kinetic animations.' },
            { step: 'Source Code Generation', detail: 'Compiled responsive HTML5, Tailwind CSS, kinetic motion shaders, and interactive components.' },
            { step: 'Sandbox Compilation Ready', detail: 'Website live in split-screen sandbox. Ready for 1-click Vercel deployment.' }
          ],
          generatedWebsite: {
            title: prompt.slice(0, 40) + ' | Asura AI Generated',
            slug: prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 35),
            html: generateSandboxHtml(prompt, attachments)
          }
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(responseData));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = pathname === '/' ? path.join(ROOT_DIR, 'index.html') : path.join(ROOT_DIR, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback to index.html
  const indexPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  res.writeHead(404);
  res.end('Not Found');
});

function generateSandboxHtml(prompt, attachments) {
  const cleanTitle = prompt.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().slice(0, 50) || 'Custom Enterprise Prototype';
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle} // ASURA AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { background-color: #050709; color: #f1f5f9; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
    .neon-glow { text-shadow: 0 0 20px rgba(0, 255, 102, 0.4); }
    .glass-card { background: rgba(10, 14, 20, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(0, 255, 102, 0.2); }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <nav class="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-50">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">⟐</div>
      <span class="font-bold text-white tracking-wider text-sm">${cleanTitle.toUpperCase()}</span>
    </div>
    <div class="flex items-center space-x-3 text-xs">
      <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">LIVE PREVIEW</span>
      <button class="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold font-mono">CLAIM PROTOTYPE</button>
    </div>
  </nav>

  <main class="max-w-6xl mx-auto px-6 py-20 flex-1 flex flex-col items-center text-center space-y-8">
    <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>GENERATED AUTONOMOUSLY BY ASURA AI WEBSITE DEVELOPER</span>
    </div>

    <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-3xl leading-[1.1]">
      Bespoke Digital Experience for <br>
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white neon-glow">${cleanTitle}</span>
    </h1>

    <p class="text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
      Custom architectural web interface designed from user requirements with zero template bloat, institutional typography, and interactive motion physics.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <button class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs tracking-wider transition shadow-lg shadow-emerald-500/20">
        EXPLORE LIVE CAPABILITIES &rarr;
      </button>
      <button class="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs border border-zinc-800 transition">
        INSPECT SOURCE CODE
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16 text-left">
      <div class="glass-card p-6 rounded-2xl space-y-3">
        <div class="text-emerald-400 font-mono text-xs">MODULE 01</div>
        <h3 class="text-lg font-bold text-white">Ultra-Responsive Architecture</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Engineered with mobile-first fluid grids, high-DPI asset optimization, and instantaneous load times.</p>
      </div>
      <div class="glass-card p-6 rounded-2xl space-y-3">
        <div class="text-emerald-400 font-mono text-xs">MODULE 02</div>
        <h3 class="text-lg font-bold text-white">Kinetic Motion Shaders</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Dynamic physics-driven interactions, hover parallax, and smooth GPU-accelerated micro-interactions.</p>
      </div>
      <div class="glass-card p-6 rounded-2xl space-y-3">
        <div class="text-emerald-400 font-mono text-xs">MODULE 03</div>
        <h3 class="text-lg font-bold text-white">Zero-Friction Conversion</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Integrated 1-click lead capture and high-converting modern FinTech & luxury brand ergonomics.</p>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-900 py-6 px-6 text-center text-xs text-zinc-600 font-mono">
    &copy; 2026 ${cleanTitle}. ARCHITECTED BY ASURA AI STUDIO.
  </footer>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log('====================================================');
  console.log('   ASURA AGENTIC AI WEBSITE DEVELOPER STUDIO LIVE   ');
  console.log('====================================================');
  console.log(' Local Workspace URL: http://localhost:' + PORT);
  console.log(' Production Cloud   : https://asura-system.vercel.app');
  console.log('====================================================');
});
