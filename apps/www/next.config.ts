import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arloui/tokens', '@arloui/registry'],
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      'react-native-svg': './lib/react-native-svg-web.tsx',
      'react-native-reanimated': './lib/react-native-reanimated-web.tsx',
      'expo-haptics': './lib/expo-haptics-web.ts',
      'expo-glass-effect': './lib/expo-glass-effect-web.tsx',
    },
  },
  output: 'standalone',
  logging: {
    // The icon gallery can request many SVGs at once. Logging every asset request
    // floods retained terminal output without providing useful development signal.
    incomingRequests: { ignore: [/^\/arlo-icons\//] },
  },
  // Trace workspace files from the monorepo root so `output: 'standalone'`
  // bundles the linked @arloui/* sources correctly.
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
};

export default nextConfig;
