import { jest } from '@jest/globals';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => {}),
  selectionAsync: jest.fn(async () => {}),
  notificationAsync: jest.fn(async () => {}),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

import * as Haptics from 'expo-haptics';
import { haptic } from '../haptics';

const impactAsync = jest.mocked(Haptics.impactAsync);
const selectionAsync = jest.mocked(Haptics.selectionAsync);
const notificationAsync = jest.mocked(Haptics.notificationAsync);

beforeEach(() => jest.clearAllMocks());

describe('haptic (iOS test env)', () => {
  it('maps light/medium/heavy to impactAsync', async () => {
    await haptic('light');
    await haptic('medium');
    await haptic('heavy');
    expect(impactAsync).toHaveBeenNthCalledWith(1, 'light');
    expect(impactAsync).toHaveBeenNthCalledWith(2, 'medium');
    expect(impactAsync).toHaveBeenNthCalledWith(3, 'heavy');
  });

  it('maps selection to selectionAsync', async () => {
    await haptic('selection');
    expect(selectionAsync).toHaveBeenCalledTimes(1);
  });

  it('maps success/warning/error to notificationAsync', async () => {
    await haptic('success');
    await haptic('warning');
    await haptic('error');
    expect(notificationAsync).toHaveBeenNthCalledWith(1, 'success');
    expect(notificationAsync).toHaveBeenNthCalledWith(2, 'warning');
    expect(notificationAsync).toHaveBeenNthCalledWith(3, 'error');
  });

  it('defaults to a light impact', async () => {
    await haptic();
    expect(impactAsync).toHaveBeenCalledWith('light');
  });

  it('never throws even if the haptics call rejects', async () => {
    impactAsync.mockRejectedValueOnce(new Error('no native module'));
    await expect(haptic('light')).resolves.toBeUndefined();
  });
});

describe('haptic on web (no native haptics)', () => {
  it('no-ops without importing expo-haptics', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { haptic: webHaptic } = require('../haptics');
      await webHaptic('light');
      expect(impactAsync).not.toHaveBeenCalled();
    });
    jest.dontMock('react-native');
  });
});
