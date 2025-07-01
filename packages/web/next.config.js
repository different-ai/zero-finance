/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during build - we'll do it separately in CI
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production' ? false : true,
  },
  reactStrictMode: true,
  // Optimize for Vercel build memory limits and speed
  experimental: {
    webpackMemoryOptimizations: true,
    // Enable faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Optimize static generation
  output: 'standalone',
  // Reduce build overhead
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  webpack: (config, { webpack, isServer, dev }) => {
    // Skip expensive operations in development
    if (dev) {
      config.optimization.minimize = false;
    }

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
      new webpack.ContextReplacementPlugin(
        /web-worker/,
        (data) => {
          delete data.dependencies[0].critical;
          return data;
        }
      )
    );

    // Memory and speed optimizations for Vercel
    if (!isServer) {
      // Reduce bundle size and memory usage
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // Split large dependencies into separate chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'all',
            },
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
      // Faster builds with parallel processing
      minimizer: config.optimization.minimizer?.map((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.parallel = true;
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              ...minimizer.options.terserOptions?.compress,
              drop_console: process.env.NODE_ENV === 'production',
            },
          };
        }
        return minimizer;
      }),
    };

    // Faster resolution
    config.resolve.symlinks = false;
    
    return config;
  },
  serverExternalPackages: [
    'require-in-the-middle',
  ],
}

module.exports = nextConfig;