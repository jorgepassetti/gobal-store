/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ae-pic-a1.aliexpress-media.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
