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
  "readme.txt": ["F.I.H HQ workstation 06.", "Authorized staff only.", "If you are reading this, you are not staff."],
  "todo.txt":   ["- change password (again)", "- ask Dave about the archive door", "- stop leaving the feed running"],
  "cam06.log":  ["[00:00:01] feed started", "[00:00:02] subject not in frame", "[??:??:??] LOG CORRUPTED"]
};

// ===== Hidden commands (usable after admin). Order of "id" = order in the volume name. =====
// Volume name = FRAGMENTS joined by "-" in id order, e.g. FLAT-LINE-ZERO-SIX
const CLUES = [
  { id: 1, cmd: "trace cam06",     frag: "FLAT", out: ["tracing feed origin...", "hop 1: HQ-GATEWAY", "hop 2: ████████", "[PLACEHOLDER OUTPUT 1]"] },
  { id: 2, cmd: "decode log 41",   frag: "LINE", out: ["decoding log at 41% integrity...", "...", "[PLACEHOLDER OUTPUT 2]"] },
  { id: 3, cmd: "unlock vault 06", frag: "ZERO", out: ["vault 06 handshake...", "tumblers: 1 2 3 4", "[PLACEHOLDER OUTPUT 3]"] },
  { id: 4, cmd: "query target",    frag: "SIX",  out: ["querying target registry...", "status field: ██████", "[PLACEHOLDER OUTPUT 4]"] }
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
      "[LORE PLACEHOLDER]\n\nWelcome to F.I.H.\nPlease do not leave feeds running unattended.",
      "SECTION 4: PASSWORDS\n\nPasswords must be changed.\nPasswords must not be written down.\n\n(see: the post-it incident)",
      "[HINT 1/4 PLACEHOLDER]\n\nMargin note in pen:\n\"to follow a feed back to its source, trace it. cam06 is the one that matters.\"\n\ncommand: trace cam06"
    ] },
  { id: "nightlog", title: "NIGHT SHIFT LOG", spine: "NIGHT LOG", author: "J. M.", h: 9, w: 2.2,
    cover: String.raw`+---------+
|   . *   |
|  *   .  |
|    ☾    |
| .   *   |
|  NIGHT  |
+---------+`,
    pages: [
      "[LORE PLACEHOLDER]\n\n03:12 - the monitor turned on by itself again.",
      "[HINT 2/4 PLACEHOLDER]\n\nA log that reads 41% can still be decoded.\n\ncommand: decode log 41"
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
      "[LORE PLACEHOLDER]\n\nItem 06: one tape. Do not play.",
      "[HINT 3/4 PLACEHOLDER]\n\nThe vault answers to its own number.\n\ncommand: unlock vault 06"
    ] },
  { id: "subject", title: "SUBJECT FILE 06", spine: "SUBJECT 06", author: "[REDACTED]", h: 8.5, w: 2.2,
    cover: String.raw`+---------+
|  _____  |
| / o o \ |
| |  ^  | |
|  \___/  |
| ███████ |
+---------+`,
    pages: [
      "[LORE PLACEHOLDER]\n\nSubject 06 manifested at 03:12.",
      "[HINT 4/4 PLACEHOLDER]\n\nWhen all else fails, ask the registry.\n\ncommand: query target"
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
