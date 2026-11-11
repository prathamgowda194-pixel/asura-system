/**
 * Architecture kit. Parts, not buildings: compose them into the building your concept needs.
 * Units are metres. Every part is positioned by its BOTTOM-CENTRE (`at: [x, y, z]`), like a plan.
 *
 *   block({ w, h, d, r, material, at, rotY })              bevelled box (slabs, walls, volumes)
 *   deck({ w, d, h, hole, material, at })                  slab with a rectangular opening (pools, courtyards, voids)
 *   glazing({ w, h, glass, frame, spacing, at, rotY })     glass wall with instanced mullions
 *   fins({ count, spacing, w, h, d, material, at, rotY })  vertical louvres / brise-soleil
 *   stairs({ steps, rise, run, width, material, at, rotY })
 *   pool({ w, d, depth, water, tile, at })                 basin + water surface (pair with deck)
 *   panel({ w, h, material, at, rotY })                    flat plane, e.g. an emissive interior wall
 *   addEdges(root, { color, opacity })                     ink outlines for drawing / blueprint looks
 *
 * Bevels matter: a 2-3 cm edge radius catches light and removes the "CG box" look.
 * Repeated elements must be instanced (mullions, fins, steps). Keep total draw calls < 300.
 * block() and deck() have UVs in metres (metricUVs), so give their materials surface(kind, { tile }).
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const geoCache = new Map();
const unitBox = new THREE.BoxGeometry(1, 1, 1);
const dummy = new THREE.Object3D();

/**
 * Box-projected UVs in metres: every face gets the same texel density whatever its size.
 * Without this a 0.7 m wall end shows the same number of texture repeats as a 38 m facade.
 * Pair with surface(kind, { tile }) where tile = metres per texture repeat.
 */
export function metricUVs(geometry) {
  const pos = geometry.attributes.position;
  const nrm = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const ax = Math.abs(nrm.getX(i));
    const ay = Math.abs(nrm.getY(i));
    const az = Math.abs(nrm.getZ(i));
    if (ax >= ay && ax >= az) uv.setXY(i, pos.getZ(i), pos.getY(i));
    else if (ay >= az) uv.setXY(i, pos.getX(i), pos.getZ(i));
    else uv.setXY(i, pos.getX(i), pos.getY(i));
  }
  uv.needsUpdate = true;
  return geometry;
}

function boxGeometry(w, h, d, r) {
  const key = `${w}|${h}|${d}|${r}`;
  if (!geoCache.has(key)) {
    const rr = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
    const g = rr > 0.001 ? new RoundedBoxGeometry(w, h, d, 2, rr) : new THREE.BoxGeometry(w, h, d);
    geoCache.set(key, metricUVs(g));
  }
  return geoCache.get(key);
}

function place(obj, at = [0, 0, 0], rotY = 0) {
  obj.position.set(at[0], at[1], at[2]);
  obj.rotation.y = rotY;
  return obj;
}

export function block({ w, h, d, r = 0.025, material, at = [0, 0, 0], rotY = 0, cast = true, receive = true, name = 'block' }) {
  const mesh = new THREE.Mesh(boxGeometry(w, h, d, r), material);
  mesh.position.set(at[0], at[1] + h / 2, at[2]);
  mesh.rotation.y = rotY;
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  mesh.name = name;
  mesh.userData.box = [w, h, d];
  return mesh;
}

/** Slab with an opening. hole: { x, z, w, d } relative to the slab centre. */
export function deck({ w, d, h = 0.4, hole, material, at = [0, 0, 0], r = 0.02, name = 'deck' }) {
  const group = place(new THREE.Group(), at);
  group.name = name;
  if (!hole) {
    group.add(block({ w, h, d, r, material, at: [0, 0, 0] }));
    return group;
  }
  const x0 = -w / 2;
  const x1 = w / 2;
  const z0 = -d / 2;
  const z1 = d / 2;
  const hx0 = hole.x - hole.w / 2;
  const hx1 = hole.x + hole.w / 2;
  const hz0 = hole.z - hole.d / 2;
  const hz1 = hole.z + hole.d / 2;
  const parts = [
    [x0, z0, x1, hz0], // back strip (full width)
    [x0, hz1, x1, z1], // front strip (full width)
    [x0, hz0, hx0, hz1], // left of hole
    [hx1, hz0, x1, hz1], // right of hole
  ];
  for (const [ax, az, bx, bz] of parts) {
    const pw = bx - ax;
    const pd = bz - az;
    if (pw > 0.01 && pd > 0.01) group.add(block({ w: pw, h, d: pd, r, material, at: [(ax + bx) / 2, 0, (az + bz) / 2] }));
  }
  return group;
}

