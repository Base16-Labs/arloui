import { describe, expect, it, vi } from 'vitest';
import { RegistryClient, type FetchLike } from '../registry-client';

const BASE = 'https://registry.test/r';

type EntryShape = {
  name: string;
  kind: 'foundation' | 'primitive' | 'pattern' | 'icon';
  registryDependencies?: string[];
};

function entry({ name, kind, registryDependencies }: EntryShape) {
  return {
    name,
    kind,
    title: name,
    description: `${name} description`,
    ...(registryDependencies ? { registryDependencies } : {}),
    files: [{ source: `${name}.tsx`, target: `${name}.tsx`, content: `// ${name}` }],
    hash: `hash-${name}`,
  };
}

/** Build an injectable fetch that serves a `url -> json` map. */
function fetchFrom(routes: Record<string, unknown>): FetchLike {
  return vi.fn(async (url: string) => {
    if (!(url in routes)) {
      return { ok: false, status: 404, statusText: 'Not Found', json: async () => ({}) };
    }
    return { ok: true, status: 200, statusText: 'OK', json: async () => routes[url] };
  });
}

describe('RegistryClient.index', () => {
  it('fetches and validates the index', async () => {
    const fetch = fetchFrom({
      [`${BASE}/index.json`]: {
        version: '0.1.0',
        items: [{ name: 'button', kind: 'primitive', title: 'Button', description: 'b' }],
      },
    });
    const client = new RegistryClient(BASE, { fetch });
    const index = await client.index();
    expect(index.version).toBe('0.1.0');
    expect(index.items).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith(`${BASE}/index.json`, expect.anything());
  });

  it('throws a validation error for a malformed index', async () => {
    const fetch = fetchFrom({ [`${BASE}/index.json`]: { items: 'nope' } });
    const client = new RegistryClient(BASE, { fetch });
    await expect(client.index()).rejects.toThrow(/invalid registry response/);
  });
});

describe('RegistryClient.get', () => {
  it('fetches, validates, and url-encodes the name', async () => {
    const fetch = fetchFrom({
      [`${BASE}/my%2Fcomp.json`]: entry({ name: 'x', kind: 'primitive' }),
    });
    const client = new RegistryClient(BASE, { fetch });
    const e = await client.get('my/comp');
    expect(e.hash).toBe('hash-x');
  });

  it('throws including the status on an HTTP error', async () => {
    const fetch = fetchFrom({});
    const client = new RegistryClient(BASE, { fetch });
    await expect(client.get('missing')).rejects.toThrow(/404 Not Found/);
  });

  it('throws on invalid JSON', async () => {
    const fetch: FetchLike = async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });
    const client = new RegistryClient(BASE, { fetch });
    await expect(client.get('button')).rejects.toThrow(/invalid JSON/);
  });

  it('throws a validation error when the payload fails the schema', async () => {
    const fetch = fetchFrom({ [`${BASE}/button.json`]: { name: 'button' } });
    const client = new RegistryClient(BASE, { fetch });
    await expect(client.get('button')).rejects.toThrow(/invalid registry response/);
  });
});

describe('RegistryClient.fetchJson timeout & network', () => {
  it('aborts and reports a timeout when the request hangs', async () => {
    const fetch: FetchLike = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const err = new Error('aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    const client = new RegistryClient(BASE, { fetch, timeoutMs: 20 });
    await expect(client.index()).rejects.toThrow(/timed out after 20ms/);
  });

  it('wraps a network failure with the url', async () => {
    const fetch: FetchLike = async () => {
      throw new Error('ECONNREFUSED');
    };
    const client = new RegistryClient(BASE, { fetch });
    await expect(client.index()).rejects.toThrow(/registry request failed.*ECONNREFUSED/s);
  });
});

describe('RegistryClient.resolve', () => {
  it('returns transitive deps, deduped, foundation-first', async () => {
    const fetch = fetchFrom({
      [`${BASE}/button.json`]: entry({
        name: 'button',
        kind: 'primitive',
        registryDependencies: ['tokens', 'theme-provider'],
      }),
      [`${BASE}/theme-provider.json`]: entry({
        name: 'theme-provider',
        kind: 'foundation',
        registryDependencies: ['tokens'],
      }),
      [`${BASE}/tokens.json`]: entry({ name: 'tokens', kind: 'foundation' }),
    });
    const client = new RegistryClient(BASE, { fetch });
    const resolved = await client.resolve('button');

    const names = resolved.map((e) => e.name);
    expect(new Set(names).size).toBe(names.length); // deduped
    expect(names).toContain('tokens');
    expect(names).toContain('theme-provider');
    // foundation entries come before the primitive
    expect(names.indexOf('tokens')).toBeLessThan(names.indexOf('button'));
    expect(names.indexOf('theme-provider')).toBeLessThan(names.indexOf('button'));
  });

  it('does not loop forever on a dependency cycle', async () => {
    const fetch = fetchFrom({
      [`${BASE}/a.json`]: entry({ name: 'a', kind: 'primitive', registryDependencies: ['b'] }),
      [`${BASE}/b.json`]: entry({ name: 'b', kind: 'primitive', registryDependencies: ['a'] }),
    });
    const client = new RegistryClient(BASE, { fetch });
    const resolved = await client.resolve('a');
    expect(resolved.map((e) => e.name).sort()).toEqual(['a', 'b']);
  });

  it('fetches each entry only once even when shared by multiple deps', async () => {
    const fetch = fetchFrom({
      [`${BASE}/root.json`]: entry({
        name: 'root',
        kind: 'pattern',
        registryDependencies: ['left', 'right'],
      }),
      [`${BASE}/left.json`]: entry({
        name: 'left',
        kind: 'primitive',
        registryDependencies: ['tokens'],
      }),
      [`${BASE}/right.json`]: entry({
        name: 'right',
        kind: 'primitive',
        registryDependencies: ['tokens'],
      }),
      [`${BASE}/tokens.json`]: entry({ name: 'tokens', kind: 'foundation' }),
    });
    const client = new RegistryClient(BASE, { fetch });
    await client.resolve('root');
    const tokenCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c) => c[0] === `${BASE}/tokens.json`,
    );
    expect(tokenCalls).toHaveLength(1);
  });
});
