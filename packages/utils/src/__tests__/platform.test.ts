import { isAndroid, isIOS, isNative, isWeb, pick } from '../platform';

describe('platform flags (default test env = ios)', () => {
  it('detects iOS', () => {
    expect(isIOS).toBe(true);
    expect(isAndroid).toBe(false);
    expect(isWeb).toBe(false);
    expect(isNative).toBe(true);
  });
});

describe('pick', () => {
  it('returns the iOS value on iOS', () => {
    expect(pick({ ios: 'i', android: 'a', web: 'w', default: 'd' })).toBe('i');
  });

  it('falls back to default when the platform value is absent', () => {
    expect(pick({ android: 'a', default: 'd' })).toBe('d');
  });

  it('re-evaluates per platform when the OS changes', () => {
    jest.isolateModules(() => {
      jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const platform = require('../platform');
      expect(platform.isAndroid).toBe(true);
      expect(platform.isIOS).toBe(false);
      expect(platform.pick({ ios: 'i', android: 'a', default: 'd' })).toBe('a');
    });
    jest.dontMock('react-native');
  });

  it('uses the web value on web', () => {
    jest.isolateModules(() => {
      jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const platform = require('../platform');
      expect(platform.isWeb).toBe(true);
      expect(platform.isNative).toBe(false);
      expect(platform.pick({ web: 'w', default: 'd' })).toBe('w');
    });
    jest.dontMock('react-native');
  });
});
