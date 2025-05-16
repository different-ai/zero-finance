/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
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
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: [
      'require-in-the-middle',
    ],
  },
}

// Only apply Sentry config if not running with Turbopack
if (!process.env.TURBOPACK) {
  const { withSentryConfig } = require("@sentry/nextjs");
  module.exports = withSentryConfig(
    nextConfig,
    {
      org: "different-ai-c6",
      project: "javascript-nextjs",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      disableLogger: true,
      automaticVercelMonitors: true,
    }
  );
} else {
  module.exports = nextConfig;
}
