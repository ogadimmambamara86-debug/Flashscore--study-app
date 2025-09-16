/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: '/api/sports-proxy/:path*',
        destination: 'https://api.the-odds-api.com/:path*'
      },
      {
        source: '/api/backend/:path*',
        destination: process.env.BACKEND_URL
          ? `${process.env.BACKEND_URL}/:path*`
          : 'http://localhost:5000/:path*'
      }
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;