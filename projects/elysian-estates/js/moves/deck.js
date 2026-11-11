/**
 * A deck of cards that changes layout as you scroll (stacked -> spread, or any two CSS layouts),
 * pinned while it happens, with cards you can pick up and throw. GSAP Flip records the cards, the
 * layout attribute changes, and ScrollTrigger scrubs the move between the two layouts.
 *
 *   <section class="deck-stage" id="moments">                pinned while the deck changes layout
 *     <div class="deck" data-layout="stack">                   layouts are CSS: [data-layout="stack" | "spread"]
 *       <div class="deck__card">                               slot: Flip moves this
 *         <article class="foil" tabindex="0">...</article>     the card: drag and foil tilt move this
 *       </div>  x 3-7
 *     </div>
 *   </section>
 *   const deck = createDeck(document.querySelector('#moments'), { to: 'spread' });
 *
 * Layouts are plain CSS on .deck__card (left/top, --w for width, transform: rotate()). Design your own
 * (fan, grid, line, scatter): add a [data-layout="<name>"] rule and pass { from, to }. Put rotation in
 * `transform`, not in the `rotate` property: Flip reads the transform. The pin lasts `distance`
 * viewport heights. Flip bakes pixel offsets, so the deck rebuilds itself when the viewport width changes.
 * throwable: on fine pointers each slot's first child can be dragged and thrown (InertiaPlugin);
 * touch keeps scrolling. Reduced motion: the final layout, no pin, no scrub, no throw.
 * Pins add page height: lay out the camera rig on ScrollTrigger 'refresh' (see examples/moves-lab).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, Flip, Draggable, InertiaPlugin);

export function createDeck(stage, { deck = '.deck', cards = '.deck__card', from = null, to = 'spread', distance = 1.6, stagger = 0.04, scrub = 0.6, throwable = true, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const container = stage.querySelector(deck);
  const slots = Array.from(container.querySelectorAll(cards));
  const start = from ?? container.dataset.layout ?? 'stack';
  const api = { container, slots, timeline: null, trigger: null, draggables: [] };
  if (reduced) {
    container.dataset.layout = to;
    return api;
  }

  let ctx = null;
  const build = () => {
    ctx?.revert();
    gsap.set(slots, { clearProps: 'transform' });
    container.dataset.layout = start;
    ctx = gsap.context(() => {
      const state = Flip.getState(slots);
      container.dataset.layout = to;
      // No invalidateOnRefresh: a Flip timeline cannot be invalidated (its revert() completes it). Rebuild instead.
      api.timeline = Flip.from(state, { ease: 'none', stagger, scale: true });
      api.trigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * distance}`,
        pin: true,
        scrub,
        animation: api.timeline,
      });
    });
  };
  build();

  let width = window.innerWidth;
  let timer = 0;
  window.addEventListener('resize', () => {
    if (window.innerWidth === width) return; // height-only changes (mobile URL bar) keep the deck
    width = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => { build(); ScrollTrigger.refresh(); }, 250);
  });

  if (throwable && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let z = 10;
    api.draggables = slots.filter((slot) => slot.firstElementChild).map((slot) => Draggable.create(slot.firstElementChild, {
      type: 'x,y',
      inertia: true,
      bounds: stage,
      edgeResistance: 0.75,
      zIndexBoost: false,
      onPress() { slot.style.zIndex = String(++z); }, // the slot is the stacking context, so raise the slot
    })[0]);
    container.classList.add('is-throwable');
  }
  return api;
}
