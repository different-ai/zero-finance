/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['0.finance'],
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.next.json',
  },
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
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
  ],
};

module.exports = nextConfig;
