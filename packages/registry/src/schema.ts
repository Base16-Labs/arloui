/**
 * Registry schema. Mirrors shadcn/ui's registry shape closely so consumers
 * familiar with that pattern feel at home, with a few RN-specific fields
 * (e.g. `nativeDeps` for native modules requiring `pod install` / `expo prebuild`).
 *
 * The build pipeline in `tooling/build-registry` reads `manifest.ts`, resolves
 * each entry's source files, and emits one JSON file per entry under
 * `apps/www/public/r/<name>.json`. The CLI fetches those JSONs.
 */

export type RegistryItemKind =
  | 'primitive' // single-component primitive (e.g. button)
  | 'pattern' // a composition of primitives (e.g. paywall)
  | 'foundation' // tokens / providers / shared utilities
  | 'icon';

export type RegistryFile = {
  /** Path inside the consumer's project, relative to the resolved alias root. */
  target: string;
  /** Path inside `packages/registry/src` that the build pipeline will read. */
  source: string;
  /** Optional kind — files default to component source. */
  type?: 'component' | 'utility' | 'theme' | 'tokens' | 'example';
};

export type RegistryEntry = {
  /** Stable id, used by the CLI: `arloui add button`. */
  name: string;
  kind: RegistryItemKind;
  /** Human title, used in docs and in the CLI's interactive picker. */
  title: string;
  /** One-line description shown in the CLI listing. */
  description: string;
  /** Other registry items this depends on — installed transitively. */
  registryDependencies?: string[];
  /** npm packages that must exist in the consumer's package.json. */
  dependencies?: string[];
  /** Native modules requiring extra setup (rebuild / pod install / config plugin). */
  nativeDeps?: Array<{
    name: string;
    /** Plain-English instruction printed by the CLI after install. */
    setup: string;
  }>;
  files: RegistryFile[];
  /** Optional metadata for the design skill / docs. */
  meta?: {
    /** Figma component path, e.g. `Components/Button/Primary`. */
    figma?: string;
    /** Tags shown in the docs and used by the skill picker. */
    tags?: string[];
  };
};

export type Registry = {
  $schema: 'https://arloui.com/schemas/registry-v1.json';
  version: string;
  items: RegistryEntry[];
};
