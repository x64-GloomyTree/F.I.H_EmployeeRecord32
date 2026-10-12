/* hq-browser.js : fake Internet Explorer shell shown after the PC login.
   HQBrowser.open(hostElement, { onClose }) */
(() => {
'use strict';
const SD = window.HQ_SITE;
const $ = (r, s) => r.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const api = () => window.HQItems;
const HQ = () => window.HQ;

/* ---------- site audio (website1 -> muffled -> website2) ---------- */
const A = { ctx: null, deep: false, on: false, el1: null, el2: null, g1: null, g2: null, f1: null, f2: null, sync: 0, duck: 0 };
const volNow = () => { const s = HQ().ST; return s.mute ? 0 : Math.min(1, s.master * s.bgm); };
function audioInit() {
  if (A.ctx) return true;
  try {
    const C = window.AudioContext || window.webkitAudioContext; A.ctx = new C();
    const mk = (src) => {
      const e = new Audio(src); e.loop = true; e.preload = 'auto';
      const s = A.ctx.createMediaElementSource(e), f = A.ctx.createBiquadFilter(), g = A.ctx.createGain();
      f.type = 'lowpass'; f.frequency.value = 20000; g.gain.value = 0; s.connect(f); f.connect(g); g.connect(A.ctx.destination);
      return { e, f, g };
    };
    const a = mk(SD.audio.site1), b = mk(SD.audio.site2);
    A.el1 = a.e; A.f1 = a.f; A.g1 = a.g; A.el2 = b.e; A.f2 = b.f; A.g2 = b.g;
    return true;
  } catch (e) { console.warn('browser audio', e); A.ctx = null; return false; }
}
const ramp = (param, to, sec) => { const t = A.ctx.currentTime; param.cancelScheduledValues(t); param.setValueAtTime(param.value, t); param.linearRampToValueAtTime(to, t + sec); };
function bgmDuck(on) {
  const m = HQ().music && HQ().music.bgm; if (!m) return;
  cancelAnimationFrame(A.duck);
  const from = m.volume, to = on ? 0 : Math.min(1, volNow() * (m._k ?? 1)), t0 = performance.now();
  (function step(t) { const p = Math.min(1, (t - t0) / 1500); m.volume = Math.max(0, Math.min(1, from + (to - from) * p)); if (p < 1) A.duck = requestAnimationFrame(step); })(t0);
}
const audio = {
  siteOn() {
    if (!audioInit()) return;
    if (A.ctx.state === 'suspended') A.ctx.resume();

    A.on = true;
    const e = A.deep ? A.el2 : A.el1;
    const g = A.deep ? A.g2 : A.g1;

    e.play().catch(() => {});
    ramp(g.gain, volNow(), 1.2);
    bgmDuck(true);
  },

  siteOff() {
    if (!A.ctx || !A.on) return;

    A.on = false;
    ramp(A.g1.gain, 0, 0.55);
    ramp(A.g2.gain, 0, 0.55);

    setTimeout(() => {
      if (!A.on) {
        A.el1.pause();
        A.el2.pause();
      }
    }, 650);

    bgmDuck(false);
  },

  dive() {
    if (!A.ctx || !A.on) return;

    A.deep = true;
    ramp(A.f1.frequency, 420, 2);
    ramp(A.g1.gain, 0, 2.5);

    A.el2.currentTime = 0;
    A.f2.frequency.value = 500;
    A.el2.play().catch(() => {});

    ramp(A.g2.gain, volNow(), 3.2);
    ramp(A.f2.frequency, 9000, 7);

    setTimeout(() => {
      if (A.deep) A.el1.pause();
    }, 2700);
  },

  reset() {
    if (!A.ctx) {
      A.deep = false;
      return;
    }

    A.deep = false;
    ramp(A.g2.gain, 0, 0.35);
    ramp(A.f1.frequency, 20000, 0.35);
    A.el2.pause();
    A.el2.currentTime = 0;
  }
};

/* ---------- routing ---------- */
const KEYS = [
  ['fih', ['fih', 'f.i.h', 'harbor', 'harbour']], ['trawl', ['trawl']], ['youtube', ['youtube', 'youtu.be']],
  ['twitch', ['twitch']], ['wiki', ['wikipedia', 'wikipédia', 'wiki']], ['r34', ['rule34', 'r34', 'rule 34']],
  ['bikini', ['porn', 'xxx', 'xvideos', 'xnxx', 'onlyfans', 'hentai', 'nsfw', 'adult']],
  ['reddit', ['reddit']], ['google', ['google']], ['discord', ['discord']], ['github', ['github']],
  ['roblox', ['roblox']], ['minecraft', ['minecraft']]
];
function resolve(input) {
  const q = String(input || '').trim(), lc = q.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  if (!lc) return { route: 'trawl' };
  if (lc === 'x' || lc.includes('twitter') || lc.startsWith('x.com')) return { route: 'x' };
  for (const [r, ks] of KEYS) if (ks.some(k => lc.includes(k))) return { route: r };
  return { route: 'nores', q };
}
const URLS = { welcome: 'about:welcome', fih: 'www.fih-harbor.org', trawl: 'www.trawl.com', taxonomy: 'www.trawl.com/lucky', youtube: 'www.fishtube.com', twitch: 'www.twitchfin.tv', wiki: 'en.wikifishia.org/wiki/Fish', r34: 'www.rule34.fish', bikini: 'www.beachseason.fish', x: 'www.fix.com', reddit: 'www.fishdit.com', google: 'www.gillgle.com', discord: 'www.fishcord.com', github: 'www.fishhub.com', roblox: 'www.robloxfin.com', minecraft: 'www.fishcraft.net', nores: 'www.trawl.com/search' };
const TITLES = { welcome: 'Welcome', fih: 'F.I.H : Fisheries Innovation Harbor', trawl: 'Trawl', taxonomy: 'Aptitude Test', youtube: 'FishTube', twitch: 'Twitchfin', wiki: 'Fish - Wikifishia', r34: 'Rule 34: Fish Edition', bikini: 'Beach Season', x: 'Fix', reddit: 'Fishdit', google: 'Gillgle', discord: 'Fishcord', github: 'Fishhub', roblox: 'Robloxfin', minecraft: 'Fishcraft', nores: 'No results - Trawl' };

/* ---------- built-in pages ---------- */
function welcomePage(view, ctx) {
  view.innerHTML = `<div class="ie-welcome"><h1>Welcome to the Internet</h1><p>You have <b>2</b> tabs. One of them is already open.</p><p class="ie-w2">To get started, open a new tab.</p><div class="ie-arrow">&#8599;</div></div>`;
  ctx.pulseNew(true); return () => ctx.pulseNew(false);
}
function trawlPage(view, ctx) {
  view.innerHTML = `<div class="ie-trawl"><div class="ie-tlogo">Tr<span>aw</span>l</div><div class="ie-tbox"><input id="trQ" placeholder="Search the sea" autocomplete="off"></div>
  <div class="ie-tbtn"><button id="trS">Trawl Search</button><button id="trL">I'm feeling lucky</button></div>
  <div class="ie-tlinks"><a data-q="fishtube">FishTube</a><a data-q="wikifishia">Wikifishia</a><a data-q="twitchfin">Twitchfin</a><a data-q="fih">F.I.H</a></div>
  <div class="ie-tfoot">Trawl is a fish-owned company. &copy; Trawl</div></div>`;
  const q = $(view, '#trQ'), go = () => ctx.nav(q.value || 'fish');
  $(view, '#trS').onclick = go; q.onkeydown = e => { if (e.key === 'Enter') go(); };
  $(view, '#trL').onclick = () => ctx.nav('@taxonomy');
  view.querySelectorAll('[data-q]').forEach(a => a.onclick = () => ctx.nav(a.dataset.q));
}
function taxonomyPage(view, ctx) {
  const stop = window.HQMinigame.taxonomy(view, () => { ctx.flag('mgDone', true); ctx.toast('Employee features unlocked'); ctx.nav('@trawl'); });
  return stop;
}

const PAGES = () => Object.assign({ welcome: welcomePage, trawl: trawlPage, taxonomy: taxonomyPage }, window.HQSites.pages);

/* ---------- shell ---------- */
let open_ = null, closer = null;
function open(host, opts = {}) {
  if (open_) return; open_ = true;
  css();
  host.innerHTML = '';
  const ie = el('div', 'ie');
  ie.innerHTML = `<div class="ie-title"><span class="ie-ico">e</span><span id="ieT">Welcome - Windows Internet Explorer</span><span class="ie-wc"><i>_</i><i>&#9633;</i><b id="ieX">x</b></span></div>
  <div class="ie-nav"><button class="ie-orb" id="ieB" title="Back">&#9664;</button><button class="ie-orb" id="ieF" title="Forward">&#9654;</button>
    <div class="ie-addr"><span class="ie-lk"></span><input id="ieA" spellcheck="false" autocomplete="off"><button id="ieGo">&#8594;</button></div>
    <div class="ie-srch"><input id="ieS" placeholder="Live Search" autocomplete="off"><button id="ieSB">&#9906;</button></div></div>
  <div class="ie-tabs"><div class="ie-tabrow" id="ieTabs"></div><button id="ieNew" class="ie-newt" title="New Tab (Ctrl+T)">+</button></div>
  <div class="ie-cmd"><span>&#9733; Favorites</span><span>Home</span><span>Page</span><span>Tools</span><span class="r">Help</span></div>
  <div class="ie-load" id="ieL"><i></i></div><div class="ie-view" id="ieV"></div>
  <div class="ie-stat"><span id="ieSt">Done</span><span>Internet | Protected Mode: Off</span><span>&#128269; 100%</span></div>`;
  host.appendChild(ie);

  const tabs = []; let cur = null, uid = 0;
  const ctxFor = (tab) => ({
    nav: q => navigate(tab, q),
    flag: (k, v) => api().flag(k, v), setTier: n => api().setTier(n), getTier: () => api().getTier(),
    toast: m => HQ().toast(m), audio,
    pulseNew: on => ie.querySelector('#ieNew').classList.toggle('pulse', on)
  });
  function mkTab(route, q) {
    const t = { id: ++uid, hist: [], i: -1, view: el('div', 'ie-page'), cleanup: null, route: null };
    t.view.hidden = true; $(ie, '#ieV').appendChild(t.view); tabs.push(t);
    navigate(t, route === 'welcome' ? '@welcome' : route.startsWith('@') ? route : q, true); return t;
  }
  function navigate(tab, input, push = true) {
    let r;
    if (input && input.startsWith('@')) r = { route: input.slice(1) }; else r = resolve(input);
    if (push) { tab.hist = tab.hist.slice(0, tab.i + 1); tab.hist.push(r); tab.i = tab.hist.length - 1; }
    load(tab, r);
  }
  function load(tab, r) {
    if (tab.cleanup) { try { tab.cleanup(); } catch (e) {} tab.cleanup = null; }
    if (tab.route === 'fih' && r.route !== 'fih') { audio.siteOff(); audio.reset(); }
    tab.route = r.route; tab.state = r; tab.title = TITLES[r.route] || 'Page';
    const L = $(ie, '#ieL'); L.classList.remove('go'); void L.offsetWidth; L.classList.add('go'); $(ie, '#ieSt').textContent = 'Waiting for ' + (URLS[r.route] || '') + '...';
    tab.view.innerHTML = '';
    setTimeout(() => {
      if (!tab.view.isConnected) return;
      const page = (r.route === 'nores' ? window.HQSites.build('nores', r.q) : PAGES()[r.route]);
      tab.cleanup = page ? page(tab.view, ctxFor(tab)) : null;
      $(ie, '#ieSt').textContent = 'Done'; if (cur === tab) show(tab);
    }, 350 + Math.random() * 350);
    if (cur === tab) show(tab, true);
  }
  function show(tab) {
    cur = tab;
    tabs.forEach(t => t.view.hidden = t !== tab);

    $(ie, '#ieA').value = URLS[tab.route] || '';
    $(ie, '#ieT').textContent = tab.title + ' - Windows Internet Explorer';
    $(ie, '#ieB').disabled = tab.i <= 0;
    $(ie, '#ieF').disabled = tab.i >= tab.hist.length - 1;
    renderTabs();

    if (tab.route === 'fih' && tab.cleanup) {
      audio.siteOn();
    } else {
      audio.siteOff();
    }
  }
  function renderTabs() {
    const row = $(ie, '#ieTabs'); row.innerHTML = '';
    tabs.forEach(t => {
      const d = el('div', 'ie-tab' + (t === cur ? ' act' : ''), `<span>${t.title || 'Loading...'}</span><b>x</b>`);
      d.onclick = e => { if (e.target.tagName === 'B') closeTab(t); else show(t); };
      row.appendChild(d);
    });
  }
  function closeTab(t) {
    if (tabs.length <= 1) return;
    if (t.cleanup) { try { t.cleanup(); } catch (e) {} }
    if (t.route === 'fih') { audio.siteOff(); audio.reset(); }
    const i = tabs.indexOf(t); tabs.splice(i, 1); t.view.remove(); show(tabs[Math.max(0, i - 1)]);
  }
  function newTab() { const t = mkTab('@trawl'); show(t); }

  $(ie, '#ieB').onclick = () => { if (cur.i > 0) { cur.i--; load(cur, cur.hist[cur.i]); } };
  $(ie, '#ieF').onclick = () => { if (cur.i < cur.hist.length - 1) { cur.i++; load(cur, cur.hist[cur.i]); } };
  const addr = $(ie, '#ieA'), sb = $(ie, '#ieS');
  const goA = () => { if (addr.value.trim()) navigate(cur, addr.value); };
  $(ie, '#ieGo').onclick = goA; addr.onkeydown = e => { if (e.key === 'Enter') goA(); }; addr.onfocus = () => addr.select();
  $(ie, '#ieSB').onclick = () => { if (sb.value.trim()) { navigate(cur, sb.value); sb.value = ''; } };
  sb.onkeydown = e => { if (e.key === 'Enter') $(ie, '#ieSB').click(); };
  $(ie, '#ieNew').onclick = newTab;
  ie.addEventListener('keydown', e => { if (e.ctrlKey && e.key.toLowerCase() === 't') { e.preventDefault(); newTab(); } });
  const closeAll = (callOnClose) => {
    if (!open_) return;

    open_ = null;
    closer = null;

    tabs.forEach(t => {
      if (t.cleanup) {
        try { t.cleanup(); } catch (e) {}
      }
      t.view.remove();
    });

    audio.siteOff();
    audio.reset();
    host.innerHTML = '';

    if (callOnClose && opts.onClose) opts.onClose();
  };

  closer = () => closeAll(false);
  $(ie, '#ieX').onclick = () => closeAll(true);

  /* initial tabs: welcome (active) + F.I.H site (loaded in the background) */
  const t1 = mkTab('welcome'); const t2 = mkTab('@fih');
  /* the fih page must not start audio until its tab is active */
  t2.deferred = true; show(t1);
}
let cssOn = false;
function css() {
  if (cssOn) return; cssOn = true;
  const s = el('style'); s.textContent = CSS; document.head.appendChild(s);
}
const CSS = `
.ie{position:fixed;inset:2vh 1.5vw;display:flex;flex-direction:column;border:1px solid #3d5f80;border-radius:.6em .6em 0 0;background:linear-gradient(#d4e4f4,#a9c8e6);box-shadow:0 1rem 4rem #000d;font:13px Segoe UI,Tahoma,sans-serif;color:#102;overflow:hidden}
.ie-title{display:flex;align-items:center;gap:.6em;padding:.35em .6em;background:linear-gradient(#e2eefb,#b7d1ee);border-bottom:1px solid #8aa9c7;font-size:12px}
.ie-ico{width:1.4em;height:1.4em;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#5fb8ee 45%,#1b5f9a);color:#fff;font-weight:700;text-align:center;line-height:1.4em}
#ieT{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.ie-wc{display:flex;gap:2px}.ie-wc i,.ie-wc b{font-style:normal;width:2.4em;text-align:center;padding:.1em 0;background:linear-gradient(#f2f7fd,#c9ddf2);border:1px solid #7f9fc0;border-radius:.2em}.ie-wc b{background:linear-gradient(#f3b5a8,#c8503c);color:#fff;cursor:pointer}
.ie-nav{display:flex;gap:.5em;align-items:center;padding:.4em .6em;background:linear-gradient(#cfe0f3,#b5cfec)}
.ie-orb{width:2.2em;height:2.2em;border-radius:50%;border:1px solid #2f6a99;background:radial-gradient(circle at 35% 25%,#fff,#7cc4f0 40%,#2a77b5);color:#0b3a5c;cursor:pointer}.ie-orb:disabled{opacity:.4;cursor:default}
.ie-addr{flex:1;display:flex;align-items:center;background:#fff;border:1px solid #7f9fc0;border-radius:.2em;padding:0 .3em}.ie-lk{width:.9em;height:.9em;margin-right:.4em;border-radius:20%;background:#7cc47c}.ie-addr input{flex:1;border:0;outline:0;padding:.35em;font:inherit;-webkit-user-select:text;user-select:text}.ie-addr button,.ie-srch button{border:0;background:#dfeaf6;padding:.2em .6em;cursor:pointer}
.ie-srch{display:flex;width:14em;background:#fff;border:1px solid #7f9fc0}.ie-srch input{flex:1;min-width:0;border:0;outline:0;padding:.35em;font:inherit;-webkit-user-select:text;user-select:text}
.ie-tabs{display:flex;align-items:flex-end;gap:2px;padding:.3em .6em 0;background:linear-gradient(#bcd5ee,#a8c6e6)}.ie-tabrow{display:flex;gap:2px;overflow:hidden;flex:1}
.ie-tab{display:flex;gap:.6em;align-items:center;max-width:15em;padding:.35em .9em;border:1px solid #7f9fc0;border-bottom:0;border-radius:.3em .3em 0 0;background:linear-gradient(#e6effa,#c6daf0);cursor:pointer;font-size:12px}.ie-tab span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ie-tab.act{background:#fff}.ie-tab b{font-weight:400;opacity:.5}.ie-tab b:hover{opacity:1;color:#c8503c}
.ie-newt{padding:.3em .8em;border:1px solid #7f9fc0;border-bottom:0;border-radius:.3em .3em 0 0;background:linear-gradient(#e6effa,#c6daf0);cursor:pointer;font-weight:700}.ie-newt.pulse{animation:iePl 1s ease-in-out infinite}
@keyframes iePl{50%{background:#ffe27a;box-shadow:0 0 .8em #ffd75a}}
.ie-cmd{display:flex;gap:1.4em;padding:.3em .8em;background:#e8f1fb;border-bottom:1px solid #8aa9c7;font-size:12px;color:#234}.ie-cmd .r{margin-left:auto}
.ie-load{height:3px;background:#dfeaf6}.ie-load i{display:block;height:100%;width:0;background:linear-gradient(90deg,#38b84c,#9be26b)}.ie-load.go i{animation:ieLd .8s ease-out forwards}
@keyframes ieLd{to{width:100%}}
.ie-view{position:relative;flex:1;background:#fff;overflow:hidden}.ie-page{position:absolute;inset:0;overflow:auto}.ie-page[hidden]{display:none}
.ie-stat{display:flex;justify-content:space-between;padding:.25em .8em;background:linear-gradient(#e2eefb,#c9ddf2);border-top:1px solid #8aa9c7;font-size:12px}
.ie-welcome{padding:4em 2em;text-align:center;color:#234;position:relative;height:100%}.ie-welcome h1{font-weight:300;font-size:2.2em;margin-bottom:.6em}.ie-w2{margin-top:1em;font-size:1.2em;color:#0b6a9c}
.ie-arrow{position:absolute;left:34%;top:-.4em;font-size:3em;color:#e0a800;animation:ieAr 1s ease-in-out infinite alternate}
@keyframes ieAr{to{transform:translate(8px,-8px)}}
.ie-trawl{display:flex;flex-direction:column;align-items:center;padding:4em 1em;min-height:100%;background:#fff}.ie-tlogo{font-size:4.2em;font-family:Georgia,serif;color:#1b6aa8;letter-spacing:.04em}.ie-tlogo span{color:#e8892b}
.ie-tbox{width:min(32em,90%);margin:1.2em 0}.ie-tbox input{width:100%;padding:.8em 1em;border:1px solid #9bb;border-radius:2em;font:inherit;font-size:1.1em;outline:0;-webkit-user-select:text;user-select:text}.ie-tbox input:focus{box-shadow:0 0 .8em #7cc4f066}
.ie-tbtn{display:flex;gap:.8em}.ie-tbtn button{padding:.6em 1.2em;border:1px solid #9bb;background:linear-gradient(#fff,#e9f1f7);border-radius:.3em;cursor:pointer;font:inherit}
.ie-tlinks{margin-top:2em;display:flex;gap:1.6em;color:#1b6aa8}.ie-tlinks a{cursor:pointer}.ie-tlinks a:hover{text-decoration:underline}.ie-tfoot{margin-top:auto;padding-top:4em;font-size:.8em;color:#8aa}
`;
window.HQBrowser = { open, resolve, audio };
})();
