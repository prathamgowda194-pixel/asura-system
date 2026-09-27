/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA SYSTEM // ANIMATION & VIBE CODING VAULT ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * Connects high-end animation engines and design pattern libraries:
 * 1. Refero.design   -> Luxury Real-World UI & Layout Blueprints
 * 2. UI.Aceternity   -> Modern Animated Components (Spotlight, 3D Tilt, Border Beam)
 * 3. GSAP.com        -> ScrollTrigger Pinned Scrub Timelines & Kinetic Typography
 * 4. Anime.js        -> Spring Physics Micro-Interactions & Magnetic Elements
 * ══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const VAULT_REGISTRY = {
  sources: [
    {
      id: 'refero',
      name: 'Refero.design',
      url: 'https://refero.design',
      category: 'UI/UX Layout Inspiration & Component Architecture',
      description: 'Curated real-world luxury interfaces, conversion patterns, and modern spatial grids.'
    },
    {
      id: 'aceternity',
      name: 'Aceternity UI',
      url: 'https://ui.aceternity.com',
      category: 'Interactive Animated Components',
      description: 'Spotlight glow, 3D card perspective tilt, moving border beams, bento grids, and metallic liquid text.'
    },
    {
      id: 'gsap',
      name: 'GSAP 3 + ScrollTrigger',
      url: 'https://gsap.com',
      category: 'Cinematic Scroll Engines',
      description: 'Apple Pro style pinned video scrubbing, lerp interpolation, velocity-based transformations, and kinetic typography.'
    },
    {
      id: 'animejs',
      name: 'Anime.js',
      url: 'https://animejs.com',
      category: 'Micro-Interactions & Physics',
      description: 'Physics-based spring easing, magnetic cursor attraction, SVG path morphs, and smooth number tickers.'
    }
  ],

  // Production-ready reusable client-side animation code injections
  components: {
    // 1. Aceternity Spotlight Effect
    spotlight: {
      name: 'Aceternity Spotlight Radial Glow',
      css: `
        .spotlight-container {
          position: relative;
          overflow: hidden;
        }
        .spotlight-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            800px circle at var(--spot-x, 50%) var(--spot-y, 50%),
            rgba(56, 189, 248, 0.12),
            transparent 50%
          );
          transition: opacity 0.4s ease;
          opacity: 0;
          z-index: 10;
        }
        .spotlight-container:hover .spotlight-glow {
          opacity: 1;
        }
      `,
      js: `
        function initSpotlight(selector = '.spotlight-container') {
          document.querySelectorAll(selector).forEach(el => {
            const glow = el.querySelector('.spotlight-glow') || document.createElement('div');
            glow.className = 'spotlight-glow';
            if (!el.querySelector('.spotlight-glow')) el.appendChild(glow);

            el.addEventListener('mousemove', (e) => {
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              el.style.setProperty('--spot-x', x + 'px');
              el.style.setProperty('--spot-y', y + 'px');
            });
          });
        }
      `
    },

    // 2. Aceternity 3D Card Perspective Tilt
    card3DTilt: {
      name: 'Aceternity 3D Perspective Tilt Card',
      css: `
        .card-3d-wrap {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .card-3d-body {
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .card-3d-body.is-tilting {
          transition: transform 0.05s linear;
        }
        .card-3d-glare {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.18), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          mix-blend-mode: overlay;
        }
        .card-3d-wrap:hover .card-3d-glare {
          opacity: 1;
        }
      `,
      js: `
        function init3DCardTilt(selector = '.card-3d-wrap') {
          document.querySelectorAll(selector).forEach(wrap => {
            const body = wrap.querySelector('.card-3d-body');
            if (!body) return;
            let glare = wrap.querySelector('.card-3d-glare');
            if (!glare) {
              glare = document.createElement('div');
              glare.className = 'card-3d-glare';
              body.appendChild(glare);
            }

            wrap.addEventListener('mousemove', (e) => {
              const rect = wrap.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = ((y - centerY) / centerY) * -10;
              const rotateY = ((x - centerX) / centerX) * 10;

              body.classList.add('is-tilting');
              body.style.transform = \`rotateX(\${rotateX.toFixed(2)}deg) rotateY(\${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)\`;
              wrap.style.setProperty('--glare-x', x + 'px');
              wrap.style.setProperty('--glare-y', y + 'px');
            });

            wrap.addEventListener('mouseleave', () => {
              body.classList.remove('is-tilting');
              body.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
          });
        }
      `
    },

    // 3. Aceternity Moving Border Beam
    borderBeam: {
      name: 'Aceternity Glowing Border Beam',
      css: `
        .border-beam-card {
          position: relative;
          border-radius: 1.5rem;
          background: #0f172a;
          padding: 1px;
          overflow: hidden;
        }
        .border-beam-card::before {
          content: '';
          position: absolute;
          inset: -150%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            #38bdf8 60deg,
            #818cf8 120deg,
            transparent 180deg
          );
          animation: rotateBorderBeam 6s linear infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .border-beam-card:hover::before {
          opacity: 1;
        }
        @keyframes rotateBorderBeam {
          100% { transform: rotate(360deg); }
        }
      `
    },

    // 4. Aceternity Liquid Chrome Shimmer Text
    liquidChrome: {
      name: 'Aceternity Liquid Chrome Metallic Text',
      css: `
        .liquid-chrome-text {
          background: linear-gradient(
            120deg,
            #94a3b8 0%,
            #e2e8f0 20%,
            #ffffff 40%,
            #64748b 60%,
            #ffffff 80%,
            #94a3b8 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: liquidChromeShimmer 4s ease-in-out infinite;
          filter: drop-shadow(0 15px 35px rgba(0,0,0,0.45));
        }
        @keyframes liquidChromeShimmer {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `
    },

    // 5. Magnetic CTA Buttons (Anime.js / Physics)
    magneticButton: {
      name: 'Anime.js Spring Magnetic Button',
      css: `
        .magnetic-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          will-change: transform;
        }
      `,
      js: `
        function initMagneticButtons(selector = '.magnetic-btn') {
          document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
              const rect = btn.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
              const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
              btn.style.transform = \`translate3d(\${x.toFixed(1)}px, \${y.toFixed(1)}px, 0) scale(1.05)\`;
            });
            btn.addEventListener('mouseleave', () => {
              btn.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
            });
          });
        }
      `
    },

    // 6. Interactive 4-Chevron Mosaic Focus
    chevronFocus: {
      name: 'Refero & Aceternity Interlocking Chevron Focus',
      css: `
        .chevrons-container:hover .chevron-item {
          opacity: 0.65;
          filter: grayscale(15%);
          transform: scale(0.98);
        }
        .chevrons-container .chevron-item:hover {
          opacity: 1 !important;
          filter: grayscale(0%) !important;
          transform: scale(1.06) translateX(4px) !important;
          z-index: 40 !important;
        }
      `
    }
  }
};

