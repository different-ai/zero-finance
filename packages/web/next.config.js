/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '0.finance',
      },
    ],
    minimumCacheTTL: 60,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,

  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.next.json',
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      // Heavy UI libraries
      'framer-motion',
      'recharts',
      'date-fns',
      // Radix UI components (barrel exports)
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      // Other heavy packages
      '@tanstack/react-query',
      'posthog-js',
      'react-hook-form',
      'zod',
    ],
  },
  // Turbopack configuration
  // Note: pino/thread-stream (transitive dep from @walletconnect/logger via @privy-io/react-auth)
  // have dynamic worker requires that break Turbopack bundling at build time.
  // Issue tracked at: https://github.com/vercel/next.js/issues/87342
  // We use --webpack flag for builds until this is resolved.
  turbopack: {},
  outputFileTracingRoot: path.join(__dirname, '../../'),
  staticPageGenerationTimeout: 180,
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        '@react-native-async-storage/async-storage': false,
      };
    }

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/web-worker/, (data) => {
        delete data.dependencies[0].critical;
        return data;
      }),
    );

    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            circomlibjs: {
              test: /[\\/]node_modules[\\/]circomlibjs.*[\\/]/,
              name: 'circomlibjs',
              chunks: 'all',
              priority: 30,
            },
            ffjavascript: {
              test: /[\\/]node_modules[\\/]ffjavascript[\\/]/,
              name: 'ffjavascript',
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }

    config.optimization = {
      ...config.optimization,
      minimize: process.env.NODE_ENV === 'production',
      moduleIds: 'deterministic',
    };

    return config;
  },
  serverExternalPackages: [
    'require-in-the-middle',
    '@metamask/sdk',
    '@wagmi/connectors',
    // pino and related packages have dynamic worker requires that break bundling
    // See: https://github.com/vercel/next.js/pull/86884
    'pino',
    'pino-pretty',
    'pino-roll',
    'thread-stream',
    'sonic-boom',
  ],
};

module.exports = nextConfig;
