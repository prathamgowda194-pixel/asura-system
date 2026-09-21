---
name: threeui-catalog
description: Comprehensive catalog and integration guide for ThreeUI (MengTo/threeui) containing 160+ interactive WebGL components, Three.js shaders, animated buttons, liquid forms, and complete landing page recipes. Use to empower Asura and Hermes bots with cutting-edge 3D canvas visuals.
---

# ThreeUI Architecture & Integration Guide

This skill equips the Asura System and its Hermes Swarm (Hermes-Architect, Hermes-Sculptor, Hermes-Motion) with direct access to the entire **ThreeUI** catalog (160+ WebGL components, shaders, and animations).

## 1. Vault Location
All ThreeUI source files, shaders, assets, and templates are stored locally in:
- Desktop: `C:\Users\WINDOWS\Desktop\threeui`
- Asura Brain Vault: `asura-system/threeui_vault`

## 2. Catalog Taxonomy & Categories

### A. 3D Shaders & Backgrounds (47 Modules in `src/shaders/`)
- **Liquid & Fluid Dynamics**: `liquid-form`, `liquid-metal-button`, `stream-convergence`, `condensation`, `fluid-field`
- **Atmospheric & Celestial**: `warp-field`, `orbital-sphere`, `constellation-field`, `nebula`, `cloud-field`, `emerald-horizon`
- **Particles & Forcefields**: `energy-orb`, `portal-field`, `spark-badge`, `flux-vortex`, `ember-storm`
- **Data & Grid Visualizers**: `data-pixel-arc`, `dot-matrix`, `crt`, `connectivity-graph`, `defense-lines`
- **Interactive Worlds**: `sylva-living-world`, `japanese-tower`, `temple-night`, `landscape`, `bookshelf`, `koi-studies`

### B. Kinetic UI & Tactile Controls (`src/package-components/`)
- **Animated Docks**: `AnimatedTopDock`, `CheckpointSliderControl`
- **Tactile Buttons**: `LiquidMetalButton`, `DotBorderButton`, `InductionButton`, `PlasmaButton`, `SpinningBorderButton`
- **Bento & Cards**: `StructureFlowCollection`, `ElementsCollection`, `WireframeForms`
- **Text & Wordmarks**: `TypographyVortexCanvas`, `ParticleWordmark`, `OutlineTypeflow`, `NeonTypography`

### C. Landing Page Recipes (`src/shaders/landing-pages/pageRecipes.ts`)
- **Kage Architecture**: Dark, monolithic, high-contrast serif + modern sans (`Instrument Serif` + `Geist` / `Onest`)
- **Sylva Living World**: Organic, generative botanical 3D canvas with ambient wind physics
- **Sketchbook Monolith**: Editorial creative layout with rotating 3D sketchbook canvases
- **Temple Night & Japanese Tower**: Scenic atmospheric depth with time-of-day shaders

## 3. How Asura & Hermes Swarm Use ThreeUI
When prompted to build websites for any of the 10 upcoming niches:
1. **HERMES-ARCHITECT**: Queries `threeui_vault` for the optimal landing page recipe and typography stack.
2. **HERMES-SCULPTOR**: Extracts the exact WebGL shader code and vertex/fragment shaders from `src/shaders/`.
3. **HERMES-MOTION**: Integrates kinetic mouse tracking, gyroscopic canvas controls, and spring-lerp transitions.
4. **HERMES-AUDITOR**: Validates WebGL canvas context creation, frame rates (60fps target), and mobile fallback responsiveness.

---
© 2026 Asura System // ThreeUI Deep Ingestion Protocol.
