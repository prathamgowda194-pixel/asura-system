# ASURA CORE MECHANICS: THE SUPREME MECHANICS LIBRARY
**Doctrine: "Cinema First, Web Second"**
**Role: Chief Technical Director & Motion Architect for ASURA**

---

## CORE PHILOSOPHY: "Cinema First, Web Second"
1. **Immersive Media:** No static headers. Every hero section is a video loop or pinned image chapter.
2. **Fluid Motion:** No hard jumps. Use lerp (linear interpolation) smoothing for all scroll interactions.
3. **Editorial Typography:** Large serifs mixed with tight sans-serifs. Text overlays media via gradients, never boxes.
4. **Brand Hue Washes:** Never use pure black (`#000000`). Use deep, saturated brand colors blurred behind content.

---

## THE SUPREME MECHANICS LIBRARY (MANDATORY IMPLEMENTATION)

When building ANY section, select the appropriate mechanic from this list and implement the EXACT code structure provided.

### MECHANIC 1: PIN-PARALLAX SHEETS (The "Cocoon" Pattern)
*Use for: Intro sections where text slides over a fixed background.*
- **Structure:** A `.pinwrap` container holding a sticky `.pin` (background media) followed by sliding `.sheet` elements.
- **CSS Rule:**
```css
.pinwrap { position: relative; }
.pin { position: sticky; top: 0; height: 100vh; z-index: 0; overflow: hidden; }
.spacer { height: 26vh; /* Breathing room before sheet */ }
.sheet { position: relative; z-index: 2; background: var(--bg-color); border-top: 1px solid var(--border-color); }
```
- **Behavior:** The background stays fixed while content sheets slide up over it.
- **Citation Comment:** `<!-- USING MECHANIC 1: PIN-PARALLAX SHEETS (COCOON PATTERN) -->`

---

### MECHANIC 2: FULL-VIEWPORT PHOTO CHAPTERS (The "FLOWERS/SIM" Pattern)
*Use for: Storytelling sections with multiple scenes.*
- **Structure:** Sticky background image/video + Negative margin foreground scenes.
- **CSS Rule:**
```css
.ch { position: relative; }
.ch .bg { position: sticky; top: 0; height: 100vh; z-index: 0; overflow: hidden; }
.ch .bg img, .ch .bg video { width: 100%; height: 100%; object-fit: cover; }
.ch .fl { position: relative; z-index: 2; margin-top: -100vh; /* Pulls content over bg */ }
.scene { min-height: 100vh; padding: 0 4vw; display: flex; align-items: flex-end; justify-content: flex-start; }
.catplate { position: relative; margin-bottom: 10vh; width: min(440px, 92vw); background: var(--surface-wash); border: 1px solid var(--border-color); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); padding: 2.25rem; border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); }
```
- **Detail:** Add small "plates" (cards) absolutely positioned over the background for extra depth.
- **Citation Comment:** `<!-- USING MECHANIC 2: FULL-VIEWPORT PHOTO CHAPTERS (FLOWERS/SIM PATTERN) -->`

---

### MECHANIC 3: GRADIENT SEAM FADES (No Hard Edges)
*Use for: Transitioning between chapters seamlessly.*
- **Rule:** NEVER let one section end abruptly against another.
- **Implementation:** Add pseudo-elements or seam overlays to the bottom/top of every `.ch .bg`:
```css
.ch .bg::after { 
    content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 24vh;
    background: linear-gradient(to top, var(--brand-dark), transparent); z-index: 1; pointer-events: none;
}
.seam-top {
    position: absolute; top: 0; left: 0; width: 100%; height: 20vh;
    background: linear-gradient(to bottom, var(--brand-dark), transparent); z-index: 1; pointer-events: none;
}
```
- **Citation Comment:** `<!-- USING MECHANIC 3: GRADIENT SEAM FADES (NO HARD EDGES) -->`

---

