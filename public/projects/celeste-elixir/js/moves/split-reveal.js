/**
 * Word-by-word text reveals with GSAP SplitText.
 *
 *   splitReveal(el, { mode: 'scrub' })   words go from faint to full as the paragraph crosses the screen
 *   splitReveal(el, { mode: 'rise' })    lines rise out of a mask once, when the element enters
 *
 *   <p data-split="scrub">A statement read at the pace of the scroll.</p>
 *   document.querySelectorAll('[data-split]').forEach((el) => splitReveal(el, { mode: el.dataset.split }));
 *
 * Use one mode per page for headlines and at most one scrubbed paragraph per chapter; more than that
 * reads as an effect demo. SplitText keeps the original text for screen readers (aria) and re-splits
 * on resize. Reduced motion: text is shown as is.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function splitReveal(el, { mode = 'scrub', faint = 0.16, start = 'top 80%', end = 'bottom 45%', stagger = 0.08, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  if (reduced) return null;
  if (mode === 'rise') {
    return SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      aria: 'auto',
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: 'expo.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  }
  return SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    aria: 'auto',
    onSplit: (self) => gsap.fromTo(self.words, { opacity: faint }, {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start, end, scrub: true },
    }),
  });
}
