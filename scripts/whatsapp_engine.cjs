/**
 * ==============================================================================
 * ASURA AUTOMATED WHATSAPP BOT ENGINE
 * ==============================================================================
 * - Exact Welcome Message Format Interpolation:
 *   "Hi there! Thanks for reaching out to [Business Name]. We help with [Service/Product]. How can we help you today? We usually reply within [Time]"
 * - 24-Hour Anti-Spam Conversation Cooldown
 * - Automated Lead Logging to data/whatsapp_leads.json & MongoDB Atlas
 * - Dual Engine: Official Meta WhatsApp Cloud API + Standalone Simulator
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'whatsapp_config.json');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const STATE_FILE = path.join(DATA_DIR, 'whatsapp_conversation_state.json');
const LEADS_FILE = path.join(DATA_DIR, 'whatsapp_leads.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadConfig() {
  const defaults = {
    business_name: 'Asura Digital Agency',
    service_product: 'high-converting custom websites and automated growth systems',
    reply_time: '15 minutes',
    welcome_message_template: 'Hi there! Thanks for reaching out to {business_name}. We help with {service_product}. How can we help you today? We usually reply within {reply_time}',
    anti_spam_cooldown_hours: 24,
    save_leads_to_mongodb: true,
    save_leads_to_local_json: true,
    meta_cloud_api: {
      phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      access_token: process.env.WHATSAPP_ACCESS_TOKEN || '',
      verify_token: process.env.WHATSAPP_VERIFY_TOKEN || 'asura_whatsapp_secret_verify_token',
      graph_api_version: 'v19.0'
    }
  };

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const userCfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return { ...defaults, ...userCfg };
    } catch (e) {
      console.warn('[WHATSAPP ENGINE] Error reading config, using defaults:', e.message);
    }
  }
  return defaults;
}

function formatWelcomeMessage(overrides = {}) {
  const cfg = loadConfig();
  const businessName = overrides.business_name || cfg.business_name || '[Business Name]';
  const serviceProduct = overrides.service_product || cfg.service_product || '[Service/Product]';
  const replyTime = overrides.reply_time || cfg.reply_time || '[Time]';

  let message = cfg.welcome_message_template || 'Hi there! Thanks for reaching out to {business_name}. We help with {service_product}. How can we help you today? We usually reply within {reply_time}';
  message = message.replace('{business_name}', businessName);
  message = message.replace('{service_product}', serviceProduct);
  message = message.replace('{reply_time}', replyTime);

  return message;
}

function loadConversationState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveConversationState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('[WHATSAPP ENGINE] Failed to save conversation state:', e.message);
  }
}

function shouldSendGreeting(phoneNumber, customCooldownHours = null) {
  if (!phoneNumber) return false;
  const cleanPhone = String(phoneNumber).replace(/\D/g, '');
  const state = loadConversationState();
  const cfg = loadConfig();
  const cooldownHours = customCooldownHours !== null ? customCooldownHours : (cfg.anti_spam_cooldown_hours || 24);
  const cooldownMs = cooldownHours * 60 * 60 * 1000;

  const lastSent = state[cleanPhone]?.last_greeting_sent_at;
  const now = Date.now();

  if (!lastSent || (now - lastSent) > cooldownMs) {
    state[cleanPhone] = {
      ...(state[cleanPhone] || {}),
      last_greeting_sent_at: now,
      message_count: (state[cleanPhone]?.message_count || 0) + 1
    };
    saveConversationState(state);
    return true;
  }

  state[cleanPhone].message_count = (state[cleanPhone]?.message_count || 0) + 1;
  state[cleanPhone].last_incoming_at = now;
  saveConversationState(state);
  return false;
}

function saveLeadLocally(lead) {
  let leads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
      if (!Array.isArray(leads)) leads = [];
    } catch (e) {
      leads = [];
    }
  }

  const cleanPhone = String(lead.phone || '').replace(/\D/g, '');
  const existingIdx = leads.findIndex(l => String(l.phone || '').replace(/\D/g, '') === cleanPhone);

  if (existingIdx >= 0) {
    leads[existingIdx].last_activity = new Date().toISOString();
    leads[existingIdx].inquiry_history = leads[existingIdx].inquiry_history || [];
    leads[existingIdx].inquiry_history.push({
      text: lead.message || '',
      received_at: new Date().toISOString()
    });
  } else {
    leads.unshift({
      phone: lead.phone,
      name: lead.name || 'WhatsApp Client',
      first_contact_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      source: lead.source || 'WhatsApp Inbound',
      initial_message: lead.message || '',
      inquiry_history: [{
        text: lead.message || '',
        received_at: new Date().toISOString()
      }]
    });
  }

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {
    console.error('[WHATSAPP ENGINE] Error writing leads file:', e.message);
  }
}

async function saveLeadToMongo(lead) {
  const cfg = loadConfig();
  if (!cfg.save_leads_to_mongodb) return;

  try {
    const { MongoClient } = require('mongodb');
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://prathamgowda194_db_user:k6Y9FnOekKvYxceA@cluster0.zf9zbow.mongodb.net/crypto_lottery?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(mongoUri, { connectTimeoutMS: 4000 });
    await client.connect();
    const db = client.db('crypto_lottery');
    const col = db.collection('whatsapp_leads');

    const cleanPhone = String(lead.phone || '').replace(/\D/g, '');
    await col.updateOne(
      { phone: cleanPhone },
      {
        $set: {
          phone: cleanPhone,
          name: lead.name || 'WhatsApp Client',
          last_activity: new Date()
        },
        $setOnInsert: {
          first_contact_at: new Date(),
          source: 'WhatsApp Inbound'
        },
        $push: {
          messages: {
            text: lead.message || '',
            timestamp: new Date()
          }
        }
      },
      { upsert: true }
    );
    await client.close();
  } catch (e) {
    console.warn('[WHATSAPP ENGINE] Mongo lead log fallback:', e.message);
  }
}

async function sendWhatsAppMessage(toPhone, messageText) {
  const cfg = loadConfig();
  const meta = cfg.meta_cloud_api || {};
  const phoneNumberId = meta.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = meta.access_token || process.env.WHATSAPP_ACCESS_TOKEN;
  const version = meta.graph_api_version || 'v19.0';

  const cleanRecipient = String(toPhone).replace(/\D/g, '');

  if (!phoneNumberId || !accessToken) {
    return {
      success: true,
      mode: 'SIMULATION',
      recipient: cleanRecipient,
      message: messageText,
      timestamp: new Date().toISOString(),
      note: 'Meta Cloud API credentials not configured. Running in high-fidelity simulator mode.'
    };
  }

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanRecipient,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText
      }
    });

    const options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/${version}/${phoneNumberId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              success: true,
              mode: 'META_CLOUD_API',
              recipient: cleanRecipient,
              response: parsed
            });
          } else {
            resolve({
              success: false,
              mode: 'META_CLOUD_API',
              error: parsed.error || data,
              statusCode: res.statusCode
            });
          }
        } catch (e) {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Meta API request timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function processIncomingMessage(senderPhone, senderName, incomingText, overrides = {}) {
  const cleanPhone = String(senderPhone || '').replace(/\D/g, '');
  if (!cleanPhone) {
    return { success: false, error: 'Invalid sender phone number' };
  }

  const leadData = {
    phone: cleanPhone,
    name: senderName || 'WhatsApp Client',
    message: incomingText || '',
    source: 'WhatsApp Inbound'
  };
  saveLeadLocally(leadData);
  saveLeadToMongo(leadData).catch(() => {});

  const shouldGreet = shouldSendGreeting(cleanPhone, overrides.cooldown_hours);

  if (!shouldGreet) {
    return {
      success: true,
      action: 'IGNORED_COOLDOWN',
      recipient: cleanPhone,
      reason: 'Client was already greeted within the 24-hour cooldown period. Follow-up messages do not re-trigger greeting.'
    };
  }

  const welcomeText = formatWelcomeMessage(overrides);
  const dispatchResult = await sendWhatsAppMessage(cleanPhone, welcomeText);

  return {
    success: true,
    action: 'GREETING_SENT',
    recipient: cleanPhone,
    messageSent: welcomeText,
    dispatchResult: dispatchResult
  };
}

module.exports = {
  loadConfig,
  formatWelcomeMessage,
  shouldSendGreeting,
  saveLeadLocally,
  saveLeadToMongo,
  sendWhatsAppMessage,
  processIncomingMessage,
  CONFIG_FILE,
  LEADS_FILE,
  STATE_FILE
};
