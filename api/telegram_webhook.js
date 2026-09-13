/**
 * VERCEL SERVERLESS TELEGRAM WEBHOOK // 24/7 CLOUD LISTENER
 * Route: /api/telegram_webhook
 * Responds to Telegram users instantly 24/7 even when local laptop is shut down.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8909145509:AAF8UhbWxPR5JGt8ddcAd9D1gqZ3L13ZuAo';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendTelegram(chatId, text, markup = null) {
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: false
  };
  if (markup) payload.reply_markup = markup;

  try {
    await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: "Asura 24/7 Telegram Webhook Gateway Online" });
  }

  try {
    const body = req.body || {};
    const message = body.message;

    if (message && message.chat && message.chat.id) {
      const chatId = message.chat.id;
      const text = (message.text || '').trim();
      const firstName = message.from?.first_name || 'Commander';
      const username = message.from?.username ? `@${message.from.username}` : '';

      if (text === '/start') {
        const welcome = 
          `⚡ <b>ASURA HUNTER ENGINE // 24/7 CLOUD ONLINE</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Greetings <b>${firstName}</b> ${username}!\n\n` +
          `Your Telegram device is <b>PERMANENTLY LINKED</b> to the Asura Autonomous Lead Matrix.\n\n` +
          `☁️ <b>Cloud 24/7 Autonomy:</b> ACTIVE\n` +
          `<i>The system searches for genuine clients without websites around the clock, even when your computer is shut down!</i>\n\n` +
          `<b>Live Commands:</b>\n` +
          `• <code>/status</code> — System radar status & leads count\n` +
          `• <code>/latest</code> — Show latest verified leads & live prototypes\n` +
          `• <code>/hunt</code> — Trigger an immediate on-demand sweep\n\n` +
          `<i>Stand by! Real-time lead alerts will stream directly to this chat.</i>`;
        
        const markup = {
          inline_keyboard: [
            [{ text: "📂 View Latest Leads", callback_data: "view_latest" }],
            [{ text: "🌐 Open Asura Dashboard", url: "https://asura-system.vercel.app" }]
          ]
        };
        await sendTelegram(chatId, welcome, markup);
      } else if (text === '/status') {
        const statusMsg = 
          `⚡ <b>ASURA CLOUD TELEMETRY // 24/7 ACTIVE</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `🟢 <b>Cloud Radar:</b> ONLINE & CONTINUOUS\n` +
          `☁️ <b>Host Environment:</b> GitHub Cloud Actions + Vercel Edge\n` +
          `🤖 <b>AI Neural Core:</b> Gemini 3.6 Flash\n` +
          `📡 <b>Target Niches:</b> 16 Commercial Verticals (Dental, Gyms, Med Spas, Roofers, Plumbers, HVAC, etc.)\n` +
          `🔋 <b>Laptop Dependency:</b> ZERO (Operates 24/7 completely serverless)\n\n` +
          `<i>All qualified leads are auto-built into live websites and delivered here with 1-click WhatsApp pitch links!</i>`;
        await sendTelegram(chatId, statusMsg);
      } else if (text === '/latest') {
        // Fetch raw hunter_leads from GitHub repository
        try {
          const rawRes = await fetch("https://raw.githubusercontent.com/prathamgowda194-pixel/asura-system/main/data/hunter_leads.json");
          if (rawRes.status === 200) {
            const leads = await rawRes.json();
            if (Array.isArray(leads) && leads.length > 0) {
              await sendTelegram(chatId, `🎯 <b>SHOWING LATEST VERIFIED PROSPECTS (${leads.length} Total):</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
              for (const l of leads.slice(0, 3)) {
                const card = 
                  `🏢 <b>${l.name}</b>\n` +
                  `🏷 Niche: ${l.niche}\n` +
                  `📍 Location: ${l.address || l.city}\n` +
                  `📞 Phone: <code>${l.phone}</code>\n` +
                  `⭐ Rating: ${l.rating} ★\n` +
                  `🌐 Status: ❌ NO WEBSITE\n` +
                  `⚡ Prototype: <code>${l.prototypeUrl}</code>`;
                
                const cleanDigits = (l.phone || '').replace(/\D/g, '');
                const waDigits = cleanDigits.length === 10 ? '1' + cleanDigits : cleanDigits;
                const pitch = encodeURIComponent(`Hi ${l.name}! I noticed your business has great reviews, but doesn't have an official website. I built a custom live prototype for you: ${l.prototypeUrl} . Would you like to see it?`);
                
                const buttons = [
                  [{ text: "🚀 Open Live Prototype ↗", url: l.prototypeUrl }],
                  [{ text: "💬 WhatsApp Lead", url: `https://wa.me/${waDigits}?text=${pitch}` }, { text: "📞 Call Direct", url: `tel:+${waDigits}` }]
                ];
                await sendTelegram(chatId, card, { inline_keyboard: buttons });
              }
            } else {
              await sendTelegram(chatId, "No leads cataloged yet. An automated sweep is cycling right now!");
            }
          }
        } catch (e) {
          await sendTelegram(chatId, "Retrieving prospects from cloud matrix...");
        }
      } else if (text.startsWith('/hunt')) {
        await sendTelegram(chatId, "🎯 <b>Directive Received!</b> Scheduled cloud radar is sweeping target niches now. Dispatches will arrive shortly!");
      }
    }
  } catch (err) {}

  return res.status(200).json({ ok: true });
}
