/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: '/api/sports-proxy/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://api.the-odds-api.com/:path*'
          : 'http://0.0.0.0:5000/api/sports-proxy/:path*'
      },
      {
        source: '/api/backend/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.BACKEND_URL || 'http://0.0.0.0:5000'}/:path*`
          : 'http://0.0.0.0:5000/:path*'
      }
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '.*:3000'
          }
        ],
        destination: 'http://0.0.0.0:3001',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;