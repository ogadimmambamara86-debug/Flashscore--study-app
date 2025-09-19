// apps/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://flashstudy-ri0g.onrender.com/api/:path*', // Proxy API requests to Render backend
      },
    ];
  },
}

export default nextConfig