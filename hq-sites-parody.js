/* hq-sites-parody.js : realistic fish-themed parodies. Load AFTER hq-sites.js and BEFORE hq-browser.js.
   It replaces the pages: youtube, wiki, x, reddit, google, discord, github, roblox, minecraft, bikini and the "no results" page.
   Twitch and rule34 stay as they were. All names are parodies, all content is offline and safe for work. */
(() => {
'use strict';
const S = window.HQSites;
const fish = (c, extra, cls) => S.fishSVG(c, extra || '', cls || '');
const pick = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : String(n);
const av = (c, size = 36) => `<span class="pz-av" style="width:${size}px;height:${size}px;background:${c}33">${fish(c)}</span>`;
const COL = ['#ff9f43', '#4fc3e8', '#ffd75a', '#ff6b81', '#8af58a', '#d49aff', '#8ee3ff', '#3a6ea5'];

function wire(view) {
  view.addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    b.classList.toggle('on');
    const grp = b.dataset.t;
    if (grp === 'vote') { const p = b.parentNode; p.querySelectorAll('[data-t]').forEach(x => { if (x !== b) x.classList.remove('on'); }); }
    const box = b.closest('[data-base]') || b; const n = box.querySelector('[data-n]');
    if (n) { const base = +n.dataset.n; const up = box.querySelector('[data-t="vote"].up.on'), dn = box.querySelector('[data-t="vote"].dn.on'); const add = grp === 'vote' ? (up ? 1 : dn ? -1 : 0) : (b.classList.contains('on') ? 1 : 0); n.textContent = fmt(base + add); }
    if (b.dataset.sub !== undefined) b.textContent = b.classList.contains('on') ? 'Subscribed' : 'Subscribe';
  });
}
const page = (cls, html) => view => { view.innerHTML = `<div class="pz ${cls}">${html}</div>`; wire(view); };

