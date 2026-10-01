// music.js : muffled + bitcrushed background music with spatial panning and VHS crossfade
const FIHMusic = (() => {
  const M = {
    ambient: 'assets/ambient.mp3',
    vhs: 'assets/VHS.mp3',          // exact case matters on GitHub Pages
    ambientGain: 0.30,              // main background volume (0 to 1)
    vhsGain: 0.14,                  // VHS track volume, kept low
    sideDim: 0.78,                  // volume multiplier in library and tape rooms (lower = quieter)
    sidePan: 0.65,                  // stereo shift in side rooms (0 = none, 1 = full ear)
    fade: 2.0,                      // seconds for the ambient <-> VHS crossfade
    glide: 0.9,                     // seconds for pan and volume moves between rooms
    vhsOnlyInTapeRoom: false,       // true = VHS music only while you are in the tape room
    ambientFx: { bits: 10, reduction: 3, lowpass: 3200, highpass: 60 },   // slightly muffled + crushed
    vhsFx:     { bits: 7,  reduction: 6, lowpass: 2600, highpass: 120 }   // heavier crush
  };

  const WORKLET = `
  class FihCrusher extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        { name: 'bits', defaultValue: 8, minValue: 1, maxValue: 16 },
        { name: 'reduction', defaultValue: 4, minValue: 1, maxValue: 64 }
      ];
    }
    constructor() { super(); this.held = [0, 0]; this.cnt = [0, 0]; }
    process(inputs, outputs, params) {
      const inp = inputs[0], out = outputs[0];
      if (!inp || !inp.length) return true;
      const bits = params.bits[0];
      const red = Math.max(1, Math.round(params.reduction[0]));
      const step = Math.pow(0.5, bits - 1);
      for (let c = 0; c < out.length; c++) {
        const i = inp[c] || inp[0], o = out[c];
        let cnt = this.cnt[c] || 0, held = this.held[c] || 0;
        for (let n = 0; n < o.length; n++) {
          if (cnt === 0) held = step * Math.floor(i[n] / step + 0.5);
          cnt = (cnt + 1) % red;
          o[n] = held;
        }
        this.cnt[c] = cnt; this.held[c] = held;
      }
      return true;
    }
  }
  registerProcessor('fih-crusher', FihCrusher);
  `;

  let ctx = null, started = false, crusherOK = false, enabled = true, wasVhs = false;
  let last = { view: 0, mounted: false };
  const tracks = {};

  function makeTrack(src, fx) {
    const el = new Audio(src);
    el.loop = true; el.preload = 'auto';
    const source = ctx.createMediaElementSource(el);
    let node = source;
    if (crusherOK) {
      const c = new AudioWorkletNode(ctx, 'fih-crusher', {
        numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2],
        channelCount: 2, channelCountMode: 'explicit',
        parameterData: { bits: fx.bits, reduction: fx.reduction }
      });
      node.connect(c); node = c;
    }
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = fx.lowpass; lp.Q.value = 0.7;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = fx.highpass; hp.Q.value = 0.7;
    const pan = ctx.createStereoPanner();
    const gain = ctx.createGain(); gain.gain.value = 0;
    node.connect(lp); lp.connect(hp); hp.connect(pan); pan.connect(gain); gain.connect(ctx.destination);
    return { el, pan, gain };
  }

  function ramp(param, value, seconds) {
    const t = ctx.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.setTargetAtTime(value, t, Math.max(0.02, seconds / 3));
  }

  function apply() {
    if (!ctx || !started || !tracks.ambient) return;
    const wantVhs = M.vhsOnlyInTapeRoom ? (last.mounted && last.view === 1) : last.mounted;
    const dim = last.view === 0 ? 1 : M.sideDim;
    const pan = -last.view * M.sidePan;          // library (-1) -> right ear, tape (+1) -> left ear
    if (wantVhs && !wasVhs) { try { tracks.vhs.el.currentTime = 0; } catch (e) {} }
    wasVhs = wantVhs;
    ramp(tracks.ambient.gain.gain, enabled && !wantVhs ? M.ambientGain * dim : 0, M.fade);
    ramp(tracks.vhs.gain.gain,     enabled && wantVhs  ? M.vhsGain * dim     : 0, M.fade);
    ramp(tracks.ambient.pan.pan, pan, M.glide);
    ramp(tracks.vhs.pan.pan, pan, M.glide);
  }

  async function start() {
    if (started) return;
    started = true;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    try {
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
      await ctx.audioWorklet.addModule(url);
      crusherOK = true;
    } catch (e) { crusherOK = false; console.warn('bitcrusher unavailable, using filters only'); }
    tracks.ambient = makeTrack(M.ambient, M.ambientFx);
    tracks.vhs = makeTrack(M.vhs, M.vhsFx);
    try { await ctx.resume(); } catch (e) {}
    tracks.ambient.el.play().catch(() => {});
    tracks.vhs.el.play().catch(() => {});
    apply();
  }

  function update(st) {
    if (st.view !== undefined) last.view = st.view;
    if (st.mounted !== undefined) last.mounted = st.mounted;
    if (st.enabled !== undefined) enabled = st.enabled;
    apply();
  }

  return { start, update };
})();
