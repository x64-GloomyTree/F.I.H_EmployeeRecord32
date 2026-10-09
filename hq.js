(() => {
'use strict';
const D = window.HQ_DATA, $ = s => document.querySelector(s);
const SET_KEY = 'fih_hq_settings_v1', HQ_KEY = 'fih_hq_layer2_v1';
const coarse = matchMedia('(pointer:coarse)').matches;

/* ---------- storage ---------- */
const load = (k, d) => { try { return Object.assign({}, d, JSON.parse(localStorage.getItem(k) || '{}')); } catch (e) { return { ...d }; } };
let ST = load(SET_KEY, {
  master: .8, bgm: .7, sfx: .7, mute: false, reduceFx: false,
  motion: matchMedia('(prefers-reduced-motion:reduce)').matches, flash: false,
  contrast: false, text: 1, scale: 1, mobile: coarse
});
let HQ = load(HQ_KEY, { introSeen: false, seen: {} });
const saveST = () => localStorage.setItem(SET_KEY, JSON.stringify(ST));
const saveHQ = () => localStorage.setItem(HQ_KEY, JSON.stringify(HQ));

/* ---------- helpers ---------- */
let skipFns = [], skipped = false;
const sleep = ms => new Promise(r => { const t = setTimeout(r, ms); skipFns.push(() => { clearTimeout(t); r(); }); });
const rand = (a, b) => a + Math.random() * (b - a);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

/* ---------- audio ---------- */
let ctx, busSfx, busMaster, ambientOn = false;
const music = { intro: null, bgm: null };
function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    busMaster = ctx.createGain(); busMaster.connect(ctx.destination);
    busSfx = ctx.createGain(); busSfx.connect(busMaster);
    applyAudio();
  } catch (e) { ctx = null; }
}
function applyAudio() {
  const m = ST.mute ? 0 : ST.master;
  if (busMaster) busMaster.gain.value = m;
  if (busSfx) busSfx.gain.value = ST.sfx;
  if (music.intro) music.intro.volume = Math.min(1, m * ST.bgm);
  if (music.bgm) music.bgm.volume = Math.min(1, m * ST.bgm * (music.bgm._k ?? 1));
}
function mkAudio(src, loop) { const a = new Audio(src); a.loop = !!loop; a.preload = 'auto'; return a; }
function fadeAudio(a, to, ms, done) {
  if (!a) return done && done();
  const from = a._k ?? 1, t0 = performance.now();
  (function step(t) {
    const p = Math.min(1, (t - t0) / ms);
    a._k = from + (to - from) * p; applyAudio();
    if (p < 1) requestAnimationFrame(step); else done && done();
  })(t0);
}
function noiseBuf(brown) {
  const n = ctx.sampleRate * 2, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
  let l = 0;
  for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; }
  return b;
}
function loopNoise(brown, type, freq, gain, lfoHz, lfoDepth) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf(brown); s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
  const g = ctx.createGain(); g.gain.value = gain;
  s.connect(f); f.connect(g); g.connect(busSfx); s.start();
  if (lfoHz) { const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = lfoHz; og.gain.value = lfoDepth; o.connect(og); og.connect(g.gain); o.start(); }
}
function hum(freq, gain) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = freq; g.gain.value = gain;
  o.connect(g); g.connect(busSfx); o.start();
}
function startAmbience() {
  if (!ctx || ambientOn) return; ambientOn = true;
  loopNoise(true, 'lowpass', 380, .055, .07, .012);
  loopNoise(false, 'bandpass', 1300, .0035, .11, .0015);
  loopNoise(true, 'lowpass', 160, .05, 0.5, .006);
  hum(60, .006); hum(120, .003); hum(47, .004);
  (function tick() {
    if (!ambientOn) return;
    if (ctx.state === 'running' && !document.hidden) { Math.random() < .55 ? keyClicks() : bubble(); }
    setTimeout(tick, rand(900, 3200));
  })();
}
function keyClicks() {
  const n = 2 + (Math.random() * 6 | 0);
  for (let i = 0; i < n; i++) setTimeout(() => {
    if (!ctx) return;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf(false);
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2200;
    const g = ctx.createGain(); g.gain.setValueAtTime(.02, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0005, ctx.currentTime + .03);
    s.connect(f); f.connect(g); g.connect(busSfx); s.start(); s.stop(ctx.currentTime + .04);
  }, i * rand(70, 190));
}
function bubble() {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
  o.frequency.setValueAtTime(rand(260, 420), t); o.frequency.exponentialRampToValueAtTime(rand(800, 1300), t + .07);
  g.gain.setValueAtTime(.018, t); g.gain.exponentialRampToValueAtTime(.0003, t + .09);
  o.connect(g); g.connect(busSfx); o.start(t); o.stop(t + .1);
}
function blip(freq = 520, dur = .03, vol = .03, type = 'triangle') {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
  o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0003, t + dur);
  o.connect(g); g.connect(busSfx); o.start(t); o.stop(t + dur + .02);
}
const sfx = {
  click: () => blip(700, .05, .04, 'sine'),
  open: () => { blip(500, .08, .04, 'sine'); setTimeout(() => blip(760, .1, .04, 'sine'), 70); },
  close: () => { blip(760, .06, .035, 'sine'); setTimeout(() => blip(500, .08, .035, 'sine'), 60); },
  type: () => blip(rand(430, 520), .025, .018),
  deny: () => { blip(180, .12, .05, 'square'); }
};

