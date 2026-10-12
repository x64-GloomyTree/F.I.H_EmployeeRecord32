/* hq-minigame.js : "Certified Taxonomist Aptitude Test" (hidden behind the search engine's lucky button).
   HQMinigame.taxonomy(view, done)  -> calls done() when the player passes. */
(() => {
'use strict';
const SD = window.HQ_SITE;
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];

const BINS = [
  { id: 'agn', name: 'Jawless fishes', sci: 'Agnatha', tip: 'No true jaws. Round sucker or slit mouth. No paired fins.' },
  { id: 'chon', name: 'Cartilaginous fishes', sci: 'Chondrichthyes', tip: 'Skeleton of cartilage. Gill slits visible. Sharks, rays.' },
  { id: 'act', name: 'Ray-finned bony fishes', sci: 'Actinopterygii', tip: 'Bony skeleton. Fins held by thin rays. One gill cover.' },
  { id: 'sar', name: 'Lobe-finned fishes', sci: 'Sarcopterygii', tip: 'Bony skeleton. Fleshy, limb-like paired fins.' }
];
const SPEC = [
  { k: 'clown', bin: 'act', traits: ['Skeleton: bone', 'Fins: thin rays', 'Gill cover: yes'] },
  { k: 'shark', bin: 'chon', traits: ['Skeleton: cartilage', 'Jaws: yes', 'Gills: 5 open slits'] },
  { k: 'manta', bin: 'chon', traits: ['Skeleton: cartilage', 'Body: flattened wings', 'Gills: slits underneath'] },
  { k: 'lamprey', bin: 'agn', traits: ['Jaws: none', 'Mouth: round sucker', 'Paired fins: none'] },
  { k: 'coel', bin: 'sar', traits: ['Skeleton: bone', 'Fins: lobed and fleshy', 'Living fossil: yes'] },
  { k: 'hagfish', bin: 'agn', traits: ['Jaws: none', 'Body: eel-like, slime glands', 'Paired fins: none'] },
  { k: 'tuna', bin: 'act', traits: ['Skeleton: bone', 'Fins: thin rays', 'Built for speed'] },
  { k: 'ray', bin: 'chon', traits: ['Skeleton: cartilage', 'Body: flat disc', 'Gills: slits underneath'] }
];
const RANKS = [['Kingdom', 'Animalia'], ['Phylum', 'Chordata'], ['Class', 'Actinopterygii'], ['Family', 'Pomacentridae'], ['Genus', 'Amphiprion'], ['Species', 'A. ocellaris']];
const ADS = [
  ['Hot carp in your area!', 'Local fish want to meet you.', 'MEET'],
  ['Your ocean is slow!', 'Download more water instantly.', 'DOWNLOAD'],
  ['You are the 1,000,000th visitor!', 'Claim your free cod.', 'CLAIM'],
  ['Doctors hate this one trick', 'Breathe through gills in 5 days.', 'LEARN'],
  ['Premium scales, 70% off', 'Limited time. Limited fish.', 'SHOP']
];
const CAPT = [
  ['fish', '<svg viewBox="0 0 60 36"><ellipse cx="32" cy="18" rx="22" ry="11" fill="#ff9f43"/><path d="M10 18 L2 8 V28Z" fill="#ff9f43"/><circle cx="44" cy="15" r="2" fill="#102"/></svg>'],
  ['cat', '<svg viewBox="0 0 60 36"><ellipse cx="30" cy="22" rx="18" ry="11" fill="#444"/><circle cx="30" cy="12" r="9" fill="#444"/><path d="M22 6 L24 0 L28 5Z M38 6 L36 0 L32 5Z" fill="#444"/></svg>'],
  ['boot', '<svg viewBox="0 0 60 36"><path d="M18 2 h14 v18 l14 6 v8 H14 z" fill="#8a5a2a"/></svg>'],
  ['sand', '<svg viewBox="0 0 60 36"><path d="M6 24 L30 6 L54 24Z" fill="#e8c27a"/><rect x="6" y="24" width="48" height="5" fill="#6aa84f"/></svg>'],
  ['cloud', '<svg viewBox="0 0 60 36"><path d="M10 26 q-8 -10 6 -12 q4 -10 16 -4 q12 -4 14 8 q8 4 0 8z" fill="#cfe6f5"/><circle cx="46" cy="16" r="1.6" fill="#456"/></svg>'],
  ['anchor', '<svg viewBox="0 0 60 36"><path d="M30 4v26M20 14h20M12 22q4 10 18 10t18 -10" stroke="#556" stroke-width="3" fill="none"/></svg>'],
  ['fish', '<svg viewBox="0 0 60 36"><ellipse cx="30" cy="18" rx="22" ry="9" fill="#4fc3e8"/><path d="M52 18 L60 8 V28Z" fill="#4fc3e8"/><circle cx="16" cy="16" r="2" fill="#102"/></svg>'],
  ['bread', '<svg viewBox="0 0 60 36"><rect x="8" y="8" width="44" height="22" rx="10" fill="#d8a45a"/></svg>'],
  ['fish', '<svg viewBox="0 0 60 36"><ellipse cx="30" cy="18" rx="20" ry="8" fill="#9bd36a"/><path d="M10 18 L2 10 V26Z" fill="#9bd36a"/><circle cx="42" cy="16" r="2" fill="#102"/></svg>']
];

function taxonomy(view, done) {
  const root = el('div', 'tx'); view.innerHTML = ''; view.appendChild(root);
  const st = { conf: 100, specs: shuffle(SPEC), i: 0, done: false, ads: 0 };
  const timers = []; let adT = 0;
  const T = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clean = () => { timers.forEach(clearTimeout); clearTimeout(adT); st.done = true; };

  const css = el('style'); css.textContent = CSS; root.appendChild(css);
  const body = el('div', 'tx-body'); root.appendChild(body);
  const bar = el('div', 'tx-bar', '<b>Certified Taxonomist Aptitude Test</b><span id="txC">confidence 100%</span>'); root.insertBefore(bar, body);
  const setConf = d => { st.conf = Math.max(0, st.conf + d); bar.querySelector('#txC').textContent = 'confidence ' + st.conf + '%'; };

  function scheduleAd() {
    clearTimeout(adT);
    adT = setTimeout(() => { if (!root.isConnected || st.done) return; spawnAd(); scheduleAd(); }, 9000 + Math.random() * 9000);
  }
  function spawnAd() {
    if (root.querySelectorAll('.tx-ad').length >= 2) return;
    const a = pick(ADS), side = Math.random() < .5;
    const n = el('div', 'tx-ad', `<div class="tx-adh"><span>Advertisement</span><b>x</b></div><div class="tx-adb"><strong>${a[0]}</strong><p>${a[1]}</p><button>${a[2]}</button></div>`);
    n.style[side ? 'left' : 'right'] = '1em'; n.style.top = (45 + Math.random() * 30) + '%';
    root.appendChild(n);
    const x = n.querySelector('b'); let dodged = 0;
    x.addEventListener('pointerenter', () => { if (dodged < 2) { dodged++; x.style.transform = `translate(${(Math.random() - .5) * 120}px,${(Math.random() - .5) * 60}px)`; } });
    x.addEventListener('click', () => n.remove());
    n.querySelector('button').addEventListener('click', () => { n.querySelector('.tx-adb').innerHTML = '<p>Thank you for being sponsored.</p>'; T(() => n.remove(), 1200); });
  }

  /* ---- screens ---- */
  function intro() {
    body.innerHTML = `<div class="tx-card"><h2>Partner verification</h2><p>F.I.H partner portal access requires an ichthyology aptitude certificate. This 4-step test takes about 3 minutes and is completely optional if you do not want to see the deep research.</p><ul><li>Step 1: Sort specimens by class</li><li>Step 2: Prove you are not a fish</li><li>Step 3: Order the ranks of a fish</li><li>Step 4: Prove it again, politely</li></ul><label><input type="checkbox" id="txTos"> I have read the 142 pages of Terms. I have not.</label><button id="txGo" disabled>Begin test</button></div>`;
    const c = body.querySelector('#txTos'), b = body.querySelector('#txGo');
    c.onchange = () => { b.disabled = !c.checked; };
    b.onclick = () => { scheduleAd(); sortRound(); };
  }
  function sortRound() {
    if (st.i >= st.specs.length) return captcha1();
    const s = st.specs[st.i], f = SD.fish[s.k];
    body.innerHTML = `<div class="tx-prog">Step 1 of 4 &middot; specimen ${st.i + 1}/${st.specs.length}</div>
    <div class="tx-sort"><div class="tx-spec" id="txSpec" draggable="false"><div class="tx-pic">${window.HQSites.fishImg(s.k, 360)}</div><b>${f.name}</b><i>${f.sci}</i><div class="tx-chips">${s.traits.map(t => `<span>${t}</span>`).join('')}</div></div>
    <div class="tx-bins">${BINS.map(b => `<button class="tx-bin" data-b="${b.id}"><b>${b.name}</b><i>${b.sci}</i><small>${b.tip}</small></button>`).join('')}</div></div><div class="tx-msg" id="txMsg">Drag the specimen into a class, or tap a class.</div>`;
    const spec = body.querySelector('#txSpec'), msg = body.querySelector('#txMsg');
    const choose = id => {
      if (id === s.bin) { spec.classList.add('ok'); msg.textContent = 'Correct. Filed under ' + BINS.find(b => b.id === id).sci + '.'; T(() => { st.i++; sortRound(); }, 650); }
      else { setConf(-10); spec.classList.remove('bad'); void spec.offsetWidth; spec.classList.add('bad'); msg.textContent = 'Not quite. Read the observation chips and the class notes.'; }
    };
    body.querySelectorAll('.tx-bin').forEach(b => {
      b.onclick = () => choose(b.dataset.b);
      b.ondragover = e => { e.preventDefault(); b.classList.add('over'); }; b.ondragleave = () => b.classList.remove('over');
      b.ondrop = e => { e.preventDefault(); b.classList.remove('over'); choose(b.dataset.b); };
    });
    spec.draggable = true; spec.ondragstart = e => e.dataTransfer.setData('text', 'spec');
    /* pointer drag for touch and mouse */
    let drag = null;
    spec.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; spec.setPointerCapture(e.pointerId); spec.style.transition = 'none'; });
    spec.addEventListener('pointermove', e => { if (!drag) return; spec.style.transform = `translate(${e.clientX - drag.x}px,${e.clientY - drag.y}px) rotate(${(e.clientX - drag.x) / 40}deg)`; });
    spec.addEventListener('pointerup', e => {
      if (!drag) return; const moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y); drag = null; spec.style.transition = ''; spec.style.transform = '';
      if (moved > 30) { const t = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList && n.classList.contains('tx-bin')); if (t) choose(t.dataset.b); }
    });
  }
  function captcha1() {
    const tiles = shuffle(CAPT).slice(0, 9);
    body.innerHTML = `<div class="tx-prog">Step 2 of 4</div><div class="tx-cap"><div class="tx-caph">Select all squares with a <b>fish</b></div><div class="tx-capg">${tiles.map((t, i) => `<div class="tx-tile" data-i="${i}">${t[1]}</div>`).join('')}</div><button id="txVer">Verify</button><div class="tx-msg" id="txMsg2"></div></div>`;
    body.querySelectorAll('.tx-tile').forEach(n => n.onclick = () => n.classList.toggle('sel'));
    body.querySelector('#txVer').onclick = () => {
      const m = body.querySelector('#txMsg2'), pct = 60 + (Math.random() * 38 | 0);
      m.textContent = 'Verifying...';
      T(() => { m.textContent = `Result: you are ${pct}% likely to be a fish. Close enough.`; T(rankRound, 1700); }, 900);
    };
  }
  function rankRound() {
    const want = RANKS.slice(); let n = 0; const shuf = shuffle(RANKS);
    body.innerHTML = `<div class="tx-prog">Step 3 of 4</div><div class="tx-rank"><h3>Ocellaris clownfish</h3><p>Tap the ranks from the broadest to the narrowest. <small>(Mnemonic: Kings Play Chess On Fine Green Silk. We skipped Order. Do not tell anyone.)</small></p>
    <div class="tx-order" id="txOrd"></div><div class="tx-pool">${shuf.map(r => `<button class="tx-r" data-r="${r[0]}">${r[0]}<small>${r[1]}</small></button>`).join('')}</div><div class="tx-msg" id="txMsg3"></div></div>`;
    const ord = body.querySelector('#txOrd'), msg = body.querySelector('#txMsg3');
    body.querySelectorAll('.tx-r').forEach(b => b.onclick = () => {
      if (b.classList.contains('used')) return;
      if (b.dataset.r === want[n][0]) { b.classList.add('used'); ord.appendChild(el('div', 'tx-o', `${want[n][0]}: <b>${want[n][1]}</b>`)); n++; msg.textContent = ''; if (n === want.length) T(captcha2, 900); }
      else { setConf(-5); msg.textContent = 'Wrong rank. Think big to small: a kingdom contains a phylum.'; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400); }
    });
  }
  function captcha2() {
    body.innerHTML = `<div class="tx-prog">Step 4 of 4</div><div class="tx-cap"><label class="tx-nf"><input type="checkbox" id="txNF"> <span id="txNFL">I am not a fish</span></label><div class="tx-wob" id="txWob"><i>f</i><i>I</i><i>s</i><i>H</i></div><input id="txIn" placeholder="type the letters you see" autocomplete="off"><button id="txOk">Submit</button><div class="tx-msg" id="txMsg4"></div></div>`;
    const cb = body.querySelector('#txNF'); let dodge = 0;
    const lab = body.querySelector('#txNFL');
    cb.addEventListener('pointerenter', () => { if (dodge < 2) { dodge++; cb.parentNode.style.transform = `translateX(${dodge * 38}px)`; } });
    body.querySelector('#txOk').onclick = () => {
      const m = body.querySelector('#txMsg4'), v = body.querySelector('#txIn').value.trim().toLowerCase();
      if (!cb.checked) { m.textContent = 'Please confirm you are not a fish.'; return; }
      if (v === 'fish') { m.textContent = 'Fish detected. Welcome, colleague.'; T(finish, 1100); }
      else { setConf(-5); m.textContent = 'Incorrect. A non-fish would have typed what it saw.'; }
    };
  }
  function finish() {
    clean();
    const grade = st.conf >= 90 ? 'Senior Ichthyologist' : st.conf >= 60 ? 'Associate Ichthyologist' : 'Probationary Ichthyologist';
    body.innerHTML = `<div class="tx-card tx-cert"><h2>Certificate of aptitude</h2><p>This certifies that <span class="tx-scr">XXXXXXXX XXXXXXXXX</span> has demonstrated sufficient knowledge of fish.</p><div class="tx-grade">${grade}</div><p>Confidence: ${st.conf}%</p><p class="tx-small">Your employee features have been enabled on the F.I.H website.</p><button id="txFin">Return to Trawl</button></div>`;
    body.querySelector('#txFin').onclick = () => done();
    root.querySelectorAll('.tx-ad').forEach(n => n.remove());
  }
  intro();
  return clean;
}

