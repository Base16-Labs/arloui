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
} from '@arloui/tokens';
import {
  spacing as registrySpacing,
  radii as registryRadii,
  lightSemanticColors as registryLight,
  darkSemanticColors as registryDark,
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
});
