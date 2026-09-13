/**
 * ASURA EDGE PROJECT SERVICER // INSTANT ZERO-RATE-LIMIT GATEWAY
 * Dynamically serves live client prototypes directly from GitHub storage.
 * Eliminates Vercel 100-deployment/day rate limits forever.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

export default async function handler(req, res) {
  const slug = (req.query.slug || '').replace(/[^a-z0-9-]/gi, '');
  if (!slug) {
    return res.status(400).send("<h1>Missing project slug</h1>");
  }

  const paths = [
    `prototypes/${slug}/index.html`,
    `projects/${slug}/index.html`
  ];

  for (const relPath of paths) {
    try {
      const apiEndpoint = `https://api.github.com/repos/${REPO}/contents/${relPath}`;
      const apiRes = await fetch(apiEndpoint, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'ASURA-Edge',
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (apiRes.status === 200) {
        const data = await apiRes.json();
        const html = Buffer.from(data.content, 'base64').toString('utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
        return res.status(200).send(html);
      }
    } catch (e) {}
  }

  return res.status(404).send(`<h1>Project "${slug}" is compiling or not found.</h1>`);
}
