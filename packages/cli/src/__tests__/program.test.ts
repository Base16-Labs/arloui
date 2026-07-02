import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../commands/add', () => ({ add: vi.fn() }));
vi.mock('../commands/init', () => ({ init: vi.fn() }));
vi.mock('../commands/list', () => ({ list: vi.fn() }));
vi.mock('../commands/diff', () => ({ diff: vi.fn() }));

import { add } from '../commands/add';
import { diff } from '../commands/diff';
import { init } from '../commands/init';
import { list } from '../commands/list';
import { buildProgram } from '../program';

/** Parse argv as if typed by a user (without the node/script prefix). */
function run(...argv: string[]) {
  return buildProgram().parseAsync(argv, { from: 'user' });
}

const cwd = process.cwd();

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe('arloui program', () => {
  it('routes `init` with defaults', async () => {
    await run('init');
    expect(init).toHaveBeenCalledWith({ cwd, yes: false });
  });

  it('routes `init -y`', async () => {
    await run('init', '-y');
    expect(init).toHaveBeenCalledWith({ cwd, yes: true });
  });

  it('routes `add` with one component', async () => {
    await run('add', 'button');
    expect(add).toHaveBeenCalledWith({ cwd, names: ['button'], yes: false, overwrite: false });
  });

  it('routes `add` with multiple components and flags', async () => {
    await run('add', 'button', 'card', '--yes', '--overwrite');
    expect(add).toHaveBeenCalledWith({
      cwd,
      names: ['button', 'card'],
      yes: true,
      overwrite: true,
    });
  });

  it('routes `add` with no components (interactive picker)', async () => {
    await run('add');
    expect(add).toHaveBeenCalledWith({ cwd, names: [], yes: false, overwrite: false });
  });

  it('routes `list`', async () => {
    await run('list');
    expect(list).toHaveBeenCalledWith({ cwd });
  });

  it('routes `diff` with a component name', async () => {
    await run('diff', 'button');
    expect(diff).toHaveBeenCalledWith({ cwd, name: 'button' });
  });

  it('routes `diff` with no name', async () => {
    await run('diff');
    expect(diff).toHaveBeenCalledWith({ cwd, name: undefined });
  });

  it('exposes the version', () => {
    expect(buildProgram().version()).toBe('0.1.0');
  });

  it('rejects an unknown command', async () => {
    const program = buildProgram();
    program.exitOverride();
    program.configureOutput({ writeErr: () => {}, writeOut: () => {} });
    await expect(program.parseAsync(['nope'], { from: 'user' })).rejects.toBeTruthy();
  });
});
