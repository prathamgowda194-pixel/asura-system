/**
 * Text set on a circle that turns, faster while the page scrolls (a seal, a stamp, a badge, the
 * edge of a jar lid). Built as SVG textPath, so it stays sharp, selectable and accessible.
 *
 *   <div class="ring" data-ring="We serve · We grow · Since 1897 · "></div>
 *   const ring = ringText(document.querySelector('.ring'), { size: 320, speed: 8, scroll: scroll.lenis });
 *
 * The phrase repeats until it fills the circle. speed: degrees per second at rest; boost: extra
 * degrees per unit of scroll velocity. Pass the Lenis instance (createScroll().lenis) for velocity.
 * Reduced motion: static ring. The text is exposed once to screen readers (aria-label).
 */
import { gsap } from 'gsap';

let uid = 0;
export function ringText(el, { text = el.dataset.ring ?? '', size = 300, fontSize = 22, letterSpacing = 3, speed = 8, boost = 0.8, scroll = null, direction = 1, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const id = `ring-path-${++uid}`;
  const r = size / 2 - fontSize;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('ring__svg');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('id', id);
  path.setAttribute('fill', 'none');
  path.setAttribute('d', `M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`);
  const t = document.createElementNS(ns, 'text');
  t.setAttribute('font-size', String(fontSize));
  t.setAttribute('letter-spacing', String(letterSpacing));
  t.classList.add('ring__text');
  const tp = document.createElementNS(ns, 'textPath');
  tp.setAttribute('href', `#${id}`);
  t.append(tp);
  svg.append(path, t);
  el.replaceChildren(svg);
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', text.trim());

  // Repeat the phrase to fill the circumference, then stretch it to close the loop exactly.
  const circumference = 2 * Math.PI * r;
  tp.textContent = text;
  const one = Math.max(1, t.getComputedTextLength());
  const times = Math.max(1, Math.floor(circumference / one));
  tp.textContent = text.repeat(times);
  tp.setAttribute('textLength', String(circumference - letterSpacing));
  tp.setAttribute('lengthAdjust', 'spacing');

  let angle = 0;
  const tick = (_, deltaMs) => {
    const v = scroll?.velocity ?? 0;
    angle = (angle + direction * (speed + Math.abs(v) * boost * 10) * (deltaMs / 1000)) % 360;
    svg.style.transform = `rotate(${angle.toFixed(2)}deg)`;
  };
  // Turn only while the ring is on screen: per-frame work off screen is wasted.
  let running = false;
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running && !reduced) { gsap.ticker.add(tick); running = true; }
    if (!entry.isIntersecting && running) { gsap.ticker.remove(tick); running = false; }
  });
  io.observe(el);
  return { el, svg, destroy() { io.disconnect(); gsap.ticker.remove(tick); } };
}
