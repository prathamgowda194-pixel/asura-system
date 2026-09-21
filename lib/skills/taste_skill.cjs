/**
 * CLAUDE FRONTEND DESIGN SKILL 01: TASTE SKILL
 * Origin: GitHub / Awwwards / FWA / Vercel Design Elite
 * Purpose: Eradicates generic "vibe-coded" AI slop by injecting authentic editorial taste.
 * Rules:
 *  1. SPEC-FIRST: Never generate code without defining an intentional visual spec.
 *  2. NO FLAT BACKGROUNDS: Always apply multi-layer depth (radial ambient bloom, blurred brand wash, 0.04 fractal noise).
 *  3. INTENTIONAL TYPOGRAPHIC HIERARCHY: Editorial serif or bold technical display + high-legibility clean sans.
 *  4. LIVING ASYMMETRY: Avoid predictable 3-column equal boxes. Use staggered cards, full-bleed chapters, and overlapping layers.
 *  5. TACTILE MICRO-INTERACTIONS: Every interactive element must respond with magnetic pull, spring curves, or specular glare.
 */

const TASTE_REGISTRY = {
  automotive: {
    theme: "Supersonic Aerodynamics & Telemetry Cockpit",
    palette: {
      bg: "#05070B",
      surface: "#0A0E17",
      primary: "#E22020", // Ferrari Rosso Corsa
      primaryGlow: "rgba(226, 32, 32, 0.35)",
      accent: "#FFCC00", // Modena Giallo Fly
      accentCyan: "#00F0FF",
      border: "rgba(255, 255, 255, 0.08)",
      text: "#F8FAFC",
      muted: "#94A3B8"
    },
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      hud: "'Chakra Petch', monospace",
      body: "'Inter', sans-serif",
      import: "family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@600;700;800"
    },
    cursor: "crosshair-cockpit",
    hoverStyle: "aerodynamic-vector-streak"
  },
  architecture: {
    theme: "Cantilevered Monolith & Lived Alpine Spaces",
    palette: {
      bg: "#060709",
      surface: "#0D1117",
      primary: "#D4AF37", // 24K Champagne Gold
      primaryGlow: "rgba(212, 175, 55, 0.25)",
      accent: "#38BDF8", // Glacial Blue
      border: "rgba(255, 255, 255, 0.12)",
      text: "#F8FAFC",
      muted: "#A1A1AA"
    },
    fonts: {
      heading: "'Italiana', serif",
      display: "'Cinzel', serif",
      body: "'Outfit', sans-serif",
      import: "family=Cinzel:wght@600;700;800&family=Italiana&family=Outfit:wght@300;400;500;600"
    },
    cursor: "architectural-lens",
    hoverStyle: "glass-specular-tilt"
  },
  watch: {
    theme: "Haute Horlogerie & Grand Tourbillon Calibre",
    palette: {
      bg: "#04060A",
      surface: "#090D15",
      primary: "#E5A97C", // 24K Rose Gold
      primaryGlow: "rgba(229, 169, 124, 0.3)",
      accent: "#D1D5DB", // Geneva Rhodium
      steel: "#2B4C7E", // Flame Blued Steel
      border: "rgba(229, 169, 124, 0.2)",
      text: "#F5EBE1",
      muted: "#9CA3AF"
    },
    fonts: {
      heading: "'Playfair Display', serif",
      crest: "'Cinzel', serif",
      body: "'Outfit', sans-serif",
      import: "family=Cinzel:wght@500;600;700&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@0,600;0,700;1,400"
    },
    cursor: "watchmaker-reticle",
    hoverStyle: "loupe-magnifier"
  },
  cafe: {
    theme: "Heirloom Roastery & Thermal Hearth Gastronomy",
    palette: {
      bg: "#090604",
      surface: "#140E0A",
      primary: "#C05621", // Roasted Terracotta
      primaryGlow: "rgba(192, 86, 33, 0.3)",
      accent: "#FAF5EE", // Warm Raw Linen
      gold: "#D4AF37", // Traditional Brass Filter
      border: "rgba(192, 86, 33, 0.25)",
      text: "#FAF5EE",
      muted: "#D6C7B2"
    },
    fonts: {
      heading: "'Syne', sans-serif",
      serif: "'Marcellus', serif",
      body: "'Manrope', sans-serif",
      import: "family=Manrope:wght@300;400;500;600&family=Marcellus&family=Syne:wght@600;700;800"
    },
    cursor: "roasted-bean-ripple",
    hoverStyle: "thermal-convection-card"
  }
};

function getTasteSpec(niche) {
  return TASTE_REGISTRY[niche] || TASTE_REGISTRY.automotive;
}

module.exports = { getTasteSpec, TASTE_REGISTRY };
