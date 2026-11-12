/**
 * Holographic foil on a DOM card (trading cards, passes, tickets, product cards).
 * Writes the pointer position into CSS variables (css/moves.css draws the foil and the glare) and
 * tilts the card with GSAP rotationX / rotationY, so it composes with Draggable (x, y) on the same card.
 * For a card inside the 3D scene use recipes/holo.js instead.
 *
 *   <article class="foil" data-foil="prism" tabindex="0">   prism | sparkle | metal
 *     <div class="foil__art">...your art (SVG, canvas, text)...</div>
 *     <div class="foil__shine" aria-hidden="true"></div>
 *     <div class="foil__glare" aria-hidden="true"></div>
 *   </article>
 *   foilCards(document.querySelectorAll('.foil'));
 *
 * Touch: no pointer tilt (the foil rests at a fixed angle, still shiny). Keyboard and tap: focusing a
 * card tilts it slightly, so the effect is not pointer-only. Reduced motion: no tilt at all.
 * Technique reference: simeydotme/pokemon-cards-css (GPL-3.0). This file shares no code with it.
 */
import { gsap } from 'gsap';

export function foilCards(cards, { maxTilt = 14, perspective = 900, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const list = Array.from(cards);
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  for (const card of list) {
    const set = (x, y, active) => {
      // x, y: 0..1 inside the card
      card.style.setProperty('--px', `${(x * 100).toFixed(2)}%`);
      card.style.setProperty('--py', `${(y * 100).toFixed(2)}%`);
      card.style.setProperty('--hyp', Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2).toFixed(3));
      card.style.setProperty('--active', active ? '1' : '0');
    };
    set(0.62, 0.32, false);
    if (reduced) continue;
    gsap.set(card, { transformPerspective: perspective });
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const rest = () => { set(0.62, 0.32, false); rx(0); ry(0); };
    card.addEventListener('focus', () => { set(0.7, 0.3, true); ry(maxTilt * 0.5); rx(maxTilt * 0.3); });
    card.addEventListener('blur', rest);
    if (!fine) continue;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      set(x, y, true);
      ry((x - 0.5) * 2 * maxTilt);
      rx(-(y - 0.5) * 2 * maxTilt);
    });
    card.addEventListener('pointerleave', () => { if (document.activeElement !== card) rest(); });
  }
  return list;
}
