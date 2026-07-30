import { NextResponse, type NextRequest } from 'next/server';

/**
 * Serve the documented markdown endpoint from the static assets built by
 * `scripts/generate-docs-md.mts`.
 *
 * `/docs/components/button?as=md` and `/docs/components/button.md` both rewrite
 * to `/md/docs/components/button.md`. This has to happen in middleware: a page
 * route (`/docs/components/[slug]/page.tsx`) takes precedence over any route
 * handler at the same path, so the previous catch-all handler never ran for
 * pages that exist and callers got an HTML shell back instead of markdown.
 *
 * Requests for markdown that was never generated fall through to the normal
 * page, which 404s for unknown slugs — the MCP client treats an HTML body as
 * "no markdown", so a miss degrades rather than breaking.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const wantsMarkdown = searchParams.get('as') === 'md' || pathname.endsWith('.md');
  if (!wantsMarkdown) return NextResponse.next();

  const base = pathname.replace(/\.md$/, '').replace(/\/+$/, '');
  if (!base.startsWith('/docs/')) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/md${base}.md`;
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = {
  // Only docs paths can produce markdown, so nothing else pays the middleware cost.
  matcher: '/docs/:path*',
};
