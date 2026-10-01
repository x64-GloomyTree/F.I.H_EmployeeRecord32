// ===== CONFIG: edit freely =====
const CFG = {
  saveKey: "fih_hq_save_v1",
  postItText: "pw:\n1234",              // text drawn on the post-it (cosmetic)
  lockHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",                 // sha256 of the lockscreen password
  adminHash: "b9cdf8c4a7f476413f99157ca6a81d346027a50aa3ca42f0fc279c57496dd626",               // sha256 of the admin bypass password
  cdHash: "425933deabc4220492fa1eeda2aef7346a02796888930c797a811c58bd0454a6",                     // sha256 of the volume name (UPPERCASE)
  cdGif: "assets/cd_tape.gif",
  stopwatchStart: "2026-09-29T03:12:00+02:00",  // PLACEHOLDER start date
  sounds: {
    fan:   { src: "assets/sounds/fan_hum.mp3",   loop: true, vol: 0.18 },
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
  "todo.txt":   ["- change password (again)", "- ask Dave about the archive door", "- stop leaving the feed running","- verify the hashing function to destroy evidences"],
  "cam06.log":  ["[LOCATION : Preparation Room] // [EXPECTED PERSONNEL : ████████]", "[00:00:01] feed started", "[00:00:02] subject not in frame", "[??:??:??] LOG CORRUPTED"]
};

// ===== Hidden commands (usable after admin). Order of "id" = order in the volume name. =====
// Volume name = FRAGMENTS joined by "-" in id order, e.g. FLAT-LINE-ZERO-SIX
const CLUES = [
  { id: 1, cmd: "trace cam06",     frag: "FLAT", out: ["tracing feed origin...", "hop 1: HQ-GATEWAY", "hop 2: ████████", "[MAINTENANCE NOTE] : Delete feed to preserve deployed agent identity"] },
  { id: 2, cmd: "decode log 41",   frag: "LINE", out: ["decoding log at 41% integrity...", "...", "> Error Traceback : Failed to corrupt CAM06_feed, failed at 59%"] },
  { id: 3, cmd: "unlock vault 06", frag: "ZERO", out: ["vault 06 handshake...", "tumblers: 1 2 3 4", "admin elevation found...", "[F.I.H Employee Manual Note] : Always close the vault door before clocking out :)"] },
  { id: 4, cmd: "query target",    frag: "SIX",  out: ["querying target registry...", "status field: ██████", "CODENAME : ENTITY-01 // MANIFESTED",  "Deployed Agent : ████████, Executor of F.I.H"] }
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
      "[EMPLOYEE MANUAL]\n\nWelcome to F.I.H.\nPlease do not leave feeds running unattended. Follow the directives of your superior",
      "SECTION 4: PASSWORDS\n\nPasswords must be changed.\nPasswords must not be written down.\n\n(see: the post-it incident)",
      "[HINT 1/4 PLACEHOLDER]\n\nUser note by [EMPLOYEE-032] :\n\"to follow a feed back to its source, trace it. cam06 is under my supervision.\"\n\ncommand: trace cam06"
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
      "[DIRECTIVE] : Delete immediately any feed showing ████████\n\n03:12 - the monitor turned on by itself again, I wish they finally fixed it...",
      "[User Note]\n\nThis is bad news, the movie I used to watch all the time got scraped by the dust in this shitty room...\n Fortunately, I discovered that a log that reads 41% can still be decoded.\n\ncommand: decode log 41"
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
  { id: "subject", title: "MISSION #001 : DISMANTLE", spine: "SEARCH & ELIMINATE", author: "[REDACTED]", h: 8.5, w: 2.2,
    cover: String.raw`+---------+
|  _____  |
| / o o \ |
| |  ^  | |
|  \___/  |
| ███████ |
+---------+`,
    pages: [
      "[ORIGIN]\n\nSubject 01 manifested at 03:12.\n\n First contact between researcher001 and ████████ was logged",
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
      "[LORE PLACEHOLDER]\n\nThe pages are mostly blank.",
      "[FINAL HINT PLACEHOLDER]\n\nFour pieces. Order matters, low to high.\nJoin them with dashes.\n\ncommand: mount cd <volume>"
    ] }
];
