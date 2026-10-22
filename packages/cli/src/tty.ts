import * as p from '@clack/prompts';

/**
 * A real terminal. Node only sets `isTTY` on a TTY stream; a pipe (`| cat`),
 * a file, or a CI log leaves it `undefined`, so anything but `true` is headless.
 * Unit tests pin it to `true` in vitest.setup.ts.
 */
export function isInteractive(): boolean {
  return process.stdout.isTTY === true;
}

/** Clack's spinner calls `uv_tty_init`, which throws when stdout is a pipe. */
export function spinner(): { start: (message: string) => void; stop: (message?: string) => void } {
  if (!isInteractive()) {
    return {
      start(message: string) {
        console.log(message);
      },
      stop(message?: string) {
        if (message) console.log(message);
      },
    };
  }
  return p.spinner();
}
