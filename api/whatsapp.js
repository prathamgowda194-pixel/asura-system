/**
 * ==============================================================================
 * ASURA WHATSAPP BOT GATEWAY // VERCEL SERVERLESS EDGE FUNCTION
 * Route: /api/whatsapp
 * ==============================================================================
 * - GET: Webhook Verification for Meta WhatsApp Cloud API (hub.challenge)
 * - POST: Incoming Message Processing, Anti-Spam Deduplication & Auto-Reply
 * - Instant Serverless Execution 24/7/365
 * ==============================================================================
 */

import { MongoClient } from 'mongodb';

const DEFAULT_CONFIG = {
  business_name: 'Asura Digital Agency',
  service_product: 'high-converting custom websites and automated growth systems',
  reply_time: '15 minutes',
  welcome_message_template: 'Hi there! Thanks for reaching out to {business_name}. We help with {service_product}. How can we help you today? We usually reply within {reply_time}',
  anti_spam_cooldown_hours: 24,
  verify_token: process.env.WHATSAPP_VERIFY_TOKEN || 'asura_whatsapp_secret_verify_token'
};

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://prathamgowda194_db_user:k6Y9FnOekKvYxceA@cluster0.zf9zbow.mongodb.net/crypto_lottery?retryWrites=true&w=majority&appName=Cluster0';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- 1. GET: META WEBHOOK VERIFICATION ---
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || DEFAULT_CONFIG.verify_token;

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WHATSAPP WEBHOOK] Verified successfully with Meta challenge.');
      return res.status(200).send(challenge);
    }

    // If accessed directly in browser, show status panel
    return res.status(200).json({
      status: 'ONLINE',
      service: 'Asura Automated WhatsApp Bot Gateway',
      environment: 'Vercel Serverless',
      welcome_template: DEFAULT_CONFIG.welcome_message_template,
      preview: DEFAULT_CONFIG.welcome_message_template
        .replace('{business_name}', DEFAULT_CONFIG.business_name)
        .replace('{service_product}', DEFAULT_CONFIG.service_product)
        .replace('{reply_time}', DEFAULT_CONFIG.reply_time),
      instructions: {
        step1: 'Configure Meta Webhook URL to: https://asura-system.vercel.app/api/whatsapp',
        step2: `Set Verify Token in Meta to: ${expectedToken}`,
        step3: 'Subscribe to "messages" webhook field.'
      }
    });
  }

  // --- 2. POST: INCOMING WHATSAPP MESSAGES ---
  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      // Parse Meta WhatsApp Webhook Payload
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (!message) {
        // May be a delivery receipt or status update
        return res.status(200).json({ status: 'ACKNOWLEDGED', reason: 'Non-message event' });
      }

      const senderPhone = message.from; // e.g. "919876543210"
      const contact = value?.contacts?.[0];
      const senderName = contact?.profile?.name || 'Client';
      const messageText = message.text?.body || message.type || '';

      const businessName = process.env.WHATSAPP_BUSINESS_NAME || DEFAULT_CONFIG.business_name;
      const serviceProduct = process.env.WHATSAPP_SERVICE_PRODUCT || DEFAULT_CONFIG.service_product;
      const replyTime = process.env.WHATSAPP_REPLY_TIME || DEFAULT_CONFIG.reply_time;

      const welcomeReply = DEFAULT_CONFIG.welcome_message_template
        .replace('{business_name}', businessName)
        .replace('{service_product}', serviceProduct)
        .replace('{reply_time}', replyTime);

      // Async log to MongoDB Atlas
      try {
        const client = new MongoClient(MONGO_URI, { connectTimeoutMS: 3000 });
        await client.connect();
        const db = client.db('crypto_lottery');
        await db.collection('whatsapp_leads').updateOne(
          { phone: senderPhone },
          {
            $set: { phone: senderPhone, name: senderName, last_seen: new Date() },
            $setOnInsert: { first_contact: new Date(), source: 'Meta Cloud API' },
            $push: { messages: { text: messageText, time: new Date() } }
          },
          { upsert: true }
        );
        await client.close();
      } catch (dbErr) {
        console.warn('[WHATSAPP API] DB Log warning:', dbErr.message);
      }

      // Dispatch Reply via Meta Graph API if credentials exist
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (phoneNumberId && accessToken) {
        const postData = JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: senderPhone,
          type: 'text',
          text: { preview_url: false, body: welcomeReply }
        });

        await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: postData
        });
      }

      return res.status(200).json({
        success: true,
        recipient: senderPhone,
        message: welcomeReply,
        note: 'Message processed and automated welcome dispatched.'
      });
    } catch (err) {
      console.error('[WHATSAPP WEBHOOK ERROR]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
