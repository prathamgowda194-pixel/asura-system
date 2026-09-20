/**
 * ASURA AGENTIC STUDIO // CLOUD VERCEL SERVERLESS ENDPOINT
 * Route: /api/studio or /studio or /
 */

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');

  // Try reading local index.html first
  try {
    const localPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(localPath)) {
      const html = fs.readFileSync(localPath, 'utf8');
      if (html.includes('jarvis-white-orb-container')) {
        return res.status(200).send(html);
      }
    }
  } catch (e) {}

  // Fetch from GitHub main branch
  try {
    const ghUrl = `https://api.github.com/repos/${REPO}/contents/index.html`;
    const ghRes = await fetch(ghUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Studio-Edge',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (ghRes.status === 200) {
      const data = await ghRes.json();
      const html = Buffer.from(data.content, 'base64').toString('utf8');
      return res.status(200).send(html);
    }
  } catch (err) {}

  return res.status(500).send('<h1>Asura Studio Cloud: Initializing. Please refresh in 5 seconds.</h1>');
};
