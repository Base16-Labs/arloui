'use client';

import type { ReactNode } from 'react';

export function GlassView({ children }: { children?: ReactNode }) {
  return children;
}

export function isLiquidGlassAvailable() {
  return false;
}

export function isGlassEffectAPIAvailable() {
  return false;
}
