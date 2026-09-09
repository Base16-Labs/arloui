import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { REGISTRY } from '@arloui/registry/manifest';
import { buildEntry, validateManifest } from '../lib';

const src = fileURLToPath(new URL('../../../../packages/registry/src/', import.meta.url));
const entry = (name: string) => {
  const found = REGISTRY.items.find((item) => item.name === name);
  if (!found) throw new Error(`Missing registry entry: ${name}`);
  return found;
};

describe('line chart registry compatibility', () => {
  it('keeps a valid manifest with both install names', () => {
    expect(validateManifest(REGISTRY)).toEqual([]);
    expect(entry('chart-line').title).toBe('Line chart');
    expect(entry('chart-plot').description).toContain('alias');
  });

  it('emits identical files, dependencies, and hashes for old and new commands', async () => {
    const canonical = await buildEntry(src, entry('chart-line'));
    const legacy = await buildEntry(src, entry('chart-plot'));
    expect(legacy.files).toEqual(canonical.files);
    expect(legacy.hash).toBe(canonical.hash);
    expect(legacy.registryDependencies).toEqual(canonical.registryDependencies);
    expect(legacy.dependencies).toEqual(canonical.dependencies);
    const root = canonical.files.find((file) => file.target === 'chart/chart.tsx');
    expect(root?.content).toContain('export const LineChart = Chart');
    expect(root?.content).toContain('export const Chart =');
  });

  it('installs the line chart once through the complete chart family', () => {
    const dependencies = entry('chart').registryDependencies;
    expect(dependencies).toContain('chart-line');
    expect(dependencies).not.toContain('chart-plot');
    expect(dependencies).toEqual(expect.arrayContaining([
      'chart-bar', 'chart-donut', 'chart-sparkline', 'chart-meter', 'chart-heatmap',
    ]));
  });
});
