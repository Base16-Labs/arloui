// Icon data is resolved at build time into `lib/generated/icon-data.ts` and the
// SVGs are emitted as static assets under `public/arlo-icons` (see
// scripts/generate-icon-assets.ts). Nothing here touches the filesystem, so it
// works on Cloudflare Workers where there is no runtime fs.
import { animatedIconSource, iconNames } from './generated/icon-data';

export async function getIconNames() {
  return iconNames;
}

export async function getAnimatedIconSource() {
  return animatedIconSource;
}
