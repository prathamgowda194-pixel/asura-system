/**
 * Device tier detection.
 * Decides render budgets: pixel ratio, MSAA, shadow map size, AO, bloom, density of instanced detail.
 *
 * Force a tier for testing:  ?tier=low | ?tier=mid | ?tier=high
 */
export const TIERS = {
  high: { name: 'high', maxDpr: 2, minDpr: 1, msaa: 4, shadows: true, shadowMapSize: 2048, ao: true, bloom: true, density: 1 },
  mid: { name: 'mid', maxDpr: 1.5, minDpr: 1, msaa: 2, shadows: true, shadowMapSize: 1024, ao: false, bloom: true, density: 0.6 },
  low: { name: 'low', maxDpr: 1, minDpr: 0.75, msaa: 0, shadows: true, shadowMapSize: 1024, ao: false, bloom: false, density: 0.35 },
};

export function detectTier(gl) {
  const gpu = gpuName(gl);
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced && TIERS[forced]) return { ...TIERS[forced], gpu, forced: true };

  const coarse = matchMedia('(pointer: coarse)').matches;
  const memory = navigator.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu);
  const smallScreen = Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1) < 1600;

  let name = 'high';
  if (coarse || memory <= 4 || cores <= 4) name = 'mid';
  if (software || memory <= 2 || (coarse && smallScreen)) name = 'low';

  return { ...TIERS[name], gpu, coarse, software };
}

function gpuName(gl) {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  } catch {
    return 'unknown';
  }
}