/* ---------------- FishTube (dark video site) ---------------- */
const tubeRecs = [
  ['10 HOURS of a fish doing absolutely nothing', 'Calm Reef', '1.2B views', '10:00:00', 0],
  ['I trained my goldfish to say "gm"', 'Goldie Labs', '3.4M views', '12:41', 1],
  ['Tuna vs Salmon (Gone Wrong) (Not Clickbait)', 'Sushi Wars', '812K views', '8:09', 2],
  ['ASMR: Gentle bubbles for deep sleep', 'Bubble Therapy', '77M views', '3:00:00', 3],
  ['Why Do Fish Not Get Wet? (The Answer Will Not Shock You)', 'Kelp Academy', '1.9M views', '15:22', 4],
  ['Reacting to my own aquarium', 'Dave the Fish Guy', '221K views', '6:15', 5]
];
const tube = page('ytb', `
<div class="tb-top"><div class="tb-l"><span class="tb-menu">&#9776;</span><span class="tb-logo"><i></i>FishTube</span></div>
<div class="tb-search"><input placeholder="Search"><button>&#8981;</button></div><div class="tb-r"><span class="tb-ic">+</span><span class="tb-ic">&#128276;</span><span class="tb-me">F</span></div></div>
<div class="tb-wrap"><aside class="tb-side"><a class="on">Home</a><a>Shorts</a><a>Subscriptions</a><hr><a>You</a><a>History</a><a>Your videos</a><a>Watch later</a><hr><b>Subscriptions</b><a>Calm Reef</a><a>Goldie Labs</a><a>Bubble Therapy</a></aside>
<main class="tb-main"><div class="tb-player"><div class="tb-sea">${[0, 1, 2].map(i => `<span class="tbf f${i}">${fish(COL[i])}</span>`).join('')}</div>
 <div class="tb-ctl"><div class="tb-prog"><i></i></div><div class="tb-row"><span>&#9654;</span><span>&#128266;</span><span class="tb-time">0:42 / 10:00:00</span><span class="tb-sp"></span><span>CC</span><span>&#9881;</span><span>&#9974;</span></div></div></div>
 <h1>${esc(tubeRecs[0][0])}</h1>
 <div class="tb-chan"><div class="tb-cl">${av(COL[0], 40)}<div><b>Calm Reef</b><small>4.2M subscribers</small></div><button class="tb-sub" data-t="x" data-sub>Subscribe</button></div>
  <div class="tb-acts" data-base><span class="tb-pill" data-t="like">&#128077; <span data-n="4100000">4.1M</span></span><span class="tb-pill">&#128078;</span><span class="tb-pill">Share</span><span class="tb-pill">Download</span></div></div>
 <div class="tb-desc"><b>1.2B views &nbsp; 1 day ago</b><p>Exactly what it says. The fish does nothing. Please do not skip ahead, he can tell.</p><p class="tb-more">...more</p></div>
 <h3 class="tb-ch">24,310 Comments</h3>
 ${[['@sealionking', 'this is the most relaxing thing i have ever seen', '8.2K'], ['@bubbles_irl', 'the one on the left is judging you', '3.1K'], ['@dave', 'has anyone seen the archive door', '912'], ['@tuna_ceo', 'first. (i am a fish)', '2.4K']].map((c, i) => `<div class="tb-cm" data-base>${av(COL[i + 2], 34)}<div><b>${c[0]}</b> <small>${i + 1} hours ago</small><p>${c[1]}</p><span class="tb-lk" data-t="like">&#128077; <span data-n="${parseInt(c[2]) * (c[2].includes('K') ? 100 : 1)}">${c[2]}</span></span></div></div>`).join('')}
</main>
<aside class="tb-rec"><div class="tb-chips"><span class="on">All</span><span>Fish</span><span>Water</span><span>Related</span></div>${tubeRecs.slice(1).map(v => `<div class="tb-card"><div class="tb-th" style="background:${COL[v[4]]}2a">${fish(COL[v[4]])}<em>${v[3]}</em></div><div><b>${esc(v[0])}</b><small>${v[1]}<br>${v[2]} &middot; 3 days ago</small></div></div>`).join('')}</aside></div>`);

/* ---------------- Wikifishia (Vector layout) ---------------- */
const wiki = page('wk', `
<div class="wk-top"><div class="wk-user"><a>Not logged in</a><a>Talk</a><a>Contributions</a><a>Create account</a><a>Log in</a></div></div>
<div class="wk-frame"><div class="wk-left"><div class="wk-globe">${fish('#9aa7b4')}<b>WIKIFISHIA</b><small>The Free Fishcyclopedia</small></div>
 <div class="wk-nav"><h6>Navigation</h6><a>Main page</a><a>Contents</a><a>Current events</a><a>Random fish</a><a>About Wikifishia</a><h6>Contribute</h6><a>Help</a><a>Community portal</a><a>Recent changes</a><a>Upload file</a><h6>Tools</h6><a>What links here</a><a>Cite this page</a></div></div>
<div class="wk-content"><div class="wk-tabs"><span class="on">Article</span><span>Talk</span><span class="r">Read</span><span>Edit</span><span>View history</span><input placeholder="Search Wikifishia"></div>
<div class="wk-art"><h1>Fish</h1><div class="wk-from">From Wikifishia, the free fishcyclopedia</div>
 <div class="wk-hat"><i>"Fishes" redirects here. For the verb, see <a>Fish (verb)</a>. For the Sonic character, please stop.</i></div>
 <table class="wk-info"><tr><th colspan="2">Fish</th></tr><tr><td colspan="2" class="wk-img">${S.fishImg('clown', 300)}<small>An ocellaris clownfish, famous for a film nobody asked about</small></td></tr>
 <tr><th colspan="2" class="wk-sub">Scientific classification</th></tr><tr><td>Kingdom:</td><td><a>Animalia</a></td></tr><tr><td>Phylum:</td><td><a>Chordata</a></td></tr><tr><td>Clade:</td><td>Craniata</td></tr><tr><td>Groups included</td><td>several (it is complicated)</td></tr><tr><td>Vibe:</td><td>aquatic</td></tr></table>
 <p><b>Fish</b> are <a>aquatic</a>, <a>craniate</a>, <a>gill</a>-bearing animals that lack limbs with digits<sup class="wk-c">[1]</sup>. They are found in nearly every body of water and, according to some editors, in nearly every conversation<sup class="wk-c">[citation needed]</sup>.</p>
 <p>The term is used loosely: <a>starfish</a>, <a>jellyfish</a> and <a>crayfish</a> are not fish. <a>Silverfish</a> are not fish either, and they are not sorry.</p>
 <div class="wk-toc"><b>Contents</b><ol><li>Etymology</li><li>Evolution</li><li>Anatomy</li><li>In popular culture</li><li>See also</li></ol></div>
 <h2>Etymology <span class="wk-e">[edit]</span></h2><p>The word comes from Old English <i>fisc</i>, which is the sound a fish makes when ignored.</p>
 <h2>In popular culture <span class="wk-e">[edit]</span></h2><p>Fish appear in aquariums, dinners, memes and at least one very persistent acronym.</p>
 <h2>References <span class="wk-e">[edit]</span></h2><ol class="wk-ref"><li>Kelp, R. (2011). <i>Gills: A Personal History.</i> Reef Press.</li><li>Dave (n.d.). "Notes on the archive door." Retrieved 03:12.</li></ol>
 <div class="wk-cat">Categories: <a>Fish</a> | <a>Water</a> | <a>Things that are not wet</a></div>
 <p class="wk-photo">Photo: janderk, public domain, via Wikimedia Commons.</p></div></div></div>`);

/* ---------------- Fix (X-like) ---------------- */
const xposts = [
  ['Gm Fish', 'gm_fish', COL[1], 'gm', '4h', 2100, 340, 12800],
  ['Tuna CEO', 'tuna_ceo', COL[3], 'synergy is just schooling with extra steps', '6h', 8800, 1400, 52000],
  ['Dave', 'dave_irl', COL[2], 'still looking for that door. if you have seen it, do not tell management', '9h', 940, 220, 7100],
  ['Kelp News', 'kelpnews', COL[4], 'BREAKING: local fish confirms it is, in fact, wet. more at 11.', '11h', 14000, 3200, 91000]
];
const xp = page('xx', `
<div class="x-wrap"><nav class="x-nav"><div class="x-logo">${fish('#e7e9ea')}</div><a class="on">Home</a><a>Explore</a><a>Notifications</a><a>Messages</a><a>Bookmarks</a><a>Profile</a><button class="x-post">Post</button></nav>
<main class="x-main"><div class="x-tabs"><span class="on">For you</span><span>Following</span></div>
<div class="x-comp">${av(COL[0], 40)}<div><div class="x-in">What is happening?!</div><div class="x-cr"><span>&#128247; &#9881; &#9786;</span><button>Post</button></div></div></div>
${xposts.map(p => `<article class="x-t" data-base>${av(p[2], 40)}<div><div class="x-hd"><b>${p[0]}</b> <span class="x-vf">&#10003;</span> <small>@${p[1]} &middot; ${p[4]}</small></div><p>${p[3]}</p>
<div class="x-ac"><span>&#128172; ${fmt(p[5] / 10 | 0)}</span><span>&#8635; ${fmt(p[6])}</span><span class="x-hr" data-t="like">&#9825; <span data-n="${p[7]}">${fmt(p[7])}</span></span><span>&#8681;</span></div></div></article>`).join('')}</main>
<aside class="x-side"><div class="x-srch">&#8981; Search</div><div class="x-card"><h3>What's happening</h3>${[['Fish Trends', '#BlubBlub', '48K posts'], ['Technology', 'Gills 2.0', '12K posts'], ['Trending', '#NotWet', '9,321 posts'], ['Sports', 'Synchronised swimming finals', '77K posts']].map(t => `<div class="x-tr"><small>${t[0]} &middot; Trending</small><b>${t[1]}</b><small>${t[2]}</small></div>`).join('')}</div>
<div class="x-card"><h3>Who to follow</h3>${[['Calm Reef', 'calmreef', COL[0]], ['Bubble Therapy', 'bubbles', COL[6]]].map(f => `<div class="x-fl">${av(f[2], 36)}<div><b>${f[0]}</b><small>@${f[1]}</small></div><button>Follow</button></div>`).join('')}</div></aside></div>`);

/* ---------------- Fishdit (Reddit-like) ---------------- */
const rposts = [
  ['TIL fish do not know they are wet', 'blubblub', 18400, 982, 'Discussion', 0],
  ['my fish is staring at me. update: he is still staring', 'eelon', 9700, 410, 'Help', 1],
  ['[OC] I drew my aquarium at 03:12 and now I am scared', 'dave_irl', 5300, 233, 'Art', 2],
  ['PSA: posts about sharks must contain at least one shark', 'mod_trout', 12100, 1500, 'Mod post', 3],
  ['Is it normal for my plant to be this healthy', 'kelp_ceo', 2300, 98, 'Question', 4]
];
const rd = page('rd', `
<div class="rd-top"><div class="rd-lg"><span class="rd-ico">${fish('#fff')}</span><b>fishdit</b></div><div class="rd-sr"><span>&#8981;</span> Search Fishdit</div><div class="rd-btns"><button>Log In</button></div></div>
<div class="rd-ban"><div class="rd-bn"><span class="rd-cava">${fish('#ff9f43')}</span><div><h1>r/fishposting</h1><small>r/fishposting</small></div><button data-t="x" data-sub>Join</button></div></div>
<div class="rd-wrap"><main class="rd-feed"><div class="rd-sort"><span class="on">Hot</span><span>New</span><span>Top</span><span>Rising</span></div>
${rposts.map(p => `<article class="rd-p" data-base><div class="rd-v"><span class="up" data-t="vote">&#9650;</span><b><span data-n="${p[2]}">${fmt(p[2])}</span></b><span class="dn" data-t="vote">&#9660;</span></div>
<div class="rd-th" style="background:${COL[p[5]]}2a">${fish(COL[p[5]])}</div><div class="rd-b"><div class="rd-fl"><em>${p[4]}</em></div><h3>${esc(p[0])}</h3><small>Posted by u/${p[1]} ${p[5] + 2} hours ago</small><div class="rd-ac"><span>&#128172; ${fmt(p[3])} Comments</span><span>Share</span><span>Save</span></div></div></article>`).join('')}</main>
<aside class="rd-side"><div class="rd-bx"><h4>About Community</h4><p>Where fish post. No sharks without a shark. Be kind to the anemone.</p><div class="rd-st"><div><b>1.2M</b><small>Fishes</small></div><div><b>4.2K</b><small>Online</small></div></div><button>Create Post</button></div>
<div class="rd-bx"><h4>Rules</h4><ol><li>No sharks without a shark</li><li>Respect the tide</li><li>No questions about the door</li></ol></div></aside></div>`);

/* ---------------- Gillgle (search engine home) ---------------- */
const gg = view => {
  view.innerHTML = `<div class="pz gg"><div class="gg-top"><a>About</a><a>Store</a><span class="gg-r"><a>Mail</a><a>Images</a><span class="gg-grid">&#8942;&#8942;</span><button>Sign in</button></span></div>
  <div class="gg-mid"><div class="gg-logo"><span style="color:#4285f4">G</span><span style="color:#ea4335">i</span><span style="color:#fbbc05">l</span><span style="color:#4285f4">l</span><span style="color:#34a853">g</span><span style="color:#ea4335">l</span><span style="color:#fbbc05">e</span></div>
  <div class="gg-box"><span>&#8981;</span><input id="ggQ" autocomplete="off"><span class="gg-mic">&#127908;</span></div>
  <div class="gg-btns"><button id="ggS">Gillgle Search</button><button id="ggF">I'm Feeling Fishy</button></div>
  <div class="gg-lang">Gillgle offered in: <a>Salmon</a> <a>Tuna</a> <a>Blub</a></div></div>
  <div class="gg-foot"><div>Fishland</div><div class="gg-fl"><span>Advertising</span><span>Business</span><span>How Search works</span><span class="gg-r"><span>Privacy</span><span>Terms</span><span>Settings</span></span></div></div></div>`;
  view.querySelector('#ggS').onclick = () => view.querySelector('#ggQ').focus();
  view.querySelector('#ggF').onclick = () => { const q = view.querySelector('#ggQ'); q.value = 'did you mean: Trawl?'; };
};

/* ---------------- Fishcord (chat app) ---------------- */
const dc = page('dc', `
<div class="dc-app"><div class="dc-srv">${[0, 1, 2, 3].map(i => `<span class="${i === 0 ? 'on' : ''}" style="background:${COL[i]}33">${fish(COL[i])}</span>`).join('')}<span class="dc-add">+</span></div>
<div class="dc-ch"><div class="dc-sh">Blub Central &#9662;</div><div class="dc-cl"><small>TEXT CHANNELS</small><a class="on"># blub-general</a><a># cursed-aquariums</a><a># gm</a><a># dave-has-the-door</a><small>VOICE CHANNELS</small><a>&#128266; bubbling</a><div class="dc-vu">${av(COL[1], 20)} gm_fish<br>${av(COL[4], 20)} kelpking</div><a>&#128266; deep sleep</a></div>
<div class="dc-me">${av(COL[0], 32)}<div><b>you</b><small>#0032</small></div></div></div>
<div class="dc-chat"><div class="dc-hd"># blub-general <small>The only channel where fish speak freely</small></div><div class="dc-ms">
${[['gm_fish', COL[1], 'gm', '10:02'], ['kelpking', COL[4], 'anyone seen the archive door', '10:03'], ['Dave', COL[2], 'do not tell management', '10:03'], ['Bubble Bot', COL[5], 'Reminder: blub responsibly. BOT', '10:04'], ['tuna_ceo', COL[3], 'we should circle back on the synergy', '10:07']].map(m => `<div class="dc-m">${av(m[1], 40)}<div><b style="color:${m[1]}">${m[0]}</b> <small>Today at ${m[3]}</small><p>${m[2]}</p></div></div>`).join('')}</div>
<div class="dc-in">+ <span>Message # blub-general</span></div></div>
<div class="dc-mem"><small>ONLINE &mdash; 4</small>${[['gm_fish', 1], ['kelpking', 4], ['Dave', 2], ['tuna_ceo', 3]].map(m => `<div class="dc-mm">${av(COL[m[1]], 30)}<b>${m[0]}</b></div>`).join('')}</div></div>`);

/* ---------------- Fishhub (code host) ---------------- */
const gh = page('gh', `
<div class="gh-top"><span class="gh-lg">${fish('#fff')}</span><div class="gh-s">Search or jump to...</div><nav><a>Pull requests</a><a>Issues</a><a>Marketplace</a><a>Explore</a></nav></div>
<div class="gh-rh"><div class="gh-tt">&#9633; <a>kelp-ceo</a> / <b>sea-bass-basic</b> <em>Public</em><span class="gh-bt"><button>&#128065; Watch 12</button><button>&#9095; Fork 88</button><button data-t="x" data-base>&#9733; Star <span data-n="4200">4.2k</span></button></span></div>
<div class="gh-tabs"><span class="on">&lt;&gt; Code</span><span>Issues <i>3</i></span><span>Pull requests</span><span>Actions</span><span>Projects</span><span>Security</span><span>Insights</span></div></div>
<div class="gh-wrap"><main><div class="gh-bar"><button>&#9095; main &#9662;</button><span>2 branches &middot; 14 tags</span><button class="gc">&lt;&gt; Code &#9662;</button></div>
<table class="gh-ft"><tr class="gh-last"><td colspan="3"><b>dave</b> fix: stop swimming into the archive door <span>3 hours ago &middot; 212 commits</span></td></tr>
${[['&#128193; bass', 'add some bass', '2 days ago'], ['&#128193; scales', 'polish scales (again)', '5 days ago'], ['&#128196; .gitignore', 'ignore the water', '3 months ago'], ['&#128196; LICENSE', 'Initial commit', '3 months ago'], ['&#128196; README.md', 'update readme: it is a bass', '3 hours ago'], ['&#128196; swim.py', 'swim faster', '1 week ago']].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>
<div class="gh-rm"><h4>&#128214; README.md</h4><h2>sea-bass-basic</h2><p>A very simple bass. It swims. It is a bass.</p><h3>Install</h3><pre>git clone https://fishhub.com/kelp-ceo/sea-bass-basic\ncd sea-bass-basic\npython swim.py</pre><h3>Contributing</h3><p>Pull requests that mention the door will be closed.</p></div></main>
<aside><h4>About</h4><p>a very simple bass</p><div class="gh-tag"><span>fish</span><span>bass</span><span>swimming</span></div><div class="gh-st">&#9733; 4.2k stars<br>&#128065; 12 watching<br>&#9095; 88 forks</div><h4>Languages</h4><div class="gh-lang"><i style="width:82%;background:#3178c6"></i><i style="width:12%;background:#f1e05a"></i><i style="width:6%;background:#e34c26"></i></div><small><span style="color:#3178c6">&#9679;</span> Water 82% &nbsp; <span style="color:#f1e05a">&#9679;</span> Bubbles 12% &nbsp; <span style="color:#e34c26">&#9679;</span> HTML 6%</small></aside></div>`);

/* ---------------- Robloxfin (game platform) ---------------- */
const games = [['Be a Fish Simulator', '94%', '41K', 0], ['Escape the Aquarium (Obby)', '81%', '12K', 1], ['Tycoon: Tuna Empire', '88%', '8.2K', 2], ['Brookhaven but wet', '90%', '230K', 3], ['Adopt a Fish', '97%', '1.1M', 4], ['Fishing Simulator 2', '85%', '30K', 5], ['Door Escape (Dave)', '72%', '1.9K', 6], ['Blub Blox', '91%', '17K', 7]];
const rb = page('rb', `
<div class="rb-top"><b class="rb-lg">ROBLOXFIN</b><nav><a>Discover</a><a>Marketplace</a><a>Create</a><a>Robux</a></nav><div class="rb-s">&#8981; Search</div><span class="rb-r">&#9679; 1,204 R$</span></div>
<div class="rb-wrap"><aside class="rb-side"><a class="on">Home</a><a>Profile</a><a>Messages</a><a>Friends</a><a>Avatar</a><a>Inventory</a><a>Trade</a><a>Groups</a></aside>
<main><div class="rb-hello">${av(COL[0], 70)}<div><h2>Hello, Fish_032</h2><small>You have 0 friends online. They are all asleep.</small></div></div>
<h3>Continue</h3><div class="rb-row">${games.slice(0, 5).map(g => `<div class="rb-g"><div class="rb-th" style="background:${COL[g[3]]}33">${fish(COL[g[3]])}</div><b>${g[0]}</b><small>&#128077; ${g[1]} &nbsp; &#128100; ${g[2]}</small></div>`).join('')}</div>
<h3>Recommended for you</h3><div class="rb-row">${games.slice(3).map(g => `<div class="rb-g"><div class="rb-th" style="background:${COL[g[3]]}33">${fish(COL[g[3]])}</div><b>${g[0]}</b><small>&#128077; ${g[1]} &nbsp; &#128100; ${g[2]}</small></div>`).join('')}</div></main></div>`);

/* ---------------- Fishcraft (blocky game site) ---------------- */
const mc = page('mc', `
<div class="mc-top"><b class="mc-lg">FISHCRAFT</b><nav><a>Game</a><a>Store</a><a>Realms</a><a>Community</a><a>Help</a></nav><button>Get Fishcraft</button></div>
<div class="mc-hero"><div class="mc-sky"></div><div class="mc-hills"></div><div class="mc-gr">${Array.from({ length: 26 }, () => '<i></i>').join('')}</div><div class="mc-ht"><h1>Mine. Craft. Swim.</h1><p>The best-selling fish game of all time. Place blocks. Place more blocks. Fish nibbles.</p><button>Buy now &mdash; 29,99&euro;</button></div></div>
<div class="mc-cards">${[['Update 1.21: The Kelp Update', COL[4]], ['New mob: the Tuna', COL[7]], ['Realms: swim with friends', COL[1]]].map(c => `<div class="mc-c"><div class="mc-ci" style="background:${c[1]}33">${fish(c[1])}</div><b>${c[0]}</b><small>Read more &rsaquo;</small></div>`).join('')}</div>
<div class="mc-fact"><b>Did you know?</b> Cod are dropped when you punch a cod. Tropical fish have 2,700 patterns. You will find none of them.</div>`);

/* ---------------- Beach Season (swimwear shop) ---------------- */
const BK = c => `<g fill="${c}"><circle cx="64" cy="36" r="7"/><circle cx="78" cy="36" r="7"/><path d="M92 28 L104 34 L92 40Z"/></g><path d="M64 36 L72 18 L78 36" stroke="${c}" fill="none" stroke-width="1.6"/>`;
const bs = page('bs', `
<div class="bs-ann">FREE SHIPPING on orders over 40 sea-shells</div><div class="bs-top"><b>BEACH SEASON</b><nav><a>New</a><a>Bikinis</a><a>Trunks</a><a>Sale</a></nav><span>&#128722; 0</span></div>
<div class="bs-hero"><h1>Fin-ally summer</h1><p>Swimwear for every species. Strictly family friendly. The fish insisted.</p></div>
<div class="bs-grid">${[['Coral Classic Bikini', '$19.99', '#ff5fa2', COL[0]], ['Reef Racer Trunks', '$24.50', '#4fc3e8', COL[2]], ['Kelp Wrap Two-Piece', '$17.00', '#8af58a', COL[5]], ['Sunset Scales Set', '$29.99', '#ffb347', COL[1]]].map(p => `<div class="bs-p"><div class="bs-img" style="background:${p[3]}1f">${fish(p[3], BK(p[2]))}</div><b>${p[0]}</b><small>${p[1]}</small><button>Add to cart</button></div>`).join('')}</div>`);

/* ---------------- Trawl results page (no results) ---------------- */
const nores = q => view => {
  const t = esc(q || '');
  view.innerHTML = `<div class="pz tr"><div class="tr-top"><span class="tr-lg">Tr<i>aw</i>l</span><div class="tr-box">${t}<span>&#8981;</span></div></div><div class="tr-tabs"><span class="on">All</span><span>Images</span><span>Videos</span><span>News</span><span>Maps</span></div>
  <div class="tr-res"><small>About 0 results (0.42 seconds)</small><div class="tr-did">Did you mean: <a>fish</a></div>
  ${[['Fish - Wikifishia', 'en.wikifishia.org &rsaquo; wiki &rsaquo; Fish', 'Fish are aquatic, craniate, gill-bearing animals that lack limbs with digits...'], ['10 HOURS of a fish doing nothing - FishTube', 'www.fishtube.com &rsaquo; watch', 'The fish does nothing. Please do not skip ahead, he can tell.'], ['F.I.H : Fisheries Innovation Harbor', 'www.fih-harbor.org', 'Caring for the ocean, from the surface down. Sustainable aquaculture and community research.']].map(r => `<div class="tr-r"><small>${r[1]}</small><a>${r[0]}</a><p>${r[2]}</p></div>`).join('')}
  <p class="tr-hint">Try fewer keywords. Fish only know about three.</p></div></div>`;
};

Object.assign(S.pages, { youtube: tube, wiki, x: xp, reddit: rd, google: gg, discord: dc, github: gh, roblox: rb, minecraft: mc, bikini: bs });
const oldBuild = S.build;
S.build = (route, q) => route === 'nores' ? nores(q) : oldBuild(route, q);

const st = document.createElement('style');
st.textContent = `
.pz{min-height:100%;font-family:Segoe UI,Roboto,Arial,sans-serif;font-size:14px;box-sizing:border-box}
.pz *{box-sizing:border-box}.pz a{cursor:pointer}.pz button{font:inherit;cursor:pointer}
.pz-av{display:inline-flex;flex:none;border-radius:50%;overflow:hidden;align-items:center;justify-content:center;padding:15%}.pz-av .fsvg{width:100%}
.pz small{opacity:.7}
/* tube */
.ytb{background:#0f0f0f;color:#f1f1f1}.tb-top{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:.5em 1em;background:#0f0f0f}.tb-l{display:flex;align-items:center;gap:1em}.tb-menu{font-size:1.4em}
.tb-logo{display:flex;align-items:center;gap:.3em;font-weight:700;font-size:1.3em;letter-spacing:-.04em}.tb-logo i{width:1.7em;height:1.2em;border-radius:.4em;background:#f00;position:relative}.tb-logo i::after{content:"";position:absolute;left:.65em;top:.3em;border:.3em solid transparent;border-left:.5em solid #fff;border-right:0}
.tb-search{display:flex;width:36%;min-width:12em}.tb-search input{flex:1;padding:.5em 1em;border:1px solid #303030;border-radius:2em 0 0 2em;background:#121212;color:#fff;outline:0}.tb-search button{padding:0 1.4em;border:1px solid #303030;border-left:0;border-radius:0 2em 2em 0;background:#222;color:#fff}
.tb-r{display:flex;gap:.8em;align-items:center}.tb-ic{font-size:1.2em}.tb-me{width:2em;height:2em;border-radius:50%;background:#8a2be2;text-align:center;line-height:2em}
.tb-wrap{display:flex;gap:1.2em;padding:.5em 1em}.tb-side{width:11em;flex:none;display:flex;flex-direction:column;gap:.1em}.tb-side a{padding:.55em .8em;border-radius:.6em}.tb-side a.on,.tb-side a:hover{background:#272727}.tb-side hr{border:0;border-top:1px solid #303030;margin:.5em 0}.tb-side b{padding:.4em .8em;font-size:.95em}
.tb-main{flex:1;min-width:0}.tb-player{position:relative;aspect-ratio:16/9;background:#06223c;border-radius:.8em;overflow:hidden}.tb-sea{position:absolute;inset:0}.tbf{position:absolute;width:5em;animation:tbs 12s linear infinite}.tbf.f0{top:22%}.tbf.f1{top:52%;animation-duration:17s;animation-delay:-6s}.tbf.f2{top:74%;animation-duration:9s;animation-delay:-3s}@keyframes tbs{from{left:-8em}to{left:105%}}
.tb-ctl{position:absolute;left:0;right:0;bottom:0;padding:.5em .8em;background:linear-gradient(#0000,#000a)}.tb-prog{height:.3em;background:#fff4;margin-bottom:.4em}.tb-prog i{display:block;width:4%;height:100%;background:#f00}.tb-row{display:flex;gap:1em;align-items:center;font-size:.9em}.tb-sp{flex:1}
.tb-main h1{font-size:1.25em;margin:.7em 0 .4em}.tb-chan{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8em}.tb-cl{display:flex;align-items:center;gap:.8em}.tb-cl small{display:block}
.tb-sub{padding:.5em 1em;border:0;border-radius:2em;background:#f1f1f1;color:#0f0f0f;font-weight:600}.tb-sub.on{background:#272727;color:#f1f1f1}
.tb-acts{display:flex;gap:.5em}.tb-pill{padding:.5em 1em;border-radius:2em;background:#272727;cursor:pointer}.tb-pill.on{background:#3a3a3a}
.tb-desc{margin:1em 0;padding:.8em 1em;border-radius:.8em;background:#272727}.tb-more{opacity:.7}.tb-ch{margin:1.2em 0 .8em}
.tb-cm{display:flex;gap:.8em;margin-bottom:1em}.tb-lk{cursor:pointer;opacity:.8}.tb-lk.on{color:#3ea6ff}
.tb-rec{width:22em;flex:none}.tb-chips{display:flex;gap:.5em;margin-bottom:.8em}.tb-chips span{padding:.35em .8em;border-radius:.6em;background:#272727}.tb-chips .on{background:#f1f1f1;color:#0f0f0f}
.tb-card{display:flex;gap:.6em;margin-bottom:.8em}.tb-th{position:relative;width:10em;aspect-ratio:16/9;flex:none;border-radius:.6em;padding:.5em;display:flex;align-items:center;justify-content:center}.tb-th .fsvg{width:60%}.tb-th em{position:absolute;right:.3em;bottom:.3em;padding:0 .3em;border-radius:.2em;background:#000c;font-style:normal;font-size:.75em}.tb-card b{font-size:.9em;line-height:1.3;display:block}
/* wiki */
.wk{background:#f6f6f6;color:#202122;font-family:sans-serif}.wk-top{padding:.4em 1em;text-align:right;font-size:.8em}.wk-user a{margin-left:1.2em;color:#0645ad}
.wk-frame{display:flex}.wk-left{width:11em;flex:none;padding:0 .8em}.wk-globe{text-align:center;margin-bottom:1em}.wk-globe .fsvg{width:6em;display:block;margin:0 auto .3em}.wk-globe b{display:block;letter-spacing:.1em;font-family:Georgia,serif}.wk-globe small{font-size:.7em}
.wk-nav h6{margin:1em 0 .3em;font-size:.75em;color:#54595d;border-bottom:1px solid #c8ccd1}.wk-nav a{display:block;color:#0645ad;font-size:.8em;padding:.15em 0}
.wk-content{flex:1;min-width:0;background:#fff;border:1px solid #a7d7f9;border-right:0;margin-top:2.2em}.wk-tabs{display:flex;gap:1.2em;align-items:center;padding:.6em 1em 0;border-bottom:1px solid #a7d7f9;font-size:.8em;color:#0645ad;background:linear-gradient(#fff,#f2f8fd)}.wk-tabs .on{color:#202122;font-weight:600}.wk-tabs .r{margin-left:auto}.wk-tabs input{padding:.2em .6em;border:1px solid #a2a9b1}
.wk-art{padding:1em 2em 3em;line-height:1.6;font-size:.95em}.wk-art h1{font-family:Georgia,serif;font-weight:400;font-size:1.9em;border-bottom:1px solid #a2a9b1;margin:0}.wk-from{font-size:.8em;color:#54595d;margin:.4em 0 .8em}.wk-hat{font-size:.85em;padding-left:1.6em;margin-bottom:.8em}.wk-art a{color:#0645ad}
.wk-art h2{font-family:Georgia,serif;font-weight:400;font-size:1.4em;border-bottom:1px solid #a2a9b1;margin:1.2em 0 .4em}.wk-e{font-family:sans-serif;font-size:.5em;color:#0645ad}.wk-c{color:#0645ad;font-size:.75em}
.wk-info{float:right;width:19em;margin:0 0 1em 1.2em;border:1px solid #a2a9b1;background:#f8f9fa;font-size:.8em;border-collapse:collapse}.wk-info th{background:#b0e0e6;padding:.4em;text-align:center}.wk-info td{padding:.25em .5em}.wk-sub{background:#d6eaf0!important;font-weight:400}.wk-img{text-align:center}.wk-img img,.wk-img .ph{width:100%;display:block}.wk-img small{display:block;padding:.3em}
.wk-toc{display:inline-block;border:1px solid #a2a9b1;background:#f8f9fa;padding:.6em 1em;font-size:.85em;margin:.6em 0}.wk-toc ol{margin:.3em 0 0 1.4em}.wk-ref{font-size:.85em;margin-left:1.4em}.wk-cat{margin-top:1.4em;padding:.5em;border:1px solid #a2a9b1;background:#f8f9fa;font-size:.85em}.wk-photo{font-size:.75em;color:#72777d}
/* x */
.xx{background:#000;color:#e7e9ea}.x-wrap{display:flex;max-width:75em;margin:0 auto}.x-nav{width:13em;flex:none;padding:.8em;display:flex;flex-direction:column;gap:.3em;position:sticky;top:0;align-self:flex-start}.x-logo{width:2.4em;padding:.5em}.x-nav a{padding:.7em 1em;border-radius:2em;font-size:1.15em}.x-nav a.on{font-weight:700}.x-nav a:hover{background:#181818}.x-post{margin-top:.8em;padding:.8em;border:0;border-radius:2em;background:#1d9bf0;color:#fff;font-weight:700;font-size:1.05em}
.x-main{flex:1;min-width:0;border-left:1px solid #2f3336;border-right:1px solid #2f3336;max-width:37em}.x-tabs{display:flex;border-bottom:1px solid #2f3336}.x-tabs span{flex:1;text-align:center;padding:1em;color:#71767b}.x-tabs .on{color:#e7e9ea;font-weight:700;box-shadow:inset 0 -4px #1d9bf0}
.x-comp{display:flex;gap:.8em;padding:.8em 1em;border-bottom:1px solid #2f3336}.x-comp>div{flex:1}.x-in{padding:.5em 0;font-size:1.2em;color:#71767b}.x-cr{display:flex;justify-content:space-between;align-items:center;color:#1d9bf0}.x-cr button{padding:.4em 1.2em;border:0;border-radius:2em;background:#1d9bf0;color:#fff;font-weight:700}
.x-t{display:flex;gap:.8em;padding:.8em 1em;border-bottom:1px solid #2f3336}.x-t>div{flex:1}.x-hd b{font-weight:700}.x-hd small{color:#71767b}.x-vf{display:inline-block;width:1.1em;height:1.1em;border-radius:50%;background:#1d9bf0;color:#fff;text-align:center;font-size:.7em;line-height:1.1em}.x-t p{margin:.2em 0 .6em;line-height:1.4}
.x-ac{display:flex;justify-content:space-between;max-width:24em;color:#71767b;font-size:.9em}.x-hr{cursor:pointer}.x-hr.on{color:#f91880}
.x-side{width:21em;flex:none;padding:.8em 1em}.x-srch{padding:.7em 1em;border-radius:2em;background:#202327;color:#71767b}.x-card{margin-top:1em;border-radius:1em;background:#16181c;padding:.8em 1em}.x-card h3{margin-bottom:.6em}.x-tr{padding:.4em 0}.x-tr b{display:block}.x-fl{display:flex;align-items:center;gap:.6em;padding:.4em 0}.x-fl>div{flex:1}.x-fl small{display:block}.x-fl button{padding:.35em 1em;border:0;border-radius:2em;background:#eff3f4;color:#0f1419;font-weight:700}
/* reddit */
.rd{background:#dae0e6;color:#1c1c1c}.rd-top{display:flex;align-items:center;gap:1em;padding:.5em 1em;background:#fff;border-bottom:1px solid #ccc}.rd-lg{display:flex;align-items:center;gap:.4em;font-size:1.3em;color:#ff4500}.rd-ico{width:1.8em;height:1.8em;border-radius:50%;background:#ff4500;padding:.2em}.rd-sr{flex:1;max-width:36em;padding:.5em 1em;border-radius:2em;background:#f6f7f8;border:1px solid #edeff1;color:#878a8c}.rd-btns button{padding:.4em 1.4em;border:0;border-radius:2em;background:#0079d3;color:#fff;font-weight:700}
.rd-ban{background:#33a8ff;height:6em;position:relative;margin-bottom:2.6em}.rd-bn{position:absolute;left:50%;transform:translateX(-50%);bottom:-2.2em;width:min(60em,92%);display:flex;align-items:flex-end;gap:1em;padding-bottom:.6em}.rd-cava{width:4.6em;height:4.6em;border-radius:50%;border:.25em solid #fff;background:#fff;padding:.5em;margin-top:-1em}.rd-bn h1{font-size:1.6em;color:#1c1c1c}.rd-bn small{color:#7c7c7c}.rd-bn button{margin-left:auto;padding:.4em 1.6em;border:1px solid #0079d3;border-radius:2em;background:#0079d3;color:#fff;font-weight:700}.rd-bn button.on{background:#fff;color:#0079d3}
.rd-wrap{display:flex;gap:1.4em;max-width:60em;margin:1em auto;padding:0 1em}.rd-feed{flex:1;min-width:0}.rd-sort{display:flex;gap:1em;padding:.6em 1em;margin-bottom:.6em;border:1px solid #ccc;border-radius:.3em;background:#fff;color:#878a8c;font-weight:700}.rd-sort .on{color:#0079d3}
.rd-p{display:flex;margin-bottom:.6em;border:1px solid #ccc;border-radius:.3em;background:#fff}.rd-v{width:3em;flex:none;background:#f8f9fa;display:flex;flex-direction:column;align-items:center;gap:.2em;padding:.5em 0;border-radius:.3em 0 0 .3em;color:#878a8c}.rd-v span{cursor:pointer}.rd-v .up.on{color:#ff4500}.rd-v .dn.on{color:#7193ff}.rd-v b{color:#1c1c1c;font-size:.85em}
.rd-th{width:5.5em;height:4.2em;margin:.6em 0 .6em .6em;flex:none;border-radius:.3em;padding:.4em}.rd-b{padding:.6em .8em;flex:1}.rd-fl em{display:inline-block;padding:.05em .6em;border-radius:2em;background:#e8f1fb;color:#0079d3;font-size:.75em;font-style:normal}.rd-b h3{font-weight:500;font-size:1.1em;margin:.2em 0}.rd-b small{color:#787c7e}.rd-ac{margin-top:.5em;display:flex;gap:1.2em;color:#878a8c;font-weight:700;font-size:.8em}
.rd-side{width:19em;flex:none}.rd-bx{margin-bottom:.8em;padding:.8em;border:1px solid #ccc;border-radius:.3em;background:#fff}.rd-bx h4{margin-bottom:.5em;color:#7c7c7c;font-size:.8em;letter-spacing:.06em;text-transform:uppercase}.rd-bx p{font-size:.9em}.rd-st{display:flex;gap:2em;margin:.8em 0}.rd-st b{display:block;font-size:1.1em}.rd-bx button{width:100%;padding:.5em;border:0;border-radius:2em;background:#0079d3;color:#fff;font-weight:700}.rd-bx ol{margin-left:1.2em;font-size:.9em;line-height:1.7}
/* gillgle */
.gg{background:#fff;color:#202124;display:flex;flex-direction:column;min-height:100%}.gg-top{display:flex;justify-content:space-between;align-items:center;padding:.8em 1.2em;font-size:.85em}.gg-top a{margin-right:1.2em}.gg-r{display:flex;gap:1.2em;align-items:center}.gg-top button{padding:.5em 1.4em;border:0;border-radius:.3em;background:#1a73e8;color:#fff}
.gg-mid{flex:1;display:flex;flex-direction:column;align-items:center;padding-top:5em}.gg-logo{font-size:5.2em;font-family:Product Sans,Arial,sans-serif;letter-spacing:-.04em;margin-bottom:.3em}.gg-box{display:flex;align-items:center;gap:.8em;width:min(36em,88%);padding:.7em 1.2em;border:1px solid #dfe1e5;border-radius:2em;color:#9aa0a6}.gg-box:hover{box-shadow:0 1px 6px #20212447}.gg-box input{flex:1;border:0;outline:0;font:inherit;font-size:1.05em;color:#202124;-webkit-user-select:text;user-select:text}
.gg-btns{display:flex;gap:.8em;margin:1.6em 0}.gg-btns button{padding:.65em 1.2em;border:1px solid #f8f9fa;border-radius:.3em;background:#f8f9fa;color:#3c4043}.gg-btns button:hover{border-color:#dadce0;box-shadow:0 1px 1px #0003}.gg-lang{font-size:.85em;color:#4d5156}.gg-lang a{color:#1a0dab;margin-left:.4em}
.gg-foot{background:#f2f2f2;color:#70757a;font-size:.85em}.gg-foot>div{padding:.9em 1.4em}.gg-foot>div:first-child{border-bottom:1px solid #dadce0}.gg-fl{display:flex;gap:1.6em}.gg-fl .gg-r{margin-left:auto}
/* discord */
.dc{background:#313338;color:#dbdee1;height:100%}.dc-app{display:flex;height:100%;min-height:34em}.dc-srv{width:4.4em;flex:none;background:#1e1f22;display:flex;flex-direction:column;align-items:center;gap:.6em;padding:.7em 0}.dc-srv span{width:3em;height:3em;border-radius:50%;padding:.5em;cursor:pointer;transition:border-radius .15s}.dc-srv span:hover,.dc-srv .on{border-radius:30%}.dc-add{display:flex;align-items:center;justify-content:center;background:#313338;color:#23a559;font-size:1.6em}
.dc-ch{width:15em;flex:none;background:#2b2d31;display:flex;flex-direction:column}.dc-sh{padding:.9em 1em;font-weight:700;border-bottom:1px solid #1e1f22}.dc-cl{flex:1;padding:.6em .5em}.dc-cl small{display:block;padding:.8em .4em .2em;font-size:.7em;letter-spacing:.04em;color:#949ba4;font-weight:700}.dc-cl a{display:block;padding:.35em .6em;border-radius:.3em;color:#949ba4}.dc-cl a.on,.dc-cl a:hover{background:#404249;color:#fff}.dc-vu{padding:.2em 0 .2em 1.8em;font-size:.85em;color:#949ba4}.dc-vu .pz-av{vertical-align:middle;margin:0 .3em .2em 0}
.dc-me{display:flex;align-items:center;gap:.6em;padding:.5em;background:#232428}.dc-me small{display:block}
.dc-chat{flex:1;min-width:0;display:flex;flex-direction:column}.dc-hd{padding:.9em 1em;border-bottom:1px solid #1e1f22;font-weight:700}.dc-hd small{margin-left:1em;font-weight:400}.dc-ms{flex:1;padding:1em;overflow:auto}.dc-m{display:flex;gap:1em;margin-bottom:1em}.dc-m b{font-weight:600}.dc-m p{margin-top:.1em}.dc-in{margin:0 1em 1em;padding:.8em 1em;border-radius:.5em;background:#383a40;color:#949ba4}
.dc-mem{width:14em;flex:none;background:#2b2d31;padding:.8em}.dc-mem small{display:block;margin-bottom:.6em;font-size:.7em;color:#949ba4;font-weight:700}.dc-mm{display:flex;align-items:center;gap:.6em;padding:.3em;border-radius:.3em}.dc-mm:hover{background:#35373c}
/* github */
.gh{background:#0d1117;color:#e6edf3;font-family:-apple-system,Segoe UI,sans-serif}.gh-top{display:flex;align-items:center;gap:1em;padding:.8em 1.4em;background:#010409;border-bottom:1px solid #30363d}.gh-lg{width:2em;height:2em;border-radius:50%;background:#e6edf3;padding:.2em}.gh-s{padding:.35em .8em;border:1px solid #30363d;border-radius:.4em;color:#7d8590;width:16em}.gh-top nav{display:flex;gap:1em}
.gh-rh{background:#010409;padding:1em 1.4em 0;border-bottom:1px solid #30363d}.gh-tt{display:flex;align-items:center;gap:.5em;font-size:1.2em}.gh-tt a{color:#4493f8}.gh-tt em{padding:.05em .6em;border:1px solid #30363d;border-radius:2em;font-size:.6em;color:#7d8590;font-style:normal}.gh-bt{margin-left:auto;display:flex;gap:.5em}.gh-bt button{padding:.25em .8em;border:1px solid #363b42;border-radius:.4em;background:#21262d;color:#e6edf3;font-size:.65em}.gh-bt button.on{color:#e3b341}
.gh-tabs{display:flex;gap:1.2em;margin-top:.8em;font-size:.9em;color:#e6edf3}.gh-tabs span{padding:.6em .2em}.gh-tabs .on{box-shadow:inset 0 -2px #f78166;font-weight:600}.gh-tabs i{padding:0 .5em;border-radius:2em;background:#30363d;font-style:normal;font-size:.8em}
.gh-wrap{display:flex;gap:1.6em;padding:1.2em 1.4em}.gh-wrap main{flex:1;min-width:0}.gh-wrap aside{width:17em;flex:none;font-size:.9em}.gh-wrap aside h4{margin:1em 0 .5em}
.gh-bar{display:flex;gap:.8em;align-items:center;margin-bottom:.8em;font-size:.85em;color:#7d8590}.gh-bar button{padding:.3em .8em;border:1px solid #363b42;border-radius:.4em;background:#21262d;color:#e6edf3}.gh-bar .gc{margin-left:auto;background:#238636;border-color:#2ea043}
.gh-ft{width:100%;border:1px solid #30363d;border-radius:.4em;border-collapse:separate;border-spacing:0;font-size:.9em}.gh-ft td{padding:.5em 1em;border-top:1px solid #30363d}.gh-ft td:last-child{text-align:right;color:#7d8590}.gh-last td{background:#161b22;border-top:0}.gh-last span{float:right;color:#7d8590}
.gh-rm{margin-top:1.2em;border:1px solid #30363d;border-radius:.4em}.gh-rm h4{padding:.7em 1em;border-bottom:1px solid #30363d;font-weight:600}.gh-rm h2,.gh-rm h3,.gh-rm p,.gh-rm pre{margin:.8em 1em}.gh-rm h2{padding-bottom:.3em;border-bottom:1px solid #30363d}.gh-rm pre{padding:1em;background:#161b22;border-radius:.4em;font-size:.85em;overflow:auto}
.gh-tag{display:flex;gap:.4em;flex-wrap:wrap;margin:.6em 0}.gh-tag span{padding:.1em .7em;border-radius:2em;background:#388bfd26;color:#4493f8;font-size:.85em}.gh-st{line-height:1.8;color:#7d8590;margin:.6em 0}.gh-lang{display:flex;height:.5em;border-radius:1em;overflow:hidden;margin:.4em 0 .5em}.gh-lang i{display:block}
/* roblox */
.rb{background:#232527;color:#fff}.rb-top{display:flex;align-items:center;gap:1.4em;padding:.7em 1.2em;background:#191a1c}.rb-lg{letter-spacing:.2em;font-size:1.1em}.rb-top nav{display:flex;gap:1.2em;color:#bdbebe}.rb-s{flex:1;max-width:24em;padding:.4em 1em;border-radius:.4em;background:#393b3d;color:#8e9094}.rb-r{margin-left:auto;color:#02b757}
.rb-wrap{display:flex}.rb-side{width:12em;flex:none;padding:1em .6em;background:#191a1c;min-height:30em}.rb-side a{display:block;padding:.6em .8em;border-radius:.4em;color:#bdbebe}.rb-side a.on,.rb-side a:hover{background:#393b3d;color:#fff}.rb-wrap main{flex:1;min-width:0;padding:1.2em 1.6em}.rb-hello{display:flex;gap:1em;align-items:center;margin-bottom:1.2em}.rb-wrap h3{margin:1em 0 .6em;font-size:1.1em}
.rb-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(9em,1fr));gap:.9em}.rb-g b{display:block;font-size:.85em;margin:.4em 0 .15em;line-height:1.25}.rb-g small{color:#bdbebe}.rb-th{aspect-ratio:1;border-radius:.5em;display:flex;align-items:center;justify-content:center;padding:.7em;transition:transform .12s}.rb-g:hover .rb-th{transform:scale(1.04)}.rb-th .fsvg{width:80%}
/* minecraft */
.mc{background:#313233;color:#fff;font-family:Trebuchet MS,Verdana,sans-serif}.mc-top{display:flex;align-items:center;gap:1.6em;padding:.8em 1.6em;background:#1e1e1f;border-bottom:3px solid #4c8a2b}.mc-lg{font-size:1.4em;letter-spacing:.14em;font-family:monospace;color:#8fd05a;text-shadow:2px 2px #1f3a10}.mc-top nav{display:flex;gap:1.2em;color:#bbb}.mc-top button{margin-left:auto;padding:.5em 1.2em;border:2px solid #1e4a0f;background:#52a533;color:#fff;font-weight:700;box-shadow:inset 0 -3px #3a7a22}
.mc-hero{position:relative;height:26em;overflow:hidden}.mc-sky{position:absolute;inset:0;background:linear-gradient(#78b8f0,#c6e4fa)}.mc-hills{position:absolute;left:0;right:0;bottom:4em;height:10em;background:linear-gradient(#5aa043,#3c7a2a);clip-path:polygon(0 60%,12% 40%,22% 55%,35% 20%,50% 50%,62% 30%,78% 55%,90% 35%,100% 55%,100% 100%,0 100%)}
.mc-gr{position:absolute;left:0;right:0;bottom:0;height:6em;display:flex;background:#6b4a2a}.mc-gr i{flex:1;background:linear-gradient(#5fb046 0 35%,#7a5530 35%);border-right:2px solid #0002}
.mc-ht{position:absolute;left:8%;top:18%;max-width:28em;text-shadow:2px 2px #0006}.mc-ht h1{font-family:monospace;font-size:2.8em;margin-bottom:.3em}.mc-ht button{margin-top:.8em;padding:.7em 1.6em;border:2px solid #1e4a0f;background:#52a533;color:#fff;font-weight:700;font-size:1.05em;box-shadow:inset 0 -4px #3a7a22}
.mc-cards{display:flex;gap:1em;padding:1.6em;justify-content:center;flex-wrap:wrap}.mc-c{width:17em;background:#48494a;border-bottom:4px solid #2a2a2b}.mc-ci{height:9em;display:flex;align-items:center;justify-content:center}.mc-ci .fsvg{width:50%}.mc-c b{display:block;padding:.7em 1em .2em}.mc-c small{display:block;padding:0 1em 1em;color:#8fd05a}.mc-fact{padding:1.4em;background:#1e1e1f;text-align:center}
/* beach season */
.bs{background:#fff;color:#222;font-family:Helvetica,Arial,sans-serif}.bs-ann{padding:.5em;background:#111;color:#fff;text-align:center;font-size:.8em;letter-spacing:.1em}.bs-top{display:flex;align-items:center;gap:2em;padding:1em 2em;border-bottom:1px solid #eee}.bs-top b{letter-spacing:.3em;font-size:1.2em}.bs-top nav{display:flex;gap:1.6em;flex:1;font-size:.9em}.bs-hero{padding:3em 2em;text-align:center;background:linear-gradient(#ffe9f1,#e0f6ff)}.bs-hero h1{font-size:2.6em;font-weight:300;letter-spacing:.06em;margin-bottom:.3em}
.bs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(13em,1fr));gap:1.4em;padding:2em}.bs-img{aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:1em}.bs-p b{display:block;margin-top:.7em}.bs-p small{display:block;margin:.2em 0 .6em}.bs-p button{padding:.5em 1.2em;border:1px solid #111;background:#fff}.bs-p button:hover{background:#111;color:#fff}
/* trawl results */
.tr{background:#fff;color:#202124}.tr-top{display:flex;align-items:center;gap:1.6em;padding:1em 1.6em}.tr-lg{font-family:Georgia,serif;font-size:1.8em;color:#1b6aa8}.tr-lg i{color:#e8892b;font-style:normal}.tr-box{display:flex;justify-content:space-between;width:min(34em,60%);padding:.6em 1.2em;border:1px solid #dfe1e5;border-radius:2em;box-shadow:0 1px 6px #20212428}
.tr-tabs{display:flex;gap:1.4em;padding:0 8em;border-bottom:1px solid #ebebeb;color:#5f6368;font-size:.9em}.tr-tabs span{padding:.6em 0}.tr-tabs .on{color:#1a73e8;box-shadow:inset 0 -3px #1a73e8}
.tr-res{padding:1em 8em;max-width:60em}.tr-did{margin:.8em 0;font-size:1.1em}.tr-did a{color:#1a0dab;font-style:italic}.tr-r{margin:1.2em 0}.tr-r small{display:block;color:#4d5156}.tr-r a{color:#1a0dab;font-size:1.2em}.tr-r a:hover{text-decoration:underline}.tr-r p{color:#4d5156;max-width:40em}.tr-hint{margin-top:2em;color:#70757a;font-size:.85em}
`;
document.head.appendChild(st);
})();
