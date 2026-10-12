/* hq-sites.js : the F.I.H website (surface + abyss) and the fish parody pages. */
(() => {
'use strict';
const SD = window.HQ_SITE;
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const timers = [];

const fishSVG = (c = '#ff9f43', extra = '', cls = '') =>
  `<svg viewBox="0 0 120 60" class="fsvg ${cls}"><path d="M10 30 L38 10 L38 50Z" fill="${c}"/><ellipse cx="72" cy="30" rx="46" ry="23" fill="${c}"/><path d="M60 8 Q74 0 90 10" fill="${c}"/><circle cx="98" cy="25" r="3.5" fill="#102"/><path d="M104 36 q-6 3 -10 0" stroke="#0007" fill="none" stroke-width="1.5"/>${extra}</svg>`;
const BIKINI = c => `<g fill="${c}"><circle cx="64" cy="36" r="7"/><circle cx="78" cy="36" r="7"/><path d="M92 28 L104 34 L92 40Z"/></g><path d="M64 36 L72 18 L78 36" stroke="${c}" fill="none" stroke-width="1.6"/>`;
const imgUrl = (k, w) => SD.imgBase + encodeURIComponent(SD.fish[k].file) + '?width=' + (w || 400);
function fishImg(k, w, cls = '') {
  const f = SD.fish[k];
  if (!f.file) return `<span class="ph ${cls}">${fishSVG(f.color)}</span>`;
  return `<img class="${cls}" alt="${f.name}" loading="lazy" referrerpolicy="no-referrer" src="${imgUrl(k, w)}" onerror="HQSites.imgFail(this,'${k}')">`;
}
function imgFail(img, k) { const s = el('span', 'ph ' + img.className, fishSVG(SD.fish[k].color)); img.replaceWith(s); }

let cssDone = false;
function css() {
  if (cssDone) return; cssDone = true;
  const s = el('style'); s.textContent = CSS; document.head.appendChild(s);
}

/* ===================== F.I.H WEBSITE ===================== */
const PALM = `<svg viewBox="0 0 200 120" class="fs-palms"><path d="M0 120 Q40 96 90 104 T200 100 V120Z" fill="#e8d49a"/><path d="M0 120 Q60 106 110 110 T200 108 V120Z" fill="#d9bf7e"/>
<g stroke="#6b4a2a" stroke-width="3" fill="none" stroke-linecap="round"><path d="M44 104 Q50 70 40 40"/><path d="M78 106 Q70 78 80 52"/><path d="M150 102 Q144 76 154 50"/></g>
<g fill="#2f8f4a"><path d="M40 40 q-22 -4 -34 8 q18 -6 34 -8z M40 40 q22 -6 34 4 q-16 -2 -34 -4z M40 40 q-6 -16 6 -26 q-2 14 -6 26z M40 40 q-14 6 -20 20 q10 -8 20 -20z M40 40 q14 6 18 20 q-10 -8 -18 -20z"/>
<path d="M80 52 q-22 -4 -34 8 q18 -6 34 -8z M80 52 q22 -6 34 4 q-16 -2 -34 -4z M80 52 q-6 -16 6 -26 q-2 14 -6 26z M80 52 q-14 6 -20 20 q10 -8 20 -20z M80 52 q14 6 18 20 q-10 -8 -18 -20z"/>
<path d="M154 50 q-22 -4 -34 8 q18 -6 34 -8z M154 50 q22 -6 34 4 q-16 -2 -34 -4z M154 50 q-6 -16 6 -26 q-2 14 -6 26z M154 50 q-14 6 -20 20 q10 -8 20 -20z M154 50 q14 6 18 20 q-10 -8 -18 -20z"/></g></svg>`;

function surfaceHTML() {
  const S = SD.surface;
  return `<div class="fs-cam"><div class="fs-scroll">
  <header class="fs-top"><div class="fs-logo"><b id="fsLogo">${S.short}</b><span>${S.long}</span></div>
    <nav><a data-go="top">Home</a><a data-go="mission">Our mission</a><a data-go="care">Sustainability</a><a data-go="jobs">Careers</a><a data-go="end">Contact</a></nav></header>
  <section class="fs-hero" id="fs-top">
    <div class="fs-sky"></div><div class="fs-sun"><i></i></div><div class="fs-cloud c1"></div><div class="fs-cloud c2"></div><div class="fs-cloud c3"></div>
    <div class="fs-sea"><i class="w1"></i><i class="w2"></i><i class="w3"></i></div>
    <div class="fs-beach">${PALM}</div><div class="fs-foam"></div>
    <div class="fs-hero-t"><h1>${S.tagline}</h1><p>${S.sub}</p><button class="fs-cta" data-go="mission">Discover our work</button></div>
  </section>
  <section class="fs-sec" id="fs-mission"><h2>Our mission</h2><div class="fs-cards">${S.cards.map(c => `<div class="fs-card"><h3>${c.t}</h3><p>${c.d}</p></div>`).join('')}</div></section>
  <section class="fs-stats" id="fs-care">${S.stats.map(s => `<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</section>
  <section class="fs-sec" id="fs-jobs"><h2>Join the harbor</h2><p class="fs-lead">We hire kind, curious people. No experience with the sea required. Please do not ask about the lower floors.</p></section>
  <section class="fs-deepsec" id="fs-end"><p>Researchers and partners</p><button class="fs-deep-btn" id="fsDeep">${S.deepBtn}</button></section>
  <footer class="fs-foot">&copy; F.I.H. All tides reserved. <span>Privacy</span> <span>Terms</span> <span>Accessibility</span></footer>
  </div></div>`;
}
function deepHTML() {
  const D = SD.deep;
  return `<div class="fs-abyss"><canvas class="fs-cv"></canvas><div class="fs-gl-ov"></div>
  <div class="fs-below"><div class="fs-below-s">${PALM}</div></div>
  <div class="fs-dscroll">
    <div class="fs-dhead"><h1 id="fsHif" class="fs-hif">F.I.H</h1><div id="fsHifSub" class="fs-hifsub"></div></div>
    <div class="fs-dbody">
      ${D.lines.map(l => `<p class="fs-dl gx">${l}</p>`).join('')}
      ${D.quotes.map((q, i) => `<blockquote class="fs-dq gx" style="margin-left:${(i * 17) % 40}%">${q}</blockquote>`).join('')}
      <div class="fs-claim" id="fsClaim" hidden><h3>${D.claimText}</h3>
        <label><input type="checkbox" id="fsChk"> ${D.claimCheck}</label>
        <button id="fsClaimBtn" disabled>${D.claimBtn}</button><div id="fsClaimMsg"></div></div>
      <div class="fs-surfhint">the surface is below you</div>
    </div>
  </div></div>`;
}

function fihPage(view, ctx) {
  css();
  const root = el('div', 'fs-root'); view.appendChild(root);
  const local = [];
  const T = (fn, ms) => { const t = setTimeout(fn, ms); local.push(t); return t; };
  let raf = 0, glitchT = 0, deep = false, claimTimer = 0;

  function mountSurface() {
    deep = false; root.className = 'fs-root'; root.innerHTML = surfaceHTML();
    root.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', () => {
      const id = a.dataset.go, t = id === 'top' ? root.querySelector('.fs-scroll') : root.querySelector('#fs-' + id);
      if (id === 'top') root.querySelector('.fs-scroll').scrollTo({ top: 0, behavior: 'smooth' }); else t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    root.querySelector('#fsDeep').addEventListener('click', () => {
      if (!ctx.flag('mgDone')) return ieAlert(root, 'Windows Internet Explorer', SD.surface.locked);
      turn();
    });
  }
  function ieAlert(host, title, msg) {
    const o = el('div', 'fs-alert', `<div class="fs-alertbox"><div class="fs-alerttitle">${title}<b>x</b></div><div class="fs-alertbody"><i>!</i><p>${msg}</p></div><div class="fs-alertbtn"><button>OK</button></div></div>`);
    host.appendChild(o);
    const close = () => o.remove();
    o.querySelector('button').onclick = close; o.querySelector('b').onclick = close;
  }
  function turn() {
    const sc = root.querySelector('.fs-scroll'); sc.scrollTo({ top: 0, behavior: 'smooth' });
    T(() => {
      root.classList.add('turning'); ctx.audio.dive();
      const ov = el('div', 'fs-turnov'); root.appendChild(ov);
      T(() => ov.classList.add('on'), 2300);
      T(() => { ov.remove(); mountDeep(); }, 3300);
    }, 450);
  }
  function mountDeep() {
    deep = true; root.className = 'fs-root fs-isdeep'; root.innerHTML = deepHTML();
    ctx.flag('deepSeen', true);
    const h = root.querySelector('#fsHif'), sub = root.querySelector('#fsHifSub');
    h.style.transform = 'rotate(180deg)'; h.style.opacity = '.0';
    T(() => { h.style.opacity = '1'; }, 100);
    T(() => { h.classList.add('glitch'); h.textContent = 'H.I.F'; h.style.transform = 'none'; }, 1500);
    T(() => h.classList.remove('glitch'), 2100);
    T(() => typeInto(sub, SD.deep.title, 70), 2300);
    startAbyss(root.querySelector('.fs-cv'));
    startGlitch();
    localStorage.setItem('fih_deep_visits', (+localStorage.getItem('fih_deep_visits') || 0) + 1);
    startHard();
    const sc = root.querySelector('.fs-dscroll'), claim = root.querySelector('#fsClaim');
    const showClaim = () => { claim.hidden = false; };
    sc.addEventListener('scroll', () => { if (sc.scrollTop + sc.clientHeight > sc.scrollHeight - 80) showClaim(); });
    claimTimer = T(showClaim, 40000);
    if (ctx.getTier() >= 1) { showClaim(); claim.querySelector('#fsClaimMsg').textContent = SD.deep.claimDone; claim.querySelector('#fsChk').disabled = true; }
    const chk = claim.querySelector('#fsChk'), btn = claim.querySelector('#fsClaimBtn');
    chk.addEventListener('change', () => { btn.disabled = !chk.checked; });
    btn.addEventListener('click', () => { ctx.setTier(1); btn.disabled = true; chk.disabled = true; claim.querySelector('#fsClaimMsg').textContent = SD.deep.claimDone; ctx.toast('Clearance elevated: TIER 1'); });
  }
  async function typeInto(node, text, ms) {
    node.textContent = '';
    for (let i = 0; i < text.length; i++) { node.textContent = text.slice(0, i + 1); await new Promise(r => T(r, ms)); }
  }
  function startGlitch() {
    const loop = () => {
      glitchT = setTimeout(() => {
        const items = [...root.querySelectorAll('.gx')];
        const n = pick(items), orig = n.textContent;
        if (n) {
          n.textContent = pick(SD.deep.glitch); n.classList.add('glitch');
          const ov = root.querySelector('.fs-gl-ov'); ov.classList.add('on');
          setTimeout(() => { n.textContent = orig; n.classList.remove('glitch'); ov.classList.remove('on'); }, rnd(350, 900));
        }
        if (Math.random() < .4) { const h = root.querySelector('#fsHif'); if (h) { const o = h.textContent; h.textContent = 'F.I.H'; setTimeout(() => h.textContent = o, 260); } }
        loop();
      }, rnd(4000, 9000));
    };
    loop();
  }
  let hardT = 0;
  function startHard() {
    clearTimeout(hardT);
    const loop = () => {
      hardT = setTimeout(() => { if (!root.isConnected || !deep) return; hardGlitch(); loop(); }, rnd(14000, 30000));
    };
    loop();
  }
  function hardGlitch() {
    const ab = root.querySelector('.fs-abyss'); if (!ab) return;
    const st = (window.HQ && window.HQ.ST) || {}, calm = !!(st.flash || st.motion);
    const visits = +localStorage.getItem('fih_deep_visits') || 1;
    const word = () => pick(SD.deep.hard).replace(/\{n\}/g, visits);
    let ov = ab.querySelector('.fs-hard'); if (!ov) { ov = el('div', 'fs-hard'); ab.appendChild(ov); }
    const hif = root.querySelector('#fsHif'), hifOrig = hif ? hif.textContent : '';
    const targets = [root.querySelector('.fs-dscroll'), root.querySelector('.fs-cv')].filter(Boolean);
    const spawn = k => {
      ov.innerHTML = '';
      for (let i = 0; i < k; i++) {
        const w = el('div', 'fs-hw', word());
        w.style.cssText = `left:${rnd(2, 62)}%;top:${rnd(6, 80)}%;font-size:${rnd(3, 9).toFixed(1)}em;transform:rotate(${rnd(-6, 6).toFixed(1)}deg)`;
        ov.appendChild(w);
      }
    };
    ov.className = 'fs-hard on' + (calm ? ' calm' : '');
    if (calm) {
      spawn(1); void ov.offsetWidth; ov.classList.add('show');
      setTimeout(() => { ov.classList.remove('show'); setTimeout(() => { ov.className = 'fs-hard'; ov.innerHTML = ''; }, 600); }, 1200);
      return;
    }
    if (window.HQ && window.HQ.blip) window.HQ.blip(70, .35, .07, 'sawtooth');
    let f = 0; const frames = 6 + (Math.random() * 4 | 0);
    const step = () => {
      if (f >= frames || !root.isConnected) {
        ov.className = 'fs-hard'; ov.innerHTML = ''; targets.forEach(t => t.classList.remove('fs-shake'));
        if (hif) hif.textContent = hifOrig; return;
      }
      ov.classList.toggle('inv', Math.random() < .35);
      spawn(2 + (Math.random() * 3 | 0));
      targets.forEach(t => t.classList.add('fs-shake'));
      if (hif && Math.random() < .6) hif.textContent = word().toUpperCase();
      f++; setTimeout(step, rnd(60, 130));
    };
    step();
  }
  window.__hardGlitch = hardGlitch;
  function startAbyss(cv) {
    const g = cv.getContext('2d'); let W = 0, H = 0, t = 0;
    const snow = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), s: rnd(.6, 2.2), v: rnd(.02, .08) }));
    const jel = Array.from({ length: 4 }, () => ({ x: Math.random(), y: Math.random(), s: rnd(26, 52), p: Math.random() * 6, v: rnd(.01, .03) }));
    const shoal = Array.from({ length: 14 }, (_, i) => ({ x: Math.random(), y: .55 + Math.random() * .12, o: i }));
    const things = [{ k: 'clock', x: .2, y: .3, r: -.4 }, { k: 'card', x: .78, y: .45, r: .5 }, { k: 'key', x: .45, y: .72, r: 1.1 }];
    function size() { const r = cv.getBoundingClientRect(); const w = Math.max(2, r.width | 0), h = Math.max(2, r.height | 0); if (w !== W || h !== H) { W = cv.width = w; H = cv.height = h; } }
    function draw() {
      if (!cv.isConnected) return; size(); t += .016;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#010509'); bg.addColorStop(.7, '#03121f'); bg.addColorStop(1, '#0b3a52');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      const ex = W * (.5 + Math.sin(t * .05) * .25), ey = H * (.28 + Math.cos(t * .04) * .05);
      const eg = g.createRadialGradient(ex, ey, 0, ex, ey, 160); eg.addColorStop(0, '#9fd0ff22'); eg.addColorStop(.35, '#0b1e2e11'); eg.addColorStop(1, '#0000');
      g.fillStyle = eg; g.fillRect(ex - 200, ey - 200, 400, 400);
      g.fillStyle = '#02070c'; g.beginPath(); g.ellipse(ex, ey, 70, 26, 0, 0, 7); g.fill();
      g.fillStyle = '#5da0d533'; g.beginPath(); g.arc(ex + Math.sin(t * .3) * 10, ey, 9, 0, 7); g.fill();
      snow.forEach(p => { p.y += p.v * .01; if (p.y > 1) p.y = 0; g.fillStyle = '#bfe8ff55'; g.fillRect(p.x * W + Math.sin(t + p.s) * 6, p.y * H, p.s, p.s); });
      jel.forEach(j => {
        j.y -= j.v * .004; if (j.y < -.1) j.y = 1.1; const x = j.x * W + Math.sin(t * .6 + j.p) * 20, y = j.y * H, s = j.s * (1 + Math.sin(t * 1.4 + j.p) * .08);
        g.fillStyle = '#5ed0ff22'; g.beginPath(); g.ellipse(x, y, s, s * .7, 0, Math.PI, 0); g.fill();
        g.strokeStyle = '#5ed0ff33'; g.lineWidth = 2;
        for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(x + i * s * .3, y); g.quadraticCurveTo(x + i * s * .3 + Math.sin(t + i + j.p) * 10, y + s, x + i * s * .3, y + s * 1.8); g.stroke(); }
      });
      const ax = W * ((t * .01) % 1.3 - .15), ay = H * .5 + Math.sin(t * .5) * 20;
      g.fillStyle = '#ffe9a0'; g.shadowColor = '#ffe9a0'; g.shadowBlur = 24; g.beginPath(); g.arc(ax + 30, ay - 22, 3.5, 0, 7); g.fill(); g.shadowBlur = 0;
      g.fillStyle = '#04090e'; g.beginPath(); g.ellipse(ax, ay, 30, 18, 0, 0, 7); g.fill();
      shoal.forEach(f => { const x = ((f.x + t * .008 + f.o * .01) % 1.2) * W, y = f.y * H + Math.sin(t + f.o) * 8; g.fillStyle = '#0a1a26'; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y - 5); g.lineTo(x - 14, y + 5); g.fill(); });
      things.forEach(o => {
        const x = o.x * W + Math.sin(t * .3 + o.r) * 16, y = o.y * H + Math.cos(t * .25 + o.r) * 14;
        g.save(); g.translate(x, y); g.rotate(o.r + Math.sin(t * .2) * .2); g.globalAlpha = .55; g.strokeStyle = '#9fd0ff'; g.fillStyle = '#071a28'; g.lineWidth = 2;
        if (o.k === 'clock') { g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -12); g.moveTo(0, 0); g.lineTo(9, 0); g.stroke(); }
        if (o.k === 'card') { g.fillRect(-26, -16, 52, 32); g.strokeRect(-26, -16, 52, 32); g.fillStyle = '#9fd0ff'; g.font = '10px monospace'; g.fillText('032', -8, 4); }
        if (o.k === 'key') { g.strokeRect(-14, -14, 28, 28); g.fillStyle = '#9fd0ff'; g.font = '14px monospace'; g.fillText('?', -4, 5); }
        g.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
  }
  mountSurface();
  return () => { local.forEach(clearTimeout); clearTimeout(glitchT); cancelAnimationFrame(raf); ctx.audio.siteOff(); };
}

/* ===================== PARODY PAGES ===================== */
function frame(cls, head, body) { return `<div class="pp ${cls}"><div class="pp-head">${head}</div><div class="pp-body">${body}</div></div>`; }
const caption = ['blub', 'gm fishes', 'no thoughts, just bubbles', 'swimming is a lifestyle', 'bottom feeder (derogatory)', 'scale of 1 to 10: yes'];

function tube(view) {
  const vids = [['10 HOURS of a fish doing absolutely nothing', '1.2B views', '#ff9f43'], ['I trained my goldfish to say "gm"', '3.4M views', '#ffd75a'], ['Tuna vs Salmon (Gone Wrong) (Not Clickbait)', '812K views', '#3a6ea5'], ['ASMR: Gentle bubbles', '77M views', '#7ad1e0']];
  view.innerHTML = frame('tube', '<b class="tl">FishTube</b><input placeholder="Search"><span>Sign in</span>',
    `<div class="tube-main"><div class="tube-player"><div class="tube-sea"><span class="tf f1">${fishSVG('#ff9f43')}</span><span class="tf f2">${fishSVG('#8ee3ff')}</span><span class="tf f3">${fishSVG('#ffd75a')}</span></div><div class="tube-bar"><i></i></div></div>
    <h3>${vids[0][0]}</h3><div class="pp-sub">${vids[0][1]} &middot; 1 day ago &middot; 4.1M likes</div>
    <div class="pp-com"><b>@sealionking</b> this is the most relaxing thing i have ever seen<br><b>@bubbles_irl</b> the one on the left is judging you<br><b>@dave</b> has anyone seen the archive door</div></div>
    <div class="tube-side">${vids.slice(1).map(v => `<div class="tube-vid"><span style="background:${v[2]}22">${fishSVG(v[2])}</span><div><b>${v[0]}</b><small>${v[1]}</small></div></div>`).join('')}</div>`);
}
function twitch(view) {
  view.innerHTML = frame('twitch', '<b class="tl">Twitchfin</b><span>Browse</span><span>Following</span>',
    `<div class="tw-main"><div class="tw-stream"><canvas class="tw-cv" width="480" height="270"></canvas><div class="tw-live">LIVE</div><div class="tw-view" id="twV">4,712 viewers</div></div>
    <h3>Day 412: any% blub% (no hands) (I have no hands)</h3><div class="pp-sub">xX_Kelpina_Xx &middot; playing FISHQUEST: Reef Souls</div></div>
    <div class="tw-chat"><div class="tw-chat-h">STREAM CHAT</div><div id="twC" class="tw-chat-l"></div></div>`);
  const cv = view.querySelector('.tw-cv'), g = cv.getContext('2d'), chat = view.querySelector('#twC'), vw = view.querySelector('#twV');
  let x = 60, y = 150, vy = 0, sc = 0, t = 0, over = 0, raf = 0, obs = [{ x: 520, w: 24, h: 50 }];
  const msgs = [['KelpKing', 'POG'], ['sardine_fan', 'LUL he has no hands'], ['mod_trout', 'chat behave'], ['plankton99', 'gm'], ['eelectric', 'F in chat'], ['dave', 'is this the archive door level'], ['bubbles', 'blub blub blub'], ['sea_cow', 'KEKW'], ['tuna_tax', 'clip it']];
  const cols = ['#ff7a7a', '#7ad1e0', '#ffd75a', '#b8f58a', '#d49aff'];
  const ct = setInterval(() => { if (!view.isConnected) return; const m = pick(msgs); const d = el('div', '', `<b style="color:${pick(cols)}">${m[0]}</b>: ${m[1]}`); chat.appendChild(d); if (chat.children.length > 14) chat.firstChild.remove(); chat.scrollTop = 1e5; vw.textContent = (4700 + (Math.random() * 90 | 0)).toLocaleString() + ' viewers'; }, 1100);
  function loop() {
    if (!view.isConnected) return; t++;
    g.fillStyle = '#0b2a4a'; g.fillRect(0, 0, 480, 270); g.fillStyle = '#143f6b'; for (let i = 0; i < 6; i++) g.fillRect(((i * 97 - t) % 520 + 520) % 520 - 20, 20 + i * 18, 60, 3);
    g.fillStyle = '#e7d6a8'; g.fillRect(0, 230, 480, 40);
    if (over) { over--; g.fillStyle = '#fff'; g.font = '28px monospace'; g.fillText('GG', 210, 130); if (!over) { x = 60; y = 150; vy = 0; obs = [{ x: 520, w: 24, h: 50 }]; sc = 0; } raf = requestAnimationFrame(loop); return; }
    const o = obs[0]; o.x -= 3.2; if (o.x < -40) { obs = [{ x: 500 + Math.random() * 120, w: 24, h: 40 + Math.random() * 60 }]; sc++; }
    const ob = obs[0], onTop = 230 - ob.h;
    const ty = (ob.x < 200 && ob.x > 20) ? Math.max(40, onTop - 70) : 150; y += (ty - y) * .08; vy = 0;
    g.fillStyle = '#3f7f5a'; g.fillRect(ob.x, 230 - ob.h, ob.w, ob.h);
    g.fillStyle = '#ff9f43'; g.beginPath(); g.ellipse(x, y, 20, 11, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x - 32, y - 9); g.lineTo(x - 32, y + 9); g.fill(); g.fillStyle = '#102'; g.fillRect(x + 10, y - 4, 3, 3);
    g.fillStyle = '#fff'; g.font = '12px monospace'; g.fillText('DEPTH ' + sc + '   HP \u2665\u2665\u2665', 12, 20);
    if (Math.random() < .002) over = 90;
    raf = requestAnimationFrame(loop);
  }
  loop();
  return () => { clearInterval(ct); cancelAnimationFrame(raf); };
}
function wiki(view) {
  view.innerHTML = frame('wiki', '<b class="tl">Wikifishia</b><span>The free fishcyclopedia</span>',
    `<div class="wk-main"><h2>Fish</h2><div class="pp-sub">From Wikifishia, the free fishcyclopedia</div>
    <div class="wk-info">${fishImg('clown', 300)}<small>An ocellaris clownfish. Famous for a film nobody asked about.</small><table><tr><td>Kingdom</td><td>Animalia</td></tr><tr><td>Phylum</td><td>Chordata</td></tr><tr><td>Class</td><td>several (it is complicated)</td></tr><tr><td>Vibe</td><td>aquatic</td></tr></table></div>
    <p><b>Fish</b> are aquatic vertebrates that breathe through gills<sup>[citation needed]</sup>. They are found in nearly every body of water and, according to some editors, in nearly every conversation.</p>
    <p>The term is used loosely: starfish, jellyfish and crayfish are not fish. Silverfish are not fish either, and they are not sorry.</p>
    <h3>See also</h3><ul><li>Water</li><li>Wet</li><li>Not being a fish</li></ul><p class="pp-sub">Photo: janderk, public domain, via Wikimedia Commons.</p></div>`);
}
function r34(view) {
  const keys = ['clown', 'shark', 'manta', 'lamprey', 'coel', 'clown', 'shark', 'manta'];
  view.innerHTML = frame('r34', '<b class="tl">Rule 34: Fish Edition</b><input placeholder="search tags"><span>Posts</span><span>Tags</span>',
    `<div class="r-side"><h4>Popular tags</h4><ul><li>fish <small>12,404</small></li><li>wet <small>9,001</small></li><li>scales <small>6,511</small></li><li>shy_fish <small>3,332</small></li><li>blurred <small>3,330</small></li><li>fin <small>2,018</small></li></ul><p>All images were taken from the internet and blurred for the fish's privacy.</p></div>
    <div class="r-grid">${keys.map((k, i) => `<div class="r-it"><div class="r-pic">${fishImg(k, 260)}<i class="r-mos"></i></div><small>post #${3400 + i * 77} &middot; score ${50 + i * 13}</small></div>`).join('')}</div>`);
}
function bikini(view) {
  const c = [['#ff5fa2', '#ffd75a'], ['#4fc3e8', '#ff9f43'], ['#8af58a', '#d49aff']];
  view.innerHTML = frame('bik', '<b class="tl">Beach Season</b><span>Gallery</span>',
    `<h2>Fish in bikinis</h2><div class="pp-sub">Strictly family friendly. The fish insisted.</div><div class="bk-grid">${c.map((x, i) => `<div class="bk-it">${fishSVG(x[1], BIKINI(x[0]))}<small>${pick(caption)}</small></div>`).join('')}</div>`);
}
function generic(color, name, tag, lines) {
  return view => { view.innerHTML = frame('gen', `<b class="tl" style="color:${color}">${name}</b><span>${tag}</span>`, `<h2>${name}</h2><div class="pp-sub">${tag}</div>${lines.map(l => `<div class="gen-card">${l}</div>`).join('')}`); };
}
const nores = (q) => view => { view.innerHTML = frame('nores', '<b class="tl">Trawl</b>', `<h2>No results for "${String(q || '').replace(/[<>]/g, '')}"</h2><p>Did you mean: <b>fish</b>?</p><ul><li>Check your spelling, or your scales.</li><li>Try fewer keywords. Fish only know about three.</li><li>Look closer at the lucky button. It is not as lucky as it claims.</li></ul>`); };

const pages = {
  fih: fihPage, youtube: tube, twitch, wiki, r34, bikini,
  x: generic('#222', 'Fix (formerly Fwitter)', 'What is happening?!', ['<b>@gm_fish</b> gm', '<b>@tuna_ceo</b> synergy is just schooling with extra steps', '<b>@dave</b> still looking for that door']),
  reddit: generic('#ff4500', 'Fishdit', 'r/fishposting', ['<b>u/blubblub</b> TIL fish do not know they are wet', '<b>u/eelon</b> my fish is staring at me. update: he is still staring', '<b>u/mod</b> posts about sharks must contain at least one shark']),
  google: generic('#4285f4', 'Gillgle', 'Searching the sea', ['You are looking for <b>Trawl</b>. We are a rival fish.', 'Press a tab. Try the plus sign.']),
  discord: generic('#5865f2', 'Fishcord', 'servers', ['# blub-general', '# cursed-aquariums', '# voice: bubbling (3 connected)']),
  github: generic('#24292f', 'Fishhub', 'where the world builds sushi', ['<b>sea-bass-basic</b> a very simple bass', '<b>kelp-forest</b> 4.2k stars, forked by every fish', '<b>fish-shell</b> not what you think, apparently']),
  roblox: generic('#e2231a', 'Robloxfin', 'play as a fish', ['<b>Be a Fish Simulator</b> 14M visits', '<b>Escape the Aquarium (Obby)</b> impossible']),
  minecraft: generic('#5c8d3a', 'Fishcraft', 'blocks and bubbles', ['<b>Cod</b> is dropped when you punch a cod', 'Tropical fish have 2,700 patterns. You will find none of them.'])
};
function build(route, q) { return route === 'nores' ? nores(q) : pages[route]; }

function css_() { return ''; }
const CSS = `
.fs-root{position:absolute;inset:0;overflow:hidden;background:#02101a;font-family:Segoe UI,Tahoma,sans-serif}
.fs-cam{position:absolute;inset:0;background:#fff;transform-origin:50% 50%}
.fs-root.turning .fs-cam{animation:fsTurn 3.2s cubic-bezier(.6,0,.25,1) forwards}
@keyframes fsTurn{0%{transform:rotate(0) scale(1)}35%{transform:rotate(70deg) scale(.88)}70%{transform:rotate(150deg) scale(.92)}100%{transform:rotate(180deg) scale(1)}}
.fs-turnov{position:absolute;inset:0;background:#02101a;opacity:0;transition:opacity 1s;pointer-events:none;z-index:9}.fs-turnov.on{opacity:1}
.fs-scroll{position:absolute;inset:0;overflow:auto;background:#fff;scroll-behavior:smooth}
.fs-top{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:.7em 2em;background:#ffffffee;box-shadow:0 1px 8px #0002}
.fs-logo b{font-size:1.7em;letter-spacing:.14em;color:#0b6a9c}.fs-logo span{display:block;font-size:.7em;color:#4a6577;letter-spacing:.1em}
.fs-top nav a{margin-left:1.6em;color:#27526b;cursor:pointer;font-size:.92em}.fs-top nav a:hover{text-decoration:underline}
.fs-hero{position:relative;height:30em;overflow:hidden}
.fs-sky{position:absolute;inset:0;background:linear-gradient(#5bb8ee,#bfe6fa 55%,#e8f6ff 58%)}
.fs-sun{position:absolute;left:68%;top:12%;width:7em;height:7em;border-radius:50%;background:radial-gradient(circle,#fff 0,#fff6c0 35%,#ffe27a 60%,#ffe27a00 72%);box-shadow:0 0 6em 3em #fff4b588}
.fs-cloud{position:absolute;height:2em;border-radius:2em;background:#fffc;filter:blur(2px);animation:fsCl 70s linear infinite}
.fs-cloud.c1{top:14%;width:9em;left:8%}.fs-cloud.c2{top:26%;width:12em;left:42%;animation-duration:95s}.fs-cloud.c3{top:8%;width:7em;left:78%;animation-duration:60s}
@keyframes fsCl{from{transform:translateX(-8em)}to{transform:translateX(22em)}}
.fs-sea{position:absolute;left:0;right:0;top:55%;bottom:0;background:linear-gradient(#36b6d9,#1b86b8 55%,#10628f);overflow:hidden}
.fs-sea i{position:absolute;left:-10%;width:120%;height:2px;background:#ffffff66;animation:fsWv 6s ease-in-out infinite alternate}
.fs-sea .w1{top:12%}.fs-sea .w2{top:34%;animation-duration:8s}.fs-sea .w3{top:62%;animation-duration:5s}
@keyframes fsWv{to{transform:translateX(4%)}}
.fs-beach{position:absolute;right:2%;top:36%;width:34%}.fs-palms{width:100%;display:block}
.fs-foam{position:absolute;left:0;right:0;bottom:0;height:3em;background:linear-gradient(#fff0,#ffffffcc 80%)}
.fs-hero-t{position:absolute;left:6%;top:24%;width:46%;color:#0b3550;text-shadow:0 1px 10px #fff9}
.fs-hero-t h1{font-size:2.3em;font-weight:600;line-height:1.15}.fs-hero-t p{margin:.8em 0 1.2em;font-size:1.05em}
.fs-cta{padding:.7em 1.6em;border:0;border-radius:2em;background:#0b6a9c;color:#fff;font:inherit;cursor:pointer;box-shadow:0 .3em 1em #0b6a9c66}
.fs-sec{padding:3em 2em;text-align:center;color:#27526b}.fs-sec h2{margin-bottom:1em;font-weight:500}
.fs-cards{display:flex;gap:1.2em;justify-content:center;flex-wrap:wrap}.fs-card{width:15em;padding:1.4em;border-radius:1em;background:#f1f9fe;box-shadow:0 .3em 1em #0b6a9c22;text-align:left}.fs-card h3{margin-bottom:.5em;color:#0b6a9c}
.fs-stats{display:flex;justify-content:space-around;padding:2.4em;background:linear-gradient(#e2f3fc,#c8e6f6);color:#0b3550}.fs-stats b{display:block;font-size:2.2em}.fs-stats span{font-size:.85em}
.fs-lead{max-width:34em;margin:0 auto}
.fs-deepsec{padding:3em 2em;text-align:center;background:#eaf5fb;color:#4a6577}.fs-deepsec p{margin-bottom:1em;font-size:.85em;letter-spacing:.14em;text-transform:uppercase}
.fs-deep-btn{padding:.9em 1.8em;border:1px solid #0b6a9c;border-radius:.5em;background:#fff;color:#0b6a9c;font:inherit;cursor:pointer}.fs-deep-btn:hover{background:#0b6a9c;color:#fff}
.fs-foot{padding:1.4em;text-align:center;font-size:.8em;color:#7d96a5;background:#f6fbfe}.fs-foot span{margin-left:1em}
.fs-alert{position:absolute;inset:0;z-index:20;background:#0004;display:flex;align-items:center;justify-content:center}
.fs-alertbox{width:min(25em,86%);border:1px solid #5a7b99;background:#f0f0f0;box-shadow:0 .6em 2em #0007;font-size:.9em;color:#111}
.fs-alerttitle{display:flex;justify-content:space-between;padding:.3em .6em;background:linear-gradient(#cfe3f5,#8fb4d8)}.fs-alerttitle b{cursor:pointer;padding:0 .4em;background:#c8503c;color:#fff}
.fs-alertbody{display:flex;gap:1em;padding:1.2em}.fs-alertbody i{font-style:normal;width:2em;height:2em;flex:none;border-radius:50%;background:#f1c40f;display:flex;align-items:center;justify-content:center;font-weight:700}
.fs-alertbtn{padding:.6em;text-align:center;background:#e4e4e4}.fs-alertbtn button{padding:.3em 2em;border:1px solid #707070;background:linear-gradient(#f2f2f2,#d6d6d6);cursor:pointer}
/* abyss */
.fs-abyss{position:absolute;inset:0;background:#010509;color:#cfe8ff}
.fs-cv{position:absolute;inset:0;width:100%;height:100%}
.fs-gl-ov{position:absolute;inset:0;pointer-events:none;opacity:0;background:repeating-linear-gradient(0deg,#0000 0 3px,#4fc3e810 3px 4px);mix-blend-mode:screen}.fs-gl-ov.on{opacity:1;animation:fsSh .3s steps(3) infinite}
@keyframes fsSh{33%{transform:translateX(-6px)}66%{transform:translateX(5px)}}
.fs-below{position:absolute;left:0;right:0;bottom:0;height:22%;overflow:hidden;pointer-events:none;background:linear-gradient(#0000,#9fe3ff66 70%,#e8fbffcc);filter:blur(1.5px)}
.fs-below-s{position:absolute;left:10%;right:10%;bottom:-20%;opacity:.35;transform:rotate(180deg);filter:blur(3px) hue-rotate(10deg);animation:fsRip 6s ease-in-out infinite alternate}
@keyframes fsRip{to{transform:rotate(180deg) skewX(4deg) translateY(4px)}}
.fs-dscroll{position:absolute;inset:0;overflow:auto;padding:2em 8% 14em}
.fs-hif{font-size:5em;letter-spacing:.2em;text-align:center;font-weight:300;transition:transform 1.2s,opacity 1s;text-shadow:0 0 30px #7fd6ff88;margin-top:.8em}
.fs-hifsub{text-align:center;min-height:1.6em;letter-spacing:.35em;text-transform:uppercase;color:#7fd6ff;font-size:.95em;margin-bottom:3em}
.fs-dl{max-width:36em;margin:1.4em auto;font-size:1.05em;line-height:1.6;color:#d8ecff}
.fs-dq{max-width:28em;margin:3em 0;font-size:1.25em;font-weight:300;font-style:italic;color:#7fd6ffcc;text-shadow:0 0 14px #1d6a9a}
.glitch{animation:fsGl .12s steps(2) infinite;text-shadow:2px 0 #ff3b6b,-2px 0 #3be0ff!important;color:#fff!important}
@keyframes fsGl{50%{transform:translateX(3px) skewX(-6deg)}}
.fs-claim{max-width:26em;margin:4em auto;padding:1.4em;border:1px solid #7fd6ff66;border-radius:.6em;background:#02101acc;text-align:left}
.fs-claim h3{margin-bottom:.8em;font-weight:400;letter-spacing:.12em;text-transform:uppercase;font-size:.9em;color:#7fd6ff}
.fs-claim label{display:block;margin-bottom:1em;font-size:.9em}.fs-claim button{padding:.6em 1.4em;border:1px solid #7fd6ff;background:#0b3a52;color:#fff;font:inherit;cursor:pointer}.fs-claim button:disabled{opacity:.4;cursor:default}
#fsClaimMsg{margin-top:.8em;color:#9df0b8;font-size:.9em}
.fs-surfhint{text-align:center;margin-top:6em;opacity:.45;letter-spacing:.3em;font-size:.8em;text-transform:uppercase}
/* parody pages */
.pp{min-height:100%;font-family:Segoe UI,Tahoma,sans-serif;color:#222;background:#fff;font-size:.95em}
.pp-head{display:flex;gap:1.2em;align-items:center;padding:.8em 1.4em;border-bottom:1px solid #ddd}.pp-head .tl{font-size:1.4em;margin-right:auto}.pp-head input{padding:.4em .8em;border:1px solid #bbb;border-radius:.4em;width:16em}
.pp-body{padding:1.2em 1.6em}.pp-sub{color:#777;font-size:.85em;margin:.3em 0 1em}.pp-com{margin-top:1em;line-height:1.8;font-size:.9em}
.fsvg{width:100%;height:auto;display:block}.ph{display:block}.ph .fsvg{max-height:100%}
.tube .tl{color:#e62117}.tube .pp-body{display:flex;gap:1.4em;flex-wrap:wrap}.tube-main{flex:1;min-width:20em}.tube-side{width:16em}
.tube-player{aspect-ratio:16/9;background:#0b2a4a;border-radius:.4em;position:relative;overflow:hidden}.tube-sea{position:absolute;inset:0}.tf{position:absolute;width:5em;animation:tfs 12s linear infinite}.tf.f1{top:20%}.tf.f2{top:50%;animation-duration:17s;animation-delay:-5s}.tf.f3{top:72%;animation-duration:9s;animation-delay:-2s}
@keyframes tfs{from{left:-8em}to{left:105%}}
.tube-bar{position:absolute;left:0;right:0;bottom:0;height:.35em;background:#fff3}.tube-bar i{display:block;height:100%;width:6%;background:#e62117}
.tube-vid{display:flex;gap:.7em;margin-bottom:.8em;font-size:.85em}.tube-vid span{width:7em;flex:none;border-radius:.3em;padding:.4em}.tube-vid small{display:block;color:#777}
.twitch{background:#18181b;color:#efeff1}.twitch .pp-head{border-color:#333}.twitch .tl{color:#a970ff}.twitch .pp-body{display:flex;gap:1em;flex-wrap:wrap}.tw-main{flex:1;min-width:20em}.tw-stream{position:relative}.tw-cv{width:100%;border-radius:.3em;image-rendering:pixelated;display:block}
.tw-live{position:absolute;left:.6em;top:.6em;background:#e91916;padding:.1em .5em;font-size:.75em;font-weight:700;border-radius:.2em}.tw-view{position:absolute;right:.6em;top:.6em;background:#000a;padding:.1em .5em;font-size:.75em}
.tw-chat{width:16em;background:#1f1f23;border-radius:.3em;display:flex;flex-direction:column;height:20em}.tw-chat-h{padding:.5em;border-bottom:1px solid #333;font-size:.75em;letter-spacing:.1em;text-align:center}.tw-chat-l{padding:.5em;overflow:hidden;font-size:.82em;line-height:1.5;flex:1}
.wiki .tl{font-family:Georgia,serif}.wk-main{max-width:46em;line-height:1.6}.wk-main h2{font-family:Georgia,serif;font-weight:400;border-bottom:1px solid #aaa}.wk-info{float:right;width:15em;margin:0 0 1em 1em;padding:.6em;border:1px solid #aaa;background:#f8f9fa;font-size:.85em}.wk-info img,.wk-info .ph{width:100%}.wk-info td{padding:.15em .4em}
.r34{background:#e9f7dc;color:#26421a}.r34 .pp-head{background:#a9dc8a;border-color:#7fb85f}.r34 .pp-body{display:flex;gap:1.4em;flex-wrap:wrap}.r-side{width:13em;font-size:.85em}.r-side ul{list-style:none;margin:.6em 0}.r-side li{padding:.15em 0;color:#2f6a1a}.r-side small{color:#7aa56a}.r-grid{flex:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(8.5em,1fr));gap:.7em}
.r-it small{display:block;font-size:.7em;color:#5b8a4a;margin-top:.2em}.r-pic{position:relative;aspect-ratio:1;overflow:hidden;background:#cfe7bf;border:2px solid #8fcf6e}.r-pic img,.r-pic .ph{width:100%;height:100%;object-fit:cover;filter:blur(9px) saturate(1.3);transform:scale(1.2)}.r-mos{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff22 0 6px,#0000 6px 12px),repeating-linear-gradient(90deg,#ffffff22 0 6px,#0000 6px 12px)}
.bik{background:linear-gradient(#fff4f9,#e3f6ff)}.bk-grid{display:flex;gap:1.4em;flex-wrap:wrap}.bk-it{width:12em;text-align:center}.bk-it small{display:block;margin-top:.4em;color:#6a7c88}
.gen .gen-card{padding:.9em 1.1em;margin-bottom:.6em;border:1px solid #ddd;border-radius:.5em}
.nores{padding:1em}
.fs-hard{position:absolute;inset:0;z-index:15;pointer-events:none;display:none;overflow:hidden}
.fs-hard.on{display:block}
.fs-hard.inv{background:#fff;mix-blend-mode:difference}
.fs-hw{position:absolute;font-weight:800;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;color:#fff;mix-blend-mode:difference;text-shadow:4px 0 #ff2d55,-4px 0 #2de2ff}
.fs-hard.calm .fs-hw{mix-blend-mode:normal;text-shadow:0 0 30px #7fd6ff;opacity:0;transition:opacity .5s}
.fs-hard.calm.show .fs-hw{opacity:.9}
.fs-shake{animation:fsShake .08s steps(2) infinite}
@keyframes fsShake{25%{transform:translate(-9px,3px) skewX(2deg)}50%{transform:translate(7px,-4px)}75%{transform:translate(-4px,6px) skewX(-3deg)}}
`;
window.HQSites = { pages, build, imgFail, fishSVG, fishImg };
})();
