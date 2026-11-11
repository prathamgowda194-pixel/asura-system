/**
 * Keyframe camera rig driven by scroll progress.
 *
 * Each keyframe is a shot. The rig moves the camera along a smooth spline through the shots,
 * eases between them, can hold on a shot while copy is read, and interpolates any numeric
 * scene values you attach to a shot (time of day, explode amount, section cut...).
 *
 *   const rig = createRig(camera, { keyframes: [
 *     { at: '#intro',   pos: [60, 22, 90], target: [0, 3, 0], fov: 28, hold: 0.04, state: { tod: 0 } },
 *     { at: '#arrival', pos: [-30, 1.7, 16], target: [2, 3, 0], fov: 34, ease: 'inOut' },
 *     { at: '#night',   pos: [-48, 34, 70], target: [0, 2, 0], fov: 30, state: { tod: 1 } },
 *   ]});
 *   rig.layout((selector, align) => scroll.progressOf(selector, align));   // call again on resize
 *   const { state } = rig.update(dt, scroll.state.progress);              // every frame
 *
 * `at`       number 0..1 or a selector / element (resolved with `align`, default 0.5 = section centred)
 * `hold`     fraction of page progress the camera stays on this shot (default 0)
 * `ease`     easing from this shot to the next: 'inOut' (default) | 'inOutSine' | 'out' | 'in' | 'linear'
 * `state`    numeric values; each key is interpolated between the shots that define it
 * `shift`    [x, y] lens shift: where the target appears in frame, as a fraction of frame size from the
 *            centre (+x right, +y up). [0.18, 0] puts the subject on the right third with the camera still
 *            aimed at it. For buildings keep the camera level and shift up: verticals stay parallel.
 * `portrait` optional { pos, target, fov, shift } used instead when the viewport is taller than wide (phones)
 *
 * rig.current.target is the interpolated look-at point (use it for depth-of-field focus).
 *
 * Narrow screens: below `fitAspect` (default 1.2) the vertical fov widens so roughly the same width of
 * the scene stays in frame (capped at `maxFov`). Shots with a portrait.fov are used exactly as given.
 */
import * as THREE from 'three';

const EASE = {
  linear: (t) => t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
};
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;

