/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA DEDUPLICATION VAULT // STRICT "NEVER MENTIONED AGAIN" ENFORCEMENT
 * ══════════════════════════════════════════════════════════════════════════════
 * - Guaranteed Zero Repeat: A business mentioned once is NEVER mentioned again.
 * - Multi-Key Verification: Matches across 10-digit phone, normalized name,
 *   slug, fuzzy token overlap, and the permanent blacklist.
 * - Triple-Layer Shield:
 *     Layer 1: Scraper pre-filter (drops duplicates before processing)
 *     Layer 2: Prototype synthesizer check (prevents re-building)
 *     Layer 3: Telegram dispatcher lock (verifies before broadcast)
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const VAULT_FILE = path.join(DATA_DIR, 'dispatched_vault.json');
const BLACKLIST_FILE = path.join(DATA_DIR, 'blacklisted_businesses.json');
const LEADS_FILE = path.join(DATA_DIR, 'hunter_leads.json');

const STOP_WORDS = new Set([
  'pvt', 'ltd', 'limited', 'llp', 'inc', 'co', 'corp', 'corporation',
  'consultants', 'consultant', 'consultancy', 'agency', 'enterprises',
  'services', 'service', 'solutions', 'studio', 'center', 'centre',
  'clinic', 'associates', 'group', 'properties', 'realty', 'real',
  'estate', 'in', 'at', 'near', 'by', 'the', 'and', 'for', 'best',
  'top', 'luxury', 'premium', 'bangalore', 'bengaluru', 'mumbai',
  'delhi', 'gurgaon', 'gurugram', 'noida', 'hyderabad', 'pune',
  'chennai', 'ahmedabad', 'kolkata', 'goa', 'kochi', 'jaipur',
  'lucknow', 'indore', 'chandigarh', 'coimbatore', 'surat'
]);

class DeduplicationVault {
  constructor() {
    this.phones = new Set();
    this.normalizedNames = new Set();
    this.slugs = new Set();
    this.tokenSets = []; // [{ tokens: Set, name: string, slug: string }]
    this.blacklist = new Map(); // slug -> item
    this.records = [];

    this._loadBlacklist();
    this._loadVault();
    this._bootstrapFromLeads();
  }

