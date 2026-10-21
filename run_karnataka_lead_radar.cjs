/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA AUTONOMOUS KARNATAKA GOOGLE MAPS LEAD RADAR RUNNER
 * ══════════════════════════════════════════════════════════════════════════════
 * Strict Hourly Cadence // Exactly 2 Different Clients Every Single Hour
 * 100% Karnataka Only // Verified +91 Business Contacts // Zero Demo Websites
 * Airtight Zero-Repetition Deduplication Across Local and Cloud Runners
 * ══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { getNextKarnatakaLeads, KARNATAKA_BUSINESS_VAULT, normalizeKey } = require('./karnataka_lead_scraper.cjs');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8909145509:AAF8UhbWxPR5JGt8ddcAd9D1gqZ3L13ZuAo';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7025916840'; // Commander Tech Playz
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO = 'prathamgowda194-pixel/asura-system';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function loadVault() {
  const localVaultPath = path.join(__dirname, 'data', 'karnataka_vault.json');
  let localRecords = [];
  if (fs.existsSync(localVaultPath)) {
    try {
      const localData = JSON.parse(fs.readFileSync(localVaultPath, 'utf8'));
      localRecords = localData.records || [];
    } catch (e) {}
  }

  const url = `https://api.github.com/repos/${REPO}/contents/data/karnataka_vault.json?ref=main`;
  let sha = null;
  let remoteRecords = [];

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Radar',
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (res.status === 200) {
      const data = await res.json();
      sha = data.sha;
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const parsed = JSON.parse(content);
      remoteRecords = parsed.records || [];
    }
  } catch (e) {}

  // Merge local and remote records for absolute deduplication
  const recordMap = new Map();
  for (const r of [...localRecords, ...remoteRecords]) {
    const key = r.cleanPhone || normalizeKey(r.name);
    if (key && !recordMap.has(key)) {
      recordMap.set(key, r);
    }
  }

  const mergedRecords = Array.from(recordMap.values());
  const seenSet = new Set();
  for (const r of mergedRecords) {
    if (r.cleanPhone) seenSet.add(r.cleanPhone);
    if (r.name) seenSet.add(normalizeKey(r.name));
  }

  return {
    sha,
    seenSet,
    records: mergedRecords
  };
}

async function saveVault(vaultInfo, newLeads) {
  const localVaultDir = path.join(__dirname, 'data');
  if (!fs.existsSync(localVaultDir)) {
    fs.mkdirSync(localVaultDir, { recursive: true });
  }
  const localVaultPath = path.join(localVaultDir, 'karnataka_vault.json');

  const allRecords = [...vaultInfo.records, ...newLeads];
  const payload = {
    updatedAt: new Date().toISOString(),
    region: "Karnataka, India",
    totalLeadsTracked: allRecords.length,
    records: allRecords
  };

  // 1. Save locally
  fs.writeFileSync(localVaultPath, JSON.stringify(payload, null, 2), 'utf8');

  // 2. Commit to GitHub with [skip ci] so Vercel NEVER builds or triggers deployment emails
  const url = `https://api.github.com/repos/${REPO}/contents/data/karnataka_vault.json`;
  try {
    const leadNames = newLeads.map(l => l.name).join(' & ');
    const body = {
      message: `chore(vault): record 2 verified leads [${leadNames}] [skip ci]`,
      content: Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64'),
      branch: 'main'
    };
    if (vaultInfo.sha) body.sha = vaultInfo.sha;

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ASURA-Radar',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000)
    });
  } catch (e) {
    console.warn(`[VAULT WARNING] GitHub sync deferred: ${e.message}`);
  }
}