/* ---------- settings ---------- */
function applySettings() {
  const b = document.body.classList;
  b.toggle('nofx', ST.reduceFx); b.toggle('rm', ST.motion); b.toggle('rf', ST.flash);
  b.toggle('hc', ST.contrast); b.toggle('mob', ST.mobile);
  document.documentElement.style.setProperty('--ui', ST.scale);
  applyAudio(); checkOrientation();
}
const bind = [['master', 's_master'], ['bgm', 's_bgm'], ['sfx', 's_sfx'], ['text', 's_text'], ['scale', 's_scale']];
const bools = [['mute', 's_mute'], ['reduceFx', 's_fx'], ['motion', 's_motion'], ['flash', 's_flash'], ['contrast', 's_contrast'], ['mobile', 's_mobile']];
function initMenu() {
  bind.forEach(([k, id]) => {
    const i = $('#' + id), o = i.parentNode.querySelector('output');
    const show = () => { o.textContent = (k === 'text' || k === 'scale') ? '×' + (+ST[k]).toFixed(1) : Math.round(ST[k] * 100) + '%'; };
    i.value = ST[k]; show();
    i.addEventListener('input', () => { ST[k] = +i.value; show(); saveST(); applySettings(); });
    i.addEventListener('change', () => sfx.click());
  });
  bools.forEach(([k, id]) => {
    const i = $('#' + id); i.checked = !!ST[k];
    i.addEventListener('change', () => { ST[k] = i.checked; saveST(); applySettings(); sfx.click(); });
  });
  $('#gear').addEventListener('click', toggleMenu);
  $('#b_replay').addEventListener('click', () => { HQ.introSeen = false; saveHQ(); location.reload(); });
  $('#b_reset').addEventListener('click', () => {
    if (confirm('Reset HQ progress? (the first layer save is untouched)')) { localStorage.removeItem(HQ_KEY); location.reload(); }
  });
  document.addEventListener('pointerdown', e => { if (!$('#menu').hidden && !e.target.closest('#menu,#gear')) toggleMenu(false); });
}
function toggleMenu(force) {
  const m = $('#menu'), open = typeof force === 'boolean' ? force : m.hidden;
  m.hidden = !open; $('#gear').setAttribute('aria-expanded', open); open ? sfx.open() : sfx.close();
}
function checkOrientation() { $('#rot').hidden = !(ST.mobile && innerHeight > innerWidth); }
addEventListener('resize', checkOrientation);

