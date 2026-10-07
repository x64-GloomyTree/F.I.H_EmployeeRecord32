// lockdown.js : hidden service-shell chain ("acs ..."), QTE override sequence, door animation styles
(() => {
'use strict';

/* ---------- tuning ---------- */
const LK = {
  duration: 60,       // seconds the bar needs if you never fail a check
  penalty: 15,         // percent lost per failed check
  gapMin: 3000,       // ms between checks (min)
  gapMax: 4500,       // ms between checks (max)
  period: 1.7,        // seconds per needle revolution
  zone: 52,
  warn: 300,           // green zone width in degrees
  tol: 5              // leniency in degrees
};

/* ---------- sound files (put them in assets/sounds/) ---------- */
Object.assign(CFG.sounds, {
  lk_step_ok:       { src: 'assets/sounds/lk_step_ok.mp3',       vol: 0.5 },
  lk_start:         { src: 'assets/sounds/lk_start.mp3',         vol: 0.6 },
  lk_loading:       { src: 'assets/sounds/lk_loading.mp3',       vol: 0.4, loop: true },
  lk_qte_spawn:     { src: 'assets/sounds/lk_qte_spawn.mp3',     vol: 0.5 },
  lk_qte_success:   { src: 'assets/sounds/lk_qte_success.mp3',   vol: 0.6 },
  lk_qte_fail:      { src: 'assets/sounds/lk_qte_fail.mp3',      vol: 0.7 },
  lk_complete:      { src: 'assets/sounds/lk_complete.mp3',      vol: 0.6 },
  lk_rods_retract:  { src: 'assets/sounds/lk_rods_retract.mp3',  vol: 0.6 },
  lk_unlock_chime:  { src: 'assets/sounds/lk_unlock_chime.mp3',  vol: 0.6 },
  lk_door_locked:   { src: 'assets/sounds/lk_door_locked.mp3',   vol: 0.6 },
  lk_door_open:     { src: 'assets/sounds/lk_door_open.mp3',     vol: 0.7 },
  lk_zoom:          { src: 'assets/sounds/lk_zoom.mp3',          vol: 0.6 }
});

/* ---------- the command chain ---------- */
// Players must run these in order. Arguments are stored as SHA-256 hashes (uppercase input).
const STEPS = [
  { flag: '--diag' },
  { flag: '--auth', hash: '87897337d925f67a9b11b839a2786f8dc0b2b6d481a23c65ef9300f878737e13', usage: 'acs --auth <key>', ref: '2.9',
    out: ['validating vendor service key...', 'key accepted.', 'service shell level 2 granted.'] },
  { flag: '--unseal', hash: 'd8636deb90d6fdc6e1f2ef090eeba96eb07b41de2413e8a760230589ad5c981c', usage: 'acs --unseal <panel>', ref: '4.8',
    out: ['requesting seal release...', 'tamper seal released on actuator manifold panel.', 'panel unsealed.'] },
  { flag: '--suspend', hash: 'afff39d8c564251eaa79cbdbebf2c21972e6c8265fba714f32597bb9cebb8cd6', usage: 'acs --suspend <daemon>', ref: '5.3',
    out: ['sending suspend signal...', 'breach monitor suspended.', 'lockdown re-arm disabled.'] },
  { flag: '--cut', hash: '34bc52dee1e90f039df5d27aa265327cc2e5802785e12150b17ebea0cea61f8d', usage: 'acs --cut <circuit>', ref: '7.2',
    out: ['isolating circuit...', 'rod actuator supply isolated from building supply.', 'residual pressure detected.'] },
  { flag: '--release', hash: '3597b4d4a57fc8671c98324ff13dfd1e968a4b02dfbf498929576f5ee48f26ff', usage: 'acs --release <token>', ref: '7.5', final: true,
    out: ['verifying emergency override token...', 'token accepted.', 'engaging manual tension procedure...'] }
];
const NAMES = ['service key', 'panel seal', 'breach monitor', 'actuator supply', 'manual release'];

function line(B, t, c) { B.addLine(t, c || ''); }

async function diag(B) {
  const S = B.S, prog = S.lkStep || 0, cleared = S.lkDone ? 5 : Math.max(0, prog - 1);
  line(B, 'ACS LOCKDOWN SERVICE SHELL v7.2');
  line(B, 'installation ref ... LK-0732-B');
  line(B, 'state ............. ' + (S.lkDone ? 'RELEASED' : 'LOCKDOWN (breach flag set)'));
  line(B, 'subsystems cleared  ' + cleared + '/5');
  NAMES.forEach((n, i) => line(B, '  ' + (i + 1) + ' ' + n.padEnd(16, '.') + ' ' + (i < cleared ? 'CLEARED' : 'LOCKED')));
}

async function handle(tk) {
  if ((tk[0] || '').toLowerCase() !== 'acs') return false;
  const B = window.FIHBridge; if (!B || !B.S.adminOpen) return false;
  const S = B.S, flag = (tk[1] || '').toLowerCase();
  if (!flag) { line(B, 'usage: acs <option> [argument]'); return true; }
  const idx = STEPS.findIndex(s => s.flag === flag);
  if (idx < 0) { B.play('error'); line(B, 'acs: unknown option ' + tk[1], 'err'); return true; }
  const prog = S.lkStep || 0, st = STEPS[idx];

  if (idx === 0) {
    await diag(B);
    if (prog === 0) { S.lkStep = 1; B.save(); B.play('lk_step_ok'); }
    return true;
  }
  if (S.lkDone) { line(B, 'acs: lockdown already released.'); return true; }
  if (idx > prog) {
    B.play('error');
    line(B, 'ERR 0x31 SEQUENCE VIOLATION', 'err');
    line(B, 'a previous subsystem is not cleared. (manual ref ' + st.ref + ')', 'err');
    return true;
  }
  if (idx < prog) { line(B, 'acs: ' + flag + ' already completed.'); return true; }

  const arg = tk.slice(2).join(' ').toUpperCase();
  if (!arg) { line(B, 'usage: ' + st.usage); return true; }
  if (await B.sha(arg) !== st.hash) { B.play('error'); line(B, 'ERR 0x42 INVALID PARAMETER', 'err'); return true; }

  await B.printSeq(st.out, 320);
  B.play('lk_step_ok');
  if (st.final) { await override(B); return true; }
  S.lkStep = idx + 1; B.save();
  return true;
}
window.lkHandle = handle;

/* ---------- override: loading bar + skill checks + final sequence ---------- */
function override(B) {
  const S = B.S;
  return new Promise(resolve => {
    const ov = document.createElement('div'); ov.className = 'lk-ov';
    ov.innerHTML =
      '<div class="lk-head">ACS LOCKDOWN // MANUAL RELEASE</div>' +
      '<div class="lk-sub">HOLD ACTUATOR PRESSURE STEADY</div>' +
      '<div class="lk-pct">0%</div>' +
      '<div class="lk-bar"><div class="lk-fill"></div></div>' +
      '<div class="lk-note"></div>' +
      '<div class="lk-help">' + (B.touchy ? 'TAP THE CIRCLE WHEN THE NEEDLE HITS THE GREEN ZONE' : 'PRESS [SPACE] WHEN THE NEEDLE HITS THE GREEN ZONE') + '</div>' +
      '<div class="lk-field"></div>';
    document.body.appendChild(ov);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();

    const pctEl = ov.querySelector('.lk-pct'), fill = ov.querySelector('.lk-fill');
    const note = ov.querySelector('.lk-note'), field = ov.querySelector('.lk-field');
    const rand = (a, b) => a + Math.random() * (b - a);
    let p = 0, last = performance.now(), next = last + 2200, q = null, over = false, pending = false;

    B.play('lk_start'); B.play('lk_loading');
    const setP = () => { pctEl.textContent = Math.floor(p) + '%'; fill.style.width = p + '%'; };

    function spawn(now) {
      const zs = rand(110, 280), x = rand(20, 80), y = rand(26, 66);
      const el = document.createElement('div'); el.className = 'lk-qte';
      el.style.left = x + '%'; el.style.top = y + '%';
      el.innerHTML = '<div class="lk-ring"></div>' +
        '<div class="lk-zone" style="background:conic-gradient(from ' + zs + 'deg,#39ff5a 0 ' + LK.zone + 'deg,transparent ' + LK.zone + 'deg 360deg)"></div>' +
        '<div class="lk-needle"></div><div class="lk-key">' + (B.touchy ? 'TAP' : 'SPACE') + '</div>';
      field.appendChild(el);
      q = { el, zs, start: now, ang: 0, needle: el.querySelector('.lk-needle') };
    }
    function resolveQ(ok) {
      if (!q) return; const cur = q; q = null;
      cur.el.classList.add(ok ? 'ok' : 'bad');
      if (ok) { B.play('lk_qte_success'); note.textContent = 'PRESSURE STABLE'; note.className = 'lk-note ok'; }
      else {
        B.play('lk_qte_fail'); p = Math.max(0, p - LK.penalty);
        note.textContent = 'PRESSURE UNSTABLE  -' + LK.penalty + '%'; note.className = 'lk-note bad';
        ov.classList.remove('shake'); void ov.offsetWidth; ov.classList.add('shake');
      }
      setTimeout(() => cur.el.remove(), 380);
      next = performance.now() + rand(LK.gapMin, LK.gapMax);
      setP();
    }
    function press() {
      if (!q) return;
      const a = q.ang;
      resolveQ(a >= q.zs - LK.tol && a <= q.zs + LK.zone + LK.tol);
    }
    const onKey = e => {
      e.preventDefault(); e.stopPropagation();
      if ((e.code === 'Space' || e.key === ' ') && !e.repeat) press();
    };
    window.addEventListener('keydown', onKey, true);
    ov.addEventListener('pointerdown', e => { e.preventDefault(); press(); });

    function frame(now) {
      if (over) return;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      p = Math.min(100, p + dt * 100 / LK.duration);
      if (q) {
        q.ang = ((now - q.start) / 1000) / LK.period * 360;
        q.needle.style.transform = 'rotate(' + q.ang + 'deg)';
        if (q.ang > q.zs + LK.zone + LK.tol + 12) resolveQ(false);
      } else if (!pending && now >= next && p < 92) {
        pending = true;
        B.play('lk_qte_spawn');
        setTimeout(() => { pending = false; if (!over) spawn(performance.now()); }, LK.warn);
      }
      setP();
      if (p >= 100 && !q) { finish(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    async function finish() {
      over = true;
      window.removeEventListener('keydown', onKey, true);
      B.stop('lk_loading'); B.play('lk_complete');
      ov.innerHTML = '<pre class="lk-term"></pre><div class="lk-open" hidden>DOOR OPEN</div>';
      const term = ov.querySelector('.lk-term'), big = ov.querySelector('.lk-open');
      const lines = [
        ['OVERRIDE 100% ........ ACCEPTED', 'key'], ['', 'key'],
        ['> verifying actuator pressure ....... OK', 'key'],
        ['> isolating sector 7 ................ OK', 'key'],
        ['> releasing rod actuators', 'key'],
        ['    ROD 1/4 ..... RETRACTED', 'lk_rods_retract'],
        ['    ROD 2/4 ..... RETRACTED', 'lk_rods_retract'],
        ['    ROD 3/4 ..... RETRACTED', 'lk_rods_retract'],
        ['    ROD 4/4 ..... RETRACTED', 'lk_rods_retract'],
        ['> clearing breach flag .............. DONE', 'key'],
        ['> unauthorized personnel flag ....... IGNORED', 'key'], ['', 'key'],
        ['LOCKDOWN LIFTED', 'lk_step_ok']
      ];
      for (const [t, snd] of lines) { term.textContent += t + '\n'; B.play(snd); await B.sleep(snd === 'lk_rods_retract' ? 700 : 380); }
      big.hidden = false; B.play('lk_unlock_chime');
      await B.sleep(2800);
      S.lkStep = 6; S.lkDone = true; B.unlockDoor(true); B.save();
      ov.classList.add('out'); await B.sleep(700); ov.remove();
      line(B, 'lockdown released. the door is unlocked.');
      line(B, 'return to the room to inspect it.');
      resolve();
    }
  });
}

/* ---------- injected styles (override sequence + door animation) ---------- */
const css = `
.lk-ov{position:fixed;inset:0;z-index:45;background:#000;color:#39ff5a;font-family:'VT323','Lucida Console',monospace;display:flex;flex-direction:column;align-items:center;padding-top:7vh;text-shadow:0 0 .35em rgba(57,255,90,.6);font-size:clamp(18px,3.2vmin,34px);animation:lkin .4s;overflow:hidden}
.lk-ov.out{opacity:0;transition:opacity .7s}
.lk-ov.shake{animation:lkshake .35s}
.lk-head{letter-spacing:.2em}
.lk-sub{opacity:.7;font-size:.85em;margin-top:.2em}
.lk-pct{font-size:3.6em;line-height:1;margin-top:.4em}
.lk-bar{width:70vw;height:1.4em;border:.15em solid #39ff5a;margin-top:.5em}
.lk-fill{height:100%;width:0;background:repeating-linear-gradient(90deg,#39ff5a 0 .6em,#1f9e3a .6em .7em)}
.lk-note{height:1.2em;margin-top:.7em}
.lk-note.ok{color:#9fffb0}.lk-note.bad{color:#ff3b3b;text-shadow:0 0 .4em #ff3b3b}
.lk-help{position:absolute;bottom:5vh;left:0;right:0;text-align:center;opacity:.7;font-size:.8em;padding:0 5vw}
.lk-field{position:absolute;inset:0;pointer-events:none}
.lk-qte{position:absolute;width:9em;height:9em;transform:translate(-50%,-50%);font-size:clamp(14px,2.6vmin,26px)}
.lk-ring{position:absolute;inset:0;border-radius:50%;border:.35em solid #1d3a22;box-shadow:0 0 1.2em rgba(57,255,90,.4)}
.lk-zone{position:absolute;inset:0;border-radius:50%;-webkit-mask:radial-gradient(circle closest-side,transparent 76%,#000 77%);mask:radial-gradient(circle closest-side,transparent 76%,#000 77%)}
.lk-needle{position:absolute;left:50%;top:0;width:.3em;height:50%;margin-left:-.15em;background:#fff;box-shadow:0 0 .6em #fff;transform-origin:50% 100%}
.lk-key{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.9em;letter-spacing:.1em}
.lk-qte.ok .lk-ring{border-color:#39ff5a;box-shadow:0 0 2em #39ff5a}
.lk-qte.bad .lk-ring{border-color:#ff3b3b;box-shadow:0 0 2em #ff3b3b}
.lk-qte.ok,.lk-qte.bad{animation:lkpop .38s forwards}
.lk-term{margin:0;align-self:flex-start;padding:0 6vw;font:inherit;white-space:pre-wrap}
.lk-open{margin:auto;font-size:4em;letter-spacing:.2em;animation:lkblink .6s steps(1) infinite}
@keyframes lkin{from{opacity:0}to{opacity:1}}
@keyframes lkblink{50%{opacity:.2}}
@keyframes lkshake{0%,100%{transform:none}20%{transform:translate(-8px,4px)}40%{transform:translate(8px,-4px)}60%{transform:translate(-6px,-3px)}80%{transform:translate(6px,3px)}}
@keyframes lkpop{to{opacity:0;transform:translate(-50%,-50%) scale(1.3)}}

/* door: leaf that swings open + camera zoom */
.door{perspective:60em}
.door::after{content:"";position:absolute;inset:0;background:linear-gradient(#0b0f0b,#050705);border-right:.2em solid #1c231d;transform-origin:left center;transition:transform 1.3s cubic-bezier(.4,0,.2,1);z-index:0}
.door>*{z-index:1}
.door .plate{z-index:2}
.door.open{cursor:pointer}
.door.swing{background:radial-gradient(ellipse at 50% 55%,#d8ffe0,#39ff5a 40%,#041a0a 90%)}
.door.swing::after{transform:rotateY(-78deg)}
#stage.doorzoom{transform-origin:84% 42%;transform:scale(7);opacity:.15;transition:transform 1.9s cubic-bezier(.5,0,.85,.4),opacity 1.9s ease-in}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
