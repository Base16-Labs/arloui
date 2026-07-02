import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arloui/tokens'],
  output: 'standalone',
  // Trace workspace files from the monorepo root so `output: 'standalone'`
  // bundles the linked @arloui/* sources correctly.
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
  outputFileTracingIncludes: {
    '/arlo-icons/*': [
      '../../packages/icons/assets/svg/*.svg',
      '../../packages/registry/src/components/animated-icon/animated-icon.tsx',
    ],
  },
};

export default nextConfig;