  _cleanPhone(phone) {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      if (/^[6-9]\d{9}$/.test(last10)) return last10;
    }
    return null;
  }

  _normalizeName(name) {
    if (!name) return '';
    return String(name)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP_WORDS.has(w))
      .sort()
      .join(' ');
  }

  _getNameTokens(name) {
    if (!name) return new Set();
    const tokens = String(name)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));
    return new Set(tokens);
  }

  _loadBlacklist() {
    if (fs.existsSync(BLACKLIST_FILE)) {
      try {
        const list = JSON.parse(fs.readFileSync(BLACKLIST_FILE, 'utf8'));
        for (const item of list) {
          if (item.slug) {
            this.blacklist.set(item.slug, item);
            this.slugs.add(item.slug);
          }
          if (item.cleanPhone) {
            this.phones.add(item.cleanPhone);
          }
          if (item.name) {
            const norm = this._normalizeName(item.name);
            if (norm) this.normalizedNames.add(norm);
            const tokens = this._getNameTokens(item.name);
            if (tokens.size > 0) {
              this.tokenSets.push({ tokens, name: item.name, slug: item.slug, isBlacklist: true });
            }
          }
        }
      } catch (e) {
        console.warn(`[VAULT] Blacklist load error: ${e.message}`);
      }
    }
  }

  _loadVault() {
    if (fs.existsSync(VAULT_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));
        this.records = data.records || [];
        for (const r of this.records) {
          if (r.cleanPhone) this.phones.add(r.cleanPhone);
          if (r.slug) this.slugs.add(r.slug);
          if (r.name) {
            const norm = this._normalizeName(r.name);
            if (norm) this.normalizedNames.add(norm);
            const tokens = this._getNameTokens(r.name);
            if (tokens.size > 0) {
              this.tokenSets.push({ tokens, name: r.name, slug: r.slug });
            }
          }
        }
      } catch (e) {
        console.warn(`[VAULT] Vault load error: ${e.message}`);
      }
    }
  }

  _bootstrapFromLeads() {
    if (fs.existsSync(LEADS_FILE)) {
      try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        for (const l of leads) {
          const cleanPhone = this._cleanPhone(l.cleanPhone || l.phone);
          if (cleanPhone) this.phones.add(cleanPhone);
          if (l.slug) this.slugs.add(l.slug);
          if (l.name) {
            const norm = this._normalizeName(l.name);
            if (norm) this.normalizedNames.add(norm);
            const tokens = this._getNameTokens(l.name);
            if (tokens.size > 0) {
              this.tokenSets.push({ tokens, name: l.name, slug: l.slug });
            }
          }
        }
      } catch (e) {}
    }
  }

  _saveVault() {
    try {
      const data = {
        updatedAt: new Date().toISOString(),
        totalTracked: this.records.length,
        totalPhones: this.phones.size,
        totalSlugs: this.slugs.size,
        records: this.records
      };
      fs.writeFileSync(VAULT_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error(`[VAULT ERROR] Could not persist vault: ${e.message}`);
    }
  }

  /**
   * Evaluates Jaccard token overlap between candidate and existing businesses.
   */
  _hasFuzzyMatch(name) {
    const candidateTokens = this._getNameTokens(name);
    if (candidateTokens.size === 0) return null;

    for (const entry of this.tokenSets) {
      let intersection = 0;
      for (const t of candidateTokens) {
        if (entry.tokens.has(t)) intersection++;
      }
      const union = new Set([...candidateTokens, ...entry.tokens]).size;
      const similarity = union > 0 ? intersection / union : 0;

      // Also check containment (e.g. "All Smiles" inside "All Smiles Dental Clinic")
      const subsetMatch = (intersection === candidateTokens.size || intersection === entry.tokens.size) && intersection >= 2;

      if (similarity >= 0.65 || subsetMatch) {
        return {
          matchedWith: entry.name,
          slug: entry.slug,
          similarity: (similarity * 100).toFixed(0) + '%',
          isBlacklist: !!entry.isBlacklist
        };
      }
    }
    return null;
  }

  /**
   * Master Check: Is this business a duplicate or blacklisted?
   * Returns { allowed: boolean, reason?: string, details?: any }
   */
  checkCandidate(candidate) {
    const name = candidate.name || '';
    const slug = candidate.slug || '';
    const cleanPhone = this._cleanPhone(candidate.cleanPhone || candidate.phone);

    // 1. Check direct blacklist
    if (this.blacklist.has(slug)) {
      return { allowed: false, reason: 'BLACKLISTED_SLUG', details: `Slug "${slug}" is permanently blacklisted.` };
    }

    // 2. Check direct phone duplicate
    if (cleanPhone && this.phones.has(cleanPhone)) {
      return { allowed: false, reason: 'DUPLICATE_PHONE', details: `Phone +91 ${cleanPhone} has already been dispatched.` };
    }

    // 3. Check direct slug duplicate
    if (slug && this.slugs.has(slug)) {
      return { allowed: false, reason: 'DUPLICATE_SLUG', details: `Slug "${slug}" has already been dispatched.` };
    }

    // 4. Check normalized name exact match
    const norm = this._normalizeName(name);
    if (norm && this.normalizedNames.has(norm)) {
      return { allowed: false, reason: 'DUPLICATE_NORMALIZED_NAME', details: `Normalized entity "${norm}" has already been dispatched.` };
    }

    // 5. Check fuzzy token overlap (>65% or subset match)
    const fuzzy = this._hasFuzzyMatch(name);
    if (fuzzy) {
      return {
        allowed: false,
        reason: fuzzy.isBlacklist ? 'BLACKLISTED_SIMILAR_NAME' : 'DUPLICATE_FUZZY_NAME',
        details: `Business "${name}" matches existing entry "${fuzzy.matchedWith}" (${fuzzy.similarity} token overlap).`
      };
    }

    return { allowed: true };
  }

  /**
   * Permanently marks a business as dispatched to Telegram.
   * After this call, it will NEVER be dispatched again.
   */
  recordDispatched(lead, metadata = {}) {
    const cleanPhone = this._cleanPhone(lead.cleanPhone || lead.phone);
    const norm = this._normalizeName(lead.name);
    const tokens = this._getNameTokens(lead.name);

    if (cleanPhone) this.phones.add(cleanPhone);
    if (lead.slug) this.slugs.add(lead.slug);
    if (norm) this.normalizedNames.add(norm);
    if (tokens.size > 0) {
      this.tokenSets.push({ tokens, name: lead.name, slug: lead.slug });
    }

    this.records.push({
      slug: lead.slug,
      name: lead.name,
      city: lead.city,
      cleanPhone: cleanPhone,
      dispatchedAt: new Date().toISOString(),
      metadata: metadata
    });

    this._saveVault();
    console.log(`🔒 [VAULT LOCKED] "${lead.name}" permanently recorded. Will never be suggested or sent again.`);
  }
}

// Singleton instance
const vault = new DeduplicationVault();

module.exports = vault;
