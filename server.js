'use strict';
// Royal Lion Studio: servidor sem dependências. Arranque: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { isPlain, merge, readJson, renderIndex: render } = require('./lib/render');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, 'data');
const UPLOADS = path.join(DATA, 'uploads');
const CONTENT_FILE = path.join(DATA, 'content.json');
const ADMIN_FILE = path.join(DATA, 'admin.json');
const DEFAULTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'defaults', 'content.json'), 'utf8'));
const SESSION_MS = 7 * 24 * 3600 * 1000;
const MAX_JSON = 1024 * 1024;
const MAX_UPLOAD = 8 * 1024 * 1024;

fs.mkdirSync(UPLOADS, { recursive: true });

// ---------- ficheiros ----------
function writeJson(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}
const getContent = () => merge(DEFAULTS, readJson(CONTENT_FILE, {}));

// ---------- autenticação ----------
const sessions = new Map();
function hashPassword(pw, salt) { return crypto.scryptSync(pw, salt, 64).toString('hex'); }
function setPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  writeJson(ADMIN_FILE, { salt, hash: hashPassword(pw, salt) });
}
function checkPassword(pw) {
  const a = readJson(ADMIN_FILE, null);
  if (!a || typeof pw !== 'string') return false;
  const given = Buffer.from(hashPassword(pw, a.salt), 'hex');
  return crypto.timingSafeEqual(given, Buffer.from(a.hash, 'hex'));
}
if (process.env.ADMIN_PASSWORD && !fs.existsSync(ADMIN_FILE)) setPassword(process.env.ADMIN_PASSWORD);

function cookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}
function isAuthed(req) {
  const t = cookies(req).rl_session;
  const exp = t && sessions.get(t);
  if (!exp) return false;
  if (exp < Date.now()) { sessions.delete(t); return false; }
  return true;
}
function isHttps(req) {
  return req.socket.encrypted || String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
}
function sessionCookie(req, value, maxAge) {
  return `rl_session=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${isHttps(req) ? '; Secure' : ''}`;
}
function startSession(req, res) {
  const t = crypto.randomBytes(32).toString('hex');
  sessions.set(t, Date.now() + SESSION_MS);
  res.setHeader('Set-Cookie', sessionCookie(req, t, SESSION_MS / 1000));
}
// um proxy na mesma máquina também aparece como loopback, por isso qualquer cabeçalho de proxy desqualifica
function isLoopback(req) {
  const a = req.socket.remoteAddress || '';
  const local = a === '127.0.0.1' || a === '::1' || a === '::ffff:127.0.0.1';
  return local && !req.headers['x-forwarded-for'] && !req.headers['forwarded'];
}
// atrás de um proxy, o endereço do socket é o do proxy: sem isto, todos os clientes partilhavam o mesmo limite.
// O último valor é o que o proxy acrescentou; os anteriores vêm do cliente e podem ser falsos.
function clientIp(req) {
  const hops = String(req.headers['x-forwarded-for'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return (process.env.TRUST_PROXY && hops.pop()) || req.socket.remoteAddress || '';
}

// ---------- limites ----------
const buckets = new Map();
function limited(key, max, windowMs) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { n: 1, reset: now + windowMs }); return false; }
  b.n += 1;
  return b.n > max;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  for (const [k, e] of sessions) if (e < now) sessions.delete(k);
}, 600000).unref();

// ---------- http ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};
const CSP = "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-src https://www.google.com https://noona.pt; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";

function send(res, code, body, type = 'application/json; charset=utf-8', extra = {}) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(code, { 'Content-Type': type, 'Content-Length': buf.length, ...extra });
  res.end(buf);
}
const json = (res, code, obj) => send(res, code, obj, undefined, { 'Cache-Control': 'no-store' });

function readBody(req, max) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    const tooLarge = () => Object.assign(new Error('too large'), { code: 413 });
    req.on('data', (c) => {
      size += c.length;
      // Fechar a meio do envio faz o browser ver um erro de rede em vez da resposta: lê-se até ao fim
      // sem guardar nada, e só se corta quando o envio é muito acima do limite.
      if (size > max * 4) { reject(tooLarge()); req.destroy(); return; }
      if (size > max) { chunks.length = 0; return; }
      chunks.push(c);
    });
    req.on('end', () => (size > max ? reject(tooLarge()) : resolve(Buffer.concat(chunks))));
    req.on('error', reject);
  });
}
async function readJsonBody(req) {
  const raw = await readBody(req, MAX_JSON);
  try {
    const v = JSON.parse(raw.toString('utf8'));
    if (!isPlain(v)) throw new Error();
    return v;
  } catch {
    throw Object.assign(new Error('bad json'), { code: 400 });
  }
}

const renderIndex = () => render(PUBLIC, getContent());

function serveFile(res, root, urlPath, cache) {
  let rel;
  try { rel = decodeURIComponent(urlPath); } catch { return send(res, 400, 'Pedido inválido', 'text/plain; charset=utf-8'); }
  const file = path.resolve(root, `.${rel}`);
  const inside = file === root || file.startsWith(root + path.sep);
  if (!inside || rel.split('/').some((p) => p.startsWith('.'))) return send(res, 404, 'Não encontrado', 'text/plain; charset=utf-8');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Não encontrado', 'text/plain; charset=utf-8');
    send(res, 200, buf, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', { 'Cache-Control': cache });
  });
}

