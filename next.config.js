/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // This will prevent the file watcher from scanning system directories
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: /System Volume Information/
    };
    return config;
  },
};

module.exports = nextConfig;
