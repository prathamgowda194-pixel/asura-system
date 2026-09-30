/**
 * ==============================================================================
 * ASURA 24/7 KARNATAKA LEAD RADAR (VERCEL SERVERLESS CRON)
 * Route: /api/cron_hunt
 * Runs automatically every 30 minutes 24/7/365 without fail!
 * Exclusively searches verified businesses across KARNATAKA, INDIA.
 * ZERO DEMO WEBSITES BUILT (Direct verified business intelligence only)
 * ==============================================================================
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8909145509:AAF8UhbWxPR5JGt8ddcAd9D1gqZ3L13ZuAo';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7025916840'; // Commander Tech Playz
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

import { getNextKarnatakaLeads } from './karnataka_lead_scraper.cjs';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegram(payload) {
  try {
    const res = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000)
    });
    return res.status === 200;
  } catch (e) {
    console.error("Telegram send error:", e.message);
    return false;
  }
}

async function loadVault() {
  const url = `https://api.github.com/repos/${REPO}/contents/data/karnataka_vault.json`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Cron',
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(5000)
    });
    if (res.status === 200) {
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const parsed = JSON.parse(content);
      const records = parsed.records || [];
      return {
        sha: data.sha,
        seenSet: new Set(records.map(r => r.cleanPhone || r.name.toLowerCase().trim())),
        records: records
      };
    }
  } catch (e) {}

  return { sha: null, seenSet: new Set(), records: [] };
}

async function saveVault(vaultInfo, newLead) {
  const url = `https://api.github.com/repos/${REPO}/contents/data/karnataka_vault.json`;
  const allRecords = [...vaultInfo.records, newLead];
  const payload = {
    updatedAt: new Date().toISOString(),
    region: "Karnataka, India",
    totalLeadsTracked: allRecords.length,
    records: allRecords
  };

  try {
    const body = {
      message: `chore(karnataka): record verified lead "${newLead.name}" in Karnataka vault [skip ci]`,
      content: Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64'),
      branch: 'main'
    };
    if (vaultInfo.sha) body.sha = vaultInfo.sha;

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ASURA-Cron',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000)
    });
  } catch (e) {}
}

export default async function handler(req, res) {
  const startTime = Date.now();

  // 1. Load permanent deduplication vault
  const vault = await loadVault();

  // 2. Fetch fresh Karnataka lead
  const candidates = await getNextKarnatakaLeads(vault.seenSet);
  if (!candidates || candidates.length === 0) {
    return res.status(200).json({ ok: true, message: "No new lead available this cycle." });
  }

  const lead = candidates[0];
  const cleanPhone = lead.cleanPhone || lead.phone.replace(/\D/g, '').slice(-10);

  // 3. High-Converting Direct Outreach Pitch (Ready to Send via WhatsApp)
  const rawPitch = `Namaskara ${lead.name}! I came across your business in ${lead.city}, Karnataka. You have strong customer reviews (${lead.rating} ★) and a solid local reputation, but I noticed you don't currently have an official modern website or 24/7 AI voice booking line for customers. We build high-converting custom websites and automated AI receptionists for businesses in Karnataka. Would you be open to a quick 5-minute live demo on WhatsApp?`;

  const encodedPitch = encodeURIComponent(rawPitch);

  // 4. Clean, Professional Telegram Message (NO DEMO WEBSITE LINKS)
  const card = 
`🎯 <b>NEW VERIFIED CLIENT LEAD // KARNATAKA ONLY</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 <b>Business:</b> <b>${escapeHtml(lead.name)}</b>
🏷 <b>Niche:</b> ${escapeHtml(lead.niche)}
📍 <b>Location:</b> ${escapeHtml(lead.address)}
🏛 <b>District:</b> ${escapeHtml(lead.district || lead.city + ', Karnataka')}
📞 <b>Phone:</b> <code>${escapeHtml(lead.phone)}</code>
⭐ <b>Reputation:</b> ${lead.rating} ★ (${lead.reviews} Verified Reviews)
🌐 <b>Website Status:</b> ❌ <b>NO OFFICIAL WEBSITE DETECTED</b>
📝 <b>Opportunity Notes:</b> <i>${escapeHtml(lead.details)}</i>

💬 <b>DIRECT OUTREACH PITCH SCRIPT:</b>
<i>"${escapeHtml(rawPitch)}"</i>

<i>⚡ 30-Min Autonomous Karnataka Radar active. Zero demo sites generated. Ready for direct owner outreach!</i>`;

  const buttons = [
    [
      { text: "💬 1-Click WhatsApp Pitch", url: `https://wa.me/91${cleanPhone}?text=${encodedPitch}` },
      { text: "📞 Direct Call", url: `tel:+91${cleanPhone}` }
    ]
  ];

  // 5. Send message directly to Commander
  const ok = await sendTelegram({
    chat_id: CHAT_ID,
    text: card,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: buttons }
  });

  // 6. Record to vault
  if (ok) {
    await saveVault(vault, {
      name: lead.name,
      cleanPhone: cleanPhone,
      city: lead.city,
      district: lead.district,
      dispatchedAt: new Date().toISOString()
    });
  }

  return res.status(200).json({
    ok: ok,
    region: "Karnataka, India",
    leadName: lead.name,
    city: lead.city,
    phone: lead.phone,
    elapsedMs: Date.now() - startTime
  });
}
