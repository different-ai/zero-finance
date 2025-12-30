/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  poweredByHeader: false,
  compress: true,

  // ===========================================
  // BUILD PERFORMANCE OPTIMIZATIONS
  // ===========================================

  // Disable source maps in production to reduce build time and bundle size
  productionBrowserSourceMaps: false,

  // Skip type checking during build (run separately in CI)
  // This saves ~10-15s on builds
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
    tsconfigPath: './tsconfig.next.json',
  },

  // Note: eslint config is no longer supported in next.config.js for Next.js 16+
  // Use next lint CLI options instead

  // Reduce output file tracing scope - major build time saver
  // This was taking 49s in traces
  outputFileTracingExcludes: {
    '*': [
      // Large dependencies that don't need tracing
      'node_modules/@swc/**',
      'node_modules/@esbuild/**',
      'node_modules/esbuild/**',
      'node_modules/terser/**',
      'node_modules/webpack/**',
      'node_modules/typescript/**',
      'node_modules/prettier/**',
      'node_modules/eslint/**',
      // Test files
      'node_modules/**/*.test.js',
      'node_modules/**/*.spec.js',
      'node_modules/**/__tests__/**',
      // Documentation
      'node_modules/**/README.md',
      'node_modules/**/CHANGELOG.md',
      'node_modules/**/LICENSE',
      // Source maps in node_modules
      'node_modules/**/*.map',
      // TypeScript source files
      'node_modules/**/*.ts',
      'node_modules/**/*.tsx',
      '!node_modules/**/*.d.ts',
      // Drizzle migrations not needed at runtime on Vercel
      'drizzle/**',
      // Test artifacts
      'tests/**',
      'test-artifacts/**',
      'playwright-report/**',
      // Scripts not needed at runtime
      'scripts/**',
    ],
  },

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
    return {
      beforeFiles: [
        // Rewrite zerofinance.ai to the /ai landing page
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'zerofinance.ai',
            },
          ],
          destination: '/ai',
        },
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'www.zerofinance.ai',
            },
          ],
          destination: '/ai',
        },
      ],
      afterFiles: [
        {
          source: '/ingest/static/:path*',
          destination: 'https://us-assets.i.posthog.com/static/:path*',
        },
        {
          source: '/ingest/:path*',
          destination: 'https://us.i.posthog.com/:path*',
        },
      ],
      fallback: [],
    };
  },
  skipTrailingSlashRedirect: true,

  reactStrictMode: true,

  experimental: {
    // Optimize barrel imports - reduces module count significantly
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
      // Additional heavy packages (client-side only - not in serverExternalPackages)
      'viem',
      'ai',
      '@ai-sdk/openai',
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

  webpack: (config, { webpack, isServer, dev }) => {
    // Skip heavy optimizations in dev mode
    if (dev) {
      return config;
    }

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

    // Ignore optional dependencies that cause warnings
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(utf-8-validate|bufferutil|encoding)$/,
      }),
    );

    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
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
            // Group vendor chunks for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
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

    // Reduce stats output for faster builds
    config.stats = 'errors-warnings';

    return config;
  },

  // External packages - not bundled, reduces bundle size and build time
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
    // Heavy server-side packages that don't need bundling
    'googleapis',
    'google-auth-library',
    '@react-pdf/renderer',
    'jspdf',
    'jspdf-autotable',
    'xlsx',
    'mailparser',
    'pg',
    // Crypto libraries
    '@safe-global/protocol-kit',
    'ethers',
  ],
};

module.exports = nextConfig;
