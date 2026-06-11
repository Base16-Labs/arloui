import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arloui/tokens'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/arlo-icons/*': [
      '../../packages/icons/assets/svg/*.svg',
      '../../packages/registry/src/components/animated-icon/animated-icon.tsx',
    ],
  },
};

export default nextConfig;
