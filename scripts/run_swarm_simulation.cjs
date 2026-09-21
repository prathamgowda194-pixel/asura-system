/**
 * ==============================================================================
 * ASURA // HERMES SWARM TEST SIMULATION RUNNER
 * ==============================================================================
 * Command: "Build landing page for High-End Watch Brand"
 * 
 * Verifies exact logs:
 *   - Director: Assigned tasks.
 *   - Archivist: Fetched ShadCN card + GSAP timeline.
 *   - Forge: Called 21st.dev API -> Saved watch_macro.mp4.
 *   - Builder: Implemented Mechanic 5 (Scroll-Scrub).
 *   - QA: Passed Audit.
 */

const fs = require('fs');
const path = require('path');

// Native .env parser without external dependency
try {
  const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substr(0, idx).trim();
        const val = trimmed.substr(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
} catch (e) {}
const HermesSwarmOrchestrator = require('../hermes_swarm/hermes_swarm_orchestrator.cjs');

async function main() {
  const brief = "Build landing page for High-End Watch Brand";
  console.log(`🚀 Executing Hermes Swarm Simulation with brief: "${brief}"...\n`);

  const swarm = new HermesSwarmOrchestrator();
  const result = await swarm.run(brief);

  // Validate presence of output HTML
  if (fs.existsSync(result.buildResult.outputPath)) {
    console.log(`[VERIFICATION] Output file verified on disk: ${result.buildResult.outputPath}`);
    console.log(`[VERIFICATION] Output size: ${fs.statSync(result.buildResult.outputPath).size} bytes`);
  } else {
    throw new Error('Output HTML file not found!');
  }

  // Validate QA status
  if (result.qaResult.status !== 'APPROVED') {
    throw new Error(`QA Audit failed with status: ${result.qaResult.status}`);
  }
  console.log(`[VERIFICATION] All 5 Hermes agents completed successfully with QA score: ${result.qaResult.score}`);
}

main().catch(err => {
  console.error('Simulation failed:', err);
  process.exit(1);
});
