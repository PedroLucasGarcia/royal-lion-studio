'use strict';
// Partilhado por server.js (local) e scripts/build.js (Vercel): junta o conteúdo e monta a página inicial.
const fs = require('fs');
const path = require('path');

const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);
function merge(base, over) {
  if (!isPlain(base) || !isPlain(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
  return out;
}
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
const safeJson = (v) => JSON.stringify(v).replace(/</g, '\u003c');

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function ldAddress(lines) {
  const parts = String(lines || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const city = (parts[1] || '').match(/^(\d{4}-\d{3})\s+(.+)$/);
  if (!city) return parts.join(', ');
  return { '@type': 'PostalAddress', streetAddress: parts[0], postalCode: city[1], addressLocality: city[2], addressCountry: 'PT' };
}
function renderIndex(publicDir, content) {
  const c = content.contact;
  const s = content.schedule;
  const dayOfWeek = (s.openDays || []).map((d) => DAY_NAMES[d]).filter(Boolean);
  const ld = {
    '@context': 'https://schema.org', '@type': 'HairSalon', name: 'Royal Lion Studio',
    description: content.seo.description,
    address: ldAddress(c.addressLines),
    openingHoursSpecification: (s.blocks || []).map((b) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek, opens: b.from, closes: b.to })),
  };
  if (c.phone) ld.telephone = c.phone;
  if (c.email) ld.email = c.email;
  if (/^https:\/\//i.test(c.instagram || '')) ld.sameAs = [c.instagram];
  return fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8')
    .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(content.seo.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => `${a}${escapeHtml(content.seo.description)}${b}`)
    .replace('<script type="application/json" id="content-data">{}</script>', () => `<script type="application/json" id="content-data">${safeJson(content)}</script>`)
    .replace('<script type="application/ld+json">{}</script>', () => `<script type="application/ld+json">${safeJson(ld)}</script>`);
}

module.exports = { isPlain, merge, readJson, renderIndex };
