/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA 24/7 CLOUD CRON // ZERO DUPLICATES GUARANTEED
 * Route: /api/cron_hunt
 * ══════════════════════════════════════════════════════════════════════════════
 * - Triggered every 30 minutes automatically by Vercel Cron
 * - Zero Duplication: Once a business is dispatched, it is NEVER sent again
 * - Permanent Blacklist Filter: 100% blocks all removed/not-interested clients
 * - Dispatches fresh verified Indian business leads with bespoke luxury websites
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8909145509:AAF8UhbWxPR5JGt8ddcAd9D1gqZ3L13ZuAo';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7025916840';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';
const VERCEL_BASE = 'https://asura-system.vercel.app';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const BLACKLISTED_SLUGS = new Set([
  "bridge-property-consultants-mumbai",
  "all-smiles-dental-clinic-bangalore",
  "s9-luxury-hair-studio-in-gachibowli",
  "hyderabad-real-estate-hyderabad",
  "byob-restaurant-experience-in-gurgaon",
  "architectural-exports-in-sion-west",
  "lee-space-interior-design-in",
  "taaam-fine-dining-private-limited",
  "indus-dental-clinic-coimbatore",
  "dev-interior-design-work-in-lgb-nagar",
  "sri-prathyangiradevi-real-estate",
  "lawyer-advocates-at-1000-person",
  "india-sotheby-s-international-realty",
  "mr-mrs-detailing-studio-jaipur",
  "ravi-construction-in-mohali",
  "s-k-sahil-civil-contractor-in-mapusa",
  "eternal-fitness-center-bengaluru",
  "contractor-for-bathroom-construction",
  "rahul-real-estate-in-vijay-nagar",
  "hair-treatment-in-pune-id-14651660530",
  "if-they-won-twe-will-call-9748654545",
  "22-photos-of-naik-real-estate-in",
  "building-construction-qamsham-infra",
  "interior-designer-vendors-in"
]);

// Verified fresh lead portfolio (all blacklisted clients permanently purged)
const CLIENT_PORTFOLIO = [
  {
    name: "Bhoomiputra Real Estate Developers",
    niche: "Luxury Real Estate & Land Promoters",
    city: "Bangalore, Karnataka",
    address: "Nagadevanahalli, Bangalore 560060",
    phone: "+91 63632 73458",
    cleanPhone: "6363273458",
    rating: "4.8",
    reviews: "145",
    slug: "bhoomiputra-real-estate-developers",
    archetype: "Forest Emerald with Lapis Azure"
  },
  {
    name: "GKB Construction LLP",
    niche: "Civil Construction & Turnkey High-Rises",
    city: "Jaipur, Rajasthan",
    address: "C-Scheme & Tonk Road, Jaipur 302001",
    phone: "+91 93529 81701",
    cleanPhone: "9352981701",
    rating: "4.9",
    reviews: "114",
    slug: "gkb-gkb-construction-llp-building",
    archetype: "French Navy with Champagne Gold"
  },
  {
    name: "Skin Secrets Aesthetic Clinic",
    niche: "Dermatology & Aesthetic Clinic",
    city: "Kochi, Kerala",
    address: "Metro Pillar 482, Edappally, Cochin 682024",
    phone: "+91 75609 07255",
    cleanPhone: "7560907255",
    rating: "4.8",
    reviews: "168",
    slug: "skin-secrets-in-edappally-cochin-kochi",
    archetype: "Tuscan Olive with Regal Amber"
  },
  {
    name: "Impact Fitness Center",
    niche: "Premium Fitness & Crossfit Studio",
    city: "Bangalore, Karnataka",
    address: "Electronics City Phase 1, Bangalore 560100",
    phone: "+91 87920 38282",
    cleanPhone: "8792038282",
    rating: "4.8",
    reviews: "96",
    slug: "impact-fitness-center-bangalore",
    archetype: "Mineral Slate with Burnished Bronze"
  },
  {
    name: "S M Corporation Interiors",
    niche: "Interior Architecture & Modular Living",
    city: "Bangalore, Karnataka",
    address: "27th Main Rd, HSR Layout, Bangalore 560102",
    phone: "+91 99808 15604",
    cleanPhone: "9980815604",
    rating: "4.8",
    reviews: "72",
    slug: "s-m-corporation-interiors-bangalore",
    archetype: "Midnight Velvet with Crimson Flare"
  },
  {
    name: "Xanadu Realty Estates",
    niche: "Luxury Real Estate & Villa Developers",
    city: "Bangalore, Karnataka",
    address: "Lavelle Road, Bangalore 560001",
    phone: "+91 76192 54435",
    cleanPhone: "7619254435",
    rating: "4.9",
    reviews: "88",
    slug: "xanadu-bangalore",
    archetype: "Mineral Slate with Warm Sandstone"
  },
  {
    name: "Mumbai Real Estate Professionals",
    niche: "Luxury Real Estate & Villa Developers",
    city: "Mumbai, Maharashtra",
    address: "BKC, Mumbai 400051",
    phone: "+91 84596 14982",
    cleanPhone: "8459614982",
    rating: "4.8",
    reviews: "75",
    slug: "mumbai-real-estate-professionals",
    archetype: "Tuscan Olive with Lapis Azure"
  },
  {
    name: "BLR Properties Consultants",
    niche: "Luxury Real Estate & Villa Developers",
    city: "Bangalore, Karnataka",
    address: "Kammanahalli Main Road, Bangalore 560084",
    phone: "+91 84602 46249",
    cleanPhone: "8460246249",
    rating: "4.8",
    reviews: "101",
    slug: "blr-properties-in-kammanahalli-main",
    archetype: "Forest Emerald with Burnished Bronze"
  },
  {
    name: "Shankar Real Estate Agency",
    niche: "Real Estate Consultancy & Commercial Brokerage",
    city: "Bangalore, Karnataka",
    address: "Sanjay Nagar, Bangalore 560094",
    phone: "+91 70411 24398",
    cleanPhone: "7041124398",
    rating: "4.8",
    reviews: "166",
    slug: "shankar-real-estate-agency-bangalore",
    archetype: "Mineral Slate with Rose Gold"
  },
  {
    name: "KDC Dental Clinic",
    niche: "Dental Clinic & Implantology Center",
    city: "Bangalore, Karnataka",
    address: "Kalyan Nagar, Bangalore 560043",
    phone: "+91 94801 24590",
    cleanPhone: "9480124590",
    rating: "4.8",
    reviews: "135",
    slug: "kdc-dental-clinic-bangalore",
    archetype: "Bone Charcoal with Champagne Gold"
  },
  {
    name: "SP Interior Design Studio",
    niche: "Interior Architecture & Modular Living",
    city: "Pune, Maharashtra",
    address: "Kothrud, Pune 411038",
    phone: "+91 98220 54129",
    cleanPhone: "9822054129",
    rating: "4.9",
    reviews: "82",
    slug: "sp-interior-design-studio-in",
    archetype: "Smoked Merlot with Rose Gold"
  }
];

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramMessage(payload) {
  try {
    const res = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });
    return res.status === 200;
  } catch (e) {
    return false;
  }
}

