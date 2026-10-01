// pulse.js : animated heart-monitor trace (dying beats, then flatline) drawn on a canvas
const FIHPulse = (() => {
  let raf = null, running = false, hud = null, host = null;
  const g = (t, mu, s) => Math.exp(-0.5 * ((t - mu) / s) ** 2);
  const beat = t => 0.12 * g(t, 0.10, 0.04) - 0.14 * g(t, 0.195, 0.014) + 1.0 * g(t, 0.22, 0.016) - 0.28 * g(t, 0.25, 0.014) + 0.28 * g(t, 0.42, 0.06);

  function makeHud(parent) {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;inset:0;pointer-events:none;color:#39ff5a;font-size:.9em;text-shadow:0 0 .3em #39ff5a;z-index:2';
    d.innerHTML =
      '<span data-k="lead" style="position:absolute;left:.6em;top:.3em">LEAD II</span>' +
      '<span data-k="hr" style="position:absolute;right:.6em;top:.3em">HR --</span>' +
      '<span data-k="alarm" style="position:absolute;left:0;right:0;top:38%;text-align:center;font-size:1.6em;color:#ff3b3b;text-shadow:0 0 .4em #ff3b3b;display:none">ASYSTOLE</span>' +
      '<span data-k="spd" style="position:absolute;left:.6em;bottom:.3em;opacity:.7">25 mm/s</span>' +
      '<span data-k="spo" style="position:absolute;right:.6em;bottom:.3em;opacity:.7">SPO2 --</span>';
    parent.appendChild(d);
    return d;
  }

  function start(canvas, o = {}) {
    stop();
    const opt = Object.assign({
      beats: 3, intervals: [0.95, 1.3, 1.9], firstBeat: 0.5, sweep: 4.5,
      color: '#39ff5a', alarmAfter: 1.4, noise: 1.0, scale: 0.5
    }, o);
    const ctx = canvas.getContext('2d');
    host = canvas.parentElement; hud = makeHud(host);
    const q = k => hud.querySelector('[data-k="' + k + '"]');
    const times = []; let tt = opt.firstBeat;
    for (let i = 0; i < opt.beats; i++) { times.push(tt); tt += opt.intervals[Math.min(i, opt.intervals.length - 1)]; }
    const amp = i => Math.max(0.25, 1 - i * 0.3);
    const value = s => {
      let v = Math.sin(s * 1.3) * 0.015;
      for (let i = 0; i < times.length; i++) {
        const tau = s - times[i];
        if (tau > -0.1 && tau < 0.9) v += amp(i) * beat(tau);
      }
      return v;
    };
    const lastBeat = times.length ? times[times.length - 1] : 0;
    let W = 0, H = 0, x = 0, prevY = null, simT = 0, last = performance.now();
    let hrTxt = '', alarmOn = false;
    running = true;

    function frame(now) {
      if (!running) return;
      const w = Math.max(160, Math.floor(canvas.clientWidth * opt.scale));
      const h = Math.max(80, Math.floor(canvas.clientHeight * opt.scale));
      if (w !== W || h !== H) { W = canvas.width = w; H = canvas.height = h; x = 0; prevY = null; }
      const mid = H * 0.5, ampPx = H * 0.32;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const pxPerSec = W / opt.sweep, gap = Math.max(8, W * 0.04);
      ctx.lineWidth = Math.max(1.5, H / 90); ctx.lineJoin = 'round';
      ctx.strokeStyle = opt.color; ctx.shadowColor = opt.color; ctx.shadowBlur = 6;
      const steps = Math.max(1, Math.round(dt / 0.004)), sdt = dt / steps;
      for (let i = 0; i < steps; i++) {
        simT += sdt;
        const nx = x + pxPerSec * sdt;
        const y = mid - value(simT) * ampPx + (Math.random() - 0.5) * opt.noise;
        if (nx >= W) { x = 0; prevY = null; continue; }
        ctx.clearRect(nx, 0, gap, H);
        if (nx + gap > W) ctx.clearRect(0, 0, nx + gap - W, H);
        if (prevY !== null) { ctx.beginPath(); ctx.moveTo(x, prevY); ctx.lineTo(nx, y); ctx.stroke(); }
        x = nx; prevY = y;
      }
      let passed = 0; for (const t of times) if (t <= simT) passed++;
      let hr = '--';
      if (passed > 0) {
        const iv = opt.intervals[Math.min(passed - 1, opt.intervals.length - 1)];
        hr = simT > lastBeat + iv * 1.1 ? '---' : String(Math.round(60 / iv));
      }
      const al = simT > lastBeat + opt.alarmAfter && Math.floor(simT * 2) % 2 === 0;
      if (hr !== hrTxt) { hrTxt = hr; q('hr').textContent = 'HR ' + hr; q('hr').style.color = hr === '---' ? '#ff3b3b' : '#39ff5a'; }
      if (al !== alarmOn) { alarmOn = al; q('alarm').style.display = al ? 'block' : 'none'; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf); raf = null;
    if (hud && hud.parentElement) hud.parentElement.removeChild(hud);
    hud = null; host = null;
  }
  return { start, stop };
})();
