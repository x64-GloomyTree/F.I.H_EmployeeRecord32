/* hq-data.js : all content lives here. Edit freely. */
window.HQ_DATA = {
  cfg: {
    introMusic: 'assets/defeat.mp3',
    bgm: 'assets/ambient2.mp3',
    backUrl: 'next.html'
  },

  /* two voices: a = cool pale blue (left), b = warm cream (right) */
  intro: [
    { who: 'a', text: '"Why are you doing this, why keep pushing ?"' },
    { who: 'b', text: '"I don\'t know. I\'m barely a person. I just want to be kind and hold someone\'s hand, eat an ice cream cone. Stare at the lake. Feel the sun on my skin. Lay in the grass. Run through a sprinkler. It\'s so easy to forget life is supposed to feel like a deep breath and not a gasp."' }
  ],

  /*
    layer: back | mid | near   (parallax depth)
    x,y,w,h in em (stage is 100em wide, 56.25em tall)
    art: which CSS drawing to use (see hq.js ART)
    lines: dialogue pages. who: speaker label (empty = narration)
    pick: true = show one random line per click instead of all
  */
  items: [
    { id:'aquarium', layer:'mid', x:36, y:7,  w:28, h:35, art:'aquarium', label:'Aquarium', who:'',
      pick:true, lines:[
        'The water is perfectly still. The fish are not.',
        'One of them keeps looking back at you.',
        'The glass hums faintly. Somebody calibrates this thing every morning.',
        'A small plaque reads: "Specimens are not to be named."'
      ]},
    { id:'board', layer:'back', x:41, y:1.6, w:18, h:5.2, art:'board', label:'Status board', who:'',
      lines:[ 'HQ STATUS: ALL SYSTEMS NOMINAL.', 'Below it, in small print: "incident count since last review: 0". The 0 looks freshly taped on.' ]},
    { id:'door', layer:'back', x:1, y:13, w:8, h:21, art:'door', label:'Door', who:'',
      lines:[ 'Locked. The keypad blinks red.', 'You are not cleared for this floor. Yet.' ]},
    { id:'window_l', layer:'back', x:11, y:6, w:17, h:19, art:'window', label:'Window', who:'',
      lines:[ 'The sea. From up here it looks like it is breathing.' ]},
    { id:'window_r', layer:'back', x:72, y:6, w:17, h:19, art:'window', label:'Window', who:'',
      lines:[ 'No ships. No gulls. Just a calm, endless blue.' ]},

    { id:'ws_b1', layer:'mid', x:9.5,  y:24, w:12, h:13, art:'ws', cls:'emp', label:'Workstation', who:'Employee',
      lines:[ '...', 'Please hold. I am in the middle of something.' ]},
    { id:'ws_b2', layer:'mid', x:23.5, y:24, w:12, h:13, art:'ws', label:'Workstation', who:'',
      lines:[ 'Empty. The chair is still warm.' ]},
    { id:'ws_b3', layer:'mid', x:65.5, y:24, w:12, h:13, art:'ws', cls:'emp', label:'Workstation', who:'Employee',
      lines:[ 'Do not look at my screen.', 'It is just a spreadsheet. A very sad spreadsheet.' ]},
    { id:'ws_b4', layer:'mid', x:79.5, y:24, w:12, h:13, art:'ws', label:'Workstation', who:'',
      lines:[ 'A sticky note on the monitor: "ask Dave".' ]},
    { id:'printer', layer:'mid', x:92, y:29, w:7, h:7, art:'printer', label:'Printer', who:'',
      lines:[ 'It prints one page, then another. Both are blank.', 'PC LOAD LETTER. Always.' ]},

    { id:'ws_f1', layer:'near', x:2,  y:33, w:17, h:20, art:'ws', cls:'emp', label:'Workstation', who:'Employee',
      lines:[ 'Oh. You are new. Welcome to the open floor.', 'Everything here is monitored, but kindly.' ]},
    { id:'ws_f2', layer:'near', x:81, y:33, w:17, h:20, art:'ws', label:'Workstation', who:'',
      lines:[ 'The monitor is locked. A login prompt waits for a name.' ]},
    { id:'cat', layer:'near', x:15.5, y:34.6, w:4, h:3.4, art:'cat', label:'Cat', who:'',
      lines:[ 'A small cat sits on the desk, looking at the aquarium with intent.', 'It looks at you, then at the aquarium again. Not subtle.' ]},
    { id:'reception', layer:'near', x:38, y:45, w:24, h:10, art:'reception', label:'Reception', who:'',
      lines:[ 'Nobody at the desk. A bell sits on top.', 'A visitor log, last entry: "Please keep it quiet."' ]},
    { id:'plant', layer:'near', x:24, y:33, w:6, h:13, art:'plant', label:'Plant', who:'',
      lines:[ 'A very healthy plant. Suspiciously healthy.' ]},
    { id:'cooler', layer:'near', x:70, y:33, w:6, h:13, art:'cooler', label:'Water cooler', who:'',
      lines:[ 'Cold water. It tastes like a normal day.', 'Someone wrote "do not drink" on the cup stack, then crossed it out.' ]}
  ]
};
