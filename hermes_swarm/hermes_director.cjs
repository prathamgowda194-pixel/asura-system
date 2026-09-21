/**
 * ==============================================================================
 * BOT 1: HERMES-DIRECTOR (The Brain)
 * ==============================================================================
 * Model: Gemini 1.5 Flash (via process.env.GEMINI_API_KEY)
 * Role: Receives client brief. Decomposes it into technical specs. Assigns tasks to other bots.
 * Constraint: DOES NOT write code. Only plans, assigns tasks, and tracks state.
 */

const HermesProtocol = require('./hermes_protocol.cjs');

class HermesDirector {
  constructor() {
    this.name = 'HERMES-DIRECTOR';
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  async decomposeBrief(brief) {
    HermesProtocol.log(this.name, `Received client brief: "${brief}"`);

    // Parse brand name from prompt
    let brandName = "Chronos Atelier";
    const brandMatch = brief.match(/(?:named|called|for)\s+([A-Za-z0-9\s'&]+?)(?=(?:\s+(?:who|which|that|with|in|for|and|to|featuring)\b|[.,!?;]|$))/i);
    if (brandMatch && brandMatch[1].trim()) {
      brandName = brandMatch[1].trim();
    } else if (/watch|horology/i.test(brief)) {
      brandName = "Chronos Atelier";
    } else if (/coffee|cafe|roast/i.test(brief)) {
      brandName = "Artisan Roastery";
    }

    // Determine niche
    let niche = "luxury_watch";
    if (/coffee|cafe|roast|dining|bistro/i.test(brief)) niche = "artisan_coffee";
    if (/car|auto|supercar|motors/i.test(brief)) niche = "hypercar_automotive";
    if (/estate|villa|architecture/i.test(brief)) niche = "luxury_real_estate";

    HermesProtocol.log(this.name, `Decomposed specifications for brand "${brandName}" in niche "${niche}".`);

    // Task decomposition
    const taskPlan = {
      brandName,
      niche,
      selectedMechanics: [
        { id: "MECHANIC_5", name: "Scroll-Scrub Hero Zone", role: "Hero interactive film" },
        { id: "MECHANIC_8", name: "Editorial Header & Giant Wordmark", role: "Difference-blend header & stroked footer" },
        { id: "MECHANIC_1", name: "Pin-Parallax Sheets", role: "Cocoon intro content slides over sticky background" },
        { id: "MECHANIC_6", name: "Horizontal Ride", role: "Horizontal product gallery mapped to vertical scroll" },
        { id: "MECHANIC_2", name: "Full-Viewport Photo Chapters", role: "FLOWERS/SIM negative-margin storytelling scenes" },
        { id: "MECHANIC_3", name: "Gradient Seam Fades", role: "Eliminate hard section cuts with linear gradient overlays" },
        { id: "MECHANIC_4", name: "Brand-Hue Washes", role: "Atmospheric depth blur behind content" },
        { id: "MECHANIC_7", name: "Reveal System", role: "IntersectionObserver entrance scaling and stagger" }
      ],
      delegations: {
        archivistTask: {
          action: "FETCH_GITHUB_COMPONENTS",
          repos: [
            "shadcn-ui-mcp-server",
            "gsap-master",
            "frontend-design",
            "ui-ux-pro-max",
            "design-taste-frontend",
            "21st.dev Magic MCP"
          ],
          targetElements: ["ProductCard", "EditorialNavbar", "ParallaxTimeline", "BentoGrid"]
        },
        forgeTask: {
          action: "GENERATE_HOOK_FIRST_ASSETS",
          niche,
          brandName,
          visualNeeds: ["hero_video_macro", "chapter_1_image", "chapter_2_image", "product_packshots"]
        },
        builderTask: {
          action: "ASSEMBLE_CINEMA_WEBSITE",
          doctrine: "ASURA_CORE_MECHANICS.md",
          mandatoryComments: true
        },
        qaTask: {
          action: "ANTI_SLOP_AUDIT",
          standards: ["NoPrimitives", "EditorialTypography", "BlurredBrandWash", "ScrollScrubLerp", "GradientSeams"]
        }
      }
    };

    HermesProtocol.log(this.name, `Assigned tasks to ARCHIVIST, FORGE, BUILDER, and QA.`);
    return taskPlan;
  }
}

module.exports = HermesDirector;
