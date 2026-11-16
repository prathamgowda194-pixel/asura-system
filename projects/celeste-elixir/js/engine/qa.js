/**
 * QA hooks used by the capture script (asura-qa/scripts/capture.mjs).
 *
 *   window.__asura.ready        Promise, resolves after the first frames are on screen
 *   window.__asura.jump(p)      jump to page progress p (0..1) with no smoothing, returns info()
 *   window.__asura.chapters()   keyframe progress values, so captures can land on every shot
 *   window.__asura.info()       tier, gpu, dpr, draw calls, triangles, textures, frame time
 *
 * URL shortcut for tools that can only open a page and take a screenshot (the /browser subagent):
 *   ?qa=1&shot=0.42        jump to page progress 0.42 once ready, then freeze
 *   ?qa=1&shot=#arrival    jump to the camera keyframe anchored at #arrival
 * The page sets <html data-shot="done"> when the frame is on screen.
 *
 * Keep these hooks in production. They cost nothing and make every build testable.
 */
export function installQA({ engine, scroll, rig, onJump }) {
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  const shot = new URLSearchParams(location.search).get('shot');

  const api = {
    version: 3,
    ready,
    markReady() {
      document.documentElement.classList.add('is-ready');
      resolveReady(true);
      if (shot) {
        const frame = rig.frames.find((f) => f.at === shot);
        const p = frame ? frame.p : Number(shot);
        if (Number.isFinite(p)) api.jump(Math.min(1, Math.max(0, p))).then(() => { document.documentElement.dataset.shot = 'done'; });
      }
    },
    /** Jump to page progress p, render a few frames, then freeze the canvas so screenshots are stable. */
    async jump(p, { freeze = true } = {}) {
      engine.paused = false;
      scroll.measure();
      scroll.to(p * scroll.state.max, { immediate: true });
      scroll.read();
      rig.resetPointer();
      rig.update(0, p, { snap: true });
      onJump?.(p);
      await frames(4);
      engine.paused = freeze;
      return api.info();
    },
    resume() {
      engine.paused = false;
    },
    chapters() {
      return rig.frames.map((f) => ({ p: Number(f.p.toFixed(4)), at: typeof f.at === 'string' ? f.at : null }));
    },
    info() {
      const r = engine.renderer.info;
      return {
        tier: engine.tier.name,
        gpu: engine.tier.gpu,
        dpr: engine.dpr,
        calls: r.render.calls,
        triangles: r.render.triangles,
        geometries: r.memory.geometries,
        textures: r.memory.textures,
        programs: r.programs?.length ?? 0,
        frameMs: Math.round(engine.perf.avg * 10) / 10,
      };
    },
  };

  window.__asura = api;
  return api;
}

function frames(n) {
  return new Promise((resolve) => {
    const step = () => (--n <= 0 ? resolve() : requestAnimationFrame(step));
    requestAnimationFrame(step);
  });
}
