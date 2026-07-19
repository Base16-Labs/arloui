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
 * The default manifest URL lives in preview-target.json, which the EAS Update
 * CI workflow (.github/workflows/eas-update.yml) rewrites on every merge to main
 * so the QR always points at the newest published playground. Override per
 * deploy with NEXT_PUBLIC_EXPO_PREVIEW_URL if needed.
 *
 * Note: a channel-based manifest URL (…?channel-name=production) is NOT used for
 * deep links — Expo Go needs channel-name on the manifest request, but the query
 * string on an `exp://…/--/<route>` URL is delivered to the app, not the manifest
 * server, so the update would fail to resolve. The group-based URL needs no
 * manifest query, which is why CI keeps the group ID fresh instead.
 *
 * Project: @base16/arloui-playground (projectId 0e137cd5-9ad3-436d-a976-0fab95640f4b)
 */
import previewTarget from './preview-target.json';

const PREVIEW_BASE = process.env.NEXT_PUBLIC_EXPO_PREVIEW_URL ?? previewTarget.manifestUrl;

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
