/**
 * Emits a ready-to-run Figma plugin script for one exported component.
 *
 *   npm run design:figma -- tabs > /tmp/tabs.js
 *
 * The output is the plan (data) concatenated with the executor (`runtime/apply.js`),
 * which is what gets pasted into `use_figma`. Producing it from a committed
 * planner rather than hand-writing the script each time is the point: the
 * decisions are tested, and two runs of the same component are identical.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { planFor, requiredVariables, type ExportNode } from './plan.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');

type Component = {
  component: string;
  set: string;
  notes?: string;
  axes: Array<{ property: string; prop: string; values: string[] }>;
  variants: Array<{
    variant: Record<string, string>;
    trees: { light: ExportNode | null; dark: ExportNode | null };
  }>;
};

function main() {
  const args = process.argv.slice(2);
  // `--limit N` emits a subset, for exercising the executor without pasting a
  // 46KB script into a tool call.
  const limitAt = args.indexOf('--limit');
  const limit = limitAt === -1 ? Infinity : Number(args[limitAt + 1]);
  const positional = args.filter((a, i) => a !== '--limit' && i !== limitAt + 1);
  const [name, outPath] = positional;
  if (!name) {
    console.error('usage: design:figma -- <component> [outFile] [--limit N]\n');
    process.exit(1);
  }

  const exportPath = join(ROOT, 'design', 'components.json');
  const { components } = JSON.parse(readFileSync(exportPath, 'utf8')) as {
    components: Component[];
  };
  const spec = components.find((c) => c.component === name || c.set === name);
  if (!spec) {
    console.error(
      `No component "${name}" in design/components.json. Available: ${components
        .map((c) => c.component)
        .join(', ')}`,
    );
    process.exit(1);
  }

  const cells = spec.variants
    .filter((v) => v.trees.light)
    .slice(0, limit)
    .map((v) => ({
      // Figma parses "Prop=Value, Prop=Value" into variant properties.
      name: spec.axes.map((a) => `${a.property}=${v.variant[a.property]}`).join(', '),
      plan: planFor(v.trees.light as ExportNode),
    }));

  const required = [...new Set(cells.flatMap((c) => requiredVariables(c.plan)))].sort();

  const config = {
    page: `${spec.set} (code export)`,
    set: spec.set,
    fontFamily: 'Manrope',
    width: 343,
    height: 44,
    requiredVariables: required,
    description:
      `Generated from @arloui/registry via \`npm run design:components\` + ` +
      `\`npm run design:figma -- ${spec.component}\`. Values the component ` +
      `hardcodes are left literal.` + (spec.notes ? ` ${spec.notes}` : ''),
  };

  const runtime = readFileSync(join(HERE, '..', 'runtime', 'apply.js'), 'utf8');
  const script = [
    `// ${spec.set}: ${cells.length} variants, ${required.length} variables.`,
    `const PLAN = ${JSON.stringify(cells)};`,
    `const CONFIG = ${JSON.stringify(config)};`,
    runtime,
  ].join('\n');

  if (outPath) {
    writeFileSync(outPath, script);
    console.error(`wrote ${outPath} — ${cells.length} variants, ${required.length} variables`);
  } else {
    process.stdout.write(script);
  }
}

main();
