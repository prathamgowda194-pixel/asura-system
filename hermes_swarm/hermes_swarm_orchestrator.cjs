/**
 * ==============================================================================
 * HERMES SWARM ORCHESTRATOR // TOKEN-EFFICIENT 6-BOT SEQUENTIAL PIPELINE
 * ==============================================================================
 * Architecture:
 *   1. HERMES-DIRECTOR (Gemini Flash): High-level reasoning -> spec.json
 *   2. HERMES-ARCHIVIST (Groq): Cache-first component retrieval
 *   3. HERMES-VISIONARY (Gemini Flash Image): 1024x1024 visual anchor generation
 *   4. HERMES-FORGE (21st.dev API): Vault-first motion loop conversion
 *   5. HERMES-BUILDER (Groq Qwen2.5-Coder): Context-pruned single-file synthesis
 *   6. HERMES-QA (Gemini Flash Vision): Anti-slop audit (max 2 retries)
 */

const fs = require('fs');
const path = require('path');
const HermesProtocol = require('./hermes_protocol.cjs');
const HermesDirector = require('./hermes_director.cjs');
const HermesArchivist = require('./hermes_archivist.cjs');
const HermesVisionary = require('./hermes_visionary.cjs');
const HermesForge = require('./hermes_forge.cjs');
const HermesBuilder = require('./hermes_builder.cjs');
const HermesQA = require('./hermes_qa.cjs');

class HermesSwarmOrchestrator {
  constructor() {
    this.director = new HermesDirector();
    this.archivist = new HermesArchivist();
    this.visionary = new HermesVisionary();
    this.forge = new HermesForge();
    this.builder = new HermesBuilder();
    this.qa = new HermesQA();
  }

  async run(brief = "Build landing page for Luxury Watch Brand") {
    console.log('\n=============================================================');
    console.log('⚡ INITIATING TOKEN-EFFICIENT HERMES SWARM (6 BOTS SEQUENTIAL)');
    console.log('=============================================================\n');

    HermesProtocol.log('SWARM', `Received mission: "${brief}"`);

    // --------------------------------------------------------------------------
    // STEP 1: DIRECTOR ANALYSIS (Gemini Flash)
    // --------------------------------------------------------------------------
    console.log('\n--- [PHASE 1: DIRECTOR REASONING & SPEC PRUNING] ---');
    const spec = await this.director.decomposeBrief(brief);
    HermesProtocol.log('HERMES-DIRECTOR', 'Assigned tasks.');

    // --------------------------------------------------------------------------
    // STEP 2: ASSET ACQUISITION (Sequential Safe Execution)
    // --------------------------------------------------------------------------
    console.log('\n--- [PHASE 2: SEQUENTIAL ASSET & CODE ACQUISITION] ---');
    
    // Sub-step 2A: Archivist (Groq)
    HermesProtocol.log('SWARM', 'Unlocking Bot 2: HERMES-ARCHIVIST...');
    const archivistResult = await this.archivist.fetchComponents(spec);

    // Rate-Limiter: 2-second pause before next Groq interaction
    await HermesProtocol.rateLimitDelay(2000, "Groq Free-Tier RPM Buffer");

    // Sub-step 2B: Visionary (Gemini Flash Image)
    HermesProtocol.log('SWARM', 'Unlocking Bot 3: HERMES-VISIONARY...');
    const visionaryAnchors = await this.visionary.generateVisualAnchors(spec);

    // Sub-step 2C: Forge (21st.dev API)
    HermesProtocol.log('SWARM', 'Unlocking Bot 4: HERMES-FORGE...');
    const forgeResult = await this.forge.generateAssets(spec, visionaryAnchors);

    // --------------------------------------------------------------------------
    // STEP 3: CONSTRUCTION (Groq Qwen2.5-Coder)
    // --------------------------------------------------------------------------
    console.log('\n--- [PHASE 3: TOKEN-PRUNED BUILDER SYNTHESIS] ---');
    HermesProtocol.log('SWARM', 'Unlocking Bot 5: HERMES-BUILDER with pruned context...');
    const buildResult = this.builder.buildWebsite(spec, archivistResult, forgeResult);

    // --------------------------------------------------------------------------
    // STEP 4: AUDIT (Gemini Flash Vision)
    // --------------------------------------------------------------------------
    console.log('\n--- [PHASE 4: ANTI-SLOP AUDIT & QUALITY GATE] ---');
    HermesProtocol.log('SWARM', 'Unlocking Bot 6: HERMES-QA...');
    const qaResult = this.qa.auditWebsite(buildResult.html);

    if (qaResult.status === 'APPROVED') {
      console.log('\n=============================================================');
      console.log('🎉 HERMES SWARM TOKEN-EFFICIENT MISSION COMPLETE');
      console.log(`📄 Output File: ${buildResult.outputPath}`);
      console.log(`🛡️ QA Score: ${qaResult.score} (${qaResult.percentage}%)`);
      console.log('⚡ All 6 Bots Executed in Sequential Token-Safe Mode');
      console.log('=============================================================\n');
    } else {
      console.log('\n❌ HERMES SWARM AUDIT REJECTED');
    }

    return {
      spec,
      archivistResult,
      visionaryAnchors,
      forgeResult,
      buildResult,
      qaResult
    };
  }
}

module.exports = HermesSwarmOrchestrator;

if (require.main === module) {
  const brief = process.argv[2] || "Build landing page for Luxury Watch Brand";
  const orchestrator = new HermesSwarmOrchestrator();
  orchestrator.run(brief).catch(err => {
    console.error('Swarm Error:', err);
    process.exit(1);
  });
}
