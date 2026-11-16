/**
 * Studio from code, for objects: products, sculptures, food, tools, instruments.
 * A cyclorama (floor curving up into a back wall), softbox reflections from an environment built in
 * code, and one shadow-casting key light aligned with the first softbox.
 *
 *   const studio = createStudio(engine, {
 *     background: '#d8d1c7',
 *     softboxes: [
 *       { pos: [-3, 4, 3], size: [2.5, 3.5], intensity: 8, color: '#fff4e8' },  // key: also casts the shadow
 *       { pos: [4, 2.5, 2], size: [1.5, 4], intensity: 2.5 },                    // fill
 *       { pos: [0, 3.5, -4], size: [6, 0.8], intensity: 5 },                      // rim strip behind the object
 *     ],
 *   });
 *   studio.setBackground('#2b2724');         // change the set colour (sweep, fog, ambient follow)
 *   studio.setSoftbox(0, { intensity: 3 });   // then the env map is rebuilt once
 *   studio.blend(stateA, stateB, t)           // animate a lighting change with scroll (see below)
 *   studio.update()                           // every frame: rebuilds the env map at most every 100 ms after a blend
 *
 * Why it works: glossy materials show the softboxes as long, soft-edged highlights, which is what
 * product photography is. Move a softbox and the highlight moves on every surface. Keep the key at
 * least 3x the fill. Units: metres, object near the origin, roughly 0.1 to 2 m tall.
 * Pair with createContactShadow() from terrain.js under the object.
 */
import * as THREE from 'three';

