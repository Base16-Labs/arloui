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
  shadowBaseColor as canonicalShadowColor,
  darkShadowBaseColor as canonicalDarkShadowColor,
  blurs as canonicalBlurs,
  materials as canonicalMaterials,
} from '@arloui/tokens';
import {
  spacing as registrySpacing,
  radii as registryRadii,
  lightSemanticColors as registryLight,
  darkSemanticColors as registryDark,
  lightColors as registryLightFlat,
  darkColors as registryDarkFlat,
  shadows as registryShadows,
  darkShadows as registryDarkShadows,
  blurs as registryBlurs,
  materials as registryMaterials,
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

  /**
   * Only the tint is compared: canonical `shadows` zero out `shadowOpacity`
   * off iOS, so the numeric levels legitimately differ by platform while the
   * base color never does.
   */
  it('shadow tints match the canonical base colors', () => {
    for (const level of Object.values(registryShadows)) {
      expect(level.shadowColor).toBe(canonicalShadowColor);
    }
    for (const level of Object.values(registryDarkShadows)) {
      expect(level.shadowColor).toBe(canonicalDarkShadowColor);
    }
  });

  /**
   * The materials went uncovered long enough for their dark overlays to miss
   * the Zinc swap and sit on blue-tinted Grey-900 while every other dark
   * surface had moved. A glass surface is the one place a stale tint shows,
   * since it composites over whatever scrolls beneath it.
   */
  it('blur scales match exactly', () => {
    expect(registryBlurs).toEqual(canonicalBlurs);
  });

  it('glass materials match exactly', () => {
    expect(registryMaterials).toEqual(canonicalMaterials);
  });
});
