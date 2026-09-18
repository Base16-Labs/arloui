import assert from 'node:assert/strict';
import { test } from 'node:test';
import { subscribeChartScreenEntrance } from '../components/playground/chart-screen-entrance';

function setup(native: boolean) {
  const listeners = new Map<string, () => void>();
  const frames = new Map<number, () => void>();
  let id = 0;
  let focused = true;
  let ready = false;
  const navigation = {
    isFocused: () => focused,
    addListener: (event: string, callback: () => void) => {
      listeners.set(event, callback);
      return () => { listeners.delete(event); };
    },
  } as Parameters<typeof subscribeChartScreenEntrance>[0];
  const stop = subscribeChartScreenEntrance(navigation, native, (next) => { ready = next; }, {
    request: (callback) => { frames.set(++id, callback); return id; },
    cancel: (key) => { frames.delete(key); },
  });
  return {
    ready: () => ready,
    focus: (value: boolean) => { focused = value; },
    emit: (event: string) => listeners.get(event)?.(),
    frame: () => {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback());
    },
    listeners,
    stop,
  };
}

test('native entrance waits for screen arrival, not mount or focus', () => {
  const screen = setup(true);
  screen.emit('focus');
  screen.emit('transitionStart');
  screen.frame();
  screen.frame();
  assert.equal(screen.ready(), false);
  screen.emit('transitionEnd');
  screen.frame();
  assert.equal(screen.ready(), false);
  screen.frame();
  assert.equal(screen.ready(), true);
  screen.stop();
});

test('returning to a retained screen mounts a fresh chart after arrival', () => {
  const screen = setup(true);
  screen.emit('transitionEnd');
  screen.frame(); screen.frame();
  screen.focus(false);
  screen.emit('blur');
  assert.equal(screen.ready(), false);
  screen.focus(true);
  screen.emit('focus');
  screen.frame(); screen.frame();
  assert.equal(screen.ready(), false);
  screen.emit('transitionEnd');
  screen.frame(); screen.frame();
  assert.equal(screen.ready(), true);
  screen.stop();
});

test('web direct visits start after two paint frames without native events', () => {
  const screen = setup(false);
  screen.frame();
  assert.equal(screen.ready(), false);
  screen.frame();
  assert.equal(screen.ready(), true);
  screen.stop();
});

test('leaving or unmounting cancels a pending entrance', () => {
  const screen = setup(true);
  screen.emit('transitionEnd');
  screen.frame();
  screen.focus(false);
  screen.emit('blur');
  screen.frame();
  assert.equal(screen.ready(), false);
  screen.focus(true);
  screen.emit('transitionEnd');
  screen.stop();
  screen.frame(); screen.frame();
  assert.equal(screen.ready(), false);
  assert.equal(screen.listeners.size, 0);
});
