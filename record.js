// record.js : clickable clues inside book pages + a "record" drawer at the bottom of the screen
// Page syntax:  {{c:id|command text}}  {{a:id|argument text}}  {{n|free note}}
(() => {
'use strict';
const B = () => window.FIHBridge;

// Order in which command rows appear in the record. arg:false = command takes no argument.
const ORDER = [
  { id: 'diag',    arg: false },
  { id: 'auth',    arg: true },
  { id: 'unseal',  arg: true },
  { id: 'suspend', arg: true },
  { id: 'cut',     arg: true },
  { id: 'release', arg: true }
];

const css = `
.clue{color:#ffd75a;text-shadow:0 0 .4em rgba(255,215,90,.7);border-bottom:1px dotted #ffd75a;background:rgba(255,215,90,.08);cursor:pointer}
.clue:hover{background:rgba(255,215,90,.28)}
.clue.got{color:#9fffb0;border-bottom-color:#9fffb0;text-shadow:0 0 .4em rgba(57,255,90,.7);background:none}
.rec-panel{position:fixed;right:3vmin;bottom:0;width:min(94vw,26em);max-height:46vh;z-index:42;display:flex;flex-direction:column;background:#010a03;border:1px solid #1f9e3a;border-bottom:0;color:#39ff5a;font-family:'VT323','Lucida Console',monospace;font-size:clamp(17px,2.6vmin,26px);text-shadow:0 0 .35em rgba(57,255,90,.45);transform:translateY(calc(100% - 1.7em));transition:transform .35s cubic-bezier(.6,0,.3,1)}
.rec-panel.open{transform:none}
.rec-head{display:flex;justify-content:space-between;align-items:center;padding:.15em .7em;height:1.7em;cursor:pointer;letter-spacing:.15em;background:#04170a;flex:none}
.rec-head:hover{background:#07330f}
.rec-body{padding:.4em .8em .8em;overflow-y:auto}
.rec-sec{color:#1f9e3a;letter-spacing:.15em;margin-top:.5em}
.rec-row{line-height:1.25;color:#d6ffdd;white-space:pre-wrap}
.rec-row.dim{opacity:.5}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

const panel = document.createElement('div');
panel.className = 'rec-panel'; panel.hidden = true;
panel.innerHTML = '<div class="rec-head"><span>[ RECORD ]</span><span class="rec-arrow">^</span></div><div class="rec-body"></div>';
document.body.appendChild(panel);
const head = panel.querySelector('.rec-head'), body = panel.querySelector('.rec-body'), arrow = panel.querySelector('.rec-arrow');
let open = false;

function setOpen(v) {
  open = v; panel.classList.toggle('open', v); arrow.textContent = v ? 'v' : '^';
  if (v) refresh();
}
head.addEventListener('click', () => { if (B()) B().play('click'); setOpen(!open); });
addEventListener('keydown', e => { if (open && e.key === 'Escape') setOpen(false); });

function slot(S) { S.clues = S.clues || {}; S.notes = S.notes || []; return S; }
const row = (t, cls) => { const d = document.createElement('div'); d.className = 'rec-row' + (cls ? ' ' + cls : ''); d.textContent = t; body.appendChild(d); };
const sec = t => { const d = document.createElement('div'); d.className = 'rec-sec'; d.textContent = t; body.appendChild(d); };

function refresh() {
  if (!B()) return;
  const S = slot(B().S);
  body.textContent = '';
  sec('COMMANDS');
  let any = false;
  ORDER.forEach(o => {
    const c = S.clues[o.id + ':c'], a = S.clues[o.id + ':a'];
    if (!c && !a) return;
    any = true;
    row(o.arg ? (c || '[???]') + ' ' + (a || '[???]') : (c || '[???]'));
  });
  if (!any) row('nothing recorded yet', 'dim');
  sec('NOTES');
  if (S.notes.length) S.notes.forEach(n => row(n)); else row('none', 'dim');
}

function isGot(kind, id, txt) {
  const S = slot(B().S);
  if (kind === 'n') return S.notes.includes(txt);
  return S.clues[id + ':' + kind] === txt;
}
function markAll() {
  document.querySelectorAll('.clue').forEach(el => el.classList.toggle('got', isGot(el.dataset.kind, el.dataset.id, el.dataset.text)));
}
function add(kind, id, txt) {
  const S = slot(B().S);
  if (kind === 'n') { if (!S.notes.includes(txt)) S.notes.push(txt); }
  else S.clues[id + ':' + kind] = txt;
  B().save(); B().play('click'); B().toast('added to your record');
  markAll(); if (open) refresh();
}

const RE = /\{\{(c|a|n)(?::(\w+))?\|(.+?)\}\}/g;
function render(el, text) {
  el.textContent = '';
  if (!B()) { el.textContent = text.replace(RE, '$3'); return; }
  let last = 0, m; RE.lastIndex = 0;
  while ((m = RE.exec(text))) {
    el.appendChild(document.createTextNode(text.slice(last, m.index)));
    const sp = document.createElement('span');
    sp.className = 'clue'; sp.textContent = m[3];
    sp.dataset.kind = m[1]; sp.dataset.id = m[2] || ''; sp.dataset.text = m[3];
    if (isGot(m[1], m[2] || '', m[3])) sp.classList.add('got');
    sp.addEventListener('click', () => add(sp.dataset.kind, sp.dataset.id, sp.dataset.text));
    el.appendChild(sp);
    last = RE.lastIndex;
  }
  el.appendChild(document.createTextNode(text.slice(last)));
}

// show the drawer only in the console, and only once the player is elevated
function sync() {
  const con = document.getElementById('console');
  const on = !!(B() && B().S.adminOpen && con && con.classList.contains('active'));
  panel.hidden = !on;
  if (!on && open) setOpen(false);
}
setInterval(sync, 400);

window.FIHRecord = { render, refresh };
})();
