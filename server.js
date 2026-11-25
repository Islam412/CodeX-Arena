const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const APP_ROOT = __dirname;
const ARGS = process.argv.slice(2);
const FILE_ARG = ARGS.find(function (arg) { return arg.startsWith('--file='); });
const OPEN_FILE = FILE_ARG ? FILE_ARG.slice(7) : '';
const DIR_ARG = ARGS.find(function (arg) { return !arg.startsWith('--') && !/^\d+$/.test(arg); });
const PORT_ARG = ARGS.find(function (arg) { return /^\d+$/.test(arg); });
const PROJECT_ROOT = path.resolve(DIR_ARG || process.cwd());
const PORT = parseInt(process.env.PORT || PORT_ARG || '4310', 10) || 4310;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.cache', '.vscode', '.idea']);
const BINARY_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'pdf', 'zip', 'gz', 'rar', '7z', 'mp3', 'mp4', 'woff', 'woff2', 'ttf', 'eot', 'exe', 'dll', 'bin', 'wasm', 'psd', 'ai', 'sketch']);
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MANIFEST = '.codex-arena.json';

function safePath(root, relative) {
  const clean = String(relative || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const target = path.resolve(root, clean);
  if (target === root) return root;
  if (!target.startsWith(root + path.sep)) throw new Error('Path outside project root');
  return target;
}

function walk(dir, base, files, folders) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    return;
  }
  for (const entry of entries) {
    const relative = base ? base + '/' + entry.name : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.charAt(0) === '.') continue;
      folders.push(relative);
      walk(full, relative, files, folders);
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name === MANIFEST || entry.name.charAt(0) === '.') continue;
    const ext = path.extname(entry.name).slice(1).toLowerCase();
    if (BINARY_EXT.has(ext)) continue;
    let stat;
    try {
      stat = fs.statSync(full);
    } catch (error) {
      continue;
    }
    if (stat.size > MAX_FILE_SIZE) continue;
    try {
      files[relative] = fs.readFileSync(full, 'utf8');
    } catch (error) {}
  }
}

function readProject() {
  const files = {};
  const folders = [];
  walk(PROJECT_ROOT, '', files, folders);
  let managed = [];
  try {
    const stored = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, MANIFEST), 'utf8'));
    if (Array.isArray(stored.managed)) managed = stored.managed;
  } catch (error) {}
  const paths = Array.from(new Set(Object.keys(files).concat(managed)));
  return { files: files, folders: folders, managed: paths, root: PROJECT_ROOT, name: path.basename(PROJECT_ROOT) };
}

function writeProject(payload) {
  if (!payload || !payload.files || typeof payload.files !== 'object') throw new Error('Invalid project payload');
  let previous = [];
  try {
    const stored = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, MANIFEST), 'utf8'));
    if (Array.isArray(stored.managed)) previous = stored.managed;
  } catch (error) {}
  const next = Object.keys(payload.files);
  for (const folder of Array.isArray(payload.folders) ? payload.folders : []) {
    const target = safePath(PROJECT_ROOT, folder);
    if (target !== PROJECT_ROOT) fs.mkdirSync(target, { recursive: true });
  }
  for (const relative of next) {
    const target = safePath(PROJECT_ROOT, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, String(payload.files[relative]), 'utf8');
  }
  for (const relative of previous) {
    if (next.indexOf(relative) !== -1) continue;
    const target = safePath(PROJECT_ROOT, relative);
    try {
      if (fs.existsSync(target) && fs.statSync(target).isFile()) fs.unlinkSync(target);
    } catch (error) {}
  }
  fs.writeFileSync(path.join(PROJECT_ROOT, MANIFEST), JSON.stringify({ managed: next }, null, 2), 'utf8');
  return { ok: true, files: next.length };
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || MIME['.json'], 'Cache-Control': 'no-store' });
  res.end(body);
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let size = 0;
    const chunks = [];
    req.on('data', function (chunk) {
      size += chunk.length;
      if (size > 20 * 1024 * 1024) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

const server = http.createServer(async function (req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;

  try {
    if (pathname === '/__codex-launch.json') {
      send(res, 200, JSON.stringify({ bridge: true, root: PROJECT_ROOT, name: path.basename(PROJECT_ROOT), file: OPEN_FILE }));
      return;
    }
    if (pathname === '/__codex/api/project' && req.method === 'GET') {
      send(res, 200, JSON.stringify(readProject()));
      return;
    }
    if (pathname === '/__codex/api/project' && req.method === 'POST') {
      const raw = await readBody(req);
      const result = writeProject(JSON.parse(raw));
      send(res, 200, JSON.stringify(result));
      return;
    }
    if (req.method !== 'GET') {
      send(res, 405, JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    const relative = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
    const target = safePath(APP_ROOT, relative);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      send(res, 404, JSON.stringify({ error: 'Not found' }));
      return;
    }
    send(res, 200, fs.readFileSync(target), MIME[path.extname(target).toLowerCase()] || 'application/octet-stream');
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, '127.0.0.1', function () {
  const url = 'http://127.0.0.1:' + PORT + '/index.html';
  console.log('CodeX Arena ready: ' + url);
  console.log('Project folder: ' + PROJECT_ROOT);
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '""', url] : [url];
  try {
    spawn(opener, args, { detached: true, stdio: 'ignore' }).unref();
  } catch (error) {
    console.log('Open this URL manually: ' + url);
  }
});