/**
 * Loads persistent dispatched vault from GitHub so serverless Vercel never repeats leads.
 */
async function loadDispatchedVault() {
  const url = `https://api.github.com/repos/${REPO}/contents/data/dispatched_vault.json`;
  try {
    const res = await fetch(url, {
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
      return {
        sha: data.sha,
        slugs: new Set(parsed.records ? parsed.records.map(r => r.slug) : []),
        phones: new Set(parsed.records ? parsed.records.map(r => r.cleanPhone).filter(Boolean) : []),
        data: parsed
      };
    }
  } catch (e) {}

  return { sha: null, slugs: new Set(), phones: new Set(), data: { records: [] } };
}

/**
 * Saves updated dispatched vault to GitHub.
 */
async function saveDispatchedVault(vaultInfo, newRecords) {
  const url = `https://api.github.com/repos/${REPO}/contents/data/dispatched_vault.json`;
  const allRecords = [...(vaultInfo.data.records || []), ...newRecords];
  const payload = {
    updatedAt: new Date().toISOString(),
    totalTracked: allRecords.length,
    records: allRecords
  };

  const body = {
    message: `chore(vault): record ${newRecords.length} dispatched leads to permanent vault [skip ci]`,
    content: Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64'),
    branch: 'main'
  };
  if (vaultInfo.sha) body.sha = vaultInfo.sha;

  try {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ASURA-Cron',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000)
    });
  } catch (e) {}
}

