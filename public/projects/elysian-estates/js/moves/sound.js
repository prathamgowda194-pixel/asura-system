/**
 * Ambient sound made in code with the Web Audio API: wind, sea, room tone, machine hum, rain.
 * Off by default; the visitor turns it on with a real button (browsers block autoplay anyway).
 *
 *   <button class="sound-toggle" type="button" aria-pressed="false">Sound</button>
 *   const sound = createAmbience({ kind: 'sea', button: document.querySelector('.sound-toggle') });
 *   sound.set({ brightness: 0.4 });   // 0..1, e.g. from scroll or scene state: muffled -> open
 *
 * kinds: wind | sea | room | hum | rain. Volume stays low (default 0.18): sound supports the
 * picture, it does not announce itself. The setting is remembered for the session.
 * User-supplied audio files: pass { src: 'audio/ambience.mp3' } to loop a file instead.
 */
const PRESETS = {
  wind: { noise: 'pink', filter: 'bandpass', freq: 520, q: 0.6, lfo: 0.07, lfoDepth: 380, gain: 0.9 },
  sea: { noise: 'brown', filter: 'lowpass', freq: 900, q: 0.3, lfo: 0.09, lfoDepth: 650, swell: 0.11, gain: 1 },
  room: { noise: 'brown', filter: 'lowpass', freq: 260, q: 0.2, lfo: 0.03, lfoDepth: 60, gain: 0.7 },
  hum: { noise: 'brown', filter: 'lowpass', freq: 180, q: 0.4, lfo: 0.05, lfoDepth: 40, tones: [55, 110.4, 165.2], gain: 0.6 },
  rain: { noise: 'white', filter: 'highpass', freq: 2600, q: 0.3, lfo: 0.13, lfoDepth: 900, gain: 0.35 },
};

function noiseBuffer(ctx, type) {
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'white') d[i] = w * 0.5;
      else if (type === 'pink') { b0 = 0.997 * b0 + w * 0.029591; b1 = 0.985 * b1 + w * 0.032534; b2 = 0.95 * b2 + w * 0.048056; d[i] = (b0 + b1 + b2 + w * 0.05) * 1.6; }
      else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    }
  }
  return buf;
}

export function createAmbience({ kind = 'wind', volume = 0.18, button = null, src = null, fade = 1.6 } = {}) {
  const preset = PRESETS[kind] ?? PRESETS.wind;
  let ctx = null;
  let master = null;
  let filter = null;
  let audioEl = null;
  const store = { get: () => { try { return sessionStorage.getItem('asura-sound'); } catch { return null; } }, set: (v) => { try { sessionStorage.setItem('asura-sound', v); } catch { /* private mode */ } } };
  let on = store.get() === 'on';
  let brightness = 0.5;

  function build() {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    if (src) {
      audioEl = new Audio(src);
      audioEl.loop = true;
      audioEl.crossOrigin = 'anonymous';
      ctx.createMediaElementSource(audioEl).connect(master);
      return;
    }
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(ctx, preset.noise);
    source.loop = true;
    filter = ctx.createBiquadFilter();
    filter.type = preset.filter;
    filter.frequency.value = preset.freq;
    filter.Q.value = preset.q;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = preset.lfo;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = preset.lfoDepth;
    lfo.connect(lfoGain).connect(filter.frequency);
    const body = ctx.createGain();
    body.gain.value = preset.gain;
    source.connect(filter).connect(body).connect(master);
    if (preset.swell) {
      // Waves: slow amplitude swell on top of the noise bed.
      const swell = ctx.createOscillator();
      swell.frequency.value = preset.swell;
      const depth = ctx.createGain();
      depth.gain.value = 0.45;
      swell.connect(depth).connect(body.gain);
      swell.start();
    }
    for (const f of preset.tones ?? []) {
      const o = ctx.createOscillator();
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      o.connect(g).connect(master);
      o.start();
    }
    source.start();
    lfo.start();
  }

  function render() {
    if (!button) return;
    button.setAttribute('aria-pressed', String(on));
    button.classList.toggle('is-on', on);
  }

  async function setOn(value) {
    on = value;
    store.set(on ? 'on' : 'off');
    render();
    if (on && !ctx) build();
    if (!ctx) return;
    if (on) { await ctx.resume(); audioEl?.play().catch(() => {}); }
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(on ? volume : 0, now + fade);
    if (!on && audioEl) setTimeout(() => { if (!on) audioEl.pause(); }, fade * 1000);
  }

  // Browsers only start audio from a user gesture: remembered "on" waits for the first click or key.
  if (on) {
    on = false;
    const resume = () => { setOn(true); window.removeEventListener('pointerdown', resume); window.removeEventListener('keydown', resume); };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }
  button?.addEventListener('click', () => setOn(!on));
  render();

  return {
    get on() { return on; },
    toggle: () => setOn(!on),
    /** brightness 0..1 opens the filter (muffled -> clear); volume 0..1 scales the bed. */
    set({ brightness: b, volume: v } = {}) {
      if (b !== undefined) brightness = b;
      if (v !== undefined) volume = v;
      if (!ctx) return;
      if (filter) filter.frequency.setTargetAtTime(preset.freq * (0.35 + brightness * 1.3), ctx.currentTime, 0.3);
      if (on) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.4);
    },
  };
}
