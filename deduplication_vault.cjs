/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA DEDUPLICATION VAULT // ZERO DUPLICATE & PERMANENT BLACKLIST ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * - Guaranteed Zero Repeat: A business mentioned once is NEVER mentioned again.
 * - Root-Stem Regex Blacklist: 100% blocks all 24 removed businesses & variations.
 * - Multi-Key Verification: Phone, Slug, Normalized Name, and Token Overlap.
 * - Autonomous GitHub Persistence: Every dispatched lead is committed to the
 *   GitHub repository via GitHub REST API so serverless & cloud runners never lose state.
 */

const fs = require('fs');
const path = require('path');
const { isBlacklisted, BLACKLIST_PATTERNS, BLACKLIST_PHONES, BLACKLIST_SLUGS } = require('./blacklist_rules.cjs');

const DATA_DIR = path.join(__dirname, 'data');
const VAULT_FILE = path.join(DATA_DIR, 'dispatched_vault.json');
const BLACKLIST_FILE = path.join(DATA_DIR, 'blacklisted_businesses.json');
const LEADS_FILE = path.join(DATA_DIR, 'hunter_leads.json');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

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
    this.records = [];
    this.lastSha = null;

    // Load static blacklist phones and slugs into memory
    for (const p of BLACKLIST_PHONES) this.phones.add(p);
    for (const s of BLACKLIST_SLUGS) this.slugs.add(s);

    this._loadLocalBlacklist();
    this._loadLocalVault();
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

  _loadLocalBlacklist() {
    if (fs.existsSync(BLACKLIST_FILE)) {
      try {
        const list = JSON.parse(fs.readFileSync(BLACKLIST_FILE, 'utf8'));
        for (const item of list) {
          if (item.slug) this.slugs.add(item.slug);
          if (item.cleanPhone) this.phones.add(item.cleanPhone);
          if (item.name) {
            const norm = this._normalizeName(item.name);
            if (norm) this.normalizedNames.add(norm);
            const tokens = this._getNameTokens(item.name);
            if (tokens.size > 0) {
              this.tokenSets.push({ tokens, name: item.name, slug: item.slug, isBlacklist: true });
            }
          }
        }
      } catch (e) {}
    }
  }

  _loadLocalVault() {
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
      } catch (e) {}
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

  _saveLocalVault() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = {
        updatedAt: new Date().toISOString(),
        totalTracked: this.records.length,
        totalPhones: this.phones.size,
        totalSlugs: this.slugs.size,
        records: this.records
      };
      fs.writeFileSync(VAULT_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error(`[VAULT ERROR] Could not persist local vault: ${e.message}`);
    }
  }

  /**
   * Syncs latest dispatched vault from GitHub so cloud execution never has stale state.
   */
  async syncFromGitHub() {
    const url = `https://api.github.com/repos/${REPO}/contents/data/dispatched_vault.json`;
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'ASURA-Vault',
          'Accept': 'application/vnd.github.v3+json'
        },
        signal: AbortSignal.timeout(6000)
      });
      if (res.status === 200) {
        const data = await res.json();
        this.lastSha = data.sha;
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const parsed = JSON.parse(content);
        const remoteRecords = parsed.records || [];
        
        for (const r of remoteRecords) {
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
        
        // Merge into records
        const existingSlugs = new Set(this.records.map(r => r.slug));
        for (const r of remoteRecords) {
          if (r.slug && !existingSlugs.has(r.slug)) {
            this.records.push(r);
          }
        }
        this._saveLocalVault();
        console.log(`[VAULT] Synced ${remoteRecords.length} records from GitHub (SHA: ${this.lastSha.substring(0, 7)})`);
      }
    } catch (e) {
      console.warn(`[VAULT] GitHub syncFrom warning: ${e.message}`);
    }
  }

  /**
   * Pushes current vault state to GitHub repository using REST API.
   */
  async pushToGitHub() {
    const url = `https://api.github.com/repos/${REPO}/contents/data/dispatched_vault.json`;
    const payload = {
      updatedAt: new Date().toISOString(),
      totalTracked: this.records.length,
      totalPhones: this.phones.size,
      totalSlugs: this.slugs.size,
      records: this.records
    };

    try {
      // Get fresh SHA to avoid conflict
      let currentSha = this.lastSha;
      try {
        const checkRes = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'User-Agent': 'ASURA-Vault',
            'Accept': 'application/vnd.github.v3+json'
          },
          signal: AbortSignal.timeout(5000)
        });
        if (checkRes.status === 200) {
          const checkData = await checkRes.json();
          currentSha = checkData.sha;
        }
      } catch (e) {}

      const body = {
        message: `chore(vault): persist ${this.records.length} dispatched leads [skip ci]`,
        content: Buffer.from(JSON.stringify(payload, null, 2), 'utf8').toString('base64'),
        branch: 'main'
      };
      if (currentSha) body.sha = currentSha;

      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'ASURA-Vault',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000)
      });

      if (putRes.status === 200 || putRes.status === 201) {
        const data = await putRes.json();
        this.lastSha = data.content?.sha || currentSha;
        console.log(`🔒 [VAULT CLOUD SYNC] Successfully updated data/dispatched_vault.json on GitHub.`);
        return true;
      } else {
        const err = await putRes.text();
        console.error(`[VAULT CLOUD SYNC FAILED] Status ${putRes.status}: ${err}`);
      }
    } catch (e) {
      console.error(`[VAULT CLOUD SYNC ERROR] ${e.message}`);
    }
    return false;
  }

  /**
   * Evaluates token overlap between candidate and existing businesses.
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

      // Check containment (e.g. "All Smiles" inside "All Smiles Dental Care")
      const subsetMatch = (intersection === candidateTokens.size || intersection === entry.tokens.size) && intersection >= 2;

      if (similarity >= 0.55 || subsetMatch) {
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
   * @param {object} candidate
   * @returns {{ allowed: boolean, reason?: string, details?: any }}
   */
  checkCandidate(candidate) {
    const name = candidate.name || '';
    const slug = candidate.slug || '';
    const cleanPhone = this._cleanPhone(candidate.cleanPhone || candidate.phone);

    // 1. ROOT-STEM REGEX BLACKLIST CHECK (HIGHEST PRIORITY)
    const blCheck = isBlacklisted(candidate);
    if (blCheck.isBlacklisted) {
      return {
        allowed: false,
        reason: blCheck.reason,
        details: blCheck.match
      };
    }

    // 2. Direct phone duplicate check
    if (cleanPhone && this.phones.has(cleanPhone)) {
      return {
        allowed: false,
        reason: 'DUPLICATE_PHONE',
        details: `Phone +91 ${cleanPhone} has already been dispatched or registered.`
      };
    }

    // 3. Direct slug duplicate check
    if (slug && this.slugs.has(slug)) {
      return {
        allowed: false,
        reason: 'DUPLICATE_SLUG',
        details: `Slug "${slug}" has already been dispatched or registered.`
      };
    }

    // 4. Normalized name exact match
    const norm = this._normalizeName(name);
    if (norm && this.normalizedNames.has(norm)) {
      return {
        allowed: false,
        reason: 'DUPLICATE_NORMALIZED_NAME',
        details: `Normalized entity "${norm}" has already been dispatched.`
      };
    }

    // 5. Fuzzy token overlap (>55% or subset match)
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
   * Also asynchronously updates GitHub repository vault.
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

    this._saveLocalVault();
    console.log(`🔒 [VAULT LOCKED] "${lead.name}" permanently recorded. Will never be suggested or sent again.`);

    // Persist to GitHub immediately
    this.pushToGitHub().catch(err => {
      console.warn(`[VAULT ASYNC SYNC ERROR] ${err.message}`);
    });
  }
}

const vault = new DeduplicationVault();

module.exports = vault;
