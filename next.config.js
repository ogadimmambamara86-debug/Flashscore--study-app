
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = isProduction 
      ? `${process.env.VERCEL_URL || 'http://0.0.0.0:3000'}/api/sports-proxy`
      : 'http://0.0.0.0:5000';
    
    return [
      {
        source: '/api/sports/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  experimental: {
    esmExternals: true
  }
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = isProduction 
      ? `${process.env.VERCEL_URL || 'http://0.0.0.0:3000'}/api/sports-proxy`
      : 'http://0.0.0.0:5000';
    
    return [
      {
        source: '/api/sports/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  experimental: {
    esmExternals: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/predictions',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sports',
        destination: '/',
        permanent: true,
      }
    ];
  }
};

module.exports = nextConfig;
