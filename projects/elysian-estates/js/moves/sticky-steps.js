/**
 * Sticky steps: a pinned visual (the 3D stage, or a sticky media column) while a list of steps
 * scrolls past; the step that last crossed the reading line is active, and its index drives the scene.
 *
 *   <section class="steps">
 *     <div class="steps__media">...optional sticky media (CSS position: sticky)...</div>
 *     <ol class="steps__list"><li class="step">...</li> x 3-6</ol>
 *   </section>
 *   stickySteps(document.querySelector('.steps'), { onStep: (i) => { activeStep = i; } });
 *
 * onStep(index) fires when the active step changes; onProgress(index, t) gives 0..1 from this step
 * reaching the line to the next one reaching it, so a scene value can blend between steps.
 * There is always exactly one active step (the first before the list, the last after it), and the
 * state is computed from the scroll position, so jumps (anchors, QA captures) land on the right step.
 * Active steps get .is-active (style it, do not animate layout). Without JS: a normal ordered list.
 * line: the reading line as a fraction of the viewport height from the top (0.5 = middle).
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function stickySteps(section, { step = '.step', onStep, onProgress, line = 0.5 } = {}) {
  const steps = Array.from(section.querySelectorAll(step));
  const lineAt = typeof line === 'string' ? parseFloat(line) / 100 : line;
  let tops = [];
  let active = -1;

  const measure = () => { tops = steps.map((el) => el.getBoundingClientRect().top + window.scrollY); };
  const activate = (i) => {
    if (i === active) return;
    steps[active]?.classList.remove('is-active');
    active = i;
    steps[active]?.classList.add('is-active');
    onStep?.(active);
  };
  const update = (scrollY) => {
    if (!steps.length) return;
    const y = scrollY + window.innerHeight * lineAt;
    let i = 0;
    while (i + 1 < tops.length && y >= tops[i + 1]) i++;
    activate(i);
    if (onProgress) {
      const a = tops[i];
      const b = tops[i + 1] ?? a + steps[i].offsetHeight;
      onProgress(i, Math.min(1, Math.max(0, (y - a) / Math.max(1, b - a))));
    }
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => update(self.scroll()),
    onRefresh: (self) => { measure(); update(self.scroll()); },
  });
  measure();
  update(window.scrollY);
  return { steps, trigger, get active() { return active; } };
}
