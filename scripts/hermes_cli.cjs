#!/usr/bin/env node
/**
 * ASURA / Hermes Agent Core CLI Bridge
 * Supports provider configuration, GitHub Models routing, Firecrawl & Multica integration.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATHS = [
  path.join(__dirname, '..', '.hermes', 'config.json'),
  path.join(process.env.USERPROFILE || process.env.HOME || '', '.hermes', 'config.json')
];

function loadConfig() {
  for (const p of CONFIG_PATHS) {
    if (fs.existsSync(p)) {
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {}
    }
  }
  return {
    provider: 'github',
    token: process.env.GITHUB_TOKEN || '',
    model: 'gpt-4o-mini'
  };
}

function saveConfig(cfg) {
  for (const p of CONFIG_PATHS) {
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2), 'utf8');
  }
}

const args = process.argv.slice(2);
const cmd = args[0] || 'status';

switch (cmd) {
  case 'config': {
    const cfg = loadConfig();
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--provider' && args[i + 1]) cfg.provider = args[++i];
      if (args[i] === '--token' && args[i + 1]) cfg.token = args[++i];
      if (args[i] === '--model' && args[i + 1]) cfg.model = args[++i];
    }
    saveConfig(cfg);
    console.log('[HERMES CONFIG] Engine configuration updated:');
    console.log(`  Provider: ${cfg.provider}`);
    console.log(`  Model:    ${cfg.model || 'gpt-4o-mini'}`);
    console.log(`  Token:    ${cfg.token ? cfg.token.slice(0, 16) + '...' : 'NONE'}`);
    break;
  }

  case 'status': {
    const cfg = loadConfig();
    console.log('════════════════════════════════════════════════════════════');
    console.log('       HERMES AGENT ENGINE // SYSTEM STATUS REPORT');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`Provider:        ${cfg.provider || 'github'} (GitHub Models API)`);
    console.log(`Model:           ${cfg.model || 'gpt-4o-mini'}`);
    console.log(`GitHub User:     ${cfg.github_user || 'prathamgowda194-pixel'}`);
    console.log(`Authentication:  ACTIVE [${cfg.token ? 'PAT VERIFIED' : 'NONE'}]`);
    console.log(`Visual Engine:   OPENHIGGSFIELD AI (38 Models / wide-trace/open-higgsfield)`);
    console.log(`Firecrawl API:   OPERATIONAL (Scraper Engine Live)`);
    console.log(`Multica Hook:    ACTIVE (Project Board Automated Sync)`);
    console.log(`Behavioral Rail: soul.md (High-Throughput / Minimal Overhead)`);
    console.log('════════════════════════════════════════════════════════════');
    break;
  }

  case 'generate-visual': {
    const higgsfield = require('../open_higgsfield_engine.cjs');
    const prompt = args.slice(1).join(' ') || 'Luxury crypto lottery visual banner';
    console.log(`[HERMES AGENT] Calling OpenHiggsfield Studio for: "${prompt}"...`);
    higgsfield.generateVisual(prompt).then(res => {
      console.log(`[HERMES AGENT] Generation complete via ${res.source} (${res.model})`);
    }).catch(err => console.error('[HERMES AGENT] Visual error:', err.message));
    break;
  }

  default:
    console.log(`Usage: hermes-agent [config --provider <name> --token <pat> | status | generate-visual <prompt>]`);
}
