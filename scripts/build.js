'use strict';
// Gera dist/: versão estática do site para o Vercel. Uso: node scripts/build.js
const fs = require('fs');
const path = require('path');
const { merge, readJson, renderIndex } = require('../lib/render');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');
const DIST = path.join(ROOT, 'dist');

const content = merge(readJson(path.join(ROOT, 'defaults', 'content.json'), {}), readJson(path.join(DATA, 'content.json'), {}));

fs.rmSync(DIST, { recursive: true, force: true });
// O painel (/admin) precisa de servidor com disco; fica só na versão local.
fs.cpSync(PUBLIC, DIST, { recursive: true, filter: (src) => path.relative(PUBLIC, src).split(path.sep)[0] !== 'admin' });
fs.writeFileSync(path.join(DIST, 'index.html'), renderIndex(PUBLIC, content));
fs.writeFileSync(path.join(DIST, 'content.json'), JSON.stringify(content));
const uploads = path.join(DATA, 'uploads');
if (fs.existsSync(uploads)) fs.cpSync(uploads, path.join(DIST, 'uploads'), { recursive: true });

console.log('dist/ pronto');