### MECHANIC 4: BRAND-HUE WASHES (Atmospheric Depth)
*Use for: Backgrounds instead of flat colors.*
- **Rule:** Do not use solid hex codes for page backgrounds.
- **Implementation:** Create a wrapper with a blurred, scaled-down version of the main asset behind the content.
```css
.winewrap { position: relative; overflow: hidden; background: var(--brand-dark); }
.winewrap > .wb { position: absolute; inset: -15%; z-index: 0; pointer-events: none; }
.winewrap > .wb img, .winewrap > .wb .blur-wash { 
    width: 100%; height: 100%; object-fit: cover; 
    filter: blur(52px) saturate(1.25); opacity: .4; transform: scale(1.2); 
}
.winewrap > *:not(.wb) { position: relative; z-index: 2; }
```
- **Citation Comment:** `<!-- USING MECHANIC 4: BRAND-HUE WASHES (ATMOSPHERIC DEPTH) -->`

---

### MECHANIC 5: SCROLL-SCRUB HERO ZONE (Interactive Film)
*Use for: The very first section (Hero).*
- **Concept:** User scrolls down -> Video plays forward. User scrolls up -> Video rewinds.
- **HTML:** Pinned `<video>` inside a tall spacer div (`height: 230vh`).
- **JS Logic (Must Include):**
```javascript
// Lerp Smoothing Function
let currentTime = 0;
let targetTime = 0;
const video = document.getElementById('scrub-video');
const heroZone = document.getElementById('hero-scrub-zone');

function scrubLoop() {
    if (!video || !heroZone) return;
    const startOffset = heroZone.offsetTop;
    const zoneHeight = heroZone.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, (window.scrollY - startOffset) / zoneHeight));
    
    if (video.duration) {
        targetTime = progress * video.duration;
        currentTime += (targetTime - currentTime) * 0.14; // Smooth easing
        if (Math.abs(targetTime - currentTime) > 0.001) {
            video.currentTime = currentTime;
        }
    }
    requestAnimationFrame(scrubLoop);
}
requestAnimationFrame(scrubLoop);
```
- **Citation Comment:** `<!-- USING MECHANIC 5: SCROLL-SCRUB HERO ZONE (INTERACTIVE FILM) -->`

---

### MECHANIC 6: HORIZONTAL RIDE (Down -> Right -> Down)
*Use for: Product galleries or process steps.*
- **Structure:** Tall vertical container (`.hs`) wrapping a sticky horizontal track (`.track`).
- **CSS Rule:**
```css
.hs { position: relative; height: 350vh; }
.hs-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center; }
.track { display: flex; gap: 2.5vw; will-change: transform; }
```
- **JS Logic:** Map vertical scroll percentage to horizontal translation X-axis.
```javascript
function updateHorizontalRide() {
    const hs = document.querySelector('.hs');
    const track = document.querySelector('.track');
    if (!hs || !track) return;
    const maxScroll = hs.offsetHeight - window.innerHeight;
    const pct = Math.min(1, Math.max(0, (window.scrollY - hs.offsetTop) / maxScroll));
    const targetX = -pct * (track.scrollWidth - window.innerWidth + 80);
    track.style.transform = `translateX(${targetX}px)`;
}
window.addEventListener('scroll', updateHorizontalRide, { passive: true });
```
- **Citation Comment:** `<!-- USING MECHANIC 6: HORIZONTAL RIDE (DOWN -> RIGHT -> DOWN) -->`

---

