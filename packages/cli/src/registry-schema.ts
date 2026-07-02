/**
 * Runtime validation for everything the CLI fetches from a registry.
 *
 * The registry is a *remote*, user-configurable URL — `add.ts` turns whatever
 * comes back into files written onto the user's disk. We therefore never trust
 * the shape of that JSON: every payload is parsed through these zod schemas
 * before it is used, so a malformed (or malicious) registry produces a clear
 * error instead of a confusing crash or an unsafe write.
 *
 * The shapes mirror `@arloui/registry`'s `schema.ts` and the output of
 * `tooling/build-registry`.
 */
import { z } from 'zod';

export const registryItemKindSchema = z.enum(['primitive', 'pattern', 'foundation', 'icon']);

export const registryFileTypeSchema = z.enum([
  'component',
  'utility',
  'theme',
  'tokens',
  'example',
]);

export const nativeDepSchema = z.object({
  name: z.string().min(1),
  setup: z.string().min(1),
});

export const registryMetaSchema = z.object({
  figma: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/** Metadata common to both index entries and fully-resolved entries. */
const entryMetaShape = {
  name: z.string().min(1),
  kind: registryItemKindSchema,
  title: z.string().min(1),
  description: z.string(),
  registryDependencies: z.array(z.string().min(1)).optional(),
  dependencies: z.array(z.string().min(1)).optional(),
  nativeDeps: z.array(nativeDepSchema).optional(),
  meta: registryMetaSchema.optional(),
};

/**
 * An entry as it appears in `index.json` — file contents are stripped by the
 * build pipeline, so `files` is absent here.
 */
export const registryIndexEntrySchema = z.object(entryMetaShape).strict();

/** A file inside a resolved entry — `content` is the source to write to disk. */
export const resolvedRegistryFileSchema = z
  .object({
    target: z.string().min(1),
    source: z.string().optional(),
    type: registryFileTypeSchema.optional(),
    content: z.string(),
  })
  .strict();

/** A fully-resolved entry as served at `<base>/<name>.json`. */
export const resolvedRegistryEntrySchema = z
  .object({
    ...entryMetaShape,
    files: z.array(resolvedRegistryFileSchema).min(1),
    hash: z.string().min(1),
  })
  .strict();

export const registryIndexSchema = z
  .object({
    $schema: z.string().optional(),
    version: z.string().min(1),
    generatedAt: z.string().optional(),
    items: z.array(registryIndexEntrySchema),
  })
  .strict();

export type RegistryIndexEntry = z.infer<typeof registryIndexEntrySchema>;
export type ResolvedRegistryFile = z.infer<typeof resolvedRegistryFileSchema>;
export type ResolvedRegistryEntry = z.infer<typeof resolvedRegistryEntrySchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;

/**
 * Parse `data` with `schema`, throwing an `Error` whose message names the
 * source URL and the first few validation issues. Keeps the failure readable
 * for end users running the CLI rather than dumping a raw zod stack.
 */
export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, source: string): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const issues = result.error.issues
    .slice(0, 5)
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  const more =
    result.error.issues.length > 5 ? `\n  …and ${result.error.issues.length - 5} more` : '';
  throw new Error(`invalid registry response from ${source}:\n${issues}${more}`);
}
