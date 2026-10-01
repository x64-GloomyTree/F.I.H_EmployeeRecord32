(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pad = (n, l = 2) => String(n).padStart(l, '0');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const touchy = matchMedia('(hover: none)').matches;

/* ---------- state (saved in localStorage) ---------- */
const DEF = { lockOpen:false, adminOpen:false, view:0, lamp:false, fragments:[], mounted:false, log:[], history:[], pages:{}, read:[], sound:true };
let S = structuredClone(DEF);
try { Object.assign(S, JSON.parse(localStorage.getItem(CFG.saveKey) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(CFG.saveKey, JSON.stringify(S)); } catch (e) {} };
window.fihReset = () => { try { localStorage.removeItem(CFG.saveKey); } catch (e) {} location.reload(); };

async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
window.sha = sha;

/* ---------- audio ---------- */
const aud = {}; let audioOn = false;
function getAud(n) {
  if (!aud[n]) {
    const c = CFG.sounds[n]; if (!c) return null;
    const a = new Audio(c.src); a.loop = !!c.loop; a.volume = c.vol ?? 0.5; a.preload = 'auto'; aud[n] = a;
  }
  return aud[n];
}
function play(n) {
  if (!S.sound || !audioOn) return;
  const a = getAud(n); if (!a) return;
  if (CFG.sounds[n].loop) { a.play().catch(() => {}); return; }
  const b = a.cloneNode(); b.volume = a.volume; b.play().catch(() => {});
}
function stop(n) { const a = aud[n]; if (a) { a.pause(); a.currentTime = 0; } }
addEventListener('pointerdown', () => {
  if (!audioOn) { audioOn = true; play('fan'); if (S.sound) FIHMusic.start().then(musicSync); }
});

/* ---------- toast ---------- */
let tt;
function toast(m) {
  const t = $('#toast'); t.textContent = m; t.classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- scenes ---------- */
let current = 'room';
function show(id) { current = id; $$('.scene').forEach(s => s.classList.toggle('active', s.id === id)); }

const stage = $('#stage'), roomEl = $('#room');
let zooming = false;
function enterRoom() {
  stopVhs();
  stage.classList.add('notrans'); stage.classList.remove('zoom'); void stage.offsetWidth; stage.classList.remove('notrans');
  show('room');
}

/* parallax */
let tx = 0, ty = 0, cx = 0, cy = 0;
addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2;
});
(function loop(t) {
  if (touchy) { tx = Math.sin(t / 2600) * 0.7; ty = Math.cos(t / 3300) * 0.3; }
  if (current === 'room') {
    cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
    roomEl.style.setProperty('--mx', cx.toFixed(3)); roomEl.style.setProperty('--my', cy.toFixed(3));
  }
  requestAnimationFrame(loop);
})(0);

/* room clickables */
function applyLamp() { roomEl.classList.toggle('lamp-on', S.lamp); }
$('#lamp').addEventListener('click', () => { S.lamp = !S.lamp; applyLamp(); play('click'); save(); toast(S.lamp ? 'the lamp flickers on.' : 'darkness again.'); });
$('#mug').addEventListener('click', () => { play('click'); toast('cold coffee. it has been here since "the incident".'); });
$('#floppy').addEventListener('click', () => { play('click'); toast('label: BACKUP_FINAL_v2_REAL (the last two words are scratched out)'); });
$('#poster').addEventListener('click', () => { play('click'); toast('"HANG IN THERE". the cat is no longer in the picture.'); });
$('#postItText').textContent = CFG.postItText;

$('#screenHit').addEventListener('click', () => {
  if (zooming) return; zooming = true; play('click'); stage.classList.add('zoom');
  setTimeout(() => { zooming = false; S.lockOpen ? openConsole(true) : openLock(); }, 850);
});
$$('[data-room]').forEach(b => b.addEventListener('click', enterRoom));

/* ---------- lockscreen ---------- */
function openLock() { show('lock'); $('#lockPw').value = ''; $('#lockMsg').textContent = ''; setTimeout(() => $('#lockPw').focus(), 60); }
$('#lockPw').addEventListener('keydown', () => play('key'));
$('#lockForm').addEventListener('submit', async e => {
  e.preventDefault();
  const v = $('#lockPw').value;
  if (await sha(v) === CFG.lockHash) {
    S.lockOpen = true; save(); $('#lockMsg').textContent = 'Welcome.'; $('#lockMsg').className = 'ok';
    play('crt'); setTimeout(() => openConsole(true), 600);
  } else {
    play('error'); $('#lockMsg').textContent = 'Incorrect password. Please try again.'; $('#lockMsg').className = 'bad';
    const u = $('.xp-user'); u.classList.remove('shake'); void u.offsetWidth; u.classList.add('shake');
    $('#lockPw').value = ''; $('#lockPw').focus();
  }
});

/* ---------- console views ---------- */
const con = $('#console'); let view = 0;
function musicSync() { FIHMusic.update({ view, mounted: S.mounted, enabled: S.sound }); }
function updateArrows() {
  const L = $('#arrL'), R = $('#arrR');
  L.hidden = !S.adminOpen || view === -1; R.hidden = !S.adminOpen || view === 1;
  L.querySelector('span').textContent = view === 1 ? 'TERMINAL' : 'ARCHIVE';
  R.querySelector('span').textContent = view === -1 ? 'TERMINAL' : 'PLAYBACK';
}
function setView(v) {
  view = v; S.view = v; con.style.setProperty('--view', v); updateArrows(); musicSync();
  if (v === 1) startVhs(); else stopVhs();
  if (v === 0) setTimeout(focusIn, 400);
  save();
}
function applyAdmin() { updateArrows(); }
$('#arrL').addEventListener('click', () => { play('click'); setView(view - 1); });
$('#arrR').addEventListener('click', () => { play('click'); setView(view + 1); });
let sx = 0, sy = 0;
con.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
con.addEventListener('touchend', e => {
  if (!S.adminOpen || !$('#bookView').hidden) return;
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > 80 && Math.abs(dy) < 60) { const n = view + (dx < 0 ? 1 : -1); if (n >= -1 && n <= 1) setView(n); }
}, { passive: true });