/* ---------- typing ---------- */
async function typeInto(node, text, o = {}) {
  const base = o.base ?? 60, caret = el('i'); node.textContent = ''; node.appendChild(caret);
  const tn = document.createTextNode(''); node.insertBefore(tn, caret);
  for (let i = 0; i < text.length; i++) {
    if (o.cancel && o.cancel()) break;
    tn.nodeValue = text.slice(0, i + 1);
    const c = text[i]; if (o.sound && /\S/.test(c) && i % 2 === 0) sfx.type();
    let d = base / ST.text;
    if ('.!?'.includes(c)) d += 420 / ST.text; else if (c === ',') d += 220 / ST.text; else if (c === ':') d += 200 / ST.text;
    await sleep(d);
    if (skipped && o.skippable) break;
  }
  tn.nodeValue = text; if (!o.keepCaret) caret.remove();
}

/* ---------- intro ---------- */
async function runIntro() {
  $('#gate').classList.add('off'); setTimeout(() => $('#gate').hidden = true, 1000);
  $('#gear').hidden = false;
  const intro = $('#intro'); intro.hidden = false;
  music.intro = mkAudio(D.cfg.introMusic, false); music.intro._k = 0; applyAudio();
  music.intro.play().catch(() => {});
  fadeAudio(music.intro, 1, 2500);
  skipped = false;
  await sleep(2200);
  if (!skipped) for (const l of D.intro) {
    const n = $(l.who === 'a' ? '#qa' : '#qb'); n.classList.add('show');
    await typeInto(n, l.text, { base: 62, skippable: true, keepCaret: false });
    if (skipped) break;
    await sleep(l.who === 'a' ? 2600 : 3400);
    if (skipped) break;
  }
  finishIntro();
}
function skipIntro() {
  if (skipped || $('#intro').hidden) return;
  skipped = true; const f = skipFns; skipFns = []; f.forEach(fn => fn());
}
let finishing = false;
function finishIntro() {
  if (finishing) return; finishing = true;
  $('#intro').classList.add('out');
  fadeAudio(music.intro, 0, 1800, () => { music.intro && music.intro.pause(); });
  $('#skip').hidden = true;
  setTimeout(enterRoom, 1700);
}

