/**
 * ASURA SUPREME SKILLS ORCHESTRATOR // HERMES SWARM & PREMIUM WEB DESIGN SYSTEM
 * Formally encodes:
 * 1. [premium-web-design-system]: Editorial product aesthetic, Sans + Italic Serif pairing, 8-part layout
 * 2. [taste-skill]: Anti-slop doctrine, Awwwards editorial hierarchy, curated typography pairings
 * 3. [web-design-guidelines]: Zero CLS, mobile-first responsiveness, WCAG AA contrast, fast LCP
 * 4. [awesome-design]: Kinetic physics, magnetic precision cursor, 3D card tilt, active auto-scroll
 * 5. [image2code]: Architectural visual composition layer deconstruction
 * 6. [playwright-audit]: Headless DOM verification, WebGL canvas validation, zero syntax errors
 *
 * Hermes Swarm Specialist Roles:
 * - BOT 1: HERMES-ARCHITECT (Design DNA & Layout Archetype)
 * - BOT 2: HERMES-SCULPTOR (Real 3D WebGL Physical Geometry)
 * - BOT 3: HERMES-MOTION (Kinetic Auto-Scroll & Interaction Physics)
 * - BOT 4: HERMES-ACOUSTIC (Web Audio API Soundscapes)
 * - BOT 5: HERMES-AUDITOR (Playwright Audit & Mobile Responsive Rigor)
 */

const path = require('path');
const UniversalPromptEngine = require('./universal_prompt_engine.cjs');
const premiumWebDesignSystem = require('./skills/premium_web_design_system.cjs');
const tasteSkill = require('./skills/taste_skill.cjs');
const webDesignGuidelines = require('./skills/web_design_guidelines.cjs');
const awesomeDesign = require('./skills/awesome_design.cjs');
const image2code = require('./skills/image2code.cjs');
const playwrightAudit = require('./skills/playwright_audit.cjs');

const ferrariEngine = require('./bespoke_ferrari_engine.cjs');
const realEstateEngine = require('./bespoke_real_estate_engine.cjs');
const watchEngine = require('./bespoke_watch_engine.cjs');
const cafeEngine = require('./bespoke_cafe_engine.cjs');
const cinemaTemplates = require('./bespoke_cinema_templates.cjs');
const pixnovaEngine = require('./bespoke_pixnova_portfolio_engine.cjs');

class AsuraSkillsOrchestrator {
  constructor() {
    this.version = "14.0.0-PREMIUM-DESIGN-REVOLUTION";
    this.coreSkills = [
      "premium-web-design-system",
      "taste-skill",
      "web-design-guidelines",
      "awesome-design",
      "image2code",
      "playwright-audit"
    ];
    this.hermesBots = {
      architect: "Hermes-Architect (Premium Web Design System, Typographic Hierarchy & Anti-Slop)",
      sculptor: "Hermes-Sculptor (Real 3D WebGL Physical Geometry & WebGL PBR)",
      motion: "Hermes-Motion (Kinetic Auto-Scroll, Magnetic Cursor & Gyroscopic Tilt)",
      acoustic: "Hermes-Acoustic (Web Audio API Authentic Soundscapes)",
      auditor: "Hermes-Auditor (Playwright Verification, Zero CLS & Mobile Viewports)"
    };
  }

  getSkills() {
    return this.coreSkills;
  }

  getClaudeSkills() {
    return this.coreSkills;
  }

  getHermesBots() {
    return this.hermesBots;
  }

  getUniversalPrompts(niche, brand, details) {
    return {
      stage1_visualKeyframe: UniversalPromptEngine.generateVisualMasterPrompt(niche, brand, details),
      stage2_videoMotion: UniversalPromptEngine.generateVideoMotionMasterPrompt(niche, brand)
    };
  }

  generateMasterpiece(niche, brand, colors) {
    brand = brand || "Zenith Dynamics";
    niche = (niche || "agency").toLowerCase();

    if (niche === 'automotive' || /car|motor|hypercar|ferrari|velocity/i.test(niche)) {
      return ferrariEngine.generateFerrariShowcaseHtml(brand, colors);
    }
    if (niche === 'realestate' || /architecture|property|monolith|living|villa/i.test(niche)) {
      return realEstateEngine.generateRealEstateShowcaseHtml(brand, colors);
    }
    if (niche === 'watch' || /horlogerie|tourbillon|chronos|clock/i.test(niche)) {
      return watchEngine.generateWatchShowcaseHtml(brand, colors);
    }
    if (niche === 'cafe' || /coffee|roastery|gastronomy|rameshwaram/i.test(niche)) {
      return cafeEngine.generateCafeShowcaseHtml(brand, colors);
    }
    if (niche === 'saree' || /silk|couture|handloom|fashion|virasat/i.test(niche)) {
      return cinemaTemplates.generateSareeShowcaseHtml(brand, colors);
    }
    if (niche === 'portfolio' || /portfolio|pixnova|dark portfolio|agency portfolio|showcase/i.test(niche)) {
      return pixnovaEngine.generatePixnovaPortfolioHtml(brand, colors);
    }

    // Default Premium Web Design System Implementation
    return premiumWebDesignSystem.generateWebsite({
      brand: brand,
      category: "Autonomous Digital",
      accentWord: "Architecture",
      headlineSuffix: "at Global Scale",
      subheadline: "Engineered for visionaries and category leaders. Build faster, cleaner workflows with precision digital systems your team can trust every day.",
      primaryCta: "Explore System",
      secondaryCta: "Schedule Briefing"
    });
  }
}

module.exports = new AsuraSkillsOrchestrator();