function getVaultInjectionHTML() {
  return `
  <!-- ═══════════════════════════════════════════════════════════════
       ASURA ANIMATION & VIBE CODING VAULT STYLES (Aceternity + Refero + GSAP)
  ════════════════════════════════════════════════════════════════ -->
  <style>
    ${VAULT_REGISTRY.components.spotlight.css}
    ${VAULT_REGISTRY.components.card3DTilt.css}
    ${VAULT_REGISTRY.components.borderBeam.css}
    ${VAULT_REGISTRY.components.liquidChrome.css}
    ${VAULT_REGISTRY.components.magneticButton.css}
    ${VAULT_REGISTRY.components.chevronFocus.css}
  </style>

  <!-- ═══════════════════════════════════════════════════════════════
       ASURA ANIMATION VAULT CLIENT SCRIPTS (Physics & Interactions)
  ════════════════════════════════════════════════════════════════ -->
  <script>
    ${VAULT_REGISTRY.components.spotlight.js}
    ${VAULT_REGISTRY.components.card3DTilt.js}
    ${VAULT_REGISTRY.components.magneticButton.js}

    document.addEventListener('DOMContentLoaded', () => {
      initSpotlight('.spotlight-container');
      init3DCardTilt('.card-3d-wrap');
      initMagneticButtons('.magnetic-btn');
    });
  </script>
  `;
}

module.exports = {
  VAULT_REGISTRY,
  getVaultInjectionHTML
};
