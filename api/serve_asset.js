/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA EDGE ASSET SERVICER // ZERO-404 ASSET GUARANTEE ENGINE
 * Route: /api/serve_asset?path=:path
 * ══════════════════════════════════════════════════════════════════════════════
 * Serves three.min.js, fonts.css, webp foregrounds, and textures directly
 * from disk or GitHub with high-speed CDN caching headers.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

const MIME_TYPES = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json; charset=utf-8'
};

export default async function handler(req, res) {
  let reqPath = (req.query.path || req.query.file || '').toString().trim();
  if (!reqPath) {
    return res.status(400).send('Missing asset path');
  }

  // Remove leading slashes and sanitize path traversal
  reqPath = reqPath.replace(/^[/\\]+/, '').replace(/\.\./g, '');

  // Determine possible relative paths to check
  const candidatePaths = [
    reqPath,
    path.join('projects', 'kage', reqPath),
    reqPath.replace(/^projects\/[^/]+\//, 'projects/kage/'),
    reqPath.replace(/^secret-pathways-assets\//, 'projects/kage/secret-pathways-assets/'),
    reqPath.replace(/^projects\/secret-pathways-assets\//, 'projects/kage/secret-pathways-assets/')
  ];

  const ext = path.extname(reqPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // 1. Try local disk
  for (const rel of candidatePaths) {
    try {
      const local = path.join(process.cwd(), rel);
      if (fs.existsSync(local) && fs.statSync(local).isFile()) {
        const buffer = fs.readFileSync(local);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(buffer);
      }
    } catch (e) {}
  }

  // 2. Fetch from GitHub repository
  for (const rel of candidatePaths) {
    const cleanGitPath = rel.replace(/\\/g, '/');
    try {
      const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/${cleanGitPath}`;
      const rawRes = await fetch(rawUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'ASURA-Asset-Edge'
        }
      });

      if (rawRes.status === 200) {
        const arrayBuf = await rawRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(buffer);
      }
    } catch (e) {}
  }

  return res.status(404).send(`Asset not found: ${reqPath}`);
}