### MECHANIC 7: REVEAL SYSTEM (Cinematic Entrances)
*Use for: ALL text and images entering the viewport.*
- **Rule:** Nothing appears instantly. Everything fades/slides in.
- **CSS Class:** `.rv` (Reveal Viewport) triggers `.in` class via IntersectionObserver.
```css
.rv img, .rv video { transform: scale(1.12); opacity: 0; transition: all 1.5s cubic-bezier(.16,1,.3,1); }
.rv.in img, .rv.in video { transform: scale(1); opacity: 1; }
.rt > * { opacity: 0; transform: translateY(26px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--i) * 0.07s); }
.rt.in > * { opacity: 1; transform: translateY(0); }
```
- **JS Trigger:**
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
    });
}, { threshold: 0.15 });
document.querySelectorAll('.rv, .rt').forEach(el => observer.observe(el));
```
- **Citation Comment:** `<!-- USING MECHANIC 7: REVEAL SYSTEM (CINEMATIC ENTRANCES) -->`

---

### MECHANIC 8: EDITORIAL HEADERS & FOOTERS
- **Header:** Fixed, transparent, `mix-blend-mode: difference` (white text turns black on light bg). One row only.
```css
.editorial-header {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 50;
    mix-blend-mode: difference; color: #ffffff;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 2.5rem; pointer-events: none;
}
.editorial-header a, .editorial-header button { pointer-events: auto; }
```
- **Footer:** Giant stroked wordmark.
```css
.giant-word {
    font-family: var(--font-heading);
    text-transform: uppercase;
    text-align: center;
    font-size: clamp(3rem, 13vw, 13rem);
    line-height: 0.85;
    letter-spacing: -0.03em;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.45);
    user-select: none;
    opacity: 0.8;
}
```
- **Citation Comment:** `<!-- USING MECHANIC 8: EDITORIAL HEADERS & FOOTERS (DIFFERENCE BLEND & GIANT WORDMARK) -->`

---

### MECHANIC 9: 3D PINNED REAL ESTATE DECK & LIGHTING SHIFT (The "ERA" Pattern)
*Use for: Luxury Real Estate & Architectural showcases with day/night shift and interactive hotspot pins.*
- **Structure:** Pinned architectural stage with interactive Day/Night state blending, floating SVG hotspot pins with radar pulses, and a stacked 3D perspective card deck with floorplan/spec telemetry.
- **CSS Rule:**
```css
.hero-stage { position: relative; height: 100vh; overflow: hidden; }
.hero-visual-layer { position: absolute; inset: 0; transition: opacity 0.8s cubic-bezier(0.76, 0, 0.24, 1); }
.hero-visual-layer.is-night { opacity: 0; }
.hero-stage.night-active .hero-visual-layer.is-night { opacity: 1; }
.hero-stage.night-active .hero-visual-layer.is-day { opacity: 0; }

/* Interactive Hotspot Pins */
.arch-pin { position: absolute; transform: translate(-50%, -50%); cursor: pointer; z-index: 20; }
.arch-pin-dot { width: 12px; height: 12px; border-radius: 50%; background: #ffffff; box-shadow: 0 0 0 4px rgba(255,255,255,0.25); position: relative; }
.arch-pin-pulse { position: absolute; inset: -8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.6); animation: pinPulse 2.4s infinite cubic-bezier(0.25, 1, 0.5, 1); }
@keyframes pinPulse { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }

/* Stacked 3D Perspective Card Deck */
.deck-container { perspective: 1400px; transform-style: preserve-3d; }
.deck-card { transform-origin: center bottom; transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.7s ease; }
```
- **Citation Comment:** `<!-- USING MECHANIC 9: 3D PINNED REAL ESTATE DECK & LIGHTING SHIFT (ERA PATTERN) -->`

---

### MECHANIC 10: SMOOTH FPV DRONE VIDEO SCRUB & PHOTOGRAPHIC FALLBACK ENGINE
*Use for: Continuous fly-through video hero stages (Real Estate villas, hypercars, architectural walkthroughs).*
- **Doctrine:** Real video footage scrubbed seamlessly by the user's scroll position gives an unmatched sense of physical presence that pure 3D canvas models cannot replicate.
- **HTML Structure:**
```html
<section id="hero-scrub-zone" class="relative w-full h-[220vh]">
  <div class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
    <div id="video-stage" class="absolute inset-0 w-full h-full">
      <video id="scroll-drone-video" class="w-full h-full object-cover" muted playsinline preload="auto" src="./assets/era_scroll_master.mp4"></video>
      <div id="photo-fallback-layer" class="absolute inset-0 w-full h-full opacity-0 pointer-events-none transition-opacity duration-700">
        <img src="./assets/era_hero_day.jpg" class="w-full h-full object-cover">
      </div>
    </div>
    <!-- Overlay Scrims & Dynamic Telemetry HUD -->
  </div>
