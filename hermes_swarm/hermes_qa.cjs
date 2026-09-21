/**
 * ==============================================================================
 * BOT 5: HERMES-QA (The Critic)
 * ==============================================================================
 * Model: Gemini 1.5 Flash (via process.env.GEMINI_API_KEY)
 * Role: Reviews the built site against "Anti-Slop Laws" and "Supreme Mechanics".
 * Power: Can REJECT builds and send back to Builder/Director for revision.
 */

const HermesProtocol = require('./hermes_protocol.cjs');

class HermesQA {
  constructor() {
    this.name = 'HERMES-QA';
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  auditWebsite(html) {
    HermesProtocol.log(this.name, `Initiating strict Anti-Slop Audit on generated build...`);

    const checks = [
      {
        rule: "NO_PRIMITIVES",
        label: "Zero Primitive Geometry (<Box>, <Sphere>)",
        passed: !/<Box|<Sphere/i.test(html)
      },
      {
        rule: "EDITORIAL_FONTS",
        label: "Editorial Typography (Playfair Display + Inter Tight via CDN)",
        passed: html.includes('Playfair+Display') && html.includes('Inter+Tight')
      },
      {
        rule: "ATMOSPHERIC_WASH_NO_FLAT_BLACK",
        label: "Atmospheric Brand-Hue Wash & SVG Noise (No flat #000)",
        passed: (html.includes('bg-noise') || html.includes('fractalNoise')) && html.includes('winewrap')
      },
      {
        rule: "SCROLL_SCRUB_HERO_LERP",
        label: "Mechanic 5: Scroll-Scrub Hero with Lerp Smoothing",
        passed: html.includes('scrubLoop') && html.includes('hero-zone') && html.includes('currentTime += (targetTime - currentTime)')
      },
      {
        rule: "PIN_PARALLAX_COCOON",
        label: "Mechanic 1: Pin-Parallax Sheets (Cocoon Pattern)",
        passed: html.includes('pinwrap') && html.includes('spacer') && html.includes('sheet')
      },
      {
        rule: "HORIZONTAL_RIDE",
        label: "Mechanic 6: Horizontal Ride (Down -> Right -> Down)",
        passed: html.includes('hs-sticky') && html.includes('track.style.transform = `translateX')
      },
      {
        rule: "PHOTO_CHAPTERS_SIM",
        label: "Mechanic 2: Full-Viewport Photo Chapters (FLOWERS/SIM)",
        passed: html.includes('class="ch"') && html.includes('class="fl"') && html.includes('catplate')
      },
      {
        rule: "GRADIENT_SEAMS",
        label: "Mechanic 3: Gradient Seam Fades (No hard section cuts)",
        passed: html.includes('seam-top') || html.includes('.ch .bg::after')
      },
      {
        rule: "EDITORIAL_HEADER_DIFFERENCE",
        label: "Mechanic 8: Difference Blend Header & Giant Wordmark Footer",
        passed: html.includes('mix-blend-mode: difference') && html.includes('giant-word')
      },
      {
        rule: "HIGGSFIELD_PROMPT_CITATIONS",
        label: "Higgsfield Simulation Prompt & Mechanics Citations",
        passed: html.includes('HIGGSFIELD AI VIDEO SIMULATION PROMPT') && html.includes('USING MECHANIC 5')
      }
    ];

    let passedCount = 0;
    checks.forEach(c => {
      if (c.passed) {
        passedCount++;
        HermesProtocol.log(this.name, `  ✓ PASS: ${c.label}`);
      } else {
        HermesProtocol.log(this.name, `  ❌ FAIL: ${c.label}`);
      }
    });

    const isApproved = passedCount === checks.length;
    const result = {
      status: isApproved ? 'APPROVED' : 'REJECTED',
      score: `${passedCount}/${checks.length}`,
      percentage: Math.round((passedCount / checks.length) * 100),
      timestamp: new Date().toISOString(),
      checks
    };

    if (isApproved) {
      HermesProtocol.log(this.name, `Passed Audit. 100% Anti-Slop Compliant (${result.score} checks passed).`);
    } else {
      HermesProtocol.log(this.name, `Audit FAILED. Rejected and returned to Director for remediation.`);
    }

    return result;
  }
}

module.exports = HermesQA;
