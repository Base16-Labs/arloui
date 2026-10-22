import { beforeEach } from 'vitest';

// Behave as a terminal by default so mocked prompts run however the suite is
// launched. Specs that cover headless runs set `isTTY` to undefined themselves.
beforeEach(() => {
  Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true, writable: true });
});
