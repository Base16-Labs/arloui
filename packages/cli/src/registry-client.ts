import type { Registry, RegistryEntry, RegistryFile } from '@arloui/registry';

export type ResolvedRegistryFile = RegistryFile & { content: string };
export type ResolvedRegistryEntry = Omit<RegistryEntry, 'files'> & {
  files: ResolvedRegistryFile[];
  hash: string;
};
export type RegistryIndex = Pick<Registry, '$schema' | 'version'> & {
  generatedAt: string;
  items: RegistryEntry[];
};

export class RegistryClient {
  constructor(private readonly base: string) {}

  async index(): Promise<RegistryIndex> {
    return this.fetchJson<RegistryIndex>(`${this.base}/index.json`);
  }

  async get(name: string): Promise<ResolvedRegistryEntry> {
    return this.fetchJson<ResolvedRegistryEntry>(`${this.base}/${name}.json`);
  }

  /** Returns the entry plus all transitive registry dependencies, deduped. */
  async resolve(name: string): Promise<ResolvedRegistryEntry[]> {
    const seen = new Map<string, ResolvedRegistryEntry>();
    const visit = async (id: string) => {
      if (seen.has(id)) return;
      const entry = await this.get(id);
      seen.set(id, entry);
      for (const dep of entry.registryDependencies ?? []) {
        await visit(dep);
      }
    };
    await visit(name);
    // foundation deps first, then primitives, then patterns
    const order = { foundation: 0, primitive: 1, pattern: 2, icon: 3 } as const;
    return [...seen.values()].sort((a, b) => order[a.kind] - order[b.kind]);
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`registry fetch failed: ${url} (${res.status} ${res.statusText})`);
    }
    return (await res.json()) as T;
  }
}
