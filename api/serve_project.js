/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA EDGE PROJECT SERVICER // ZERO-404 GUARANTEE ENGINE
 * Route: /api/serve_project?slug=:slug
 * ══════════════════════════════════════════════════════════════════════════════
 * - 120 Curated Professional Luxury Color Combinations
 * - Zero Neo-Clinic Style
 * - Dedicated Automotive Detailing & Ceramic Studio Niche
 * - Full-Screen Pin-Parallax Hero Photography on ALL Websites
 * - Two Full-Viewport Photo Chapters (FLOWERS/SIM Pattern)
 * - Solid Pre-Rendered Metrics (Zero 0-start broken counters)
 */

const fs = require('fs');
const path = require('path');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'prathamgowda194-pixel/asura-system';

const BASE_TONES = [
  { name: "Smoked Merlot", bg: "#150a0e", bgAlt: "#220f16", surface: "#2f1620", text: "#fdf2f4", muted: "#c9a4b0", wash: "rgba(34, 15, 22, 0.85)" },
  { name: "French Navy", bg: "#070b16", bgAlt: "#0d1424", surface: "#131d33", text: "#f8fafc", muted: "#94a3b8", wash: "rgba(19, 29, 51, 0.85)" },
  { name: "Forest Emerald", bg: "#08140f", bgAlt: "#0e221a", surface: "#152e24", text: "#f0fdf4", muted: "#86efac", wash: "rgba(14, 34, 26, 0.85)" },
  { name: "Royal Burgundy", bg: "#1c0a10", bgAlt: "#291019", surface: "#381723", text: "#fdf2f4", muted: "#f4aab8", wash: "rgba(41, 16, 25, 0.85)" },
  { name: "Bone Charcoal", bg: "#161311", bgAlt: "#211c19", surface: "#2d2622", text: "#f7f4ef", muted: "#b0a79e", wash: "rgba(43, 27, 23, 0.80)" },
  { name: "Deep Carbon", bg: "#0c0d10", bgAlt: "#14161c", surface: "#1c1f27", text: "#ffffff", muted: "#a1a1aa", wash: "rgba(20, 22, 28, 0.85)" },
  { name: "Nordic Espresso", bg: "#151412", bgAlt: "#211f1c", surface: "#2c2a26", text: "#faf7f2", muted: "#beb8ae", wash: "rgba(33, 31, 28, 0.85)" },
  { name: "Matte Gunmetal", bg: "#08080a", bgAlt: "#111115", surface: "#18181f", text: "#f4f4f5", muted: "#a1a1aa", wash: "rgba(24, 24, 31, 0.85)" },
  { name: "Mineral Slate", bg: "#0a0e17", bgAlt: "#111827", surface: "#1a2336", text: "#f8fafc", muted: "#94a3b8", wash: "rgba(17, 24, 39, 0.85)" },
  { name: "Tuscan Olive", bg: "#10130e", bgAlt: "#1a1e16", surface: "#24291f", text: "#f4f6f2", muted: "#b0b8aa", wash: "rgba(26, 30, 22, 0.85)" },
  { name: "Cognac Amber", bg: "#18100a", bgAlt: "#261a10", surface: "#362417", text: "#fdf7f2", muted: "#d9b89e", wash: "rgba(38, 26, 16, 0.85)" },
  { name: "Midnight Velvet", bg: "#090918", bgAlt: "#121226", surface: "#1b1b36", text: "#f6f6fc", muted: "#a2a2cc", wash: "rgba(18, 18, 38, 0.85)" }
];

const ACCENTS = [
  { name: "Champagne Gold", accent: "#d4af37", accentLight: "#fef08a", border: "rgba(212, 175, 55, 0.28)" },
  { name: "Antique Brass", accent: "#dfa86a", accentLight: "#f4d0a5", border: "rgba(223, 168, 106, 0.28)" },
  { name: "Regal Amber", accent: "#d97706", accentLight: "#fde68a", border: "rgba(217, 119, 6, 0.28)" },
  { name: "Signal Gold", accent: "#e59500", accentLight: "#fbbf24", border: "rgba(229, 149, 0, 0.28)" },
  { name: "Burnt Terracotta", accent: "#b85d38", accentLight: "#e3916e", border: "rgba(184, 93, 56, 0.28)" },
  { name: "Rose Gold", accent: "#e0a996", accentLight: "#f7d7ce", border: "rgba(224, 169, 150, 0.28)" },
  { name: "Warm Sandstone", accent: "#d4a373", accentLight: "#f0caa1", border: "rgba(212, 163, 115, 0.28)" },
  { name: "Lapis Azure", accent: "#38bdf8", accentLight: "#bae6fd", border: "rgba(56, 189, 248, 0.28)" },
  { name: "Burnished Bronze", accent: "#c2a66e", accentLight: "#e5d5b0", border: "rgba(194, 166, 110, 0.28)" },
  { name: "Crimson Flare", accent: "#ef4444", accentLight: "#fca5a5", border: "rgba(239, 68, 68, 0.28)" }
];

