# Design System: VILLA ÉLYSÉE // Luxury Real Estate Architecture

**Design Read**: Luxury architectural developer portfolio for high-net-worth clientele and bespoke villa acquisitions, with a dark, cinematic, and minimalist language, leaning toward architectural brutalism + warm champagne gold + glassmorphism.

---

## 1. Dial Configuration
- **`DESIGN_VARIANCE: 7`** (Asymmetric architectural grids, split-screen balance, editorial rhythm)
- **`MOTION_INTENSITY: 7`** (Cinematic inertia, character-split reveals, 3D model orbit, parallax elevation)
- **`VISUAL_DENSITY: 3`** (Generous breathing room, vast negative space, museum-gallery layout)

---

## 2. Color Palette & Atmospheric Tokens

| Token | Hex / Value | Semantic Role |
|---|---|---|
| `--color-bg-base` | `#0d0d0f` | Void Black Foundation |
| `--color-bg-charcoal` | `#121214` | Primary Surface / Sections |
| `--color-bg-slate` | `#18181c` | Elevated Glass Panels / Cards |
| `--color-accent-gold` | `#d4af37` | Primary Accent / Foil Highlights / Active states |
| `--color-accent-champagne`| `#f3e5ab` | Light Gold Highlights / Shimmer |
| `--color-accent-bronze` | `#8c7322` | Deep Gold Glow / Ambient Shadow |
| `--color-text-primary` | `#f8f8f8` | High-contrast display headlines |
| `--color-text-secondary` | `#a1a1aa` | Editorial body copy |
| `--color-text-muted` | `#71717a` | Spec metadata, coordinates, labels |
| `--color-glass-border` | `rgba(212, 175, 55, 0.15)` | Gold-tinted subtle boundary |
| `--color-glass-bg` | `rgba(22, 22, 26, 0.65)` | Frosted backdrop blur panel |

---

## 3. Typography Architecture

- **Display & Headline Font**: `'Playfair Display', 'Cinzel', Georgia, serif`
  - High editorial contrast, tracked uppercase subtitles, delicate italic emphasis.
  - Scale:
    - Hero H1: `text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05]`
    - Section H2: `text-3xl sm:text-5xl lg:text-6xl font-light tracking-normal leading-[1.15]`
    - Card H3: `text-xl sm:text-2xl font-medium tracking-tight`
- **Body & Interface Font**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
  - Utilitarian precision, geometric clarity, and high legibility.
  - Scale:
    - Body Lead: `text-base md:text-lg text-gray-300 font-light leading-relaxed max-w-[65ch]`
    - Body Text: `text-sm text-gray-400 font-light leading-relaxed`
    - Mono Specs: `text-[11px] font-mono tracking-[0.2em] uppercase text-gold`

---

## 4. Materiality & Glassmorphic Rules
- **Backdrop Blur**: `backdrop-blur-2xl`
- **Surface Layering**:
  ```css
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(212, 175, 55, 0.02) 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 50px rgba(0, 0, 0, 0.6);
  ```
- **Interactive Hover State**:
  - Border transitions to `rgba(212, 175, 55, 0.45)`.
  - Ambient gold drop-shadow: `0 0 35px -5px rgba(212, 175, 55, 0.2)`.

---

## 5. Spacing & Rhythm System
- **Section Padding**: `py-28 md:py-36` (generous architectural breathing space)
- **Container Boundary**: `max-w-7xl mx-auto px-6 sm:px-8`
- **Grid Gaps**: `gap-8 md:gap-12`