export function glazing({ w, h, glass, frame, spacing = 1.5, mullion = 0.05, depth = 0.08, transom = null, at = [0, 0, 0], rotY = 0, name = 'glazing' }) {
  const group = place(new THREE.Group(), at, rotY);
  group.name = name;
  const pane = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), glass);
  pane.position.y = h / 2;
  pane.castShadow = false;
  pane.receiveShadow = true;
  pane.name = 'glass';
  group.add(pane);

  const verticals = Math.max(2, Math.round(w / spacing) + 1);
  const count = verticals + 2 + (transom !== null ? 1 : 0);
  const bars = new THREE.InstancedMesh(unitBox, frame, count);
  let k = 0;
  for (let i = 0; i < verticals; i++) {
    dummy.position.set(-w / 2 + (i * w) / (verticals - 1), h / 2, 0);
    dummy.scale.set(mullion, h, depth);
    dummy.updateMatrix();
    bars.setMatrixAt(k++, dummy.matrix);
  }
  for (const y of [mullion / 2, h - mullion / 2, ...(transom !== null ? [transom] : [])]) {
    dummy.position.set(0, y, 0);
    dummy.scale.set(w, mullion, depth);
    dummy.updateMatrix();
    bars.setMatrixAt(k++, dummy.matrix);
  }
  bars.castShadow = true;
  bars.receiveShadow = true;
  bars.name = 'mullions';
  group.add(bars);
  return group;
}

export function fins({ count = 12, spacing = 0.6, w = 0.06, h = 3, d = 0.35, material, at = [0, 0, 0], rotY = 0, twist = 0, name = 'fins' }) {
  const mesh = new THREE.InstancedMesh(unitBox, material, count);
  const span = (count - 1) * spacing;
  for (let i = 0; i < count; i++) {
    dummy.position.set(-span / 2 + i * spacing, h / 2, 0);
    dummy.rotation.set(0, twist * (i / Math.max(1, count - 1) - 0.5), 0);
    dummy.scale.set(w, h, d);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = name;
  return place(mesh, at, rotY);
}

export function stairs({ steps = 8, rise = 0.17, run = 0.3, width = 1.2, material, at = [0, 0, 0], rotY = 0, name = 'stairs' }) {
  const mesh = new THREE.InstancedMesh(unitBox, material, steps);
  for (let i = 0; i < steps; i++) {
    dummy.position.set(0, i * rise + rise / 2, i * run);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(width, rise, run);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = name;
  return place(mesh, at, rotY);
}

/** Pool basin below `at` (top of water at at.y - freeboard). Pass a createWater() result as `water`. */
export function pool({ w, d, depth = 1.4, freeboard = 0.08, water, tile, at = [0, 0, 0], name = 'pool' }) {
  const group = place(new THREE.Group(), at);
  group.name = name;
  const t = 0.05;
  const walls = [
    [w, depth, t, 0, -depth / 2, -d / 2],
    [w, depth, t, 0, -depth / 2, d / 2],
    [t, depth, d, -w / 2, -depth / 2, 0],
    [t, depth, d, w / 2, -depth / 2, 0],
    [w, t, d, 0, -depth, 0],
  ];
  for (const [bw, bh, bd, x, y, z] of walls) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), tile);
    m.position.set(x, y, z);
    m.receiveShadow = true;
    group.add(m);
  }
  if (water) {
    water.mesh.scale.set(w / water.mesh.geometry.parameters.width, 1, d / water.mesh.geometry.parameters.height);
    water.mesh.position.set(0, -freeboard, 0);
    group.add(water.mesh);
  }
  return group;
}

export function panel({ w, h, material, at = [0, 0, 0], rotY = 0, name = 'panel' }) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.position.set(at[0], at[1] + h / 2, at[2]);
  mesh.rotation.y = rotY;
  mesh.name = name;
  return mesh;
}

/** Ink outlines on every non-instanced mesh under root. Returns { setOpacity(v) } for cross-fades. */
export function addEdges(root, { color = '#1c1c1c', opacity = 1, threshold = 30 } = {}) {
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const meshes = [];
  root.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && o.name !== 'glass' && o.name !== 'water') meshes.push(o); });
  const lines = meshes.map((mesh) => {
    const src = mesh.userData.box ? new THREE.BoxGeometry(...mesh.userData.box) : mesh.geometry;
    const line = new THREE.LineSegments(new THREE.EdgesGeometry(src, threshold), material);
    line.name = 'edges';
    line.raycast = () => {};
    mesh.add(line);
    return line;
  });
  return {
    material,
    lines,
    setOpacity(v) {
      material.opacity = v;
      material.visible = v > 0.001;
    },
  };
}

export function shadows(root, cast = true, receive = true) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });
  return root;
}
