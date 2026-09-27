/**
 * ASURA AGENTIC STUDIO // CLOUD VERCEL SERVERLESS ENDPOINT
 * Route: /api/studio → serves the main Studio UI
 * Uses ES module format (required when package.json has "type": "module")
 */

import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Bust any Vercel/CDN cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 1. Try local disk first
  try {
    const localPath = path.join(process.cwd(), 'projects', 'studio', 'index.html');
    if (fs.existsSync(localPath)) {
      const html = fs.readFileSync(localPath, 'utf8');
      return res.status(200).send(html);
    }
  } catch (e) {}

  // 2. Fetch fresh from GitHub
  try {
    const ghUrl = `https://api.github.com/repos/${REPO}/contents/projects/studio/index.html`;
    const ghRes = await fetch(ghUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Studio-Edge',
        'Accept': 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache'
      }
    });

    if (ghRes.ok) {
      const data = await ghRes.json();
      const html = Buffer.from(data.content, 'base64').toString('utf8');
      return res.status(200).send(html);
    }
  } catch (err) {
    // fall through to error
  }

  return res.status(503).send(`
<!DOCTYPE html>
<html lang="en" style="background:#06080B;color:#fff;font-family:monospace">
<head><meta charset="UTF-8"><title>ASURA // Loading...</title></head>
<body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:16px">
  <div style="font-size:48px">⬡</div>
  <h1 style="font-size:20px;font-weight:900;letter-spacing:0.1em">ASURA STUDIO</h1>
  <p style="color:rgba(255,255,255,0.4);font-size:13px">Initializing cloud systems... Please refresh in 5 seconds.</p>
  <script>setTimeout(function(){window.location.reload()},5000)</script>
</body>
</html>`);
}
