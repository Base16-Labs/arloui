import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../../../..');
const appPublic = join(root, 'apps/www/public');
const docsIconData = join(root, 'apps/docs/data/icon-names.json');
const iconAssets = join(root, 'packages/icons/assets/svg');
const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4321);

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': type });
  res.end(body);
}

function safeJoin(base, urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const full = join(base, clean);
  return full.startsWith(base) ? full : null;
}

function streamFile(res, file) {
  const type = types[extname(file)] ?? 'application/octet-stream';
  res.writeHead(200, { 'content-type': type });
  createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (url.pathname === '/icon-names.json') {
    if (!existsSync(docsIconData)) return send(res, 404, 'icon names not found');
    return streamFile(res, docsIconData);
  }

  if (url.pathname.startsWith('/arloui-icons/')) {
    const file = safeJoin(iconAssets, url.pathname.replace('/arloui-icons/', ''));
    if (!file || !existsSync(file)) return send(res, 404, 'icon not found');
    return streamFile(res, file);
  }

  let pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = safeJoin(appPublic, pathname.slice(1));
  if (file && existsSync(file)) return streamFile(res, file);

  if (extname(url.pathname) || url.pathname.startsWith('/r/')) {
    return send(res, 404, 'not found');
  }

  const html = await readFile(join(appPublic, 'index.html'), 'utf8');
  send(res, 200, html, types['.html']);
});

server.listen(port, host, () => {
  console.log(`Arlo UI web docs running at http://${host}:${port}`);
});
