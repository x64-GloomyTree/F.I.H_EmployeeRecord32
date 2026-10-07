// cat.js : poster cat easter egg (annoy -> quest -> boss fight -> trophy), cdbay commands, aquarium fishing tape
(() => {
'use strict';

/* ================= config ================= */
const CAT = {
  annoyClicks: 15,          // fast clicks on the poster before she appears
  annoyGap: 1300,          // ms max between two clicks to count as "fast"
  theme: 'assets/cat_theme.mp3',            // battle music (change the extension if needed)
  fishImg: 'assets/img/fish.png',
  catImg: 'assets/img/cat.png',
  eatGif: 'assets/img/cat_fish_eat.gif',
  fishRot: 0,              // extra rotation (radians) if fish.png does not face right
  hp: 6,                   // player hit points
  hitbox: 0.25,            // player hitbox radius as a fraction of the sprite (smaller = easier)
  speed: 1.0               // global attack speed multiplier
};
const sprite = e => 'assets/img/cat_' + e + '.webp';
const voicePath = n => 'assets/sounds/cat/cat_' + n + '.mp3';

/* new sound files to add in assets/sounds/ :
   meow.mp3 (exists), fish_catch.mp3, bt_hit.mp3, bt_grab.mp3, bt_explode.mp3, trophy_chime.mp3 */
const SFX = { fishCatch: 'assets/sounds/fish_catch.mp3', hit: 'assets/sounds/bt_hit.mp3', grab: 'assets/sounds/bt_grab.mp3',
              explode: 'assets/sounds/bt_explode.mp3', trophy: 'assets/sounds/trophy_chime.mp3', meow: 'assets/sounds/meow.mp3' };

/* ================= helpers ================= */
const Bx = () => window.FIHBridge;
const SS = () => Bx().S;
const cat = () => { const s = SS(); s.cat = s.cat || { stage: 0 }; return s.cat; };
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
let busy = false;

function snd(src, vol = 0.6, rate = 1) {
  const B = Bx(); if (!B || !B.S.sound) return;
  const a = new Audio(src); a.volume = Math.min(1, vol);
  if (rate !== 1) { a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false; a.playbackRate = rate; }
  a.play().catch(() => {});
}
const voice = (n, vol) => { if (n) snd(voicePath(n), vol || 0.7); };

/* ================= data: book, tape, bay ================= */
SMUGGLED_BOOKS.push({
  id: 'adv_term', title: 'ADVANCED TERMINAL', spine: 'ADV TERM', author: 'AN INTERN (UNOFFICIAL)', smuggled: true, h: 9.5, w: 2.3,
  cover: String.raw`+---------+
| C:\>_   |
| ------- |
| ADVANCED|
| TERMINAL|
| (draft) |
+---------+`,
  pages: [
    "ADVANCED TERMINAL (UNOFFICIAL)\nnotes by the intern\n\nThe standard help list only shows the commands HR wants you to see. These are the others. Do not tell Dave.",
    "THE CD BAY\n\nThe workstation has a disc bay that is not shown anywhere. It holds discs that can be mounted as tapes without knowing their volume name.\n\n  {{n|cdbay --list}}\n      lists every bay and its disc",
    "CD BAY, CONTINUED\n\n  {{n|cdbay --info <bay>}}\n      prints the notes stored for a disc\n\n  {{n|cdbay --mount <bay>}}\n      loads the disc into the player\n\nSealed bays refuse to be mounted by number. They need their volume name.",
    "OTHER COMMANDS\n\n  {{n|help --all}}\n      prints the full command list, including the ones in these notes\n\nThe old 'mount cd' command still works. It just needs the volume name, which is a pain.",
    "INTERN NOTES\n\nBay 4 has a screensaver disc. It is an aquarium. There is a small fishing game in it, and there is a rumor that one of the fish is not a normal fish.\n\nI would not tell the cat about it.",
    "[BLANK PAGE]\n\n(someone drew a tiny paw print in the corner)"
  ]
});
TAPES.push({ id: 'aqua', hash: '508fa9aa7eb563f1db099413d518cb6d5c41aeead2a0f853f4513bfa5274ab2d', type: 'aqua', status: 'Calm', statusColor: 'green', timer: false, vhsMusic: false });

const BAY = [
  { n: 1, title: 'FLATLINE ARCHIVE', tape: 'main',  vol: null,           info: 'the volume name is not stored in the bay index.' },
  { n: 2, title: 'AQUARIUM 07',      tape: 'aqua',  vol: 'AQUARIUM-07',  info: 'office screensaver. contains a small fishing game.\nhold the mouse on a fish to hook it. (do not tell the cat)' }
];

/* ================= dialogue box ================= */
let dlg = null;
function ensureDlg() {
  if (dlg) return dlg;
  dlg = document.createElement('div'); dlg.className = 'cat-dlg'; dlg.hidden = true;
  dlg.innerHTML = '<div class="cat-stack"><img class="cat-sprite" alt=""><div class="cat-box"><div class="cat-name">THE CAT</div><div class="cat-txt"></div><div class="cat-next">v</div></div></div>';
  document.body.appendChild(dlg);
  return dlg;
}
// lines: [{ emo:'mad|sad|shock|happy', text, v:'charge|cry1|...', cls:'charred' }]
function say(lines) {
  return new Promise(resolve => {
    const d = ensureDlg(), sp = d.querySelector('.cat-sprite'), tx = d.querySelector('.cat-txt');
    let i = 0, typing = false, tm = null, full = '';
    const show = () => {
      const L = lines[i]; full = L.text;
      sp.src = sprite(L.emo); sp.className = 'cat-sprite ' + (L.cls || '');
      sp.style.animation = 'none'; void sp.offsetWidth; sp.style.animation = '';
      voice(L.v);
      tx.textContent = ''; typing = true; let k = 0; clearInterval(tm);
      tm = setInterval(() => { k++; tx.textContent = full.slice(0, k); if (k >= full.length) { clearInterval(tm); typing = false; } }, 22);
    };
    const finish = () => {
      window.removeEventListener('keydown', onKey, true); d.onpointerdown = null; d.classList.add('out');
      setTimeout(() => { d.hidden = true; d.classList.remove('in', 'out'); resolve(); }, 260);
    };
    const next = () => {
      if (typing) { clearInterval(tm); tx.textContent = full; typing = false; return; }
      i++; if (i >= lines.length) finish(); else show();
    };
    const onKey = e => { e.stopPropagation(); if (e.code === 'Space' || e.key === 'Enter') { e.preventDefault(); next(); } };
    window.addEventListener('keydown', onKey, true);
    d.hidden = false; d.classList.remove('out'); void d.offsetWidth; d.classList.add('in');
    d.onpointerdown = e => { e.preventDefault(); next(); };
    show();
  });
}

const DLG = {
  annoy: [
    { emo: 'mad',   v: 'charge',  text: 'HEY!! Stop poking me!!' },
    { emo: 'shock', v: 'huh',     text: 'Do you have any idea how many times you just clicked?! ...Fifteen! FIFTEEN!' },
    { emo: 'sad',   v: 'cry1',    text: 'I have been hanging on this wall for ages, and this is how you treat me...' },
    { emo: 'mad',   v: 'huh',     text: 'Listen. I do not like being bothered.' },
    { emo: 'mad',   v: 'charge',  text: 'Unless you have a VALID REASON, leave me alone!' },
    { emo: 'happy', v: 'mew1',    text: '...Though if you happened to bring me something nice... something that swims, perhaps... I might reconsider. Nya.' },
    { emo: 'mad',   v: 'huh',     text: 'NOT that I am asking. Shoo!' }
  ],
  nag: [
    [{ emo: 'mad',   v: 'huh',      text: 'A reason. Bring me a reason. Or go away.' }],
    [{ emo: 'sad',   v: 'cry2',     text: '...Are you just here to poke me again?' }],
    [{ emo: 'shock', v: 'surprise', text: 'You again?! Do you even have a reason this time?!' }],
    [{ emo: 'mad',   v: 'charge',   text: 'Hmph! Bring me something that swims.' }],
    [{ emo: 'happy', v: 'mew2',     text: 'Fish... I could really go for a fish right now...' }]
  ],
  reveal: [
    { emo: 'shock', v: 'surprise', text: '...You again. And you are holding...' },
    { emo: 'happy', v: 'mew1',     text: 'Is that... is that a FISH?! For me?!' },
    { emo: 'happy', v: 'mew2',     text: 'You actually listened! I am so-' },
    { emo: 'shock', v: 'huh',      text: '...wait.' },
    { emo: 'sad',   v: 'cry1',     text: 'It is made of letters. It is a... digital fish.' },
    { emo: 'sad',   v: 'cry2',     text: 'I cannot eat letters. I cannot even smell it.' },
    { emo: 'mad',   v: 'charge',   text: 'I wanted a REAL one!!' },
    { emo: 'mad',   v: 'laugh1',   text: 'You waste my time, you poke me, and you insult me with a... a PICTURE of a fish!' },
    { emo: 'mad',   v: 'laugh2',   text: 'Fine. Fine!! If you will not bring me a real fish, I will take YOURS the hard way.' },
    { emo: 'mad',   v: 'charge',   text: 'Dodge, kitten. We are going to settle this.' }
  ],
  dead: [
    { emo: 'happy', v: 'laugh1', text: 'HAHAHAHA! Is that all you have?!' },
    { emo: 'happy', v: 'laugh2', text: 'You dodge like a sleepy fish out of water.' },
    { emo: 'mad',   v: 'huh',    text: 'Go back, kitten. Find a better reason.' },
    { emo: 'mad',   v: 'charge', text: '...And take your silly digital fish with you!' }
  ],
  win1: [
    { emo: 'shock', v: 'surprise', text: '...!?' },
    { emo: 'shock', v: 'huh',      text: 'Wait. That fish is... warm? It is WIGGLING?!' },
    { emo: 'happy', v: 'mew1',     text: 'A REAL FISH?! Where did you get it?!' },
    { emo: 'happy', v: 'mew2',     text: 'You took it from MY attack. That is cheating!' },
    { emo: 'happy', v: 'mew1',     text: '...I do not care. Give it here!!' }
  ],
  win2: [
    { emo: 'shock', v: 'huh',    cls: 'charred', text: '...Am I smoking?' },
    { emo: 'happy', v: 'laugh2', cls: 'charred', text: 'That. Was. The best. Fish. EVER.' },
    { emo: 'happy', v: 'mew2',   cls: 'charred', text: 'Okay, okay. You win, kitten. You had a valid reason after all.' },
    { emo: 'happy', v: 'mew1',   cls: 'charred', text: 'Take the fish as a trophy. And please... stop poking the poster.' }
  ]
};

/* ================= terminal commands (need the USB books) ================= */
async function handleCat(tk) {
  const B = Bx(); if (!B) return false;
  const S = B.S, c = (tk[0] || '').toLowerCase(), f = (tk[1] || '').toLowerCase();
  if (!S.adminOpen || !S.usbPlugged) return false;
  const say_ = (t, k) => B.addLine(t, k || '');

  if (c === 'help' && f === '--all') {
    ['ALL COMMANDS', '  --help             standard list', '  notes              recovered fragments', '  mount cd <volume>  insert a tape', '  eject              remove the tape',
     '  cdbay --list       list the disc bay', '  cdbay --info <n>   notes stored on a disc', '  cdbay --mount <n>  load a disc by bay number'].forEach(l => say_(l));
    return true;
  }
  if (c !== 'cdbay') return false;
  if (!f) { say_('usage: cdbay --list | --info <bay> | --mount <bay>'); return true; }
  if (f === '--list') {
    say_('BAY INDEX');
    BAY.forEach(b => say_('  ' + b.n + '  ' + b.title.padEnd(18) + ' vol: ' + (b.vol || '[SEALED]')));
    return true;
  }
  const bay = BAY.find(b => String(b.n) === String(tk[2]));
  if (f === '--info' || f === '--mount') {
    if (!bay) { B.play('error'); say_('cdbay: no such bay', 'err'); return true; }
    if (f === '--info') { say_('BAY ' + bay.n + ' // ' + bay.title); bay.info.split('\n').forEach(l => say_('  ' + l)); return true; }
    if (!bay.vol) { B.play('error'); say_('cdbay: bay ' + bay.n + ' is sealed. the volume name is required.', 'err'); return true; }
    await B.printSeq(['bay ' + bay.n + ': spinning up...', 'disc found: ' + bay.title], 400);
    S.mounted = bay.tape; B.updateVhs(); B.save();
    say_('tape inserted into PLAYBACK unit. go to the right room.');
    return true;
  }
  say_('cdbay: unknown option ' + tk[1], 'err');
  return true;
}

/* ================= aquarium (fishing tape) ================= */
const Aqua = (() => {
  let raf = 0, run = false, cv = null, offs = [];
  const ARTS = [['><>', '<><'], ['><(((o>', '<o)))><'], ['>=>', '<=<'], ['><((((o>', '<o))))><'], ['>o)>', '<(o<']];
  const COLS = ['#39ff5a', '#7dffb0', '#b7ff7a', '#5ad9a0'];

  function start(canvas) {
    stop(); cv = canvas; run = true;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, fs = 16, cw = 9;
    let fish = [], special = null, spTimer = 3.5, hold = false, inside = false, px = 0.5, py = 0.2, msg = '', msgT = 0, bubbles = [];
    function fit() {
      const w = Math.max(240, Math.floor(cv.clientWidth * 0.8)), h = Math.max(120, Math.floor(cv.clientHeight * 0.8));
      if (w !== W || h !== H) { W = cv.width = w; H = cv.height = h; fs = Math.max(13, Math.floor(H / 10)); ctx.font = fs + "px 'VT323','Courier New',monospace"; cw = ctx.measureText('M').width; }
    }
    function mk() {
      const a = ARTS[Math.floor(Math.random() * ARTS.length)], dir = Math.random() < 0.5 ? 1 : -1, w = a[0].length * cw;
      return { art: a, dir, w, x: rand(0, Math.max(1, W - w)), y: rand(fs * 3, H - fs * 3.2), v: rand(28, 80) * (H / 200), prog: 0, special: false, col: COLS[Math.floor(Math.random() * COLS.length)] };
    }
    function mkSpecial() {
      const a = ['><(((@>', '<@)))><'], dir = Math.random() < 0.5 ? 1 : -1, w = a[0].length * cw;
      return { art: a, dir, w, x: dir > 0 ? -w : W, y: rand(fs * 3.5, H - fs * 4), v: rand(50, 70) * (H / 200), prog: 0, special: true, col: '#ffd75a' };
    }
    fit(); for (let i = 0; i < 6; i++) fish.push(mk());

    const pos = e => { const r = cv.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height; };
    const onMove = e => { pos(e); inside = true; };
    const onDown = e => { pos(e); inside = true; hold = true; if (cv.setPointerCapture) { try { cv.setPointerCapture(e.pointerId); } catch (x) {} } e.preventDefault(); };
    const onUp = () => { hold = false; };
    const onLeave = () => { if (!hold) inside = false; };
    cv.style.touchAction = 'none';
    [['pointermove', onMove], ['pointerdown', onDown], ['pointerup', onUp], ['pointercancel', onUp], ['pointerleave', onLeave]].forEach(([n, f]) => { cv.addEventListener(n, f); offs.push(() => cv.removeEventListener(n, f)); });

    function caught(f) {
      if (f.special) {
        special = null; spTimer = 5; msg = '** CAUGHT: DIGITAL FISH **'; msgT = 2.8;
        const B = Bx(); B.S.fishCaught = true; B.save(); snd(SFX.fishCatch, 0.7); B.toast('you caught a digital fish.'); refreshFishBtn();
      } else {
        const i = fish.indexOf(f); if (i >= 0) fish[i] = mk();
        msg = 'just a fish. it wriggles free.'; msgT = 1.6;
      }
    }

    let last = performance.now();
    function frame(now) {
      if (!run) return;
      fit();
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const B = Bx(), done = !!(B && B.S.fishCaught);
      fish.forEach(f => { f.x += f.dir * f.v * dt; if (f.dir > 0 && f.x > W) { f.x = -f.w; f.y = rand(fs * 3, H - fs * 3.2); } if (f.dir < 0 && f.x < -f.w) { f.x = W; f.y = rand(fs * 3, H - fs * 3.2); } });
      if (!special && !done) { spTimer -= dt; if (spTimer <= 0) special = mkSpecial(); }
      if (special) { special.x += special.dir * special.v * dt; if (special.x > W + 5 || special.x < -special.w - 5) { special = null; spTimer = 5; } }
      if (Math.random() < dt * 2) bubbles.push({ x: rand(0, W), y: H - fs, v: rand(14, 34), c: Math.random() < 0.5 ? 'o' : '.' });
      bubbles.forEach(b => { b.y -= b.v * dt; }); bubbles = bubbles.filter(b => b.y > -fs);

      const hx = inside ? Math.max(0, Math.min(W, px * W)) : W * 0.5, hy = inside ? Math.max(fs, Math.min(H - fs, py * H)) : H * 0.18;
      const all = special ? fish.concat([special]) : fish.slice();
      for (const f of all) {
        const on = hx > f.x - cw * 0.5 && hx < f.x + f.w + cw * 0.5 && hy > f.y - fs && hy < f.y + fs * 0.3;
        if (hold && on) f.prog += dt / (f.special ? 1.6 : 0.8); else f.prog = Math.max(0, f.prog - dt * 1.2);
        if (f.prog >= 1) { caught(f); break; }
      }
      if (msgT > 0) msgT -= dt;

      ctx.fillStyle = '#021a12'; ctx.fillRect(0, 0, W, H);
      ctx.font = fs + "px 'VT323','Courier New',monospace"; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(57,255,90,.45)'; bubbles.forEach(b => ctx.fillText(b.c, b.x, b.y));
      ctx.fillStyle = '#1f9e3a';
      for (let i = 0; i < 6; i++) { const x = (i + 0.5) * W / 6 + (i % 2 ? 8 : -8); for (let k = 0; k < 3; k++) ctx.fillText(((k + Math.floor(now / 500) + i) % 2) ? ')' : '(', x, H - fs * 1.1 - k * fs * 0.8); }
      ctx.fillStyle = '#6b5a2a'; let sand = ''; while (sand.length * cw < W + cw) sand += "~.'~ "; ctx.fillText(sand, 0, H - fs * 0.2);
      for (const f of all) {
        ctx.fillStyle = f.special ? (Math.floor(now / 120) % 2 ? '#ffd75a' : '#ffffff') : f.col;
        ctx.fillText(f.dir > 0 ? f.art[0] : f.art[1], f.x, f.y);
        if (f.prog > 0) { const n = 8, k = Math.floor(f.prog * n); ctx.fillStyle = '#fff'; ctx.fillText('[' + '#'.repeat(k) + ' '.repeat(n - k) + ']', f.x, f.y - fs); }
      }
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      for (let y = 0; y < hy - fs * 0.5; y += fs * 0.85) ctx.fillText('|', hx - cw * 0.2, y + fs * 0.8);
      ctx.fillStyle = hold ? '#ffd75a' : '#ffffff'; ctx.fillText('J', hx - cw * 0.3, hy);
      ctx.font = Math.floor(fs * 0.7) + "px 'VT323','Courier New',monospace"; ctx.fillStyle = 'rgba(160,255,190,.6)';
      ctx.fillText(done ? 'the tank is quiet.' : 'hold click on a fish to hook it', cw, H - fs * 0.2 - fs * 0.9);
      if (msgT > 0) {
        ctx.font = Math.floor(fs * 1.1) + "px 'VT323','Courier New',monospace"; const t = msg, tw = ctx.measureText(t).width;
        ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.fillRect(W / 2 - tw / 2 - 12, H * 0.4 - fs, tw + 24, fs * 1.6);
        ctx.fillStyle = '#ffd75a'; ctx.fillText(t, W / 2 - tw / 2, H * 0.4);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  function stop() { run = false; if (raf) cancelAnimationFrame(raf); raf = 0; offs.forEach(f => f()); offs = []; }
  return { start, stop };
})();
window.FIHAqua = Aqua;

/* ================= battle ================= */
const PLAYER_ART = [
  'x.......x',
  'xx.....xx',
  'xxxxxxxxx',
  'xxexxxexx',
  'xxxxpxxxx',
  '.xxxxxxx.',
  '.xxxxxxx.',
  '..x...x..'
];

function burst(host) {
  const bits = ['*', '+', '><>', 'x', 'BOOM', 'o', '!', '~'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div'); el.className = 'bt-p'; el.textContent = bits[Math.floor(Math.random() * bits.length)];
    host.appendChild(el);
    const a = Math.random() * Math.PI * 2, d = rand(18, 48), rot = rand(-540, 540);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = 'translate(' + Math.cos(a) * d + 'vmin,' + Math.sin(a) * d + 'vmin) rotate(' + rot + 'deg)'; el.style.opacity = '0'; }));
    setTimeout(() => el.remove(), 1600);
  }
}

async function battle() {
  const B = Bx();
  const ov = document.createElement('div'); ov.className = 'bt-ov';
  ov.innerHTML =
    '<img class="bt-cat" alt="" src="' + sprite('mad') + '">' +
    '<canvas class="bt-cv"></canvas>' +
    '<div class="bt-bubble" hidden></div>' +
    '<div class="bt-ui"><div class="bt-flavor">* The cat throws fish at you.</div>' +
    '<div class="bt-hp"><span>HP</span><div class="bt-bar"><i></i></div><b></b></div>' +
    '<div class="bt-menu"><button>FIGHT</button><button>ACT</button><button>ITEM</button><button>MERCY</button></div>' +
    '<div class="bt-keys">Z Q S D / arrows : move</div></div>';
  document.body.appendChild(ov);
  const cv = ov.querySelector('.bt-cv'), ctx = cv.getContext('2d'), catEl = ov.querySelector('.bt-cat'), bub = ov.querySelector('.bt-bubble');
  const flav = ov.querySelector('.bt-flavor'), hpFill = ov.querySelector('.bt-bar i'), hpTxt = ov.querySelector('.bt-hp b');
  const fishImg = new Image(); fishImg.src = CAT.fishImg;
  ['mad', 'sad', 'shock', 'happy'].forEach(e => { const im = new Image(); im.src = sprite(e); });
  const theme = new Audio(CAT.theme); theme.loop = true; theme.volume = 0.5;
  if (B.S.sound) theme.play().catch(() => {});
  if (typeof FIHMusic !== 'undefined') FIHMusic.update({ enabled: false });

  let W = 0, H = 0, ax = 0, ay = 0, aw = 0, ah = 0, u = 1;
  const layout = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; aw = Math.min(W * 0.5, H * 0.6); ah = Math.min(H * 0.34, aw * 0.7); ax = (W - aw) / 2; ay = H * 0.38; u = ah; };
  layout(); addEventListener('resize', layout);
  const P = { x: aw / 2, y: ah / 2, hp: CAT.hp, inv: 0 };
  const fw = () => ah * 0.3;
  const fhh = () => fw() * (fishImg.naturalWidth ? fishImg.naturalHeight / fishImg.naturalWidth : 0.5);
  const psz = () => ah * 0.11;
  let grabbed = null, projs = [], result = null, t = 0, bubT = 0, emoT = 0, hintI = 0, loopT = 70, flavSet = false;

  const setHp = () => { hpFill.style.width = Math.max(0, P.hp / CAT.hp * 100) + '%'; hpTxt.textContent = Math.max(0, P.hp) + ' / ' + CAT.hp; };
  setHp();
  const setEmo = (e, ms) => { catEl.src = sprite(e); clearTimeout(emoT); emoT = setTimeout(() => { catEl.src = sprite('mad'); }, ms || 1500); };
  const bubble = (emo, text, v) => { bub.textContent = text; bub.hidden = false; setEmo(emo, 3200); voice(v, 0.6); clearTimeout(bubT); bubT = setTimeout(() => { bub.hidden = true; }, 3800); };

  const HINTS = [
    { t: 1.2, emo: 'mad',   v: 'charge', text: 'Dodge, little kitten! Use those Z Q S D paws!' },
    { t: 10,  emo: 'happy', v: 'laugh1', text: 'You cannot hurt me. You do not even have an attack. Heh.' },
    { t: 20,  emo: 'shock', v: 'huh',    text: '...Why are you staring at my fish?' },
    { t: 31,  emo: 'mad',   v: 'charge', text: 'Do NOT hold them with your mouse. And DEFINITELY do not drag one over to me!!' },
    { t: 44,  emo: 'sad',   v: 'cry1',   text: '...Nobody ever tries it. Everyone just keeps dodging.' },
    { t: 56,  emo: 'mad',   v: 'huh',    text: 'Seriously. Hands off the fish. Click, hold, drag... NO!' }
  ];
  const LOOP = [
    { emo: 'mad',   v: 'huh',    text: "Hold a fish. Drag it to me. ...I mean DON'T." },
    { emo: 'happy', v: 'laugh2', text: 'My fish are fresh. They are for throwing, not for... never mind.' },
    { emo: 'shock', v: 'huh',    text: 'Dodge, dodge, dodge! (Or grab one. Hypothetically.)' }
  ];
  const FL = { FIGHT: '* You have no attack. Your paws are too soft.', ACT: '* You pose dramatically. Nothing happens.', ITEM: '* You hold a digital fish. She will not have it.', MERCY: '* She has no interest in mercy. She wants fish.' };
  ov.querySelectorAll('.bt-menu button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); flav.textContent = FL[b.textContent]; B.play('click'); }));

  /* input */
  const keys = {};
  const dirOf = e => {
    const c = e.code, k = (e.key || '').toLowerCase();
    if (c === 'ArrowUp' || c === 'KeyW' || k === 'z' || k === 'w') return 'u';
    if (c === 'ArrowDown' || c === 'KeyS' || k === 's') return 'd';
    if (c === 'ArrowLeft' || c === 'KeyA' || k === 'q' || k === 'a') return 'l';
    if (c === 'ArrowRight' || c === 'KeyD' || k === 'd') return 'r';
    return null;
  };
  const kd = e => { const d = dirOf(e); if (d) { keys[d] = true; e.preventDefault(); } e.stopPropagation(); };
  const ku = e => { const d = dirOf(e); if (d) keys[d] = false; e.stopPropagation(); };
  addEventListener('keydown', kd, true); addEventListener('keyup', ku, true);

  ov.addEventListener('pointerdown', e => {
    if (result || e.target.closest('.bt-menu')) return;
    let best = null, bd = 1e9;
    for (const p of projs) { const d = Math.hypot(p.x - e.clientX, p.y - e.clientY); if (d < fw() * 0.7 && d < bd) { best = p; bd = d; } }
    if (best) {
      grabbed = best; best.held = true; best.x = e.clientX; best.y = e.clientY; e.preventDefault();
      try { ov.setPointerCapture(e.pointerId); } catch (x) {}
      snd(SFX.grab, 0.6); voice('huh', 0.5); setEmo('shock', 1300);
    }
  });
  ov.addEventListener('pointermove', e => { if (grabbed) { grabbed.x = e.clientX; grabbed.y = e.clientY; } });
  const release = e => {
    if (!grabbed) return;
    const r = catEl.getBoundingClientRect(), pad = 0.15 * Math.max(r.width, r.height);
    const onCat = e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
    if (onCat) result = 'win';
    else { projs = projs.filter(p => p !== grabbed); bubble('happy', 'Hah! Dropped it!', 'laugh2'); }
    grabbed = null;
  };
  ov.addEventListener('pointerup', release); ov.addEventListener('pointercancel', release);

  /* attack patterns */
  const cpos = () => { const r = catEl.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.75 }; };
  let cycle = 0; const spd = () => (1 + cycle * 0.12) * CAT.speed;
  const add = (x, y, vx, vy) => projs.push({ x, y, vx, vy, ang: Math.atan2(vy, vx), held: false });
  const PATS = [
    { dur: 4.2, every: 0.36, run: () => add(ax + rand(0.05, 0.95) * aw, ay - fw(), 0, u * 1.05 * spd()) },
    { dur: 4.4, every: 0.5,  run: k => { const r = k % 2; add(r ? ax + aw + fw() : ax - fw(), ay + rand(0.1, 0.9) * ah, (r ? -1 : 1) * u * 1.35 * spd(), 0); } },
    { dur: 4.6, every: 0.8,  run: () => { const c = cpos(), a = Math.atan2(ay + P.y - c.y, ax + P.x - c.x), s = u * 1.1 * spd(); add(c.x, c.y, Math.cos(a) * s, Math.sin(a) * s); } },
    { dur: 4.6, every: 1.4,  run: () => { const c = cpos(); for (let i = 0; i < 7; i++) { const a = (55 + i * 11.7) * Math.PI / 180, s = u * 0.85 * spd(); add(c.x, c.y, Math.cos(a) * s, Math.sin(a) * s); } } }
  ];
  let pi = 0, ptime = 0, pnext = 0, gap = 1.8;
  function schedule(dt) {
    if (gap > 0) { gap -= dt; return; }
    const pt = PATS[pi % PATS.length];
    pnext -= dt; ptime += dt;
    if (pnext <= 0) { pt.run(Math.floor(ptime / pt.every)); pnext = pt.every; }
    if (ptime >= pt.dur) { ptime = 0; pnext = 0; pi++; gap = 1.0; if (pi % PATS.length === 0) cycle++; }
  }

  function hit() {
    P.hp--; P.inv = 1.4; setHp(); snd(SFX.hit, 0.7);
    if (Math.random() < 0.45) voice(Math.random() < 0.5 ? 'laugh1' : 'laugh2', 0.5);
    setEmo('happy', 900);
    ov.classList.remove('shake'); void ov.offsetWidth; ov.classList.add('shake');
    if (P.hp <= 0) result = 'dead';
  }

  function update(dt) {
    t += dt;
    const sx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), sy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0), n = Math.hypot(sx, sy) || 1, ps = psz();
    P.x = Math.max(ps / 2, Math.min(aw - ps / 2, P.x + sx / n * u * 0.95 * dt));
    P.y = Math.max(ps / 2, Math.min(ah - ps / 2, P.y + sy / n * u * 0.95 * dt));
    if (P.inv > 0) P.inv -= dt;
    schedule(dt);
    for (const p of projs) { if (p.held) continue; p.x += p.vx * dt; p.y += p.vy * dt; }
    projs = projs.filter(p => p.held || (p.x > -250 && p.x < W + 250 && p.y > -350 && p.y < H + 250));
    if (P.inv <= 0) {
      const px = ax + P.x, py = ay + P.y, rr = ps * CAT.hitbox + fhh() * 0.4;
      for (const p of projs) { if (!p.held && Math.hypot(p.x - px, p.y - py) < rr) { hit(); break; } }
    }
    if (hintI < HINTS.length && t >= HINTS[hintI].t) { const h = HINTS[hintI++]; bubble(h.emo, h.text, h.v); }
    else if (hintI >= HINTS.length && t >= loopT) { const h = LOOP[Math.floor(Math.random() * LOOP.length)]; bubble(h.emo, h.text, h.v); loopT = t + 14; }
    if (!flavSet && t > 45) { flavSet = true; flav.textContent = '* The fish seem... grabbable?'; }
  }

  function drawFish(p, s, glow) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.held ? 0 : p.ang + CAT.fishRot);
    const w = fw() * s, h = fhh() * s;
    if (glow) { ctx.shadowColor = '#ffd75a'; ctx.shadowBlur = 24; }
    if (fishImg.complete && fishImg.naturalWidth) ctx.drawImage(fishImg, -w / 2, -h / 2, w, h);
    else { ctx.fillStyle = '#ffd75a'; ctx.font = Math.floor(h) + 'px monospace'; ctx.textAlign = 'center'; ctx.fillText('><>', 0, h / 4); }
    ctx.restore();
  }
  function drawPlayer() {
    const ps = psz(), c = ps / 9, ox = ax + P.x - ps / 2, oy = ay + P.y - (PLAYER_ART.length * c) / 2;
    PLAYER_ART.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch === '.') return;
      ctx.fillStyle = ch === 'e' ? '#111' : ch === 'p' ? '#ff9ec2' : '#ffe9a0';
      ctx.fillRect(Math.round(ox + i * c), Math.round(oy + j * c), Math.ceil(c), Math.ceil(c));
    }));
  }
  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeRect(ax - 2, ay - 2, aw + 4, ah + 4);
    for (const p of projs) if (!p.held) drawFish(p, 1, false);
    if (P.inv <= 0 || Math.floor(now / 90) % 2) drawPlayer();
    if (grabbed) drawFish(grabbed, 1.15, true);
  }

  await new Promise(res => {
    let last = performance.now();
    const loop = now => {
      if (result) { res(); return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); draw(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });

  removeEventListener('keydown', kd, true); removeEventListener('keyup', ku, true); removeEventListener('resize', layout);
  clearTimeout(bubT); clearTimeout(emoT);
  const end = () => { theme.pause(); ov.remove(); if (typeof FIHMusic !== 'undefined') FIHMusic.update({ enabled: B.S.sound }); };

  if (result === 'dead') {
    ctx.clearRect(0, 0, W, H); ov.classList.add('dead'); flav.textContent = '* ...'; voice('laugh1', 0.7);
    await sleep(1300); end(); return 'dead';
  }

  /* ---- victory: dialogue, munch, swell, boom, trophy ---- */
  projs = []; ctx.clearRect(0, 0, W, H); bub.hidden = true; ov.classList.add('calm'); catEl.style.visibility = 'hidden'; theme.volume = 0.15;
  await say(DLG.win1);
  const eat = document.createElement('img'); eat.className = 'bt-eat'; eat.alt = ''; eat.src = CAT.eatGif + '?r=' + Date.now(); ov.appendChild(eat);
  voice('mew2'); await sleep(1900); voice('mew1'); await sleep(1700);
  eat.classList.add('swell'); voice('huh'); await sleep(1600);
  snd(SFX.explode, 0.8); voice('cry1', 0.6);
  const fl = document.createElement('div'); fl.className = 'bt-flash'; ov.appendChild(fl);
  ov.classList.remove('shake'); void ov.offsetWidth; ov.classList.add('shake');
  eat.remove(); burst(ov);
  await sleep(1600); fl.remove(); ov.classList.remove('shake'); theme.pause();
  await say(DLG.win2);
  const tr = document.createElement('div'); tr.className = 'bt-trophy';
  tr.innerHTML = '<img src="' + CAT.fishImg + '" alt=""><div>TROPHY UNLOCKED</div><small>A real fish</small>';
  ov.appendChild(tr); snd(SFX.trophy, 0.7);
  await sleep(3200); end(); return 'win';
}

/* ================= poster + quest controller ================= */
let clk = 0, lastClick = 0, nagIdx = 0;
const posterEl = () => $('#poster');

function applyPoster() {
  const p = posterEl(); if (!p) return;
  if (cat().stage >= 2) {
    p.classList.remove('hascat');
    p.innerHTML = '<div class="paw"><i class="pad"></i><i class="t1"></i><i class="t2"></i><i class="t3"></i><i class="t4"></i></div>';
  } else {
    p.classList.add('hascat');
    if (!p.querySelector('img')) p.innerHTML = '<img src="' + CAT.catImg + '" alt="">';
  }
}
function applyTrophy() {
  if (!SS().trophy || $('#trophy')) return;
  const t = document.createElement('div'); t.id = 'trophy'; t.className = 'item trophy';
  t.innerHTML = '<img src="' + CAT.fishImg + '" alt="">';
  t.addEventListener('click', () => { Bx().play('click'); Bx().toast('a real fish. she insists it was delicious.'); });
  const layer = $('#stage .layer'); if (layer) layer.appendChild(t);
}
function refreshFishBtn() {
  const inv = $('.inv'); if (!inv || !Bx()) return;
  let b = $('#fishBtn');
  const on = !!SS().fishCaught && cat().stage === 1;
  if (on && !b) {
    b = document.createElement('button'); b.id = 'fishBtn'; b.className = 'btn'; b.textContent = '[ FISH ]';
    b.addEventListener('click', () => { Bx().play('click'); Bx().toast('a digital fish. it flickers in your hand. someone might want to see it.'); });
    inv.appendChild(b);
  }
  if (!on && b) b.remove();
}

function meowRapid() {
  const now = performance.now();
  clk = (now - lastClick < CAT.annoyGap) ? clk + 1 : 1; lastClick = now;
  snd(SFX.meow, 0.6, Math.min(2.2, 1 + (clk - 1) * 0.1));
  const p = posterEl(); p.classList.remove('wig'); void p.offsetWidth; p.classList.add('wig');
  if (clk >= CAT.annoyClicks) { clk = 0; annoyed(); }
}
async function annoyed() {
  busy = true;
  try { await sleep(250); await say(DLG.annoy); cat().stage = 1; Bx().save(); }
  finally { busy = false; }
}
async function reveal() {
  await say(DLG.reveal);
  const r = await battle(), B = Bx(), C = cat();
  if (r === 'dead') {
    await say(DLG.dead);
    B.S.fishCaught = false; C.stage = 1; B.save(); refreshFishBtn();
  } else {
    C.stage = 2; B.S.trophy = true; B.save();
    applyPoster(); applyTrophy(); refreshFishBtn();
    B.toast('TROPHY: a real fish, hung on the wall.');
  }
}
async function onPoster() {
  if (busy) return;
  const B = Bx(), C = cat();
  if (C.stage >= 2) { B.play('click'); B.toast('just a paw print. she is gone.'); return; }
  if (C.stage === 0) { meowRapid(); return; }
  busy = true;
  try {
    if (B.S.fishCaught) await reveal();
    else await say(DLG.nag[nagIdx++ % DLG.nag.length]);
  } finally { busy = false; }
}

/* ================= styles ================= */
const css = `
.poster img{display:block;width:100%;height:100%;object-fit:contain;filter:saturate(.62) brightness(.86) contrast(1.05)}
.poster.hascat::after{content:"";position:absolute;inset:0;background:#10551f;mix-blend-mode:color;opacity:.42;pointer-events:none}
.poster.wig{animation:catwig .22s}
@keyframes catwig{25%{transform:rotate(-3deg) scale(1.05)}75%{transform:rotate(3deg) scale(1.05)}}
.paw{position:relative;width:100%;height:100%}
.paw i{position:absolute;background:#2f7a40;border-radius:50%;box-shadow:0 0 .5em rgba(57,255,90,.25)}
.paw .pad{left:24%;top:46%;width:52%;height:36%;border-radius:50% 50% 45% 45%}
.paw .t1{left:6%;top:30%;width:19%;height:22%}.paw .t2{left:28%;top:10%;width:19%;height:24%}
.paw .t3{left:53%;top:10%;width:19%;height:24%}.paw .t4{left:75%;top:30%;width:19%;height:22%}
.trophy{left:14.8em;top:4.2em;width:3.8em;height:4.8em;border:.25em solid #8a6d1c;background:#07120a;display:flex;align-items:center;justify-content:center;box-shadow:0 0 1em rgba(255,215,90,.22)}
.trophy img{width:88%;filter:saturate(.7) brightness(.9) sepia(.2) hue-rotate(40deg)}
@media (max-width:700px){#shelf{overflow-x:auto}}

#vhsScreen .static,#vhsScreen .nosig{pointer-events:none}
#vhsScreen.aqua #vhsCanvas{display:block}
#vhsScreen.aqua #vhsImg{display:none!important}
#vhsScreen.aqua .static{opacity:.05}

.cat-dlg{position:fixed;inset:0;z-index:48;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(transparent 55%,rgba(0,0,0,.55));cursor:pointer;font-family:'VT323','Lucida Console',monospace}
.cat-stack{width:min(92vw,46em);margin-bottom:3vh;display:flex;flex-direction:column;transform:translateY(130%);transition:transform .3s cubic-bezier(.2,.9,.3,1.1)}
.cat-dlg.in .cat-stack{transform:none}
.cat-dlg.out .cat-stack{transform:translateY(130%)}
.cat-sprite{align-self:flex-start;height:min(40vh,60vmin);width:auto;margin:0 0 -1.4em 1em;position:relative;z-index:1;pointer-events:none;animation:catpop .3s;
  filter:sepia(1) saturate(2.1) hue-rotate(-12deg) brightness(.95) contrast(1.05) drop-shadow(0 0 .5em rgba(255,215,90,.45))}
.cat-sprite.charred{filter:sepia(1) brightness(.3) contrast(1.2)}
@keyframes catpop{0%{transform:translateY(12%) scale(.94)}60%{transform:translateY(-3%) scale(1.03)}100%{transform:none}}
.cat-box{position:relative;background:rgba(2,10,4,.95);border:.18em solid #ffd75a;box-shadow:0 0 0 .18em #000,0 0 1.4em rgba(255,215,90,.3);border-radius:.3em;padding:.9em 1.1em 1em;font-size:clamp(20px,3.2vmin,32px);color:#fff;min-height:5.4em}
.cat-name{position:absolute;top:-1.15em;left:1em;background:#ffd75a;color:#1a1400;padding:0 .7em;letter-spacing:.15em;font-size:.85em}
.cat-txt{line-height:1.2;white-space:pre-wrap;min-height:3.6em}
.cat-next{position:absolute;right:.8em;bottom:.3em;color:#ffd75a;animation:blink 1s steps(1) infinite}

.bt-ov{position:fixed;inset:0;z-index:46;background:#000;color:#fff;font-family:'VT323','Lucida Console',monospace;font-size:clamp(18px,3vmin,30px);overflow:hidden;animation:lkin .4s;user-select:none;touch-action:none}
.bt-ov.shake{animation:catshake .35s}
.bt-ov.dead{background:#200000;transition:background .6s}
@keyframes catshake{0%,100%{transform:none}20%{transform:translate(-8px,4px)}40%{transform:translate(8px,-4px)}60%{transform:translate(-6px,-3px)}80%{transform:translate(6px,3px)}}
.bt-cat{position:absolute;left:50%;top:2%;height:30vh;transform:translateX(-50%);filter:sepia(1) saturate(2.1) hue-rotate(-12deg) brightness(.95) contrast(1.05) drop-shadow(0 0 .5em rgba(255,215,90,.45));pointer-events:none}
.bt-cv{position:absolute;inset:0;width:100%;height:100%}
.bt-bubble{position:absolute;left:calc(50% + 15vh);top:4%;max-width:min(36vw,26em);background:#fff;color:#000;padding:.5em .8em;border-radius:.5em;pointer-events:none;line-height:1.15}
.bt-bubble::before{content:"";position:absolute;left:-.6em;top:1.1em;border:.4em solid transparent;border-right-color:#fff}
.bt-ui{position:absolute;left:0;right:0;bottom:2.5vh;display:flex;flex-direction:column;align-items:center;gap:1.2vh;pointer-events:none}
.bt-flavor{width:min(80vw,34em);text-align:left;min-height:1.2em}
.bt-hp{display:flex;align-items:center;gap:.6em}
.bt-bar{width:8em;height:1em;background:#c00}.bt-bar i{display:block;height:100%;width:100%;background:#ff0;transition:width .2s}
.bt-menu{display:flex;gap:1.4vw;pointer-events:none}
.bt-menu button{pointer-events:auto;background:#000;color:#ff8a00;border:.15em solid #ff8a00;padding:.1em 1em;font-size:1em;letter-spacing:.1em}
.bt-menu button:hover{background:#ff8a00;color:#000}
.bt-keys{opacity:.5;font-size:.7em}
.bt-ov.calm .bt-ui,.bt-ov.calm .bt-bubble{display:none}
.bt-eat{position:absolute;left:50%;top:48%;height:46vh;transform:translate(-50%,-50%);filter:sepia(1) saturate(2.1) hue-rotate(-12deg) brightness(.95) drop-shadow(0 0 .5em rgba(255,215,90,.45));pointer-events:none}
.bt-eat.swell{animation:btswell 1.6s ease-in forwards}
@keyframes btswell{0%{transform:translate(-50%,-50%) scale(1)}20%{transform:translate(-52%,-50%) scale(1.15) rotate(-3deg)}40%{transform:translate(-48%,-50%) scale(1.3) rotate(3deg)}60%{transform:translate(-52%,-50%) scale(1.5) rotate(-4deg)}80%{transform:translate(-48%,-50%) scale(1.75) rotate(4deg)}100%{transform:translate(-50%,-50%) scale(2.1)}}
.bt-flash{position:absolute;inset:0;background:#fff;animation:btflash 1.2s forwards;pointer-events:none}
@keyframes btflash{0%{opacity:1}100%{opacity:0}}
.bt-p{position:absolute;left:50%;top:50%;color:#ffd75a;font-size:clamp(22px,4vmin,40px);opacity:1;transition:transform 1.3s cubic-bezier(.1,.8,.3,1),opacity 1.3s;pointer-events:none;text-shadow:0 0 .4em #ffd75a}
.bt-trophy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.85);color:#ffd75a;animation:lkin .5s;font-size:1.4em;letter-spacing:.2em;text-shadow:0 0 .5em #ffd75a}
.bt-trophy img{height:30vh;filter:drop-shadow(0 0 1em #ffd75a);margin-bottom:.5em}
.bt-trophy small{opacity:.7;letter-spacing:.1em}
`;
const stEl = document.createElement('style'); stEl.textContent = css; document.head.appendChild(stEl);

/* ================= init ================= */
function init() {
  const B = Bx(); if (!B) return;
  const old = posterEl();
  if (old) { const n = old.cloneNode(false); old.replaceWith(n); n.addEventListener('click', onPoster); }
  applyPoster(); applyTrophy(); refreshFishBtn();
  const prev = window.lkHandle;
  window.lkHandle = async tk => { if (prev && await prev(tk)) return true; return handleCat(tk); };
}
window.addEventListener('load', init);
window.FIHCat = { say, battle, handleCat, BAY };
})();
