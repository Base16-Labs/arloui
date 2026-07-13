import { describe, expect, it } from 'vitest';
import { parseOrThrow, registryIndexSchema, resolvedRegistryEntrySchema } from '../registry-schema';

const validEntry = {
  name: 'button',
  kind: 'primitive',
  title: 'Button',
  description: 'Accessible action button.',
  registryDependencies: ['tokens', 'theme-provider'],
  dependencies: ['expo-haptics'],
  nativeDeps: [{ name: 'expo-haptics', setup: 'npx expo install expo-haptics' }],
  files: [{ source: 'components/button/button.tsx', target: 'button.tsx', content: 'export {}' }],
  hash: 'abc123',
  meta: { figma: 'Components/Button', tags: ['action'] },
};

const validIndex = {
  $schema: 'https://arloui.dev/schemas/registry-index-v1.json',
  version: '0.1.0',
  generatedAt: '2026-01-01T00:00:00.000Z',
  items: [
    { name: 'tokens', kind: 'foundation', title: 'Tokens', description: 'tokens' },
    { name: 'button', kind: 'primitive', title: 'Button', description: 'btn' },
  ],
};

describe('resolvedRegistryEntrySchema', () => {
  it('accepts a fully-formed entry', () => {
    expect(() => resolvedRegistryEntrySchema.parse(validEntry)).not.toThrow();
  });

  it('accepts an entry with only required fields', () => {
    const minimal = {
      name: 'card',
      kind: 'primitive',
      title: 'Card',
      description: '',
      files: [{ target: 'card.tsx', content: '' }],
      hash: 'h',
    };
    expect(() => resolvedRegistryEntrySchema.parse(minimal)).not.toThrow();
  });

  it('rejects an unknown kind', () => {
    expect(() => resolvedRegistryEntrySchema.parse({ ...validEntry, kind: 'widget' })).toThrow();
  });

  it('rejects an entry with no files', () => {
    expect(() => resolvedRegistryEntrySchema.parse({ ...validEntry, files: [] })).toThrow();
  });

  it('rejects a file missing its content', () => {
    const bad = { ...validEntry, files: [{ target: 'button.tsx' }] };
    expect(() => resolvedRegistryEntrySchema.parse(bad)).toThrow();
  });

  it('rejects unknown top-level keys (strict)', () => {
    expect(() => resolvedRegistryEntrySchema.parse({ ...validEntry, evil: true })).toThrow();
  });

  it('rejects a missing hash', () => {
    const { hash: _hash, ...noHash } = validEntry;
    expect(() => resolvedRegistryEntrySchema.parse(noHash)).toThrow();
  });
});

describe('registryIndexSchema', () => {
  it('accepts a valid index', () => {
    expect(() => registryIndexSchema.parse(validIndex)).not.toThrow();
  });

  it('rejects a missing version', () => {
    const { version: _v, ...noVersion } = validIndex;
    expect(() => registryIndexSchema.parse(noVersion)).toThrow();
  });

  it('rejects index items that carry file contents (strict metadata only)', () => {
    const withFiles = {
      ...validIndex,
      items: [{ name: 'x', kind: 'primitive', title: 'X', description: '', files: [] }],
    };
    expect(() => registryIndexSchema.parse(withFiles)).toThrow();
  });
});

describe('parseOrThrow', () => {
  it('returns parsed data on success', () => {
    const out = parseOrThrow(resolvedRegistryEntrySchema, validEntry, 'http://x/button.json');
    expect(out.name).toBe('button');
  });

  it('throws an error naming the source url', () => {
    expect(() => parseOrThrow(registryIndexSchema, {}, 'http://x/index.json')).toThrow(
      /http:\/\/x\/index\.json/,
    );
  });

  it('lists at most five issues and summarizes the rest', () => {
    // An object that violates many required fields at once.
    let caught: Error | undefined;
    try {
      parseOrThrow(
        resolvedRegistryEntrySchema,
        { name: 1, kind: 2, title: 3, description: 4, files: 5, hash: 6, meta: 7 },
        'http://x/button.json',
      );
    } catch (err) {
      caught = err as Error;
    }
    expect(caught).toBeDefined();
    const bullets = caught!.message.split('\n').filter((l) => l.trim().startsWith('- '));
    expect(bullets.length).toBeLessThanOrEqual(5);
    expect(caught!.message).toMatch(/and \d+ more/);
  });
});
