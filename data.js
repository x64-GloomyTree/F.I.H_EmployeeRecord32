// ===== CONFIG: edit freely =====
const CFG = {
  saveKey: "fih_hq_save_v1",
  postItText: "pw:\n1234",              // text drawn on the post-it (cosmetic)
  lockHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",                 // sha256 of the lockscreen password
  adminHash: "65033ee27a9c18e229ddef2a7df90f2fa4a9ebc2d67e9d226640e4ac15679b52",               // sha256 of the admin bypass password
  cdHash: "425933deabc4220492fa1eeda2aef7346a02796888930c797a811c58bd0454a6",                     // sha256 of the volume name (UPPERCASE)
  cdGif: "assets/cd_tape.gif",
  stopwatchStart: "2026-10-01T03:12:00+02:00",  // PLACEHOLDER start date
  sounds: {
    fan:   { src: "assets/sounds/fan_hum.mp3",   loop: true, vol: 0.50 },
    crt:   { src: "assets/sounds/crt_on.mp3",    vol: 0.5 },
    key:   { src: "assets/sounds/key.mp3",       vol: 0.35 },
    vhs:   { src: "assets/sounds/vhs_whirr.mp3", loop: true, vol: 0.35 },
    click: { src: "assets/sounds/click.mp3",     vol: 0.4 },
    error: { src: "assets/sounds/error.mp3",     vol: 0.4 }
  }
};

const BANNER = String.raw` ______ _____ _    _
|  ____|_   _| |  | |
| |__    | | | |__| |
|  __|   | | |  __  |
| |     _| |_| |  | |
|_|    |_____|_|  |_|
 HEADQUARTERS // WORKSTATION 06
 ----------------------------------
 AUTHORIZED PERSONNEL ONLY`;

// ===== Fake files readable with: cat <file> =====
const FILES = {
  "readme.txt": ["F.I.H HQ workstation 06.", "Authorized staff only.", "If you are reading this, you are logged as guest, some functions may be restricted"],
  "todo.txt":   ["- change password (again)", "- ask Dave about the archive door", "- LEAVE the feed running","- verify the hashing function to destroy evidences"],
  "cam06.log":  ["[LOCATION : Preparation Room] // [EXPECTED PERSONNEL : ████████]", "[00:00:01] feed started", "[00:00:02] subject not in frame", "[??:??:??] LOG CORRUPTED"],
  "personnel.log": ["Skipping to relevant entries...", "[EMPLOYEE#031] - On vacation", "[EMPLOYEE#032] - Resigned", "[EMPLOYEE#033] - On sick leave" ],
  "weeklyactivity.md": ["[MONDAY RECORD] : (voice transcript of the F.I.H CEO) We are proud to announce that every effort we put into our project are finally about to pay off ! The technology we managed to extract from our spying inside the [INSTITUTE] is ready to be deployed ON TERRAIN !!! (faint applauds can be heard in the background)", "[TUESDAY RECORD] : A meeting was added to your calendar about : Confidientiality during the [Hallowed Future] project deployment. Your presence is mandatory"],
  "gone.txt": ["[User Note] - Resigned", "Reason : \"I can't take it anymore, I can't work for a company that is willing to do anything to get what it wants, that is money most of the time. I can't be part of this anymore.", "They want to kill, they want to annihilate EVERYTHING that has gone through this rift, they even stole blueprints from the [Institute] to pursue their goal","I know something they have built a device they called it the [Portable Fish] I don't know exactly what they plan to do with it, as my last act of rebellion I left this station easily accessible, if you happen to find it, do what you need, seek the truth", "Note : Employee 032 was a good worker, but they were not able to handle the stress of the job. We wish them the best in their future endeavors.\""],
  "hashes.txt" : ["[Note to self] delete later or they will defo fire me, I'm just too much of an airhead to remember all of that...", "ADMN pass = <projectname>08"]
}
// ===== Hidden commands (usable after admin). Order of "id" = order in the volume name. =====
// Volume name = FRAGMENTS joined by "-" in id order, e.g. FLAT-LINE-ZERO-SIX
const CLUES = [
  { id: 1, cmd: "trace cam06",     frag: "FLAT", out: ["tracing feed origin...", "hop 1: HQ-GATEWAY", "hop 2: ████████", "[MAINTENANCE NOTE] : Delete feed to preserve deployed agent identity"] },
  { id: 2, cmd: "decode log 41",   frag: "LINE", out: ["decoding log at 41% integrity...", "...", "> Error Traceback : Failed to corrupt CAM06_feed, failed at 59%"] },
  { id: 3, cmd: "unlock vault 06", frag: "ZERO", out: ["vault 06 handshake...", "tumblers: 1 2 3 4", "admin elevation found...", "[F.I.H Employee Manual Note] : Always close the vault door before clocking out :)"] },
  { id: 4, cmd: "query target",    frag: "SIX",  out: ["querying target registry...", "status field: ██████", "CODENAME : ENTITY-01 // FLATLINED",  "Deployed Agent : ████████, Executor of F.I.H"] },
];

