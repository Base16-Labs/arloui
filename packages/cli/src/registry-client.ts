import {
  parseOrThrow,
  registryIndexSchema,
  resolvedRegistryEntrySchema,
  type RegistryIndex,
  type RegistryIndexEntry,
  type ResolvedRegistryEntry,
  type ResolvedRegistryFile,
} from './registry-schema';

export type { RegistryIndex, RegistryIndexEntry, ResolvedRegistryEntry, ResolvedRegistryFile };

/** Subset of the global `fetch` we depend on — injectable so tests can stub it. */
export type FetchLike = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
}>;

export type RegistryClientOptions = {
  /** Abort a request that takes longer than this (ms). Default 15s. */
  timeoutMs?: number;
  /** Override the fetch implementation (tests / custom transports). */
  fetch?: FetchLike;
};

const DEFAULT_TIMEOUT_MS = 15_000;

/** Ordering used when installing an entry and its transitive dependencies. */
const KIND_ORDER = { foundation: 0, primitive: 1, pattern: 2, icon: 3 } as const;

export class RegistryClient {
  private readonly timeoutMs: number;
  private readonly fetchImpl: FetchLike;

  constructor(
    private readonly base: string,
    options: RegistryClientOptions = {},
  ) {
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    // Default to the global fetch (Node 18+).
    this.fetchImpl = options.fetch ?? ((input, init) => fetch(input, init));
  }

  async index(): Promise<RegistryIndex> {
    const url = `${this.base}/index.json`;
    const data = await this.fetchJson(url);
    return parseOrThrow(registryIndexSchema, data, url);
  }

  async get(name: string): Promise<ResolvedRegistryEntry> {
    const url = `${this.base}/${encodeURIComponent(name)}.json`;
    const data = await this.fetchJson(url);
    return parseOrThrow(resolvedRegistryEntrySchema, data, url);
  }

  /**
   * Returns the entry plus all transitive registry dependencies, deduped and
   * ordered foundation → primitive → pattern → icon so dependencies are written
   * before the components that rely on them. Safe against dependency cycles.
   */
  async resolve(name: string): Promise<ResolvedRegistryEntry[]> {
    const seen = new Map<string, ResolvedRegistryEntry>();
    const visiting = new Set<string>();

    const visit = async (id: string) => {
      if (seen.has(id) || visiting.has(id)) return;
      visiting.add(id);
      const entry = await this.get(id);
      seen.set(id, entry);
      for (const dep of entry.registryDependencies ?? []) {
        await visit(dep);
      }
      visiting.delete(id);
    };

    await visit(name);
    return [...seen.values()].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
  }

  private async fetchJson(url: string): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let res: Awaited<ReturnType<FetchLike>>;
    try {
      res = await this.fetchImpl(url, { signal: controller.signal });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`registry request timed out after ${this.timeoutMs}ms: ${url}`);
      }
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(`registry request failed: ${url} (${reason})`);
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      throw new Error(`registry fetch failed: ${url} (${res.status} ${res.statusText})`);
    }

    try {
      return await res.json();
    } catch {
      throw new Error(`registry returned invalid JSON: ${url}`);
    }
  }
}
