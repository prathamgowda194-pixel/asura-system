/**
 * ==============================================================================
 * HERMES SWARM HANDSHAKE PROTOCOL & TOKEN-EFFICIENCY AUDITOR
 * ==============================================================================
 * Role: Swarm Inter-Bot Communication, Rate Limiting & Token Tracking Layer
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.resolve(__dirname, 'logs');
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const VAULT_DIR = path.resolve(__dirname, '../asura_vault/generated_assets');
const CACHE_DIR = path.resolve(__dirname, '../asura_vault/cache');
const RAW_ASSETS_DIR = path.resolve(__dirname, '../asura_vault/raw_assets');

// Ensure essential directories exist
[LOGS_DIR, OUTPUT_DIR, VAULT_DIR, CACHE_DIR, RAW_ASSETS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const LOG_FILE = path.join(LOGS_DIR, 'swarm_activity.log');
const JSONL_FILE = path.join(LOGS_DIR, 'swarm_activity.jsonl');

// List of sensitive strings to mask
function getSensitiveKeys() {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GROQ_API_KEY,
    process.env.TWENTY_FIRST_API_KEY,
    process.env.TWENTYFIRST_API_KEY,
    process.env.XAI_API_KEY,
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

  /**
   * Rate-Limiter: Compulsory pause between consecutive external API calls (e.g. Groq RPM limit)
   */
  static async rateLimitDelay(ms = 2000, reason = "Rate-Limiter Free Tier Guard") {
    HermesProtocol.log('RATE-LIMITER', `Pausing ${ms}ms to respect free-tier RPM/TPM quotas (${reason})...`);
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Token Estimator: Approximates token count based on character length (~4 chars/token)
   */
  static estimateTokens(content) {
    if (!content) return 0;
    const str = typeof content === 'string' ? content : JSON.stringify(content);
    return Math.ceil(str.length / 4);
  }

  static logTokenUsage(botName, inputTokens, outputTokens) {
    const total = inputTokens + outputTokens;
    HermesProtocol.log(botName, `Token Usage Estimate: ~${inputTokens} prompt + ~${outputTokens} completion = ~${total} total tokens.`);
  }

  /**
   * Cache-First Strategy helpers
   */
  static getCached(key) {
    const filePath = path.join(CACHE_DIR, `${key.replace(/[^a-z0-9_-]/gi, '_')}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  static setCached(key, data) {
    const filePath = path.join(CACHE_DIR, `${key.replace(/[^a-z0-9_-]/gi, '_')}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  static getDirectories() {
    return {
      logsDir: LOGS_DIR,
      outputDir: OUTPUT_DIR,
      vaultDir: VAULT_DIR,
      cacheDir: CACHE_DIR,
      rawAssetsDir: RAW_ASSETS_DIR
    };
  }
}

module.exports = HermesProtocol;