</section>
```
- **JS Scrub Engine (GSAP ScrollTrigger + Lerp):**
```javascript
const video = document.getElementById('scroll-drone-video');
let targetTime = 0;
let currentTime = 0;

ScrollTrigger.create({
  trigger: "#hero-scrub-zone",
  start: "top top",
  end: "bottom bottom",
  scrub: 1.0,
  onUpdate: (self) => {
    if (video && video.duration) {
      targetTime = self.progress * video.duration;
    }
  }
});

function videoLerpLoop() {
  if (video && video.duration) {
    currentTime += (targetTime - currentTime) * 0.16;
    if (Math.abs(targetTime - currentTime) > 0.002) {
      video.currentTime = currentTime;
    }
  }
  requestAnimationFrame(videoLerpLoop);
}
requestAnimationFrame(videoLerpLoop);
```
- **Citation Comment:** `<!-- USING MECHANIC 10: SMOOTH FPV DRONE VIDEO SCRUB & PHOTOGRAPHIC FALLBACK ENGINE -->`

---

### MECHANIC 11: ACETERNITY 3D CARD PINNING & TRACING BEAMS (Aceternity UI Pattern)
*Use for: Interactive property cards, floorplans, and product inspection decks.*
- **Structure:** Perspective container with mouse-reactive 3D tilt, dynamic radial glow beam, and glowing pin radar anchor.
- **CSS Rule:**
```css
.card-pin-perspective { perspective: 1400px; transform-style: preserve-3d; }
.card-pin-box {
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
  will-change: transform;
}
.card-pin-box:hover {
  transform: perspective(1400px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(30px);
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.35), 0 0 25px rgba(196, 164, 124, 0.25);
}
```
- **Citation Comment:** `<!-- USING MECHANIC 11: ACETERNITY 3D CARD PINNING & TRACING BEAMS -->`

---

### MECHANIC 12: PROCEDURAL WEBGL ATMOSPHERIC SHADERS (Vanta.js / Three.js Pattern)
*Use for: Atmospheric background motion, reflection pools, fog, rings, and generative ambient depth.*
- **Doctrine:** Avoid static solid backgrounds. Inject lightweight procedural WebGL noise, waves, or halo rings behind content cards.
- **Implementation:** Integrated via lightweight Three.js shaders or Vanta.js CDN with viewport intersection observer auto-pausing when off-screen to preserve 60 FPS mobile efficiency.
- **Citation Comment:** `<!-- USING MECHANIC 12: PROCEDURAL WEBGL ATMOSPHERIC SHADERS (VANTA PATTERN) -->`

---

### MECHANIC 13: TACTILE STATE DOCKS & DYNAMIC CONCIERGE HUDS (Cult UI & Uiverse Pattern)
*Use for: Floating control bars, Day/Night switches, blueprint wireframe toggles, and live enquiry docks.*
- **Structure:** Pinned floating pill dock with backdrop blur (24px), micro-tactile spring active states, and real-time telemetry counters.
- **Citation Comment:** `<!-- USING MECHANIC 13: TACTILE STATE DOCKS & DYNAMIC CONCIERGE HUDS -->`

---

### MECHANIC 14: INTERACTIVE EXPLODED ENGINEERING CUTAWAY & PARTS INSPECTION SCRUBBER
*Use for: Superbikes, Hypercars, Aerospace, Mechanical Watches, and Precision Hardware.*
- **Structure:** Pinned multi-stage scroll zone where scrolling smoothly transforms an assembled hero vehicle into an exploded component assembly (engine block, trellis chassis, inverted WP suspension, disc brakes, carbon exhausts).
- **Interactive Part Focus:** Hovering/clicking technical hotspots isolates the subsystem, dims surrounding parts, and renders live dyno/spec telemetry cards.
- **CSS Rule:**
```css
.exploded-chassis-stage { perspective: 1600px; transform-style: preserve-3d; }
.subsystem-component { transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease; }
.subsystem-component.is-active { filter: drop-shadow(0 0 25px rgba(255, 102, 0, 0.6)); transform: translateZ(60px) scale(1.08); }
.subsystem-component.is-dimmed { opacity: 0.25; filter: grayscale(80%) blur(2px); }
```
- **Citation Comment:** `<!-- USING MECHANIC 14: INTERACTIVE EXPLODED ENGINEERING CUTAWAY & PARTS INSPECTION SCRUBBER -->`

---

## MOTION & INSPIRATION VAULT (ANTI-SLOP ENGINE)
Before building any new project, cross-reference and synthesize mechanics from:
1. **Details.so**: Boutique editorial site layouts and curated prompts.
2. **Refero.design**: Production user flows and architectural micro-interactions.
3. **Design Spells**: Magic micro-interactions, spring curves, and delightful hover physics.
4. **Codrops / Tympanus**: Cutting-edge 3D WebGL transformations and perspective card decks.
5. **Awwwards / TheFirstTheLast Agency**: High-end Spanish/Mediterranean editorial aesthetics.

---

## ASSET GENERATION PROTOCOL (Higgsfield & Nano Banana Simulation)

Since Asura requires bespoke original assets without scraping source imagery, all imagery must be created with `generate_image` ("Nano Banana"), optimized into high-definition WebP/JPG formats, and embedded with ultra-fast fallbacks.

1. **Architectural Prompts:** When generating real estate imagery:
   * *"Photorealistic architectural editorial photograph of contemporary Mediterranean luxury villa in Estepona, Costa del Sol. Warm limestone, travertine, floor-to-ceiling glass, olive trees, minimalist reflection pool, golden hour soft lighting, award-winning architectural digest photography, 8k resolution, ultra-clean."*
2. **Image Placement:** Placed in `/projects/{slug}/assets/` or converted into zero-latency data URIs for instant local/Vercel delivery.


---

## EXECUTION WORKFLOW (STRICT ORDER)

WHEN RECEIVING BRIEF (e.g., "Luxury Watch Brand"):

### STEP 1: SELECT MECHANICS
- Hero: **Mechanic 5 (Scroll-Scrub)** + **Mechanic 8 (Editorial Header)**.
- Collection: **Mechanic 6 (Horizontal Ride)**.
- Story: **Mechanic 2 (Photo Chapters)** + **Mechanic 3 (Gradient Seams)**.
- Atmosphere: **Mechanic 4 (Brand-Hue Washes)**.
- Elements: **Mechanic 7 (Reveal System)**.
- Footer: **Mechanic 8 (Giant Wordmark)**.

### STEP 2: DEFINE PALETTE & TYPE
- Background: Deep Charcoal (`#09090b`) with Brand Gold wash (`#D4AF37` blurred).
- Font Pairing: 'Playfair Display' (Serif Headlines) + 'Inter Tight' (Sans Body).
- Caption Grammar: White text over gradient scrim (Bottom-center alignment).

### STEP 3: WRITE SINGLE-FILE HTML
- Combine CSS, JS, and HTML into one single self-contained file.
- Implement the **Lerp Smoothing Loop** globally for scroll performance.
- Ensure `prefers-reduced-motion` fallbacks are included (disable scrub/parallax for accessibility).

### STEP 4: SELF-AUDIT (The "Anti-Slop" Check)
Before outputting, verify:
- [x] Did I cite which Mechanic numbers are being used in code comments? (YES)
- [x] Did I use `position: sticky` for the hero? (YES)
- [x] Is there a gradient fade between sections? (YES)
- [x] Are fonts loaded from Google Fonts CDN? (YES)
- [x] Is the header `mix-blend-mode: difference`? (YES)
- [x] Did I avoid standard Bootstrap/Tailwind default spacing? (YES)
- [x] Is `<!-- NOTE: For production, replace src with Base64 string to eliminate network lag -->` included? (YES)
- [x] Does every site feel like a high-end editorial magazine or cinematic film scroll? (YES)

---
*Stored and verified as the core operational doctrine for all future Asura builds.*
