/**
 * The registry's `foundation/tokens.ts` is a dependency-free template copied
 * verbatim into consumer projects. It intentionally duplicates the values in
 * `@arloui/tokens` (the canonical TS source). ARCHITECTURE.md requires the two
 * to stay numerically in lockstep — this test fails the moment they drift.
 */
import {
  spacing as canonicalSpacing,
  radii as canonicalRadii,
  lightSemanticColors as canonicalLight,
  darkSemanticColors as canonicalDark,
  lightColors as canonicalLightFlat,
  darkColors as canonicalDarkFlat,
} from '@arloui/tokens';
import {
  spacing as registrySpacing,
  radii as registryRadii,
  lightSemanticColors as registryLight,
  darkSemanticColors as registryDark,
  lightColors as registryLightFlat,
  darkColors as registryDarkFlat,
} from '../tokens';

describe('registry foundation tokens ↔ @arloui/tokens parity', () => {
  it('spacing scales match exactly', () => {
    expect(registrySpacing).toEqual(canonicalSpacing);
  });

  it('radii scales match exactly', () => {
    expect(registryRadii).toEqual(canonicalRadii);
  });

  it('light semantic colors match exactly', () => {
    expect(registryLight).toEqual(canonicalLight);
  });

  it('dark semantic colors match exactly', () => {
    expect(registryDark).toEqual(canonicalDark);
  });

  it('light and dark expose the same semantic color keys', () => {
    expect(Object.keys(registryLight).sort()).toEqual(Object.keys(registryDark).sort());
  });

  /**
   * The flat aliases (`surface`, `surfaceRaised`, `accent`, …) went uncovered
   * for long enough that dark `surface` and `surfaceRaised` drifted into each
   * other's roles between the two files. Components read these directly, so a
   * mismatch renders differently in a consumer's app than in our own docs.
   */
  it('light flat color aliases match exactly', () => {
    expect(registryLightFlat).toEqual(canonicalLightFlat);
  });

  it('dark flat color aliases match exactly', () => {
    expect(registryDarkFlat).toEqual(canonicalDarkFlat);
  });
});