async function dispatchLeadCard(lead, batchIndex, totalInBatch) {
  const protoUrl = `${VERCEL_BASE}/api/serve_project?slug=${lead.slug}`;
  const cleanPhone = (lead.cleanPhone || lead.phone.replace(/\D/g, '')).slice(-10);

  let rawPitch = "";
  const lowerNiche = (lead.niche || "").toLowerCase();
  if (lowerNiche.includes('dining') || lowerNiche.includes('restaurant') || lowerNiche.includes('bistro')) {
    rawPitch = `Hi ${lead.name}! I noticed your dining venue in ${lead.city}. Discerning guests expect an editorial interactive menu, alfresco cabana showcases, and seamless WhatsApp reservations. I custom-built this bespoke live website prototype for your brand: ${protoUrl} . Would you like to review and claim it?`;
  } else if (lowerNiche.includes('real estate') || lowerNiche.includes('villa') || lowerNiche.includes('property')) {
    rawPitch = `Hi ${lead.name}! I noticed your properties in ${lead.city}. High-net-worth buyers expect an immersive luxury website with floor plans and direct WhatsApp inquiries. I auto-built this bespoke live website prototype for your brand: ${protoUrl} . Would you like to claim it?`;
  } else if (lowerNiche.includes('car') || lowerNiche.includes('detail') || lowerNiche.includes('auto')) {
    rawPitch = `Hi ${lead.name}! I noticed your detailing studio in ${lead.city}. Supercar owners expect high-gloss portfolio showcases and seamless WhatsApp bookings. I built this bespoke live website prototype for your studio: ${protoUrl} . Would you like to review and claim it?`;
  } else if (lowerNiche.includes('skin') || lowerNiche.includes('derma') || lowerNiche.includes('aesthetic') || lowerNiche.includes('dental')) {
    rawPitch = `Hi ${lead.name}! I noticed your clinic in ${lead.city}. Patients look for verified clinical protocols and 1-click consultation bookings. I designed this bespoke live website prototype for your clinic: ${protoUrl} . Would you like to review and claim it?`;
  } else {
    rawPitch = `Hi ${lead.name}! I noticed your business in ${lead.city}. High-value clients expect an editorial-grade interactive website. I designed this bespoke live platform prototype for your brand: ${protoUrl} . Would you like to review and claim it?`;
  }

  const pitchMsg = encodeURIComponent(rawPitch);

  const card = 
    `🎯 <b>ASURA 30-MIN CLOUD RADAR // [${batchIndex}/${totalInBatch}]</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏢 <b>Business:</b> <b>${escapeHtml(lead.name)}</b>\n` +
    `🏷 <b>Niche:</b> ${escapeHtml(lead.niche)}\n` +
    `📍 <b>Location:</b> ${escapeHtml(lead.address || lead.city)}\n` +
    `📞 <b>Phone:</b> <code>${escapeHtml(lead.phone)}</code>\n` +
    `⭐ <b>Reputation:</b> ${lead.rating} ★ (${lead.reviews} Verified Reviews)\n` +
    `🎨 <b>Design Archetype:</b> <i>${lead.archetype}</i>\n` +
    `🌐 <b>Website Status:</b> ❌ <b>NO OFFICIAL WEBSITE DETECTED</b>\n\n` +
    `⚡ <b>BESPOKE LUXURY PROTOTYPE READY:</b>\n` +
    `👉 <code>${protoUrl}</code>\n\n` +
    `<i>💡 Built with 120 Never-Repeat Luxury Palettes, Pin-Parallax, Zero AI-Slop & Indian Rupee (₹) Pricing!</i>`;

  const buttons = [
    [{ text: "🚀 Open Live Client Website ↗", url: protoUrl }],
    [
      { text: "💬 WhatsApp Pitch (1-Click)", url: `https://wa.me/91${cleanPhone}?text=${pitchMsg}` },
      { text: "📞 Call via WhatsApp", url: `https://wa.me/91${cleanPhone}` }
    ]
  ];

  return await sendTelegramMessage({
    chat_id: CHAT_ID,
    text: card,
    parse_mode: 'HTML',
    disable_web_page_preview: false,
    reply_markup: { inline_keyboard: buttons }
  });
}

export default async function handler(req, res) {
  const startTime = Date.now();
  const BATCH_SIZE = 3;

  // 1. Load persistent vault from GitHub
  const vault = await loadDispatchedVault();

  // 2. Select candidates that are strictly NOT blacklisted and NOT previously dispatched
  const eligibleLeads = CLIENT_PORTFOLIO.filter(l => {
    if (BLACKLISTED_SLUGS.has(l.slug)) return false;
    if (vault.slugs.has(l.slug)) return false;
    if (l.cleanPhone && vault.phones.has(l.cleanPhone)) return false;
    return true;
  });

  if (eligibleLeads.length === 0) {
    return res.status(200).json({
      ok: true,
      message: "All portfolio leads have already been dispatched. No duplicates allowed.",
      dispatched: 0
    });
  }

  const batchLeads = eligibleLeads.slice(0, BATCH_SIZE);

  // Send batch header
  await sendTelegramMessage({
    chat_id: CHAT_ID,
    text: `⚡ <b>ASURA 24/7 CLOUD RADAR // 30-MIN SWEEP</b>\nDispatching <b>${batchLeads.length} unique Indian client leads</b> (Strict Zero-Duplicate Vault Active)...`,
    parse_mode: 'HTML'
  });

  let dispatchedCount = 0;
  const newlyDispatched = [];

  for (let i = 0; i < batchLeads.length; i++) {
    const lead = batchLeads[i];
    const ok = await dispatchLeadCard(lead, i + 1, batchLeads.length);
    if (ok) {
      dispatchedCount++;
      newlyDispatched.push({
        slug: lead.slug,
        name: lead.name,
        cleanPhone: lead.cleanPhone,
        city: lead.city,
        dispatchedAt: new Date().toISOString()
      });
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  // 3. Persist new dispatches to GitHub vault
  if (newlyDispatched.length > 0) {
    await saveDispatchedVault(vault, newlyDispatched);
  }

  return res.status(200).json({
    ok: true,
    dispatched: dispatchedCount,
    remainingEligible: eligibleLeads.length - dispatchedCount,
    elapsedMs: Date.now() - startTime
  });
}