const FONT_SETS = [
  { heading: "'Playfair Display', Georgia, serif", body: "'Inter Tight', sans-serif", headingImport: "family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Inter+Tight:wght@300;400;500;600" },
  { heading: "'Fraunces', serif", body: "'Manrope', sans-serif", headingImport: "family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Manrope:wght@300;400;500;600;700" },
  { heading: "'Cinzel', Georgia, serif", body: "'Plus Jakarta Sans', sans-serif", headingImport: "family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700" },
  { heading: "'Cormorant Garamond', serif", body: "'Manrope', sans-serif", headingImport: "family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Manrope:wght@300;400;500;600" },
  { heading: "'Syne', -apple-system, sans-serif", body: "'Plus Jakarta Sans', sans-serif", headingImport: "family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600" },
  { heading: "'Marcellus', serif", body: "'Inter Tight', sans-serif", headingImport: "family=Marcellus&family=Inter+Tight:wght@300;400;500;600;700" }
];

const PALETTE_MATRIX_100 = [];
let pCount = 0;
for (let b = 0; b < BASE_TONES.length; b++) {
  for (let a = 0; a < ACCENTS.length; a++) {
    pCount++;
    const base = BASE_TONES[b];
    const acc = ACCENTS[a];
    const fonts = FONT_SETS[(b + a) % FONT_SETS.length];
    PALETTE_MATRIX_100.push({
      id: `palette-${String(pCount).padStart(3, '0')}`,
      name: `${base.name} with ${acc.name}`,
      fonts: fonts,
      colors: {
        bg: base.bg,
        bgAlt: base.bgAlt,
        surface: base.surface,
        text: base.text,
        muted: base.muted,
        accent: acc.accent,
        accentLight: acc.accentLight,
        border: acc.border,
        wash: base.wash
      },
      headerStyle: (b + a) % 2 === 0 ? "chanel-grid" : "dtc-pill"
    });
  }
}

