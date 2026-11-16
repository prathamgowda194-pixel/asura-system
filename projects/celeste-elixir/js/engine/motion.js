/**
 * DOM motion presets. Opt in per element:
 *   data-reveal="lines"  masked line-by-line reveal (headlines only)
 *   data-reveal="fade"   short rise and fade (body copy, buttons)
 * Plays once when the element enters the viewport. prefers-reduced-motion: nothing animates.
 *
 * Restraint rule: the 3D scene carries the motion. Text motion stays short and quiet.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { SplitText } from 'gsap/SplitText.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Header state: see-through over the film, solid once the first solid section (.sheet) reaches it,
 * so the nav stays readable on light sheets. Styles: .site-header / .site-header.is-solid in base.css.
 */
export function setupHeader({ header = document.querySelector('.site-header'), solidFrom = '.sheet' } = {}) {
  const first = document.querySelector(solidFrom);
  if (!header || !first) return null;
  return ScrollTrigger.create({
    trigger: first,
    start: () => `top ${header.offsetHeight}px`,
    // End past the page bottom: at progress 1 ScrollTrigger counts as inactive, which would drop the state at the very end.
    end: () => `+=${document.documentElement.scrollHeight + window.innerHeight}`,
    onToggle: (self) => header.classList.toggle('is-solid', self.isActive),
  });
}

export function setupReveals({ reduced = false, root = document } = {}) {
  if (reduced) return;
  root.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
  root.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 18,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
