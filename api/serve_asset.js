/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA EDGE ASSET SERVICER // ZERO-404 ASSET GUARANTEE ENGINE
 * Route: /api/serve_asset?path=:path
 * ══════════════════════════════════════════════════════════════════════════════
 * Serves three.min.js, fonts.css, webp foregrounds, mp4 videos, and textures
 * directly from disk or authenticated GitHub with HTTP 206 Range streaming.
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
  '.mp4': 'video/mp4',
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
  const basename = path.basename(reqPath);

  // Determine possible relative paths to check
  const candidatePaths = [
    reqPath,
    path.join('public', reqPath),
    path.join('projects', 'villa-elysee', reqPath),
    path.join('projects', 'villa-elysee', 'assets', basename),
    path.join('projects', 'aadriti-learning-centre', reqPath),
    path.join('projects', 'aadriti-learning-centre', 'assets', basename),
    path.join('public', 'assets', basename),
    path.join('assets', basename),
    path.join('public', 'projects', 'villa-elysee', 'assets', basename),
    path.join('public', 'projects', 'aadriti-learning-centre', 'assets', basename)
  ];

  const ext = path.extname(reqPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // 1. Try local disk
  for (const rel of candidatePaths) {
    try {
      const local = path.join(process.cwd(), rel);
      if (fs.existsSync(local) && fs.statSync(local).isFile()) {
        const stat = fs.statSync(local);
        const fileSize = stat.size;
        const range = req.headers.range;

        // Support HTTP 206 Partial Content for video streaming and seeking
        if (range && ext === '.mp4') {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const stream = fs.createReadStream(local, { start, end });
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
          });
          stream.pipe(res);
          return;
        }

        const buffer = fs.readFileSync(local);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(buffer);
      }
    } catch (e) {}
  }

  // 2. Fetch from GitHub repository (authenticated for private repo access)
  for (const rel of candidatePaths) {
    const cleanGitPath = rel.replace(/\\/g, '/');
    try {
      const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/${cleanGitPath}`;
      const headers = {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Asset-Edge'
      };
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }
      const rawRes = await fetch(rawUrl, { headers });

      if (rawRes.status === 200 || rawRes.status === 206) {
        const arrayBuf = await rawRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        if (rawRes.headers.get('content-range')) {
          res.setHeader('Content-Range', rawRes.headers.get('content-range'));
        }
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(rawRes.status).send(buffer);
      }
    } catch (e) {}
  }

  return res.status(404).send(`Asset not found: ${reqPath}`);
}
