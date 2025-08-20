
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
