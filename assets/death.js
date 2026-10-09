/* assets/death.js
   F.I.H HQ death screen. Same principle as the intro: hypnotic background, two voices (a = cool blue, b = warm cream),
   slow typing, defeat.mp3, then an eye-opening transition back into the game.

   USAGE (after hq.js is loaded):
     HQDeath.play({
       onBlack: () => { ...reset player / respawn room here, screen is fully black... },
       onDone:  () => { ...eyes are open, give control back... },
       pause:   [someAudioElement]   // optional: audio paused during the screen and resumed when eyes open
     });
   Test in the console:  HQDeath.play()   |   HQDeath.play({ index: 2 })  (0-based, forces a quote)
*/
(() => {
'use strict';
const SET_KEY = 'fih_hq_settings_v1';
const CFG = {
  music: 'assets/defeat.mp3',
  startDelay: 2000,   // ms before first line
  gapA: 2400,         // pause after an "a" line
  gapB: 3200,         // pause after a "b" line
  endHold: 1800,      // pause after the last line before fade
  base: 62            // ms per character
};

/* who: a = cool blue voice (left), b = warm cream voice (right) */
const LINES = [
  [ {who:'b', text:'"I\'m not enough...'},
    {who:'a', text:'Enough what ? Get a grip, the sun is shining.'} ],
  [ {who:'a', text:'I hope you stay tender hearted, despite...'},
    {who:'b', text:'Despite ...?'},
    {who:'a', text:'Despite.'} ],
  [ {who:'b', text:'Back here again...'},
    {who:'a', text:'Love will always come back to you. In a different form, a different person, a different hobby, a different touch. But in any way, love will always come back.'},
    {who:'b', text:'Let\'s press forward.'} ],
  [ {who:'b', text:'I should remember I can\'t save everyone.'},
    {who:'a', text:'But you should remember that you have to try.'} ],
  [ {who:'a', text:'Pick yourself up and dust yourself off, you are more than the dirt they buried you in.'},
    {who:'b', text:'...'} ],
  [ {who:'b', text:'Ugh...'},
    {who:'a', text:'You have to keep going. You care too much. Your kindness is overwhelming. Your cheerfullness is too upbeat.They need you.'}],
  [ {who:'a', text:'A lot of things are beginning, and a lot of things are ending...'},
    {who:'b', text:'I welcome it all.'} ],
  [ {who:'b', text:'Unattainable...'},
    {who:'a', text:'Ultimately, you will become whoever would have saved you that time when no one did.'} ],
  [ {who:'b', text:'I keep becoming me, over and over again...'} ],
  [ {who:'b', text:'At death door...'},
    {who:'a', text:'Be who you are even if it kills you. It will, over and over again, even as you live.'} ],
  [ {who:'b', text:'Failing, it hurts...'},
    {who:'a', text:'You\'ll ache, and you\'re going to love it. It will crush you. And you\'re still going to love all of it. Doesn\'t it sound lovely beyond belief ?'} ]
];

const CSS = `
#dx{position:fixed;inset:0;z-index:300;background:#030a12;overflow:hidden;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 1.2s;font-family:"Segoe UI","Frutiger Linotype",Frutiger,Tahoma,Verdana,sans-serif;color:#eaf6ff;-webkit-user-select:none;user-select:none}
#dx.on{opacity:1}
#dx.out{opacity:0;transition:opacity 1.6s}
#dx .ib{position:absolute;inset:-30%;pointer-events:none}
#dx .ib1{background:conic-gradient(from 0deg at 50% 50%,#04121f,#0a3a5a,#04121f,#14566e,#04121f,#0b2d57,#04121f);filter:blur(60px);opacity:.7;animation:dxspin 140s linear infinite}
#dx .ib2{background:radial-gradient(circle at 50% 50%,transparent 0 12%,#52c8e822 14%,transparent 18% 26%,#52c8e816 29%,transparent 33% 44%,#52c8e810 48%,transparent 52%);animation:dxbreathe 14s ease-in-out infinite}
#dx .ib3{background:radial-gradient(ellipse at 50% 50%,transparent 35%,#000 85%);inset:0}
@keyframes dxspin{to{transform:rotate(360deg)}}
@keyframes dxbreathe{0%,100%{transform:scale(.85);opacity:.45}50%{transform:scale(1.25);opacity:.9}}
#dx.rm .ib1,#dx.rm .ib2{animation:none}
#dxText{position:relative;width:min(46em,86vw);display:flex;flex-direction:column;gap:2.2em;font-size:calc(1.15rem*var(--ui,1));line-height:1.75;font-weight:300;letter-spacing:.02em}
#dx .q{min-height:1.75em;opacity:0;transition:opacity 1.2s;text-shadow:0 0 18px currentColor;display:none}
#dx .q.show{opacity:1}
#dx .q.a{color:#a9cdfb;text-align:left;max-width:30em}
#dx .q.b{color:#ffe4bd;text-align:right;margin-left:auto;max-width:36em}
#dx .q i{display:inline-block;width:.5em;height:1em;vertical-align:-.12em;margin-left:.15em;background:currentColor;opacity:.7;animation:dxcaret 1s steps(2) infinite}
@keyframes dxcaret{50%{opacity:0}}
#dxSkip{position:absolute;right:1.4em;bottom:1.2em;padding:.5em 1em;border-radius:.6em;border:1px solid #ffffff44;background:linear-gradient(#ffffff26,#ffffff0a);font:inherit;font-size:.9rem;color:inherit;opacity:.7;cursor:pointer}
#dxSkip:hover,#dxSkip:focus-visible{opacity:1;outline:2px solid #4fc3e8}
#dxSkip kbd{font:inherit;font-size:.78em;padding:.05em .4em;margin-left:.35em;border:1px solid #fff6;border-radius:.3em}
#dxLids{position:fixed;inset:0;z-index:310;pointer-events:none;display:none;overflow:hidden}
#dxLids .lid{position:absolute;left:-10%;right:-10%;height:54%;background:#000;will-change:transform}
#dxLids .lt{top:0;border-radius:0 0 50% 50%/0 0 14em 14em;box-shadow:0 0 5em 2.2em #000}
#dxLids .lb{bottom:0;border-radius:50% 50% 0 0/14em 14em 0 0;box-shadow:0 0 5em 2.2em #000}
#dxLids.open .lt{animation:dxLT 4.8s linear forwards}
#dxLids.open .lb{animation:dxLB 4.8s linear forwards}
#dxLids.soft.open .lt,#dxLids.soft.open .lb{animation-duration:3.2s}
#dxLids.fast.open .lt,#dxLids.fast.open .lb{animation-duration:1.4s}
@keyframes dxLT{
  0%{transform:translateY(0);animation-timing-function:cubic-bezier(.4,0,.3,1)}
  12%{transform:translateY(0);animation-timing-function:cubic-bezier(.4,0,.3,1)}
  45%{transform:translateY(-24%);animation-timing-function:cubic-bezier(.35,0,.2,1)}
  100%{transform:translateY(-115%)}}
@keyframes dxLB{
  0%{transform:translateY(0);animation-timing-function:cubic-bezier(.4,0,.3,1)}
  12%{transform:translateY(0);animation-timing-function:cubic-bezier(.4,0,.3,1)}
  45%{transform:translateY(24%);animation-timing-function:cubic-bezier(.35,0,.2,1)}
  100%{transform:translateY(115%)}}
.dx-waking{animation:dxWake 4.8s ease-out both}
.dx-waking.soft{animation-duration:3.2s}
@keyframes dxWake{0%{filter:blur(1.5em) brightness(1.5) saturate(.5)}45%{filter:blur(.9em) brightness(1.3) saturate(.8)}100%{filter:none}}
`;

let busy = false;
const sleepers = [];
let skipped = false;
const sleep = ms => new Promise(r => { const t = setTimeout(r, ms); sleepers.push(() => { clearTimeout(t); r(); }); });
const wake = () => { skipped = true; const f = sleepers.splice(0); f.forEach(fn => fn()); };
const settings = () => { try { return JSON.parse(localStorage.getItem(SET_KEY) || '{}'); } catch (e) { return {}; } };

function pickIndex(force) {
  if (Number.isInteger(force)) return ((force % LINES.length) + LINES.length) % LINES.length;
  let last = -1; try { last = +sessionStorage.getItem('fih_dx_last'); } catch (e) {}
  let i; do { i = Math.floor(Math.random() * LINES.length); } while (i === last && LINES.length > 1);
  try { sessionStorage.setItem('fih_dx_last', i); } catch (e) {}
  return i;
}

async function typeInto(node, text, st) {
  const sp = st.text || 1, caret = document.createElement('i'), tn = document.createTextNode('');
  node.textContent = ''; node.append(tn, caret);
  for (let i = 0; i < text.length; i++) {
    tn.nodeValue = text.slice(0, i + 1);
    const c = text[i]; let d = CFG.base / sp;
    if ('.!?'.includes(c)) d += 420 / sp; else if (c === ',') d += 220 / sp; else if (c === ':') d += 200 / sp;
    await sleep(d);
    if (skipped) break;
  }
  tn.nodeValue = text; caret.remove();
}

function fade(a, to, ms, vol, done) {
  const from = a._k ?? 1, t0 = performance.now();
  (function step(t) {
    const p = Math.min(1, (t - t0) / ms); a._k = from + (to - from) * p;
    a.volume = Math.max(0, Math.min(1, vol() * a._k));
    if (p < 1) requestAnimationFrame(step); else done && done();
  })(t0);
}

async function play(opts = {}) {
  if (busy) return; busy = true; skipped = false;
  const st = settings();
  const master = st.mute ? 0 : (st.master ?? .8), bgm = st.bgm ?? .7;
  const vol = () => Math.min(1, master * bgm);
  const motion = !!st.motion, flash = !!st.flash;

  if (!document.getElementById('dxStyle')) { const s = document.createElement('style'); s.id = 'dxStyle'; s.textContent = CSS; document.head.appendChild(s); }
  const entry = LINES[pickIndex(opts.index)];

  const root = document.createElement('div'); root.id = 'dx'; if (motion) root.classList.add('rm');
  root.innerHTML = '<div class="ib ib1"></div><div class="ib ib2"></div><div class="ib ib3"></div><div id="dxText"></div><button id="dxSkip" type="button">Skip <kbd>Space</kbd></button>';
  const box = root.querySelector('#dxText');
  const nodes = entry.map(l => { const p = document.createElement('p'); p.className = 'q ' + l.who; box.appendChild(p); return p; });
  document.body.appendChild(root);
  const lids = document.createElement('div'); lids.id = 'dxLids'; lids.innerHTML = '<i class="lid lt"></i><i class="lid lb"></i>'; document.body.appendChild(lids);

  const paused = (opts.pause || []).filter(a => a && !a.paused);
  paused.forEach(a => a.pause());

  const music = new Audio(CFG.music); music._k = 0; music.volume = 0; music.loop = false;
  music.play().catch(() => {});
  fade(music, 1, 2500, vol);

  const onKey = e => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); wake(); } };
  addEventListener('keydown', onKey, true);
  root.querySelector('#dxSkip').addEventListener('click', wake);
  root.querySelector('#dxSkip').focus();

  requestAnimationFrame(() => root.classList.add('on'));
  await sleep(CFG.startDelay);
  for (let i = 0; i < entry.length && !skipped; i++) {
    nodes[i].style.display = 'block'; void nodes[i].offsetWidth; nodes[i].classList.add('show');
    await typeInto(nodes[i], entry[i].text, st);
    if (skipped) break;
    await sleep(i === entry.length - 1 ? CFG.endHold : entry[i].who === 'a' ? CFG.gapA : CFG.gapB);
  }

  /* fade to black, music out */
  removeEventListener('keydown', onKey, true);
  root.querySelector('#dxSkip').hidden = true;
  fade(music, 0, 1600, vol, () => music.pause());
  lids.style.display = 'block'; lids.className = '';
  root.classList.add('out');
  skipped = false; await new Promise(r => setTimeout(r, 1700));
  root.remove();

  /* screen is black here: let the game reset itself, then resume ambience */
  try { opts.onBlack && opts.onBlack(); } catch (e) { console.error(e); }
  paused.forEach(a => { a.play().catch(() => {}); });

  /* eyes opening on top of the page */
  const target = document.querySelector(opts.wakeTarget || '#view') || document.body;
  const soft = flash || motion;
  lids.className = (flash ? 'soft ' : '') + (motion ? 'fast ' : '');
  void lids.offsetWidth; lids.classList.add('open');
  target.classList.add('dx-waking'); if (soft) target.classList.add('soft');
  const dur = motion ? 1500 : flash ? 3300 : 4900;
  await new Promise(r => setTimeout(r, dur));
  target.classList.remove('dx-waking', 'soft'); lids.remove();
  busy = false;
  try { opts.onDone && opts.onDone(); } catch (e) { console.error(e); }
}

window.HQDeath = { play, LINES, CFG };
})();
