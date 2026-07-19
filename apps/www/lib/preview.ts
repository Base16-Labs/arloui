/**
 * Deep-link builder for the Expo playground (apps/docs).
 *
 * Each component doc page shows a QR code that a phone opens in Expo Go. It
 * loads the published EAS Update of the Arlo UI Playground and deep-links
 * straight to the matching expo-router screen (e.g. `/button`, `/badge`).
 *
 * URL shape (Expo Go + EAS Update):
 *   exp://u.expo.dev/<projectId>/group/<updateGroupId>/--/<route>
 * The `/--/` separator tells Expo Go that everything after it is the in-app
 * deep-link path rather than part of the manifest URL.
 *
 * The default below is pinned to a specific published update group, so it works
 * out of the box. Each `eas update --branch production` prints a new group ID —
 * point NEXT_PUBLIC_EXPO_PREVIEW_URL at it (CI can do this automatically) to
 * serve a newer build without editing this file. A channel-based manifest URL
 * (`exp://u.expo.dev/<projectId>?channel-name=production`) also works — the
 * query string is preserved and re-appended after the `/--/<route>` segment.
 *
 * Project: @base16/arloui-playground (projectId 0e137cd5-9ad3-436d-a976-0fab95640f4b)
 */
const PREVIEW_BASE =
  process.env.NEXT_PUBLIC_EXPO_PREVIEW_URL ??
  'exp://u.expo.dev/0e137cd5-9ad3-436d-a976-0fab95640f4b/group/27a1fe79-0946-4499-9e96-e7f64d8232ce';

/** Doc slugs whose Expo route filename differs from the slug. */
const ROUTE_ALIASES: Record<string, string> = {
  'text-area': 'textarea',
};

export function devicePreviewUrl(route: string): string {
  const path = ROUTE_ALIASES[route] ?? route;
  // Split off any manifest query (e.g. `?channel-name=production`) so the
  // `/--/<route>` deep-link segment stays attached to the manifest URL.
  const [manifest, query] = PREVIEW_BASE.split('?');
  const base = manifest.replace(/\/+$/, '');
  return `${base}/--/${path}${query ? `?${query}` : ''}`;
}
