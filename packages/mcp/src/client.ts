import { BASE_URL, REGISTRY_URL } from './config.js';

export type IndexEntry = {
  name: string;
  kind: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  dependencies?: string[];
  meta?: {
    tags?: string[];
    /** Published Figma component sets backing this entry; absent when none exist. */
    figma?: Array<{ set: string; export?: string; props?: Record<string, string | boolean>; note?: string }>;
  };
};

export type RegistryFile = { source?: string; target: string; type?: string; content: string };
export type RegistryEntry = IndexEntry & { files: RegistryFile[]; hash: string };

// Short-lived cache so a burst of tool calls in one agent turn doesn't refetch
// the same index/entry. New components appear within one TTL of a site deploy.
const TTL_MS = 60_000;
const cache = new Map<string, { at: number; data: unknown }>();

async function getJson<T>(url: string): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status} ${res.statusText})`);
  const data = (await res.json()) as T;
  cache.set(url, { at: Date.now(), data });
  return data;
}

/** The full registry directory — the live source for search + component lists. */
export function getIndex(): Promise<{ items: IndexEntry[] }> {
  return getJson(`${REGISTRY_URL}/index.json`);
}

/** One component/foundation entry, including its source files. */
export function getEntry(name: string): Promise<RegistryEntry> {
  return getJson(`${REGISTRY_URL}/${encodeURIComponent(name)}.json`);
}

/**
 * Markdown for a docs page — the exact payload a human gets from "Copy markdown".
 *
 * Fetches the build-time asset under `/md` rather than the `?as=md` form. Both
 * resolve to the same file, but `/md/...` is a plain static asset: it does not
 * depend on middleware, and it cannot be shadowed by a page route. (`?as=md`
 * used to return the rendered HTML shell for every page that existed, which is
 * why the guard below was load-bearing.)
 *
 * Returns null when the page has no markdown, so tools degrade instead of throwing.
 */
export async function getMarkdown(pathname: string): Promise<string | null> {
  const path = pathname.replace(/^\/+/, '').replace(/\.md$/, '');
  const url = `${BASE_URL}/md/${path}.md`;
  const res = await fetch(url, { headers: { accept: 'text/markdown' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status} ${res.statusText})`);
  const text = await res.text();
  // Belt and braces: a rewrite that lands on a page would 200 with HTML.
  if (/^\s*<(?:!doctype|html)/i.test(text)) return null;
  return text;
}

export type MarkdownIndex = { count: number; pages: { path: string; md: string }[] };

/** The manifest of every generated markdown page — used to list what exists. */
export function getMarkdownIndex(): Promise<MarkdownIndex> {
  return getJson(`${BASE_URL}/md/index.json`);
}

export const urls = {
  page: (pathname: string) => `${BASE_URL}/${pathname.replace(/^\/+/, '')}`,
  md: (pathname: string) => `${BASE_URL}/md/${pathname.replace(/^\/+/, '')}.md`,
};