let booted = false;
function openConsole(power) {
  show('console');
  const f = $('#console .crt-frame');
  if (power) { f.classList.remove('powering'); void f.offsetWidth; f.classList.add('powering'); }
  if (!booted) {
    booted = true;
    if (S.log.length) S.log.forEach(e => addLine(e.t, e.c, false));
    else { addLine(BANNER, 'banner'); addLine('Type --help for a list of commands.'); save(); }
  }
  setView(S.adminOpen ? S.view : 0);
}

/* ---------- terminal ---------- */
const out = $('#out'), inp = $('#cmd');
let busy = false, hi = S.history.length;
const focusIn = () => { if (current === 'console' && view === 0) inp.focus({ preventScroll: true }); };
$('#pTerm').addEventListener('click', e => { if (!getSelection().toString()) focusIn(); });

function addLine(text, cls = '', persist = true) {
  const d = document.createElement('div'); d.className = 'ln ' + cls; d.textContent = text; out.appendChild(d);
  out.scrollTop = out.scrollHeight;
  if (persist) { S.log.push({ t: text, c: cls }); if (S.log.length > 250) S.log.splice(0, S.log.length - 250); }
}
async function printSeq(lines, d = 150, cls = '') { for (const l of lines) { addLine(l, cls); await sleep(d); } }

