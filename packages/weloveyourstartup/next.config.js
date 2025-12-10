const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.join(__dirname, '../../'),
  },
};

module.exports = nextConfig;
