# ASURA DESIGN SYSTEM // STRUCTURE & TASTE GUIDELINES
**Source A: Anthropic `frontend-design` + `ui-ux-pro-max` + `design-taste-frontend`**

---

## 1. Modular Spacing Scale (8pt Baseline Grid)
Every margin, padding, gap, and dimension MUST adhere strictly to the following 4px/8px incremental tokens. Arbitrary pixel values (e.g. `13px`, `27px`) are strictly forbidden.

| Token | Pixels | Tailwind Equivalent | Primary Use Case |
|---|---|---|---|
| `space-1` | 4px | `p-1`, `gap-1`, `m-1` | Micro-badges, icon padding |
| `space-2` | 8px | `p-2`, `gap-2`, `m-2` | Component inner gutters, compact tags |
| `space-3` | 12px | `p-3`, `gap-3`, `m-3` | Button vertical padding, input padding |
| `space-4` | 16px | `p-4`, `gap-4`, `m-4` | Card interior padding (mobile), standard gaps |
| `space-6` | 24px | `p-6`, `gap-6`, `m-6` | Card padding (desktop), grid gutters |
| `space-8` | 32px | `p-8`, `gap-8`, `m-8` | Section sub-group spacing, bento gutters |
| `space-12` | 48px | `p-12`, `gap-12`, `py-12` | Section vertical padding (compact) |
| `space-16` | 64px | `p-16`, `gap-16`, `py-16` | Standard section vertical rhythm |
| `space-24` | 96px | `py-24`, `space-y-24` | Major chapter transitions, hero offset |
| `space-32` | 128px | `py-32` | Editorial breathing room, hero spacing |

---

## 2. Typography Hierarchy & Font Stacks
System fonts (`Arial`, `Segoe UI`, `sans-serif` without CDN) are strictly forbidden under **Law #2**.

### Stack A: Editorial Luxury (Horology, High Hospitality, Fine Dining)
- **Primary Display / Serif:** `'Playfair Display', Georgia, serif`
  - CDN: `family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600`
  - Usage: `h1`, `h2`, hero banners, luxury prices.
- **Body & Ergonomics:** `'Plus Jakarta Sans', sans-serif`
  - CDN: `family=Plus+Jakarta+Sans:wght@300;400;500;600;700`
  - Usage: Paragraphs, descriptions, form inputs.
- **Technical & Metrics:** `'Space Grotesk' / 'JetBrains Mono', monospace`
  - CDN: `family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;600`
  - Usage: Telemetry, badges, timestamps, model reference numbers.

### Stack B: Hyper-Modern Avant-Garde (Automotive, Web3, FinTech)
- **Primary Display:** `'Syne', sans-serif` (wght: 700, 800, 900)
- **Body:** `'Inter', sans-serif` (wght: 300, 400, 500, 600)
- **Telemetry:** `'JetBrains Mono', monospace`

---

## 3. Color & Surface Contrast (WCAG AAA Standard)
Solid flat backgrounds (#000000 / #FFFFFF) are strictly forbidden under **Law #3**.

### Palette Matrix: Luxury Horology & High-End Mechanics
- **Base Deep Carbon Canvas:** `#08090C` with radial illumination from `#141721`
- **Surface Elevation (Glass Bento):** `rgba(18, 22, 32, 0.72)` with `backdrop-blur: 24px`
- **Primary Accent (Champagne Gold / Chrono Amber):** `#D4AF37` / `#F59E0B`
- **Secondary Accent (Chrono Cyan / Titanium Silver):** `#38BDF8` / `#E2E8F0`
- **Precision Border:** `rgba(212, 175, 55, 0.22)` with hover state `rgba(212, 175, 55, 0.65)`
- **Body Text:** `#F8FAFC` (14.2:1 contrast ratio against base canvas)
- **Muted Subtext:** `#94A3B8` (7.8:1 contrast ratio)

---

## 4. Noise Grain & Layer Texture Protocol (Law #3 Enforcement)
Every HTML showpiece MUST include the global noise grain overlay SVG:
```html
<div class="fixed inset-0 pointer-events-none z-40 opacity-[0.035] mix-blend-overlay" 
     style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E');">
</div>
```

---

## 5. Visual Asset Standard (Law #1 Enforcement)
- **Forbidden:** `<Box>`, `<Sphere>`, or crude SVG stickmen / wireframe boxes.
- **Mandatory:** Either:
  1. Interactive WebGL canvas loading realistic `.glb` geometry with PBR metallic reflections (`MeshStandardMaterial` metalness: 0.95, roughness: 0.15), OR
  2. High-DPI cinematic ambient video loops / curated photographic showpieces wrapped in glassmorphic vignette masks.