function help() {
  const L = ['AVAILABLE COMMANDS', '  --help             show this list', '  ls | dir           list files', '  cat <file>         print a file',
    '  whoami             current user', '  date               system date', '  uname              system info', '  echo <text>        print text',
    '  ping <host>        test a link', '  status             system status', '  history            command history', '  clear              clear the screen',
    '  reboot             restart the session', '  sound on|off       toggle sound', '  exit               leave the terminal', '  admin --bypass <password>'];
  if (S.adminOpen) L.push('', 'ELEVATED', '  notes              recovered fragments', '  mount cd <volume>  insert a tape', '  eject              remove the tape');
  L.forEach(l => addLine(l));
}
function notes() {
  const parts = CLUES.map(c => S.fragments.includes(c.id) ? c.frag : '____');
  addLine('RECOVERED FRAGMENTS (' + S.fragments.length + '/' + CLUES.length + ')');
  addLine('  ' + parts.join(' - '));
  addLine('Assemble them in order to name the volume.', 'dim');
}
async function doClue(cl) {
  await printSeq(cl.out, 200);
  if (!S.fragments.includes(cl.id)) S.fragments.push(cl.id);
  addLine('FRAGMENT STORED [' + cl.frag + ']  (' + S.fragments.length + '/' + CLUES.length + ')  type: notes');
}

const CMDS = {
  'help': async () => help(), '--help': async () => help(), '-h': async () => help(), '?': async () => help(),
  'clear': async () => { out.innerHTML = ''; S.log = []; },
  'cls': async () => { out.innerHTML = ''; S.log = []; },
  'ls': async () => {
    const f = Object.keys(FILES); if (S.adminOpen) f.push('notes.log', '[ARCHIVE]', '[PLAYBACK]');
    f.forEach(x => addLine('  ' + x));
  },
  'whoami': async () => addLine(S.adminOpen ? 'c.employee (ELEVATED)' : 'c.employee (guest)'),
  'date': async () => addLine(new Date().toString()),
  'uname': async () => addLine('FIH-OS 2.06 build 0603 cam06-ws x86'),
  'echo': async a => addLine(a.join(' ')),
  'sudo': async () => addLine('nice try.', 'err'),
  'cd': async () => addLine(S.adminOpen ? 'cd: use the arrows to move between rooms.' : 'cd: permission denied', 'err'),
  'history': async () => S.history.forEach((h, i) => addLine('  ' + pad(i + 1, 3) + '  ' + h)),
  'ping': async a => { const h = a[0] || 'hq-gateway'; await printSeq(['pinging ' + h + ' ...', 'reply: time=12ms', 'reply: time=14ms', 'reply: timeout', 'reply: time=??ms'], 230); },
  'status': async () => {
    addLine('CAM06 ........ ONLINE (no subject)'); addLine('LINK ......... UNSTABLE');
    addLine('ARCHIVE ...... ' + (S.adminOpen ? 'UNLOCKED' : 'LOCKED')); addLine('PLAYBACK ..... ' + (S.mounted ? 'TAPE LOADED' : S.adminOpen ? 'EMPTY' : 'LOCKED'));
  },
  'cat': async a => {
    const n = (a[0] || '').toLowerCase();
    if (!n) return addLine('usage: cat <file>');
    if (n === 'notes.log' && S.adminOpen) return notes();
    if (FILES[n]) FILES[n].forEach(l => addLine(l)); else addLine('cat: ' + a[0] + ': no such file', 'err');
  },
  'sound': async a => {
    if (a[0] === 'off') { S.sound = false; Object.keys(aud).forEach(stop); musicSync(); addLine('sound: off'); }
    else if (a[0] === 'on') { S.sound = true; audioOn = true; play('fan'); FIHMusic.start().then(musicSync); addLine('sound: on'); }
    else addLine('usage: sound on|off');
  },
  'exit': async () => { addLine('closing session...'); await sleep(350); enterRoom(); },
  'reboot': async () => {
    out.innerHTML = ''; S.log = [];
    await printSeq(['FIH-BIOS v2.06', 'memory test ....... OK', 'cam06 link ........ UNSTABLE', 'loading shell ..... OK', ''], 260);
    addLine(BANNER, 'banner'); addLine('Type --help for a list of commands.');
  },
  'admin': async a => {
    if (a[0] !== '--bypass' || !a[1]) return addLine('usage: admin --bypass <password>');
    if (S.adminOpen) return addLine('already elevated.');
    if (await sha(a.slice(1).join(' ')) === CFG.adminHash) {
      play('crt');
      await printSeq(['verifying credentials...', 'bypass accepted.', 'ELEVATION GRANTED', 'rooms unlocked: ARCHIVE (left), PLAYBACK (right)'], 380);
      S.adminOpen = true; applyAdmin(); save();
    } else { play('error'); addLine('ACCESS DENIED. attempt logged.', 'err'); }
  },
  'notes': async () => S.adminOpen ? notes() : addLine("'notes' is not recognized as a command. Type --help.", 'err'),
  'eject': async () => {
    if (!S.adminOpen) return addLine("'eject' is not recognized as a command. Type --help.", 'err');
    if (!S.mounted) return addLine('eject: no tape loaded.');
    S.mounted = false; updateVhs(); addLine('tape ejected.');
  },
  'mount': async a => {
    if (!S.adminOpen) return addLine("'mount' is not recognized as a command. Type --help.", 'err');
    if ((a[0] || '').toLowerCase() !== 'cd' || !a[1]) return addLine('usage: mount cd <volume>');
    const name = a.slice(1).join(' ').toUpperCase();
    await printSeq(['reading volume ' + name + ' ...'], 500);
    if (await sha(name) === CFG.cdHash) {
      await printSeq(['volume found.', 'tape inserted into PLAYBACK unit.'], 350);
      S.mounted = true; updateVhs(); addLine('go to the right room to play it.');
    } else { play('error'); addLine('mount: volume not found.', 'err'); }
  }
};

