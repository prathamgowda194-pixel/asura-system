# Reference Analysis: Aurelia Residences & Luxury Architectural Real Estate

**Reference Source**: [Pinterest Video Reference (pin.it/1KvSlCYpW)](https://pin.it/1KvSlCYpW)  
**Artifacts**: `reference_hero.png`, `reference_gallery.png`, `reference_sections.png`

---

## 1. Visual Aesthetics & Design System Extraction

### A. Color Palette
- **Primary Background**: `#0a0a0a` (Deep obsidian black).
- **Secondary Surfaces**: `#111114` to `#16161a` (Muted architectural charcoal).
- **Accent Primary**: `#d4af37` / `#c5a880` (Warm incandescent gold, used for high-intent CTAs like "BOOK A VIEWING", active status dots, and subtle borders).
- **Text Primary**: `#f8f8f8` (High-contrast pure white for monumental editorial headings).
- **Text Muted**: `#a1a1aa` / `#71717a` (Refined zinc for location tags, telemetry, and body descriptions).
- **Glassmorphic Materiality**: `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)` with `backdrop-filter: blur(24px)` and 1px inner specular highlights.

### B. Typography & Hierarchy
- **Display Headings**: Classical luxury serif with editorial authority (`Playfair Display`).
  - Style: All-caps or title-case with deliberate terminal punctuation (`"YOUR LIFE. ELEVATED."`).
  - Tracking: Tight (`-0.035em` to `-0.05em`) with compact leading (`0.9` to `0.95`).
- **Body & Functional UI**: Swiss architectural sans-serif (`Inter`).
  - Style: Clean, light weight (300-400), relaxed leading (`1.6` to `1.75`), generous letter-spacing on sub-labels.
- **Micro-Labels & Coordinates**: Monospace or tracked sans (`0.2em` to `0.3em` letter-spacing, e.g. `"01 // ADDRESSES"`, `"CENTRAL DISTRICT"`).

### C. Layout Architecture & Spacing
- **Grid Discipline**: Strict 8-point spatial system (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`, `128px`).
- **Header**: Pinned or floating glassmorphic bar featuring brand mark on left, central navigation items, and gold pill CTA on the right.
- **Hero Composition**: Asymmetric balance—editorial typography on the left, interactive 3D architectural focal point centered/right, vertical floor/scroll tracker on the right margin.
- **Breathing Room**: Deep negative space (`py-32` to `py-48`) preventing visual clutter and evoking high-net-worth exclusivity.

---

## 2. 3D & Animation Specifications

### A. 3D WebGL Scene (React Three Fiber)
- **Object**: Subtle abstract sculptural architectural mesh featuring high-refraction glass aesthetics.
- **Materials**: `MeshTransmissionMaterial` (thickness: 2, roughness: 0.1, transmission: 1, ior: 1.5).
- **Floor / Ground**: `MeshReflectorMaterial` with soft reflective blur (`[300, 100]`) and high resolution (`2048`) mirroring ambient twilight luminescence.
- **Lighting & Environment**: Studio/city HDRI environment preset combined with warm incandescent cove illumination.
- **Post-Processing**: Selective Bloom (`luminanceThreshold: 0.9`, `intensity: 0.5`) to create authentic luxury evening specular gleam.
- **Interactivity**: Gentle continuous axial rotation with mouse-following parallax dampening.

### B. Scroll & Micro-Animations
- **Smooth Scroll**: Lenis inertia-driven scroll physics.
- **Word Reveal**: GSAP stagger animation revealing headline words with clean vertical translation and opacity rise.
- **Numerical Counting**: Framer Motion scroll-triggered counter for estate telemetry metrics.
- **Card Tilt**: 3D perspective mouse tilt with cursor-following specular glare.
- **Parallax**: GSAP ScrollTrigger multi-layer parallax depth on architectural philosophy.
