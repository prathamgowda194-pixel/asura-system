/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA HUNTER 24/7 AUTONOMOUS DAEMON // CONTINUOUS LEAD ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * Cycles every 30 minutes automatically across Indian commercial hubs.
 * Dispatches verified businesses without websites & live Vercel prototypes to Telegram.
 */

const { runSweep, TARGET_NICHES, TARGET_CITIES } = require('./hunter_engine.cjs');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'data', 'hunter_daemon.log');

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
  const niche = TARGET_NICHES[nicheIdx % TARGET_NICHES.length];
  const city = TARGET_CITIES[cityIdx % TARGET_CITIES.length];

  log(`⚡ [DAEMON CYCLE START] Scanning "${niche.name}" in "${city}"...`);
  try {
    await runSweep({ niche: niche.id, city: city, leadsPerNiche: 1 });
    log(`✅ [DAEMON CYCLE COMPLETE] Dispatched lead & live Vercel prototype to Telegram.`);
  } catch (err) {
    log(`❌ [DAEMON CYCLE ERROR] ${err.message}`);
  }

  nicheIdx++;
  if (nicheIdx % TARGET_NICHES.length === 0) {
    cityIdx++;
  }
}

async function start() {
  log("🚀 ASURA HUNTER 24/7 AUTONOMOUS DAEMON ONLINE");
  log("Territory: ALL OVER INDIA | Schedule: Every 30 Minutes | Destination: Telegram @Asura_Hunter_bot");

  // Run immediate first cycle
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