async function run(raw) {
  addLine('C:\\HQ> ' + raw, 'cmd');
  const line = raw.trim(); if (!line) return;
  S.history.push(line); if (S.history.length > 100) S.history.shift();
  const tk = line.split(/\s+/), key = tk.map(x => x.toLowerCase()).join(' ');
  if (S.adminOpen) { const cl = CLUES.find(x => x.cmd === key); if (cl) return doClue(cl); }
  const fn = CMDS[tk[0].toLowerCase()];
  if (fn) await fn(tk.slice(1)); else addLine("'" + tk[0] + "' is not recognized as a command. Type --help.", 'err');
}
inp.addEventListener('keydown', async e => {
  if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) play('key');
  if (e.key === 'Enter') {
    if (busy) return; const v = inp.value; inp.value = ''; busy = true;
    try { await run(v); } finally { busy = false; hi = S.history.length; save(); }
  } else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; inp.value = S.history[hi] || ''; } }
  else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < S.history.length - 1) { hi++; inp.value = S.history[hi]; } else { hi = S.history.length; inp.value = ''; } }
  else if (e.key === 'Tab') {
    e.preventDefault(); const p = inp.value.toLowerCase(); if (!p) return;
    const m = Object.keys(CMDS).filter(c => c.startsWith(p)); if (m.length === 1) inp.value = m[0];
  }
});

