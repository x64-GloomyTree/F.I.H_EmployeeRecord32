/* hq-site-data.js : content for the fake browser (edit freely).
   Everything marked PROPOSAL is invented copy, not canon. */
window.HQ_SITE = {
  imgBase: 'https://commons.wikimedia.org/wiki/Special:FilePath/',
  /* real photos from Wikimedia Commons (file names were checked). file:null = drawn silhouette fallback.
     To add a photo: put the exact Commons file name (with underscores) in "file". */
  fish: {
    clown:   { name:'Ocellaris clownfish', sci:'Amphiprion ocellaris', file:'Common_clownfish.jpg', color:'#ff9f43' },
    shark:   { name:'Great white shark', sci:'Carcharodon carcharias', file:'White_shark.jpg', color:'#8fa6b5' },
    manta:   { name:'Giant manta ray', sci:'Mobula birostris', file:'Manta_ray.jpg', color:'#5d7488' },
    lamprey: { name:'Sea lamprey', sci:'Petromyzon marinus', file:'Sea_Lamprey_fish.jpg', color:'#8a8a6a' },
    coel:    { name:'West Indian Ocean coelacanth', sci:'Latimeria chalumnae', file:'Latimeria_chalumnae.jpg', color:'#4a5f8a' },
    hagfish: { name:'Pacific hagfish', sci:'Eptatretus stoutii', file:'Eptatretus_stoutii.jpg', color:'#b28a9a' },
    tuna:    { name:'Pacific bluefin tuna', sci:'Thunnus orientalis', file:'Pacific_bluefin_tuna.jpg', color:'#3a6ea5' },
    ray:     { name:'Blue-spotted stingray', sci:'Neotrygon kuhlii', file:'Blue-spotted_stingray_(Neotrygon_kuhlii).jpg', color:'#7aa0a8' },
  },

  /* PROPOSAL: surface identity */
  surface: {
    short: 'F.I.H', long: 'Fisheries Innovation Harbor',
    tagline: 'Caring for the ocean, from the surface down.',
    sub: 'Sustainable aquaculture, marine wellness and community research since 2011.',
    cards: [
      { t:'Healthy Seas', d:'We restore reefs, protect nurseries and help coastal towns fish responsibly.' },
      { t:'Open Research', d:'Our scientists publish every season. Transparency is how a harbor earns trust.' },
      { t:'People First', d:'Flexible hours, ocean-view offices, and a very supportive aquarium team.' }
    ],
    stats: [ ['214','reef sites restored'], ['0','incidents this quarter'], ['12,400','fish that say thank you'] ],
    deepBtn: 'Deep dive in the research (employee only)',
    locked: 'This section is reserved for certified researchers. Verification is handled by our partner provider. Please complete the taxonomy aptitude test and try again.'
  },

  /* PROPOSAL: what the deep page reveals */
  deep: {
    title: 'Hollow Incursion Force',
    lines: [
      'There is no harbor.',
      'Every report we publish to the surface is a kindness we tell to the people above.',
      'Mission: eliminate everything that crossed the rift. Everything. Without exception.',
      'Project [Hallowed Future]: reach the fusion point beneath the Mariana Trench, using technology taken from the Institute.',
      '[Portable Fish]: built in secret. Function: classified. Employees were not told.',
      'Entity#001 is listed as responsible for the fracture. This has never been confirmed.'
    ],
    quotes: [
      'We are not under the surface. The surface is under us.',
      'The sea keeps what it is given. Then it keeps you.',
      'Every ending we filed, we mislabeled a beginning.',
      'It is not a loop. Ask whoever keeps reading this.',
      'Be kind. It is the only thing that survives the pressure.'
    ],
    glitch: [
      'who is reading this', 'you have been here before', '03:12', 'RESEARCHER#001 // SIGNAL LOST',
      'again', 'EMPLOYEE#032 IS STILL LOGGED IN', 'this is not the first time', 'which one of you is real',
      'it keeps going down', 'spiral'
    ],
    hard: [
      'drown', 'give up', 'abandon', 'death', 'again', 'let go', 'sink',
      'you were here', 'keep pushing?', 'researcher', 'RESEARCHER#001',
      'visit {n}', 'you have been here {n} times', 'or once. forever.',
      'not a loop', 'spiral', '03:12', 'who is reading', 'which one are you', 'wake up'
    ],
    claimText: 'Employee clearance form',
    claimCheck: 'I understand what I am agreeing to.',
    claimBtn: 'Claim clearance',
    claimDone: 'Clearance elevated to TIER 1. The door will remember you.'
  },

  audio: { site1: 'assets/website1.mp3', site2: 'assets/website2.mp3' }
};
