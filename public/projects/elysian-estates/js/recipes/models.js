/**
 * glTF / GLB models, for when the user supplies one (a product scan, a CAD export, an artist's model).
 * Everything else in Asura is built in code; never download random models from the web.
 *
 *   const model = await loadModel(engine, 'models/jar.glb', { fit: 0.12 });   // largest side 12 cm
 *   scene.add(model.root);
 *   model.mixer?.update(dt);          // only if the file has animations (model.clips)
 *
 * Handles Draco and Meshopt geometry and KTX2 (Basis) textures, so compressed files load as they are.
 * Decoders come from the same three.js version as the importmap.
 *
 * Options
 *   fit      size in metres of the model's largest side (null keeps the file's own scale)
 *   ground   put the lowest point at y = 0 (default true); center: centre x/z on the origin (default true)
 *   shadows  cast and receive (default true); envIntensity: reflection strength on every material
 *   onProgress(0..1)
 *
 * Prepare files before shipping (smaller, faster): with Node
 *   npx @gltf-transform/cli@4.5.1 optimize in.glb out.glb --compress meshopt --texture-compress webp
 * KTX2 textures need the KTX-Software `toktx` tool on the machine: --texture-compress ktx2.
 * Then check: `npx @gltf-transform/cli@4.5.1 inspect out.glb` (triangles, texture sizes).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const FALLBACK_LIBS = `https://cdn.jsdelivr.net/npm/three@0.${THREE.REVISION}.0/examples/jsm/libs/`;
function libsPath() {
  try { return import.meta.resolve('three/addons/libs/'); } catch { return FALLBACK_LIBS; }
}

let shared = null;
function loaders(renderer) {
  if (shared) return shared;
  const libs = libsPath();
  const draco = new DRACOLoader().setDecoderPath(`${libs}draco/gltf/`);
  const ktx2 = new KTX2Loader().setTranscoderPath(`${libs}basis/`).detectSupport(renderer);
  const gltf = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
  shared = { gltf, draco, ktx2 };
  return shared;
}

export async function loadModel(engine, url, { fit = null, ground = true, center = true, shadows = true, envIntensity = null, onProgress } = {}) {
  const { gltf } = loaders(engine.renderer);
  const data = await gltf.loadAsync(url, (e) => { if (onProgress && e.total) onProgress(e.loaded / e.total); });
  const root = new THREE.Group();
  root.name = `model:${String(url).split('/').pop()}`;
  const scene = data.scene;
  root.add(scene);

  scene.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = shadows;
    o.receiveShadow = shadows;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (envIntensity !== null && 'envMapIntensity' in m) m.envMapIntensity = envIntensity;
      if (m.map) m.map.anisotropy = 8;
    }
  });

  // Normalise placement: scale to `fit`, then centre and ground in the new scale.
  scene.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  if (fit) {
    const s = fit / Math.max(size.x, size.y, size.z, 1e-6);
    scene.scale.multiplyScalar(s);
    scene.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(scene);
  }
  const c = box.getCenter(new THREE.Vector3());
  if (center) { scene.position.x -= c.x; scene.position.z -= c.z; }
  if (ground) scene.position.y -= box.min.y;
  scene.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(scene);

  const mixer = data.animations.length ? new THREE.AnimationMixer(scene) : null;
  return {
    root,
    scene,
    clips: data.animations,
    mixer,
    box,
    size: box.getSize(new THREE.Vector3()),
    /** Play a clip by name (or the first one). */
    play(name, { loop = THREE.LoopRepeat, timeScale = 1 } = {}) {
      if (!mixer) return null;
      const clip = name ? THREE.AnimationClip.findByName(data.animations, name) : data.animations[0];
      if (!clip) return null;
      const action = mixer.clipAction(clip);
      action.setLoop(loop, Infinity);
      action.timeScale = timeScale;
      return action.play();
    },
  };
}
