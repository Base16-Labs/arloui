import { NextResponse, type NextRequest } from 'next/server';

/**
 * Point the documented markdown aliases at the static assets built by
 * `scripts/generate-docs-md.ts`.
 *
 * `/docs/components/button?as=md` and `/docs/components/button.md` both resolve
 * to `/md/docs/components/button.md`. This has to happen in middleware: a page
 * route (`/docs/components/[slug]/page.tsx`) takes precedence over a route
 * handler at the same path, so the catch-all handler this replaced never ran for
 * pages that exist and callers got an HTML shell back instead of markdown.
 *
 * Redirect rather than rewrite. On Workers, static assets are matched at the
 * edge before the Worker runs, so an internal rewrite pointing at an asset does
 * not re-enter asset serving — it reaches the Next server, which has no `/md`
 * route, and 404s. In production the `.md` suffix happened to survive that and
 * `?as=md` did not; a redirect makes the client issue a fresh request for a URL
 * that is served directly, so both behave the same for the same reason.
 *
 * 307 rather than 308: these are aliases onto a canonical path, and a permanent
 * redirect would be cached by clients well past any decision to serve the
 * markdown inline instead. Redirects are followed by default by browsers,
 * `fetch`, and the MCP client's `getMarkdown` — which asks for `/md/…` directly
 * anyway, so it never depends on this.
 *
 * Paths with no generated markdown fall through to the normal page, which 404s
 * for unknown slugs.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const wantsMarkdown = searchParams.get('as') === 'md' || pathname.endsWith('.md');
  if (!wantsMarkdown) return NextResponse.next();

  const base = pathname.replace(/\.md$/, '').replace(/\/+$/, '');
  if (!base.startsWith('/docs/')) return NextResponse.next();

  // Build from the origin rather than cloning the request URL, so `?as=md` is
  // dropped instead of trailing along into the asset lookup.
  return NextResponse.redirect(new URL(`/md${base}.md`, request.nextUrl.origin), 307);
}

export const config = {
  // Only docs paths can produce markdown, so nothing else pays the middleware cost.
  matcher: '/docs/:path*',
};
