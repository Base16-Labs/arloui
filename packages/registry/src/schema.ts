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

/**
 * One published Figma component set, tied to the code it stands for.
 *
 * A registry entry rarely maps 1:1 to a Figma component. The two systems
 * diverge in shapes that are deliberate, not accidental — a single set carrying
 * every prop is unusable to design against, and some code affordances have no
 * Figma expression at all. Rather than force either side to imitate the other,
 * each correspondence is declared here, with the reason when it isn't obvious.
 *
 * Two shapes cover everything so far:
 *
 *   - **per-export** — the Figma set matches one named export of this entry
 *     (`Buttons/Ghost` ↔ `GhostButton`). Set `export`.
 *   - **per-variant** — several Figma sets are one export distinguished by prop
 *     values (`Input field NO BG` ↔ `<Input appearance="plain">`). Set `props`.
 *
 * An entry with no binding has nothing drawn in Figma yet. That is recorded as
 * an absent `figma` key — never as a guessed path.
 */
export type FigmaBinding = {
  /** Component-set name exactly as published, e.g. `Buttons/Ghost`. */
  set: string;
  /** The named export this set corresponds to, when the split is per-export. */
  export?: string;
  /** Prop values that select this set, when the split is per-variant. */
  props?: Record<string, string | boolean>;
  /** Why the two sides differ, where a reader would otherwise wonder. */
  note?: string;
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
    /**
     * Published Figma component sets backing this entry. Omit when nothing is
     * drawn yet — an absent key is honest, a guessed path is not.
     */
    figma?: FigmaBinding[];
    /** Tags shown in the docs and used by the skill picker. */
    tags?: string[];
  };
};

export type Registry = {
  $schema: 'https://arloui.com/schemas/registry-v1.json';
  version: string;
  items: RegistryEntry[];
};
