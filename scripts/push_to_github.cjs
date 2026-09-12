/**
 * Direct GitHub REST API Pusher for ASURA System
 * Commits and pushes files directly using GitHub Contents API without requiring git CLI.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const OWNER = 'prathamgowda194-pixel';
const REPO = 'asura-system';
const BASE_DIR = path.resolve(__dirname, '..');

const FILES_TO_PUSH = [
  'app.py',
  'requirements.txt',
  'soul.md',
  '.env',
  '.hermes/config.json',
  'scripts/multica_hook.cjs',
  'scripts/hermes_cli.cjs',
  'Dockerfile',
  'render.yaml',
  'railway.json'
];

async function getFileSha(filePath) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Deployer',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (res.status === 200) {
      const data = await res.json();
      return data.sha;
    }
  } catch (e) {}
  return null;
}

async function pushFile(filePath) {
  const fullPath = path.join(BASE_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[SKIP] ${filePath} not found locally.`);
    return false;
  }

  const content = fs.readFileSync(fullPath);
  const base64Content = content.toString('base64');
  const sha = await getFileSha(filePath);

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
  const body = {
    message: `feat(asura): sync ${filePath} - Hermes Agent v10.0 production engine`,
    content: base64Content,
    branch: 'main'
  };
  if (sha) body.sha = sha;

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ASURA-Deployer',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.status === 200 || res.status === 201) {
      console.log(`[PUSHED] ${filePath} -> commit ${data.commit.sha.slice(0, 7)}`);
      return true;
    } else {
      console.log(`[ERROR] ${filePath}: HTTP ${res.status} - ${data.message}`);
      return false;
    }
  } catch (err) {
    console.log(`[ERROR] ${filePath}: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log('════════════════════════════════════════════════════════════');
  console.log(` DIRECT GITHUB PUSH -> ${OWNER}/${REPO}`);
  console.log('════════════════════════════════════════════════════════════');

  // Verify repo existence first
  const repoRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'ASURA-Deployer'
    }
  });

  if (repoRes.status === 404) {
    console.log(`[NOTICE] Repository "${OWNER}/${REPO}" not accessible or not created yet.`);
    console.log(`Attempting automated creation with provided token...`);

    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ASURA-Deployer'
      },
      body: JSON.stringify({
        name: REPO,
        description: 'ASURA Command // 24/7 Autonomous Multi-Agent AI System',
        private: false,
        auto_init: true
      })
    });

    const createData = await createRes.json();
    if (createRes.status !== 201) {
      console.log(`[CREATION BLOCKED] GitHub responded: "${createData.message}"`);
      console.log(`\nTo allow instant push, please:`);
      console.log(`1. Create the repository on GitHub: https://github.com/new?name=${REPO}`);
      console.log(`2. If using a Fine-Grained PAT, ensure "Repository access" includes "${REPO}" with "Contents: Read and write".`);
      return;
    } else {
      console.log(`[SUCCESS] Repository ${OWNER}/${REPO} created! Proceeding to push files...`);
    }
  }

  let pushed = 0;
  for (const f of FILES_TO_PUSH) {
    const ok = await pushFile(f);
    if (ok) pushed++;
  }

  console.log('════════════════════════════════════════════════════════════');
  console.log(`PUSH SUMMARY: ${pushed}/${FILES_TO_PUSH.length} files synchronized to ${OWNER}/${REPO}.`);
  console.log('════════════════════════════════════════════════════════════');
}

run();
