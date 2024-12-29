/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@screenpipe/js"],
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@screenpipe/js": isServer
                ? "@screenpipe/js/dist/node.js"
                : "@screenpipe/js/dist/browser.js",
        };
        return config;
    },
};

module.exports = nextConfig;
