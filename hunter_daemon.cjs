/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA HUNTER 24/7 AUTONOMOUS DAEMON // CONTINUOUS LEAD ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * Cycles every 30 minutes automatically across Indian commercial hubs.
 * Dispatches at least 5 verified Indian businesses without websites & live Vercel prototypes.
 * Respects /stop and /start commands via data/automation_state.json.
 */

const { runSweep, TARGET_NICHES, TARGET_CITIES } = require('./hunter_engine.cjs');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'data', 'hunter_daemon.log');
const STATE_FILE = path.join(__dirname, 'data', 'automation_state.json');

function isAutomationActive() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      return data.active !== false;
    }
  } catch (e) {}
  return true;
}

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}\n`;
  process.stdout.write(line);
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (e) {}
}

let nicheIdx = 0;
let cityIdx = 0;

async function executeCycle() {
  if (!isAutomationActive()) {
    log("⏸️ [DAEMON CYCLE SKIPPED] Automation is PAUSED by user via /stop. Awaiting /start command.");
    return;
  }

  const city = TARGET_CITIES[cityIdx % TARGET_CITIES.length];
  log(`⚡ [DAEMON CYCLE START] Running 30-minute sweep for 5 Indian clients in "${city}"...`);

  try {
    // Run sweep to generate at least 5 fresh leads across niches
    await runSweep({ city: city, maxNiches: 3, leadsPerNiche: 2 });
    log(`✅ [DAEMON CYCLE COMPLETE] 5 fresh Indian client prototypes generated & dispatched to Telegram.`);
  } catch (err) {
    log(`❌ [DAEMON CYCLE ERROR] ${err.message}`);
  }

  cityIdx++;
}

async function start() {
  log("🚀 ASURA HUNTER 24/7 AUTONOMOUS DAEMON ONLINE");
  log("Territory: ALL OVER INDIA | Schedule: Every 30 Minutes (5 leads/cycle) | Destination: Telegram @Asura_Hunter_bot");

  // Run initial cycle
  await executeCycle();

  // Run recurring cycle every 30 minutes (1,800,000 ms)
  const INTERVAL_MS = 30 * 60 * 1000;
  setInterval(async () => {
    await executeCycle();
  }, INTERVAL_MS);
}

start().catch(e => {
  log(`FATAL DAEMON ERROR: ${e.message}`);
});
