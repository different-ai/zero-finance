import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  transpilePackages: ["@screenpipe/js"],
  webpack: (config) => {
    return config;
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

export default nextConfig;