function sweepGeometry({ width, depth, height, radius, segments = 32 }) {
  // Profile (z, y): floor from +depth to 0, quarter circle up to the wall at z = -radius, wall to `height`.
  const profile = [[depth, 0], [0, 0]];
  for (let i = 1; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 0.5;
    profile.push([-Math.sin(a) * radius, radius - Math.cos(a) * radius]);
  }
  profile.push([-radius, height]);
  const pos = [];
  const uv = [];
  let run = 0;
  profile.forEach(([z, y], i) => {
    if (i > 0) run += Math.hypot(z - profile[i - 1][0], y - profile[i - 1][1]);
    pos.push(-width / 2, y, z, width / 2, y, z);
    uv.push(-width / 2, run, width / 2, run); // metres, like the architecture kit
  });
  const index = [];
  for (let i = 0; i < profile.length - 1; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

const DEFAULT_BOXES = [
  { pos: [-3, 4, 3], size: [2.5, 3.5], intensity: 8, color: '#fff4e8' },
  { pos: [4, 2.5, 2], size: [1.5, 4], intensity: 2.2, color: '#eef3ff' },
  { pos: [0, 3.5, -4], size: [6, 0.8], intensity: 5, color: '#ffffff' },
];

export function createStudio(engine, {
  background = '#d8d1c7',
  softboxes = DEFAULT_BOXES,
  ambient = 0.35,            // brightness of the room around the softboxes (fill from everywhere)
  keyIntensity = 2.4,        // direct light from the key, for the shadow and crisp form
  shadowSize = 2,            // half-size of the shadow camera in metres: just larger than the object
  shadowSoftness = 8,
  sweep = { width: 40, depth: 24, height: 16, radius: 5, z: -3 },
  fog = { near: 14, far: 40 },
  envIntensity = 1,
  regenInterval = 100,
} = {}) {
  const { scene, renderer, tier } = engine;
  const bg = new THREE.Color(background);

  // Set: the cyclorama the viewer sees.
  const setMat = new THREE.MeshStandardMaterial({ name: 'cyclorama', color: bg.clone(), roughness: 0.95, metalness: 0 });
  const cyclorama = new THREE.Mesh(sweepGeometry(sweep), setMat);
  cyclorama.position.z = sweep.z ?? -3;
  cyclorama.receiveShadow = true;
  cyclorama.name = 'cyclorama';
  scene.add(cyclorama);
  scene.background = bg.clone();
  if (fog) scene.fog = new THREE.Fog(bg.clone(), fog.near, fog.far);

  // Environment: what reflections show. Softboxes are emissive panels facing the object.
  const envScene = new THREE.Scene();
  const roomMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: bg.clone().multiplyScalar(ambient) });
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), roomMat));
  const floorMat = new THREE.MeshBasicMaterial({ color: bg.clone().multiplyScalar(ambient * 1.6), side: THREE.DoubleSide });
  const envFloor = new THREE.Mesh(new THREE.CircleGeometry(19, 48), floorMat);
  envFloor.rotation.x = -Math.PI / 2;
  envFloor.position.y = -0.01;
  envScene.add(envFloor);
  const boxes = softboxes.map((b) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    envScene.add(m);
    return { mesh: m, ...b };
  });
  function placeBox(b) {
    b.mesh.position.set(...b.pos);
    b.mesh.scale.set(b.size[0], b.size[1], 1);
    b.mesh.lookAt(0, 0.3, 0);
    b.mesh.material.color.set(b.color ?? '#ffffff').multiplyScalar(b.intensity ?? 4);
  }
  boxes.forEach(placeBox);

  // Key light: direct light and the shadow, from the first softbox.
  const key = new THREE.DirectionalLight(boxes[0]?.color ?? '#ffffff', keyIntensity);
  key.name = 'studio-key';
  key.castShadow = tier.shadows;
  key.shadow.mapSize.set(tier.shadowMapSize, tier.shadowMapSize);
  Object.assign(key.shadow.camera, { left: -shadowSize, right: shadowSize, top: shadowSize, bottom: -shadowSize, near: 0.1, far: 40 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = shadowSize * 0.004; // scale with the set: 2 cm of bias would float a cup
  key.shadow.radius = shadowSoftness;
  key.shadow.blurSamples = 16;
  scene.add(key, key.target);
  function placeKey() {
    if (!boxes[0]) return;
    key.position.set(...boxes[0].pos).normalize().multiplyScalar(12);
    key.color.set(boxes[0].color ?? '#ffffff');
  }
  placeKey();

  const pmrem = new THREE.PMREMGenerator(renderer);
  let rt = null;
  let dirty = false;
  let lastRegen = -Infinity;
  function regenerate() {
    const next = pmrem.fromScene(envScene, 0.02, 0.1, 50);
    scene.environment = next.texture;
    scene.environmentIntensity = envIntensity;
    rt?.dispose();
    rt = next;
    dirty = false;
    lastRegen = performance.now();
  }
  regenerate();

  function update({ force = false } = {}) {
    if (dirty && (force || performance.now() - lastRegen > regenInterval)) regenerate();
  }

  function setBackground(color) {
    bg.set(color);
    setMat.color.copy(bg);
    scene.background.copy(bg);
    scene.fog?.color.copy(bg);
    roomMat.color.copy(bg).multiplyScalar(ambient);
    floorMat.color.copy(bg).multiplyScalar(ambient * 1.6);
    regenerate();
  }

  function setSoftbox(i, patch) {
    Object.assign(boxes[i], patch);
    placeBox(boxes[i]);
    if (i === 0) placeKey();
    regenerate();
  }

  /**
   * Scroll-driven lighting: blend two looks { background, boxes: [{ intensity, color }], key } by t.
   * Rebuilding the env map costs a few ms, so blend() skips work when t has not changed.
   */
  let lastT = null;
  const ca = new THREE.Color();
  const cb = new THREE.Color();
  function blend(a, b, t) {
    t = Math.min(1, Math.max(0, t));
    if (lastT !== null && Math.abs(t - lastT) < 0.002) return;
    lastT = t;
    if (a.background && b.background) {
      bg.copy(ca.set(a.background)).lerp(cb.set(b.background), t);
      setMat.color.copy(bg);
      scene.background.copy(bg);
      scene.fog?.color.copy(bg);
      roomMat.color.copy(bg).multiplyScalar(ambient);
      floorMat.color.copy(bg).multiplyScalar(ambient * 1.6);
    }
    boxes.forEach((box, i) => {
      const x = a.boxes?.[i];
      const y = b.boxes?.[i];
      if (!x || !y) return;
      box.intensity = (x.intensity ?? box.intensity) + ((y.intensity ?? box.intensity) - (x.intensity ?? box.intensity)) * t;
      if (x.color && y.color) box.color = `#${ca.set(x.color).lerp(cb.set(y.color), t).getHexString()}`;
      placeBox(box);
    });
    if (a.key !== undefined && b.key !== undefined) key.intensity = a.key + (b.key - a.key) * t;
    placeKey();
    dirty = true; // rebuilt by update(), throttled
  }

  return { cyclorama, key, envScene, softboxes: boxes, setBackground, setSoftbox, blend, update, regenerate };
}
