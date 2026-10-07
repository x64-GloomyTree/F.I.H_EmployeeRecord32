const fs = require('fs');
const L = fs.readFileSync('main.js', 'utf8').split('\n');
let d = 0, shown = 0;
L.forEach((raw, i) => {
  const clean = raw
    .replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '""')
    .replace(/\/\*.*?\*\//g, '')
    .replace(/\/\/.*$/, '');
  if (/^(function|const|let|\$\(|addEventListener|window|async)/.test(raw) && d !== 1 && i > 2 && shown < 5) {
    console.log('line', i + 1, 'depth', d, '->', raw.slice(0, 70));
    shown++;
  }
  for (const ch of clean) { if (ch === '{') d++; else if (ch === '}') d--; }
});
console.log('final depth', d);