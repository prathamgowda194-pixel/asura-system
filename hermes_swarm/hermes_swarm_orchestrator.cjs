/**
 * ==============================================================================
 * HERMES SWARM ORCHESTRATOR // 5-AGENT MULTI-AGENT RUNNER
 * ==============================================================================
 * Architecture:
 *   1. HERMES-DIRECTOR: Receives brief, decomposes into technical specs.
 *   2. HERMES-ARCHIVIST: Scans Top 10 GitHub sources for verified components.
 *   3. HERMES-FORGE: Generates/fetches high-fidelity assets via 21st.dev API.
 *   4. HERMES-BUILDER: Assembles single-file cinema websites via Supreme Mechanics.
 *   5. HERMES-QA: Audits build against Anti-Slop Laws. Approves or Rejects.
 */

const fs = require('fs');
const path = require('path');
const HermesProtocol = require('./hermes_protocol.cjs');
const HermesDirector = require('./hermes_director.cjs');
const HermesArchivist = require('./hermes_archivist.cjs');
const HermesForge = require('./hermes_forge.cjs');
const HermesBuilder = require('./hermes_builder.cjs');
const HermesQA = require('./hermes_qa.cjs');

class HermesSwarmOrchestrator {
  constructor() {
    this.director = new HermesDirector();
    this.archivist = new HermesArchivist();
    this.forge = new HermesForge();
    this.builder = new HermesBuilder();
    this.qa = new HermesQA();
  }

  async run(brief = "Build landing page for High-End Watch Brand") {
    console.log('\n=============================================================');
    console.log('⚡ INITIATING HERMES SWARM PROTOCOL (5 AGENTS)');
    console.log('=============================================================\n');

    HermesProtocol.log('SWARM', `Received mission: "${brief}"`);

    // PHASE 1: DECOMPOSITION (Director)
    console.log('\n--- [PHASE 1: DECOMPOSITION (DIRECTOR)] ---');
    const directorPlan = await this.director.decomposeBrief(brief);
    HermesProtocol.log('HERMES-DIRECTOR', 'Assigned tasks.');

    // PHASE 2: ASSET & CODE RETRIEVAL (Archivist + Forge Parallel Run)
    console.log('\n--- [PHASE 2: RETRIEVAL (ARCHIVIST & FORGE)] ---');
    const [archivistResult, forgeResult] = await Promise.all([
      this.archivist.fetchComponents(directorPlan.delegations.archivistTask),
      this.forge.generateAssets(directorPlan.delegations.forgeTask)
    ]);

    // PHASE 3: CONSTRUCTION (Builder)
    console.log('\n--- [PHASE 3: CONSTRUCTION (BUILDER)] ---');
    const buildResult = this.builder.buildWebsite(directorPlan, archivistResult, forgeResult);

    // PHASE 4: AUDIT (QA)
    console.log('\n--- [PHASE 4: AUDIT & QUALITY GATE (QA)] ---');
    const qaResult = this.qa.auditWebsite(buildResult.html);

    if (qaResult.status === 'APPROVED') {
      console.log('\n=============================================================');
      console.log('🎉 HERMES SWARM MISSION COMPLETE: 100% SUCCESS');
      console.log(`📄 Output File: ${buildResult.outputPath}`);
      console.log(`🛡️ QA Score: ${qaResult.score} (${qaResult.percentage}%)`);
      console.log('=============================================================\n');
    } else {
      console.log('\n❌ HERMES SWARM AUDIT REJECTED');
    }

    return {
      directorPlan,
      archivistResult,
      forgeResult,
      buildResult,
      qaResult
    };
  }
}

module.exports = HermesSwarmOrchestrator;

// Allow direct CLI execution
if (require.main === module) {
  const brief = process.argv[2] || "Build landing page for High-End Watch Brand";
  const orchestrator = new HermesSwarmOrchestrator();
  orchestrator.run(brief).catch(err => {
    console.error('Swarm Error:', err);
    process.exit(1);
  });
}
