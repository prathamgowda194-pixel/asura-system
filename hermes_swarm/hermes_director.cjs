/**
 * ==============================================================================
 * BOT 1: HERMES-DIRECTOR (Gemini Flash - Low Frequency, High-Level Reasoning)
 * ==============================================================================
 * Role: Summarizes briefs into concise bullet points & spec.json.
 * Token Efficiency: Prunes conversational bloat, minimizing input token load downstream.
 */

const HermesProtocol = require('./hermes_protocol.cjs');

class HermesDirector {
  constructor() {
    this.name = 'HERMES-DIRECTOR';
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  async decomposeBrief(brief) {
    HermesProtocol.log(this.name, `Received brief: "${brief}". Pruning conversational context for downstream bots...`);

    const inputTokens = HermesProtocol.estimateTokens(brief);

    // Extract brand name
    let brandName = "Chronos Atelier";
    const brandMatch = brief.match(/(?:named|called|for)\s+([A-Za-z0-9\s'&]+?)(?=(?:\s+(?:who|which|that|with|in|for|and|to|featuring)\b|[.,!?;]|$))/i);
    if (brandMatch && brandMatch[1].trim()) {
      brandName = brandMatch[1].trim();
    } else if (/watch|horology/i.test(brief)) {
      brandName = "Chronos Atelier";
    } else if (/coffee|cafe/i.test(brief)) {
      brandName = "Artisan Roastery";
    }

    // Determine niche
    let niche = "luxury_watch";
    if (/coffee|cafe|roast|dining/i.test(brief)) niche = "artisan_coffee";
    if (/car|auto|supercar/i.test(brief)) niche = "hypercar_automotive";
    if (/estate|villa/i.test(brief)) niche = "luxury_real_estate";

    // Build concise spec.json
    const spec = {
      brandName,
      niche,
      palette: {
        dark: "#09090b",
        accent: "#D4AF37",
        accentLight: "#fde68a",
        border: "rgba(255,255,255,0.12)"
      },
      mechanics: ["M5_SCROLL_SCRUB", "M8_EDITORIAL_HEADER", "M1_PIN_PARALLAX", "M6_HORIZONTAL_RIDE", "M2_PHOTO_CHAPTERS", "M3_GRADIENT_SEAMS", "M4_BRAND_WASH", "M7_REVEAL"],
      assetNeeds: {
        hero: "macro_mechanical_escapement",
        chapters: ["escapement_craft", "titanium_architecture"],
        gallery: 4
      }
    };

    const outputTokens = HermesProtocol.estimateTokens(spec);
    HermesProtocol.logTokenUsage(this.name, inputTokens, outputTokens);
    HermesProtocol.log(this.name, `Emitted pruned spec.json for "${brandName}" (${niche}). Assigned tasks sequentially.`);

    return spec;
  }
}

module.exports = HermesDirector;
