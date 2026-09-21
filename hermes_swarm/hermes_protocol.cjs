/**
 * ==============================================================================
 * HERMES SWARM HANDSHAKE PROTOCOL & ACTIVITY LOGGER
 * ==============================================================================
 * Role: Swarm Inter-Bot Communication & Auditing Layer
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.resolve(__dirname, 'logs');
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const VAULT_DIR = path.resolve(__dirname, '../asura_vault/generated_assets');

// Ensure essential directories exist
[LOGS_DIR, OUTPUT_DIR, VAULT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const LOG_FILE = path.join(LOGS_DIR, 'swarm_activity.log');
const JSONL_FILE = path.join(LOGS_DIR, 'swarm_activity.jsonl');

// List of sensitive strings to mask
function getSensitiveKeys() {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.TWENTY_FIRST_API_KEY,
    process.env.TWENTYFIRST_API_KEY,
    process.env.XAI_API_KEY,
    process.env.GROQ_API_KEY,
    process.env.GITHUB_TOKEN
  ].filter(Boolean);
  return keys;
}

function sanitizeText(text) {
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  const keys = getSensitiveKeys();
  for (const k of keys) {
    if (k && k.length > 6) {
      text = text.split(k).join('[REDACTED_API_KEY]');
    }
  }
  return text;
}

class HermesProtocol {
  static createMessage(sender, recipient, action, payload = {}) {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      sender,
      recipient,
      action,
      payload,
      status: 'DISPATCHED'
    };
  }

  static log(sender, message, extra = null) {
    const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const cleanMsg = sanitizeText(message);
    const line = `[${timestamp}] [${sender}]: ${cleanMsg}`;
    
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');

    if (extra) {
      const record = {
        timestamp,
        sender,
        message: cleanMsg,
        extra: JSON.parse(sanitizeText(JSON.stringify(extra)))
      };
      fs.appendFileSync(JSONL_FILE, JSON.stringify(record) + '\n', 'utf8');
    }
  }

  static getDirectories() {
    return {
      logsDir: LOGS_DIR,
      outputDir: OUTPUT_DIR,
      vaultDir: VAULT_DIR
    };
  }
}

module.exports = HermesProtocol;