// ===== Library: add/remove books freely =====
const BOOKS = [
  { id: "handbook", title: "THE EMPLOYEE HANDBOOK", spine: "HANDBOOK", author: "HR DEPT.", h: 10, w: 2.4,
    cover: String.raw`+---------+
|  F.I.H  |
| ======= |
|  RULES  |
|   AND   |
|  CARE   |
+---------+`,
    pages: [
      "[EMPLOYEE MANUAL]\n\nWelcome to F.I.H.\nPlease do not leave feeds running unattended. Follow the directives of your superior.\n\n As mentionned in your contract you are not allowed to share any information that you gathered in the context of your work your whole production and existence is F.I.H property. In the case or extra-dimensional activities, do not panic, your supervisors are fully trained to handle such situations. Any breaks is deducted from your works hours. The company cannot be sued in the case something happens to you in your workplace.",
      "SECTION 4: PASSWORDS\n\nPasswords must be changed every other day to keep maximum security inside the department.\nPasswords must not be written down either for the same reason.\n\n(see: the post-it incident // E#032 resignation)",
      "User note by [EMPLOYEE-032] :\n\"to follow a feed back to its source, trace it. Cam06 was under my supervision it seems to hold more than it looks, executives seems to be extra careful with what I see.\"\n\ncommand: trace cam06"
    ] },
  { id: "nightlog", title: "NIGHT SHIFT LOG #32", spine: "NIGHT LOG", author: "J. M.", h: 9, w: 2.2,
    cover: String.raw`+---------+
|   . *   |
|  *   .  |
|    ☾    |
| .   *   |
|  NIGHT  |
+---------+`,
    pages: [
      "[DIRECTIVE] : Delete immediately any feed showing ████████\n\n03:12 - the monitor turned off by itself again, I'm not aware of the whole truth. The last time it happened the feed suffered a bit of lag due to how old the technology they make us work with is. I saw someeone for just a frame entering the preparation room. They don't want me to see who.",
      "[User Note]\n\nThis is bad news, the movie I used to watch all the time got scraped by the dust in this shitty room...\n Fortunately, I discovered that a log that reads 41% can still be decoded thanks to the technology we discovered.\n\ncommand: decode log 41"
    ] },
  { id: "vault", title: "VAULT INVENTORY", spine: "VAULT 06", author: "ARCHIVIST", h: 10.5, w: 2.6,
    cover: String.raw`+---------+
| [=====] |
| |  O  | |
| [=====] |
|  VAULT  |
|   06    |
+---------+`,
    pages: [
      "[ADDED ITEM]\n\nItem 06: one tape. Do not play. Prone to complete destruction of the record.",
      "[VAULT MANUAL]\n\nThe vault answers to its own number. It can only be opened with admin elevation\n\ncommand: unlock vault 06"
    ] },
{ id: "registry", title: "AGENT REGISTRY", spine: "REGISTRY", author: "F.I.H PERSONNEL", h: 10, w: 2.4,
  cover: String.raw`+---------+
| F.I.H   |
| ------- |
|  AGENT  |
| REGISTRY|
| ███ ███ |
+---------+`,
  pages: [
`F.I.H PERSONNEL DIVISION
REGISTRY OF FIELD AGENTS

Names are not recorded here.
Codenames are issued on deployment
and revoked on retirement.

These agent identifiers are to be used for all internal communications and reports. Any other form of identification is strictly forbidden. Their identities can be kept secret from even employees if any breach is traced back at your workstation, you WILL be under serious investigation, handle data carefully`,

`ACTIVE ROSTER (1/2)

ID    CODENAME     STATUS
----  -----------  ----------
A-01  LANTERN      STANDBY
A-02  SALT         STANDBY
A-03  NO-FACE      UNKNOWN
A-04  ████████     ██████
A-05  M.V.         DEPLOYED - MEDITERRANEA`,

`ACTIVE ROSTER (2/2)

ID    CODENAME     STATUS
----  -----------  ----------
A-06  YNAGREA      ACTIVE - ON BASE
A-07  07-14-21     ??????
A-08  [REDACTED]   DEPLOYED - ████████
A-09  H█LL█W       MISSING
A-10  ___________  PENDING

They forgot to erase A-08 record, I'm almost entirely sure it is the same person as the one in the feed, but I can't be certain. The registry is a mess, I don't know if they are even aware of what they are doing. I don't know if they even care.`,

`RETIRED / LOST

ID    CODENAME     LAST SEEN
----  -----------  ----------
R-01  THE CLERK     03:12
R-02  ████ ████   CAM03
R-03  ?             ?

Note in pen, bottom margin:
"Who are even these people? I don't think there is a tracking command for agents"`
  ] },
  { id: "subject", title: "MISSION #001 : DISMANTLE", spine: "SEARCH & ELIMINATE", author: "[REDACTED]", h: 8.5, w: 2.2,
    cover: String.raw`+---------+
|  _____  |
| / o o \ |
| |  ^  | |
|  \___/  |
| ███████ |
+---------+`,
    pages: [
      "[ORIGIN]\n\nSubject 01 manifested at 03:12.\n\n First contact between researcher001 and ████████ was logged\n\n Since [The Fracture] occured we have not been able to locate the subject contrary to what we anticiped, its approximate location only is known, an agent is expected to be deployed soon. This entity is reponsible for everything that has occured lately the good and the bad, however there is only bad to see here, goverment gains nothing from letting this whole havoc happen. The subject has to be eliminated at all cost to restore previous integrity at the breach point. We are almost sure it will solve everything. The harm caused to [HUMANOID SUBJECT] in the process can be treated merely as pure side effects for a greater cause, though precautions will be taken to avoid causing more harm than needed.",
      "[Target data access]\n\nWhen all else fails, ask the registry. This old system isn't reliable\n\ncommand: query target"
    ] },
  { id: "untitled", title: "UNTITLED", spine: "? ? ?", author: "UNKNOWN", h: 9.5, w: 2.0,
    cover: String.raw`+---------+
|         |
|    ?    |
|         |
|         |
|         |
+---------+`,
    pages: [
      "(Through the whole hashing process files here have gone through, this one seems to be in a pretty bad state, as if it wasn't supposed to be here in the first place)\n\nThe pages are mostly blank.",
      "",
      "",
      "[EXTERNAL DATA CHUNK]\n[ACCESS POINT : USB FLASH DRIVE]\n[OWNER : Marine Institute of the Twin Peaks]\n\nFour pieces. Order matters, low to high.\nJoin them with dashes.\n\ncommand: mount cd <volume>\n\n to whoever we are reaching with this, save our souls, life isn't a choice but a right, what we discovered isn't to be destroyed but to be cherished, whatever the cost, retreive what you can, sabotage what you have to."
    ] }
];
const TAPES = [
  { id: "main", hash: CFG.cdHash, type: "pulse", status: "Flatlined", statusColor: "red",
    pulse: { beats: 3 }, vhsMusic: true },
  { id: "tape2", hash: "e28a02508a3870b82849b5205076d5e9478b9abf9a2aef9af536d247bfeb49b3", type: "gif",
    src: "assets/tape_02.gif", status: "Unknown", statusColor: "white", start: null, vhsMusic: true },
  { id: "tape3", hash: "b7395c0470d51db8844deccd56e9a26026b4066903251719c6d22feb315f6a40", type: "gif",
    src: "assets/tape_03.gif", status: "Dormant", statusColor: "green", timer: false, vhsMusic: false }
];
