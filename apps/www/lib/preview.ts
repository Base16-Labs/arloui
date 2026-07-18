/**
 * Deep-link builder for the Expo playground (apps/docs).
 *
 * Each component doc page shows a QR code that opens the matching screen in the
 * Arlo UI Playground. The playground uses the `arloui` URL scheme and expo-router
 * file routes (e.g. `/button`, `/sheet`, `/tab-bar`).
 *
 * NOTE: the real preview base URL is still TBD — for a shared build we'll point
 * this at a published Expo/EAS Update URL. Until then it defaults to the app's
 * custom scheme so the QR resolves once the playground is installed on-device.
 * Override per-deploy with NEXT_PUBLIC_EXPO_PREVIEW_URL (e.g. an `exp://…` URL).
 */
const PREVIEW_BASE = process.env.NEXT_PUBLIC_EXPO_PREVIEW_URL ?? 'arloui://';

/** Doc slugs whose Expo route filename differs from the slug. */
const ROUTE_ALIASES: Record<string, string> = {
  'text-area': 'textarea',
};

export function devicePreviewUrl(route: string): string {
  const path = ROUTE_ALIASES[route] ?? route;
  const base = PREVIEW_BASE.endsWith('/') ? PREVIEW_BASE : `${PREVIEW_BASE}/`;
  return `${base}${path}`;
}
