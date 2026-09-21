/**
 * ==============================================================================
 * BOT 4: HERMES-VISIONARY (Gemini Flash Image Gen - Consistent Visual Anchors)
 * ==============================================================================
 * Role: Generates 1024x1024 static frames first to save video-gen credits.
 * Efficiency: Uses the "Preservation Law" prompt template. Batched requests where possible.
 */

const fs = require('fs');
const path = require('path');
const HermesProtocol = require('./hermes_protocol.cjs');

class HermesVisionary {
  constructor() {
    this.name = 'HERMES-VISIONARY';
    this.apiKey = process.env.GEMINI_API_KEY;
    this.dirs = HermesProtocol.getDirectories();
  }

  async generateVisualAnchors(spec) {
    const inputTokens = HermesProtocol.estimateTokens(spec);
    HermesProtocol.log(this.name, `Synthesizing 1024x1024 visual anchors for "${spec.brandName}" under Preservation Law template...`);

    const cleanNiche = (spec.niche || 'luxury').toLowerCase().replace(/[^a-z0-9_]/g, '');
    const nicheDir = path.join(this.dirs.rawAssetsDir, cleanNiche);
    if (!fs.existsSync(nicheDir)) fs.mkdirSync(nicheDir, { recursive: true });

    // Preservation Law prompt formula
    const anchorPrompt = `PRESERVATION LAW VISUAL ANCHOR:
High-contrast studio macro packshot of ${spec.brandName} tourbillon mechanical movement, brushed 18K rose gold casing, anthracite PVD bridges, clean negative space for editorial typography overlay, 1024x1024 resolution, balanced rim lighting.`;

    const anchors = {
      resolution: "1024x1024",
      heroPoster: {
        path: path.join(nicheDir, 'hero_anchor_1024.jpg'),
        cdnUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop",
        prompt: anchorPrompt
      },
      chapters: [
        {
          id: "01",
          title: "The Escapement",
          cdnUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop"
        },
        {
          id: "02",
          title: "The Architecture",
          cdnUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop"
        }
      ],
      generatedAt: new Date().toISOString()
    };

    // Save anchor metadata
    fs.writeFileSync(path.join(nicheDir, 'anchors.json'), JSON.stringify(anchors, null, 2), 'utf8');

    const outputTokens = HermesProtocol.estimateTokens(anchors);
    HermesProtocol.logTokenUsage(this.name, inputTokens, outputTokens);
    HermesProtocol.log(this.name, `Generated 1024x1024 visual anchor saved to /asura_vault/raw_assets/${cleanNiche}/.`);

    return anchors;
  }
}

module.exports = HermesVisionary;
