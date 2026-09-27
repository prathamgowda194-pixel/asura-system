# Project Plan: Premium Dark-Themed 3D Digital Artist Portfolio

## 1. Overview & Vision
A cutting-edge, high-performance 3D portfolio website for a digital artist with an obsidian dark theme (`#0a0a0a`), deep neon purple (`#6b21a8`), and electric cyan (`#22d3ee`) visual accents. The experience incorporates mouse-driven WebGL 3D elements, Lenis smooth scrolling, an interactive horizontal gallery with 3D card tilt, and refined glassmorphic UI components.

---

## 2. Tech Stack Confirmation
- **Core Framework**: Next.js 14+ (App Router) + TypeScript
- **3D Graphics & Canvas**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animation & Transitions**: Framer Motion, GSAP, `@studio-freight/lenis` (or `lenis`)
- **Styling & Effects**: Tailwind CSS, Lucide React (icons), Tailwind Glassmorphism / Backdrop Blur
- **Target Output Directory**: `output/artist-portfolio`

---

## 3. Site Architecture & Section Flow
1. **Custom Interactive Cursor**: Magnetic trailing cursor with dynamic hover scale and cyan/purple glow trail.
2. **Global Navigation (Floating HUD)**: Minimalist frosted glass navbar with artist moniker, quick navigation anchors, audio toggle simulator, and status indicator ("Available for commissions").
3. **Hero Section (`Hero.tsx`)**:
   - Fullscreen interactive 3D WebGL Canvas containing a metallic/iridescent 3D Torus with particle field.
   - Smooth mouse-following damping (lerp) reacting to user pointer movements.
   - Dramatic typography: "DIGITAL ARTIST & DIMENSIONAL CRAFTER" with dual-gradient text (Purple to Cyan).
   - Magnetic CTA buttons ("Explore Works", "Contact Artist").
4. **Stats / Marquee Section (`Marquee.tsx`)**:
   - High-velocity infinite ticker highlighting featured clients, awards, and artistic disciplines (3D Generative Art, Creative Coding, Motion Design, Shaders).
5. **Horizontal Scrolling Gallery (`Gallery.tsx`)**:
   - Horizontally scrollable showcase of digital artwork exhibits.
   - 3D Card Tilt Effect: Real-time matrix perspective tilt responding to mouse position with dynamic specular glare and tags.
   - Featured artwork showcases with metadata: title, year, medium, edition, and high-fidelity visual cards.
6. **Artist Statement & Philosophy (`About.tsx`)**:
   - Parallax layered typography and visual showcase.
   - Interactive skill/tool matrix (Blender, Houdini, Unreal Engine 5, GLSL, WebGL, TouchDesigner).
7. **Interactive Showcase / 3D Hologram Playground (`Showcase.tsx`)**:
   - Secondary interactive 3D viewport allowing user manipulation (wireframe toggle, lighting color switch between Cyan & Purple).
8. **Contact & Footer (`Contact.tsx`)**:
   - Glassmorphic contact form with animated focus states and glowing border accents.
   - Social links (Twitter/X, ArtStation, SuperRare, GitHub, Instagram).

---

## 4. 3D Element Specification
- **Hero Torus**:
  - Geometry: `TorusGeometry` / `TorusKnotGeometry` with fine segmentation.
  - Material: `MeshPhysicalMaterial` or custom shader material with clearcoat, roughness (0.15), metallic sheen (0.85), ambient occlusion, and emissive rim lighting.
  - Lights: Two opposing point lights — Neon Cyan (`#22d3ee`) and Deep Violet/Purple (`#6b21a8`), plus subtle ambient light.
  - Mouse Interaction: Mouse vector `(x, y)` mapped from center screen with `useFrame` interpolation (`lerp`) to dynamically tilt the torus and pivot light sources.
  - Background: Sub-milky particle starfield / floating dust reacting to scroll.

---

## 5. Build, Verification & Delivery Steps
1. Scaffold Next.js app in `output/artist-portfolio`.
2. Configure Tailwind CSS with customized purple/cyan color palette and custom animations.
3. Install 3D and animation dependencies (`three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `lucide-react`, `lenis`).
4. Implement components sequentially with strict TypeScript and Next.js client-boundary compatibility (`'use client'`).
5. Execute `npm run build` verification to ensure clean production compilation.
6. Report completion and output directory path.
