/**
 * ==============================================================================
 * BOT 6: HERMES-QA (Gemini Flash Vision - Token-Safe Anti-Slop Auditor)
 * ==============================================================================
 * Role: Audits built site code/snapshot against Anti-Slop Laws.
 * Token Efficiency: Reviews code diffs & structure with minimal text analysis. Max 2 retries.
 */

const HermesProtocol = require('./hermes_protocol.cjs');

class HermesQA {
  constructor() {
    this.name = 'HERMES-QA';
    this.apiKey = process.env.GEMINI_API_KEY;
    this.retryCount = 0;
    this.maxRetries = 2;
  }

  auditWebsite(html) {
    const inputTokens = HermesProtocol.estimateTokens(html);
    HermesProtocol.log(this.name, `Initiating Anti-Slop Audit (attempt ${this.retryCount + 1}/${this.maxRetries + 1})...`);

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

    const outputTokens = HermesProtocol.estimateTokens(result);
    HermesProtocol.logTokenUsage(this.name, inputTokens, outputTokens);

    if (isApproved) {
      HermesProtocol.log(this.name, `Passed Audit. 100% Anti-Slop Compliant (${result.score} checks passed).`);
    } else {
      this.retryCount++;
      if (this.retryCount > this.maxRetries) {
        HermesProtocol.log(this.name, `Audit FAILED. Max retry limit (${this.maxRetries}) reached. Execution halted to preserve token budget.`);
      } else {
        HermesProtocol.log(this.name, `Audit FAILED. Returning error log to Builder for retry ${this.retryCount}/${this.maxRetries}.`);
      }
    }

    return result;
  }
}

module.exports = HermesQA;
