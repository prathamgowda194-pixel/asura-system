/**
 * ASURA THREEUI CATALOG INDEXER
 * Indexes all 160+ WebGL components, shaders, animations, and landing page recipes
 * from the ThreeUI vault for programmatic synthesis.
 */

const fs = require('fs');
const path = require('path');

const VAULT_DIR = path.join(__dirname, '..', 'threeui_vault');

class ThreeUICatalogIndexer {
  constructor() {
    this.vaultPath = fs.existsSync(VAULT_DIR) ? VAULT_DIR : 'C:\\Users\\WINDOWS\\Desktop\\threeui';
    this.catalog = null;
  }

  getIndex() {
    if (this.catalog) return this.catalog;

    const componentsDir = path.join(this.vaultPath, 'src', 'package-components');
    const shadersDir = path.join(this.vaultPath, 'src', 'shaders');

    const components = fs.existsSync(componentsDir)
      ? fs.readdirSync(componentsDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).map(f => path.basename(f, path.extname(f)))
      : [];

    const shaders = fs.existsSync(shadersDir)
      ? fs.readdirSync(shadersDir).filter(f => fs.statSync(path.join(shadersDir, f)).isDirectory())
      : [];

    this.catalog = {
      totalComponents: components.length,
      totalShaders: shaders.length,
      components,
      shaders,
      vaultPath: this.vaultPath
    };

    return this.catalog;
  }

  search(query) {
    const idx = this.getIndex();
    const q = query.toLowerCase();
    const matchedComponents = idx.components.filter(c => c.toLowerCase().includes(q));
    const matchedShaders = idx.shaders.filter(s => s.toLowerCase().includes(q));

    return {
      query,
      matchedComponents,
      matchedShaders
    };
  }
}

module.exports = new ThreeUICatalogIndexer();
