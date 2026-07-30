/**
 * Emit every docs page's markdown to `public/md/**.md` at build time.
 *
 * Why static files rather than a route handler: the site is deployed to
 * Cloudflare Workers, which has no request-time filesystem, and Next gives a
 * concrete page route precedence over a catch-all route handler — so
 * `/docs/components/button?as=md` was resolving to the rendered HTML page and
 * never reaching the handler that was meant to serve markdown. Static assets
 * have neither problem, and they are what `/r/*.json` already relies on.
 *
 * `middleware.ts` rewrites the public `?as=md` / `.md` forms onto these files,
 * so the documented endpoint keeps working and the MCP server can also fetch
 * `/md/...` directly.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allMarkdownPages } from '../lib/docs-markdown';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'md');

async function main() {
  const pages = allMarkdownPages();
  if (pages.length === 0) {
    throw new Error('No markdown pages resolved — refusing to emit an empty public/md.');
  }

  // Rebuild from scratch so a page removed upstream does not linger as a stale asset.
  await rm(outDir, { recursive: true, force: true });

  for (const { path, markdown } of pages) {
    if (!path.startsWith('/')) throw new Error(`Expected an absolute docs path, got "${path}"`);
    const target = join(outDir, `${path.replace(/^\/+/, '')}.md`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, markdown, 'utf8');
  }

  // A manifest so agents can discover what exists instead of guessing slugs.
  await writeFile(
    join(outDir, 'index.json'),
    JSON.stringify(
      { count: pages.length, pages: pages.map(({ path }) => ({ path, md: `/md${path}.md` })) },
      null,
      2,
    ),
    'utf8',
  );

  console.log(`generate-docs-md: wrote ${pages.length} markdown pages to public/md`);
}

main().catch((err) => {
  console.error('generate-docs-md failed:', err);
  process.exit(1);
});