const CSS = `
.tx{position:absolute;inset:0;overflow:auto;background:linear-gradient(#e8f4fb,#cfe7f4);font-family:Segoe UI,Tahoma,sans-serif;color:#123;font-size:.95em}
.tx-bar{display:flex;justify-content:space-between;padding:.6em 1.2em;background:linear-gradient(#2c8fc4,#16537f);color:#fff}
.tx-body{padding:1.2em;max-width:52em;margin:0 auto}
.tx-card{background:#fff;border:1px solid #9fc2d8;border-radius:.6em;padding:1.4em 1.6em;box-shadow:0 .3em 1em #0b6a9c22}.tx-card h2{margin-bottom:.6em;color:#0b6a9c;font-weight:500}.tx-card ul{margin:1em 0 1em 1.4em}.tx-card label{display:block;margin:1em 0}
.tx button{padding:.55em 1.4em;border:1px solid #2b6f96;border-radius:.4em;background:linear-gradient(#fff,#cfe7f4);color:#123;font:inherit;cursor:pointer}.tx button:disabled{opacity:.45;cursor:default}.tx button:hover:not(:disabled){background:linear-gradient(#fff,#b4daee)}
.tx-prog{font-size:.8em;letter-spacing:.1em;text-transform:uppercase;color:#4a6577;margin-bottom:.6em}
.tx-sort{display:flex;gap:1.2em;flex-wrap:wrap;align-items:flex-start}
.tx-spec{width:15em;background:#fff;border:1px solid #9fc2d8;border-radius:.6em;padding:.8em;text-align:center;cursor:grab;touch-action:none;transition:transform .25s;box-shadow:0 .3em 1em #0b6a9c33}.tx-spec i{display:block;color:#567;font-size:.85em;margin-bottom:.4em}
.tx-spec.ok{outline:3px solid #4fc66a}.tx-spec.bad{animation:txSh .35s}
@keyframes txSh{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.tx-pic{height:9em;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:.4em;background:#dff0f8;margin-bottom:.5em}.tx-pic img{width:100%;height:100%;object-fit:cover}.tx-pic .ph{width:80%}
.tx-chips{display:flex;flex-direction:column;gap:.25em;margin-top:.4em}.tx-chips span{font-size:.78em;background:#e8f4fb;border:1px solid #b9d8e8;border-radius:1em;padding:.15em .6em}
.tx-bins{flex:1;min-width:16em;display:grid;grid-template-columns:1fr 1fr;gap:.7em}
.tx-bin{display:flex!important;flex-direction:column;text-align:left;padding:.8em!important;height:100%}.tx-bin i{font-size:.8em;color:#567}.tx-bin small{margin-top:.4em;font-size:.72em;color:#456}.tx-bin.over{background:#bfe8ff!important;outline:2px solid #2c8fc4}
.tx-msg{margin-top:1em;min-height:1.3em;font-size:.9em;color:#2b5870}
.tx-cap{background:#fff;border:1px solid #9fc2d8;border-radius:.4em;padding:1em;max-width:22em;margin:0 auto;text-align:center}.tx-caph{background:#2c8fc4;color:#fff;padding:.7em;margin:-1em -1em 1em;text-align:left}
.tx-capg{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-bottom:1em}.tx-tile{aspect-ratio:1;background:#eef5f9;cursor:pointer;padding:.4em;border:3px solid transparent}.tx-tile.sel{border-color:#2c8fc4;background:#cfe7f4}.tx-tile svg{width:100%;height:100%}
.tx-nf{display:inline-block;transition:transform .25s;margin-bottom:1em;font-size:1.05em}
.tx-wob{margin:.6em 0 1em;font-size:2.4em;letter-spacing:.15em;font-family:Georgia,serif;background:repeating-linear-gradient(45deg,#dbe9f1 0 4px,#fff 4px 8px);padding:.1em}.tx-wob i{display:inline-block;font-style:italic;animation:txWb 1.4s ease-in-out infinite alternate}.tx-wob i:nth-child(2){animation-delay:-.4s}.tx-wob i:nth-child(3){animation-delay:-.8s;transform:rotate(-8deg)}
@keyframes txWb{to{transform:translateY(5px) rotate(7deg)}}
.tx-cap input#txIn{display:block;width:100%;padding:.5em;margin-bottom:.8em;border:1px solid #9fc2d8}
.tx-rank{background:#fff;border:1px solid #9fc2d8;border-radius:.6em;padding:1.2em}.tx-order{min-height:2em;margin:1em 0}.tx-o{padding:.35em .8em;margin:.2em 0;background:#e6f6ea;border-left:4px solid #4fc66a}
.tx-pool{display:flex;gap:.6em;flex-wrap:wrap}.tx-r small{display:block;opacity:0;height:0;font-size:.7em}.tx-r.used{opacity:.3}.tx-r.bad{background:#ffd3d3!important}
.tx-cert{text-align:center}.tx-scr{background:#111;color:#111;padding:0 .4em;letter-spacing:.1em}.tx-grade{font-size:1.5em;color:#0b6a9c;margin:.6em 0}.tx-small{font-size:.8em;color:#567}
.tx-ad{position:absolute;z-index:6;width:15em;border:2px solid #c8503c;background:#fff9d6;box-shadow:0 .4em 1em #0006;animation:txAd .3s ease-out}
@keyframes txAd{from{transform:scale(.7);opacity:0}}
.tx-adh{display:flex;justify-content:space-between;padding:.2em .5em;background:#c8503c;color:#fff;font-size:.75em}.tx-adh b{cursor:pointer;transition:transform .15s;background:#fff3;padding:0 .4em}
.tx-adb{padding:.7em;text-align:center;font-size:.85em}.tx-adb p{margin:.4em 0}.tx-adb button{background:linear-gradient(#ffe27a,#f1b800)!important}
`;
window.HQMinigame = { taxonomy };
})();
