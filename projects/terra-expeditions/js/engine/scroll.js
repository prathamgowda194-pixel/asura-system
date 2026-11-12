/**
 * Scroll: Lenis smooth scrolling synced with GSAP ScrollTrigger, plus helpers that map DOM
 * sections to 0..1 page progress (the camera rig uses these as keyframe anchors).
 *
 *   const scroll = createScroll();
 *   gsap.ticker.add((time) => { const s = scroll.raf(time * 1000); ... s.progress ... });
 *   scroll.progressOf('#chapter-2', 0.5)  -> page progress when that section is centred
 *   scroll.to('#enquire')                 -> smooth scroll (instant with { immediate: true })
 *
 * prefers-reduced-motion disables Lenis and uses native scrolling.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function createScroll({ smooth = true, lerp = 0.085, wheelMultiplier = 1 } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = smooth && !reduced
    ? new Lenis({ autoRaf: false, lerp, wheelMultiplier, smoothWheel: true, anchors: true })
    : null;
  if (lenis) lenis.on('scroll', ScrollTrigger.update);

  const state = { y: 0, max: 1, progress: 0, velocity: 0 };

  function measure() {
    state.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function read() {
    state.y = lenis ? lenis.animatedScroll : window.scrollY;
    state.progress = Math.min(1, Math.max(0, state.y / state.max));
    state.velocity = lenis ? lenis.velocity : 0;
    return state;
  }

  function resolve(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  }

  /**
   * Page progress (0..1) at which `target` is aligned: align 0 = section top at viewport top, 1 = section bottom at viewport bottom.
   * A section pinned by ScrollTrigger is measured by its .pin-spacer, so align 0 = the pin starts, 1 = the pin ends.
   */
  function progressOf(target, align = 0.5) {
    let el = resolve(target);
    if (!el) return 0;
    if (el.parentElement?.classList.contains('pin-spacer')) el = el.parentElement;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * align;
    return Math.min(1, Math.max(0, y / state.max));
  }

  function to(target, { immediate = false, duration = 1.4 } = {}) {
    const el = typeof target === 'number' ? null : resolve(target);
    const y = el ? el.getBoundingClientRect().top + window.scrollY : target;
    if (lenis) lenis.scrollTo(y, { immediate, duration, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
    if (immediate) {
      read();
      ScrollTrigger.update();
    }
  }

  function raf(timeMs) {
    lenis?.raf(timeMs);
    return read();
  }

  measure();
  read();
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(document.body);
  document.fonts?.ready.then(() => { measure(); ScrollTrigger.refresh(); });

  return { lenis, state, reduced, measure, read, raf, to, progressOf };
}
