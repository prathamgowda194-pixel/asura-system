/**
 * ASURA SUPREME SKILLS ORCHESTRATOR // HERMES SWARM & 5 CLAUDE DESIGN SKILLS
 * Formally encodes:
 * 1. [taste-skill]: Anti-slop doctrine, Awwwards editorial hierarchy, curated typography pairings
 * 2. [web-design-guidelines]: Zero CLS, mobile-first responsiveness, WCAG AA contrast, fast LCP
 * 3. [awesome-design]: Kinetic physics, magnetic precision cursor, 3D card tilt, active auto-scroll
 * 4. [image2code]: Architectural visual composition layer deconstruction
 * 5. [playwright-audit]: Headless DOM verification, WebGL canvas validation, zero syntax errors
 *
 * Hermes Swarm Specialist Roles:
 * - BOT 1: HERMES-ARCHITECT (Design DNA & Layout Archetype)
 * - BOT 2: HERMES-SCULPTOR (Real 3D WebGL Physical Geometry)
 * - BOT 3: HERMES-MOTION (Kinetic Auto-Scroll & Interaction Physics)
 * - BOT 4: HERMES-ACOUSTIC (Web Audio API Soundscapes)
 * - BOT 5: HERMES-AUDITOR (Playwright Audit & Mobile Responsive Rigor)
 *
 * Universal 2-Stage Master Prompt Workflow:
 * - Stage 1: Photorealistic 8K Keyframe Prompt (Octane/Lumen/Midjourney)
 * - Stage 2: 3D Camera Video Trajectory & Temporal Dynamics (Runway/Luma/Sora)
 */

const path = require('path');
const UniversalPromptEngine = require('./universal_prompt_engine.cjs');
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

class AsuraSkillsOrchestrator {
  constructor() {
    this.version = "12.0.0-CLAUDE-HERMES-REVOLUTION";
    this.claudeSkills = [
      "taste-skill",
      "web-design-guidelines",
      "awesome-design",
      "image2code",
      "playwright-audit"
    ];
    this.hermesBots = {
      architect: "Hermes-Architect (Taste, Typographic Hierarchy & Anti-Slop)",
      sculptor: "Hermes-Sculptor (3D Real Physical Geometry & WebGL PBR)",
      motion: "Hermes-Motion (Kinetic Auto-Scroll, Magnetic Cursor & Gyroscopic Tilt)",
      acoustic: "Hermes-Acoustic (Web Audio API Authentic Soundscapes)",
      auditor: "Hermes-Auditor (Playwright Verification, Zero CLS & Mobile Viewports)"
    };
  }

  getClaudeSkills() {
    return this.claudeSkills;
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
    brand = brand || "Apex Atelier";
    niche = (niche || "automotive").toLowerCase();

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

    // Default Universal Cinema Experience
    return cinemaTemplates.generateUniversalCinemaShowcaseHtml(brand, colors);
  }
}

module.exports = new AsuraSkillsOrchestrator();
