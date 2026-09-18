/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA LOTTERY DUAL-MODE DATABASE ADAPTER // MONGODB ATLAS + JSON STORE
 * ══════════════════════════════════════════════════════════════════════════════
 * Fully zero-crash, dual-mode architecture:
 * 1. MONGODB ATLAS MODE: Activated automatically when `MONGODB_URI` is provided in `.env`.
 * 2. RESILIENT JSON STORE: In-memory + persistent disk fallback (`data/lottery_store.json`).
 *
 * Exposes identical async query interface:
 * - find(query).sort().limit().toArray()
 * - findOne(query)
 * - insertOne(doc)
 * - updateOne(query, update)
 * - countDocuments(query)
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '..', 'data', 'lottery_store.json');

// Auto-load root .env if not loaded
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

// Default initial state
const INITIAL_STORE = {
  tickets: [],
  draws: [
    {
      drawId: "DRAW-2026-001",
      drawNumber: 104,
      drawTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      jackpotUsd: 4850000,
      foundersAllocatedUsd: 1455000,
      prizePoolUsd: 3395000,
      winningNumbers: [7, 14, 21, 33, 42],
      powerBall: 8,
      status: "OPEN",
      vrfSeed: "0x98f4e2...a19c",
      vrfHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    }
  ],
  transactions: [],
  referrals: [
    { code: "VIRAL20", discountPercent: 20, active: true, usesCount: 42 },
    { code: "HIGGSFIELD25", discountPercent: 25, active: true, usesCount: 19 },
    { code: "ASURA15", discountPercent: 15, active: true, usesCount: 88 }
  ],
  settings: {
    ticketPriceUsd: 5.00,
    founderFeePercent: 30, // Strict 30% to Founders Protocol
    prizePoolPercent: 70, // 70% to Public Winning Pool
    contractAddress: "0x89C...7F29LotteryVRF",
    foundersTreasuryWallet: "0xFounderTreasury777999888AsuraLotto30Percent"
  }
};

class JsonCollection {
  constructor(name, getDocs, saveDocs) {
    this.name = name;
    this.getDocs = getDocs;
    this.saveDocs = saveDocs;
  }

  _matches(doc, query = {}) {
    for (const key of Object.keys(query)) {
      if (doc[key] !== query[key]) return false;
    }
    return true;
  }

  find(query = {}) {
    const all = this.getDocs(this.name) || [];
    let matched = all.filter(d => this._matches(d, query));

    const cursor = {
      sort(criteria = {}) {
        const key = Object.keys(criteria)[0];
        if (!key) return cursor;
        const dir = criteria[key];
        matched.sort((a, b) => {
          if (a[key] < b[key]) return dir === 1 ? -1 : 1;
          if (a[key] > b[key]) return dir === 1 ? 1 : -1;
          return 0;
        });
        return cursor;
      },
      limit(n) {
        matched = matched.slice(0, n);
        return cursor;
      },
      toArray: async () => [...matched]
    };
    return cursor;
  }

  async findOne(query = {}) {
    const all = this.getDocs(this.name);
    const found = all.find(d => this._matches(d, query));
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async insertOne(doc) {
    const all = this.getDocs(this.name);
    const newDoc = {
      _id: 'doc_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...doc
    };
    all.push(newDoc);
    this.saveDocs(this.name, all);
    return { acknowledged: true, insertedId: newDoc._id };
  }

  async updateOne(query, update) {
    const all = this.getDocs(this.name);
    const idx = all.findIndex(d => this._matches(d, query));
    if (idx === -1) return { matchedCount: 0, modifiedCount: 0 };

    if (update.$set) {
      all[idx] = { ...all[idx], ...update.$set, updatedAt: new Date().toISOString() };
    } else {
      all[idx] = { ...all[idx], ...update, updatedAt: new Date().toISOString() };
    }
    this.saveDocs(this.name, all);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async countDocuments(query = {}) {
    const all = this.getDocs(this.name);
    return all.filter(d => this._matches(d, query)).length;
  }
}

class LotteryDatabaseManager {
  constructor() {
    this.client = null;
    this.mongoDb = null;
    this.isMongoActive = false;
    this.jsonData = null;
    this._initJsonStore();
  }

  _initJsonStore() {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      if (fs.existsSync(STORE_PATH)) {
        this.jsonData = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      } else {
        this.jsonData = JSON.parse(JSON.stringify(INITIAL_STORE));
        fs.writeFileSync(STORE_PATH, JSON.stringify(this.jsonData, null, 2), 'utf8');
      }
    } catch (e) {
      console.warn('[DB] Fallback JSON store memory initialization:', e.message);
      this.jsonData = JSON.parse(JSON.stringify(INITIAL_STORE));
    }
  }

  _saveJsonStore() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.jsonData, null, 2), 'utf8');
    } catch (e) {
      console.error('[DB] Error writing to store file:', e.message);
    }
  }

  async connect() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && (mongoUri.includes('<db_username>') || mongoUri.includes('<password>') || mongoUri.includes('<username>'))) {
      console.warn('[DB] MONGODB_URI contains unreplaced placeholder (<db_username>). Running on fast JSON Document Store until username is provided.');
      this.isMongoActive = false;
      return false;
    }
    if (mongoUri && mongoUri.startsWith('mongodb')) {
      try {
        console.log('[DB] Connecting to MongoDB Atlas...');
        let mongodb;
        try {
          mongodb = require('mongodb');
        } catch (e) {
          console.warn('[DB] mongodb package not yet ready, running resilient JSON store.');
          return false;
        }

        const { MongoClient } = mongodb;
        this.client = new MongoClient(mongoUri, {
          connectTimeoutMS: 8000,
          serverSelectionTimeoutMS: 8000
        });
        await this.client.connect();
        this.mongoDb = this.client.db(process.env.MONGODB_DB_NAME || 'crypto_lottery');
        this.isMongoActive = true;
        console.log('[DB] MongoDB Atlas connection ESTABLISHED & ACTIVE.');
        return true;
      } catch (err) {
        console.warn(`[DB] MongoDB Atlas connection failed (${err.message}). Using resilient local JSON store.`);
        this.isMongoActive = false;
        return false;
      }
    } else {
      console.log('[DB] MONGODB_URI not configured in .env. Running on fast JSON Document Store.');
      this.isMongoActive = false;
      return false;
    }
  }

  getCollection(name) {
    if (this.isMongoActive && this.mongoDb) {
      return this.mongoDb.collection(name);
    }

    if (!this.jsonData[name]) {
      this.jsonData[name] = [];
    }

    return new JsonCollection(
      name,
      (colName) => this.jsonData[colName] || [],
      (colName, docs) => {
        this.jsonData[colName] = docs;
        this._saveJsonStore();
      }
    );
  }

  getStatus() {
    return {
      activeEngine: this.isMongoActive ? 'MongoDB Atlas' : 'Resilient JSON Document Store',
      isMongoDB: this.isMongoActive,
      storePath: this.isMongoActive ? 'Cloud Cluster' : STORE_PATH,
      collections: {
        tickets: (this.jsonData && this.jsonData.tickets) ? this.jsonData.tickets.length : 0,
        draws: (this.jsonData && this.jsonData.draws) ? this.jsonData.draws.length : 0,
        referrals: (this.jsonData && this.jsonData.referrals) ? this.jsonData.referrals.length : 0
      }
    };
  }
}

const dbManager = new LotteryDatabaseManager();
module.exports = dbManager;
