import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arloui/tokens'],
  output: 'standalone',
  logging: {
    // The icon gallery can request many SVGs at once. Logging every asset request
    // floods retained terminal output without providing useful development signal.
    incomingRequests: { ignore: [/^\/arlo-icons\//] },
  },
  // Trace workspace files from the monorepo root so `output: 'standalone'`
  // bundles the linked @arloui/* sources correctly.
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
  outputFileTracingIncludes: {
    // Both the icon endpoint and the icons primitive doc read these files from
    // the filesystem at runtime (getIconNames / getAnimatedIconSource / getIconSvg).
    // Trace them into every consuming route so they exist in the deployed bundle;
    // otherwise the doc page 500s in production when it re-renders (ISR/cache miss).
    '/arlo-icons/*': [
      '../../packages/icons/assets/svg/*.svg',
      '../../packages/registry/src/components/animated-icon/animated-icon.tsx',
    ],
    '/docs/primitives/*': [
      '../../packages/icons/assets/svg/*.svg',
      '../../packages/registry/src/components/animated-icon/animated-icon.tsx',
    ],
  },
};

export default nextConfig;