export function createRig(camera, { keyframes = [], damping = 4.5, parallax = 0.012, sway = 0.0012, reducedMotion = false, fitAspect = 1.2, maxFov = 75 } = {}) {
  let frames = [];
  let posCurve = null;
  let tgtCurve = null;
  let tracks = {};
  let lastResolve = () => 0;
  let laidOutPortrait = null;

  /** Widen the vertical fov on narrow viewports so the subject is not cropped to a sliver. */
  function fitted(fov, exact) {
    const aspect = camera.aspect || 1;
    if (exact || aspect >= fitAspect) return fov;
    const t = Math.tan(THREE.MathUtils.degToRad(fov) / 2) * (fitAspect / aspect);
    return Math.min(maxFov, THREE.MathUtils.radToDeg(2 * Math.atan(t)));
  }
  const current = { p: 0, u: 0, state: {}, target: new THREE.Vector3() };
  const lens = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const pos = new THREE.Vector3();
  const tgt = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  let time = 0;

  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function layout(resolveAt = lastResolve) {
    lastResolve = resolveAt;
    const portrait = (camera.aspect || 1) < 1;
    laidOutPortrait = portrait;
    frames = keyframes
      .map((k) => {
        const shot = portrait && k.portrait ? { ...k, ...k.portrait } : k;
        return {
          ...shot,
          p: typeof k.at === 'number' ? k.at : resolveAt(k.at, k.align ?? 0.5),
          pos: new THREE.Vector3(...shot.pos),
          target: new THREE.Vector3(...shot.target),
          fov: shot.fov ?? camera.fov,
          shift: shot.shift ?? [0, 0],
          exactFov: Boolean(portrait && k.portrait?.fov),
          hold: k.hold ?? 0,
        };
      })
      .sort((a, b) => a.p - b.p);
    for (const f of frames) {
      f.start = clamp01(f.p - f.hold / 2);
      f.end = clamp01(f.p + f.hold / 2);
    }
    posCurve = new THREE.CatmullRomCurve3(frames.map((f) => f.pos), false, 'centripetal');
    tgtCurve = new THREE.CatmullRomCurve3(frames.map((f) => f.target), false, 'centripetal');

    // One track per state key, containing only the shots that define it.
    tracks = {};
    frames.forEach((f, i) => {
      for (const [key, value] of Object.entries(f.state ?? {})) (tracks[key] ??= []).push({ i, value });
    });
  }

  function uAt(p) {
    const n = frames.length;
    if (n < 2 || p <= frames[0].end) return 0;
    for (let i = 0; i < n - 1; i++) {
      const a = frames[i];
      const b = frames[i + 1];
      if (p < b.start) {
        const t = clamp01((p - a.end) / Math.max(1e-6, b.start - a.end));
        return i + (EASE[a.ease] ?? EASE.inOut)(t);
      }
      if (p <= b.end) return i + 1;
    }
    return n - 1;
  }

  function stateAt(u) {
    const out = {};
    for (const [key, track] of Object.entries(tracks)) {
      if (u <= track[0].i) { out[key] = track[0].value; continue; }
      const lastKey = track[track.length - 1];
      if (u >= lastKey.i) { out[key] = lastKey.value; continue; }
      for (let j = 0; j < track.length - 1; j++) {
        const a = track[j];
        const b = track[j + 1];
        if (u >= a.i && u <= b.i) { out[key] = lerp(a.value, b.value, (u - a.i) / (b.i - a.i)); break; }
      }
    }
    return out;
  }

  function update(dt, targetProgress, { snap = false } = {}) {
    if (!frames.length) return current;
    if (((camera.aspect || 1) < 1) !== laidOutPortrait) layout(); // rotated or resized across portrait/landscape
    time += dt;
    const k = snap || reducedMotion ? 1 : 1 - Math.exp(-damping * dt);
    current.p += (targetProgress - current.p) * k;
    if (Math.abs(targetProgress - current.p) < 1e-5) current.p = targetProgress;

    const n = frames.length;
    const u = uAt(current.p);
    current.u = u;
    const cu = n > 1 ? u / (n - 1) : 0;
    posCurve.getPoint(cu, pos);
    tgtCurve.getPoint(cu, tgt);

    const i = Math.min(Math.floor(u), Math.max(0, n - 2));
    const fovOf = (f) => fitted(f.fov, f.exactFov);
    const fov = n > 1 ? lerp(fovOf(frames[i]), fovOf(frames[i + 1]), u - i) : fovOf(frames[0]);

    if (!reducedMotion && !snap) {
      const s = 1 - Math.exp(-3 * dt);
      pointer.sx += (pointer.x - pointer.sx) * s;
      pointer.sy += (pointer.y - pointer.sy) * s;
      fwd.subVectors(tgt, pos);
      const dist = fwd.length();
      fwd.normalize();
      right.crossVectors(fwd, camera.up).normalize();
      up.crossVectors(right, fwd).normalize();
      const amp = dist * parallax;
      pos.addScaledVector(right, pointer.sx * amp).addScaledVector(up, -pointer.sy * amp * 0.6);
      const sw = dist * sway;
      pos.addScaledVector(right, Math.sin(time * 0.37) * sw).addScaledVector(up, Math.sin(time * 0.53 + 1.3) * sw);
    }

    camera.position.copy(pos);
    camera.lookAt(tgt);
    current.target.copy(tgt);
    const t = n > 1 ? u - i : 0;
    const a = frames[i];
    const b = frames[Math.min(i + 1, n - 1)];
    const sx = lerp(a.shift[0], b.shift[0], t);
    const sy = lerp(a.shift[1], b.shift[1], t);
    const shiftChanged = Math.abs(sx - lens.x) > 1e-5 || Math.abs(sy - lens.y) > 1e-5;
    if (Math.abs(camera.fov - fov) > 1e-3 || shiftChanged) {
      camera.fov = fov;
      lens.x = sx;
      lens.y = sy;
      // A view window in normalised units (keeps camera.aspect; setViewOffset would overwrite it).
      camera.view = { enabled: sx !== 0 || sy !== 0, fullWidth: 1, fullHeight: 1, offsetX: -sx, offsetY: sy, width: 1, height: 1 };
      camera.updateProjectionMatrix();
    }
    current.state = stateAt(u);
    return current;
  }

  function resetPointer() {
    pointer.x = pointer.y = pointer.sx = pointer.sy = 0;
  }

  return {
    layout,
    update,
    resetPointer,
    current,
    get frames() { return frames; },
  };
}