/* ---------- library ---------- */
let previewId = null, curBook = null, page = 0;
function showCover(b) {
  previewId = b.id; $('#coverArt').textContent = b.cover; $('#coverTitle').textContent = b.title; $('#coverAuthor').textContent = 'by ' + b.author;
  $$('.book').forEach(x => x.classList.toggle('sel', x.dataset.id === b.id));
}
function buildShelf() {
  const sh = $('#shelf'); sh.innerHTML = '';
  BOOKS.forEach(b => {
    const d = document.createElement('button'); d.className = 'book'; d.dataset.id = b.id;
    d.style.setProperty('--h', (b.h || 9) + 'em'); d.style.setProperty('--w', (b.w || 2.2) + 'em');
    const s = document.createElement('span'); s.textContent = b.spine || b.title; d.appendChild(s);
    if (!touchy) { d.addEventListener('mouseenter', () => showCover(b)); d.addEventListener('focus', () => showCover(b)); }
    d.addEventListener('click', () => { if (touchy && previewId !== b.id) { showCover(b); play('click'); } else openBook(b); });
    sh.appendChild(d);
  });
}
function openBook(b) {
  curBook = b; page = Math.min(S.pages[b.id] || 0, b.pages.length - 1);
  $('#bookView').hidden = false; renderPage(); if (!S.read.includes(b.id)) S.read.push(b.id); play('click'); save();
}
function renderPage() {
  $('#bkTitle').textContent = curBook.title; $('#bkText').textContent = curBook.pages[page];
  $('#bkNum').textContent = (page + 1) + ' / ' + curBook.pages.length;
  $('#bkPrev').disabled = page === 0; $('#bkNext').disabled = page === curBook.pages.length - 1;
  S.pages[curBook.id] = page; save();
}
function turn(d) { const n = page + d; if (n >= 0 && n < curBook.pages.length) { page = n; renderPage(); play('click'); } }
function closeBook() { $('#bookView').hidden = true; play('click'); }
$('#bkPrev').addEventListener('click', () => turn(-1));
$('#bkNext').addEventListener('click', () => turn(1));
$('#bkClose').addEventListener('click', closeBook);

/* ---------- VHS ---------- */
const vBox = $('#vhsScreen'), vImg = $('#vhsImg');
function updateVhs() {
  const on = S.mounted;
  $('#vhsInfo').hidden = !on; $('#vcr').classList.toggle('loaded', on);
  $('#vhsState').textContent = on ? 'TAPE LOADED' : 'NO TAPE'; $('#ejectBtn').hidden = !on;
  $('.nosig').textContent = on ? 'LOADING...' : 'NO TAPE'; $('#vhsHint').hidden = on;
  if (!on) { vImg.removeAttribute('src'); vBox.classList.remove('playing', 'loading'); stop('vhs'); save(); }
  else if (view === 1) startVhs();
  musicSync();
  save();
}
function startVhs() {
  if (!S.mounted) return;
  vBox.classList.remove('playing'); vBox.classList.add('loading'); play('vhs');
  setTimeout(() => { if (!S.mounted) return; vImg.src = CFG.cdGif + '?r=' + Date.now(); vBox.classList.remove('loading'); vBox.classList.add('playing'); }, 900);
}
function stopVhs() { stop('vhs'); }
$('#ejectBtn').addEventListener('click', () => { S.mounted = false; updateVhs(); toast('tape ejected.'); });

const T0 = new Date(CFG.stopwatchStart).getTime();
function fmt(ms) {
  ms = Math.max(0, ms);
  const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3), x = Math.floor(ms % 1e3);
  return pad(d) + ':' + pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(x, 3);
}
(function sw() {
  if (S.mounted && view === 1 && current === 'console') $('#elapsed').textContent = isNaN(T0) ? '--:--:--:--:---' : fmt(Date.now() - T0);
  requestAnimationFrame(sw);
})();

/* ---------- keys ---------- */
addEventListener('keydown', e => {
  if (!$('#bookView').hidden) {
    if (e.key === 'Escape') closeBook(); else if (e.key === 'ArrowRight') turn(1); else if (e.key === 'ArrowLeft') turn(-1);
    return;
  }
  if (e.key === 'Escape' && (current === 'console' || current === 'lock')) enterRoom();
});

/* ---------- noise ---------- */
const nc = $('#noise'), nx = nc.getContext('2d');
function rs() { nc.width = innerWidth / 3; nc.height = innerHeight / 3; }
rs(); addEventListener('resize', rs);
setInterval(() => {
  const im = nx.createImageData(nc.width, nc.height), d = im.data;
  for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  nx.putImageData(im, 0, 0);
}, 90);

/* ---------- init ---------- */
applyLamp(); buildShelf(); updateVhs(); con.style.setProperty('--view', 0); show('room');
})();
