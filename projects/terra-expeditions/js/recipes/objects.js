/**
 * Objects from code: turned forms, extruded outlines, tubes and text in the site's own font.
 * Model the real object from its real proportions (look up the dimensions during research).
 *
 *   lathe({ profile, segments, smooth })   bottles, jars, cups, vases, lamps, columns, wheels.
 *       profile: [[radius, y], ...] bottom to top. Start/end at radius 0 to close the form.
 *       A vessel with a wall: trace the outside up, across the rim, then the inside down.
 *   extrude({ svg | points, holes, depth, bevel, scale })   logos, plans, signage, cut sheet material
 *       svg: the `d` attribute of an SVG path (SVG y-down is flipped for you)
 *   tube({ points, radius, closed })        handles, wires, rails, hoses, script lines
 *   textTexture({ text, font, color })     canvas texture set in a loaded web font (await it)
 *   textPlane({ text, font, color, height }) a flat mesh with that texture (labels, signage, plaques)
 *   label({ object profile radius, from, to, texture })  a sleeve label for a lathe object
 *
 * Boxy things (packaging, books, devices): block() from architecture.js has bevelled edges and metric UVs.
 */
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

/** Turned form from a [radius, y] profile. smooth > 0 resamples the profile as a curve (soft shoulders). */
export function lathe({ profile, segments = 96, smooth = 0, phiStart = 0, phiLength = Math.PI * 2 }) {
  let pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y));
  if (smooth > 0 && pts.length > 2) {
    const curve = new THREE.SplineCurve(pts);
    pts = curve.getSpacedPoints(Math.max(pts.length * smooth, 8)).map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
  }
  const g = new THREE.LatheGeometry(pts, segments, phiStart, phiLength);
  g.computeVertexNormals();
  return g;
}

/** Extruded shape from SVG path data or [x, y] points. Centred on x/y; front face at z = +depth/2. */
export function extrude({ svg = null, points = null, holes = [], depth = 0.05, bevel = 0.004, bevelSegments = 3, curveSegments = 24, scale = 1, center = true }) {
  let shapes = [];
  if (svg) {
    const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${svg.replace(/"/g, "'")}"/></svg>`);
    shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  } else if (points) {
    const s = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
    for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
    shapes = [s];
  }
  if (!shapes.length) throw new Error('extrude: pass svg path data or points');
  const units = svg ? depth / scale : depth; // depth is in scene units
  const g = new THREE.ExtrudeGeometry(shapes, {
    depth: units,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel / (svg ? scale : 1),
    bevelSize: bevel / (svg ? scale : 1),
    bevelSegments,
    curveSegments,
  });
  // SVG is y-down. Rotating 180° about x flips y without mirroring (mirroring would turn faces inside out).
  if (svg) g.scale(scale, -scale, -scale);
  else if (scale !== 1) g.scale(scale, scale, scale);
  if (center) g.center();
  g.computeVertexNormals();
  return g;
}

export function tube({ points, radius = 0.01, closed = false, tubularSegments = 128, radialSegments = 12 }) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), closed, 'centripetal');
  return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
}

/**
 * Text drawn into a canvas with a web font the page has loaded (so 3D labels match the site's type).
 * font: CSS shorthand, e.g. '500 140px "Your Display Face"'. Returns { texture, aspect }.
 */
export async function textTexture({ text, font = '400 120px serif', color = '#1c1c1c', background = null, padding = 0.25, letterSpacing = 0, align = 'center' }) {
  if (document.fonts?.load) await document.fonts.load(font, text).catch(() => {});
  const lines = String(text).split('\n');
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = font;
  if ('letterSpacing' in probe) probe.letterSpacing = `${letterSpacing}px`;
  const px = Number(/(\d+(?:\.\d+)?)px/.exec(font)?.[1] ?? 120);
  const lineH = px * 1.15;
  const w = Math.ceil(Math.max(...lines.map((l) => probe.measureText(l).width)) + px * padding * 2);
  const h = Math.ceil(lineH * lines.length + px * padding * 2);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, w, h); }
  ctx.font = font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = align;
  const x = align === 'left' ? px * padding : align === 'right' ? w - px * padding : w / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, px * padding + lineH * (i + 0.5)));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return { texture, aspect: w / h, canvas };
}

/** Flat text mesh `height` units tall. lit: true reacts to light (signage); false stays flat (overlays). */
export async function textPlane({ height = 0.2, lit = true, roughness = 0.7, ...opts }) {
  const { texture, aspect } = await textTexture(opts);
  const material = lit
    ? new THREE.MeshStandardMaterial({ map: texture, transparent: true, roughness, metalness: 0, alphaTest: 0.02 })
    : new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), material);
  mesh.name = 'text';
  return mesh;
}

/**
 * Sleeve label around a lathe object: an open cylinder band just outside the surface, between
 * heights `from` and `to`, with a texture (e.g. from textTexture or a canvas you drew). Wraps `arc`
 * radians (default: a third of the way round, like a front label).
 */
export function label({ radius, from, to, texture, arc = Math.PI * 0.66, offset = 0.0006, roughness = 0.55, front = 0 }) {
  const g = new THREE.CylinderGeometry(radius + offset, radius + offset, to - from, 64, 1, true, front - arc / 2 + Math.PI / 2, arc);
  g.translate(0, (from + to) / 2, 0);
  const m = new THREE.MeshPhysicalMaterial({ map: texture, transparent: true, roughness, metalness: 0, alphaTest: 0.02, clearcoat: 0.2 });
  const mesh = new THREE.Mesh(g, m);
  mesh.name = 'label';
  return mesh;
}