/* ---------- room build ---------- */
const ART = {
  aquarium: () => {
    const cols = ['#ff9f43', '#ffd75a', '#ff6b81', '#8ee3ff', '#c3f584', '#fff'];
    let h = '<i class="aqlid"></i><div class="aq" style="position:absolute"><div class="water" style="position:absolute"><i class="caus"></i>';
    for (let i = 0; i < 7; i++) h += `<i class="fish" style="--t:${8 + i * 10}%;--s:${14 + i * 3.1}s;--d:-${i * 4.3}s;--c:${cols[i % cols.length]}"></i>`;
    for (let i = 0; i < 8; i++) h += `<i class="bub" style="--l:${8 + i * 11}%;--s:${5 + i % 4}s;--d:-${i * 1.3}s"></i>`;
    for (let i = 0; i < 5; i++) h += `<i class="weed" style="left:${6 + i * 20}%;height:${18 + (i * 7) % 16}%;animation-delay:-${i}s"></i>`;
    return h + '<i class="sand"></i></div><i class="glare"></i></div><i class="aqbase"></i>';
  },
  board: () => '<div class="board" style="position:absolute"><u>HQ STATUS</u><s style="top:52%"></s><s style="top:70%;right:30%"></s></div>',
  door: () => '<i class="door-f"></i><i class="door-k"></i>',
  window: () => '<i class="win-f"></i>',
  ws: () => '<i class="legs"></i><i class="chair"></i><i class="desk"></i><i class="mon"><b></b></i><i class="kb"></i>',
  printer: () => '<i class="pr-paper"></i><i class="pr-print"></i>',
  cat: () => '<i class="cat-b"></i><i class="cat-h"></i><i class="cat-e"></i><i class="cat-e2"></i>',
  reception: () => '<i class="rc-body"></i><i class="rc-top"></i><i class="rc-glow"></i><i class="rc-bell"></i>',
  plant: () => '<i class="leaf" style="--r:-38deg"></i><i class="leaf" style="--r:-14deg;height:74%"></i><i class="leaf" style="--r:12deg"></i><i class="leaf" style="--r:36deg;height:54%"></i><i class="pot"></i>',
  cooler: () => '<i class="pr-bot"></i><i class="pr-body"></i><i class="pr-tap"></i>'
};
const layers = {};
function buildRoom() {
  const stage = $('#stage'); stage.innerHTML = '';
  const mk = (name, d, cls = '') => { const l = el('div', 'layer ' + cls); l.style.setProperty('--d', d); stage.appendChild(l); layers[name] = l; return l; };
  const back = mk('back', 3), mid = mk('mid', 8), near = mk('near', 15), fg = mk('fg', 28, 'deco');
  back.append(el('div', 'ceil'), el('div', 'wall'), el('div', 'floor'), el('div', 'skirt'), el('div', 'rays'));
  [8, 42, 76].forEach(x => { const t = el('i', 'tube'); t.style.left = x + 'em'; back.appendChild(t); });
  D.items.forEach(it => {
    const n = el('div', 'it ' + (it.art === 'ws' ? 'ws ' : '') + (it.cls === 'emp' ? 'occ' : ''));
    n.dataset.id = it.id; n.tabIndex = 0; n.setAttribute('role', 'button'); n.setAttribute('aria-label', it.label);
    n.style.cssText = `left:${it.x}em;top:${it.y}em;width:${it.w}em;height:${it.h}em`;
    n.innerHTML = ART[it.art](it.cls);
    layers[it.layer].appendChild(n);
  });
  fg.append(el('div', 'fg-light'));
  [[-2, -14], [92, 12]].forEach(([x, r]) => { const l = el('i', 'fg-leaf'); l.style.left = x + 'em'; l.style.transform = `rotate(${r}deg)`; fg.appendChild(l); });
  stage.querySelectorAll('.it').forEach(n => {
    const it = D.items.find(i => i.id === n.dataset.id);
    n.addEventListener('click', e => { e.stopPropagation(); interact(it); });
    n.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); interact(it); } });
    n.addEventListener('pointerenter', () => showTip(it, n));
    n.addEventListener('pointerleave', hideTip);
    n.addEventListener('pointermove', e => moveTip(e));
  });
}
const tip = () => $('#tip');
function showTip(it, n) { if (ST.mobile || dlgOpen) return; tip().textContent = it.label + (HQ.seen[it.id] ? '' : ' •'); tip().hidden = false; }
function moveTip(e) { tip().style.left = e.clientX + 'px'; tip().style.top = e.clientY + 'px'; }
function hideTip() { tip().hidden = true; }

/* ---------- parallax ---------- */
const P = { x: 0, y: 0, tx: 0, ty: 0, t: 0 };
let dragging = false, dragX = 0, dragStartTx = 0;
function initParallax() {
  const v = $('#view');
  addEventListener('pointermove', e => {
    if (ST.motion) return;
    if (ST.mobile) { if (dragging) { P.tx = Math.max(-1, Math.min(1, dragStartTx + (e.clientX - dragX) / (innerWidth * .35))); } return; }
    P.tx = (e.clientX / innerWidth - .5) * 2; P.ty = (e.clientY / innerHeight - .5) * 2;
  });
  v.addEventListener('pointerdown', e => { if (ST.mobile) { dragging = true; dragX = e.clientX; dragStartTx = P.tx; } });
  addEventListener('pointerup', () => dragging = false);
  addEventListener('pointercancel', () => dragging = false);
  (function loop(t) {
    P.t = t / 1000;
    if (ST.motion) { P.tx = P.ty = 0; }
    else if (ST.mobile && !dragging && Math.abs(P.tx) < .001) { P.ty = Math.sin(P.t * .3) * .2; }
    P.x += (P.tx - P.x) * .06; P.y += (P.ty - P.y) * .06;
    v.style.setProperty('--px', P.x.toFixed(4)); v.style.setProperty('--py', P.y.toFixed(4));
    requestAnimationFrame(loop);
  })(0);
}

