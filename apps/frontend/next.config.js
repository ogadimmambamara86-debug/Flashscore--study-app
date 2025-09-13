
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return [
      {
        source: '/api/sports-proxy/:path*',
        destination: isProduction 
          ? 'https://api.the-odds-api.com/:path*'
          : 'http://0.0.0.0:5000/api/sports-proxy/:path*'
      },
      {
        source: '/api/backend/:path*',
        destination: isProduction
          ? '/api/backend/:path*'
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
  }
};

module.exports = nextConfig;