const ASSETS = {
  autodetailing: {
    hero: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2000&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
    items: [
      { no: "001", title: "9H Dual-Layer Graphene Ceramic Shield", spec: "Self-Healing Hydrophobic Armor with 5-Year National Warranty", price: "₹28,500 protocol", img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Multi-Stage Paint Correction Mastery", spec: "Micron Paint Depth Profiling & 99% Swirl-Free Mirror Gloss", price: "₹18,000 protocol", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "Full-Body Self-Healing TPU PPF Armor", spec: "Optical Grade 8.5 Mil Paint Protection Film with Hydrophobic Topcoat", price: "₹1,25,000 portfolio", img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  dining: {
    hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2000&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop",
    items: [
      { no: "001", title: "Chef's Wood-Fired Tasting Platter", spec: "Smoked Malai Broccoli, Hand-Pounded Galouti & Truffle Naan", price: "₹1,850 cover", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Imperial Alfresco Cabana Experience", spec: "Dedicated Mixer Butler & Chilled Riedel Crystal Setup", price: "₹3,500 cover", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "Artisanal Cold-Pressed Mixers & Ice Craft", spec: "Dehydrated Citrus, Smoked Rosemary, Himalayan Tonic & Clear Spheres", price: "₹850 setup", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  realestate: {
    hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
    items: [
      { no: "001", title: "The Sovereign Sky Villa", spec: "4 BHK Duplex · 4,850 Sq. Ft. Panoramic Seafront", price: "₹8.45 Cr*", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "The Riviera Horizon Penthouse", spec: "3 BHK Seafront · 3,200 Sq. Ft. Private Deck", price: "₹5.20 Cr*", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "The Signature Estate Parcel", spec: "5 BHK Enclave · 6,400 Sq. Ft. Gated Sanctuary", price: "₹12.80 Cr*", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  dental: {
    hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2074&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070&auto=format&fit=crop",
    items: [
      { no: "001", title: "Bespoke Ceramic Veneers", spec: "German E-Max 3D CAD/CAM Precision", price: "₹18,500 / tooth", img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Immediate Swiss Implants", spec: "Straumann Lifetime Warranty Protocol", price: "₹42,000 / unit", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "Laser Smile Reconstruction", spec: "Full Arch Esthetic Rehabilitation", price: "Custom Evaluation", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  construction: {
    hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=2070&auto=format&fit=crop",
    items: [
      { no: "001", title: "Turnkey Commercial Tower", spec: "Grade-A Post-Tensioned Structural Framing", price: "₹45 Cr Portfolio", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Heritage Villa Complex", spec: "Monolithic Concrete & Earthquake Zone IV", price: "₹18 Cr Portfolio", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "Industrial Heavy Infrastructure", spec: "Pre-Engineered High-Bay Warehousing", price: "₹28 Cr Portfolio", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  interior: {
    hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2070&auto=format&fit=crop",
    items: [
      { no: "001", title: "Architectural Living Suite", spec: "Fluted Walnut & Italian Travertine Paneling", price: "₹14.5 Lakhs*", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Haute Modular Culinary Studio", spec: "Blum Servo-Drive & Calacatta Quartz", price: "₹8.8 Lakhs*", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "Master Sanctuary Suite", spec: "Acoustic Millwork & Concealed Architectural Glow", price: "₹6.2 Lakhs*", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  medspa: {
    hero: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=2070&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
    items: [
      { no: "001", title: "Hydra-Luxe Cellular Infusion", spec: "Medical Grade Hyaluronic Delivery & LED Shield", price: "₹8,500 / session", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Fractional Pico-Laser Resurfacing", spec: "Collagen Induction for Indian Skin Profiles", price: "₹16,000 / session", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "Signature Sculpt Lift Protocol", spec: "Non-Surgical High-Frequency RF Contouring", price: "₹24,000 / protocol", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop" }
    ]
  },
  fitness: {
    hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    c1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    c2: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
    c3: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    items: [
      { no: "001", title: "High-Performance Strength Protocol", spec: "Eleiko Barbell & Rig Full Access", price: "₹28,000 / annual", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop" },
      { no: "002", title: "Metabolic Conditioning & CrossFit", spec: "Small-Group Tier 1 Coaching", price: "₹5,500 / month", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop" },
      { no: "003", title: "1-on-1 Athletic Biomechanics", spec: "Force Plate Profiling & VO2 Max Assessment", price: "₹18,000 / 12 sessions", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop" }
    ]
  }
};

const NICHE_PROFILES = {
  autodetailing: {
    category: "Luxury Car Detailing & Ceramic Studio",
    headlines: [
      "Precision Ceramic Coating & Supercar Detailing in {city}.",
      "9H Graphene Armor & Multi-Stage Paint Correction in {city}."
    ],
    subtitle: "Protecting and elevating automotive masterworks with micron-level paint depth profiling, 9H graphene ceramic shields, and dust-free infrared curing bays.",
    stats: [
      { val: "4.7 ★", lbl: "100+ Verified Client Reviews" },
      { val: "100%", lbl: "9H Ceramic & PPF Warranty" },
      { val: "12+ Yrs", lbl: "Master Detailing Provenance" },
      { val: "5,000+", lbl: "Exotic & Supercars Protected" }
    ],
    ctaText: "Book Detailing Bay",
    deliverablesTitle: "Signature Protection Packages",
    complianceText: "Statutory Standards & Service Warranty Certified."
  },
  dining: {
    category: "Artisanal Dining & Alfresco BYOB Sanctuary",
    headlines: [
      "Artisanal Gastronomy & Alfresco BYOB Sanctuary in {city}.",
      "Bespoke Culinary Pairings & Starlit Cabanas in {city}."
    ],
    subtitle: "Pair your finest personal spirits with chef-curated artisan pairings, chilled Riedel crystal stemware, and private starlit cabanas.",
    stats: [
      { val: "4.9 ★", lbl: "Verified Public Reviews" },
      { val: "100%", lbl: "Curated Fresh Ingredients" },
      { val: "₹1,800 - ₹3,500", lbl: "Average Cover For Two" },
      { val: "100% BYOB", lbl: "Chilled Stemware & Butler Service" }
    ],
    ctaText: "Reserve Private Cabana",
    deliverablesTitle: "Curated Gastronomic Journey",
    complianceText: "FSSAI & Statutory Hospitality Compliance Guaranteed."
  },
  medspa: {
    category: "Dermatology & Aesthetic Clinic",
    headlines: [
      "Dermatologist-Led Clinical Aesthetics & Laser Skin Science in {city}.",
      "Advanced Cellular Rejuvenation in {city}."
    ],
    subtitle: "Evidence-based clinical anti-aging, targeted laser resurfacing, and bespoke dermatological protocols designed exclusively for Indian skin profiles.",
    stats: [
      { val: "15+ Yrs", lbl: "Clinical Dermatology Experience" },
      { val: "12,000+", lbl: "Procedures Delivered" },
      { val: "4.9 ★", lbl: "Verified Patient Reviews" },
      { val: "US-FDA", lbl: "Approved Laser Protocols" }
    ],
    ctaText: "Book Clinical Consultation",
    deliverablesTitle: "Signature Clinical Protocols",
    complianceText: "Clinical Board & Medical Council Approved."
  },
  realestate: {
    category: "Luxury Real Estate & Villa Developers",
    headlines: [
      "Curating Iconic Seafront Sky Villas & Penthouses in {city}.",
      "Sovereign Gated Farmlands & Nature Sanctuaries in {city}."
    ],
    subtitle: "Curating the most coveted prime addresses, sea-facing penthouses, and bespoke residential parcels across {city}. RERA compliant with verified clear titles.",
    stats: [
      { val: "₹500+ Cr", lbl: "Transaction Advisory Portfolio" },
      { val: "100%", lbl: "RERA & Clear Title Guarantee" },
      { val: "4.8 ★", lbl: "Verified Investor Reviews" },
      { val: "18+ Yrs", lbl: "Regional Market Provenance" }
    ],
    ctaText: "Request Private Advisory",
    deliverablesTitle: "Signature Enclaves & Portfolios",
    complianceText: "RERA & Statutory Title Guarantees Guaranteed."
  },
  construction: {
    category: "Civil Construction & Turnkey High-Rises",
    headlines: [
      "Engineering Enduring Commercial Towers & High-Rises in {city}.",
      "Turnkey Civil Infrastructure in {city}."
    ],
    subtitle: "Turnkey civil infrastructure, monolithic high-rises, and industrial facilities engineered with German structural rigor and zero-tolerance safety standards.",
    stats: [
      { val: "2.5M+ Sq.Ft.", lbl: "Civil Infrastructure Delivered" },
      { val: "100%", lbl: "Seismic Zone Compliance" },
      { val: "Grade-A", lbl: "Structural Materials & Rigor" },
      { val: "22+ Yrs", lbl: "Engineering Provenance" }
    ],
    ctaText: "Request Project Tender",
    deliverablesTitle: "Turnkey Civil Contracts",
    complianceText: "IS Code & Structural Engineering Compliance Verified."
  },
  interior: {
    category: "Haute Interior Architecture & Custom Modular Living",
    headlines: [
      "Haute Interior Architecture & Custom Modular Living in {city}.",
      "Curating Bespoke Living Sanctuaries in {city}."
    ],
    subtitle: "Transforming bare residential shells into editorial sanctuaries using imported Italian veneers, acoustic fluting, and precision German hardware.",
    stats: [
      { val: "450+", lbl: "Turnkey Residences Completed" },
      { val: "10 Yrs", lbl: "Modular Material Warranty" },
      { val: "4.9 ★", lbl: "Verified Client Reviews" },
      { val: "100%", lbl: "Italian Veneers & Blum Hardware" }
    ],
    ctaText: "Schedule Design Consultation",
    deliverablesTitle: "Signature Interior Suites",
    complianceText: "Architectural Council & Material Warranty Guaranteed."
  },
  dental: {
    category: "Advanced Dental Implantology & Aesthetic Dentistry",
    headlines: [
      "Advanced Pain-Free Implantology & Laser Smile Styling in {city}.",
      "Digital Intraoral 3D CAD/CAM Smile Reconstruction in {city}."
    ],
    subtitle: "Pioneering pain-free digital implantology, German 3D ceramic veneers, and laser restorative dentistry under senior maxillofacial specialists.",
    stats: [
      { val: "25,000+", lbl: "Successful Smile Restorations" },
      { val: "German 3D", lbl: "CAD/CAM Intraoral Precision" },
      { val: "4.9 ★", lbl: "Pain-Free Patient Satisfaction" },
      { val: "Lifetime", lbl: "Straumann Implant Warranty" }
    ],
    ctaText: "Book Dental Consultation",
    deliverablesTitle: "Specialist Dental Procedures",
    complianceText: "Dental Council of India & ISO Sterilization Certified."
  },
  fitness: {
    category: "High-Performance Strength & Athletic Clubs",
    headlines: [
      "High-Performance Strength & Athletic Biomechanics in {city}.",
      "Olympic Rig Conditioning in {city}."
    ],
    subtitle: "Olympic barbell rigs, Eleiko competition plates, and data-driven VO2 metabolic programming designed for high-performance athletic development.",
    stats: [
      { val: "1-on-1", lbl: "Athletic Biomechanics & VO2 Max" },
      { val: "Eleiko", lbl: "Certified Olympic Rigs" },
      { val: "98.4%", lbl: "Client Goal Achievement" },
      { val: "4.8 ★", lbl: "Member Satisfaction Rating" }
    ],
    ctaText: "Claim Trial Pass",
    deliverablesTitle: "High-Performance Protocols",
    complianceText: "Certified Strength & Conditioning Standards."
  }
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";

function parseSlugInfo(slug) {
  const words = slug.split('-').filter(Boolean);
  let city = "India";
  let phone = "+91 98450 12345";
  let cleanPhone = "9845012345";

  if (/mumbai/i.test(slug)) city = "Mumbai, Maharashtra";
  else if (/bangalore|bengaluru/i.test(slug)) city = "Bangalore, Karnataka";
  else if (/hyderabad/i.test(slug)) city = "Hyderabad, Telangana";
  else if (/jaipur/i.test(slug)) city = "Jaipur, Rajasthan";
  else if (/cochin|kochi/i.test(slug)) city = "Kochi, Kerala";
  else if (/gurgaon|delhi|noida/i.test(slug)) city = "Gurgaon, Delhi NCR";
  else if (/pune/i.test(slug)) city = "Pune, Maharashtra";

  let nicheKey = "realestate";
  if (/detail|ceramic|car|auto|paint|ppf|wrap|vehicle|motors|garage/i.test(slug)) {
    nicheKey = "autodetailing";
  } else if (/dining|restaurant|bistro|byob|cafe|lounge|food/i.test(slug)) {
    nicheKey = "dining";
  } else if (/dental|dentist/i.test(slug)) nicheKey = "dental";
  else if (/construction|builder|civil/i.test(slug)) nicheKey = "construction";
  else if (/interior|modular/i.test(slug)) nicheKey = "interior";
  else if (/skin|aesthetic|derma|medspa/i.test(slug)) nicheKey = "medspa";
  else if (/fitness|gym|crossfit/i.test(slug)) nicheKey = "fitness";

  const cleanWords = words
    .filter(w => !['in', 'at', 'near', 'from', 'llp', 'pvt', 'ltd'].includes(w.toLowerCase()))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  let name = cleanWords.slice(0, 4).join(' ') || "Signature Enterprise";

  return { name, city, nicheKey, phone, cleanPhone, slug };
}

function buildLuxuryHTML(lead) {
  const nicheKey = lead.nicheKey || "realestate";
  const profile = NICHE_PROFILES[nicheKey] || NICHE_PROFILES.realestate;
  const pack = ASSETS[nicheKey] || ASSETS.realestate;

  // 120-Palette Selection via slug hash
  let hash = 0;
  for (let i = 0; i < lead.slug.length; i++) hash = (hash << 5) - hash + lead.slug.charCodeAt(i);
  const pal = PALETTE_MATRIX_100[Math.abs(hash) % PALETTE_MATRIX_100.length];

  const initials = lead.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || "AS";
  const headline = profile.headlines[Math.abs(hash) % profile.headlines.length].replace("{city}", lead.city);

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lead.name} // ${profile.category} in ${lead.city}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${pal.fonts.headingImport}&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    :root {
      --bg: ${pal.colors.bg};
      --bg-alt: ${pal.colors.bgAlt};
      --surface: ${pal.colors.surface};
      --text: ${pal.colors.text};
      --muted: ${pal.colors.muted};
      --accent: ${pal.colors.accent};
      --accent-light: ${pal.colors.accentLight};
      --border: ${pal.colors.border};
      --wash: ${pal.colors.wash};
    }
    body { background-color: var(--bg); color: var(--text); font-family: ${pal.fonts.body}; overflow-x: hidden; }
    h1, h2, h3, .font-heading { font-family: ${pal.fonts.heading}; letter-spacing: -0.02em; }
    .pinwrap { position: relative; }
    .pin { position: sticky; top: 0; height: 100vh; overflow: hidden; z-index: 0; }
    .spacer { height: 26vh; }
    .sheet { position: relative; z-index: 2; background: var(--bg); border-top: 1px solid var(--border); }
    .ch { position: relative; }
    .ch .bg { position: sticky; top: 0; height: 100vh; overflow: hidden; z-index: 0; }
    .ch .bg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); }
    .ch .fl { position: relative; z-index: 2; margin-top: -100vh; }
    .scene { min-height: 100vh; position: relative; padding: 0 4vw; display: flex; align-items: flex-end; }
    .catplate { position: relative; margin-bottom: 12vh; width: min(440px, 92vw); background: var(--surface); border: 1px solid var(--border); backdrop-filter: blur(24px); padding: 2rem; border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); }
    .winewrap { position: relative; overflow: hidden; background: var(--bg); }
    .winewrap > .wb { position: absolute; inset: -15%; z-index: 0; pointer-events: none; }
    .winewrap > .wb img { width: 100%; height: 100%; object-fit: cover; filter: blur(64px) saturate(1.4); opacity: 0.35; }
    .winewrap > *:not(.wb) { position: relative; z-index: 2; }
    .giant { font-family: ${pal.fonts.heading}; text-transform: uppercase; text-align: center; font-size: clamp(2.5rem, 11vw, 10rem); letter-spacing: .04em; line-height: 0.9; color: transparent; -webkit-text-stroke: 1px var(--border); opacity: 0.7; }
    .glass-pill { background: rgba(255,255,255,0.04); backdrop-filter: blur(16px); border: 1px solid var(--border); }
  </style>
</head>
<body class="antialiased selection:bg-[var(--accent)] selection:text-black">

  <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between glass-pill rounded-full px-6 py-3">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style="background: var(--accent); color: var(--bg);">
          ${initials}
        </div>
        <span class="font-heading font-bold text-sm tracking-wider uppercase text-white">${lead.name}</span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="https://wa.me/91${lead.cleanPhone}" target="_blank" class="px-4 py-2 rounded-full font-semibold text-xs transition-all hover:scale-105 shadow-lg" style="background: var(--accent); color: var(--bg);">
          ${profile.ctaText}
        </a>
      </div>
    </div>
  </header>

  <section class="pinwrap">
    <div class="pin flex items-center justify-center">
      <img src="${pack.hero}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" alt="${lead.name}" class="w-full h-full object-cover filter brightness-[0.7]">
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/60"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto z-10">
        <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill mb-6 text-xs font-mono uppercase tracking-widest text-[var(--accent-light)]">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>VERIFIED ${profile.category.toUpperCase()} // ${lead.city.toUpperCase()}</span>
        </div>
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6 text-white max-w-4xl">${headline}</h1>
        <p class="text-base sm:text-lg text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          ${profile.subtitle.replace("{city}", lead.city)}
        </p>
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <a href="https://wa.me/91${lead.cleanPhone}" target="_blank" class="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-2xl flex items-center justify-center space-x-2" style="background: var(--accent); color: var(--bg);">
            <span>${profile.ctaText}</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="spacer"></div>

    <div class="sheet px-6 py-24">
      <div class="max-w-7xl mx-auto">
        <!-- SOLID VERIFIED METRICS (NO 0-START SLOP) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-[var(--border)] mb-24 text-center">
          ${profile.stats.map(st => `
            <div class="p-4">
              <div class="text-3xl sm:text-4xl font-heading font-bold text-white mb-1">${st.val}</div>
              <div class="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">${st.lbl}</div>
            </div>
          `).join('')}
        </div>

        <div class="mb-32">
          <span class="text-xs font-mono uppercase tracking-widest text-[var(--accent)] block mb-3">CURATED DELIVERABLES // 2026</span>
          <h2 class="text-3xl sm:text-5xl font-bold text-white mb-12">${profile.deliverablesTitle}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${pack.items.map(it => `
              <div class="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all flex flex-col">
                <div class="aspect-[4/3] overflow-hidden relative">
                  <img src="${it.img}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" alt="${it.title}" class="w-full h-full object-cover">
                  <div class="absolute top-4 left-4 px-3 py-1 rounded-full glass-pill text-[10px] font-mono tracking-widest text-white">NO. ${it.no}</div>
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-heading font-bold text-xl text-white mb-2">${it.title}</h3>
                    <p class="text-xs font-mono text-[var(--muted)] mb-4">${it.spec}</p>
                  </div>
                  <div class="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span class="font-bold text-sm text-[var(--accent-light)]">${it.price}</span>
                    <a href="https://wa.me/91${lead.cleanPhone}?text=Inquiring+about+${encodeURIComponent(it.title)}" target="_blank" class="text-xs font-mono uppercase text-white hover:text-[var(--accent)] flex items-center space-x-1">
                      <span>Reserve</span>
                      <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="ch">
    <div class="bg"><img src="${pack.c1}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" alt="Craft" class="w-full h-full object-cover"></div>
    <div class="fl"><div class="scene"><div class="catplate">
      <span class="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-2">CHAPTER 01 // DISCIPLINE</span>
      <h3 class="font-heading text-2xl font-bold text-white mb-3">Unflinching Mastery</h3>
      <p class="text-xs text-[var(--muted)] leading-relaxed mb-4">Every commission under ${lead.name} is engineered with uncompromising bespoke specifications tailored specifically to ${lead.city}.</p>
      <a href="https://wa.me/91${lead.cleanPhone}" target="_blank" class="text-xs font-mono uppercase text-[var(--accent-light)] flex items-center space-x-1 hover:underline">
        <span>Connect on WhatsApp</span>
        <i data-lucide="chevron-right" class="w-3 h-3"></i>
      </a>
    </div></div></div>
  </section>

  <section class="winewrap py-32 px-6 border-t border-[var(--border)]">
    <div class="wb"><img src="${pack.c3}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" alt="Ambience"></div>
    <div class="max-w-4xl mx-auto text-center relative z-10 mb-20">
      <span class="text-xs font-mono uppercase tracking-widest text-[var(--accent)] block mb-4">DIRECT ENGAGEMENT</span>
      <h2 class="text-3xl sm:text-6xl font-bold text-white mb-6">Experience ${lead.name} in ${lead.city}.</h2>
      <a href="https://wa.me/91${lead.cleanPhone}" target="_blank" class="inline-flex items-center space-x-2 px-10 py-5 rounded-full font-bold text-sm tracking-wider uppercase transition-all hover:scale-105 shadow-2xl" style="background: var(--accent); color: var(--bg);">
        <i data-lucide="message-square" class="w-4 h-4"></i>
        <span>Direct WhatsApp Consultation (+91)</span>
      </a>
    </div>
    <div class="giant select-none my-12">${lead.name}</div>
    <footer class="max-w-7xl mx-auto pt-12 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between text-xs text-[var(--muted)] gap-4">
      <div>&copy; 2026 ${lead.name}. ${profile.complianceText}</div>
      <div class="font-mono">TEL: ${lead.phone}</div>
    </footer>
  </section>

  <a href="https://wa.me/91${lead.cleanPhone}" target="_blank" class="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center space-x-2 hover:scale-105 transition-all">
    <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
    <i data-lucide="message-square" class="w-4 h-4"></i>
    <span>WhatsApp (${lead.name})</span>
  </a>

  <script>lucide.createIcons();</script>
</body>
</html>`;
}

const BLACKLISTED_SLUGS = new Set([
  "bridge-property-consultants-mumbai",
  "all-smiles-dental-clinic-bangalore",
  "s9-luxury-hair-studio-in-gachibowli",
  "hyderabad-real-estate-hyderabad",
  "byob-restaurant-experience-in-gurgaon",
  "architectural-exports-in-sion-west",
  "lee-space-interior-design-in",
  "taaam-fine-dining-private-limited",
  "indus-dental-clinic-coimbatore",
  "dev-interior-design-work-in-lgb-nagar",
  "sri-prathyangiradevi-real-estate",
  "lawyer-advocates-at-1000-person",
  "india-sotheby-s-international-realty",
  "mr-mrs-detailing-studio-jaipur",
  "ravi-construction-in-mohali",
  "s-k-sahil-civil-contractor-in-mapusa",
  "eternal-fitness-center-bengaluru",
  "contractor-for-bathroom-construction",
  "rahul-real-estate-in-vijay-nagar",
  "hair-treatment-in-pune-id-14651660530",
  "if-they-won-twe-will-call-9748654545",
  "22-photos-of-naik-real-estate-in",
  "building-construction-qamsham-infra",
  "interior-designer-vendors-in"
]);

const BLACKLIST_PATTERNS = [
  /bridge\s*(property|consult|realt)/i,
  /all\s*smiles/i,
  /s\s*9\s*(luxury|hair|studio)/i,
  /hyderabad\s*real\s*estate/i,
  /byob/i,
  /architectural\s*export/i,
  /lee\s*space/i,
  /taaam/i,
  /indus\s*(dental|clinic|implant)/i,
  /dev\s*interior/i,
  /prath?yangi?r/i,
  /(advocate|lawyer).*1000|1000.*(person|advocate|lawyer)/i,
  /sotheby/i,
  /mr\s*(&|and)?\s*mrs\s*detail/i,
  /ravi\s*construct/i,
  /s\s*k?\s*sahil|sahil\s*civil/i,
  /eternal\s*fit/i,
  /(contractor.*bath|bath.*contract|bath.*construct)/i,
  /rahul\s*real/i,
  /hair\s*treatment.*pune|14651660530/i,
  /if\s*they\s*won/i,
  /naik\s*real|santa\s*cruz.*naik/i,
  /qamsham/i,
  /interior.*vendor|vendor.*ahmedabad|vendor.*ahemadabad/i
];

export default async function handler(req, res) {
  const slug = (req.query.slug || '').replace(/[^a-z0-9-]/gi, '');
  if (!slug) {
    return res.status(400).send("<h1>Missing project slug</h1>");
  }

  const isBlocked = BLACKLISTED_SLUGS.has(slug) || BLACKLIST_PATTERNS.some(p => p.test(slug));
  if (isBlocked) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    return res.status(410).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Website Removed // 410 Gone</title><script src="https://cdn.tailwindcss.com"></script></head>
      <body class="bg-black text-slate-300 min-h-screen flex items-center justify-center p-6 font-sans">
        <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center text-xl font-bold mb-4">✕</div>
          <h1 class="text-xl font-bold text-white mb-2">Website Permanently Decommissioned</h1>
          <p class="text-sm text-slate-400 mb-6">This website prototype has been permanently decommissioned and removed per client request. It is no longer hosted or supported.</p>
          <a href="/" class="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold tracking-wide">Return Home</a>
        </div>
      </body>
      </html>
    `);
  }

  // 1. Try local disk first or fetch pre-compiled prototype from GitHub
  const paths = [
    `projects/${slug}/index.html`,
    `prototypes/${slug}/index.html`
  ];

  for (const relPath of paths) {
    try {
      const localPath = path.join(process.cwd(), relPath);
      if (fs.existsSync(localPath)) {
        const html = fs.readFileSync(localPath, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
        return res.status(200).send(html);
      }
    } catch (e) {}

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

  // 2. ZERO-404 FALLBACK: Compile on-the-fly and deliver immediately
  try {
    const leadInfo = parseSlugInfo(slug);
    const html = buildLuxuryHTML(leadInfo);

    (async () => {
      try {
        const putUrl = `https://api.github.com/repos/${REPO}/contents/projects/${slug}/index.html`;
        await fetch(putUrl, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'ASURA-Edge' },
          body: JSON.stringify({
            message: `feat(on-the-fly): auto-compiled luxury prototype for ${slug} [skip ci]`,
            content: Buffer.from(html, 'utf8').toString('base64'),
            branch: 'main'
          })
        });
      } catch (err) {}
    })();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    return res.status(200).send(html);

  } catch (err) {
    return res.status(500).send("<h1>Error compiling prototype.</h1>");
  }
}
