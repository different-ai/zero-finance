/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Optimize for Vercel build memory limits
  experimental: {
    webpackMemoryOptimizations: true,
    cpus: 1, // Reduce parallelism to save memory
    workerThreads: false, // Disable worker threads to save memory
  },
  webpack: (config, { webpack, isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    };

    // Suppress the critical dependency warning from web-worker
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/web-worker/, (data) => {
        delete data.dependencies[0].critical;
        return data;
      }),
    );

    // Memory optimizations for Vercel
    if (!isServer) {
      // Reduce bundle size and memory usage
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // Split large dependencies into separate chunks
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

    // Limit memory usage during webpack compilation
    config.optimization = {
      ...config.optimization,
      minimize: process.env.NODE_ENV === 'production',
    };

    return config;
  },
  serverExternalPackages: [
    'require-in-the-middle',
    '@requestnetwork/request-client.js',
    '@requestnetwork/payment-processor',
    '@requestnetwork/epk-cipher',
    '@safe-global/protocol-kit',
    'pdf-parse',
    'googleapis',
    'google-auth-library',
  ],
};

module.exports = nextConfig;