async function handleApi(req, res, url) {
  const p = url.pathname;
  const m = req.method;
  const ip = clientIp(req);

  if (p === '/api/content' && m === 'GET') return json(res, 200, getContent());
  if (p === '/api/admin/status' && m === 'GET') {
    const configured = fs.existsSync(ADMIN_FILE);
    return json(res, 200, { configured, authed: isAuthed(req), canSetup: !configured && isLoopback(req) });
  }
  if (p === '/api/admin/setup' && m === 'POST') {
    if (fs.existsSync(ADMIN_FILE)) return json(res, 409, { error: 'A palavra-passe já foi definida.' });
    if (!isLoopback(req)) return json(res, 403, { error: 'Define a palavra-passe no próprio servidor, ou com a variável ADMIN_PASSWORD.' });
    const { password } = await readJsonBody(req);
    if (typeof password !== 'string' || password.length < 8) return json(res, 400, { error: 'A palavra-passe precisa de pelo menos 8 caracteres.' });
    setPassword(password);
    startSession(req, res);
    return json(res, 200, { ok: true });
  }
  if (p === '/api/admin/login' && m === 'POST') {
    if (limited(`login:${ip}`, 8, 900000)) return json(res, 429, { error: 'Demasiadas tentativas. Espera 15 minutos.' });
    const { password } = await readJsonBody(req);
    if (!checkPassword(password)) return json(res, 401, { error: 'Palavra-passe errada.' });
    startSession(req, res);
    return json(res, 200, { ok: true });
  }

  if (p.startsWith('/api/admin/')) {
    if (!isAuthed(req)) return json(res, 401, { error: 'A sessão terminou. Entra outra vez.' });
    if (p === '/api/admin/logout' && m === 'POST') {
      sessions.delete(cookies(req).rl_session);
      res.setHeader('Set-Cookie', sessionCookie(req, '', 0));
      return json(res, 200, { ok: true });
    }
    if (p === '/api/admin/content' && m === 'PUT') {
      const body = await readJsonBody(req);
      if (!isPlain(body.hero) || !isPlain(body.doors) || !isPlain(body.schedule)) return json(res, 400, { error: 'Conteúdo incompleto. Recarrega a página e tenta outra vez.' });
      writeJson(CONTENT_FILE, body);
      return json(res, 200, { ok: true });
    }
    if (p === '/api/admin/upload' && m === 'POST') {
      const buf = await readBody(req, MAX_UPLOAD);
      const ext = sniffImage(buf);
      if (!ext) return json(res, 415, { error: 'Formato não aceite. Usa PNG, JPG, WebP ou AVIF.' });
      const name = `${crypto.randomBytes(12).toString('hex')}${ext}`;
      fs.writeFileSync(path.join(UPLOADS, name), buf);
      return json(res, 201, { url: `/uploads/${name}` });
    }
    if (p === '/api/admin/password' && m === 'POST') {
      const { current, next } = await readJsonBody(req);
      // 403 e não 401: a sessão continua válida, o cliente trata 401 como sessão perdida.
      if (!checkPassword(current)) return json(res, 403, { error: 'A palavra-passe atual está errada.' });
      if (typeof next !== 'string' || next.length < 8) return json(res, 400, { error: 'A nova palavra-passe precisa de pelo menos 8 caracteres.' });
      setPassword(next);
      // quem tinha a palavra-passe antiga deixa de ter acesso; só este dispositivo continua dentro
      sessions.clear();
      startSession(req, res);
      return json(res, 200, { ok: true });
    }
  }
  return json(res, 404, { error: 'Não encontrado.' });
}

function sniffImage(b) {
  if (b.length < 16) return null;
  if (b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG') return '.png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return '.jpg';
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return '.webp';
  if (b.toString('latin1', 4, 8) === 'ftyp' && /avi[fs]/.test(b.toString('latin1', 8, 12))) return '.avif';
  return null;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', CSP);
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método não permitido', 'text/plain; charset=utf-8');
    if (url.pathname === '/' || url.pathname === '/index.html') return send(res, 200, renderIndex(), MIME['.html'], { 'Cache-Control': 'no-cache' });
    if (url.pathname === '/admin') { res.writeHead(301, { Location: '/admin/' }); return res.end(); }
    if (url.pathname === '/admin/') return serveFile(res, PUBLIC, '/admin/index.html', 'no-cache');
    if (url.pathname === '/marcacao') return serveFile(res, PUBLIC, '/marcacao.html', 'no-cache');
    if (url.pathname.startsWith('/uploads/')) return serveFile(res, UPLOADS, url.pathname.slice('/uploads'.length), 'public, max-age=31536000, immutable');
    const long = url.pathname.startsWith('/fonts/');
    return serveFile(res, PUBLIC, url.pathname, long ? 'public, max-age=31536000' : 'no-cache');
  } catch (err) {
    const code = err.code === 413 || err.code === 400 ? err.code : 500;
    if (code === 500) console.error(err);
    if (!res.headersSent) json(res, code, { error: code === 413 ? 'O ficheiro é demasiado grande. O limite é 8 MB.' : code === 400 ? 'Pedido inválido.' : 'Algo correu mal no servidor. Tenta outra vez.' });
  }
});

server.listen(PORT, () => console.log(`Royal Lion Studio em http://localhost:${PORT}  |  Painel: http://localhost:${PORT}/admin/`));