/* ---------- dialogue ---------- */
let dlgOpen = false, dlgQueue = [], dlgWho = '', typing = null, dlgLineDone = true, curLine = '';
function interact(it) {
  if (dlgOpen || !$('#menu').hidden && false) return;
  hideTip(); sfx.click();
  const first = !HQ.seen[it.id]; HQ.seen[it.id] = (HQ.seen[it.id] || 0) + 1; saveHQ();
  if (it.id === 'door') sfx.deny();
  const lines = it.pick ? [it.lines[Math.floor(Math.random() * it.lines.length)]] : it.lines.slice();
  openDlg(it.who || '', lines);
}
function openDlg(who, lines) {
  dlgOpen = true; dlgQueue = lines.slice(); dlgWho = who;
  $('#dlg').hidden = false; $('#dlgWho').textContent = who; nextLine();
}
async function nextLine() {
  if (!dlgQueue.length) return closeDlg();
  curLine = dlgQueue.shift(); dlgLineDone = false; $('#dlgNext').style.visibility = 'hidden';
  const my = typing = {}; const tx = $('#dlgTxt');
  await typeInto(tx, curLine, { base: 24, sound: true, cancel: () => typing !== my });
  if (typing === my) { dlgLineDone = true; $('#dlgNext').style.visibility = 'visible'; }
}
function advanceDlg() {
  if (!dlgOpen) return;
  if (!dlgLineDone) { typing = null; $('#dlgTxt').textContent = curLine; dlgLineDone = true; $('#dlgNext').style.visibility = 'visible'; const f = skipFns; skipFns = []; f.forEach(fn => fn()); return; }
  sfx.click(); nextLine();
}
function closeDlg() { dlgOpen = false; typing = null; $('#dlg').hidden = true; sfx.close(); }
function toast(msg, ms = 3800) { const t = $('#toast'); t.textContent = msg; t.hidden = false; t.style.opacity = 1; setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.hidden = true, 600); }, ms); }

/* ---------- room entry ---------- */
function enterRoom() {
  $('#intro').hidden = true;
  const room = $('#room'); room.hidden = false;
  buildRoom();
  const lids = $('#lids'); lids.className = ''; lids.hidden = false;
  music.bgm = mkAudio(D.cfg.bgm, true); music.bgm._k = 0; applyAudio();
  music.bgm.play().catch(() => {});
  fadeAudio(music.bgm, 1, 4000);
  startAmbience();
  void lids.offsetWidth;
  room.classList.add('waking'); lids.classList.add('open');
  const dur = ST.motion ? 1500 : ST.flash ? 3100 : 5100;
  setTimeout(() => { lids.classList.add('done'); room.classList.remove('waking'); }, dur);
  HQ.introSeen = true; saveHQ();
  setTimeout(() => toast(ST.mobile ? 'Drag to look around. Tap things.' : 'Look around. Click things.'), dur + 400);
}

/* ---------- boot ---------- */
function boot() {
  applySettings(); initMenu(); initParallax();
  $('#skip').addEventListener('click', skipIntro);
  $('#dlg').addEventListener('click', advanceDlg);
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!$('#menu').hidden) toggleMenu(false); else if ($('#gear').hidden === false) toggleMenu(true); return; }
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.code === 'Space' && tag !== 'input' && tag !== 'button') {
      e.preventDefault();
      if (!$('#intro').hidden && !finishing) skipIntro(); else if (dlgOpen) advanceDlg();
    }
    if (e.key === 'Enter' && dlgOpen && tag !== 'div') advanceDlg();
  });
  const start = () => { if (start.done) return; start.done = true; initAudio(); if (ctx && ctx.state === 'suspended') ctx.resume(); runIntro(); };
  $('#gate').addEventListener('click', start);
  $('#gate').addEventListener('keydown', e => { if (e.key === 'Enter' || e.code === 'Space') { e.preventDefault(); start(); } });
  $('#gate').focus();
}
window.HQ = { D, get ST() { return ST; }, get HQ() { return HQ; }, toast, openDlg, sfx, blip };
boot();
})();
