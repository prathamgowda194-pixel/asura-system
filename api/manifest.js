/**
 * ASURA MANIFEST API // DYNAMIC FLEET CATALOG
 * Route: /api/manifest or /projects/manifest.json
 * Delivers the complete live registry of all deployed websites
 */

import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  // 1. Check local file
  try {
    const localPath = path.join(process.cwd(), 'projects', 'manifest.json');
    if (fs.existsSync(localPath)) {
      const data = fs.readFileSync(localPath, 'utf8');
      return res.status(200).send(data);
    }
  } catch (e) {}

  // 2. Fetch fresh from GitHub
  try {
    const ghRes = await fetch(`https://api.github.com/repos/${REPO}/contents/projects/manifest.json?ref=main`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'ASURA-Manifest',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (ghRes.ok) {
      const json = await ghRes.json();
      const content = Buffer.from(json.content, 'base64').toString('utf8');
      return res.status(200).send(content);
    }
  } catch (err) {}

  // 3. Fallback hardcoded catalog
  return res.status(200).json([
    { slug: "pixnova-voice", name: "Pixnova AI // 24/7 Neural Voice Receptionist", url: "https://asura-system.vercel.app/projects/pixnova-voice/index.html", status: "200 OK" },
    { slug: "lopfait-restaurant", name: "L'Opfait // Haute Gastronomy & Wine Cellar", url: "https://asura-system.vercel.app/projects/lopfait-restaurant/index.html", status: "200 OK" },
    { slug: "forge-automotive", name: "Forge Automotive // Detailing & Ceramic Studio", url: "https://asura-system.vercel.app/projects/forge-automotive/index.html", status: "200 OK" },
    { slug: "era-residence", name: "ERA Residence // Haute Clifftop Horizon", url: "https://asura-system.vercel.app/projects/era-residence/index.html", status: "200 OK" },
    { slug: "ktm-showroom", name: "KTM 390 Duke // Ready To Race Interactive Showroom", url: "https://asura-system.vercel.app/projects/ktm-showroom/index.html", status: "200 OK" },
    { slug: "harley-davidson", name: "Harley-Davidson // Freedom Machine Cruiser", url: "https://asura-system.vercel.app/projects/harley-davidson/index.html", status: "200 OK" },
    { slug: "nuve-skincare", name: "Nüve Skincare // Botanical Dermal Formulation", url: "https://asura-system.vercel.app/projects/nuve-skincare/index.html", status: "200 OK" },
    { slug: "unmapped-travel", name: "Unmapped Expeditions // Curated Wilderness Journeys", url: "https://asura-system.vercel.app/projects/unmapped-travel/index.html", status: "200 OK" },
    { slug: "logio-logistics", name: "Logio Global // Autonomous Fleet Logistics", url: "https://asura-system.vercel.app/projects/logio-logistics/index.html", status: "200 OK" },
    { slug: "dental-clinic", name: "otto // Gentle Dental Care & Specialist Clinic", url: "https://asura-system.vercel.app/projects/dental-clinic/index.html", status: "200 OK" },
    { slug: "villa-elysee", name: "Villa Élysée // Haute Clifftop Horizon", url: "https://asura-system.vercel.app/projects/villa-elysee/index.html", status: "200 OK" },
    { slug: "aadriti-learning-centre", name: "Aadriti Centre For Learning And Psychological Well Being", url: "https://asura-system.vercel.app/projects/aadriti-learning-centre/index.html", status: "200 OK" },
    { slug: "tesla-cybertruck", name: "Tesla Cybertruck // The Power of Innovation", url: "https://asura-system.vercel.app/projects/tesla-cybertruck/index.html", status: "200 OK" },
    { slug: "find-real-estate", name: "FIND Real Estate // Find What Moves You", url: "https://asura-system.vercel.app/projects/find-real-estate/index.html", status: "200 OK" },
    { slug: "pixnova", name: "Pixnova // Digital Architecture Showcase", url: "https://asura-system.vercel.app/projects/pixnova/index.html", status: "200 OK" },
    { slug: "demo-dental-client", name: "Dr. Shetty Dental & Maxillofacial Implantology Clinic", url: "https://asura-system.vercel.app/projects/demo-dental-client/index.html", status: "200 OK" }
  ]);
}
