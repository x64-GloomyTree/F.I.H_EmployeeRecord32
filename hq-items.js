/* hq-items.js : pickups, item viewer, bottom item tab, PC login, tier gate.
   Load AFTER hq.js:  <script src="hq-items.js"></script>
   Content lives in hq-data.js (HQ_DATA.card, HQ_DATA.creds, items with pickup / pc / gate). */
(() => {
'use strict';
const D = window.HQ_DATA, $ = s => document.querySelector(s);
const SAVE = 'fih_hq_layer2_v1';
const S = () => { const s = window.HQ.HQ; s.inv = s.inv || {}; s.tier = s.tier || 0; return s; };
const save = () => localStorage.setItem(SAVE, JSON.stringify(S()));
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');

const CSS = `
#itemTab{position:fixed;z-index:44;left:.9em;bottom:.9em;padding:.4em 1em;border-radius:.7em;font-size:calc(.85rem*var(--ui,1));letter-spacing:.08em;color:#eaf6ff;border:1px solid #ffffff77;background:linear-gradient(#ffffff38,#ffffff10 50%,#0000 51%),#0a2234dd;box-shadow:0 .3em 1em #0009;cursor:pointer;font-family:inherit}
#itemTab:hover,#itemTab:focus-visible{background:linear-gradient(#ffffff55,#ffffff1a 50%,#0000 51%),#124060dd;outline:none}
#itemBar{position:fixed;z-index:44;left:.9em;bottom:3.4em;display:flex;flex-direction:column;gap:.35em}
#itemBar .chip{padding:.45em 1em;border-radius:.6em;border:1px solid #ffffff77;background:linear-gradient(#ffffff30,#ffffff0c),#0a2234ee;color:#eaf6ff;font:inherit;font-size:calc(.9rem*var(--ui,1));text-align:left;cursor:pointer;animation:ipop .18s ease-out}
#itemBar .chip:hover{background:linear-gradient(#ffffff50,#ffffff18),#124060ee}
@keyframes ipop{from{transform:translateY(.5em);opacity:0}}
#iv,#pc{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2em;background:radial-gradient(ellipse at 50% 45%,#0a203099,#020812ee);backdrop-filter:blur(5px);font-family:"Segoe UI",Tahoma,sans-serif;color:#eaf6ff;touch-action:manipulation}
.ibtns{display:flex;gap:.7em;flex-wrap:wrap;justify-content:center}
.ibtns button{padding:.55em 1.3em;border-radius:.7em;border:1px solid #ffffff77;background:linear-gradient(#ffffff38,#ffffff0c 50%,#0000 51%),#0c2c44dd;color:#eaf6ff;font:inherit;font-size:calc(.95rem*var(--ui,1));cursor:pointer}
.ibtns button:hover,.ibtns button:focus-visible{background:linear-gradient(#ffffff55,#ffffff1a 50%,#0000 51%),#14507a;outline:none}
.ihint{font-size:.8rem;opacity:.55}

/* ID card */
.card3d{perspective:90rem;width:min(30rem,86vw,66vh*1.586);aspect-ratio:1.586;cursor:pointer;animation:cin .5s ease-out,touch-action:none}
@keyframes cin{from{transform:translateY(2em) scale(.9);opacity:0}}
.cardin{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.3,.1,.2,1)}
.tilt{width:100%;height:100%;transform-style:preserve-3d;will-change:transform}
.glw{position:absolute;inset:0;border-radius:4% / 6.4%;overflow:hidden;pointer-events:none;transform:translateZ(2px);opacity:0;transition:opacity .25s}
.card3d.hot .glw{opacity:1}
.card3d.flipping .glw{opacity:0!important}
.gl{position:absolute;inset:-50%;background:radial-gradient(circle at 50% 50%,#ffffff55,#fff0 32%);will-change:transform}
.card3d{position:relative}
.card3d::before{content:"";position:absolute;inset:4% 3% -2%;border-radius:5%;box-shadow:0 1.2rem 3rem #000b;pointer-events:none}
.face{box-shadow:inset 0 0 0 1px #ffffffaa}
#iv{backdrop-filter:none;background:radial-gradient(ellipse at 50% 45%,#0a2030f2,#020812f8)}
.card3d.flip .cardin{transform:rotateY(180deg)}
.face{position:absolute;inset:0;backface-visibility:hidden;border-radius:4% / 6.4%;overflow:hidden;box-shadow:0 1.2rem 3rem #000b,inset 0 0 0 1px #ffffffaa;font-size:min(1.05rem,2.6vw,2.2vh)}
.front{background:linear-gradient(115deg,#fff 0,#e6f1f7 40%,#c3d8e4 100%)}
.front::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,#fff0 35%,#ffffffaa 48%,#fff0 60%);pointer-events:none}
.back{transform:rotateY(180deg);background:linear-gradient(115deg,#eef4f8,#cfdde7)}
.clip{position:absolute;left:50%;top:2.5%;width:14%;height:3.4%;transform:translateX(-50%);border-radius:1em;background:#1b2a36;box-shadow:inset 0 0 .2em #fff6}
.ch{position:absolute;left:0;right:0;top:9%;height:15%;padding:0 6%;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(#2c8fc4,#16537f);color:#fff}
.ch b{letter-spacing:.3em;font-size:1.3em}.ch span{font-size:.62em;letter-spacing:.2em;opacity:.8}
.cbody{position:absolute;left:6%;right:6%;top:28%;bottom:12%;display:flex;gap:5%}
.photo{width:30%;border-radius:.4em;background:repeating-linear-gradient(0deg,#1d2830 0 3px,#222f39 3px 6px);display:flex;align-items:center;justify-content:center;color:#8aa;font-size:.6em;letter-spacing:.2em;box-shadow:inset 0 0 1em #000}
.cf{flex:1;display:flex;flex-direction:column;justify-content:space-between;color:#13222d}
.cf label{font-size:.5em;letter-spacing:.2em;color:#4a6577;margin-bottom:-.35em}
.cf div{font-size:.95em;font-weight:600}
.scratch{position:relative;font-family:Consolas,monospace;letter-spacing:.1em;color:#13222d}
.scratch::after{content:"";position:absolute;left:-2%;right:-2%;top:-15%;bottom:-15%;background:repeating-linear-gradient(-14deg,#0b0b0e 0 2px,#0000 2px 4px),repeating-linear-gradient(17deg,#0b0b0e 0 2px,#0000 2px 5px);background-color:#1118;border-radius:.2em}
.cstrip{position:absolute;left:0;right:0;bottom:0;height:7%;background:repeating-linear-gradient(90deg,#16537f 0 .6em,#2c8fc4 .6em 1.2em)}
.mag{position:absolute;left:0;right:0;top:9%;height:15%;background:#15171b}
.bk{position:absolute;left:7%;right:7%;top:29%;font-size:.58em;line-height:1.55;color:#2b3f4d;letter-spacing:.03em}
.bk p{margin-bottom:.45em}
.hand{position:absolute;left:7%;right:7%;bottom:21%;font-family:"Segoe Print","Bradley Hand","Comic Sans MS",cursive;font-size:.95em;color:#1a3fa8;transform:rotate(-2deg);line-height:1.25}
.doodle{position:absolute;right:7%;bottom:11%;width:24%}
.bar{position:absolute;left:7%;bottom:7%;width:44%;height:11%;background:repeating-linear-gradient(90deg,#111 0 2px,#0000 2px 4px,#111 4px 5px,#0000 5px 9px,#111 9px 12px,#0000 12px 14px)}

/* PC */
.pcbox{width:min(26rem,90vw);padding:1.6em 1.8em;border-radius:1em;background:linear-gradient(#ffffff2e,#ffffff08 40%,#0000 41%),#08202eee;border:1px solid #ffffff77;box-shadow:0 1rem 3rem #000c;display:flex;flex-direction:column;gap:.8em;animation:cin .35s ease-out}
.pcbox.shake{animation:pcsh .35s}
@keyframes pcsh{25%{transform:translateX(-.5em)}75%{transform:translateX(.5em)}}
.pct{letter-spacing:.2em;font-size:.85rem;color:#7fe0ff}
.pcs{font-size:1.15rem;font-weight:300}
.pcbox input{padding:.6em .8em;border-radius:.5em;border:1px solid #ffffff66;background:#02101a;color:#eaf6ff;font:inherit;font-family:Consolas,monospace;outline:none;-webkit-user-select:text;user-select:text}
.pcbox input:focus{border-color:#4fc3e8;box-shadow:0 0 .8em #4fc3e866}
#pcE{min-height:1.2em;font-size:.85rem;color:#ff8f8f}
.pcrow{display:flex;justify-content:space-between;font-size:.9rem;padding:.3em 0;border-bottom:1px solid #ffffff1a}
.pcrow b{color:#7fe0ff;font-weight:600}
.mgbox{min-height:7rem;border:1px dashed #ffffff55;border-radius:.6em;display:flex;align-items:center;justify-content:center;text-align:center;padding:1em;font-size:.9rem;opacity:.8}
body.hc #iv,body.hc #pc{background:#000e}
`;

const T = () => D.card;
let ui;
function init() {
  if (ui) return;
  const st = el('style'); st.textContent = CSS; document.head.appendChild(st);
  ui = { tab: el('button'), bar: el('div'), iv: el('div'), pc: el('div') };
  ui.tab.id = 'itemTab'; ui.tab.type = 'button'; ui.bar.id = 'itemBar'; ui.iv.id = 'iv'; ui.pc.id = 'pc';
  ui.tab.hidden = ui.bar.hidden = ui.iv.hidden = ui.pc.hidden = true;
  Object.values(ui).forEach(n => document.body.appendChild(n));
  ui.tab.addEventListener('click', () => { ui.bar.hidden = !ui.bar.hidden; window.HQ.sfx.click(); });
  addEventListener('keydown', e => {
    if (!ui.iv.hidden && (e.key === 'f' || e.key === 'F' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) flip();
  });
  addEventListener('pointerdown', e => { if (!ui.bar.hidden && !e.target.closest('#itemBar,#itemTab')) ui.bar.hidden = true; });
  refresh();
}
function refresh() {
  init();
  const keys = Object.keys(S().inv).filter(k => S().inv[k]);
  ui.tab.hidden = !keys.length || $('#room').hidden;
  ui.tab.textContent = 'ITEMS (' + keys.length + ')';
  ui.bar.innerHTML = '';
  keys.forEach(k => {
    const b = el('button', 'chip', D.pickups[k].name); b.type = 'button';
    b.onclick = () => { ui.bar.hidden = true; view(k); };
    ui.bar.appendChild(b);
  });
}

/* ---------- card viewer ---------- */
const flip = () => {
  const c = ui.iv.querySelector('.card3d'); if (!c) return;
  c.classList.toggle('flip'); c.classList.add('flipping'); window.HQ.sfx.click();
  clearTimeout(c._ft); c._ft = setTimeout(() => c.classList.remove('flipping'), 720);
};
function cardHTML(c) {
  return `<div class="card3d"><div class="tilt"><div class="cardin">
  <div class="face front"><i class="clip"></i>
    <div class="ch"><b>${c.org}</b><span>${c.orgSub}</span></div>
    <div class="cbody"><div class="photo">NO IMAGE</div>
      <div class="cf">
        <label>NAME</label><div class="scratch">${c.nameHidden}</div>
        <label>EMPLOYEE NO.</label><div>${c.no}</div>
        <label>DEPARTMENT</label><div>${c.dept}</div>
        <label>CLEARANCE</label><div>${c.tier}</div>
        <label>ISSUED</label><div>${c.issued}</div>
      </div></div>
    <i class="cstrip"></i></div>
  <div class="face back"><i class="mag"></i>
    <div class="bk">${c.backPrinted.map(t => '<p>' + t + '</p>').join('')}</div>
    <div class="hand">${c.note}</div>
    <svg class="doodle" viewBox="0 0 60 36" fill="none" stroke="#1a3fa8" stroke-width="1.6" stroke-linecap="round"><circle cx="46" cy="9" r="5"/><path d="M46 0v2M56 9h-2M38 9h-2M53 2l-1.5 1.5M39 2l1.5 1.5"/><path d="M2 24c5-3 8 3 13 0s8 3 13 0 8 3 13 0 8 3 13 0M6 31c5-3 8 3 13 0s8 3 13 0 8 3 13 0"/></svg>
    <i class="bar"></i></div>
  </div><div class="glw"><i class="gl"></i></div></div></div>`;
}
function view(key) {
  init(); if (!ui.pc.hidden) return;
  const c = ui.iv; c.hidden = false; window.HQ.sfx.open();
  if (key === 'idcard') c.innerHTML = cardHTML(T()) + '<div class="ibtns"><button type="button" id="ivFlip">Flip</button><button type="button" id="ivPut">Put away</button></div><div class="ihint">click the card or press F to flip, Esc to put away</div>';
  c.querySelector('.card3d').addEventListener('click', flip);
  c.querySelector('#ivFlip').addEventListener('click', flip);
  c.querySelector('#ivPut').addEventListener('click', closeView);
  bindTilt(c.querySelector('.card3d'));
}
function closeView() { if (ui.iv.hidden) return false; ui.iv.hidden = true; ui.iv.innerHTML = ''; window.HQ.sfx.close(); return true; }
function bindTilt(card) {
  const t = card.querySelector('.tilt'); if (!t) return;
  const gl = [...card.querySelectorAll('.gl')];
  let tx = 0, ty = 0, ts = 1, tgx = .5, tgy = .5;
  let cx = 0, cy = 0, cs = 1, gx = .5, gy = .5, raf = 0, rect = null;
  const measure = () => { rect = card.getBoundingClientRect(); };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  function frame() {
    cx += (tx - cx) * .2; cy += (ty - cy) * .2; cs += (ts - cs) * .18;
    gx += (tgx - gx) * .22; gy += (tgy - gy) * .22;
    t.style.transform = `rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg) scale(${cs.toFixed(3)})`;
    const gt = `translate(${((gx - .5) * 70).toFixed(1)}%,${((gy - .5) * 70).toFixed(1)}%)`;
    gl.forEach(n => n.style.transform = gt);
    const moving = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(ts - cs) * 40 + Math.abs(tgx - gx) > .02;
    raf = moving ? requestAnimationFrame(frame) : 0;
  }
  card.addEventListener('pointerenter', () => {
    if (window.HQ.ST.motion) return;
    measure(); ts = 1.04; card.classList.add('hot'); kick();
  });
  card.addEventListener('pointermove', e => {
    if (window.HQ.ST.motion) return;
    if (!rect) measure();
    const px = (e.clientX - rect.left) / rect.width, py = (e.clientY - rect.top) / rect.height;
    tx = (.5 - py) * 28; ty = (px - .5) * 36; tgx = px; tgy = py; kick();
  });
  const off = () => { tx = ty = 0; ts = 1; tgx = tgy = .5; card.classList.remove('hot'); kick(); };
  card.addEventListener('pointerleave', off);
  card.addEventListener('pointercancel', off);
  addEventListener('resize', measure);
}
/* ---------- PC ---------- */
function openPC() {
  init(); const p = ui.pc; p.hidden = false; window.HQ.sfx.open();
  if (S().pcUnlocked) return base();
  p.innerHTML = `<div class="pcbox" id="pcBox"><div class="pct">WORKSTATION 02</div><div class="pcs">awaiting credentials</div>
    <input id="pcL" placeholder="login" autocomplete="off" autocapitalize="off" spellcheck="false">
    <input id="pcP" type="password" placeholder="password" autocomplete="off">
    <div id="pcE"></div>
    <div class="ibtns"><button type="button" id="pcGo">Sign in</button><button type="button" id="pcX">Back</button></div></div>`;
  const go = async () => {
    const l = $('#pcL').value.trim().toLowerCase(), pw = $('#pcP').value.trim().toLowerCase();
    const ok = (await sha(l)) === D.creds.loginHash && (await sha(pw)) === D.creds.passHash;
    if (ok) { S().pcUnlocked = true; save(); window.HQ.sfx.open(); base(); }
    else {
      window.HQ.sfx.deny(); $('#pcE').textContent = D.creds.failText;
      const b = $('#pcBox'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); $('#pcP').value = '';
    }
  };
  $('#pcGo').addEventListener('click', go);
  $('#pcX').addEventListener('click', closePC);
  p.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }));
  $('#pcL').focus();
}
function base() {
  ui.pc.innerHTML = '';
  window.HQBrowser.open(ui.pc, {
    onClose: () => {
      ui.pc.hidden = true;
      ui.pc.innerHTML = '';
      window.HQ.sfx.close();
    }
  });
}
function closePC() {
  if (ui.pc.hidden) return false;
  try {
    if (window.HQBrowser && typeof HQBrowser.close === 'function') HQBrowser.close();
  } catch (err) {
    console.warn('browser close failed', err);
  }
  ui.pc.hidden = true;
  ui.pc.innerHTML = '';
  window.HQ.sfx.close();
  return true;
}
/* ---------- hooks used by hq.js ---------- */
function hidden(it) { return !!(it.pickup && S().inv[it.pickup]); }
function handle(it) {
  init();
  if (!ui.iv.hidden || !ui.pc.hidden) return true;
  if (it.pickup) {
    S().inv[it.pickup] = true; save();
    document.querySelector(`.it[data-id="${it.id}"]`)?.remove();
    window.HQ.sfx.open(); refresh(); view(it.pickup); return true;
  }
  if (it.pc) { openPC(); return true; }
  if (it.gate) {
    const ok = S().tier >= it.gate;
    if (!ok) { window.HQ.sfx.deny(); window.HQ.openDlg('', it.lines); return true; }
    S().hqDone = true; save();
    window.HQ.sfx.open();
    leave(it.go || 'next.html');
    return true;
  }
  return false;
}
function closeTop() { return closePC() || closeView() || (!ui.bar.hidden && (ui.bar.hidden = true)); }
const flags = () => S().flags || (S().flags = {});
const flag = (k, v) => { if (v === undefined) return !!flags()[k]; flags()[k] = v; save(); };
const setTier = n => { S().tier = Math.max(S().tier, n); save(); };
const getTier = () => S().tier;
function leave(url) {
  const m = window.HQ.music && window.HQ.music.bgm;
  if (window.HQDeath) {
    window.HQDeath.play({
      pause: m ? [m] : [],
      onBlack: () => { location.href = url; }
    });
    return;
  }
  const f = document.createElement('div');
  f.style.cssText = 'position:fixed;inset:0;z-index:300;background:#000;opacity:0;transition:opacity 1.4s';
  document.body.appendChild(f);
  requestAnimationFrame(() => f.style.opacity = 1);
  setTimeout(() => { location.href = url; }, 1500);
}
window.HQItems = { init, refresh, hidden, handle, closeTop, view, flags, flag, setTier, getTier };
})();
