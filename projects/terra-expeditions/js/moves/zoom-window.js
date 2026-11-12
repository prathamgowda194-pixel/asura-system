/**
 * Zoom reveal: the page is a solid sheet with a small window cut into it; scrolling widens the window
 * until the 3D stage behind fills the screen. Cinematic way into the scene (orbit to ground, outside
 * to inside), and it hides the camera cut you make while the window is small.
 *
 *   <section class="zoom" id="enter">                 pinned while the window opens
 *     <div class="zoom__sheet" aria-hidden="true"></div>
 *     <p class="zoom__caption">...</p>
 *   </section>
 *   const zoom = zoomWindow(document.querySelector('#enter'), { onProgress: (t) => {} });
 *
 * The sheet colour is --zoom-sheet (default: the page background). The window starts at
 * `from` (fractions of the section size) and its corner radius eases from `radius` px to 0.
 * onProgress(0..1) lets the scene react (dolly the camera through the window, fade a sound in).
 * The hole is a clip-path on the sheet: one paint per frame, no layout, no per-frame measuring.
 * Reduced motion: no pin; the window is fully open.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function zoomWindow(section, { sheet = '.zoom__sheet', from = [0.34, 0.3], radius = 28, distance = 1.4, onProgress, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const el = section.querySelector(sheet);
  const ease = gsap.parseEase('power2.inOut');
  let W = section.clientWidth;
  let H = section.clientHeight;
  let last = '';
  const q = (v) => Math.round(v * 2) / 2; // half-pixel steps: no visible stepping, fewer identical writes
  const apply = (t) => {
    const e = ease(t);
    const w = q(W * gsap.utils.interpolate(from[0], 1.02, e));
    const h = q(H * gsap.utils.interpolate(from[1], 1.02, e));
    const r = Math.min(q(radius * (1 - e)), w / 2, h / 2);
    const x = q((W - w) / 2);
    const y = q((H - h) / 2);
    // Outer rectangle plus a rounded-rectangle hole, filled even-odd: the hole is transparent.
    const path = `path(evenodd, "M0 0H${W}V${H}H0Z M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z")`;
    if (path !== last) {
      el.style.clipPath = path;
      last = path;
    }
    onProgress?.(t);
  };
  const measure = () => { W = section.clientWidth; H = section.clientHeight; last = ''; };
  if (reduced) {
    el.style.visibility = 'hidden';
    onProgress?.(1);
    return { el, trigger: null };
  }
  apply(0);
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * distance}`,
    pin: true,
    scrub: true,
    onUpdate: (self) => apply(self.progress),
    onRefresh: (self) => { measure(); apply(self.progress); },
  });
  return { el, trigger };
}