async function sendLeadCard(lead, currentIdx, totalCount) {
  const cleanPhone = lead.cleanPhone || lead.phone.replace(/\D/g, '').slice(-10);

  // High-Converting Direct Outreach Pitch (Ready to Send via WhatsApp)
  const rawPitch = `Namaskara ${lead.name}! I came across your business in ${lead.city}, Karnataka. You have strong customer reviews (${lead.rating} ★) and a solid local reputation, but I noticed you don't currently have an official modern website or 24/7 AI voice booking line for customers. We build high-converting custom websites and automated AI receptionists for businesses in Karnataka. Would you be open to a quick 5-minute live demo on WhatsApp?`;
  const encodedPitch = encodeURIComponent(rawPitch);

  // Pristine Telegram Lead Card (NO DEMO WEBSITES)
  const card = 
`🎯 <b>NEW VERIFIED CLIENT LEAD // [${currentIdx} OF ${totalCount}]</b>
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

<i>⚡ Hourly Karnataka Lead Radar. Lead ${currentIdx}/${totalCount}. Direct owner outreach ready!</i>`;

  const buttons = [
    [
      { text: "💬 1-Click WhatsApp Pitch", url: `https://wa.me/91${cleanPhone}?text=${encodedPitch}` },
      { text: "📞 Direct Contact (WhatsApp)", url: `https://wa.me/91${cleanPhone}` }
    ]
  ];

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: card,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: { inline_keyboard: buttons }
        }),
        signal: AbortSignal.timeout(10000)
      });

      const tgData = await res.json();
      if (tgData.ok) {
        console.log(`✅ [LEAD ${currentIdx}/${totalCount} DISPATCHED] "${lead.name}" (${lead.city}, ${lead.district}) | Msg ID: ${tgData.result.message_id}`);
        return { ok: true, messageId: tgData.result.message_id };
      } else {
        console.error(`❌ Telegram API error for ${lead.name} (attempt ${attempt}):`, tgData);
      }
    } catch (err) {
      console.warn(`⚠️ [NETWORK BLIP] Telegram send error (attempt ${attempt}/3): ${err.message}`);
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 1500 * attempt));
      }
    }
  }
  return { ok: false, error: "Failed after 3 attempts" };
}

/**
 * Runs the hourly sweep to dispatch exactly 2 different verified Karnataka clients.
 */
async function runSweep(options = {}) {
  const count = options.count || 2;
  console.log(`[${new Date().toISOString()}] 🔍 Running Autonomous Karnataka Lead Radar Sweep (Target: ${count} Unique Clients)...`);

  // 1. Load permanent deduplication vault
  const vault = await loadVault();
  console.log(`📊 Total previously tracked leads: ${vault.records.length}`);

  // Optional idempotency check for cloud runner
  if (options.checkCurrentHour) {
    const oneHourAgo = new Date(Date.now() - 55 * 60 * 1000).toISOString();
    const leadsSentThisHour = vault.records.filter(r => r.dispatchedAt && r.dispatchedAt > oneHourAgo);
    if (leadsSentThisHour.length >= 2) {
      console.log(`⚡ [IDEMPOTENT] 2 leads already dispatched in the past hour. Skipping cloud sweep.`);
      return { ok: true, skipped: true, reason: "Already dispatched this hour" };
    }
  }

  // 2. Fetch EXACTLY 2 fresh, uncontacted Karnataka leads
  const candidates = await getNextKarnatakaLeads(vault.seenSet, count);
  console.log(`🎯 Discovered ${candidates.length} fresh leads for dispatch.`);

  if (candidates.length === 0) {
    console.error("❌ No candidates found even with LRU fallback!");
    return { ok: false, error: "No candidates available" };
  }

  const dispatchedLeads = [];
  const results = [];

  // 3. Dispatch each lead sequentially with deliberate gap
  for (let i = 0; i < candidates.length; i++) {
    const lead = candidates[i];
    const dispatchRes = await sendLeadCard(lead, i + 1, candidates.length);

    if (dispatchRes.ok) {
      const cleanPhone = lead.cleanPhone || lead.phone.replace(/\D/g, '').slice(-10);
      dispatchedLeads.push({
        name: lead.name,
        cleanPhone: cleanPhone,
        city: lead.city,
        district: lead.district,
        dispatchedAt: new Date().toISOString()
      });
      results.push({ lead: lead.name, phone: cleanPhone, district: lead.district, messageId: dispatchRes.messageId });
    }

    if (i < candidates.length - 1) {
      // 1.5s delay to prevent Telegram burst rate-limiting
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // 4. Update permanent deduplication ledger
  if (dispatchedLeads.length > 0) {
    await saveVault(vault, dispatchedLeads);
    console.log(`💾 Saved ${dispatchedLeads.length} newly dispatched leads to permanent vault.`);
  }

  return { ok: true, dispatchedCount: dispatchedLeads.length, leads: results };
}

if (require.main === module) {
  const checkHour = process.argv.includes('--check-hour');
  runSweep({ checkCurrentHour: checkHour, count: 2 }).then(res => {
    console.log('Sweep finished:', JSON.stringify(res, null, 2));
  }).catch(console.error);
}

module.exports = {
  runSweep,
  loadVault,
  saveVault
};
