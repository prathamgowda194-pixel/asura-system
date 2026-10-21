/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA 24/7 KARNATAKA LEAD RADAR (VERCEL SERVERLESS CRON)
 * Route: /api/cron_hunt
 * Runs automatically every hour to deliver exactly 2 unique Karnataka clients!
 * ══════════════════════════════════════════════════════════════════════════════
 */
import { getNextKarnatakaLeads, normalizeKey } from './karnataka_lead_scraper.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8909145509:AAF8UhbWxPR5JGt8ddcAd9D1gqZ3L13ZuAo';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7025916840'; // Commander Tech Playz
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

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
  const url = `https://api.github.com/repos/${REPO}/contents/data/karnataka_vault.json?ref=main&_t=${Date.now()}`;
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Cron',
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (res.status === 200) {
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const parsed = JSON.parse(content);
      const records = parsed.records || [];
      const seenSet = new Set();
      for (const r of records) {
        if (r.cleanPhone) seenSet.add(r.cleanPhone);
        if (r.name) seenSet.add(normalizeKey(r.name));
      }
      return { sha: data.sha, seenSet, records };
    }
  } catch (e) {}

  return { sha: null, seenSet: new Set(), records: [] };
}

async function saveVault(vaultInfo, newLeads) {
  const url = `https://api.github.com/repos/${REPO}/contents/data/karnataka_vault.json`;
  const allRecords = [...vaultInfo.records, ...newLeads];
  const payload = {
    updatedAt: new Date().toISOString(),
    region: "Karnataka, India",
    totalLeadsTracked: allRecords.length,
    records: allRecords
  };

  try {
    const leadNames = newLeads.map(l => l.name).join(' & ');
    const body = {
      message: `chore(karnataka): record verified leads [${leadNames}] [skip ci]`,
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

  // 1.5. Idempotency Check: If 2 leads were already dispatched in the past 50 minutes, skip (unless force query passed)
  const fiftyMinsAgo = new Date(Date.now() - 50 * 60 * 1000).toISOString();
  const leadsSentThisHour = vault.records.filter(r => r.dispatchedAt && r.dispatchedAt > fiftyMinsAgo);
  if (leadsSentThisHour.length >= 2 && !req.query?.force) {
    return res.status(200).json({
      ok: true,
      skipped: true,
      reason: `Quota satisfied: ${leadsSentThisHour.length} leads already dispatched in the past 50 minutes.`,
      dispatchedCount: 0
    });
  }

  // 2. Fetch fresh Karnataka leads (Exactly 2)
  const candidates = await getNextKarnatakaLeads(vault.seenSet, 2);
  if (!candidates || candidates.length === 0) {
    return res.status(200).json({ ok: true, message: "No new lead available this cycle." });
  }

  const dispatchedLeads = [];

  for (let idx = 0; idx < candidates.length; idx++) {
    const lead = candidates[idx];
    const cleanPhone = lead.cleanPhone || lead.phone.replace(/\D/g, '').slice(-10);

    const rawPitch = `Namaskara ${lead.name}! I came across your business in ${lead.city}, Karnataka. You have strong customer reviews (${lead.rating} ★) and a solid local reputation, but I noticed you don't currently have an official modern website or 24/7 AI voice booking line for customers. We build high-converting custom websites and automated AI receptionists for businesses in Karnataka. Would you be open to a quick 5-minute live demo on WhatsApp?`;
    const encodedPitch = encodeURIComponent(rawPitch);

    const card = 
`🎯 <b>NEW VERIFIED CLIENT LEAD // [${idx + 1} OF ${candidates.length}]</b>
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

<i>⚡ Hourly Karnataka Lead Radar. Lead ${idx + 1}/${candidates.length}. Direct owner outreach ready!</i>`;

    const buttons = [
      [
        { text: "💬 1-Click WhatsApp Pitch", url: `https://wa.me/91${cleanPhone}?text=${encodedPitch}` },
        { text: "📞 Direct Contact (WhatsApp)", url: `https://wa.me/91${cleanPhone}` }
      ]
    ];

    const ok = await sendTelegram({
      chat_id: CHAT_ID,
      text: card,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: buttons }
    });

    if (ok) {
      dispatchedLeads.push({
        name: lead.name,
        cleanPhone: cleanPhone,
        city: lead.city,
        district: lead.district,
        dispatchedAt: new Date().toISOString()
      });
    }

    if (idx < candidates.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  if (dispatchedLeads.length > 0) {
    await saveVault(vault, dispatchedLeads);
  }

  return res.status(200).json({
    ok: true,
    region: "Karnataka, India",
    dispatchedCount: dispatchedLeads.length,
    elapsedMs: Date.now() - startTime
  });
}
