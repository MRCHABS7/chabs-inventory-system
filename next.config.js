/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove static export - let Netlify handle it
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
