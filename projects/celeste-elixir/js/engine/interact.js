/**
 * Direct manipulation of the 3D stage.
 *
 * The canvas sits behind the document (chapters cover it), so these helpers listen on window and
 * ignore events that start on links, buttons, form fields and copy. Every direct manipulation needs
 * a DOM equivalent too (button, <input type="range">) for keyboard and screen-reader users.
 *
 *   const picker = createPicker(engine, {
 *     targets: [unitA, unitB],                 // objects or groups; hits resolve to the target that contains them
 *     onHover: (target, hit) => {},            // target is null when the pointer leaves
 *     onSelect: (target, hit) => {},           // click / tap without dragging
 *   });
 *   picker.update();                           // every frame, after the camera moved
 *
 *   const drag = createDrag({
 *     area: document.querySelector('#ch-3'),   // drags only start inside this element (default: window)
 *     axis: 'x',                               // 'x' keeps vertical touch scrolling working; 'free' for mouse-only areas
 *     onDrag: (dx, dy) => { yaw += dx * 0.005; },
 *     onEnd: (vx, vy) => { spin = vx; },       // px per second, for inertia
 *   });
 */
import * as THREE from 'three';

const IGNORE = 'a, button, input, select, textarea, label, summary, [role="button"], [contenteditable], .copy, [data-no-stage]';

function ignored(target) {
  return target instanceof Element && Boolean(target.closest(IGNORE));
}

export function createPicker(engine, { targets = [], onHover, onSelect, cursor = 'pointer' } = {}) {
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(2, 2); // off-screen until the pointer moves
  const down = { x: 0, y: 0, t: 0 };
  let hovered = null;
  let dirty = false;
  let enabled = true;

  const owner = (object) => {
    for (let o = object; o; o = o.parent) if (targets.includes(o)) return o;
    return null;
  };

  function cast() {
    raycaster.setFromCamera(ndc, engine.camera);
    const hit = raycaster.intersectObjects(targets, true).find((h) => h.object.visible);
    return hit ? { target: owner(hit.object), hit } : { target: null, hit: null };
  }

  function setNdc(e) {
    const r = engine.renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return; // no hover on touch
    if (ignored(e.target)) { ndc.set(2, 2); } else setNdc(e);
    dirty = true;
  }, { passive: true });
  window.addEventListener('pointerdown', (e) => { down.x = e.clientX; down.y = e.clientY; down.t = performance.now(); }, { passive: true });
  window.addEventListener('pointerup', (e) => {
    if (!enabled || !onSelect || ignored(e.target)) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.t > 600) return; // that was a drag
    setNdc(e);
    const { target, hit } = cast();
    if (target) onSelect(target, hit);
  });

  function update() {
    if (!enabled || !dirty) return hovered;
    dirty = false;
    const { target, hit } = cast();
    if (target !== hovered) {
      hovered = target;
      document.documentElement.style.cursor = target ? cursor : '';
      onHover?.(target, hit);
    }
    return hovered;
  }

  return {
    update,
    get hovered() { return hovered; },
    setTargets(list) { targets = list; dirty = true; },
    setEnabled(v) { enabled = v; if (!v) { hovered = null; document.documentElement.style.cursor = ''; } },
    markDirty() { dirty = true; }, // call after the camera moves so hover follows the scene, not just the mouse
  };
}

export function createDrag({ area = null, axis = 'x', onStart, onDrag, onEnd, threshold = 6 } = {}) {
  const s = { active: false, locked: false, id: null, x: 0, y: 0, lastT: 0, vx: 0, vy: 0 };
  if (area && axis === 'x') area.style.touchAction = 'pan-y'; // the browser keeps vertical scrolling

  function inArea(e) {
    if (ignored(e.target)) return false;
    return !area || area.contains(e.target) || hitArea(e);
  }
  function hitArea(e) {
    const r = area.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  window.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || !inArea(e)) return;
    Object.assign(s, { active: false, locked: false, id: e.pointerId, x: e.clientX, y: e.clientY, lastT: performance.now(), vx: 0, vy: 0, startX: e.clientX, startY: e.clientY });
  });

  window.addEventListener('pointermove', (e) => {
    if (s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.locked) {
      const tx = e.clientX - s.startX;
      const ty = e.clientY - s.startY;
      if (Math.hypot(tx, ty) < threshold) return;
      s.locked = true;
      s.active = axis === 'free' || Math.abs(tx) > Math.abs(ty); // vertical intent = scrolling, not dragging
      if (!s.active) { s.id = null; return; }
      document.documentElement.classList.add('is-dragging');
      onStart?.();
    }
    if (!s.active) return;
    const now = performance.now();
    const dt = Math.max(1, now - s.lastT) / 1000;
    s.vx = s.vx * 0.6 + (dx / dt) * 0.4;
    s.vy = s.vy * 0.6 + (dy / dt) * 0.4;
    s.x = e.clientX;
    s.y = e.clientY;
    s.lastT = now;
    onDrag?.(dx, axis === 'x' ? 0 : dy, e);
  }, { passive: true });

  const end = (e) => {
    if (s.id !== e.pointerId) return;
    if (s.active) {
      document.documentElement.classList.remove('is-dragging');
      const idle = performance.now() - s.lastT > 80; // released after holding still: no fling
      onEnd?.(idle ? 0 : s.vx, idle ? 0 : s.vy);
    }
    s.active = false;
    s.id = null;
  };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);

  return { get dragging() { return s.active; } };
}
